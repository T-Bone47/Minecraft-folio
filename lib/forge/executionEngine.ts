/**
 * FRONTIER SYSTEMS FORGE — EXECUTION ENGINE
 * Deterministic pipeline simulator running fixtures through assembled graphs.
 */

import { FORGE_BLOCKS } from "./blockRegistry";
import { generateTelemetryFixtures } from "./fixtureRegistry";
import { validateForgeBlueprint } from "./graphValidator";
import type {
  ExecutionLogEntry,
  ExecutionTrace,
  ForgeBlueprint,
  InvariantResult,
  TelemetryPacketFixture,
} from "./types";

export function executeForgePipeline(
  blueprint: ForgeBlueprint,
  fixturePackets?: TelemetryPacketFixture[]
): ExecutionTrace {
  const validation = validateForgeBlueprint(blueprint);
  const packets = fixturePackets || generateTelemetryFixtures(100);

  const logs: ExecutionLogEntry[] = [];
  let stepCounter = 1;

  if (!validation.valid) {
    const errorIssues = validation.issues.filter((i) => i.severity === "error");
    return {
      success: false,
      totalEventsProcessed: 0,
      droppedEvents: 0,
      corruptedEventsHandled: 0,
      duplicateEventsDetected: 0,
      invariantsPassed: false,
      invariants: [
        {
          name: "GRAPH_TOPOLOGY_VALID",
          passed: false,
          message: errorIssues.map((e) => e.message).join("; "),
        },
      ],
      p50LatencyMs: 0,
      p99LatencyMs: 0,
      stepLogs: [
        {
          step: 1,
          nodeId: "validator",
          nodeName: "Topology Validator",
          eventType: "GRAPH_ERROR",
          status: "ERROR",
          message: errorIssues[0]?.message || "Graph validation failed",
          timestampMs: 0,
        },
      ],
      debriefSummary: `Pipeline execution halted: Graph validation encountered ${errorIssues.length} fatal structural errors.`,
      executedAt: new Date().toISOString(),
    };
  }

  // Check presence of key processing stages
  const hasValidator = blueprint.nodes.some((n) => n.blockType === "validator_schema");
  const hasDeduplicator = blueprint.nodes.some((n) => n.blockType === "deduplicator_lru");
  const hasTransformer = blueprint.nodes.some((n) => n.blockType === "transformer_canonical");
  const hasStorage = blueprint.nodes.some((n) => n.blockType === "storage_timescaledb");

  let corruptHandled = 0;
  let corruptLeaked = 0;
  let duplicatesDetected = 0;
  let duplicatesLeaked = 0;
  let totalProcessed = 0;

  const latenciesMs: number[] = [];
  const processedEvents: any[] = [];
  const lruCache = new Set<string>();

  for (const pkt of packets) {
    const t0 = performance.now();
    let current = { ...pkt };
    let dropped = false;

    // 1. Ingestion / Fault Stage
    logs.push({
      step: stepCounter++,
      nodeId: "source",
      nodeName: "Telemetry Ingestion",
      eventType: "RAW_FRAME",
      status: "OK",
      message: `Ingested packet ${pkt.id} [${pkt.speedKph} kph]`,
      timestampMs: pkt.sessionTimeMs,
    });

    // 2. Validator Stage
    if (hasValidator) {
      if (current.isCorrupt || current.speedKph > 380 || current.speedKph < 0) {
        corruptHandled++;
        dropped = true;
        logs.push({
          step: stepCounter++,
          nodeId: "validator",
          nodeName: "Schema & Boundary Guard",
          eventType: "CORRUPT_QUARANTINE",
          status: "WARN",
          message: `Quarantined corrupted packet ${current.id}: speed ${current.speedKph} kph out of bounds`,
          timestampMs: current.sessionTimeMs,
        });
      }
    } else {
      if (current.isCorrupt || current.speedKph > 380 || current.speedKph < 0) {
        corruptLeaked++;
        logs.push({
          step: stepCounter++,
          nodeId: "validator_missing",
          nodeName: "Unchecked Boundary",
          eventType: "CORRUPT_LEAK",
          status: "ERROR",
          message: `Corrupted packet ${current.id} leaked into pipeline without validation!`,
          timestampMs: current.sessionTimeMs,
        });
      }
    }

    // 3. Deduplicator Stage
    if (!dropped) {
      if (hasDeduplicator) {
        const cleanId = current.id.replace("-DUP", "");
        if (current.isDuplicate || lruCache.has(cleanId)) {
          duplicatesDetected++;
          dropped = true;
          logs.push({
            step: stepCounter++,
            nodeId: "dedup",
            nodeName: "LRU Deduplicator",
            eventType: "DUPLICATE_DROP",
            status: "OK",
            message: `Dropped retransmitted duplicate packet ${current.id}`,
            timestampMs: current.sessionTimeMs,
          });
        } else {
          lruCache.add(cleanId);
          if (lruCache.size > 200) {
            const first = lruCache.values().next().value;
            if (first) lruCache.delete(first);
          }
        }
      } else {
        if (current.isDuplicate) {
          duplicatesLeaked++;
          logs.push({
            step: stepCounter++,
            nodeId: "dedup_missing",
            nodeName: "Passthrough",
            eventType: "DUPLICATE_LEAK",
            status: "WARN",
            message: `Duplicate packet ${current.id} admitted without deduplication!`,
            timestampMs: current.sessionTimeMs,
          });
        }
      }
    }

    // 4. Transformer / Canonical Normalizer Stage
    if (!dropped && hasTransformer) {
      if (!hasValidator && (current.isCorrupt || current.speedKph > 380)) {
        logs.push({
          step: stepCounter++,
          nodeId: "transformer",
          nodeName: "Canonical Normalizer",
          eventType: "TRANSFORMER_EXCEPTION",
          status: "ERROR",
          message: `Transformer schema exception on packet ${current.id}: Value ${current.speedKph} violated Field(le=380.0)`,
          timestampMs: current.sessionTimeMs,
        });
      } else {
        processedEvents.push(current);
        totalProcessed++;
      }
    } else if (!dropped && !hasTransformer) {
      processedEvents.push(current);
      totalProcessed++;
    }

    const duration = Math.max(0.04, performance.now() - t0);
    latenciesMs.push(duration);
  }

  // Calculate latencies
  latenciesMs.sort((a, b) => a - b);
  const p50 = latenciesMs[Math.floor(latenciesMs.length * 0.5)] || 0.1;
  const p99 = latenciesMs[Math.floor(latenciesMs.length * 0.99)] || 0.45;

  // Invariant assertions
  const invariants: InvariantResult[] = [
    {
      name: "ZERO_CORRUPT_LEAKS",
      passed: corruptLeaked === 0,
      message:
        corruptLeaked === 0
          ? `All ${corruptHandled} corrupted packets safely quarantined.`
          : `CRITICAL: ${corruptLeaked} corrupted frames breached boundary!`,
    },
    {
      name: "DEDUPLICATION_INTEGRITY",
      passed: duplicatesLeaked === 0,
      message:
        duplicatesLeaked === 0
          ? `All ${duplicatesDetected} duplicate packets intercepted.`
          : `WARNING: ${duplicatesLeaked} duplicate packets stored.`,
    },
    {
      name: "LATENCY_BUDGET",
      passed: p99 < 2.0,
      message: `P50 latency: ${p50.toFixed(2)} ms, P99: ${p99.toFixed(2)} ms (Budget: < 2.0 ms)`,
    },
    {
      name: "PERSISTENCE_INTEGRITY",
      passed: hasStorage && totalProcessed > 0,
      message: hasStorage
        ? `Successfully committed ${totalProcessed} events to TimescaleDB.`
        : "Missing storage sink; events processed in memory only.",
    },
  ];

  const allPassed = invariants.every((i) => i.passed);

  return {
    success: allPassed,
    totalEventsProcessed: totalProcessed,
    droppedEvents: corruptHandled + duplicatesDetected,
    corruptedEventsHandled: corruptHandled,
    duplicateEventsDetected: duplicatesDetected,
    invariantsPassed: allPassed,
    invariants,
    p50LatencyMs: Math.round(p50 * 100) / 100,
    p99LatencyMs: Math.round(p99 * 100) / 100,
    stepLogs: logs.slice(0, 40), // Bounded sample for UI inspection
    debriefSummary: allPassed
      ? `Pipeline passed all engineering invariants. Successfully processed ${totalProcessed} events at P50 ${p50.toFixed(2)} ms with zero schema corruptions or duplicate leaks.`
      : `Pipeline failed 1 or more engineering invariants. Corrupt leaks: ${corruptLeaked}, Duplicate leaks: ${duplicatesLeaked}. Review debrief to repair architecture.`,
    executedAt: new Date().toISOString(),
  };
}


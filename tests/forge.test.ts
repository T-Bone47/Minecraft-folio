import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { FORGE_BLOCKS } from "../lib/forge/blockRegistry";
import { PRESET_BLUEPRINTS, serializeBlueprint, parseBlueprint } from "../lib/forge/blueprintSerializer";
import { validateForgeBlueprint } from "../lib/forge/graphValidator";
import { executeForgePipeline } from "../lib/forge/executionEngine";
import { generateTelemetryFixtures } from "../lib/forge/fixtureRegistry";

describe("Frontier Systems Forge", () => {
  it("defines all 10 core modular architecture blocks", () => {
    const requiredTypes = [
      "source_f1_udp",
      "source_openf1",
      "validator_schema",
      "deduplicator_lru",
      "ordering_buffer",
      "transformer_canonical",
      "analytics_wear",
      "storage_timescaledb",
      "monitor_invariant",
      "fault_injector_packet",
    ];

    for (const type of requiredTypes) {
      assert.ok(FORGE_BLOCKS[type], `Missing block type: ${type}`);
      assert.ok(FORGE_BLOCKS[type].outputPorts.length > 0 || FORGE_BLOCKS[type].inputPorts.length > 0);
    }
  });

  it("graph validator validates gold standard DAG and detects cycles", () => {
    const goldResult = validateForgeBlueprint(PRESET_BLUEPRINTS.gold_standard_telemetry);
    assert.equal(goldResult.valid, true, "Gold standard blueprint must be structurally valid");
    assert.equal(goldResult.issues.filter((i) => i.severity === "error").length, 0);

    // Create cyclical blueprint
    const cyclicBlueprint = {
      id: "cyclic",
      name: "Cyclic Blueprint",
      description: "Invalid cycle",
      nodes: [
        { id: "a", blockType: "source_f1_udp", x: 0, y: 0, config: {} },
        { id: "b", blockType: "validator_schema", x: 0, y: 0, config: {} },
      ],
      edges: [
        { id: "e1", sourceNodeId: "a", sourcePortId: "out_raw", targetNodeId: "b", targetPortId: "in_raw" },
        { id: "e2", sourceNodeId: "b", sourcePortId: "out_validated", targetNodeId: "a", targetPortId: "in_raw" },
      ],
    };

    const cycleResult = validateForgeBlueprint(cyclicBlueprint as any);
    assert.equal(cycleResult.valid, false, "Cyclic graph must be rejected");
    assert.ok(cycleResult.issues.some((i) => i.code === "CYCLE_DETECTED" || i.code === "INVALID_TARGET_PORT"));
  });

  it("deterministic execution engine passes all invariants on gold standard pipeline", () => {
    const fixtures = generateTelemetryFixtures(100);
    const trace = executeForgePipeline(PRESET_BLUEPRINTS.gold_standard_telemetry, fixtures);

    assert.equal(trace.success, true, "Gold standard pipeline must pass all invariants");
    assert.ok(trace.corruptedEventsHandled > 0, "Corrupt frames must be quarantined");
    assert.ok(trace.duplicateEventsDetected > 0, "Duplicate packets must be dropped");
    assert.equal(trace.invariants.find((i) => i.name === "ZERO_CORRUPT_LEAKS")?.passed, true);
    assert.equal(trace.invariants.find((i) => i.name === "DEDUPLICATION_INTEGRITY")?.passed, true);
    assert.ok(trace.p50LatencyMs < 1.0, "P50 latency must be sub-millisecond");
  });

  it("blueprint serialization and deserialization roundtrips safely", () => {
    const gold = PRESET_BLUEPRINTS.gold_standard_telemetry;
    const jsonStr = serializeBlueprint(gold);
    assert.ok(jsonStr.includes("gold_standard_telemetry"));

    const { blueprint, error } = parseBlueprint(jsonStr);
    assert.equal(error, undefined);
    assert.ok(blueprint);
    assert.equal(blueprint.nodes.length, gold.nodes.length);
    assert.equal(blueprint.edges.length, gold.edges.length);
  });
});


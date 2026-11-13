import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CHAOS_SCENARIOS,
  evaluateChaosState,
  generateChaosLogs,
  RING_BUFFER_CAPACITY,
} from "../lib/chaos/chaosEngine";

describe("Browser Chaos & Stress-Test Lab Engine", () => {
  it("declares all 4 pre-configured failure scenarios", () => {
    assert.equal(CHAOS_SCENARIOS.length, 4);
    for (const scenario of CHAOS_SCENARIOS) {
      assert.ok(scenario.id.length > 0);
      assert.ok(scenario.name.length > 0);
      assert.ok(scenario.params.eventRate >= 1000);
      assert.ok(scenario.expectedDefense.length > 0);
      assert.ok(scenario.invariantValidated.length > 0);
    }
  });

  it("nominal state preserves low latency and bounded memory", () => {
    const nominal = evaluateChaosState({
      eventRate: 1000,
      latencyMs: 12,
      packetDropPct: 0,
      cpuDelayMs: 0,
    });

    assert.equal(nominal.eventsPerSecond, 1000);
    assert.ok(nominal.p99LatencyMs < 30);
    assert.equal(nominal.dropRatePct, 0);
    assert.equal(nominal.recoveryStatus, "NORMAL");
    assert.ok(nominal.heapAllocatedMb <= 30);
    assert.equal(nominal.invariants.boundedMemory, true);
    assert.equal(nominal.invariants.monotonicTime, true);
  });

  it("extreme burst flood (10,000 eps) preserves bounded memory invariant <= 48MB", () => {
    const burst = evaluateChaosState({
      eventRate: 10000,
      latencyMs: 15,
      packetDropPct: 0,
      cpuDelayMs: 2,
    });

    assert.equal(burst.eventsPerSecond, 10000);
    assert.equal(burst.recoveryStatus, "CRITICAL_BURST");
    assert.ok(burst.heapAllocatedMb <= 48.0, `Heap was ${burst.heapAllocatedMb}MB, must be <= 48MB`);
    assert.ok(burst.ringBufferUsagePct <= 100);
    assert.equal(burst.invariants.boundedMemory, true);
    assert.equal(burst.invariants.monotonicTime, true);
    assert.equal(burst.invariants.zeroNanKinematics, true);
  });

  it("generates structured log messages reflecting current fault defense", () => {
    const metrics = evaluateChaosState({
      eventRate: 8500,
      latencyMs: 350,
      packetDropPct: 10,
      cpuDelayMs: 8,
    });
    const logs = generateChaosLogs(metrics, "Safety Car Backpressure Storm");
    assert.ok(logs.length >= 3);
    assert.ok(logs.some((l) => l.includes("Safety Car Backpressure Storm")));
    assert.ok(logs.some((l) => l.includes("SYS_MONITOR") || l.includes("CHAOS_STRESS")));
  });
});


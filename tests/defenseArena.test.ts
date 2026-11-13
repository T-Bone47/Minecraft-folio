import test from "node:test";
import assert from "node:assert/strict";

import {
  getAllDefenseTracks,
  getDefenseTrack,
  getDefaultParameters,
  executeDefenseTrack,
} from "../lib/defense/scenarioRegistry";
import { runSystemsReliabilitySimulation } from "../lib/defense/scenarios/systemsReliability";
import { runMotorsportLapDeltaSimulation } from "../lib/defense/scenarios/motorsportLapDelta";
import { runModelLeakageSimulation } from "../lib/defense/scenarios/modelLeakage";
import { runCounterfactualComparison } from "../lib/defense/counterfactualEngine";
import { buildDefenseTraceSpans } from "../lib/defense/defenseTraceBridge";

test("Defense Arena — Registry contains all 3 canonical defense tracks", () => {
  const tracks = getAllDefenseTracks();
  assert.strictEqual(tracks.length, 3);

  const ids = tracks.map((t) => t.id);
  assert.ok(ids.includes("systems-reliability"));
  assert.ok(ids.includes("motorsport-lap-delta"));
  assert.ok(ids.includes("aiml-model-leakage"));

  for (const track of tracks) {
    assert.ok(track.parameters.length >= 3, `Track ${track.id} must have >= 3 parameters`);
    assert.ok(track.hypotheses.length >= 2, `Track ${track.id} must have >= 2 hypotheses`);
    assert.ok(track.review.problemContext.length > 0, `Track ${track.id} must have technical review`);
    assert.ok(track.review.tradeoffsAndCompromises.length >= 2);
  }
});

test("Defense Arena Track 1: Systems Reliability — executes and verifies stream invariants", () => {
  // Baseline run with recommended sliding window
  const defaults = getDefaultParameters("systems-reliability");
  const result = runSystemsReliabilitySimulation(defaults);

  assert.strictEqual(result.trackId, "systems-reliability");
  assert.ok(result.metrics.length >= 4);
  assert.ok(result.invariants.length >= 4);
  assert.strictEqual(result.passed, true);

  const monotonicInv = result.invariants.find((i) => i.id === "INV_MONOTONIC_SEQUENCE");
  const dedupInv = result.invariants.find((i) => i.id === "INV_ZERO_DUPLICATES");
  assert.ok(monotonicInv?.passed);
  assert.ok(dedupInv?.passed);

  // High fault rate + strict barrier should cause p99 latency violation
  const stressedResult = runSystemsReliabilitySimulation({
    faultRatePercent: 25,
    recoveryPolicy: "strict-barrier",
    barrierTimeoutMs: 30,
  });

  const latencyInv = stressedResult.invariants.find((i) => i.id === "INV_BOUNDED_LATENCY");
  assert.ok(latencyInv);
  assert.strictEqual(latencyInv.passed, false, "Strict barrier under 25% faults should violate p99 latency SLA");
});

test("Defense Arena Track 2: Motorsport Lap Delta — checks spatial monotonicity and apex clipping", () => {
  // Baseline 10m resolution with Monotone PCHIP
  const fineResult = runMotorsportLapDeltaSimulation({
    samplingResolutionMeters: 10,
    splineMethod: "monotone-pchip",
  });

  assert.strictEqual(fineResult.passed, true);
  const integralInv = fineResult.invariants.find((i) => i.id === "INV_INTEGRAL_CONVERGENCE");
  assert.ok(integralInv?.passed);

  // Coarse 50m resolution should violate apex speed accuracy
  const coarseResult = runMotorsportLapDeltaSimulation({
    samplingResolutionMeters: 50,
    splineMethod: "linear",
  });

  const apexInv = coarseResult.invariants.find((i) => i.id === "INV_APEX_SPEED_ACCURACY");
  assert.ok(apexInv);
  assert.strictEqual(apexInv.passed, false, "50m coarse resolution should fail apex speed accuracy in tight turns");
});

test("Defense Arena Track 3: AI/ML Model Evaluation — catches temporal leakage and lookahead traps", () => {
  // Clean temporal split
  const cleanResult = runModelLeakageSimulation({
    splitStrategy: "temporal-session-split",
    includeLookaheadPitFlag: "no-clean",
  });

  assert.strictEqual(cleanResult.passed, true);
  const temporalInv = cleanResult.invariants.find((i) => i.id === "INV_ZERO_TEMPORAL_LEAKAGE");
  assert.ok(temporalInv?.passed);

  // Catastrophic lookahead transponder leakage
  const leakedResult = runModelLeakageSimulation({
    splitStrategy: "temporal-session-split",
    includeLookaheadPitFlag: "yes-leaked",
  });

  assert.strictEqual(leakedResult.passed, false);
  const leakedTemporalInv = leakedResult.invariants.find((i) => i.id === "INV_ZERO_TEMPORAL_LEAKAGE");
  const leakedGapInv = leakedResult.invariants.find((i) => i.id === "INV_GENERALIZATION_GAP");
  assert.strictEqual(leakedTemporalInv?.passed, false);
  assert.strictEqual(leakedGapInv?.passed, false);
});

test("Defense Arena — Counterfactual Engine computes meaningful metric deltas and invariant transitions", () => {
  const comparison = runCounterfactualComparison(
    "systems-reliability",
    { faultRatePercent: 5, recoveryPolicy: "sliding-window-dedup" },
    { faultRatePercent: 25, recoveryPolicy: "strict-barrier", barrierTimeoutMs: 30 }
  );

  assert.strictEqual(comparison.trackId, "systems-reliability");
  assert.ok(comparison.invariantsBroken.length > 0, "Should detect broken invariants in counterfactual");
  assert.ok(comparison.conclusion.length > 0);
  assert.ok(comparison.metricDeltas.p99Latency);
});

test("Defense Arena — Frontier X-Ray Bridge generates causal trace spans", () => {
  const defaults = getDefaultParameters("motorsport-lap-delta");
  const result = executeDefenseTrack("motorsport-lap-delta", defaults);
  const spans = buildDefenseTraceSpans(result);

  assert.ok(spans.length >= 4);
  const root = spans.find((s) => s.parentSpanId === null);
  assert.ok(root, "Must have root span");
  assert.strictEqual(root.name, "defense.experiment.motorsport-lap-delta");
  assert.strictEqual(root.provenance, "ACTUAL_RECORDED_EXECUTION");
});

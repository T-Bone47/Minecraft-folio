import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SCHEMA_VERSION,
  CANONICAL_UNITS,
  validateTelemetrySchema,
  computeLapSummary,
  createLapRecord,
} from "@/lib/digitalTwin/telemetrySchema";
import {
  analyzeCorners,
  solveDistanceAlignedDeltas,
  analyzeSectors,
  generateActionableInsights,
  performCompleteLapAnalysis,
} from "@/lib/digitalTwin/analysis";
import {
  PRESET_SCENARIOS,
  simulateWhatIfScenario,
} from "@/lib/digitalTwin/decisionEngine";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";
import { generateReference } from "@/lib/frontier/drive";

test("telemetry schema v2 enforces strict canonical units and type guards", () => {
  assert.equal(SCHEMA_VERSION, 2);
  assert.equal(CANONICAL_UNITS.speed, "m/s");
  assert.equal(CANONICAL_UNITS.time, "s");
  assert.equal(CANONICAL_UNITS.distance, "m");
  assert.equal(CANONICAL_UNITS.steering, "rad");

  // Valid schema check
  const rawRef = generateReference();
  const validRecord = createLapRecord(rawRef.state, rawRef.samples, "reference");
  const validation = validateTelemetrySchema(validRecord);
  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);

  // Invalid payload checks
  assert.equal(validateTelemetrySchema(null).valid, false);
  assert.equal(validateTelemetrySchema({}).valid, false);
  assert.equal(validateTelemetrySchema({ schemaVersion: 99 }).valid, false);
});

test("computeLapSummary derives accurate kinematic statistics from sample array", () => {
  const rawRef = generateReference();
  const summary = computeLapSummary(rawRef.state, rawRef.samples);

  assert.ok(summary.topSpeedKmh > 30 && summary.topSpeedKmh < 350);
  assert.ok(summary.avgSpeedKmh > 20 && summary.avgSpeedKmh <= summary.topSpeedKmh);
  assert.ok(summary.minSpeedKmh >= 0);
  assert.equal(summary.sampleCount, rawRef.samples.length);
  assert.equal(summary.valid, true);
});

test("corner segmentation detects Turns 1-4 with entry, apex, and exit speeds", () => {
  const rawRef = generateReference();
  const corners = analyzeCorners(rawRef.samples, rawRef.samples);

  assert.equal(corners.length, 4);
  assert.equal(corners[0].cornerIndex, 1);
  assert.equal(corners[1].cornerIndex, 2);
  assert.equal(corners[2].cornerIndex, 3);
  assert.equal(corners[3].cornerIndex, 4);

  for (const c of corners) {
    assert.ok(c.approachSpeedKmh > 0, `${c.name} approach speed must be positive`);
    assert.ok(c.apexSpeedKmh > 0, `${c.name} apex speed must be positive`);
    assert.ok(c.exitSpeedKmh > 0, `${c.name} exit speed must be positive`);
    assert.ok(c.segmentDurationS > 0, `${c.name} duration must be positive`);
  }
});

test("distance-aligned delta solver eliminates temporal skew across 100 spatial bins", () => {
  const rawRef = generateReference();
  const points = solveDistanceAlignedDeltas(rawRef.samples, rawRef.samples, 100);

  assert.equal(points.length, 101);
  assert.equal(points[0].progress, 0);
  assert.equal(points[100].progress, 1);

  // Identity comparison against itself must produce near-zero deltas
  for (const pt of points) {
    assert.ok(Math.abs(pt.timeDeltaS) < 0.05, `Delta at progress ${pt.progress} should be ~0`);
    assert.ok(pt.visitorSpeedKmh >= 0);
    assert.ok(pt.distanceM >= 0);
  }
});

test("sector analysis accurately computes sector deltas and percentage differences", () => {
  const visitorSectors = [18.5, 18.2, 19.0, 18.1];
  const refSectors = [18.0, 18.0, 18.0, 18.0];

  const results = analyzeSectors(visitorSectors, refSectors);
  assert.equal(results.length, 4);
  assert.equal(results[0].deltaS, 0.5);
  assert.equal(results[0].status, "slower");
  assert.ok(results[0].percentageDiff > 0);
});

test("actionable engineering insights generate grounded recommendations", () => {
  const rawRef = generateReference();
  const corners = analyzeCorners(rawRef.samples, rawRef.samples);
  const sectors = analyzeSectors(rawRef.state.sectors, rawRef.state.sectors);

  const insights = generateActionableInsights(corners, sectors, 0, 0);
  assert.ok(insights.length >= 1);
  assert.equal(insights[0].category, "overall");
});

test("what-if decision engine computes deterministic trade-offs without mutating base lap", () => {
  const rawRef = generateReference();
  const baseLap = createLapRecord(rawRef.state, rawRef.samples, "visitor");
  const originalTime = baseLap.state.time;
  const originalSamplesCount = baseLap.samples.length;

  for (const scenario of PRESET_SCENARIOS) {
    const outcome = simulateWhatIfScenario(baseLap, scenario);

    assert.ok(Number.isFinite(outcome.predictedLapTimeS));
    assert.ok(Number.isFinite(outcome.deltaS));
    assert.ok(outcome.assumptions.length >= 1);
    assert.ok(outcome.tradeOffs.length >= 1);
    assert.equal(outcome.hypotheticalLap.source, "hypothetical");
    assert.equal(outcome.hypotheticalLap.provenanceLabel, "HYPOTHETICAL ENGINEERING SCENARIO");

    // Integrity: base lap must not have mutated
    assert.equal(baseLap.state.time, originalTime);
    assert.equal(baseLap.samples.length, originalSamplesCount);
    assert.equal(baseLap.source, "visitor");
  }
});

test("digital twin coordinator store manages session lifecycle and recruiter walkthrough", () => {
  const store = useDigitalTwinStore.getState();

  // 1. Initial State
  assert.ok(store.referenceLap);
  assert.equal(store.missionStep, "DRIVE_OR_LOAD");

  // 2. Load Bundled Benchmark Session
  store.loadBundledReferenceLap();
  const loaded = useDigitalTwinStore.getState().recordedLap;
  assert.ok(loaded);
  assert.equal(loaded.source, "visitor");
  assert.equal(useDigitalTwinStore.getState().missionStep, "INGEST_PIPELINE");

  // 3. Apply What-If Scenario
  store.applyWhatIfScenario(PRESET_SCENARIOS[0]);
  const whatIf = useDigitalTwinStore.getState().whatIfResult;
  assert.ok(whatIf);
  assert.equal(whatIf.category, "braking");

  // 4. Recruiter Walkthrough State Machine
  store.startRecruiterWalkthrough();
  assert.equal(useDigitalTwinStore.getState().recruiterWalkthrough.active, true);
  assert.equal(useDigitalTwinStore.getState().recruiterWalkthrough.step, 0);

  store.nextRecruiterStep();
  assert.equal(useDigitalTwinStore.getState().recruiterWalkthrough.step, 1);

  store.exitRecruiterWalkthrough();
  assert.equal(useDigitalTwinStore.getState().recruiterWalkthrough.active, false);
});

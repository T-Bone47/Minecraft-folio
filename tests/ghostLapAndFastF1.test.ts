import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MONZA_2024_PROFILE,
  SILVERSTONE_2024_PROFILE,
  computeTelemetryCorrelation,
} from "../lib/digitalTwin/fastF1Telemetry";
import {
  getGhostLapReference,
  sampleGhostCarAtProgress,
  computeGhostLapDelta,
} from "../lib/digitalTwin/ghostLapEngine";

describe("Ghost Lap & FastF1 Real Telemetry Engine", () => {
  it("FastF1 profiles declare authoritative Grand Prix metadata and key corners", () => {
    for (const profile of [MONZA_2024_PROFILE, SILVERSTONE_2024_PROFILE]) {
      assert.ok(profile.circuitName.length > 0);
      assert.equal(profile.season, 2024);
      assert.ok(profile.driver.length > 0);
      assert.ok(profile.referenceLapSeconds > 60);
      assert.ok(profile.trackLengthMeters > 5000);
      assert.ok(profile.keyCorners.length >= 6);
      assert.ok(profile.telemetrySamples.length >= 10);
    }
  });

  it("calculates high correlation (R^2 > 0.92) against real Formula 1 telemetry", () => {
    const ref = getGhostLapReference();
    assert.ok(ref.samples.length > 0, "Reference lap samples must exist");

    const monzaCorr = computeTelemetryCorrelation(ref.samples, MONZA_2024_PROFILE);
    assert.ok(monzaCorr.rSquared >= 0.92, `Monza R^2 was ${monzaCorr.rSquared}, expected >= 0.92`);
    assert.ok(monzaCorr.pearsonR >= 0.95);
    assert.equal(monzaCorr.spatialDataPoints.length, 51);

    const silverstoneCorr = computeTelemetryCorrelation(ref.samples, SILVERSTONE_2024_PROFILE);
    assert.ok(silverstoneCorr.rSquared >= 0.92);
  });

  it("ghost car samples smooth kinematic coordinates along the circuit without NaNs", () => {
    for (const p of [0.0, 0.25, 0.5, 0.75, 1.0]) {
      const ghost = sampleGhostCarAtProgress(p);
      assert.ok(!Number.isNaN(ghost.x), `x must not be NaN at p=${p}`);
      assert.ok(!Number.isNaN(ghost.z), `z must not be NaN at p=${p}`);
      assert.ok(!Number.isNaN(ghost.yaw), `yaw must not be NaN at p=${p}`);
      assert.ok(!Number.isNaN(ghost.speed), `speed must not be NaN at p=${p}`);

      const radius = Math.hypot(ghost.x, ghost.z);
      assert.ok(radius >= 40 && radius <= 50, `Ghost car radius ${radius} must stay on circuit`);
    }
  });

  it("computes accurate signed ghost lap delta for ahead and behind conditions", () => {
    const ghostSample = sampleGhostCarAtProgress(0.5);

    // Case 1: Player is faster than ghost -> Ahead (negative delta)
    const faster = computeGhostLapDelta(ghostSample.time - 0.75, 0.5, 15);
    assert.equal(faster.isAhead, true);
    assert.equal(faster.formattedDelta, "-0.75s");

    // Case 2: Player is slower than ghost -> Behind (positive delta)
    const slower = computeGhostLapDelta(ghostSample.time + 1.25, 0.5, 10);
    assert.equal(slower.isAhead, false);
    assert.equal(slower.formattedDelta, "+1.25s");
  });
});

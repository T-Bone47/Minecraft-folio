import test from "node:test";
import assert from "node:assert/strict";
import {
  MONZA_DEFAULT_ENVIRONMENT,
  CANONICAL_STRATEGY_PLANS,
  runMonteCarloRaceSimulation,
} from "../lib/strategy/monteCarloStrategyEngine";
import { simulateStrategyLaps } from "../lib/strategy/tireDegradationModel";

test("Race Strategy: simulateStrategyLaps models fuel burn-off and tire degradation", () => {
  const plan = CANONICAL_STRATEGY_PLANS[0]; // 1-Stop Med -> Hard
  const laps = simulateStrategyLaps(plan.stints, MONZA_DEFAULT_ENVIRONMENT);

  assert.strictEqual(laps.length, 53, "Must simulate 53 laps for Monza");

  // Fuel correction must become progressively more negative (lighter car = faster)
  assert.strictEqual(laps[0].fuelCorrectionSec, 0.0);
  assert.ok(laps[52].fuelCorrectionSec < -3.0, "Fuel correction on lap 53 must save > 3.0 seconds");

  // Pit stop check on lap 26
  assert.strictEqual(laps[25].isPitInLap, true, "Lap 26 must be pit-in lap");
  assert.strictEqual(laps[25].pitLossSec, 22.5, "Pit loss must be 22.5s");

  // Cumulative time is strictly monotonically increasing
  for (let i = 1; i < laps.length; i++) {
    assert.ok(laps[i].cumulativeTimeSec > laps[i - 1].cumulativeTimeSec, "Cumulative time must be strictly increasing");
  }
});

test("Race Strategy: Soft compound has faster initial pace but degrades faster than Hard", () => {
  const softStint = [{ compound: "soft" as const, startLap: 1, endLap: 25 }];
  const hardStint = [{ compound: "hard" as const, startLap: 1, endLap: 25 }];

  const softLaps = simulateStrategyLaps(softStint, MONZA_DEFAULT_ENVIRONMENT);
  const hardLaps = simulateStrategyLaps(hardStint, MONZA_DEFAULT_ENVIRONMENT);

  // Lap 1: Soft is faster
  assert.ok(softLaps[0].rawPaceSec < hardLaps[0].rawPaceSec, "Soft tire raw pace must be faster on lap 1");

  // Lap 22: Soft has hit the cliff, degradation must be higher than hard
  assert.ok(
    softLaps[21].tireDegradationSec > hardLaps[21].tireDegradationSec,
    "Soft tire degradation on lap 22 must exceed Hard tire degradation"
  );
});

test("Race Strategy: Monte Carlo simulation produces deterministic statistical distribution", () => {
  for (const strategy of CANONICAL_STRATEGY_PLANS) {
    const summary = runMonteCarloRaceSimulation(strategy, MONZA_DEFAULT_ENVIRONMENT, 100);

    assert.strictEqual(summary.strategyId, strategy.id);
    assert.ok(!Number.isNaN(summary.deterministicTotalTimeSec), "Deterministic time must not be NaN");
    assert.ok(!Number.isNaN(summary.stochasticMeanTimeSec), "Stochastic mean time must not be NaN");
    assert.ok(summary.stochasticStdDevSec > 0, "Stochastic standard deviation must be positive");
    assert.ok(summary.stochasticBestTimeSec <= summary.stochasticMeanTimeSec, "Best time must be <= mean");
    assert.ok(summary.stochasticWorstTimeSec >= summary.stochasticMeanTimeSec, "Worst time must be >= mean");
    assert.ok(summary.winProbabilityPct >= 5 && summary.winProbabilityPct <= 95, "Win probability must be bounded [5, 95]");
    assert.strictEqual(summary.pitStopsCount, strategy.stints.length - 1);
  }
});

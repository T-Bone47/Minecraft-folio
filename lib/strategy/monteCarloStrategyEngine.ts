import {
  RaceStrategyPlan,
  StrategyEnvironment,
  MonteCarloSimulationSummary,
} from "./types";
import { simulateStrategyLaps } from "./tireDegradationModel";

export const MONZA_DEFAULT_ENVIRONMENT: StrategyEnvironment = {
  trackName: "Autodromo Nazionale Monza (53 Laps)",
  totalLaps: 53,
  basePaceSec: 83.2, // ~1:23.200 baseline race pace
  pitLaneLossSec: 22.5, // Standard green flag pit delta
  vscPitLossSec: 13.5, // Cheap pit stop delta under Virtual Safety Car
  trackTempCelsius: 38.0, // Hot summer asphalt
  safetyCarProbabilityPerLap: 0.024, // ~2.4% chance of SC deployment per lap
};

export const CANONICAL_STRATEGY_PLANS: RaceStrategyPlan[] = [
  {
    id: "1_stop_med_hard",
    name: "1-Stop: Medium → Hard",
    tagline: "The Monza Textbook Baseline · Low Risk & Predictable Track Position",
    description: "Start on Mediums to survive initial Turn 1 chaos, extend to Lap 25-28, then bolt on durable Hards to the chequered flag. Standard strategy for high thermal tracks.",
    stints: [
      { compound: "medium", startLap: 1, endLap: 26 },
      { compound: "hard", startLap: 27, endLap: 53 },
    ],
  },
  {
    id: "2_stop_soft_med_soft",
    name: "2-Stop: Soft → Medium → Soft",
    tagline: "High-Pace Sprint Aggression · Pure Undercut Threat",
    description: "Exploits peak mechanical grip of Soft compound at the start and finish. Sacrifices an additional 22.5s pit loss, requiring driver to maintain qualifying-like pace in clean air.",
    stints: [
      { compound: "soft", startLap: 1, endLap: 16 },
      { compound: "medium", startLap: 17, endLap: 35 },
      { compound: "soft", startLap: 36, endLap: 53 },
    ],
  },
  {
    id: "1_stop_hard_soft",
    name: "1-Stop Reverse: Hard → Soft",
    tagline: "Late Race Charge · Safety Car Opportunist",
    description: "Start on durable Hards in dirty air, extend deep into the Grand Prix (Lap 34+), and attack with fresh Softs on low fuel in the closing 18 laps.",
    stints: [
      { compound: "hard", startLap: 1, endLap: 34 },
      { compound: "soft", startLap: 35, endLap: 53 },
    ],
  },
  {
    id: "2_stop_soft_hard_med",
    name: "2-Stop Compromise: Soft → Hard → Medium",
    tagline: "Flexible Mid-Stint · Defensive Undercut Coverage",
    description: "Aggressive start on Softs, long stabilizing middle stint on Hards, finishing with high tire grip on Mediums for late overtakes.",
    stints: [
      { compound: "soft", startLap: 1, endLap: 14 },
      { compound: "hard", startLap: 15, endLap: 37 },
      { compound: "medium", startLap: 38, endLap: 53 },
    ],
  },
];

/**
 * Runs a deterministic pace simulation plus a 300-iteration Monte Carlo
 * stochastic simulation with Virtual Safety Car and full Safety Car deployments.
 */
export function runMonteCarloRaceSimulation(
  strategy: RaceStrategyPlan,
  env: StrategyEnvironment = MONZA_DEFAULT_ENVIRONMENT,
  iterations: number = 300
): MonteCarloSimulationSummary {
  // 1. Deterministic baseline
  const lapsData = simulateStrategyLaps(strategy.stints, env);
  const deterministicTotalTimeSec = lapsData[lapsData.length - 1].cumulativeTimeSec;

  const totalMin = Math.floor(deterministicTotalTimeSec / 60);
  const remainingSec = (deterministicTotalTimeSec % 60).toFixed(2);
  const deterministicTotalTimeFormatted = `${totalMin}m ${remainingSec}s`;

  // 2. Monte Carlo stochastic runs
  const totalTimes: number[] = [];

  // Seeded pseudo-random generator for reproducibility
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let iter = 0; iter < iterations; iter++) {
    let raceTime = 0.0;
    let safetyCarActive = false;
    let safetyCarLapsRemaining = 0;

    for (let lap = 1; lap <= env.totalLaps; lap++) {
      const baseLap = lapsData[lap - 1];
      let lapTime = baseLap.netLapTimeSec;

      // Trigger safety car event
      if (!safetyCarActive && pseudoRandom() < env.safetyCarProbabilityPerLap) {
        safetyCarActive = true;
        // SC lasts 3 to 5 laps
        safetyCarLapsRemaining = Math.floor(pseudoRandom() * 3) + 3;
      }

      if (safetyCarActive) {
        // Delta time under safety car is capped (+32s per lap)
        lapTime = env.basePaceSec + 32.0;

        // If this lap is a pit stop lap under safety car, gain cheap pit delta
        if (baseLap.isPitInLap) {
          const discount = env.pitLaneLossSec - env.vscPitLossSec;
          lapTime -= discount;
        }

        safetyCarLapsRemaining--;
        if (safetyCarLapsRemaining <= 0) {
          safetyCarActive = false;
        }
      } else {
        // Normal stochastic variance (+/- 0.25s driver pace noise)
        const driverNoise = (pseudoRandom() - 0.5) * 0.5;
        lapTime += driverNoise;
      }

      raceTime += lapTime;
    }

    totalTimes.push(Number(raceTime.toFixed(2)));
  }

  // Calculate statistics
  totalTimes.sort((a, b) => a - b);
  const sum = totalTimes.reduce((acc, t) => acc + t, 0);
  const stochasticMeanTimeSec = Number((sum / iterations).toFixed(2));

  const variance = totalTimes.reduce((acc, t) => acc + Math.pow(t - stochasticMeanTimeSec, 2), 0) / iterations;
  const stochasticStdDevSec = Number(Math.sqrt(variance).toFixed(2));
  const stochasticBestTimeSec = totalTimes[0];
  const stochasticWorstTimeSec = totalTimes[totalTimes.length - 1];

  // Benchmark win probability against standard 1-stop (around ~4480s)
  // Faster mean race time yields higher win probability
  const benchmarkTime = 4485.0;
  const timeDelta = benchmarkTime - stochasticMeanTimeSec;
  const winProbabilityPct = Math.min(95, Math.max(5, Math.round(50 + timeDelta * 1.8)));

  return {
    strategyId: strategy.id,
    strategyName: strategy.name,
    deterministicTotalTimeSec,
    deterministicTotalTimeFormatted,
    stochasticMeanTimeSec,
    stochasticStdDevSec,
    stochasticBestTimeSec,
    stochasticWorstTimeSec,
    winProbabilityPct,
    pitStopsCount: strategy.stints.length - 1,
    lapsData,
  };
}


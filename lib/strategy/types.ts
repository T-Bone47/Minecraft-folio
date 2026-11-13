export type TireCompound = "soft" | "medium" | "hard" | "intermediate" | "wet";

export interface StintPlan {
  compound: TireCompound;
  startLap: number;
  endLap: number; // inclusive
}

export interface RaceStrategyPlan {
  id: string;
  name: string;
  tagline: string;
  stints: StintPlan[];
  description: string;
}

export interface LapPaceDataPoint {
  lap: number;
  compound: TireCompound;
  tireAge: number;
  rawPaceSec: number;
  tireDegradationSec: number;
  fuelCorrectionSec: number;
  isPitInLap: boolean;
  pitLossSec: number;
  netLapTimeSec: number;
  netLapTimeFormatted: string;
  cumulativeTimeSec: number;
}

export interface MonteCarloSimulationSummary {
  strategyId: string;
  strategyName: string;
  deterministicTotalTimeSec: number;
  deterministicTotalTimeFormatted: string;
  stochasticMeanTimeSec: number;
  stochasticStdDevSec: number;
  stochasticBestTimeSec: number;
  stochasticWorstTimeSec: number;
  winProbabilityPct: number;
  pitStopsCount: number;
  lapsData: LapPaceDataPoint[];
}

export interface StrategyEnvironment {
  trackName: string;
  totalLaps: number;
  basePaceSec: number; // e.g. 82.5s for Monza
  pitLaneLossSec: number; // 22.5s under green
  vscPitLossSec: number; // 13.5s under VSC
  trackTempCelsius: number; // 25°C - 50°C
  safetyCarProbabilityPerLap: number; // e.g. 0.025
}


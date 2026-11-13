import { TireCompound, StrategyEnvironment, LapPaceDataPoint, StintPlan } from "./types";

export interface CompoundCoefficients {
  paceOffsetSec: number;     // Delta to Medium on lap 1 (negative = faster)
  degAlpha: number;          // Degradation scale factor
  degBeta: number;           // Degradation exponent (non-linear wear cliff)
  thermalSensitivity: number; // Penalty multiplier per °C above 35°C
  cliffLapThreshold: number; // Lap age where degradation spikes
}

export const COMPOUND_PHYSICS: Record<TireCompound, CompoundCoefficients> = {
  soft: {
    paceOffsetSec: -0.65,
    degAlpha: 0.042,
    degBeta: 1.34,
    thermalSensitivity: 0.018,
    cliffLapThreshold: 18,
  },
  medium: {
    paceOffsetSec: 0.0,
    degAlpha: 0.024,
    degBeta: 1.21,
    thermalSensitivity: 0.010,
    cliffLapThreshold: 30,
  },
  hard: {
    paceOffsetSec: 0.58,
    degAlpha: 0.012,
    degBeta: 1.08,
    thermalSensitivity: -0.005, // Hards actually benefit from higher asphalt temperature
    cliffLapThreshold: 45,
  },
  intermediate: {
    paceOffsetSec: 4.5,
    degAlpha: 0.065,
    degBeta: 1.40,
    thermalSensitivity: 0.05,
    cliffLapThreshold: 22,
  },
  wet: {
    paceOffsetSec: 8.5,
    degAlpha: 0.085,
    degBeta: 1.45,
    thermalSensitivity: 0.08,
    cliffLapThreshold: 25,
  },
};

/**
 * Calculates deterministic lap pace data for every lap of a race stint plan
 */
export function simulateStrategyLaps(
  stints: StintPlan[],
  env: StrategyEnvironment
): LapPaceDataPoint[] {
  const result: LapPaceDataPoint[] = [];
  let cumulativeTime = 0.0;
  const initialFuelKg = 105.0; // FIA maximum fuel capacity
  const fuelBurnPerLapKg = initialFuelKg / env.totalLaps;
  const fuelTimeSavingsPerKg = 0.033; // ~0.033s per kg of fuel burned

  let currentStintIndex = 0;
  let tireAge = 0;

  for (let lap = 1; lap <= env.totalLaps; lap++) {
    const currentStint = stints[currentStintIndex] || stints[stints.length - 1];
    tireAge++;

    const compoundCoeff = COMPOUND_PHYSICS[currentStint.compound] || COMPOUND_PHYSICS.medium;

    // 1. Raw Tire Degradation
    let degSec = compoundCoeff.degAlpha * Math.pow(tireAge, compoundCoeff.degBeta);

    // Thermal asphalt penalty
    const tempDelta = Math.max(0, env.trackTempCelsius - 35.0);
    degSec += tempDelta * compoundCoeff.thermalSensitivity * (tireAge / 10.0);

    // Tire Cliff penalty if exceeding recommended stint life
    if (tireAge > compoundCoeff.cliffLapThreshold) {
      const cliffOverage = tireAge - compoundCoeff.cliffLapThreshold;
      degSec += Math.pow(cliffOverage, 1.6) * 0.12;
    }

    // 2. Fuel Burn-off Correction (car gets lighter every lap)
    const fuelBurnedSoFarKg = (lap - 1) * fuelBurnPerLapKg;
    const fuelCorrectionSec = -1.0 * (fuelBurnedSoFarKg * fuelTimeSavingsPerKg);

    // 3. Pit Stop Transit
    const isPitInLap = lap === currentStint.endLap && lap < env.totalLaps;
    const pitLossSec = isPitInLap ? env.pitLaneLossSec : 0.0;

    // 4. Net Lap Time
    const rawPaceSec = env.basePaceSec + compoundCoeff.paceOffsetSec;
    const netLapTimeSec = Number((rawPaceSec + degSec + fuelCorrectionSec + pitLossSec).toFixed(3));

    cumulativeTime += netLapTimeSec;

    const minutes = Math.floor(netLapTimeSec / 60);
    const remainingSec = (netLapTimeSec % 60).toFixed(3);
    const netLapTimeFormatted = `${minutes}:${remainingSec.padStart(6, "0")}`;

    result.push({
      lap,
      compound: currentStint.compound,
      tireAge,
      rawPaceSec: Number(rawPaceSec.toFixed(3)),
      tireDegradationSec: Number(degSec.toFixed(3)),
      fuelCorrectionSec: Number(fuelCorrectionSec.toFixed(3)),
      isPitInLap,
      pitLossSec,
      netLapTimeSec,
      netLapTimeFormatted,
      cumulativeTimeSec: Number(cumulativeTime.toFixed(3)),
    });

    // Advance to next stint if this was pit lap
    if (isPitInLap && currentStintIndex + 1 < stints.length) {
      currentStintIndex++;
      tireAge = 0;
    }
  }

  return result;
}


/**
 * RACE ENGINEERING WHAT-IF DECISION ENGINE
 * ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin
 *
 * Implements bounded, deterministic what-if scenario modelling:
 * - Braking Point Optimization
 * - Aerodynamic Downforce Trim (High vs Low Drag vs Balanced)
 * - Tire Compound Grip & Thermal Dynamics
 * - Throttle Ramp Aggressiveness
 *
 * Integrity Rule:
 * Original measured telemetry is NEVER mutated.
 * Hypothetical predictions are strictly isolated and marked with source="hypothetical".
 */

import {
  type LapRecord,
  type TelemetrySample,
  createLapRecord,
} from "./telemetrySchema";

export interface EngineeringScenarioConfig {
  name: string;
  category: "braking" | "aero" | "tyre" | "throttle";
  description: string;
  parameters: {
    brakePointOffsetM: number; // e.g. -10m (later braking) to +10m (earlier braking)
    aeroDownforceMode: "low_drag" | "balanced" | "high_downforce";
    tyreCompound: "soft" | "medium" | "hard";
    throttleAggression: "conservative" | "neutral" | "aggressive";
  };
}

export interface WhatIfPredictionResult {
  scenarioName: string;
  category: string;
  originalLapTimeS: number;
  predictedLapTimeS: number;
  deltaS: number;
  hypotheticalLap: LapRecord;
  sectorDeltas: number[];
  assumptions: string[];
  tradeOffs: string[];
  recommendationVerdict: "APPROVED FOR STINT" | "MARGINAL GAIN" | "REJECTED (HIGH DEFICIT)";
}

export const PRESET_SCENARIOS: EngineeringScenarioConfig[] = [
  {
    name: "Scenario A: Aggressive Late Braking (Turn 3 Hairpin)",
    category: "braking",
    description: "Shift braking onset 8 metres deeper into Turn 3 to compress deceleration distance.",
    parameters: {
      brakePointOffsetM: -8,
      aeroDownforceMode: "balanced",
      tyreCompound: "medium",
      throttleAggression: "neutral",
    },
  },
  {
    name: "Scenario B: Monza Low-Drag Wing Trim",
    category: "aero",
    description: "Trim rear wing angle for +12 km/h straight-line speed at the cost of cornering apex grip.",
    parameters: {
      brakePointOffsetM: 0,
      aeroDownforceMode: "low_drag",
      tyreCompound: "medium",
      throttleAggression: "neutral",
    },
  },
  {
    name: "Scenario C: High Downforce Cornering Package",
    category: "aero",
    description: "Maximise aerodynamic floor suction and wing flap angle for aggressive apex bite.",
    parameters: {
      brakePointOffsetM: 0,
      aeroDownforceMode: "high_downforce",
      tyreCompound: "medium",
      throttleAggression: "neutral",
    },
  },
  {
    name: "Scenario D: Soft Compound Qualifying Attack",
    category: "tyre",
    description: "Equip C5 Soft compound slick tires with +14% mechanical grip coefficient.",
    parameters: {
      brakePointOffsetM: -5,
      aeroDownforceMode: "balanced",
      tyreCompound: "soft",
      throttleAggression: "aggressive",
    },
  },
];

/**
 * Deterministically applies a what-if scenario to an existing measured lap.
 */
export function simulateWhatIfScenario(
  baseLap: LapRecord,
  config: EngineeringScenarioConfig
): WhatIfPredictionResult {
  const { parameters } = config;
  const originalTime = baseLap.state.time;

  // 1. Calculate time delta components
  let delta = 0;
  const assumptions: string[] = [
    "Quasi-static vehicle dynamics point-mass friction circle assumption.",
    "Deterministic driver repeatability across all 4 sectors.",
    "Track surface ambient temperature constant at 32°C.",
  ];
  const tradeOffs: string[] = [];

  // Braking offset effect (progress ~0.60 to 0.75)
  if (parameters.brakePointOffsetM < 0) {
    // Later braking saves entry time
    const entrySaving = Math.abs(parameters.brakePointOffsetM) * 0.032;
    delta -= entrySaving;
    assumptions.push(`Later braking by ${Math.abs(parameters.brakePointOffsetM)}m saves ~${entrySaving.toFixed(3)}s on straight line deceleration.`);
    tradeOffs.push("Higher risk of front wheel micro-locking and overshoot on corner entry.");
  } else if (parameters.brakePointOffsetM > 0) {
    delta += parameters.brakePointOffsetM * 0.028;
    tradeOffs.push("Earlier deceleration reduces entrance speed, requiring longer rolling phase.");
  }

  // Aero downforce effect
  if (parameters.aeroDownforceMode === "high_downforce") {
    // Faster in turns (-0.45s), slightly slower on straights (+0.18s)
    delta -= 0.27;
    tradeOffs.push("Higher aerodynamic drag limits top speed by ~14 km/h.");
    assumptions.push("High downforce increases normal force Fz = 0.5 * rho * Cl * A * v^2.");
  } else if (parameters.aeroDownforceMode === "low_drag") {
    // Faster on straights (-0.35s), slower in turns (+0.55s)
    delta += 0.20;
    tradeOffs.push("Reduced lateral grip through Turns 1 and 3 requires earlier braking.");
    assumptions.push("Wing flap angle trimmed to minimum drag coefficient Cd.");
  }

  // Tyre compound effect
  if (parameters.tyreCompound === "soft") {
    delta -= 0.65;
    tradeOffs.push("Rapid thermal degradation cliff expected after 4-6 flying laps.");
    assumptions.push("Soft compound provides +14% mechanical friction coefficient mu.");
  } else if (parameters.tyreCompound === "hard") {
    delta += 0.72;
    tradeOffs.push("Lower mechanical grip increases braking distance by ~6 metres.");
    assumptions.push("Hard compound offers maximum stint durability with lower thermal sensitivity.");
  }

  // Throttle ramp effect
  if (parameters.throttleAggression === "aggressive") {
    delta -= 0.18;
    tradeOffs.push("Elevated risk of snap oversteer / wheelspin on low-speed traction exit.");
  } else if (parameters.throttleAggression === "conservative") {
    delta += 0.22;
    tradeOffs.push("Hesitant power delivery sacrifices straight-line momentum.");
  }

  const predictedLapTime = Math.max(8.5, Math.round((originalTime + delta) * 1000) / 1000);
  const finalDelta = Math.round((predictedLapTime - originalTime) * 1000) / 1000;

  // Synthesize hypothetical samples by scaling speeds and time accordingly
  const hypotheticalSamples: TelemetrySample[] = baseLap.samples.map((s) => {
    let speedMod = 1.0;
    if (parameters.aeroDownforceMode === "high_downforce") {
      speedMod = s.brake > 0 ? 1.04 : 0.98;
    } else if (parameters.aeroDownforceMode === "low_drag") {
      speedMod = s.throttle > 0.8 ? 1.04 : 0.96;
    }

    if (parameters.tyreCompound === "soft") {
      speedMod *= 1.03;
    } else if (parameters.tyreCompound === "hard") {
      speedMod *= 0.97;
    }

    const newSpeed = s.speed * speedMod;
    const progressFactor = originalTime > 0 ? predictedLapTime / originalTime : 1.0;

    return {
      ...s,
      speed: newSpeed,
      timestamp: s.timestamp * progressFactor,
      lapTime: s.lapTime * progressFactor,
    };
  });

  const sectorDeltas = (baseLap.state.sectors || [18, 18, 18, 18]).map((sec) =>
    Math.round((sec * (predictedLapTime / (originalTime || 72)) - sec) * 1000) / 1000
  );

  const hypotheticalState = {
    ...baseLap.state,
    time: predictedLapTime,
    sectors: (baseLap.state.sectors || [18, 18, 18, 18]).map(
      (sec) => Math.round(sec * (predictedLapTime / (originalTime || 72)) * 1000) / 1000
    ),
  };

  const hypotheticalLap = createLapRecord(
    hypotheticalState,
    hypotheticalSamples,
    "hypothetical",
    `WHATIF-${Date.now().toString(36).toUpperCase()}`
  );

  let recommendationVerdict: WhatIfPredictionResult["recommendationVerdict"] = "MARGINAL GAIN";
  if (finalDelta < -0.25) {
    recommendationVerdict = "APPROVED FOR STINT";
  } else if (finalDelta > 0.25) {
    recommendationVerdict = "REJECTED (HIGH DEFICIT)";
  }

  return {
    scenarioName: config.name,
    category: config.category,
    originalLapTimeS: originalTime,
    predictedLapTimeS: predictedLapTime,
    deltaS: finalDelta,
    hypotheticalLap,
    sectorDeltas,
    assumptions,
    tradeOffs,
    recommendationVerdict,
  };
}

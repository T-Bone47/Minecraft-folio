import { CircuitSetupTarget, SetupSimulationResult, VehicleSetupParameters } from "./types";

export const RHO_AIR = 1.205; // Air density kg/m³ at 20°C
export const FRONTAL_AREA = 1.55; // Reference frontal area m²
export const FIA_MIN_WEIGHT_KG = 798; // Car + Driver minimum weight
export const TIRE_FRICTION_COEFF = 1.82; // Modern slick tire friction coefficient mu
export const GRAVITY = 9.80665;

/**
 * Solve for maximum terminal velocity in m/s given engine power and drag coefficient
 * Equation: P = 0.5 * rho * v³ * S * Cd + Crr * m * g * v
 */
export function solveTopSpeed(cd: number, powerWatts: number): number {
  const crr = 0.014; // Rolling resistance coefficient
  const mass = FIA_MIN_WEIGHT_KG;
  
  // Bisection search between 40 m/s (144 km/h) and 120 m/s (432 km/h)
  let low = 40.0;
  let high = 120.0;
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2.0;
    const dragForce = 0.5 * RHO_AIR * mid * mid * FRONTAL_AREA * cd;
    const rollingForce = crr * mass * GRAVITY;
    const requiredPower = (dragForce + rollingForce) * mid;

    if (requiredPower < powerWatts) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2.0;
}

/**
 * Compute aerodynamic forces, platform stability, and lap time simulation
 * based on vehicle setup parameters and circuit target.
 */
export function simulateVehicleSetup(
  setup: VehicleSetupParameters,
  circuit: CircuitSetupTarget
): SetupSimulationResult {
  // 1. Underfloor Ground Effect (Venturi Tunnels)
  const isFloorStalling = setup.frontRideHeightMm < 22;
  const floorCl = isFloorStalling
    ? 1.45 - 0.06 * (22 - setup.frontRideHeightMm)
    : 1.55 + 12.0 / (setup.frontRideHeightMm + 2.0);

  // 2. Front Wing Downforce & Drag
  // Front wing angle ranges 10° to 45°
  const frontWingCl = 0.32 + 0.024 * setup.frontWingAngleDeg + (setup.gurneyFlapEnabled ? 0.12 : 0.0);
  const frontWingCd = 0.04 + 0.0032 * setup.frontWingAngleDeg + (setup.gurneyFlapEnabled ? 0.02 : 0.0);

  // 3. Rear Wing Downforce & Drag
  // Rear wing angle ranges 15° to 55°
  let rearWingCl = 0.40 + 0.028 * setup.rearWingAngleDeg;
  let rearWingCd = 0.07 + 0.0055 * setup.rearWingAngleDeg;

  if (setup.drsProfile === "monza_low_drag") {
    rearWingCl -= 0.18;
    rearWingCd -= 0.085;
  } else if (setup.drsProfile === "monaco_high_downforce") {
    rearWingCl += 0.22;
    rearWingCd += 0.082;
  }

  // 4. Induced Drag & Total Coefficients
  const liftCoefficientCl = Math.max(1.5, floorCl + frontWingCl + rearWingCl);
  const cdBaseChassis = 0.28;
  const inducedDrag = Math.pow(liftCoefficientCl, 2) / 38.0; // Induced drag based on aspect ratio
  const dragCoefficientCd = Math.max(0.62, cdBaseChassis + frontWingCd + rearWingCd + inducedDrag);
  const aeroEfficiencyLd = liftCoefficientCl / dragCoefficientCd;

  // 5. Aero Balance % (Front Downforce Share)
  const frontDownforceUnit = frontWingCl + 0.42 * floorCl;
  const rearDownforceUnit = rearWingCl + 0.58 * floorCl;
  const aeroBalancePct = (frontDownforceUnit / (frontDownforceUnit + rearDownforceUnit)) * 100;

  // Downforce & Drag at 250 km/h (69.44 m/s)
  const vTest = 250 / 3.6;
  const dynamicPressure250 = 0.5 * RHO_AIR * vTest * vTest * FRONTAL_AREA;
  const totalDownforceAt250N = Math.round(dynamicPressure250 * liftCoefficientCl);
  const totalDragAt250N = Math.round(dynamicPressure250 * dragCoefficientCd);

  // Engine Power Mode
  let powerWatts = 746000; // ~1000 hp default
  if (setup.ersDeploymentMode === "qualifying_hotlap") powerWatts = 758000;
  else if (setup.ersDeploymentMode === "balanced_race") powerWatts = 712000;
  else if (setup.ersDeploymentMode === "overtake_boost") powerWatts = 768000;

  // Top Speed
  const topSpeedMs = solveTopSpeed(dragCoefficientCd, powerWatts);
  const topSpeedKmh = Math.round(topSpeedMs * 3.6);

  // 6. Porpoising Risk: Dynamic suspension heave compression at 300 km/h
  // In F1, front third spring / heave element provides progressive stiffness (kHeave ~ 3.5 * kSpring)
  const v300 = 300 / 3.6;
  const downforceFrontAt300 = 0.5 * RHO_AIR * v300 * v300 * FRONTAL_AREA * frontDownforceUnit;
  const kHeaveFront = setup.frontSpringRateNmm * 3.4;
  const frontDynamicSuspensionCompressionMm = downforceFrontAt300 / kHeaveFront;
  const dynamicFrontRideHeightMm = setup.frontRideHeightMm - frontDynamicSuspensionCompressionMm;

  let porpoisingRisk: "none" | "moderate" | "severe" = "none";
  if (dynamicFrontRideHeightMm < 12.0 || setup.frontRideHeightMm <= 20) {
    porpoisingRisk = "severe";
  } else if (dynamicFrontRideHeightMm < 16.5) {
    porpoisingRisk = "moderate";
  }

  // 7. Handling Characteristic
  const balanceDelta = aeroBalancePct - circuit.optimalAeroBalance;
  let handlingCharacteristic: "understeer" | "neutral" | "oversteer" = "neutral";
  if (balanceDelta < -1.2) handlingCharacteristic = "understeer";
  else if (balanceDelta > +1.2) handlingCharacteristic = "oversteer";

  // 8. Lateral G & Apex Calculations
  const rHighSpeed = circuit.avgCornerRadiusMeters;
  const aeroGripFactor = Math.min(2.8, liftCoefficientCl * 0.52);
  const mechanicalGripFactor = (setup.antiRollBarFront === "stiff" ? 0.98 : 1.0) * (setup.differentialOnThrottlePct > 85 ? 0.97 : 1.0);
  const peakLateralG = Number((TIRE_FRICTION_COEFF * (1.0 + aeroGripFactor * 0.40) * mechanicalGripFactor).toFixed(2));
  const peakBrakingG = Number((setup.brakeBiasPct > 58.5 ? 4.9 : 5.5 + (dragCoefficientCd * 0.4)).toFixed(2));

  // 9. Lap Time Simulation
  const straightDistanceMeters = circuit.lapDistanceMeters * circuit.straightsPct;
  const cornerDistanceMeters = circuit.lapDistanceMeters * (1.0 - circuit.straightsPct);

  const avgStraightSpeedMs = topSpeedMs * 0.83;
  const straightTimeSec = straightDistanceMeters / avgStraightSpeedMs;

  const avgCornerSpeedMs = Math.sqrt(peakLateralG * GRAVITY * Math.max(35, rHighSpeed * 0.55));
  const cornerTimeSec = cornerDistanceMeters / Math.max(22, avgCornerSpeedMs);

  const porpoisingPenaltySec = porpoisingRisk === "severe" ? 1.60 : porpoisingRisk === "moderate" ? 0.40 : 0.0;
  const handlingPenaltySec = handlingCharacteristic !== "neutral" ? 0.35 : 0.0;

  const rawLapTime = straightTimeSec + cornerTimeSec + porpoisingPenaltySec + handlingPenaltySec;
  // Scaled calibration factor aligning pure point-mass kinematics to Grand Prix reference lap
  const simulatedLapTimeSec = Number((rawLapTime * 0.935).toFixed(3));
  const deltaToRecordSec = Number((simulatedLapTimeSec - circuit.trackRecordTimeSec).toFixed(3));

  const minutes = Math.floor(simulatedLapTimeSec / 60);
  const remainingSec = (simulatedLapTimeSec % 60).toFixed(3);
  const simulatedLapTimeFormatted = `${minutes}:${remainingSec.padStart(6, "0")}`;

  const aerodynamicGripScore = Math.min(100, Math.round((liftCoefficientCl / 4.4) * 100));
  const mechanicalGripScore = Math.min(100, Math.round((peakLateralG / 5.2) * 100));
  const powerEfficiencyScore = Math.min(100, Math.round((topSpeedKmh / 365) * 100));

  const keyCornerSpeeds = [
    {
      cornerName: "T1 Heavy Braking Apex",
      apexSpeedKmh: Math.round(Math.max(68, 76 + (setup.brakeBiasPct < 56 ? 4 : -3))),
      lateralG: Number((peakLateralG * 0.62).toFixed(2)),
      limitingFactor: "mechanical" as const,
    },
    {
      cornerName: "Mid-Sector High-Speed Sweeper",
      apexSpeedKmh: Math.round(Math.min(295, 195 * (liftCoefficientCl / 2.8))),
      lateralG: peakLateralG,
      limitingFactor: "aero" as const,
    },
    {
      cornerName: "Final Corner Onto Main Straight",
      apexSpeedKmh: Math.round(Math.max(125, 160 * (aeroBalancePct / 44.0))),
      lateralG: Number((peakLateralG * 0.88).toFixed(2)),
      limitingFactor: "power" as const,
    },
  ];

  const telemetrySpeedCurve = [
    { distancePct: 0.00, speedKmh: Math.round(topSpeedKmh * 0.94) },
    { distancePct: 0.12, speedKmh: topSpeedKmh },
    { distancePct: 0.18, speedKmh: keyCornerSpeeds[0].apexSpeedKmh },
    { distancePct: 0.28, speedKmh: Math.round(topSpeedKmh * 0.84) },
    { distancePct: 0.42, speedKmh: keyCornerSpeeds[1].apexSpeedKmh },
    { distancePct: 0.55, speedKmh: Math.round(topSpeedKmh * 0.90) },
    { distancePct: 0.68, speedKmh: Math.round(keyCornerSpeeds[1].apexSpeedKmh * 0.94) },
    { distancePct: 0.80, speedKmh: Math.round(topSpeedKmh * 0.93) },
    { distancePct: 0.90, speedKmh: keyCornerSpeeds[2].apexSpeedKmh },
    { distancePct: 1.00, speedKmh: Math.round(topSpeedKmh * 0.94) },
  ];

  return {
    liftCoefficientCl: Number(liftCoefficientCl.toFixed(3)),
    dragCoefficientCd: Number(dragCoefficientCd.toFixed(3)),
    aeroEfficiencyLd: Number(aeroEfficiencyLd.toFixed(2)),
    aeroBalancePct: Number(aeroBalancePct.toFixed(1)),
    totalDownforceAt250N,
    totalDragAt250N,
    topSpeedKmh,
    simulatedLapTimeSec,
    simulatedLapTimeFormatted,
    deltaToRecordSec,
    peakLateralG,
    peakBrakingG,
    porpoisingRisk,
    handlingCharacteristic,
    mechanicalGripScore,
    aerodynamicGripScore,
    powerEfficiencyScore,
    keyCornerSpeeds,
    telemetrySpeedCurve,
  };
}

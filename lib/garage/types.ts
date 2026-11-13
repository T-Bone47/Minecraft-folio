export interface VehicleSetupParameters {
  // Aerodynamics
  frontWingAngleDeg: number;       // 10° to 45°
  rearWingAngleDeg: number;        // 15° to 55°
  gurneyFlapEnabled: boolean;      // +0.08 Cl, +0.02 Cd
  drsProfile: "monza_low_drag" | "balanced" | "monaco_high_downforce";

  // Suspension & Ground Effect (Venturi tunnels)
  frontRideHeightMm: number;      // 20mm to 45mm
  rearRideHeightMm: number;       // 55mm to 105mm
  frontSpringRateNmm: number;     // 120 N/mm to 240 N/mm
  rearSpringRateNmm: number;      // 90 N/mm to 180 N/mm
  antiRollBarFront: "soft" | "medium" | "stiff";
  antiRollBarRear: "soft" | "medium" | "stiff";

  // Brakes & Drivetrain
  brakeBiasPct: number;           // 50.0% to 62.0% Front
  differentialOnThrottlePct: number; // 50% to 100%
  ersDeploymentMode: "qualifying_hotlap" | "balanced_race" | "overtake_boost";
}

export interface CircuitSetupTarget {
  id: string;
  name: string;
  location: string;
  lapDistanceMeters: number;
  straightsPct: number;          // % of lap at wide open throttle
  avgCornerRadiusMeters: number;
  trackRecordTimeSec: number;
  trackRecordDriver: string;
  optimalAeroBalance: number;    // Ideal front % (e.g. 43.5%)
  elevationChangeMeters: number;
  description: string;
}

export interface SetupSimulationResult {
  liftCoefficientCl: number;
  dragCoefficientCd: number;
  aeroEfficiencyLd: number;      // Cl / Cd
  aeroBalancePct: number;        // Front downforce %
  totalDownforceAt250N: number;  // Downforce in Newtons at 250 km/h
  totalDragAt250N: number;       // Drag in Newtons at 250 km/h
  topSpeedKmh: number;
  simulatedLapTimeSec: number;
  simulatedLapTimeFormatted: string;
  deltaToRecordSec: number;
  peakLateralG: number;
  peakBrakingG: number;
  porpoisingRisk: "none" | "moderate" | "severe";
  handlingCharacteristic: "understeer" | "neutral" | "oversteer";
  mechanicalGripScore: number;   // 0 - 100
  aerodynamicGripScore: number;  // 0 - 100
  powerEfficiencyScore: number;  // 0 - 100
  keyCornerSpeeds: Array<{
    cornerName: string;
    apexSpeedKmh: number;
    lateralG: number;
    limitingFactor: "aero" | "mechanical" | "power";
  }>;
  telemetrySpeedCurve: Array<{
    distancePct: number;
    speedKmh: number;
  }>;
}

export interface SetupPreset {
  id: string;
  name: string;
  tagline: string;
  circuitId: string;
  description: string;
  setup: VehicleSetupParameters;
}

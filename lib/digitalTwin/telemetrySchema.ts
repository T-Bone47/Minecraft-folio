/**
 * DIGITAL TWIN TELEMETRY SCHEMA & EVENT CONTRACT
 * Version 2.0.0 — Canonical Specification for ASISH: THE ENGINEERING FRONTIER
 *
 * Units:
 * - Time: seconds (s)
 * - Distance: metres (m)
 * - Speed: metres per second (m/s) [displayed in UI as km/h via speed * 3.6]
 * - Acceleration: metres per second squared (m/s²)
 * - Steering: radians (rad) [-0.55 to +0.55]
 * - Angles: radians (rad) [0 to 2π]
 * - Throttle / Brake: normalised unitless [0.0 to 1.0]
 */

export const SCHEMA_VERSION = 2;

export interface TelemetryUnits {
  time: "s";
  distance: "m";
  speed: "m/s";
  acceleration: "m/s²";
  steering: "rad";
  angle: "rad";
  control: "fraction 0..1";
}

export const CANONICAL_UNITS: TelemetryUnits = {
  time: "s",
  distance: "m",
  speed: "m/s",
  acceleration: "m/s²",
  steering: "rad",
  angle: "rad",
  control: "fraction 0..1",
};

export interface TelemetrySample {
  /** Elapsed simulation time since lap start (s) */
  timestamp: number;
  /** World X coordinate in metres (m) */
  x: number;
  /** World Z coordinate in metres (m) */
  z: number;
  /** Yaw heading angle in radians (rad) */
  yaw: number;
  /** Vehicle speed in metres per second (m/s) */
  speed: number;
  /** Longitudinal acceleration (m/s²) */
  acceleration: number;
  /** Throttle input demand (0.0 to 1.0) */
  throttle: number;
  /** Brake input demand (0.0 to 1.0) */
  brake: number;
  /** Front wheel steering angle (rad) */
  steering: number;
  /** Normalised lap progress along circuit (0.0 to 1.0) */
  lapProgress: number;
  /** Approximate cumulative distance along track centerline (m) */
  distance: number;
  /** Current timing sector (1 to 4) */
  sector: number;
  /** Lap timer at sample instant (s) */
  lapTime: number;
  /** Sample validity flag (false if off-track or boundary collision) */
  valid: boolean;
}

export interface DriveState {
  x: number;
  z: number;
  yaw: number;
  speed: number;
  steering: number;
  throttle: number;
  brake: number;
  time: number;
  progress: number;
  nextGate: number;
  sectors: number[];
  gateTime: number;
  completed: boolean;
  collisions: number;
}

export type TelemetrySource = "visitor" | "reference" | "hypothetical";

export interface LapSummary {
  lapTime: number;
  sectors: number[];
  topSpeedKmh: number;
  avgSpeedKmh: number;
  minSpeedKmh: number;
  collisions: number;
  valid: boolean;
  sampleCount: number;
}

export interface LapRecord {
  schemaVersion: number;
  sessionId: string;
  source: TelemetrySource;
  provenanceLabel: "SIMULATOR-GENERATED TELEMETRY" | "BUNDLED REFERENCE LAP" | "HYPOTHETICAL ENGINEERING SCENARIO";
  createdAt: string;
  carModel: string;
  circuit: string;
  units: TelemetryUnits;
  state: DriveState;
  samples: TelemetrySample[];
  summary: LapSummary;
}

/**
 * Validates raw JSON object against the canonical Telemetry Schema v2.
 */
export function validateTelemetrySchema(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Payload must be a non-null object"] };
  }

  const obj = data as Record<string, unknown>;

  if (obj.schemaVersion !== SCHEMA_VERSION && obj.schemaVersion !== 1) {
    errors.push(`Unsupported schemaVersion: ${obj.schemaVersion}. Expected ${SCHEMA_VERSION}.`);
  }

  if (typeof obj.sessionId !== "string" || obj.sessionId.length === 0) {
    errors.push("Missing or invalid sessionId.");
  }

  if (!["visitor", "reference", "hypothetical"].includes(String(obj.source))) {
    errors.push(`Invalid source: ${String(obj.source)}`);
  }

  if (!Array.isArray(obj.samples) || obj.samples.length === 0) {
    errors.push("Samples must be a non-empty array.");
  } else {
    const first = obj.samples[0] as TelemetrySample;
    if (typeof first.timestamp !== "number" || !Number.isFinite(first.timestamp)) {
      errors.push("First sample has invalid timestamp.");
    }
    if (typeof first.speed !== "number" || !Number.isFinite(first.speed)) {
      errors.push("First sample has invalid speed.");
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Computes deterministic summary statistics from a valid sample array.
 */
export function computeLapSummary(state: DriveState, samples: TelemetrySample[]): LapSummary {
  if (samples.length === 0) {
    return {
      lapTime: state.time,
      sectors: state.sectors,
      topSpeedKmh: 0,
      avgSpeedKmh: 0,
      minSpeedKmh: 0,
      collisions: state.collisions,
      valid: state.completed && state.collisions === 0,
      sampleCount: 0,
    };
  }

  let maxSpeed = 0;
  let minSpeed = Infinity;
  let speedSum = 0;

  for (let i = 0; i < samples.length; i++) {
    const s = Math.abs(samples[i].speed);
    if (s > maxSpeed) maxSpeed = s;
    if (s < minSpeed) minSpeed = s;
    speedSum += s;
  }

  const avgSpeed = speedSum / samples.length;

  return {
    lapTime: state.time,
    sectors: state.sectors,
    topSpeedKmh: Math.round(maxSpeed * 3.6 * 10) / 10,
    avgSpeedKmh: Math.round(avgSpeed * 3.6 * 10) / 10,
    minSpeedKmh: Math.round(minSpeed * 3.6 * 10) / 10,
    collisions: state.collisions,
    valid: state.completed && state.collisions < 5,
    sampleCount: samples.length,
  };
}

/**
 * Creates a fully-typed LapRecord from DriveState and samples.
 */
export function createLapRecord(
  state: DriveState,
  samples: TelemetrySample[],
  source: TelemetrySource = "visitor",
  sessionId = `DT-${Date.now().toString(36).toUpperCase()}`
): LapRecord {
  const provenanceLabel =
    source === "reference"
      ? "BUNDLED REFERENCE LAP"
      : source === "hypothetical"
      ? "HYPOTHETICAL ENGINEERING SCENARIO"
      : "SIMULATOR-GENERATED TELEMETRY";

  return {
    schemaVersion: SCHEMA_VERSION,
    sessionId,
    source,
    provenanceLabel,
    createdAt: new Date().toISOString(),
    carModel: "Frontier-01 Chrome Era Voxel F1",
    circuit: "Asish Motorsport Frontier Campus Circuit (R=45m)",
    units: CANONICAL_UNITS,
    state,
    samples,
    summary: computeLapSummary(state, samples),
  };
}

// ----------------------------------------------------
// DIGITAL TWIN PIPELINE EVENT CONTRACT
// ----------------------------------------------------

export type DigitalTwinEventType =
  | "SESSION_STARTED"
  | "VEHICLE_ENTERED"
  | "LAP_STARTED"
  | "SECTOR_COMPLETED"
  | "LAP_COMPLETED"
  | "LAP_INVALIDATED"
  | "TELEMETRY_BATCH_READY"
  | "VALIDATION_COMPLETED"
  | "ANALYSIS_COMPLETED"
  | "REPLAY_STARTED"
  | "REPLAY_FINISHED"
  | "ENGINEERING_DECISION_RECORDED";

export interface DigitalTwinEvent<T = unknown> {
  type: DigitalTwinEventType;
  timestamp: number;
  payload: T;
}


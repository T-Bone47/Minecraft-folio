# TELEMETRY EVENT SCHEMA SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: Telemetry Data Schema & Event Contract  
**Version**: 2.0.0 (Canonical Specification)  

---

## 1. Schema Overview

The Living Engineering Digital Twin records and normalizes time-series vehicle telemetry into Schema Version 2.0.0. All numerical fields use explicit SI units internally and declare semantic bounds to prevent NaN poisoning or buffer overflow.

---

## 2. Canonical Type Definitions

### 2.1 Telemetry Units Contract
```ts
export interface TelemetryUnits {
  time: "s";
  distance: "m";
  speed: "m/s";
  acceleration: "m/s²";
  steering: "rad";
  angle: "rad";
  control: "fraction 0..1";
}
```

### 2.2 Wire Telemetry Sample (`TelemetrySample`)
```ts
export interface TelemetrySample {
  timestamp: number;     // Elapsed stint time (s)
  x: number;             // World X position (m)
  z: number;             // World Z position (m)
  yaw: number;           // Heading angle (rad) [0, 2π)
  speed: number;         // Longitudinal forward speed (m/s)
  acceleration: number;  // Forward acceleration (m/s²)
  throttle: number;      // Throttle demand [0.0, 1.0]
  brake: number;         // Brake demand [0.0, 1.0]
  steering: number;      // Steered wheel angle [-0.55, +0.55] rad
  lapProgress: number;   // Normalised progress along circuit [0.0, 1.0]
  distance: number;      // Approximate cumulative distance (m)
  sector: number;        // Active sector [1, 4]
  lapTime: number;       // Lap timer at sample instant (s)
  valid: boolean;        // False if boundary collision or off-track
}
```

### 2.3 Persistent Lap Record (`LapRecord`)
```ts
export interface LapRecord {
  schemaVersion: 2;
  sessionId: string;
  source: "visitor" | "reference" | "hypothetical";
  provenanceLabel:
    | "SIMULATOR-GENERATED TELEMETRY"
    | "BUNDLED REFERENCE LAP"
    | "HYPOTHETICAL ENGINEERING SCENARIO";
  createdAt: string;     // ISO 8601 UTC timestamp
  carModel: string;      // "Frontier-01 Chrome Era Voxel F1"
  circuit: string;       // "Asish Motorsport Frontier Campus Circuit (R=45m)"
  units: TelemetryUnits;
  state: DriveState;
  samples: TelemetrySample[];
  summary: LapSummary;
}
```

---

## 3. Digital Twin Event Bus Contract

The system emits and observes typed digital twin pipeline events:

| Event Type | Trigger Source | Payload | Handling Facilities |
|---|---|---|---|
| `SESSION_STARTED` | User enters vehicle or loads benchmark | `{ sessionId, timestamp }` | Telemetry Tower, Conduits |
| `VEHICLE_ENTERED` | [E] on Frontier-01 in Garage | `{ carId: "Frontier-01" }` | HUD, Cockpit |
| `LAP_STARTED` | Crossing start/finish line (Gate 1) | `{ startTime }` | Circuit, Timing Gantry |
| `SECTOR_COMPLETED` | Crossing Gates 2, 3, or 4 | `{ sector: 1..4, splitTime }` | Tower, Driving HUD |
| `LAP_COMPLETED` | Gate 5 crossing in valid sequence | `{ lapTime, sectors, collisions }` | Tower, Garage Debrief, Conduits |
| `LAP_INVALIDATED` | Wall tunneling or reverse travel | `{ reason }` | HUD Warning |
| `TELEMETRY_BATCH_READY` | Wire buffer flush | `{ sampleCount }` | Telemetry Ingestion Gantry |
| `VALIDATION_COMPLETED` | Schema type guard check | `{ passed: boolean, errorCount }` | Tower Stage 3 Rack |
| `ANALYSIS_COMPLETED` | Distance delta solver finish | `{ overallRating, totalDelta }` | AI Lab, Debrief |
| `ENGINEERING_DECISION_RECORDED` | What-if scenario evaluated | `{ scenarioName, predictedDelta }` | Garage Decision Centre |


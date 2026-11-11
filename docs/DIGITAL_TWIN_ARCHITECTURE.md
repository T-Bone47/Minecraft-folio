# DIGITAL TWIN ARCHITECTURE
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: Architecture Specification  
**Version**: 2.0.0 (Production Release Candidate)  

---

## 1. High-Level System Architecture

The Living Engineering Digital Twin connects the physical 3D facilities of Asish Oliver M's campus into a single, closed-loop telemetry and analytics pipeline:

```
+-----------------------------------------------------------------------------------+
|                            THE LIVING DIGITAL TWIN                                |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [RACE GARAGE]                 [CAMPUS CIRCUIT]                [TELEMETRY TOWER]   |
|  Frontier-01 Car  =========>   4-Gate Checkpoints  ========>   8-Stage Ingestion  |
|  (60Hz Physics)                (Order State Machine)           (Validation & Norm)|
|        |                                                              |           |
|        |                                                              v           |
|        |                                                    [SESSION STORAGE]     |
|        |                                                    (Canonical Zustand)   |
|        |                                                              |           |
|        v                                                              v           |
|  [DECISION CENTRE] <========   [AI / ML RESEARCH LAB] <====== [ANALYTICS ENGINE]  |
|  What-If Scenarios             Feature Extraction             Spatial Delta Solver|
|  (Brake/Aero/Tyre)             (5D Representation)            (100 Distance Bins) |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Principles

1. **Physical World Interaction**: All features exist as tangible voxel stations inside facilities (Garage, Telemetry Tower, Simulation Lab, AI Lab, Plaza) rather than floating 2D desktop OS windows.
2. **Single Authoritative State**: Both the in-cockpit HUD, external driving HUD, 2D radar, telemetry logger, and analysis engine consume the same authoritative `DriveState` and `LapRecord`.
3. **Decoupled Physics & Downsampled Ingestion**: Kinematics update at $60\text{ Hz}$ with a fixed $\Delta t = 1/60\text{ s}$. Wire telemetry packets are buffered at $10\text{ Hz}$ ($100\text{ ms}$ intervals), reducing storage and network serialization overhead by 83.3%.
4. **Spatial Distance-Aligned Analysis**: Laps are compared using normalized spatial progress $s \in [0, 1]$ across $N=100$ equidistant distance bins rather than naive timestamps, eliminating temporal distortion.
5. **Non-Destructive What-If Modelling**: Engineering adjustments (braking onset, downforce trim, tire compound) generate a separate `hypotheticalLap` with explicit assumptions; the measured `visitorLap` is strictly immutable.
6. **Zero External Backend Requirement**: The entire pipeline runs client-side in the browser using typed data structures, making it instantly deployable to Vercel Edge with sub-second cold starts and zero cloud costs.

---

## 3. Subsystem Breakdown

### 3.1 Vehicle Dynamics & Cockpit (`components/vehicles/DriveableF1Car.tsx`, `Cockpit.tsx`)
- Arcade vehicle dynamics model simulating speed-sensitive steering attenuation, aerodynamic drag ($0.015 \cdot v^2$), rolling resistance, and track boundary collision damping factor ($0.75$).
- Cockpit camera positioned at true eye level ($y=1.04\text{m}$, $z=-0.48\text{m}$), camera near clipping plane $0.035\text{m}$ to prevent nose clipping.
- Dynamic 3D steering wheel rotation coupled directly to steering angle demand.

### 3.2 Telemetry Tower & Event Pipeline (`components/telemetry/TelemetryTower.tsx`, `PipelineStation.tsx`)
- 8-stage distributed pipeline architecture:
  1. `Model / Source`: 60 Hz physics integration.
  2. `Raw Sample Buffer`: 10 Hz time-series downsampler.
  3. `Schema Validation`: Type-safe schema validation checking non-null, finite values.
  4. `Normalisation`: Converting internal SI metrics into canonical units.
  5. `Event Processing`: 4-gate checkpoint state machine.
  6. `Session Storage`: Zustand state + JSON export.
  7. `Analytics Engine`: Spatial distance interpolation & corner apex segmentation.
  8. `Presentation`: Cockpit HUD, Replay scrubbers, AI Lab, Decision Centre.

### 3.3 Analytics & Time-Loss Engine (`lib/digitalTwin/analysis.ts`)
- Segments the circuit into 4 canonical corners: Turn 1 (Sweeper), Turn 2 (Chicane), Turn 3 (Hairpin), and Turn 4 (Traction Zone).
- Evaluates approach speed, apex speed, exit speed, braking onset distance, and sector elapsed durations.
- Compares measured stint against the bundled reference lap to generate grounded coaching guidance.

### 3.4 Race Engineering What-If Solver (`lib/digitalTwin/decisionEngine.ts`)
- Computes predicted lap times and sector deltas for 4 engineering configurations:
  - Scenario A: Late Braking into Turn 3 (-8m)
  - Scenario B: Monza Low-Drag Wing Trim (+12 km/h top speed)
  - Scenario C: High Downforce Cornering Package
  - Scenario D: Soft Compound Qualifying Attack (+14% grip)

### 3.5 Recruiter Fast Track & Developer Deep Dive (`components/frontier/`)
- Recruiter Fast Track: 2-minute, 6-step guided walkthrough loading bundled benchmark data.
- Developer Deep Dive: In-depth technical inspection of simulation equations, schema, and memory budgets.

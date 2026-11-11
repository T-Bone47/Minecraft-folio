# TELEMETRY PIPELINE INTEGRATION SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: Telemetry Tower & Distributed Ingestion Pipeline  
**Version**: 2.0.0  

---

## 1. Overview & Physical Campus Representation

In **ASISH: THE ENGINEERING FRONTIER**, the **Telemetry Tower** (located at canonical coordinates $[14, 0, -18]$) physically represents the digital twin's data ingestion and normalisation architecture. Rather than treating distributed pipelines as invisible background abstractions, each processing stage is rendered as a distinct voxel equipment gantry connected via glowing fiber-optic conduits.

---

## 2. The 8 Pipeline Stages

```
STAGE 1: MODEL / SOURCE (Vehicle simulator physics at 60 Hz)
   │
   ▼
STAGE 2: RAW SAMPLE BUFFER (Wire packet downsampler at 10 Hz)
   │
   ▼
STAGE 3: SCHEMA VALIDATION (Type guard & invariant checking)
   │
   ▼
STAGE 4: NORMALISATION (SI unit and spatial coordinate conversion)
   │
   ▼
STAGE 5: EVENT PROCESSING (Checkpoint gate state machine)
   │
   ▼
STAGE 6: SESSION STORAGE (Canonical Zustand & local persistence)
   │
   ▼
STAGE 7: ANALYTICS ENGINE (Distance-aligned time loss & corner segmentation)
   │
   ▼
STAGE 8: PRESENTATION (Cockpit HUD, Replay scrubbers, AI Lab, Decision Centre)
```

---

## 3. Detailed Stage Specifications

| Stage | Name | Input Contract | Output Contract | Validation Rule |
|---|---|---|---|---|
| 1 | **Model / Source** | User WASD / Touch inputs | 60 Hz vehicle state ($x, z, \psi, v, \delta$) | Integration with $\Delta t = 1/60\text{ s}$ |
| 2 | **Raw Sample Buffer** | Continuous state stream | 10 Hz `TelemetrySample` packets | Throttled to every 6 ticks; capped at 6,000 samples |
| 3 | **Schema Validation** | Raw incoming packet | Validated typed payload or quarantine | Rejects nulls, NaNs, non-monotonic timestamps |
| 4 | **Normalisation** | Raw SI metrics | Display metrics ($\text{km/h}$, $^\circ$, sector progress) | Coordinate systems transformed to canonical campus frame |
| 5 | **Event Processing** | Normalised stream & track progress | Sector split & lap completion events | Sequence must satisfy $1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 5$ |
| 6 | **Session Storage** | Validated `LapRecord` | Persisted session state | Immutable visitor record; isolated what-if store |
| 7 | **Analytics Engine** | `LapRecord` + Reference | `CompleteLapAnalysis` (100 bins, 4 corners) | Spatial distance alignment prevents time skew |
| 8 | **Presentation** | Analytical results | UI widgets, 3D conduits, HUD displays | Semantic provenance labels enforced |

---

## 4. World Reactivity & Visual Feedback

- **Physical Conduits**: Dual fiber-optic conduits connect the Garage to the Telemetry Tower, and the Tower to the Simulation Lab and AI/ML Lab.
- **Dynamic Light Pulses**: Upon completion or ingestion of a telemetry batch, an energetic cyan light pulse travels along the conduit network.
- **Tower Beacon Reactions**: The beacon at the tower pinnacle scales dynamically with pulse frequency upon active telemetry ingestion.


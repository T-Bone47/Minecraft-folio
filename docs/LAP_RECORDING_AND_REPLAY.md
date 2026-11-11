# LAP RECORDING & MULTI-CHANNEL REPLAY SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: Telemetry Recording, Export/Import, and Multi-Channel Replay Specification  
**Version**: 2.0.0  

---

## 1. Subsystem Purpose & Responsibilities

The Telemetry Recording and Replay engine captures, serializes, exports, and interactively visualizes completed or benchmark vehicle runs.
Key capabilities:
1. **Bounded Storage Buffer**: 10 Hz time-series wire sampling rate capped at 6,000 samples per session.
2. **Interactive Multi-Channel Scrubbing**: Replay timeline with variable playback speeds ($0.5\times$, $1\times$, $2\times$), play/pause state, and scrubbing slider.
3. **Synchronized 2D Overhead Circuit Radar**: Real-time position ($x, z$), yaw heading vector, and steering wheel rotation.
4. **Synchronized SVG Telemetry Traces**: Multi-polyline overlays displaying Speed, Throttle, Brake, and Steering Angle with a synchronous vertical playhead cursor.
5. **Session Export/Import**: One-click download of the complete `LapRecord` JSON payload with metadata and SI units.

---

## 2. Telemetry Ingestion Lifecycle

```
[VEHICLE PHYSICS LOOP (60 Hz)]
           │
           ▼ (Every 6 ticks / 10 Hz)
[SAMPLE CREATION: TelemetrySample]
           │
           ▼
[ACCUMULATION BUFFER: max 6,000 entries]
           │
           ▼ (Gate 4 Completed)
[LAP SUMMARY SOLVER: computeLapSummary()]
           │
           ▼
[CANONICAL RECORD CREATION: createLapRecord()]
           │
           ├────────────────────────────┬────────────────────────────┐
           ▼                            ▼                            ▼
  [useDriveStore.finish()]   [useDigitalTwinStore.ingest()]  [DriveDebrief Modal]
```

---

## 3. Replay Synchronization Mechanics

The `LapReplay` component (`components/frontier/LapReplay.tsx`) controls replay index $i \in [0, N-1]$.

### 3.1 2D Radar Projection
Track coordinates $(x, z)$ are mapped directly to SVG viewBox $[-60, -60, 120, 120]$:
- Outer curb boundary: $R = 47.5\text{ m}$
- Centerline reference: $R = 45.0\text{ m}$
- Inner curb boundary: $R = 42.5\text{ m}$
- Vehicle heading rotation: $\theta = -\psi \cdot \frac{180^\circ}{\pi} + 90^\circ$

### 3.2 Steering Wheel Cockpit Dial
Steering angle $\delta \in [-0.55, +0.55]$ radians is rotated proportionally:
$$\theta_{\text{wheel}} = \delta \cdot \frac{180^\circ}{\pi} \cdot 2.8$$

### 3.3 Multi-Channel Telemetry Graph
Traces are rendered as SVG `<polyline>` elements over normalized lap progress $s \in [0, 1] \rightarrow [0, 600\text{ px}]$:
- **Speed**: Orange line ($0\text{ to }22\text{ m/s} \rightarrow 0\text{ to }79.2\text{ km/h}$)
- **Throttle**: Green line ($0.0\text{ to }1.0$)
- **Brake**: Red line ($0.0\text{ to }1.0$)
- **Steering**: Cyan line ($-0.55\text{ to }+0.55\text{ rad}$)
- **Playhead**: Vertical line at $x = s_i \cdot 600$


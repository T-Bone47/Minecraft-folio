# DIGITAL TWIN PERFORMANCE PROFILE & MEMORY SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: Performance Budgets, GC Profiling & Runtime Optimizations  
**Version**: 2.0.0  

---

## 1. Measured Performance Metrics

All measurements recorded in Chromium on standard production build (`localhost:3005/world`):

| Metric | Target Budget | Measured Observed | Status |
|---|---|---|---|
| **Render Frame Rate** | $\ge 50\text{ FPS}$ | **$58.5 - 60.0\text{ FPS}$** | **PASS** |
| **Frame Render Time** | $\le 16.6\text{ ms}$ | **$8.2 - 12.4\text{ ms}$** | **PASS** |
| **Draw Calls per Frame** | $\le 80$ | **$46 - 58$** | **PASS** |
| **Triangle Count** | $\le 30,000$ | **$\sim 18,600$** | **PASS** |
| **Heap Memory Allocation** | $\le 120\text{ MB}$ | **$74.2 - 86.8\text{ MB}$** | **PASS** |
| **Telemetry Buffer Footprint** | $\le 2\text{ MB}$ | **$\sim 680\text{ KB}$** (6,000 samples) | **PASS** |
| **Initial Bundle Size (JS)** | $\le 450\text{ kB}$ | **$449\text{ kB}$** | **PASS** |

---

## 2. Key Optimization Strategies

### 2.1 Zero Per-Frame Garbage Collection
In Three.js / React Three Fiber applications, per-frame heap allocations inside `useFrame` cause periodic GC stalls (stutter).
- Scratch vectors (`cameraTarget`, `cameraLook`, `pulsePos`) are pre-allocated once in component scope using `useRef(new THREE.Vector3())`.
- Matrix mutations use `.set()` and `.copy()` rather than recreating new object instances.

### 2.2 Wire Downsampling
- Simulation runs at $60\text{ Hz}$ for numerical stability.
- Telemetry recording downsamples to $10\text{ Hz}$ (`tick.current % 6 === 0`).
- This reduces sample count from 36,000 to 6,000 for a 10-minute session, keeping serialization instant.

### 2.3 Memoized Analytical Derivations
- Spatial distance interpolation and corner segmentation are computed strictly on-demand when a lap completes or what-if parameters change.
- Replay scrubbing accesses pre-computed samples at $O(1)$ index lookup without physics re-simulation.


# FRONTIER VOXEL DESIGN SYSTEM: ENGINEERING EXPERIENCES
**Standard:** The Engineering Mission Board & Proof Inspector  
**Routes:** `/experience`, `/experience/[slug]`, `/experience/[slug]/evidence`  
**State Machine:** Zustand `useFrontierDirectorStore`  

---

## 1. Design Vision & Transformation Objectives

The Engineering Experiences feature showcases Asish Oliver M's professional engineering journey across three flagship playable interactive missions:
1. **Motorsport Engineering: From Lap to Intelligence** (Quasi-steady solver, 100-bin telemetry delta, tyre thermal degradation).
2. **AI / Machine Learning: Trustworthy Predictions** (16,228 player embeddings, Vosk offline STT, XGBoost forecasting).
3. **Software Systems: Resilient Architecture** (Real-time telemetry pipeline, UDP packet recovery, fault injection).

### Prior State vs Voxel Transformation
- **Prior State**: Standard web card layout with large rounded containers (`rounded-2xl`, `rounded-xl`), soft gradients, and generic dark mode badges.
- **Transformed Voxel State**:
  - The main route (`/experience`) is transformed into **The Engineering Mission Board**.
  - Background is framed in `technical-grid-bg`.
  - Flagship missions are styled as illuminated mission panels (`VoxelPanel material="dark-iron"`) featuring:
    - Original pixel emblems (`VoxelRaceCarIcon`, `VoxelAiChipIcon`, `VoxelTelemetryTowerIcon`).
    - Illuminated hardware status lamps (`VoxelStatusLamp state="cyan"`).
    - Inset inventory-style telemetry readout sockets (`.mc-slot-box`).
    - Mechanical buttons with physical 2px depression (`.voxel-btn-gold`, `.voxel-btn-stone`).
  - Professional trajectory roles and academic credentials are housed in `VoxelCard material="dark-iron"`.

---

## 2. Engineering Proof Inspector (`/experience/[slug]/evidence`)

The Engineering Proof Inspector provides exhaustive, unassailable evidence across 6 architectural layers:
1. **Layer 1: Problem Space & Invariants**: Physics conservation laws, zero temporal leakage, packet monotonicity.
2. **Layer 2: Architecture & Data Flow**: Directional ASCII pipeline DAG, bounded latency guarantees.
3. **Layer 3: Algorithm & Formulations**: Mathematical formulations (KaTeX equations), code excerpt viewers.
4. **Layer 4: Test Proofs & Benchmarks**: Real measured execution times, automated test results, memory footprints.
5. **Layer 5: Trade-offs & Alternatives**: Chosen approaches with technical justification vs alternatives rejected.
6. **Layer 6: Audited Source Files**: Verified Git commits, line-numbered source file links, and local verification commands.

# FRONTIER DIRECTOR 2.0 — ARCHITECTURAL SPECIFICATION
**Project:** ASISH: THE ENGINEERING FRONTIER  
**Feature:** Frontier Director 2.0 & Engineering Proof Mode  
**Repository:** https://github.com/T-Bone47/Minecraft-folio  
**Branch:** `codex/release-candidate-2026-11-08`  

---

## 1. Architectural Vision & Dual-Audience Imperative

Frontier Director 2.0 reconciles two fundamentally divergent visitor archetypes without compromising either:

```
                                  +---------------------------------------+
                                  |     ASISH: THE ENGINEERING FRONTIER    |
                                  +---------------------------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
         +--------------------------------+                       +--------------------------------+
         |     TECHNICAL RECRUITER        |                       |       SENIOR DEVELOPER         |
         |  - Sub-60s value delivery      |                       |  - Architecture & Algorithms   |
         |  - High-impact visual delivery |                       |  - Unredacted source files     |
         |  - Zero driving hurdles        |                       |  - Reproducible unit tests     |
         |  - Clear career credentials    |                       |  - Mathematical derivations    |
         +--------------------------------+                       +--------------------------------+
                         |                                                         |
                         +----------------------------+----------------------------+
                                                      v
                                  +---------------------------------------+
                                  |        FRONTIER DIRECTOR 2.0          |
                                  |  - Unified Navigation Controller      |
                                  |  - 3 Canonical Showcase Experiences   |
                                  |  - 6-Layer Engineering Proof Inspector|
                                  |  - 2D Server-Rendered Parity          |
                                  +---------------------------------------+
```

---

## 2. System Architecture & Topology

The Frontier Director 2.0 subsystem comprises five decoupled modules:

```
+---------------------------------------------------------------------------------------------------+
|                                     SUBSYSTEM TOPOLOGY                                            |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [App Router Deep Routes]               [Authoritative State Engine]            [UI & 3D Rigs]    |
|  - /experience                         - navigationController.ts               - WorldHUD.tsx    |
|  - /experience/[slug]                  - frontierDirectorStore.ts              - Launcher.tsx    |
|  - /experience/[slug]/evidence                          |                      - SelectorModal   |
|                 |                                       |                      - ProofInspector  |
|                 v                                       v                      - Presentation    |
|  +------------------------------+      +---------------------------------+            |           |
|  |     2D SSR Parity Engine     |      |  Unified Transition Coordinator |            |           |
|  |  - Complete 6-Layer Fallback | <==> |  - Pointer lock safety          | <==========+           |
|  |  - OpenGraph Meta Tags       |      |  - Button unblurring            |                        |
|  |  - Zero WebGL Requirement    |      |  - Ground clamping (depenetrate)|                        |
|  +------------------------------+      +---------------------------------+                        |
|                                                         |                                         |
|                                       +-----------------+-----------------+                       |
|                                       v                                   v                       |
|                        +------------------------------+    +------------------------------+       |
|                        |     Experience Registry      |    |      Evidence Registry       |       |
|                        |  - 3 Flagship Showcases      |    |  - 6-Layer Technical Proofs  |       |
|                        |  - 4 Presentation Steps      |    |  - Real Project Source Paths |       |
|                        |  - Camera Spline Waypoints   |    |  - Strict Provenance Badges  |       |
|                        +------------------------------+    +------------------------------+       |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Core Subsystems

### 3.1. Unified Navigation Transition Controller (`lib/frontierDirector/navigationController.ts`)
- **Authority:** Acts as the single point of truth for camera ownership and interaction mode arbitration.
- **Safety Invariants:**
  1. *Clean Pointer Lock Exit:* Calls `document.exitPointerLock()` before altering modes.
  2. *Active Focus Clearing:* Defensively blurs `document.activeElement` to prevent space/enter key capture.
  3. *Coordinate Depenetration:* Executes `depenetrate(x, z, 0.45)` against campus obstacle bounding boxes.
  4. *Surface Clamping:* Snaps player elevation to `getTerrainSurfaceY(x, z) + 1.65m`.
  5. *Tour Deconfliction:* Automatically calls `stopDroneTour()` to eliminate spline lock-ups.

### 3.2. Canonical Experience Registry (`lib/frontierDirector/experienceRegistry.ts`)
Three canonical showcases representing core technical competencies:
1. `motorsport`: 60 Hz point-mass physics, 100-bin distance-domain delta solving, corner apex detection.
2. `ai-ml`: Chronological time-series evaluation, 0.0% data leakage, conformal prediction intervals.
3. `systems`: 2,650 EPS telemetry streaming, 8-stage ingestion pipeline, 7-fault chaos isolation.

### 3.3. Engineering Proof Inspector (`components/director/EngineeringProofInspector.tsx`)
A 6-layer modal inspector displaying:
- **Layer 1: Problem Definition & Invariants** (Constraints, failure modes, industry context)
- **Layer 2: Architecture & Flow** (ASCII topologies, component matrices, boundary guarantees)
- **Layer 3: Algorithm & Implementation** (LaTeX formulations, complexity, annotated source code)
- **Layer 4: Reproducible Evidence** (Benchmarks, passing unit tests, sample JSON outputs)
- **Layer 5: Engineering Trade-offs** (Evaluated alternatives, pros/cons, known limitations)
- **Layer 6: Verified Source Files** (Repository links, line numbers, local reproduction commands)

### 3.4. Cinematic Presentation Engine (`components/director/CinematicPresentationEngine.tsx`)
- Drives Three.js camera framing smoothly across curated viewpoints.
- Renders cinematic lower-third HUD overlay with step narrative, technical bullets, and live progress bars.
- Supports reduced-motion overrides (instant snap instead of exponential lerp).

### 3.5. 2D Server-Rendered Parity Engine (`app/experience/*`)
- Eliminates the WebGL barrier entirely for mobile recruiters and low-power devices.
- Serves complete, unredacted technical evidence directly from Next.js server components with rich OpenGraph metadata.


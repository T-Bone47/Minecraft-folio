# FRONTIER X-RAY: BASELINE REPOSITORY AND ARCHITECTURE AUDIT

**Branch:** `feat/frontier-xray-engine`  
**Base Commit:** `c197da8` (derived from `codex/release-candidate-2026-11-08`)  
**Repository:** https://github.com/T-Bone47/Minecraft-folio  
**Date:** 2026-11-13  
**Auditor:** Principal Software Architect & Observability Systems Lead  

---

## 1. Executive Summary

This audit assesses the existing technical baseline of **ASISH: THE ENGINEERING FRONTIER** prior to implementing **FRONTIER X-RAY — THE ENGINEERING REALITY ENGINE**. 

The goal of Frontier X-Ray is not to rebuild existing gameplay or 3D campus infrastructure, but to construct a first-class **execution tracing, system observability, time machine, and reproducible laboratory layer** that allows technical recruiters and senior software engineers to look directly inside the software's execution while retaining physical world immersion.

---

## 2. Release Candidate CI & Blocker Resolution

Prior to branching `feat/frontier-xray-engine`, the release-candidate branch `codex/release-candidate-2026-11-08` was audited. Two timing and kinematic edge cases under low-framerate software WebGL (SwiftShader CPU runners) were identified and resolved on commit `c197da8`:

1. **Avatar Jump Kinematic Race Condition (`scripts/qa-avatar.mjs`):**
   - **Root Cause:** A jump test verified peak ascent height (`assert.ok((await pos())[1] > ground + .4)`) *after* taking a 2-second screenshot call under software rendering. Because gravity pulled the avatar back down to ground level in ~0.5s, the post-screenshot assertion failed.
   - **Fix:** Switched to event-driven `page.waitForFunction` capturing the peak airborne height atomically, guaranteeing reliable verification before taking landing screenshots.
2. **Vehicle Circular Track Tangent Deceleration (`scripts/qa-release-final.mjs`):**
   - **Root Cause:** Driving tests accelerating the car tangent to the circular track radius ($R=45\text{m}$) without steering collided with the outer wall barrier within 9.5 meters, repeatedly triggering physics collision penalty speed reductions (`speed *= 0.75`). Additionally, sequential DOM evaluation calls during deceleration sampled across two separate frames, causing `'1 km/h' !== '0 km/h'` string mismatches.
   - **Fix:** Installed `__frontierLapDriver` dynamic steering assistance along the circle centerline, expanded distance thresholds to accommodate low-framerate coasting, and performed atomic single-pass DOM evaluation of speed and label text.
   - **Status:** Both fixes verified locally (100% pass) and safely pushed to remote branch `codex/release-candidate-2026-11-08`.

---

## 3. Existing Systems Audited for Reuse

| Subsystem | Existing Path | Architectural Role | Reuse Strategy for Frontier X-Ray |
| :--- | :--- | :--- | :--- |
| **Living Engineering Digital Twin** | `lib/digitalTwin/`, `state/digitalTwinStore.ts` | 8-stage telemetry pipeline, distance-aligned delta analysis, lap ingestion | **Primary Target:** Instrument the 8 pipeline stages directly with typed spans and causal events. |
| **Vehicle Physics & Telemetry** | `components/vehicles/DriveableF1Car.tsx`, `lib/frontier/drive.ts` | 60Hz fixed-step simulation, telemetry sampling, boundary enforcement | Instrument sample generation and batch dispatch to trace simulation execution. |
| **Engineering Proof Inspector** | `components/frontier/EngineeringProofInspectorModal.tsx` | 6-layer modal (Problem, Math, Code, Tests, Benchmarks, 3D) | Extend with Stage-to-Source links and Time Machine diff view. |
| **Engineering Trials & Incident Engine** | `lib/frontierTrials/`, `components/frontier/PipelineStation.tsx` | Pipeline fault injection, diagnostics, schema repair, invariant validation | Direct foundation for **Push-to-Prove Experiment C (Systems Reliability)**. |
| **AI/ML Evaluation Lab** | `components/frontier/ExperimentStation.tsx` | Model training/evaluation, baseline comparison, classification & regression | Direct foundation for **Push-to-Prove Experiment B (AI/ML Evaluation)**. |
| **Telemetry Spatial Analysis** | `lib/digitalTwin/analysisEngine.ts` | Equidistant spatial interpolation, cumulative delta time, corner time loss | Direct foundation for **Push-to-Prove Experiment A (Motorsport Telemetry)**. |
| **Frontier Director 2.0** | `state/frontierDirectorStore.ts`, `components/frontier/FrontierDirectorOverlay.tsx` | Cinematic camera, role-specific showcase, deep-linking | Connect X-Ray trigger to Director showcases for Motorsport, AI/ML, and Software recruiters. |
| **NPC Workforce** | `components/npc/LivingNPCWorkforce.tsx` | Animated engineers, task routines, environmental reactivity | NPCs react to X-Ray activation and reference live execution states. |
| **Unified Navigation & Input** | `components/camera/FirstPersonPlayer.tsx`, `lib/frontier/input.ts` | Keyboard, mouse, touch, pointer lock, typing protection | Register `KeyX` toggle with strict typing and modal occlusion checks. |

---

## 4. Architectural Boundaries and Non-Negotiable Contracts

1. **Deterministic Execution:**
   - Tracing is purely observational and strictly side-effect free. Activating or deactivating X-Ray must NEVER alter the numerical outputs of vehicle simulation, delta analysis, or ML evaluation.
2. **Bounded Memory & Zero Secrets:**
   - Trace events must be stored in a bounded ring-buffer (maximum 1,000 events or 2MB total storage).
   - No personal credentials, tokens, or unhashed user text may be captured.
3. **True Provenance:**
   - Every piece of data must declare its provenance: `ACTUAL_RECORDED_EXECUTION`, `DETERMINISTIC_REPLAY`, `SIMULATOR_TELEMETRY`, `BUNDLED_TEST_FIXTURE`, or `VERIFIED_HISTORICAL_DEFECT`.
4. **2D Accessible Fallback:**
   - Direct web routes (`/engineering/xray`, `/engineering/history`, `/engineering/lab`) must provide the full technical substance without requiring WebGL or 3D navigation.

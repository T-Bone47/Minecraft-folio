# FRONTIER DIRECTOR 2.0 — CINEMATIC PRESENTATION ENGINE
**Project:** ASISH: THE ENGINEERING FRONTIER  
**Component:** `components/director/CinematicPresentationEngine.tsx`  
**Repository:** https://github.com/T-Bone47/Minecraft-folio  

---

## 1. Design Objectives

The Cinematic Presentation Engine delivers a professionally directed 60-second engineering demonstration that conveys technical depth without requiring manual avatar navigation or gaming familiarity.

---

## 2. Four-Phase Presentation Sequence

Every experience adheres to a standardized, structured 4-phase sequence:

```
+-----------------------------------------------------------------------------------+
|                        60-SECOND SHOWCASE TIMELINE                                |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [00s - 15s]          [15s - 30s]            [30s - 45s]            [45s - 60s]   |
|  PHASE 1: HOOK        PHASE 2: SIMULATION    PHASE 3: BREAKDOWN     PHASE 4: PROOF|
|  - Engineering        - Live Numerical       - Ingestion & Delta    - Direct      |
|    Problem              Solver In Action       Analysis Topology      Transition  |
|  - Real-World         - G-G Friction         - Four-Corner          - 6-Layer     |
|    Failure Mode         Envelope               Segmentation           Inspector   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Cinematic Camera System & Reduced Motion

### Camera Smoothing
During showcase playback, camera position and lookAt target interpolate toward curated facility viewpoints using exponential damping:
```typescript
const posAlpha = 1.0 - Math.exp(-2.5 * delta);
const lookAlpha = 1.0 - Math.exp(-3.0 * delta);

camera.position.lerp(targetPos, posAlpha);
lookAtTarget.current.lerp(targetLook, lookAlpha);
camera.lookAt(lookAtTarget.current);
```

### Accessibility & Reduced Motion
When `prefersReducedMotion` is detected or manually enabled in settings:
- Camera cuts immediately to the target viewpoint with zero interpolation.
- Eliminates motion sickness and vestibular discomfort for sensitive users.

---

## 4. Lower-Third Cinematic HUD

The cinematic HUD presents:
- **Phase Badge:** `HOOK`, `SIMULATION`, `BREAKDOWN`, `PROOF`.
- **Hook Headline:** Direct quotation framing the core technical dilemma.
- **Narrative Explanation:** Concise engineering summary.
- **Technical Bullet Grid:** Three specific architectural principles or algorithmic details.
- **Continuous Progress Bar:** Visual indicator of remaining time in the current phase.
- **Playback Controls:** Previous Step, Play/Pause, Next Step, Speed Multiplier (1x, 1.5x, 2x), Skip to Evidence, Exit to Campus.


# FRONTIER ENGINEERING TRIALS — ARCHITECTURE SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER

---

## 1. Executive Summary & Design Philosophy

The **Frontier Engineering Trials** system transforms the static inspection of a developer portfolio into an authoritative, playable engineering simulation. Rather than presenting visitors and recruiters with passive skill claims, the system drops them into active operational challenges across three primary engineering disciplines:

1. **Race Performance Engineering** (*"The Missing Four Tenths"*) — Telemetry spatial delta and corner apex velocity optimization.
2. **AI / Machine Learning Engineering** (*"The Model That Looked Perfect"*) — Detection of data leakage, target proxy contamination, and strict chronological time-series splitting.
3. **Systems Reliability Engineering** (*"The Broken Telemetry Pipeline"*) — Distributed stream ingestion, packet deduplication, and sliding-window monotonic reordering.

The architecture is built on three strict non-negotiables:
- **No Static Mocks**: All calculations execute in live client simulation with deterministic fixtures or active simulation loops.
- **Physical Campus Integration**: Interactive consoles and 3D voxel NPCs exist directly within the 3D voxel environment (`EngineeringHQ`, `F1Garage`, `AIMLLab`, `TelemetryTower`).
- **Zero Fabrication**: Every scenario connects directly to open-source implementations authored by Asish Oliver M (`lib/digitalTwin/analysis.ts`, `lib/frontier/ml.ts`, `lib/frontier/pipeline.ts`).

---

## 2. Core Subsystems & Data Flow

```
                      +-----------------------------+
                      |   WorldScene (Three.js)     |
                      |   3D Voxel Campus           |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v                                             v
     +-----------------+                           +-----------------+
     | TrialsNPCGroup  |                           |  EngineeringHQ  |
     | - Marcus Vance  |                           |  Trials Console |
     | - Dr. Thorne    |                           +--------+--------+
     | - Viktor Cole   |                                    |
     +--------+--------+                                    |
              | [E] Converse                                | [E] Enter
              +----------------------+----------------------+
                                     |
                                     v
                        +--------------------------+
                        |  useInteractionRegistry  |
                        +------------+-------------+
                                     |
                                     v
                          +---------------------+
                          |   useTrialsStore    |
                          |   (Zustand State)   |
                          +----------+----------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+------------------+       +-------------------+       +--------------------+
|  Scenario Data   |       | Evaluation Engine |       | Verification &     |
|  - Registry      |       | - Rubric (0-100%) |       | Technical Debrief  |
|  - Telemetry     |       | - Causal Sim      |       | - JSON Export      |
|  - Hypotheses    |       | - Trade-off Anal. |       | - Code References  |
+------------------+       +-------------------+       +--------------------+
```

---

## 3. Component Specification

### 3.1 Scenario Registry (`lib/trials/scenarioRegistry.ts`)
Central dispatcher mapping canonical division keys to scenario definitions:
- `racePerformanceTrial` (`race_performance_01`)
- `mlReliabilityTrial` (`ml_reliability_02`)
- `pipelineIncidentTrial` (`systems_reliability_03`)

### 3.2 Evaluation Engine (`lib/trials/evaluationEngine.ts`)
Authoritative scoring function:
$$\text{Score} = \text{Score}_{\text{hypo}} (50\%) + \text{Score}_{\text{action}} (40\%) + \text{Score}_{\text{evidence}} (10\%)$$
- **Resolved**: $\ge 85\%$ rubric score.
- **Partially Resolved**: $50\% \le \text{Score} < 85\%$.
- **Unresolved**: $< 50\%$.

### 3.3 State Management (`state/trialsStore.ts`)
Coordinates the full lifecycle across:
`AVAILABLE` $\rightarrow$ `BRIEFING` $\rightarrow$ `INVESTIGATING` $\rightarrow$ `DECISION_PENDING` $\rightarrow$ `EVALUATING` $\rightarrow$ `DEBRIEF` $\rightarrow$ `COMPLETED`.

---

## 4. Recruiter Fast-Track Integration

Recruiters can experience the trials in under 60 seconds through:
1. Operations Terminal "RECRUITER FAST-TRACK" button.
2. Step 7 of the Recruiter Walkthrough Modal (`RecruiterWalkthroughModal.tsx`).
3. Direct QA evaluation automation via `window.__trials`.


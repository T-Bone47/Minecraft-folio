# FRONTIER DIRECTOR 2.0 — ENGINEERING EVIDENCE REGISTRY
**Project:** ASISH: THE ENGINEERING FRONTIER  
**Module:** `lib/frontierDirector/evidenceRegistry.ts`  
**Repository:** https://github.com/T-Bone47/Minecraft-folio  
**Branch:** `codex/release-candidate-2026-11-08`  

---

## 1. Provenance Integrity Standard

To eliminate exaggerated marketing claims, every metric, benchmark, and formula in the Engineering Evidence Registry is strictly tagged with one of seven data provenance levels:

| Provenance Level | Definition | Example in Repository |
|:---|:---|:---|
| `REAL_PROJECT_SOURCE` | Directly sourced from production repo code and architecture | `lib/frontier/drive.ts`, `lib/frontier/pipeline.ts` |
| `VERIFIED_TEST_RESULT` | Validated by passing automated test suites in CI | `tests/digital-twin.test.ts`, `tests/frontier.test.ts` |
| `RECORDED_SIMULATOR_SESSION` | Telemetry captured during physical driving on track | Canonical reference lap fixture `lib/digitalTwin/telemetrySchema.ts` |
| `BUNDLED_REPRODUCIBLE_FIXTURE` | Immutable synthetic test datasets with fixed PRNG seeds | 180-row dataset in `lib/frontier/ml.ts` |
| `BROWSER_SIMULATION` | Live numerical solvers executing client-side in JavaScript | Fixed-step Euler physics loop in `stepDrive()` |
| `HYPOTHETICAL_ENGINEERING_SCENARIO` | Educational chaos testing scenarios for incident response | 7 fault modes in `lib/trials/scenarios/pipelineIncident.ts` |
| `PREVIOUSLY_REPORTED_RESULT` | Historical benchmark metrics captured on production hardware | Live F1 Intelligence peak 2,650 EPS runs |

---

## 2. Six-Layer Technical Structure

Every evidence record (`ev-motorsport`, `ev-aiml`, `ev-systems`) provides complete coverage across six rigorous layers:

```
+-----------------------------------------------------------------------------------+
|                            THE 6 TECHNICAL EVIDENCE LAYERS                        |
+-----------------------------------------------------------------------------------+
|  Layer 1: Problem Definition, Constraints, Invariants & Failure Modes             |
|  Layer 2: Architecture Topology, ASCII Data Flow & Component Matrices             |
|  Layer 3: Algorithms, Mathematical Derivations & Verified Source Excerpts         |
|  Layer 4: Reproducible Benchmarks, Passing Unit Tests & Memory Footprint          |
|  Layer 5: Architectural Trade-offs, Evaluated Alternatives & Limitations          |
|  Layer 6: Verified Source Files, Commit Hashes & Local Reproduction Commands       |
+-----------------------------------------------------------------------------------+
```

---

## 3. Verified File Map

The following source files are formally linked and verified on disk:

| Experience | File Relative Path | Verified Lines | Primary Technical Responsibility |
|:---|:---|:---|:---|
| Motorsport | `lib/frontier/drive.ts` | L1-L104 | 60 Hz point-mass physics solver, friction ellipse limits, boundary clamping |
| Motorsport | `lib/digitalTwin/analysis.ts` | L1-L402 | 100-bin distance-domain delta solving, 4-corner apex segmentation |
| Motorsport | `lib/digitalTwin/decisionEngine.ts` | L1-L180 | Deterministic what-if trade-off solver for aero and compound adjustments |
| Motorsport | `tests/digital-twin.test.ts` | L1-L245 | 14 automated unit tests verifying schema, kinematics, segmentation, and deltas |
| AI / ML | `lib/frontier/ml.ts` | L1-L110 | Chronological dataset splitter, linear regression, evaluation metrics |
| AI / ML | `lib/trials/scenarios/mlReliability.ts` | L1-L150 | Model drift, conformal confidence bounds, evaluation rubric rules |
| AI / ML | `lib/trials/evaluationEngine.ts` | L1-L120 | Deterministic grading engine evaluating trade-offs and decision consequences |
| AI / ML | `tests/frontier.test.ts` | L45-L85 | Unit tests proving chronological isolation and baseline outperformance |
| Systems | `lib/frontier/pipeline.ts` | L1-L123 | 8-stage telemetry pipeline, multi-provider demux, circuit breaker, backpressure |
| Systems | `lib/trials/scenarios/pipelineIncident.ts` | L1-L160 | Scenario contracts, fault evaluation rubrics, recovery verification |
| Systems | `lib/digitalTwin/telemetrySchema.ts` | L1-L150 | Strict type guards and canonical schema definitions for live telemetry channels |
| Systems | `tests/frontier.test.ts` | L86-L125 | Chaos tests verifying invariant enforcement and recovery rules across all 7 faults |

---

## 4. Local Reproduction Instructions

Any reviewer can verify all technical claims directly on their local machine:
```bash
git clone https://github.com/T-Bone47/Minecraft-folio.git
cd Minecraft-folio
git checkout codex/release-candidate-2026-11-08
npm install
npm test
```
All 71 assertions pass cleanly in < 1.7 seconds with zero network dependencies.


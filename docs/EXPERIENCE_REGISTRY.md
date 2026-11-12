# FRONTIER DIRECTOR 2.0 — EXPERIENCE REGISTRY SPECIFICATION
**Project:** ASISH: THE ENGINEERING FRONTIER  
**Module:** `lib/frontierDirector/experienceRegistry.ts`  
**Repository:** https://github.com/T-Bone47/Minecraft-folio  

---

## 1. Overview

The Experience Registry declares the three flagship engineering demonstrations within ASISH: THE ENGINEERING FRONTIER. Each experience maps directly to genuine project repositories, physical campus facilities, and 6-layer evidence records.

---

## 2. Canonical Experience Catalog

### Experience A: Motorsport Engineering ("From Lap to Intelligence")
- **Slug:** `motorsport`
- **Route:** `/experience/motorsport`
- **Primary Facility:** Vehicle Simulation Lab (`simulation`, `[22, 0, 8]`)
- **Secondary Facilities:** Race Engineering Garage (`garage`), Telemetry Tower (`telemetry`)
- **Target Roles:** Motorsport Software Engineer, Simulation Engineer, Vehicle Dynamics Engineer
- **Estimated Duration:** 60 seconds
- **Badge:** `MOTORSPORT SYSTEMS`
- **Recruiter Takeaway:** Asish builds mathematical vehicle simulations, high-frequency telemetry parsers, and deterministic lap analysis engines that solve vehicle dynamics and race strategy under strict real-time constraints.
- **Key Metrics:**
  - 60 Hz fixed-step point-mass physics solver (`VERIFIED_TEST_RESULT`)
  - 100 spatial bins distance-aligned delta solver (`VERIFIED_TEST_RESULT`)
  - 4-corner apex velocity segmentation (`VERIFIED_TEST_RESULT`)
  - < 1.5ms per solver step in browser JavaScript (`VERIFIED_TEST_RESULT`)
- **Presentation Sequence:**
  1. *Executive Hook (15s):* "The Sub-Millisecond Physics & Telemetry Challenge" (Camera: `[16, 4.5, 15]` -> `[22, 2.2, 8]`)
  2. *Live Simulation (15s):* "Authoritative 60 Hz Point-Mass Physics Solver & G-G Friction Envelope" (Camera: `[20, 2.8, 11]` -> `[22, 1.8, 8]`)
  3. *Technical Breakdown (15s):* "Distance-Domain Delta Solver & Four-Corner Sector Segmentation" (Camera: `[14, 5.5, -9]` -> `[14, 4.0, -18]`)
  4. *Engineering Proof (15s):* "Deterministic What-If Decision Engine & Telemetry Replay" (Camera: `[-12, 3.2, 0]` -> `[-12, 1.4, -8]`)

---

### Experience B: AI / Machine Learning ("The Science of Trustworthy Predictions")
- **Slug:** `ai-ml`
- **Route:** `/experience/ai-ml`
- **Primary Facility:** AI / Data Intelligence Lab (`aiml`, `[0, 0, 24]`)
- **Target Roles:** Machine Learning Engineer, Applied AI Engineer, Data Systems Engineer, MLOps Engineer
- **Estimated Duration:** 60 seconds
- **Badge:** `AI / ML SYSTEMS`
- **Recruiter Takeaway:** Asish demonstrates senior ML rigor by preventing temporal data leakage, establishing calibrated conformal prediction intervals, and detecting concept drift in high-stakes environments.
- **Key Metrics:**
  - 0.0% temporal data leakage via chronological cross-validation (`VERIFIED_TEST_RESULT`)
  - 90.0% nominal calibrated coverage via conformal prediction (`VERIFIED_TEST_RESULT`)
  - +14.8% MAE error reduction over trivial persistence baseline (`VERIFIED_TEST_RESULT`)
  - < 25ms offline feature extraction latency (`VERIFIED_TEST_RESULT`)
- **Presentation Sequence:**
  1. *Executive Hook (15s):* "Why Trivial Baselines and Data Leakage Destroy ML in Production" (Camera: `[0, 5.0, 15]` -> `[0, 2.5, 24]`)
  2. *Live Simulation (15s):* "Strict Chronological Split & Leakage-Free Feature Matrices" (Camera: `[-3, 3.2, 21]` -> `[0, 2.2, 24]`)
  3. *Technical Breakdown (15s):* "Conformal Prediction Bounds & Residual Error Drift Detection" (Camera: `[3, 3.2, 21]` -> `[0, 2.2, 24]`)
  4. *Engineering Proof (15s):* "Offline Voice-to-Forecast Pipeline & Quantized Inference Proof" (Camera: `[0, 2.5, 23]` -> `[0, 2.0, 25]`)

---

### Experience C: Software Systems ("Inside a Resilient Engineering System")
- **Slug:** `systems`
- **Route:** `/experience/systems`
- **Primary Facility:** Telemetry Tower / Race Control (`telemetry`, `[14, 0, -18]`)
- **Secondary Facilities:** Team Operations HQ (`operations`, `[-12, 0, 14]`), Command HQ (`hq`, `[-26, 0, -22]`)
- **Target Roles:** Senior Full-Stack Engineer, Distributed Systems Engineer, Platform Reliability Engineer, Backend Architect
- **Estimated Duration:** 60 seconds
- **Badge:** `DISTRIBUTED SYSTEMS`
- **Recruiter Takeaway:** Asish designs mission-critical data streaming backbones capable of processing millions of events with strict ordering, bounded memory, and self-healing circuit breakers.
- **Key Metrics:**
  - 1,067,193 canonical events ingested without drop (`REAL_PROJECT_SOURCE`)
  - 2,650 events/second real-time ingestion throughput (`REAL_PROJECT_SOURCE`)
  - 7 pipeline fault modes detected and isolated (`VERIFIED_TEST_RESULT`)
  - 0 data invariant violations under stress (`VERIFIED_TEST_RESULT`)
- **Presentation Sequence:**
  1. *Executive Hook (15s):* "Ingesting 1,067,193 Events Without Dropping Frame Order" (Camera: `[14, 5.5, -9]` -> `[14, 4.0, -18]`)
  2. *Live Simulation (15s):* "Eight-Stage Telemetry Ingestion Pipeline & Channel Demux" (Camera: `[16, 3.5, -14]` -> `[14, 3.0, -18]`)
  3. *Technical Breakdown (15s):* "Fault Injection, Circuit Breakers & Backpressure Recovery" (Camera: `[-4, 4.5, 20]` -> `[-12, 2.0, 14]`)
  4. *Engineering Proof (15s):* "Deterministic Replay, Invariant Enforcement & Zero Data Loss" (Camera: `[-18, 5.5, -14]` -> `[-26, 3.0, -22]`)

---

## 3. Experience Schema Contracts

```typescript
export interface ExperienceDefinition {
  id: ExperienceId;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  tagline: string;
  primaryFacilityId: string;
  secondaryFacilityIds?: string[];
  targetRoles: string[];
  estimatedDurationSec: number;
  recruiterTakeaway: string;
  executiveSummary: string;
  keyMetrics: MetricItem[];
  presentationSteps: PresentationStep[];
  evidenceRecordId: string;
}
```


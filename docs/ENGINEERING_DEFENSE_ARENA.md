# ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
## ENGINEERING DEFENSE ARENA ARCHITECTURE SPECIFICATION

---

### 1. Executive Mission & Philosophy

The **Engineering Defense Arena** turns static portfolio review on its head:

> **Don't just show engineering capability. Let visitors challenge and verify it.**

Instead of asking technical recruiters and engineering leaders to take code claims on faith, the Defense Arena invites them to act as senior software review boards and stress-test three real software systems:
1. **Systems Reliability**: Ingests faults into live telemetry pipelines, testing deduplication and bounded p99 latency.
2. **Motorsport Lap Delta**: Stress-tests distance-domain vs time-domain telemetry alignment across spatial sampling steps (2m to 50m).
3. **AI/ML Leakage Lab**: Proves why random k-fold on time-series telemetry produces deceptive 98% vanity accuracy, demonstrating strict temporal out-of-sample generalization.

---

### 2. The 3 Canonical Defense Tracks

```
                               ┌─────────────────────────────────┐
                               │    ENGINEERING DEFENSE ARENA    │
                               └────────────────┬────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌─────────────────────────────┐        ┌─────────────────────────────┐        ┌─────────────────────────────┐
│    Systems Reliability      │        │    Motorsport Lap Delta     │        │     AI/ML Leakage Lab       │
│  - Pipeline Fault Injection │        │  - Spatial Discretization   │        │  - Autocorrelation Leakage  │
│  - Dedup Window & Barriers  │        │  - Monotone PCHIP Splines   │        │  - Strict Temporal Holdout  │
│  - Bounded p99 Latency SLA  │        │  - Chicane Apex Fidelity    │        │  - Brier Calibration Bounds │
│  (Live F1 - Commit 975836a) │        │  (RaceMind - Commit 850d3c9)│        │ (Sentinel/RaceMind Strategy)│
└─────────────────────────────┘        └─────────────────────────────┘        └─────────────────────────────┘
```

---

### 3. State Management & Counterfactual Engine

The arena runs on a dual-execution state model:
1. **Baseline Run**: Executes with canonical recommended production parameters.
2. **Counterfactual Run**: Visitor modifies parameters (fault rate, step size, split strategy) to test specific failure modes.
3. **Differential Engine**: Computes exact $\Delta$ for throughput, latency, apex error, and generalization gap, identifying which invariants were broken or recovered.
4. **Frontier X-Ray Bridge**: Pushes execution stages into high-resolution monotonic trace spans with genuine Git permalinks.


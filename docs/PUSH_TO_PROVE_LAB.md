# FRONTIER X-RAY: PUSH-TO-PROVE ENGINEERING LAB
## Interactive Mathematical Algorithms & Client-Side Verification

---

## 1. Overview

The **Push-To-Prove Lab** provides executable, interactive mathematical algorithms allowing recruiters and senior engineers to test numerical implementations in real time.

All experiments are:
- **Pure & Deterministic**: Zero arbitrary delays or mock random outputs.
- **Client-Side Computed**: Executed directly within the browser runtime.
- **Defensible & Auditable**: Backed by source files and automated test suites.

---

## 2. The 3 Flagship Experiments

### Experiment A: Distance-Aligned Lap Telemetry Analysis (`exp_motorsport_telemetry`)
- **Subsystem**: Motorsport Telemetry
- **Mathematical Problem**: Time-based telemetry comparisons desynchronize when one lap is faster because samples at time $t$ correspond to different track positions $s$.
- **Algorithm**:
  1. Interpolates visitor and reference laps onto an equidistant spatial grid with step size $\Delta s = 2.0\text{ m}$.
  2. Solves spatial delta:
     $$\Delta t(s) = \int_{0}^{s} \left(\frac{1}{v_{\text{visitor}}(u)} - \frac{1}{v_{\text{ref}}(u)}\right) du$$
  3. Identifies corner apexes where $a_{\text{lateral}} = 0$ or local curvature reaches maximum.
  4. Computes apex speed deficits and cumulative time loss per sector.

---

### Experiment B: AI/ML Target Feature Leakage Detector (`exp_aiml_evaluation`)
- **Subsystem**: AI / ML Model Evaluation
- **Mathematical Problem**: High validation scores often mask severe data leakage (e.g. including features derived from the target variable).
- **Algorithm**:
  1. Generates synthetic telemetry records with physical tire wear, throttle, lateral acceleration, and speed.
  2. Includes or excludes the downstream target-correlated feature (`futureLapTime`).
  3. Fits an $L_2$-regularized linear model and evaluates $R^2$ and RMSE on held-out test splits.
  4. When leakage feature is included: $R^2 = 0.999$, triggering an untrustworthy leakage warning.
  5. When leakage feature is excluded: legitimate $R^2 \approx 0.842$, passing defensible generalization criteria.

---

### Experiment C: 8-Stage Pipeline Invariant Recovery (`exp_systems_reliability`)
- **Subsystem**: Distributed Telemetry Systems
- **Mathematical Problem**: High-frequency UDP telemetry is susceptible to frame reordering, clock drift, and schema corruption.
- **Algorithm**:
  1. Ingests packet stream and injects controlled faults (`OUT_OF_ORDER_TIMESTAMP`, `DUPLICATE_PACKET`, `SCHEMA_CORRUPTION`, `CLOCK_DRIFT`).
  2. Runs 8-stage verification pipeline enforcing strict monotonic sequencing:
     $$t_{k} > t_{k-1} \quad \forall k \ge 1$$
  3. When auto-repair is active: drops malformed frames, deduplicates timestamps, and re-sequences packets, proving fault tolerance and recovery.


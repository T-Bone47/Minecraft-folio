# TRIAL 2 — AI / MACHINE LEARNING ENGINEERING
## "THE MODEL THAT LOOKED PERFECT"
### Data Leakage, Target Proxy Detection & Chronological Split Verification

---

## 1. Operational Overview

- **Division**: AI / Machine Learning Engineering (`ml_reliability`)
- **Facility**: AI / ML Research & Tyre Modelling Lab (`[2, 0, 21]`)
- **Lead NPC**: Dr. Aris Thorne (AI Research Lead)
- **Data Provenance**: `DETERMINISTIC EVALUATION FIXTURE`
- **Discrepancy**: Offline Holdout $R^2 = 0.998$ ($RMSE = 0.0042$) vs Live Online Streaming $RMSE = 0.318$ (Catastrophic collapse)

---

## 2. Feature & Correlation Audit

| Feature Name | Correlation ($r$) | Importance Weight | Physical Description & Risk Assessment |
|---|---|---|---|
| `speed_kmh` | -0.42 | 0.14 | Instantaneous vehicle speed at telemetry sample. |
| `lateral_accel_g` | +0.61 | 0.22 | Lateral cornering acceleration. |
| `tyre_temp_c` | +0.58 | 0.19 | Surface temperature at corner entry. |
| **`post_event_temp_delta`** | **+0.994** | **0.41** | **TARGET PROXY LEAK: Recorded 1.2s AFTER corner exit; impossible at inference time.** |
| `ambient_track_temp_c` | +0.28 | 0.04 | Ambient tarmac temperature. |

### Splitting Methodology Flaw
The offline dataset utilized a **Random Uniform Shuffle (80/20 train/test)** across continuous time-series telemetry samples. High temporal autocorrelation allowed the neural network to memorize time points adjacent to the target, creating an illusion of 99.8% precision.

---

## 3. Engineering Resolution & Verification

- **Optimal Action**: Prune `post_event_temp_delta` and enforce **Chronological Block Partitioning** (Stints 1–3 for training, Stint 4 for holdout validation).
- **Resulting Metric**: Offline holdout settles honestly at $R^2 = 0.892$ ($RMSE = 0.038$), matching live streaming production performance ($RMSE = 0.041$).
- **Trade-Off**: Nominal benchmark score drops from 0.998 to 0.892, but delivers true real-world generalization.

---

## 4. Code References

- Feature engineering & temporal split contracts: `lib/frontier/ml.ts`
- Thermodynamic tyre friction solver: `lib/frontier/physics.ts`


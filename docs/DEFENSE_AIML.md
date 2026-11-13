# ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
## DEFENSE TRACK 3: AI/ML MODEL EVALUATION & LEAKAGE LAB

**Associated Project:** Sentinel AI & RaceMind Machine Learning  
**Source Commit:** `e2014234bdd9e7b9449c9569dbde0e3342b27873` / `850d3c9`  
**Primary Source File:** `sentinel-ai-backend/app/services/risk_intelligence.py`  
**Campus Facility:** AI & Machine Learning Research Facility (`aiml`)

---

### 1. Challenge Context: The Autocorrelation Leakage Trap
Tabular machine learning datasets built from continuous time-series telemetry (e.g. tyre degradation across 60 laps) exhibit strong autocorrelation between adjacent time steps.
Applying standard random cross-validation (e.g., `train_test_split(shuffle=True)`):
- Places Lap $N$ in the test set.
- Places Lap $N-1$ and Lap $N+1$ in the training set.
- Allows model weights to interpolate tyre temperature and track grip from neighboring laps.
- Results in deceptive **$98.4\%$ validation accuracy** that collapses when deployed trackside.

---

### 2. Empirical Split Strategy Comparison

| Strategy | Train Accuracy | Out-of-Sample Test | Overfit Gap | Temporal Leakage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Strict Temporal Split** | $87.4\%$ | **$84.2\%$** | $3.2\%$ | **None** ($t_{\text{train}} < t_{\text{test}}$) | **PASS (Honest)** |
| **Random K-Fold** | $98.4\%$ | **$97.8\%$** | $0.6\%$ | **Severe** (interleaved laps) | **FAIL (`INV_ZERO_TEMPORAL_LEAKAGE`)** |
| **Lookahead Transponder** | $99.8\%$ | **$62.4\%$** (on holdout) | $37.4\%$ | **Catastrophic** (future flag) | **FAIL (`INV_GENERALIZATION_GAP`)** |
| **Driver Holdout** | $86.5\%$ | **$81.2\%$** | $5.3\%$ | **None** (unseen driver styles) | **PASS** |

---

### 3. Engineering Conclusion
A senior ML engineering defense requires rejecting vanity metrics in favor of methodologically sound temporal holdouts. The $84.2\%$ generalized accuracy on unseen race laps represents true operational capability.

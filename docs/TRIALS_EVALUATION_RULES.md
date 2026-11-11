# FRONTIER ENGINEERING TRIALS — EVALUATION RULES & SCORING RUBRIC
## ASISH: THE ENGINEERING FRONTIER

---

## 1. Scoring Methodology

The evaluation engine (`lib/trials/evaluationEngine.ts`) scores visitor responses across three weighted dimensions:

$$\text{Final Rubric Score (0–100\%)} = \text{Hypothesis (50 pts)} + \text{Mitigation (40 pts)} + \text{Thoroughness (10 pts)}$$

### 1.1 Hypothesis Diagnosis (50% Weight)
- **Correct Diagnosis** (`isCorrect = true`): **50 Points**.
  - Identifies root causality backed by physics and logs.
- **Incorrect Diagnosis** (`isCorrect = false`): **0 Points**.
  - Confuses symptoms with causes (e.g. blaming engine power for slow corner apex speed).

### 1.2 Engineering Mitigation / Action (40% Weight)
- **Optimal Action** (`isOptimal = true`): **40 Points**.
  - Eliminates the bottleneck directly without secondary penalties.
- **Suboptimal but Constructive Action**: **15 Points**.
  - Addresses part of the issue with tolerable parasitic losses.
- **Counterproductive Action**: **5 Points**.
  - Introduces drag, data loss, or high latency without solving the primary fault.

### 1.3 Evidence Examination Thoroughness (10% Weight)
- **Thorough Investigation** ($\ge 3$ traces examined): **10 Points**.
- **Partial Investigation** (1–2 traces examined): **3.5–7.0 Points**.
- **No Evidence Inspected**: **0 Points**.

---

## 2. Status Classification Thresholds

| Total Score | Status | Description |
|---|---|---|
| **85% – 100%** | **`RESOLVED`** | Outstanding diagnosis & optimal resolution; passes full engineering scrutiny. |
| **50% – 84%** | **`PARTIALLY_RESOLVED`** | Correct diagnosis with suboptimal intervention, or vice versa. |
| **0% – 49%** | **`UNRESOLVED`** | Flawed diagnosis and counterproductive action. |


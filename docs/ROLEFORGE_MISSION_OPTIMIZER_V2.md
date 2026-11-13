# ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
## MISSION OPTIMIZER 2.0: BOUNDED WEIGHTED-COVERAGE OPTIMIZATION

---

### 1. The Optimization Problem

Visitors and recruiters visiting **ASISH: THE ENGINEERING FRONTIER** arrive with bounded attention windows:
- **`QUICK_90S`**: Maximum 90 seconds (2–3 high-impact interactive stations).
- **`PROFESSIONAL_5M`**: Maximum 300 seconds (4–6 deep architectural stations).
- **`DEEP_DIVE`**: Maximum 600 seconds (complete multi-system walkthrough).

Rather than showing an arbitrary linear tour, **Mission Optimizer 2.0** solves a constrained combinatorial optimization problem to select an ordered sequence of campus stations that maximizes verified requirement coverage while minimizing walking travel overhead and redundant demonstrations.

---

### 2. Mathematical Formulation

Given:
- A set of visitor requirements $R = \{r_1, r_2, \dots, r_m\}$ with weights $W_r = \text{priorityMultiplier}(r) \times \text{importance}(r)$.
- A set of candidate campus steps $C = \{c_1, c_2, \dots, c_n\}$ with duration $T_i$ and coordinates $p_i \in \mathbb{R}^3$.
- Candidate coverage mapping $\text{Cov}(c_i) \subseteq \text{Skills}$.
- Total visitor time budget $B \in \{90, 300, 600\}$.

We solve for binary decision variables $x_i \in \{0, 1\}$:

$$\max_{x} \sum_{r \in R} W_r \cdot \min\left(1, \sum_{i: r \in \text{Cov}(c_i)} x_i\right) - \lambda_{\text{redundancy}} \sum_{i < j} x_i x_j |\text{Cov}(c_i) \cap \text{Cov}(c_j)| - \lambda_{\text{travel}} \sum_{k=1}^{|S|} \|p_k - p_{k-1}\|$$

$$\text{subject to: } \sum_{i=1}^n x_i \cdot T_i \le B$$

#### Parameter Tuning:
- $\lambda_{\text{redundancy}} = 0.4$: Prevents selecting multiple stations demonstrating identical capabilities.
- $\lambda_{\text{travel}} = 0.04$: Discourages campus zig-zagging between distant facilities.
- Budget Constraint: Strictly enforced. $T_{\text{actual}} \le B$ with slack $\ge 0$. If $B < \min T_i$, the system emits an empty step set and switches to `fallbackMode: "EVIDENCE_ONLY_DOSSIER"`.

---

### 3. Solver Implementation

1. **Exact Branch-and-Bound ($N \le 15$)**:
   - Evaluates all combinations bounded by current best objective score and knapsack fractional relaxation.
   - Guarantees true mathematical optimality within milliseconds for the campus candidate space ($N = 8$).
2. **Greedy Marginal-Gain Heuristic ($N > 15$)**:
   - For dynamically generated or synthetic larger candidate pools, solves iteratively using marginal gain per unit time:
     $$\text{MarginalGain}(c_i \mid S) = \frac{\Delta \text{NetScore}(S \cup \{c_i\})}{T_i}$$

---

### 4. Explainable Step Decisions

Every compiled mission produces an `optimizationAudit` containing:
- `solverUsed`: `"EXACT_BRANCH_AND_BOUND"` or `"GREEDY_MARGINAL_GAIN"`.
- `slackSeconds`: Unused time budget ($B - T_{\text{actual}} \ge 0$).
- `routingDistanceMeters`: Total physical walking path length across campus.
- `stepDecisions`: Per-step audit detailing why each candidate was selected (marginal gain, requirements unlocked) or excluded (budget ceiling, duplicate coverage).

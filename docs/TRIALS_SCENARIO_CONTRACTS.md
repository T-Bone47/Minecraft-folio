# FRONTIER ENGINEERING TRIALS — SCENARIO CONTRACTS & TYPE SCHEMAS
## ASISH: THE ENGINEERING FRONTIER

---

## 1. System Contracts & Interfaces

Every engineering trial conforms to the `TrialScenario` interface defined in `lib/trials/types.ts`:

```typescript
export interface TrialScenario {
  id: string;
  division: TrialDivision;
  title: string;
  subtitle: string;
  facilityId: string;
  locationName: string;
  estimatedMinutes: number;
  npc: TrialNPC;
  briefing: string;
  initialInvestigationPrompt: string;
  investigationData: Record<string, unknown>;
  hypotheses: TrialHypothesis[];
  actions: TrialAction[];
  skillsDemonstrated: string[];
  codeReferences: CodeReference[];
  provenanceLabel:
    | "SIMULATOR-GENERATED TELEMETRY"
    | "DETERMINISTIC EVALUATION FIXTURE"
    | "FAULT-INJECTED TEST DATA";
}
```

---

## 2. Invariant Rules Across All Scenarios

1. **Deterministic Resolution**: The evaluation engine must produce identical scores and consequences given the same hypothesis, action, and evidence inputs.
2. **Exactly One Correct Diagnosis**: Each trial provides $\ge 3$ hypotheses, of which exactly one is physically and mathematically correct.
3. **Exactly One Optimal Action**: Each trial provides $\ge 3$ engineering actions, of which exactly one optimizes the target metric without introducing catastrophic parasitic penalties.
4. **Transparent Trade-Off Disclosure**: Every action—even the optimal one—must document real physical or architectural trade-offs (e.g. slight lockup risk, small buffer latency, lower nominal training score).
5. **No State Pollution**: Trials run in isolated memory scopes; investigating or resetting a trial never mutates the underlying `digitalTwinStore` lap record or baseline physics constants.


import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_TRIALS,
  getTrialById,
  getTrialByDivision,
  getAllNPCs,
} from "@/lib/trials/scenarioRegistry";
import { evaluateTrial } from "@/lib/trials/evaluationEngine";
import { useTrialsStore } from "@/state/trialsStore";

test("Frontier Engineering Trials registry integrity and division coverage", () => {
  assert.equal(ALL_TRIALS.length, 3);

  const divisions = ALL_TRIALS.map((t) => t.division);
  assert.ok(divisions.includes("race_performance"));
  assert.ok(divisions.includes("ml_reliability"));
  assert.ok(divisions.includes("systems_reliability"));

  // Verify each trial contract
  for (const trial of ALL_TRIALS) {
    assert.ok(trial.id.length > 0);
    assert.ok(trial.title.length > 0);
    assert.ok(trial.subtitle.length > 0);
    assert.ok(trial.briefing.length > 0);
    assert.ok(trial.estimatedMinutes > 0);
    assert.ok(trial.provenanceLabel);

    // Hypotheses: exactly one correct hypothesis per scenario
    assert.ok(trial.hypotheses.length >= 3);
    const correctCount = trial.hypotheses.filter((h) => h.isCorrect).length;
    assert.equal(
      correctCount,
      1,
      `Scenario ${trial.id} must have exactly one correct hypothesis`
    );

    // Actions: exactly one optimal action per scenario
    assert.ok(trial.actions.length >= 3);
    const optimalCount = trial.actions.filter((a) => a.isOptimal).length;
    assert.equal(
      optimalCount,
      1,
      `Scenario ${trial.id} must have exactly one optimal action`
    );

    // Skills demonstrated & code references
    assert.ok(trial.skillsDemonstrated.length >= 2);
    assert.ok(trial.codeReferences.length >= 1);
  }
});

test("Trial NPCs have complete dialogue states and valid spatial approach coordinates", () => {
  const npcs = getAllNPCs();
  assert.equal(npcs.length, 3);

  for (const npc of npcs) {
    assert.ok(npc.id.length > 0);
    assert.ok(npc.name.length > 0);
    assert.ok(npc.role.length > 0);
    assert.equal(npc.coordinates.length, 3);

    const d = npc.dialogue;
    assert.ok(d.greeting.length > 0);
    assert.ok(d.briefing.length > 0);
    assert.ok(d.hint.length > 0);
    assert.ok(d.duringInvestigation.length > 0);
    assert.ok(d.onWrongHypothesis.length > 0);
    assert.ok(d.onCorrectDiagnosis.length > 0);
    assert.ok(d.onOptimalAction.length > 0);
    assert.ok(d.onSuboptimalAction.length > 0);
    assert.ok(d.completion.length > 0);
  }
});

test("Evaluation Engine computes deterministic rubric scores and causal consequences", () => {
  const raceTrial = getTrialById("race_performance_01")!;
  assert.ok(raceTrial);

  const correctHypo = raceTrial.hypotheses.find((h) => h.isCorrect)!;
  const wrongHypo = raceTrial.hypotheses.find((h) => !h.isCorrect)!;
  const optimalAction = raceTrial.actions.find((a) => a.isOptimal)!;
  const suboptimalAction = raceTrial.actions.find((a) => !a.isOptimal)!;

  // Case 1: Optimal resolution with thorough evidence
  const resultOptimal = evaluateTrial({
    scenario: raceTrial,
    selectedHypothesis: correctHypo,
    selectedAction: optimalAction,
    evidenceExamined: ["turn3_telemetry", "corner_3", "apex_speed"],
  });

  assert.equal(resultOptimal.status, "RESOLVED");
  assert.ok(resultOptimal.scorePct >= 90 && resultOptimal.scorePct <= 100);
  assert.ok(resultOptimal.observedConsequences.length > 0);
  assert.ok(resultOptimal.reasoning.includes("Diagnostic Assessment"));

  // Case 2: Correct diagnosis but suboptimal mitigation
  const resultPartial = evaluateTrial({
    scenario: raceTrial,
    selectedHypothesis: correctHypo,
    selectedAction: suboptimalAction,
    evidenceExamined: ["turn3_telemetry"],
  });

  assert.equal(resultPartial.status, "PARTIALLY_RESOLVED");
  assert.ok(resultPartial.scorePct >= 50 && resultPartial.scorePct < 85);

  // Case 3: Wrong diagnosis
  const resultFailed = evaluateTrial({
    scenario: raceTrial,
    selectedHypothesis: wrongHypo,
    selectedAction: suboptimalAction,
    evidenceExamined: [],
  });

  assert.equal(resultFailed.status, "UNRESOLVED");
  assert.ok(resultFailed.scorePct < 50);
});

test("Trials Store manages state transitions and persists completed evaluations", () => {
  const store = useTrialsStore.getState();
  store.resetTrial();

  assert.equal(useTrialsStore.getState().trialState, "AVAILABLE");
  assert.equal(useTrialsStore.getState().activeTrialId, null);

  // Start trial
  store.startTrial("ml_reliability_02", "independent");
  assert.equal(useTrialsStore.getState().activeTrialId, "ml_reliability_02");
  assert.equal(useTrialsStore.getState().trialState, "BRIEFING");
  assert.equal(useTrialsStore.getState().guidanceMode, "independent");

  // Advance to investigation
  store.advanceToInvestigation();
  assert.equal(useTrialsStore.getState().trialState, "INVESTIGATING");

  // Examine evidence
  store.examineEvidence("target_leakage_feature");
  assert.ok(
    useTrialsStore.getState().evidenceExamined.includes("target_leakage_feature")
  );

  // Select hypothesis & action
  const mlTrial = getTrialById("ml_reliability_02")!;
  const correctHypo = mlTrial.hypotheses.find((h) => h.isCorrect)!;
  const optimalAct = mlTrial.actions.find((a) => a.isOptimal)!;

  store.selectHypothesis(correctHypo.id);
  assert.equal(useTrialsStore.getState().trialState, "DECISION_PENDING");
  assert.equal(useTrialsStore.getState().selectedHypothesisId, correctHypo.id);

  store.selectAction(optimalAct.id);
  assert.equal(useTrialsStore.getState().selectedActionId, optimalAct.id);

  // Submit evaluation
  const result = store.submitEvaluation();
  assert.ok(result);
  assert.equal(result?.status, "RESOLVED");
  assert.ok(useTrialsStore.getState().completedTrials["ml_reliability_02"]);

  // Clean reset
  store.resetTrial();
  assert.equal(useTrialsStore.getState().activeTrialId, null);
  assert.equal(useTrialsStore.getState().trialState, "AVAILABLE");
});


/**
 * FRONTIER ENGINEERING TRIALS — EVALUATION ENGINE
 * Authoritative scoring, causal simulation, and transparent evidence generation.
 */

import type {
  TrialScenario,
  TrialHypothesis,
  TrialAction,
  TrialEvaluationResult,
} from "./types";

export interface EvaluationInput {
  scenario: TrialScenario;
  selectedHypothesis: TrialHypothesis;
  selectedAction: TrialAction;
  evidenceExamined?: string[];
}

export function evaluateTrial(input: EvaluationInput): TrialEvaluationResult {
  const { scenario, selectedHypothesis, selectedAction, evidenceExamined = [] } =
    input;

  // 1. Scoring Rubric
  // Hypothesis Diagnosis: 50%
  let hypothesisScore = 0;
  if (selectedHypothesis.isCorrect) {
    hypothesisScore = 50;
  }

  // Action / Mitigation Selection: 40%
  let actionScore = 0;
  if (selectedAction.isOptimal) {
    actionScore = 40;
  } else if (
    selectedAction.simulatedDeltaS !== undefined &&
    selectedAction.simulatedDeltaS < 0.2
  ) {
    // Non-disastrous partial attempt
    actionScore = 15;
  } else {
    actionScore = 5;
  }

  // Evidence Examination Thoroughness: 10%
  const evidenceScore = Math.min(10, evidenceExamined.length * 3.5);

  const totalScorePct = Math.round(hypothesisScore + actionScore + evidenceScore);

  // Status mapping
  let status: "RESOLVED" | "PARTIALLY_RESOLVED" | "UNRESOLVED";
  if (totalScorePct >= 85) {
    status = "RESOLVED";
  } else if (totalScorePct >= 50) {
    status = "PARTIALLY_RESOLVED";
  } else {
    status = "UNRESOLVED";
  }

  // Build causal consequence summary
  const observedConsequences = `${selectedHypothesis.feedback} Resulting Action Impact: ${selectedAction.consequences}`;

  const reasoning = [
    `Diagnostic Assessment: ${selectedHypothesis.technicalReasoning}`,
    `Engineering Intervention: Selected "${selectedAction.label}".`,
    selectedAction.isOptimal
      ? "Action directly targets the root physical/architectural bottleneck without introducing secondary parasitic losses."
      : "Action is suboptimal: it incurs parasitic trade-offs or fails to eliminate the primary bottleneck.",
  ].join(" ");

  return {
    trialId: scenario.id,
    division: scenario.division,
    title: scenario.title,
    status,
    scorePct: totalScorePct,
    selectedHypothesis,
    selectedAction,
    evidenceExamined,
    observedConsequences,
    reasoning,
    tradeOffs: selectedAction.tradeOffs,
    skillsDemonstrated: scenario.skillsDemonstrated,
    simulatedDeltaS: selectedAction.simulatedDeltaS,
    timestamp: new Date().toISOString(),
    provenanceLabel: scenario.provenanceLabel,
  };
}


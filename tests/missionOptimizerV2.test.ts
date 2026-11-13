import test from "node:test";
import assert from "node:assert/strict";

import {
  compileMissionV2,
  solveExactBranchAndBound,
  solveGreedyMarginalGain,
  evaluateObjective,
  CANONICAL_STEP_CANDIDATES,
  StepCandidateV2,
} from "../lib/roleforge/missionOptimizerV2";
import { getRolePresetBySlug } from "../lib/roleforge/skillTaxonomy";
import { createRequirementsFromPreset } from "../lib/roleforge/requirementNormalizer";

test("Mission Optimizer 2.0 — strictly obeys QUICK_90S budget constraint (<= 90s)", () => {
  const preset = getRolePresetBySlug("motorsport")!;
  assert.ok(preset, "Motorsport preset must exist");
  const reqs = createRequirementsFromPreset(preset);

  const mission = compileMissionV2({
    roleTitle: preset.title,
    roleSlug: preset.slug,
    requirements: reqs,
    budget: "QUICK_90S",
  });

  assert.ok(mission.totalDurationSeconds <= 90, `Total duration must be <= 90s, got ${mission.totalDurationSeconds}s`);
  assert.ok(mission.optimizationAudit.slackSeconds >= 0, "Slack seconds must be non-negative");
  assert.strictEqual(mission.optimizationAudit.budgetSeconds, 90);
  assert.strictEqual(mission.optimizationAudit.solverUsed, "EXACT_BRANCH_AND_BOUND");
  assert.ok(mission.steps.length > 0, "Should select at least one step within 90s");
});

test("Mission Optimizer 2.0 — strictly obeys PROFESSIONAL_5M budget constraint (<= 300s)", () => {
  const preset = getRolePresetBySlug("backend-systems")!;
  assert.ok(preset, "Backend systems preset must exist");
  const reqs = createRequirementsFromPreset(preset);

  const mission = compileMissionV2({
    roleTitle: preset.title,
    roleSlug: preset.slug,
    requirements: reqs,
    budget: "PROFESSIONAL_5M",
  });

  assert.ok(mission.totalDurationSeconds <= 300, `Total duration must be <= 300s, got ${mission.totalDurationSeconds}s`);
  assert.ok(mission.optimizationAudit.slackSeconds >= 0, "Slack seconds must be non-negative");
  assert.strictEqual(mission.optimizationAudit.budgetSeconds, 300);
});

test("Mission Optimizer 2.0 — handles tight budgets by activating EVIDENCE_ONLY_DOSSIER fallback", () => {
  const preset = getRolePresetBySlug("aiml")!;
  assert.ok(preset);
  const reqs = createRequirementsFromPreset(preset);

  // If budget is smaller than shortest candidate step (25s)
  const result = solveExactBranchAndBound(CANONICAL_STEP_CANDIDATES, reqs, 10);
  assert.strictEqual(result.bestSubset.length, 0, "Subset should be empty if budget < 25s");

  const customCandidates: StepCandidateV2[] = [
    {
      ...CANONICAL_STEP_CANDIDATES[0],
      estimatedDurationSeconds: 100, // exceeds 90s
    },
  ];

  const mission = compileMissionV2({
    roleTitle: "Hypothetical Restricted Role",
    roleSlug: "restricted-role",
    requirements: reqs,
    budget: "QUICK_90S",
    candidateSteps: customCandidates,
  });

  assert.strictEqual(mission.steps.length, 0);
  assert.strictEqual(mission.optimizationAudit.fallbackMode, "EVIDENCE_ONLY_DOSSIER");
  assert.strictEqual(mission.totalDurationSeconds, 0);
});

test("Mission Optimizer 2.0 — generates explainable step decisions for both included and excluded steps", () => {
  const preset = getRolePresetBySlug("data-engineer")!;
  const reqs = createRequirementsFromPreset(preset);

  const mission = compileMissionV2({
    roleTitle: preset.title,
    roleSlug: preset.slug,
    requirements: reqs,
    budget: "QUICK_90S",
  });

  const decisions = mission.optimizationAudit.stepDecisions;
  assert.ok(decisions.length >= CANONICAL_STEP_CANDIDATES.length);

  const selectedDecisions = decisions.filter((d) => d.selected);
  const excludedDecisions = decisions.filter((d) => !d.selected);

  assert.ok(selectedDecisions.length > 0, "Should have selected steps");
  assert.ok(excludedDecisions.length > 0, "Should have excluded steps for 90s budget");

  for (const s of selectedDecisions) {
    assert.ok(s.explanation.includes("Selected:"), "Selected decision must have informative explanation");
    assert.ok(s.marginalGain >= 0, "Marginal gain should be >= 0");
  }

  for (const e of excludedDecisions) {
    assert.ok(e.explanation.includes("Excluded:"), "Excluded decision must explain reason for exclusion");
  }
});

test("Mission Optimizer 2.0 — greedy marginal gain solver handles candidate sets > 15 within budget", () => {
  const preset = getRolePresetBySlug("motorsport")!;
  const reqs = createRequirementsFromPreset(preset);

  // Generate 20 synthetic candidates
  const largeCandidatePool: StepCandidateV2[] = Array.from({ length: 20 }, (_, i) => ({
    ...CANONICAL_STEP_CANDIDATES[i % CANONICAL_STEP_CANDIDATES.length],
    id: `synth-step-${i}`,
    title: `Synthetic Step ${i}`,
    estimatedDurationSeconds: 20 + (i % 15),
  }));

  const result = solveGreedyMarginalGain(largeCandidatePool, reqs, 90);
  const duration = result.bestSubset.reduce((sum, s) => sum + s.estimatedDurationSeconds, 0);

  assert.ok(duration <= 90, `Heuristic duration must be <= 90s, got ${duration}s`);
  assert.ok(result.bestScore > 0, "Heuristic should find non-zero score");
});

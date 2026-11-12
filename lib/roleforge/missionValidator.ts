/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Mission Validator
 *
 * Verifies budget adherence, required coverage, and coordinate bounds.
 */

import { BUDGET_LIMITS_SECONDS } from "./missionCompiler";
import type { CompiledMission } from "./types";

export interface MissionValidationResult {
  valid: boolean;
  budgetAdherence: {
    budgetSeconds: number;
    actualSeconds: number;
    withinBudget: boolean;
  };
  coverage: {
    totalRequirements: number;
    coveredCount: number;
    uncoveredCount: number;
    uncoveredRequiredCount: number;
  };
  warnings: string[];
  errors: string[];
}

export function validateCompiledMission(
  mission: CompiledMission
): MissionValidationResult {
  const budgetSeconds = BUDGET_LIMITS_SECONDS[mission.visitorBudget] || 300;
  // Allow a 15% grace threshold for budget
  const maxAllowedSeconds = budgetSeconds * 1.15;
  const withinBudget = mission.totalDurationSeconds <= maxAllowedSeconds;

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!withinBudget) {
    warnings.push(
      `Mission duration (${mission.totalDurationSeconds}s) exceeds ${mission.visitorBudget} budget (${budgetSeconds}s) beyond tolerance.`
    );
  }

  if (mission.steps.length === 0) {
    errors.push("Compiled mission contains zero steps.");
  }

  // Validate step index sequence and coordinates
  mission.steps.forEach((step, idx) => {
    if (step.stepIndex !== idx + 1) {
      warnings.push(`Step index mismatch: expected ${idx + 1}, got ${step.stepIndex}`);
    }
    if (!step.coordinates || step.coordinates.length !== 3) {
      errors.push(`Step ${step.id} has invalid 3D coordinates.`);
    }
    if (!step.approachLookAt || step.approachLookAt.length !== 3) {
      errors.push(`Step ${step.id} has invalid look-at target.`);
    }
  });

  // Calculate coverage stats
  const allReqs = mission.matchedRequirements.map((m) => m.requirement);
  const totalRequirements = allReqs.length;
  const uncoveredCount = mission.uncoveredRequirements.length;
  const coveredCount = totalRequirements - uncoveredCount;

  const uncoveredRequired = mission.uncoveredRequirements.filter(
    (r) => r.priority === "REQUIRED"
  );

  if (uncoveredRequired.length > 0) {
    warnings.push(
      `${uncoveredRequired.length} REQUIRED requirements could not be demonstrated within the selected time budget: ${uncoveredRequired.map((r) => r.skillName).join(", ")}.`
    );
  }

  return {
    valid: errors.length === 0,
    budgetAdherence: {
      budgetSeconds,
      actualSeconds: mission.totalDurationSeconds,
      withinBudget,
    },
    coverage: {
      totalRequirements,
      coveredCount,
      uncoveredCount,
      uncoveredRequiredCount: uncoveredRequired.length,
    },
    warnings,
    errors,
  };
}


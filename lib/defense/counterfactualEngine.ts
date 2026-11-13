/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Counterfactual Engineering Engine
 *
 * Compares a baseline system execution against an alternative counterfactual parameter state.
 * Generates structured metric deltas, tracks invariant state transitions (resolved vs broken),
 * and produces causal explanations.
 */

import { executeDefenseTrack } from "./scenarioRegistry";
import type {
  DefenseComparison,
  DefenseExecutionResult,
  DefenseTrackId,
} from "./types";

/**
 * Executes baseline and counterfactual runs, generating a comparison report.
 */
export function runCounterfactualComparison(
  trackId: DefenseTrackId,
  baselineParams: Record<string, any>,
  counterfactualParams: Record<string, any>,
  hypothesisId?: string
): DefenseComparison {
  const baseline = executeDefenseTrack(trackId, baselineParams);
  const counterfactual = executeDefenseTrack(trackId, counterfactualParams, hypothesisId);

  // 1. Calculate metric deltas
  const metricDeltas: DefenseComparison["metricDeltas"] = {};

  for (const bMetric of baseline.metrics) {
    const cMetric = counterfactual.metrics.find((m) => m.key === bMetric.key);
    if (cMetric) {
      const delta = Math.round((cMetric.value - bMetric.value) * 1000) / 1000;
      const percentChange =
        bMetric.value !== 0
          ? Math.round((delta / bMetric.value) * 1000) / 10
          : 0;

      // Determine whether higher or lower is better
      const lowerIsBetter =
        bMetric.key.toLowerCase().includes("latency") ||
        bMetric.key.toLowerCase().includes("error") ||
        bMetric.key.toLowerCase().includes("gap") ||
        bMetric.key.toLowerCase().includes("drop");

      const improved = lowerIsBetter ? delta < 0 : delta > 0;

      metricDeltas[bMetric.key] = {
        label: bMetric.label,
        baselineVal: bMetric.value,
        counterfactualVal: cMetric.value,
        delta,
        percentChange,
        improved,
        unit: bMetric.unit,
      };
    }
  }

  // 2. Track Invariant state changes
  const invariantsResolved: string[] = [];
  const invariantsBroken: string[] = [];

  for (const bInv of baseline.invariants) {
    const cInv = counterfactual.invariants.find((i) => i.id === bInv.id);
    if (cInv) {
      if (!bInv.passed && cInv.passed) {
        invariantsResolved.push(cInv.name);
      } else if (bInv.passed && !cInv.passed) {
        invariantsBroken.push(cInv.name);
      }
    }
  }

  // 3. Synthesize engineering conclusion
  let conclusion = "";
  if (trackId === "systems-reliability") {
    if (invariantsBroken.length > 0) {
      conclusion = `Counterfactual configuration degraded system invariants (${invariantsBroken.join(", ")}). Head-of-line blocking or late drops compromised stream SLAs.`;
    } else if (invariantsResolved.length > 0) {
      conclusion = `Counterfactual configuration successfully recovered broken invariants (${invariantsResolved.join(", ")}). Monotonic ordering and dedup guarantees restored.`;
    } else {
      conclusion = `Invariants remained stable across parameter modification. Latency delta: ${metricDeltas.p99Latency?.delta > 0 ? "+" : ""}${metricDeltas.p99Latency?.delta || 0}ms.`;
    }
  } else if (trackId === "motorsport-lap-delta") {
    if (invariantsBroken.length > 0) {
      conclusion = `Coarse discretization failed to capture apex velocity in tight turns (${invariantsBroken.join(", ")}). Discretization error spiked.`;
    } else {
      conclusion = `Spatial distance realignment maintained monotonic integration. Net delta shift: ${metricDeltas.netLapDelta?.delta > 0 ? "+" : ""}${metricDeltas.netLapDelta?.delta || 0}s.`;
    }
  } else if (trackId === "aiml-model-leakage") {
    if (invariantsBroken.length > 0) {
      conclusion = `Methodological leakage detected (${invariantsBroken.join(", ")}). Apparent high accuracy is an artifact of train/test data leakage.`;
    } else {
      conclusion = `Strict temporal validation confirmed true out-of-sample generalization. Overfit gap is bounded and honest.`;
    }
  }

  return {
    trackId,
    baseline,
    counterfactual,
    metricDeltas,
    invariantsResolved,
    invariantsBroken,
    conclusion,
  };
}


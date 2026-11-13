/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Scenario Registry & Execution Dispatcher
 */

import type {
  DefenseExecutionResult,
  DefenseHypothesis,
  DefenseParameter,
  DefenseTrackId,
  TechnicalReviewSection,
} from "./types";
import {
  SYSTEMS_RELIABILITY_PARAMETERS,
  SYSTEMS_RELIABILITY_HYPOTHESES,
  SYSTEMS_RELIABILITY_REVIEW,
  runSystemsReliabilitySimulation,
} from "./scenarios/systemsReliability";
import {
  MOTORSPORT_LAP_PARAMETERS,
  MOTORSPORT_LAP_HYPOTHESES,
  MOTORSPORT_LAP_REVIEW,
  runMotorsportLapDeltaSimulation,
} from "./scenarios/motorsportLapDelta";
import {
  MODEL_LEAKAGE_PARAMETERS,
  MODEL_LEAKAGE_HYPOTHESES,
  MODEL_LEAKAGE_REVIEW,
  runModelLeakageSimulation,
} from "./scenarios/modelLeakage";

export interface DefenseTrackConfig {
  id: DefenseTrackId;
  title: string;
  shortTitle: string;
  discipline: string;
  description: string;
  badge: string;
  color: string; // Accent color hex
  facilityId: string;
  associatedProjectId: string;
  parameters: DefenseParameter[];
  hypotheses: DefenseHypothesis[];
  review: TechnicalReviewSection;
  runSimulation: (params: Record<string, any>, hypothesisId?: string) => DefenseExecutionResult;
}

export const DEFENSE_TRACKS: Record<DefenseTrackId, DefenseTrackConfig> = {
  "systems-reliability": {
    id: "systems-reliability",
    title: "Systems Reliability & Pipeline Invariants",
    shortTitle: "Systems Pipeline",
    discipline: "Distributed Systems & Telemetry Streaming",
    description: "Inject packet loss, duplicated sequence IDs, and network jitter into real-time telemetry streams. Verify zero duplicate writes and bounded p99 latency.",
    badge: "FAULT INJECTION",
    color: "#22D3EE", // Cyan
    facilityId: "telemetry",
    associatedProjectId: "live-f1",
    parameters: SYSTEMS_RELIABILITY_PARAMETERS,
    hypotheses: SYSTEMS_RELIABILITY_HYPOTHESES,
    review: SYSTEMS_RELIABILITY_REVIEW,
    runSimulation: runSystemsReliabilitySimulation,
  },
  "motorsport-lap-delta": {
    id: "motorsport-lap-delta",
    title: "Motorsport Lap Delta & Sensitivity Analysis",
    shortTitle: "Motorsport Lap Delta",
    discipline: "Vehicle Dynamics & Spatial Discretization",
    description: "Challenge distance-domain vs time-domain telemetry alignment. Vary spatial bin resolution and test chicane apex speed reconstruction fidelity.",
    badge: "SPATIAL PHYSICS",
    color: "#D71D35", // Crimson
    facilityId: "garage",
    associatedProjectId: "racemind",
    parameters: MOTORSPORT_LAP_PARAMETERS,
    hypotheses: MOTORSPORT_LAP_HYPOTHESES,
    review: MOTORSPORT_LAP_REVIEW,
    runSimulation: runMotorsportLapDeltaSimulation,
  },
  "aiml-model-leakage": {
    id: "aiml-model-leakage",
    title: "AI/ML Model Evaluation & Counterfactual Leakage",
    shortTitle: "AI Leakage Lab",
    discipline: "Machine Learning & Evaluation Benchmarking",
    description: "Expose the danger of random cross-validation on time-series telemetry. Compare leaked 98% vanity accuracy against honest 84% out-of-sample generalization.",
    badge: "ML INTEGRITY",
    color: "#10B981", // Emerald
    facilityId: "aiml",
    associatedProjectId: "sentinel",
    parameters: MODEL_LEAKAGE_PARAMETERS,
    hypotheses: MODEL_LEAKAGE_HYPOTHESES,
    review: MODEL_LEAKAGE_REVIEW,
    runSimulation: runModelLeakageSimulation,
  },
};

export function getDefenseTrack(trackId: DefenseTrackId): DefenseTrackConfig | undefined {
  return DEFENSE_TRACKS[trackId];
}

export function getAllDefenseTracks(): DefenseTrackConfig[] {
  return Object.values(DEFENSE_TRACKS);
}

export function getDefaultParameters(trackId: DefenseTrackId): Record<string, any> {
  const track = getDefenseTrack(trackId);
  if (!track) return {};
  const defaults: Record<string, any> = {};
  for (const p of track.parameters) {
    defaults[p.id] = p.defaultValue;
  }
  return defaults;
}

export function executeDefenseTrack(
  trackId: DefenseTrackId,
  params: Record<string, any>,
  hypothesisId?: string
): DefenseExecutionResult {
  const track = getDefenseTrack(trackId);
  if (!track) {
    throw new Error(`Unknown defense track: "${trackId}"`);
  }
  const mergedParams = { ...getDefaultParameters(trackId), ...params };
  return track.runSimulation(mergedParams, hypothesisId);
}

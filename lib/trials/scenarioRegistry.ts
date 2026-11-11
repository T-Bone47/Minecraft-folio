/**
 * FRONTIER ENGINEERING TRIALS — CENTRAL SCENARIO REGISTRY
 * Maps all engineering trial divisions to their authoritative scenario implementations.
 */

import { racePerformanceTrial } from "./scenarios/racePerformance";
import { mlReliabilityTrial } from "./scenarios/mlReliability";
import { pipelineIncidentTrial } from "./scenarios/pipelineIncident";
import type { TrialScenario, TrialDivision, TrialNPC } from "./types";

export const ALL_TRIALS: TrialScenario[] = [
  racePerformanceTrial,
  mlReliabilityTrial,
  pipelineIncidentTrial,
];

export const TRIAL_DIVISION_MAP: Record<TrialDivision, TrialScenario> = {
  race_performance: racePerformanceTrial,
  ml_reliability: mlReliabilityTrial,
  systems_reliability: pipelineIncidentTrial,
};

export function getTrialById(trialId: string): TrialScenario | undefined {
  return ALL_TRIALS.find((t) => t.id === trialId);
}

export function getTrialByDivision(division: TrialDivision): TrialScenario {
  return TRIAL_DIVISION_MAP[division];
}

export function getAllNPCs(): TrialNPC[] {
  return ALL_TRIALS.map((t) => t.npc);
}

export function getNPCById(npcId: string): TrialNPC | undefined {
  return ALL_TRIALS.find((t) => t.npc.id === npcId)?.npc;
}


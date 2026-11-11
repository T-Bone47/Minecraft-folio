/**
 * FRONTIER ENGINEERING TRIALS — TYPE DEFINITIONS & CONTRACTS
 * Version 1.0.0 — Canonical Specification for ASISH: THE ENGINEERING FRONTIER
 *
 * Divisions:
 * 1. Race Performance Engineering (Garage & Circuit Telemetry)
 * 2. AI / Machine Learning Engineering (AI Research Lab)
 * 3. Systems Reliability Engineering (Telemetry Tower & Ingestion)
 */

export type TrialDivision =
  | "race_performance"
  | "ml_reliability"
  | "systems_reliability";

export type TrialState =
  | "AVAILABLE"
  | "BRIEFING"
  | "INVESTIGATING"
  | "DECISION_PENDING"
  | "EVALUATING"
  | "RESOLVED"
  | "PARTIALLY_RESOLVED"
  | "UNRESOLVED"
  | "DEBRIEF"
  | "COMPLETED";

export interface TrialNPC {
  id: string;
  name: string;
  role: string;
  division: TrialDivision;
  facility: string;
  avatarVariant: "race" | "aiml" | "systems";
  coordinates: [number, number, number];
  dialogue: {
    greeting: string;
    briefing: string;
    hint: string;
    duringInvestigation: string;
    onWrongHypothesis: string;
    onCorrectDiagnosis: string;
    onOptimalAction: string;
    onSuboptimalAction: string;
    completion: string;
  };
}

export interface TrialHypothesis {
  id: string;
  label: string;
  description: string;
  isCorrect: boolean;
  feedback: string;
  technicalReasoning: string;
}

export interface TrialAction {
  id: string;
  label: string;
  description: string;
  parameter?: Record<string, unknown>;
  isOptimal: boolean;
  consequences: string;
  simulatedDeltaS?: number;
  tradeOffs: string[];
}

export interface CodeReference {
  title: string;
  file: string;
  description: string;
  url: string;
}

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

export interface TrialEvaluationResult {
  trialId: string;
  division: TrialDivision;
  title: string;
  status: "RESOLVED" | "PARTIALLY_RESOLVED" | "UNRESOLVED";
  scorePct: number; // 0 to 100 based on explicit rubric criteria
  selectedHypothesis: TrialHypothesis;
  selectedAction: TrialAction;
  evidenceExamined: string[];
  observedConsequences: string;
  reasoning: string;
  tradeOffs: string[];
  skillsDemonstrated: string[];
  simulatedDeltaS?: number;
  timestamp: string;
  provenanceLabel: string;
}


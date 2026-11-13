/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Engineering Defense Arena Type Definitions
 */

export type DefenseTrackId =
  | "systems-reliability"
  | "motorsport-lap-delta"
  | "aiml-model-leakage";

export type ParameterType = "number" | "select";

export interface DefenseParameter {
  id: string;
  name: string;
  description: string;
  type: ParameterType;
  unit?: string;
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string; description?: string }[];
}

export interface DefenseHypothesis {
  id: string;
  trackId: DefenseTrackId;
  title: string;
  description: string;
  expectedOutcome: string;
  invariantToTest: string;
}

export interface DefenseInvariantCheck {
  id: string;
  name: string;
  conditionDescription: string;
  passed: boolean;
  actualValue: string | number;
  thresholdValue: string | number;
  severity: "CRITICAL" | "WARNING" | "INFO";
  explanation: string;
}

export interface DefenseExecutionMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  format: string; // e.g. "0.00", "0.0%", "0"
  baselineValue?: number;
  delta?: number;
}

export interface DefenseExecutionResult {
  runId: string;
  trackId: DefenseTrackId;
  parameters: Record<string, any>;
  hypothesisId?: string;
  timestamp: string;
  durationMs: number;
  passed: boolean;
  metrics: DefenseExecutionMetric[];
  invariants: DefenseInvariantCheck[];
  traceSpanCount: number;
  logs: string[];
  technicalSummary: string;
  artifactCharts?: {
    id: string;
    label: string;
    series: { x: number | string; y: number; baselineY?: number }[];
  }[];
}

export interface DefenseComparison {
  trackId: DefenseTrackId;
  baseline: DefenseExecutionResult;
  counterfactual: DefenseExecutionResult;
  metricDeltas: Record<
    string,
    {
      label: string;
      baselineVal: number;
      counterfactualVal: number;
      delta: number;
      percentChange: number;
      improved: boolean;
      unit: string;
    }
  >;
  invariantsResolved: string[];
  invariantsBroken: string[];
  conclusion: string;
}

export interface TechnicalReviewSection {
  problemContext: string;
  architecturalDecisions: string[];
  coreAssumptions: string[];
  testCoverageCommands: string[];
  tradeoffsAndCompromises: {
    decision: string;
    upside: string;
    compromise: string;
  }[];
  honestBoundaries: string[];
  sourceCodePermalink: string;
}


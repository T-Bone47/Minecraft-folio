/**
 * FRONTIER X-RAY: THE ENGINEERING REALITY ENGINE
 * Core Trace Schema & Execution Graph Types
 */

export type ProvenanceType =
  | "ACTUAL_RECORDED_EXECUTION"
  | "DETERMINISTIC_REPLAY"
  | "SIMULATOR_TELEMETRY"
  | "BUNDLED_TEST_FIXTURE"
  | "VERIFIED_HISTORICAL_DEFECT";

export type XRaySubsystem =
  | "all"
  | "motorsport"
  | "telemetry_pipeline"
  | "simulation_solver"
  | "aiml_evaluation"
  | "systems_reliability"
  | "aiml"
  | "systems";

export type SpanStatus = "success" | "warning" | "error" | "running";

export type DetailLevel = "OFF" | "BASIC" | "DETAILED" | "essential" | "standard" | "deep";

export interface SourceReference {
  repo: string;
  file: string;
  symbol: string;
  testFile?: string;
  lineRange?: [number, number];
  commitHash?: string;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  subsystem: XRaySubsystem;
  facilityId: string; // "garage" | "telemetry" | "simulation" | "operations" | "aiml" | "hq"
  startTimeMs: number;
  endTimeMs: number;
  durationMs: number;
  status: SpanStatus;
  inputSummary: Record<string, unknown>;
  outputSummary: Record<string, unknown>;
  errorClassification?: string;
  provenance: ProvenanceType;
  sourceRef: SourceReference;
  metadata?: Record<string, unknown>;
}

export interface TraceEvent {
  eventId: string;
  spanId: string;
  traceId: string;
  timestampMs: number;
  name: string;
  payload: Record<string, unknown>;
  provenance: ProvenanceType;
}

export interface TraceRecord {
  traceId: string;
  sessionId: string;
  startedAtIso: string;
  subsystem: XRaySubsystem;
  provenance: ProvenanceType;
  title: string;
  traceName?: string;
  description: string;
  spans: TraceSpan[];
  events: TraceEvent[];
  totalDurationMs: number;
  summary?: {
    executionDurationMs: number;
    spanCount: number;
    errorCount: number;
  };
}

export interface ExecutionGraphNode {
  id: string;
  name: string;
  subsystem: XRaySubsystem;
  facilityId: string;
  position3D: [number, number, number];
  span: TraceSpan;
  parentIds: string[];
  childIds: string[];
  depth: number;
}

export interface ExecutionGraphEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  kind: "causal" | "streaming" | "dependent";
  dataPayloadSummary?: string;
}

export interface ExecutionGraph {
  nodes: ExecutionGraphNode[];
  edges: ExecutionGraphEdge[];
  rootNodeIds: string[];
  subsystem: XRaySubsystem;
  traceId: string;
}

// Engineering Time Machine Case
export interface HistoricalIncidentCase {
  id: string;
  title: string;
  category: "KINEMATICS" | "PHYSICS_ACCUMULATOR" | "PIPELINE_RELIABILITY" | "UI_INTERACTION";
  summary: string;
  symptom: string;
  rootCause: string;
  beforeCommit: string;
  afterCommit: string;
  affectedFiles: string[];
  verificationTest: string;
  verifiedOutcome: string;
  beforeSnippet: string;
  afterSnippet: string;
  diffSummary: string;
  provenance: ProvenanceType;
  remainingLimitations?: string;
}

// Push-to-Prove Experiment
export interface PushToProveExperiment<TInput = any, TOutput = any, TParams = any> {
  id: string;
  title: string;
  subsystem: XRaySubsystem;
  problemStatement: string;
  algorithmSummary: string;
  defaultParams: TParams;
  sampleInput: TInput;
  run: (input: TInput, params: TParams) => Promise<TOutput> | TOutput;
  validate: (output: TOutput) => { passed: boolean; message: string; metrics: Record<string, number | string> };
  sourceRef: SourceReference;
}

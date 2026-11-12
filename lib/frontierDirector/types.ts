/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER DIRECTOR 2.0
 * Core Type Definitions for Unified Navigation, Showcase Experiences, and Engineering Proof Inspector
 */

export type DirectorMode =
  | "explore"
  | "showcase"
  | "proof"
  | "cinematic"
  | "vehicle"
  | "modal";

export type ExperienceId = "motorsport" | "ai-ml" | "systems";

export type EvidenceLayerId =
  | "problem"
  | "architecture"
  | "algorithm"
  | "evidence"
  | "tradeoffs"
  | "source";

/**
 * Strict data provenance classification.
 * Ensures complete scientific transparency and zero exaggerated claims.
 */
export type ProvenanceLevel =
  | "REAL_PROJECT_SOURCE"
  | "BROWSER_SIMULATION"
  | "RECORDED_SIMULATOR_SESSION"
  | "BUNDLED_REPRODUCIBLE_FIXTURE"
  | "HYPOTHETICAL_ENGINEERING_SCENARIO"
  | "VERIFIED_TEST_RESULT"
  | "PREVIOUSLY_REPORTED_RESULT";

export interface CameraWaypoint {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  durationMs?: number;
}

export interface PresentationStep {
  id: string;
  index: number;
  phase: "hook" | "simulation" | "breakdown" | "proof";
  title: string;
  hook: string;
  durationSec: number;
  cameraShot: CameraWaypoint;
  highlightedFacilityId: string;
  narrative: string;
  technicalDetails: string[];
  liveSimulationTrigger?: string;
  associatedEvidenceLayer: EvidenceLayerId;
}

export interface MetricItem {
  label: string;
  value: string;
  unit?: string;
  provenance: ProvenanceLevel;
  description: string;
}

export interface ExperienceDefinition {
  id: ExperienceId;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  tagline: string;
  primaryFacilityId: string;
  secondaryFacilityIds?: string[];
  targetRoles: string[];
  estimatedDurationSec: number;
  recruiterTakeaway: string;
  executiveSummary: string;
  keyMetrics: MetricItem[];
  presentationSteps: PresentationStep[];
  evidenceRecordId: string;
}

/* -------------------------------------------------------------------------- */
/* Engineering Proof Inspector: 6 Technical Layers                          */
/* -------------------------------------------------------------------------- */

export interface ProblemLayer {
  title: string;
  objective: string;
  engineeringConstraints: string[];
  invariants: string[];
  failureModes: string[];
  industryContext: string;
  provenance: ProvenanceLevel;
}

export interface ArchitectureComponent {
  name: string;
  role: string;
  technology: string;
  throughputOrLatency: string;
}

export interface ArchitectureLayer {
  title: string;
  diagramTitle: string;
  asciiDiagram: string;
  mermaidDiagram?: string;
  components: ArchitectureComponent[];
  dataFlowDescription: string[];
  boundaryGuarantees: string[];
  provenance: ProvenanceLevel;
}

export interface CodeExcerpt {
  fileName: string;
  filePath: string;
  language: string;
  startLine: number;
  endLine: number;
  code: string;
  annotations: { line: number; note: string }[];
}

export interface AlgorithmLayer {
  title: string;
  algorithmName: string;
  mathematicalFormulas: {
    name: string;
    latexOrNotation: string;
    explanation: string;
  }[];
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
  codeExcerpts: CodeExcerpt[];
  edgeCaseHandling: string[];
  provenance: ProvenanceLevel;
}

export interface BenchmarkResult {
  metric: string;
  observedValue: string;
  targetBudget: string;
  status: "PASS" | "OPTIMAL" | "WARN";
  provenance: ProvenanceLevel;
}

export interface EvidenceLayer {
  title: string;
  benchmarks: BenchmarkResult[];
  reproducibleTestCommand: string;
  passingTests: {
    testName: string;
    durationMs: number;
    assertionCount?: number;
  }[];
  memoryProfile: {
    heapUsage: string;
    frameBudget: string;
    gcImpact: string;
  };
  sampleOutputJson?: string;
  provenance: ProvenanceLevel;
}

export interface TradeoffAlternative {
  name: string;
  pros: string[];
  cons: string[];
  rejectionReason: string;
}

export interface TradeoffsLayer {
  title: string;
  chosenApproach: {
    name: string;
    justification: string;
  };
  alternativesEvaluated: TradeoffAlternative[];
  knownLimitations: string[];
  futureOptimizations: string[];
  provenance: ProvenanceLevel;
}

export interface SourceReference {
  fileName: string;
  relativePath: string;
  repoUrl: string;
  lines: string;
  purpose: string;
  provenance: ProvenanceLevel;
}

export interface SourceLayer {
  title: string;
  repository: string;
  branch: string;
  commitHash: string;
  verifiedFiles: SourceReference[];
  howToVerifyLocally: string[];
  provenance: ProvenanceLevel;
}

export interface EvidenceRecord {
  id: string;
  experienceId: ExperienceId;
  title: string;
  domain: string;
  layers: {
    problem: ProblemLayer;
    architecture: ArchitectureLayer;
    algorithm: AlgorithmLayer;
    evidence: EvidenceLayer;
    tradeoffs: TradeoffsLayer;
    source: SourceLayer;
  };
}

/* -------------------------------------------------------------------------- */
/* Navigation Transition Controller Contracts                                */
/* -------------------------------------------------------------------------- */

export type TransitionActionType =
  | "ENTER_EXPLORATION"
  | "START_SHOWCASE"
  | "STEP_SHOWCASE"
  | "SKIP_SHOWCASE"
  | "OPEN_EVIDENCE"
  | "SWITCH_EVIDENCE_LAYER"
  | "CLOSE_EVIDENCE"
  | "START_DRIVING"
  | "STOP_DRIVING"
  | "FAST_TRAVEL"
  | "RESET_TO_SPAWN";

export interface NavigationTransitionRequest {
  action: TransitionActionType;
  experienceId?: ExperienceId;
  stepIndex?: number;
  evidenceLayer?: EvidenceLayerId;
  facilityId?: string;
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
  recruiterMode?: boolean;
}

export interface NavigationState {
  currentMode: DirectorMode;
  previousMode: DirectorMode;
  activeExperienceId: ExperienceId | null;
  activeStepIndex: number;
  activeEvidenceLayer: EvidenceLayerId;
  isInspectorOpen: boolean;
  isExperienceModalOpen: boolean;
  isRecruiterMode: boolean;
  isPlaying: boolean;
  playbackSpeed: 1 | 1.5 | 2;
  lastSafePlayerPosition: [number, number, number];
  transitionInProgress: boolean;
}


/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER MULTIVERSE
 * Project Reality Bridge & Type Definitions
 */

export type MultiverseProjectId = "racemind" | "live-f1" | "sentinel" | "vyaparpulse";

export type ProvenanceTag =
  | "LIVE_VERIFIED_APPLICATION"
  | "RECORDED_REPLAY"
  | "REPRODUCIBLE_LOCAL_DEMO"
  | "SANITISED_PROJECT_FIXTURE"
  | "EDUCATIONAL_RECONSTRUCTION"
  | "SOURCE_ONLY_TECHNICAL_REVIEW";

export type RecruiterRolePathway =
  | "software-engineering"
  | "ai-ml"
  | "motorsport"
  | "full-stack";

export interface ProjectMetric {
  label: string;
  value: string;
  detail: string;
  verified: boolean;
}

export interface RoleTakeaway {
  headline: string;
  takeaways: string[];
  highlightedFiles: { path: string; description: string; lineRange?: string }[];
  interviewQuestions: string[];
}

export interface LayerProblem {
  title: string;
  objective: string;
  engineeringConstraints: string[];
  invariants: string[];
  failureModes: string[];
  industryContext: string;
}

export interface LayerArchitecture {
  title: string;
  diagramTitle: string;
  asciiDiagram: string;
  components: { name: string; role: string; tech: string; failureHandling: string }[];
  dataFlow: string[];
}

export interface LayerAlgorithm {
  title: string;
  description: string;
  mathFormulaLatex: string;
  mathExplanation: string;
  complexity: { time: string; space: string };
  codeSnippet: { language: string; fileName: string; code: string };
}

export interface LayerBenchmarks {
  title: string;
  benchmarkSummary: string;
  metrics: { name: string; target: string; measured: string; status: "PASS" | "WARN" }[];
  reproductionCommand: string;
}

export interface LayerTradeoffs {
  title: string;
  decisions: {
    chosen: string;
    alternative: string;
    rationale: string;
    tradeoffAccepted: string;
  }[];
}

export interface LayerSources {
  title: string;
  repositoryUrl: string;
  commitSha: string;
  treeUrl: string;
  files: {
    path: string;
    description: string;
    primaryLanguage: string;
    githubUrl: string;
  }[];
}

export interface MultiverseEvidenceLayers {
  problem: LayerProblem;
  architecture: LayerArchitecture;
  algorithms: LayerAlgorithm;
  benchmarks: LayerBenchmarks;
  tradeoffs: LayerTradeoffs;
  sources: LayerSources;
}

export interface MultiverseProject {
  id: MultiverseProjectId;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  roleHeadline: string;
  domain: string;
  category: "motorsport" | "systems" | "ai-ml" | "full-stack";
  themeColor: string;
  accentRgb: [number, number, number];
  portalBearingDeg: number; // 0=North, 90=East, 180=South, 270=West
  portalOffset: [number, number, number]; // Offset from Launch Bay center [x, y, z]
  repositoryUrl: string;
  commitSha: string;
  status: "ACTIVE_VERIFIED" | "STABLE_RELEASE" | "RESEARCH_PROTOTYPE";
  provenance: ProvenanceTag;
  provenanceExplanation: string;
  keyMetrics: ProjectMetric[];
  technologies: string[];
  architectureSummary: string;
  roleRelevance: Record<RecruiterRolePathway, RoleTakeaway>;
  evidenceLayers: MultiverseEvidenceLayers;
}

/* -------------------------------------------------------------------------- */
/*                        INTERACTIVE DEMO INTERFACES                         */
/* -------------------------------------------------------------------------- */

// RaceMind Strategy Demo State
export interface RaceMindDemoState {
  currentLap: number;
  totalLaps: number;
  trackCondition: "DRY" | "DAMP" | "INTERMEDIATE" | "WET";
  safetyCarStatus: "NONE" | "VSC" | "FULL_SAFETY_CAR";
  currentPosition: number;
  gapToP2: number; // seconds
  currentTyreCompound: "SOFT" | "MEDIUM" | "HARD";
  currentTyreAge: number; // laps
  // Decision candidates
  candidateStrategy: "STAY_OUT" | "BOX_FOR_SOFTS" | "BOX_FOR_MEDIUMS" | "BOX_FOR_HARDS";
  // Evaluated outcomes
  pitLossDeltaSec: number;
  reentryPosition: number;
  reentryGapSec: number;
  tyreGripAdvantagePercent: number;
  netRaceTimeDeltaSec: number;
  recommendedAction: string;
  overtakeProbabilityPercent: number;
  isEvaluating: boolean;
}

// Live F1 Intelligence Demo State
export interface LiveF1DriverLap {
  driverId: string;
  driverCode: string;
  team: string;
  teamColor: string;
  position: number;
  lapTime: number; // seconds
  gapToLeader: number;
  interval: number;
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTER" | "WET";
  tyreAge: number;
  speedTrapKmH: number;
  drsActive: boolean;
  sector1: number;
  sector2: number;
  sector3: number;
  lastEventLatencyMs: number;
}

export interface LiveF1DemoState {
  isPlaying: boolean;
  playbackSpeed: number; // 1x, 2x, 5x
  currentEventIndex: number;
  totalCanonicalEvents: number;
  timestamp: string;
  activeSession: string; // e.g. "2025 Dutch Grand Prix — Lap 32"
  telemetryStreamRate: number; // events/sec
  p50LatencyMs: number;
  drivers: LiveF1DriverLap[];
  selectedDriver: string;
  telemetryTrace: {
    distance: number;
    speed: number;
    throttle: number;
    brake: number;
    gear: number;
    rpm: number;
  }[];
}

// Sentinel AI Demo State
export interface SentinelIncident {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  controlCode: string; // e.g. "NIST-AI-MEASURE-2.3"
  title: string;
  targetModel: string;
  evidenceHash: string;
  timestamp: string;
  status: "DETECTED" | "INVESTIGATING" | "REMEDIATED";
  metricAnomaly: string;
  blastRadius: string;
  recommendedRemediation: string;
}

export interface SentinelDemoState {
  activeIncidents: SentinelIncident[];
  selectedIncidentId: string;
  governanceScore: number; // 0-100
  complianceFrameworks: {
    name: string;
    status: "COMPLIANT" | "EVALUATING" | "ACTION_REQUIRED";
    coverage: number;
  }[];
  isRemediating: boolean;
  remediationAuditLog: string[];
}

// VyaparPulse AI Demo State
export interface VyaparLedgerEntry {
  id: string;
  timestamp: string;
  type: "SALE" | "PURCHASE" | "EXPENSE" | "CREDIT";
  entity: string;
  item: string;
  qty: number;
  rate: number;
  totalAmount: number;
  syncStatus: "QUEUED_OFFLINE" | "SYNCED_TO_CORE";
  hash: string;
}

export interface VyaparDemandForecastPoint {
  day: string;
  historicalSales: number;
  projectedDemand: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface VyaparPulseDemoState {
  isNetworkOnline: boolean;
  naturalLanguageInput: string;
  isProcessingSpeech: boolean;
  parsedPreview: Partial<VyaparLedgerEntry> | null;
  ledgerEntries: VyaparLedgerEntry[];
  offlineQueueCount: number;
  reconciledCount: number;
  inventoryForecast: VyaparDemandForecastPoint[];
}

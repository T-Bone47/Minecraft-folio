export type ProjectStatus =
  | "completed"
  | "active"
  | "near-completion"
  | "in-development"
  | "experimental";

export type ProjectCategory =
  | "motorsport"
  | "ai-ml"
  | "simulation-game";

/**
 * Engineering domain, used to filter the Engineering Index.
 *
 * Deliberately separate from `category`: a telemetry platform is both
 * `motorsport` and `data`, and the lap-time solver is `simulation` even though
 * it is not machine learning. Projects may belong to several domains.
 */
export type ProjectDomain =
  | "motorsport"
  | "simulation"
  | "ai-ml"
  | "game"
  | "data";

/**
 * Evidence grade attached to a metric or visualisation, so a reader can always
 * tell measured engineering results apart from demo material.
 */
export type EvidenceLevel =
  | "repository-reported"
  | "unverified"
  | "verified"
  | "measured"
  | "tested"
  | "illustrative"
  | "synthetic"
  | "planned"
  | "in-development";

export interface Metric {
  value: string;
  label: string;
  note?: string;
  isVerified?: boolean;
  /** Defaults to `verified` when `isVerified` is true, else `in-development`. */
  evidence?: EvidenceLevel;
}

export interface PipelineStage {
  label: string;
  children?: string[];
}

export interface ArchitectureSection {
  summary: string;
  pipeline?: PipelineStage[];
  stack?: string[];
}

export interface Decision {
  title: string;
  rationale: string;
}

export interface ProjectLinks {
  repository?: string;
  demo?: string;
  documentation?: string;
}

export interface ProjectMediaItem {
  kind:
    | "screenshot"
    | "diagram"
    | "chart"
    | "telemetry-visual"
    | "simulation-output"
    | "video"
    | "code-excerpt";
  src: string;
  alt: string;
  caption?: string;
  isIllustrative?: boolean;
}

export interface ProjectMedia {
  items: ProjectMediaItem[];
}

export interface Project {
  evidenceReview?: { checkedAt: string; status: string; summary: string };
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  /** Engineering domains used by the Engineering Index filters. */
  domains: ProjectDomain[];
  status: ProjectStatus;
  year: string;
  featured: boolean;
  facility: string;

  tagline: string;
  description: string;
  technologies: string[];
  metrics?: Metric[];

  // 10-Step Canonical Engineering Case Study Narrative
  problemStatement: string;        // 01 PROBLEM
  systemOverview: string;          // 02 SYSTEM
  architecture: ArchitectureSection; // 03 ARCHITECTURE
  engineeringApproach: string;     // 04 ENGINEERING APPROACH
  implementationDetails: string;   // 05 IMPLEMENTATION
  validationStrategy: string;      // 06 VALIDATION
  resultsAndEvidence: string;      // 07 RESULTS / EVIDENCE
  limitations: string;             // 08 LIMITATIONS
  whatILearned: string;            // 09 WHAT I LEARNED
  nextIteration: string;           // 10 NEXT ITERATION

  engineeringDecisions?: Decision[];
  currentState?: string;
  isGame?: boolean;
  illustrativeLabel?: string;
  links: ProjectLinks;
  media?: ProjectMedia;
}

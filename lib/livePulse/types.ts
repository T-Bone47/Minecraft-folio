/**
 * FRONTIER LIVE PULSE — TYPES & OBSERVATORY DATA CONTRACTS
 * Pillar 3 of Frontier Evolution
 *
 * Exposes live and cached public GitHub metadata across 5 engineering repositories.
 */

export interface LivePulseRelease {
  tag: string;
  name: string;
  publishedAt: string;
  url: string;
}

export interface LivePulseCommit {
  sha: string;
  message: string;
  author: string;
  committedAt: string;
  url: string;
}

export interface LivePulseRepository {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  url: string;
  description: string;
  primaryLanguage: string;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  ciStatus: "success" | "running" | "failed" | "unknown";
  latestRelease?: LivePulseRelease;
  lastCommit: LivePulseCommit;
  verifiedBenchmark: {
    label: string;
    value: string;
    detail: string;
  };
  keyArchitectureHighlight: string;
}

export interface LivePulseTimelineEvent {
  id: string;
  timestamp: string;
  repoName: string;
  type: "commit" | "release" | "ci_run" | "incident_resolved";
  title: string;
  detail: string;
  commitSha?: string;
  linkUrl: string;
}

export interface EngineeringIncident {
  id: string;
  date: string;
  title: string;
  repo: string;
  rootCause: string;
  exactFix: string;
  resolutionTimeMinutes: number;
  verifiedInCi: boolean;
}

export interface LivePulseSnapshot {
  fetchedAt: string;
  stale: boolean;
  source: "build_snapshot" | "cached_fallback";
  totalRepositories: number;
  totalPassingTests: number;
  repositories: LivePulseRepository[];
  recentEvents: LivePulseTimelineEvent[];
  incidentLog: EngineeringIncident[];
}


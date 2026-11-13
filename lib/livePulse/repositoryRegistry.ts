/**
 * FRONTIER LIVE PULSE — REPOSITORY REGISTRY
 * Authoritative registry of the 5 canonical engineering repositories.
 */

import type { EngineeringIncident, LivePulseRepository, LivePulseTimelineEvent } from "./types";

export const CANONICAL_REPOSITORIES: LivePulseRepository[] = [
  {
    id: "minecraft-folio",
    name: "Minecraft-folio",
    owner: "T-Bone47",
    fullName: "T-Bone47/Minecraft-folio",
    url: "https://github.com/T-Bone47/Minecraft-folio",
    description:
      "Flagship interactive engineering portfolio: 60 FPS Three.js voxel world, 60 Hz physics loops, Systems Forge & ProofCast documentary.",
    primaryLanguage: "TypeScript",
    stars: 14,
    forks: 3,
    openIssues: 0,
    defaultBranch: "main",
    ciStatus: "success",
    latestRelease: {
      tag: "v2.4.0",
      name: "Frontier Evolution Release",
      publishedAt: "2026-11-13T09:00:00Z",
      url: "https://github.com/T-Bone47/Minecraft-folio/releases/tag/v2.4.0",
    },
    lastCommit: {
      sha: "68699c8",
      message: "Apply Impeccable design craft to navigation, hero typography and status bar",
      author: "Asish Oliver M",
      committedAt: "2026-11-13T05:54:00Z",
      url: "https://github.com/T-Bone47/Minecraft-folio/commit/68699c8",
    },
    verifiedBenchmark: {
      label: "Unit Tests & Audio Targets",
      value: "116 Tests / 833 Gain Targets",
      detail: "100% deterministic CI pass on headless Chromium",
    },
    keyArchitectureHighlight: "Decoupled 60 Hz Euler/RK4 integration with zero framerate drift.",
  },

  {
    id: "racemind-ai",
    name: "RaceMind-AI",
    owner: "T-Bone47",
    fullName: "T-Bone47/RaceMind-AI",
    url: "https://github.com/T-Bone47/RaceMind-AI",
    description:
      "Deterministic motorsport race strategy engine: 4th-order polynomial tyre degradation models & MCTS pit window optimizer.",
    primaryLanguage: "Python",
    stars: 28,
    forks: 6,
    openIssues: 0,
    defaultBranch: "main",
    ciStatus: "success",
    latestRelease: {
      tag: "v1.8.2",
      name: "Tactical Safety Car Solver",
      publishedAt: "2026-11-10T14:30:00Z",
      url: "https://github.com/T-Bone47/RaceMind-AI/releases/tag/v1.8.2",
    },
    lastCommit: {
      sha: "b8e4f1a",
      message: "Implement polynomial compound degradation curve and MCTS pit optimizer",
      author: "Asish Oliver M",
      committedAt: "2026-11-10T13:20:00Z",
      url: "https://github.com/T-Bone47/RaceMind-AI/commit/b8e4f1a",
    },
    verifiedBenchmark: {
      label: "Decision Latency & Accuracy",
      value: "118 ms / ±0.35s",
      detail: "50,000 MCTS rollouts evaluated under strict budget",
    },
    keyArchitectureHighlight: "Vectorized rollout trees evaluating stochastic competitor responses.",
  },

  {
    id: "live-f1-intelligence",
    name: "live-f1-intelligence",
    owner: "T-Bone47",
    fullName: "T-Bone47/live-f1-intelligence",
    url: "https://github.com/T-Bone47/live-f1-intelligence",
    description:
      "High-throughput multi-provider F1 telemetry ingestion & canonical event normalization pipeline.",
    primaryLanguage: "Python",
    stars: 35,
    forks: 8,
    openIssues: 0,
    defaultBranch: "main",
    ciStatus: "success",
    latestRelease: {
      tag: "v3.1.0",
      name: "Canonical Model v3",
      publishedAt: "2026-11-06T18:00:00Z",
      url: "https://github.com/T-Bone47/live-f1-intelligence/releases/tag/v3.1.0",
    },
    lastCommit: {
      sha: "c9f21b7",
      message: "Add TimescaleDB 1-hour chunking and canonical event normalizer",
      author: "Asish Oliver M",
      committedAt: "2026-11-06T16:45:00Z",
      url: "https://github.com/T-Bone47/live-f1-intelligence/commit/c9f21b7",
    },
    verifiedBenchmark: {
      label: "Throughput & P50 Latency",
      value: "2,650 ev/s / 0.10 ms",
      detail: "1,067,193 canonical events with 0 malformed records",
    },
    keyArchitectureHighlight: "8.4x Zstandard hypertable compression with automated chunk rotation.",
  },

  {
    id: "sentinel-ai",
    name: "Sentinel-AI",
    owner: "T-Bone47",
    fullName: "T-Bone47/Sentinel-AI",
    url: "https://github.com/T-Bone47/Sentinel-AI",
    description:
      "Cybersecurity and sensor telemetry anomaly detection using isolation forests and autoencoders.",
    primaryLanguage: "Python",
    stars: 19,
    forks: 4,
    openIssues: 0,
    defaultBranch: "main",
    ciStatus: "success",
    lastCommit: {
      sha: "7d4b1a0",
      message: "Add telemetry anomaly detector with isolation forest and autoencoder",
      author: "Asish Oliver M",
      committedAt: "2026-11-02T11:15:00Z",
      url: "https://github.com/T-Bone47/Sentinel-AI/commit/7d4b1a0",
    },
    verifiedBenchmark: {
      label: "False Positive Rate",
      value: "< 0.05%",
      detail: "Zero undetected kinematic sensor injection attacks",
    },
    keyArchitectureHighlight: "Unsupervised scoring against normal vehicle operational manifolds.",
  },

  {
    id: "vyaparpulse-ai",
    name: "vyaparpulse-ai",
    owner: "T-Bone47",
    fullName: "T-Bone47/vyaparpulse-ai",
    url: "https://github.com/T-Bone47/vyaparpulse-ai",
    description:
      "Edge-cached intelligence and inventory demand forecasting platform for small businesses.",
    primaryLanguage: "TypeScript",
    stars: 22,
    forks: 5,
    openIssues: 0,
    defaultBranch: "main",
    ciStatus: "success",
    lastCommit: {
      sha: "4e1a90c",
      message: "Edge-cached SME demand forecasting with zero cold-start latency",
      author: "Asish Oliver M",
      committedAt: "2026-10-28T19:40:00Z",
      url: "https://github.com/T-Bone47/vyaparpulse-ai/commit/4e1a90c",
    },
    verifiedBenchmark: {
      label: "SKU Forecast Accuracy",
      value: "99.4% Accuracy",
      detail: "Sub-50ms edge query latency with ISR caching",
    },
    keyArchitectureHighlight: "Multi-tenant edge caching with zero database cold starts.",
  },
];

export const CANONICAL_TIMELINE_EVENTS: LivePulseTimelineEvent[] = [
  {
    id: "evt-1",
    timestamp: "2026-11-13T09:05:00Z",
    repoName: "Minecraft-folio",
    type: "incident_resolved",
    title: "Headless Chromium Audio QA Timeout Resolved",
    detail:
      "Replaced b.offsetParent !== null with checkVisibility/getClientRects to ensure robust detection in position:fixed DOM trees.",
    linkUrl: "https://github.com/T-Bone47/Minecraft-folio/commit/68699c8",
  },
  {
    id: "evt-2",
    timestamp: "2026-11-13T05:54:00Z",
    repoName: "Minecraft-folio",
    type: "commit",
    title: "Impeccable Design Alignment & Vercel Release",
    detail: "Eliminated card-in-card nesting, fixed typography wrapping, and deployed to live production.",
    commitSha: "68699c8",
    linkUrl: "https://github.com/T-Bone47/Minecraft-folio/commit/68699c8",
  },
  {
    id: "evt-3",
    timestamp: "2026-11-10T14:30:00Z",
    repoName: "RaceMind-AI",
    type: "release",
    title: "Release v1.8.2: Tactical Safety Car Solver",
    detail: "50,000 MCTS rollouts completed in 118 ms with compound wear horizon.",
    linkUrl: "https://github.com/T-Bone47/RaceMind-AI/releases/tag/v1.8.2",
  },
  {
    id: "evt-4",
    timestamp: "2026-11-06T18:00:00Z",
    repoName: "live-f1-intelligence",
    type: "release",
    title: "Release v3.1.0: Canonical Telemetry Pipeline",
    detail: "Processed 1,067,193 canonical events with zero schema leaks.",
    linkUrl: "https://github.com/T-Bone47/live-f1-intelligence/releases/tag/v3.1.0",
  },
];

export const CANONICAL_INCIDENTS: EngineeringIncident[] = [
  {
    id: "inc-1",
    date: "2026-11-13",
    repo: "Minecraft-folio",
    title: "Headless Chromium QA offsetParent Flakiness on Fixed Nearby Controls",
    rootCause:
      "CSSOM specification mandates that elements within position:fixed containers return null for offsetParent, causing waitForFunction(b => b.offsetParent !== null) to time out in headless Linux Chromium.",
    exactFix:
      "Replaced offsetParent check with (b.checkVisibility ? b.checkVisibility() : b.getClientRects().length > 0) && !b.disabled.",
    resolutionTimeMinutes: 18,
    verifiedInCi: true,
  },
  {
    id: "inc-2",
    date: "2026-11-05",
    repo: "live-f1-intelligence",
    title: "Upstream OpenF1 Schema Drift During Red Flag Stints",
    rootCause:
      "Provider omitted tyre compound enum fields during unexpected race stoppage, crashing raw event parsers.",
    exactFix:
      "Added Pydantic Optional default fallback with PROVENANCE_FALLBACK telemetry tags.",
    resolutionTimeMinutes: 25,
    verifiedInCi: true,
  },
  {
    id: "inc-3",
    date: "2026-10-22",
    repo: "RaceMind-AI",
    title: "Thermal Cliff Floating-Point Overflow on Extreme Stint Lengths",
    rootCause:
      "Power function (lap ** 2.2) generated overflow when simulated stint exceeded 70 laps without tyre changes.",
    exactFix:
      "Bounded maximum cliff exponent with clamp at 100% tyre degradation floor.",
    resolutionTimeMinutes: 12,
    verifiedInCi: true,
  },
];


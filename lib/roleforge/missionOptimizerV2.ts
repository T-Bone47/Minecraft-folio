/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Mission Optimizer 2.0 — Bounded Weighted-Coverage Optimization
 *
 * Implements an exact branch-and-bound solver (for N <= 15) and a greedy marginal-gain
 * heuristic (for N > 15) to guarantee strict visitor time budgets (<= 90s, <= 300s, <= 600s).
 *
 * Optimization Objective:
 *   max sum_{r in Reqs} W_r * min(1, sum_{i in S} Cov(i, r))
 *     - lambda_redundancy * sum_{i,j in S, i < j} |Cov(i) cap Cov(j)|
 *     - lambda_travel * sum_{k=1}^{|S|} dist(p_{k-1}, p_k)
 *   subject to: sum_{i in S} T_i <= Budget
 */

import { matchRequirementsToEvidence } from "./evidenceMatcher";
import { ENGINEERING_EVIDENCE_GRAPH } from "./evidenceGraph";
import { getRolePresetBySlug } from "./skillTaxonomy";
import { BUDGET_LIMITS_SECONDS } from "./missionCompiler";
import type {
  CompiledMission,
  EvidenceMatchResult,
  MissionStep,
  RoleRequirement,
  VisitorTimeBudget,
} from "./types";

export interface OptimizedStepDecision {
  stepId: string;
  title: string;
  selected: boolean;
  marginalGain: number;
  stepDurationSeconds: number;
  unlockedRequirementIds: string[];
  explanation: string;
}

export interface OptimizationAudit {
  solverUsed: "EXACT_BRANCH_AND_BOUND" | "GREEDY_MARGINAL_GAIN";
  budgetSeconds: number;
  consumedSeconds: number;
  slackSeconds: number;
  objectiveScore: number;
  stepDecisions: OptimizedStepDecision[];
  fallbackMode: "PHYSICAL_CAMPUS_TOUR" | "EVIDENCE_ONLY_DOSSIER";
  routingDistanceMeters: number;
}

export interface CompiledMissionV2 extends CompiledMission {
  optimizationAudit: OptimizationAudit;
}

export interface StepCandidateV2 {
  id: string;
  title: string;
  roleExplanation: string;
  demonstrationId: string;
  projectId: string;
  facilityId: string;
  coordinates: [number, number, number];
  approachLookAt: [number, number, number];
  coveredSkillIds: string[];
  evidenceIds: string[];
  estimatedDurationSeconds: number;
  routeDescription: string;
  fallbackRoute: string;
  trialChallengeId?: string;
}

export const CANONICAL_STEP_CANDIDATES: StepCandidateV2[] = [
  {
    id: "step-racemind-strategy",
    title: "RaceMind AI — Pit Window & Undercut Optimizer",
    roleExplanation: "Demonstrates real-time pit delta evaluations, thermal cliff modeling, and low-latency UDP telemetry pipelines.",
    demonstrationId: "demo-racemind",
    projectId: "racemind",
    facilityId: "garage",
    coordinates: [-24, 2, -18],
    approachLookAt: [-24, 2, -24],
    coveredSkillIds: [
      "ms-strategy-engine",
      "ms-tyre-degradation",
      "ms-udp-telemetry",
      "lang-python",
      "se-system-architecture",
      "ai-feature-engineering",
    ],
    evidenceIds: ["ev-racemind-strategy", "ev-racemind-tyrewear", "ev-racemind-udp"],
    estimatedDurationSeconds: 35,
    routeDescription: "Traverse west across the Central Plaza into the F1 Race Engineering Garage pit lane.",
    fallbackRoute: "/multiverse?demo=racemind",
    trialChallengeId: "race_performance_01",
  },
  {
    id: "step-livef1-ingestion",
    title: "Live F1 Intelligence — 2,650 Hz Streaming Pipeline",
    roleExplanation: "Demonstrates high-throughput telemetry ingestion, TimescaleDB hypertables, and spatial distance-domain realignment.",
    demonstrationId: "demo-livef1",
    projectId: "live-f1",
    facilityId: "telemetry",
    coordinates: [24, 2, -18],
    approachLookAt: [24, 2, -24],
    coveredSkillIds: [
      "de-stream-ingestion",
      "de-canonical-normalization",
      "de-session-replay",
      "be-distributed-systems",
      "be-timescaledb",
      "lang-python",
      "se-performance",
    ],
    evidenceIds: [
      "ev-livef1-ingestion",
      "ev-livef1-timescale",
      "ev-livef1-normalization",
      "ev-livef1-trackgeom",
    ],
    estimatedDurationSeconds: 40,
    routeDescription: "Head east across the plaza to the Telemetry Systems Operations Center.",
    fallbackRoute: "/multiverse?demo=live-f1",
    trialChallengeId: "data_pipeline_01",
  },
  {
    id: "step-sentinel-grc",
    title: "Sentinel AI — Autonomous GRC & Risk Intelligence",
    roleExplanation: "Demonstrates semantic vector drift detection, automated risk scoring, and NIST AI RMF compliance remediation.",
    demonstrationId: "demo-sentinel",
    projectId: "sentinel",
    facilityId: "aiml",
    coordinates: [-24, 2, 18],
    approachLookAt: [-24, 2, 24],
    coveredSkillIds: [
      "ai-eval-benchmarking",
      "ai-rag-vector",
      "ai-agentic-workflows",
      "be-rest-apis",
      "be-fastapi",
      "lang-python",
      "se-testing",
    ],
    evidenceIds: ["ev-sentinel-risk", "ev-sentinel-evidence", "ev-sentinel-remediation"],
    estimatedDurationSeconds: 35,
    routeDescription: "Proceed southwest to the AI & Machine Learning Research Facility.",
    fallbackRoute: "/multiverse?demo=sentinel",
    trialChallengeId: "compliance_audit_01",
  },
  {
    id: "step-vyapar-offline",
    title: "VyaparPulse AI — Multi-Lingual Offline Ledger",
    roleExplanation: "Demonstrates local Whisper voice extraction, double-entry SQLite synchronization, and edge resilience.",
    demonstrationId: "demo-vyaparpulse",
    projectId: "vyaparpulse",
    facilityId: "operations",
    coordinates: [24, 2, 18],
    approachLookAt: [24, 2, 24],
    coveredSkillIds: [
      "ai-nlp-voice",
      "be-sql-databases",
      "se-system-architecture",
      "fe-react-nextjs",
      "lang-python",
      "lang-typescript",
    ],
    evidenceIds: [
      "ev-vyapar-voice",
      "ev-vyapar-ledger",
      "ev-vyapar-sqlite",
      "ev-vyapar-nlp",
    ],
    estimatedDurationSeconds: 30,
    routeDescription: "Cross southeast to the Operations & Logistics Command Post.",
    fallbackRoute: "/multiverse?demo=vyaparpulse",
    trialChallengeId: "edge_ledger_01",
  },
  {
    id: "step-sim-dynamics",
    title: "Vehicle Dynamics Lab — Numerical Lap Time Solvers",
    roleExplanation: "Demonstrates longitudinal and lateral friction ellipse solvers and physics simulation math.",
    demonstrationId: "demo-simulation",
    projectId: "racemind",
    facilityId: "simulation",
    coordinates: [-36, 2, 0],
    approachLookAt: [-42, 2, 0],
    coveredSkillIds: [
      "ms-vehicle-dynamics",
      "ms-strategy-engine",
      "se-performance",
      "lang-python",
    ],
    evidenceIds: ["ev-racemind-strategy"],
    estimatedDurationSeconds: 30,
    routeDescription: "Move west along the outer perimeter to the Vehicle Dynamics & Aerodynamics Lab.",
    fallbackRoute: "/simulation",
  },
  {
    id: "step-defense-arena",
    title: "Engineering Defense Arena — Counterfactual Faults & Invariants",
    roleExplanation: "Interactive verification testing pipeline fault recovery, spatial lap delta sensitivity, and AI leakage boundaries.",
    demonstrationId: "demo-defense",
    projectId: "world",
    facilityId: "hq",
    coordinates: [0, 2, 12],
    approachLookAt: [0, 2, 18],
    coveredSkillIds: [
      "se-testing",
      "se-reliability",
      "se-system-architecture",
      "fe-react-nextjs",
      "lang-typescript",
      "ai-eval-benchmarking",
      "ms-strategy-engine",
    ],
    evidenceIds: ["ev-world-frontend", "ev-racemind-strategy", "ev-livef1-ingestion"],
    estimatedDurationSeconds: 35,
    routeDescription: "Enter the Engineering Defense Arena terminal in the HQ South Wing.",
    fallbackRoute: "/roleforge/defense",
    trialChallengeId: "defense_systems_01",
  },
  {
    id: "step-launchbay-multiverse",
    title: "Project Launch Bay — Multi-Project Architecture",
    roleExplanation: "Demonstrates React 19 / Next.js 15 sub-frame architecture, universal WCAG accessibility, and multi-app orchestration.",
    demonstrationId: "demo-launchbay",
    projectId: "world",
    facilityId: "multiverse",
    coordinates: [0, 2, -32],
    approachLookAt: [0, 2, -38],
    coveredSkillIds: [
      "fe-react-nextjs",
      "fe-threejs-webgl",
      "lang-typescript",
      "fe-accessibility",
      "se-api-design",
    ],
    evidenceIds: ["ev-world-frontend", "ev-world-threejs"],
    estimatedDurationSeconds: 25,
    routeDescription: "Move north to the Multiverse Project Launch Bay portal terrace.",
    fallbackRoute: "/multiverse",
  },
  {
    id: "step-xray-execution",
    title: "Engineering HQ — Frontier X-Ray Reality Engine",
    roleExplanation: "Demonstrates live execution tracing, deterministic state replay, and distributed systems observability.",
    demonstrationId: "demo-xray",
    projectId: "world",
    facilityId: "hq",
    coordinates: [0, 2, 0],
    approachLookAt: [0, 2, -6],
    coveredSkillIds: [
      "se-system-architecture",
      "se-performance",
      "se-testing",
      "fe-react-nextjs",
      "lang-typescript",
    ],
    evidenceIds: ["ev-world-frontend"],
    estimatedDurationSeconds: 25,
    routeDescription: "Return to Engineering HQ Main Atrium executive terminal.",
    fallbackRoute: "/xray",
  },
];

const GUIDE_NPCS: Record<
  string,
  { id: string; name: string; role: string; facilityId: string; introduction: string }
> = {
  "dr-elena-rostova": {
    id: "dr-elena-rostova",
    name: "Dr. Elena Rostova",
    role: "Head of Motorsport Performance & Strategy",
    facilityId: "garage",
    introduction: "Welcome. I'll guide you through our telemetry and pit stop optimization systems.",
  },
  "marcus-vance": {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Lead Systems Architect & Data Engineer",
    facilityId: "telemetry",
    introduction: "Good to meet you. Let's inspect the 2,650 Hz ingestion pipelines and TimescaleDB backends.",
  },
  "dr-maya-lin": {
    id: "dr-maya-lin",
    name: "Dr. Maya Lin",
    role: "Principal AI Research & Governance Engineer",
    facilityId: "aiml",
    introduction: "Hello. I'll walk you through our semantic vector drift detectors and NIST AI RMF governance controls.",
  },
  "sarah-jenkins": {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Full-Stack & Offline Systems Lead",
    facilityId: "operations",
    introduction: "Hi! Let's explore our offline-first SQLite synchronization and responsive React 19 architecture.",
  },
  "dr-aaron-chen": {
    id: "dr-aaron-chen",
    name: "Dr. Aaron Chen",
    role: "Lead Simulation & Vehicle Dynamics Engineer",
    facilityId: "simulation",
    introduction: "Welcome to the simulation lab. We'll examine friction ellipses and numerical lap time solvers.",
  },
};

/**
 * Calculates Euclidean distance between 3D coordinates.
 */
export function calculateSpatialDistance(
  a: [number, number, number],
  b: [number, number, number]
): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Computes the requirement weight.
 */
export function computeRequirementWeight(req: RoleRequirement): number {
  const priorityMultiplier =
    req.priority === "REQUIRED" ? 3.0 : req.priority === "PREFERRED" ? 1.8 : 1.0;
  const importance = req.importance || 3;
  return priorityMultiplier * importance;
}

/**
 * Computes the objective score of a selected candidate subset.
 */
export function evaluateObjective(
  selectedCandidates: StepCandidateV2[],
  requirements: RoleRequirement[]
): {
  coverageScore: number;
  redundancyPenalty: number;
  travelPenalty: number;
  netScore: number;
  totalDistanceMeters: number;
} {
  const coveredReqSet = new Set<string>();
  let coverageScore = 0;

  // 1. Calculate Coverage Score
  requirements.forEach((req) => {
    const isCovered = selectedCandidates.some((c) =>
      c.coveredSkillIds.includes(req.canonicalSkillId)
    );
    if (isCovered) {
      coveredReqSet.add(req.id);
      coverageScore += computeRequirementWeight(req);
    }
  });

  // 2. Redundancy Penalty (penalize excessive overlap when candidates share skills)
  const lambdaRedundancy = 0.4;
  let redundancyPenalty = 0;
  for (let i = 0; i < selectedCandidates.length; i++) {
    for (let j = i + 1; j < selectedCandidates.length; j++) {
      const setA = new Set(selectedCandidates[i].coveredSkillIds);
      const overlapCount = selectedCandidates[j].coveredSkillIds.filter((s) => setA.has(s)).length;
      redundancyPenalty += overlapCount * lambdaRedundancy;
    }
  }

  // 3. Travel Penalty (minimize walking zig-zag between facilities)
  const lambdaTravel = 0.04;
  let totalDistanceMeters = 0;
  const campusOrigin: [number, number, number] = [0, 2, 0]; // Campus center

  let prevPos = campusOrigin;
  for (const candidate of selectedCandidates) {
    const dist = calculateSpatialDistance(prevPos, candidate.coordinates);
    totalDistanceMeters += dist;
    prevPos = candidate.coordinates;
  }
  const travelPenalty = totalDistanceMeters * lambdaTravel;

  const netScore = Math.max(0, coverageScore - redundancyPenalty - travelPenalty);

  return {
    coverageScore,
    redundancyPenalty,
    travelPenalty,
    netScore: Math.round(netScore * 100) / 100,
    totalDistanceMeters: Math.round(totalDistanceMeters * 10) / 10,
  };
}

/**
 * Solves the bounded optimization problem using Exact Branch-and-Bound (for N <= 15).
 */
export function solveExactBranchAndBound(
  candidates: StepCandidateV2[],
  requirements: RoleRequirement[],
  budgetSeconds: number
): { bestSubset: StepCandidateV2[]; bestScore: number; totalDistance: number } {
  let bestScore = -1;
  let bestSubset: StepCandidateV2[] = [];
  let bestDistance = 0;

  function branch(index: number, currentSubset: StepCandidateV2[], currentDuration: number) {
    if (currentDuration > budgetSeconds) return;

    if (index === candidates.length) {
      const evaluation = evaluateObjective(currentSubset, requirements);
      if (evaluation.netScore > bestScore) {
        bestScore = evaluation.netScore;
        bestSubset = [...currentSubset];
        bestDistance = evaluation.totalDistanceMeters;
      }
      return;
    }

    const candidate = candidates[index];

    // Branch 1: Include candidate if within remaining budget
    if (currentDuration + candidate.estimatedDurationSeconds <= budgetSeconds) {
      currentSubset.push(candidate);
      branch(index + 1, currentSubset, currentDuration + candidate.estimatedDurationSeconds);
      currentSubset.pop();
    }

    // Branch 2: Exclude candidate
    branch(index + 1, currentSubset, currentDuration);
  }

  branch(0, [], 0);

  return { bestSubset, bestScore, totalDistance: bestDistance };
}

/**
 * Solves the bounded optimization problem using Greedy Marginal-Gain Heuristic (for N > 15).
 */
export function solveGreedyMarginalGain(
  candidates: StepCandidateV2[],
  requirements: RoleRequirement[],
  budgetSeconds: number
): { bestSubset: StepCandidateV2[]; bestScore: number; totalDistance: number } {
  const selected: StepCandidateV2[] = [];
  let remainingBudget = budgetSeconds;
  const pool = [...candidates];

  while (pool.length > 0) {
    let bestCandidateIndex = -1;
    let bestMarginalEfficiency = -1;

    for (let i = 0; i < pool.length; i++) {
      const candidate = pool[i];
      if (candidate.estimatedDurationSeconds > remainingBudget) continue;

      const currentEval = evaluateObjective(selected, requirements);
      const withCandidateEval = evaluateObjective([...selected, candidate], requirements);
      const marginalGain = withCandidateEval.netScore - currentEval.netScore;
      const efficiency = marginalGain / candidate.estimatedDurationSeconds;

      if (efficiency > bestMarginalEfficiency) {
        bestMarginalEfficiency = efficiency;
        bestCandidateIndex = i;
      }
    }

    if (bestCandidateIndex >= 0 && bestMarginalEfficiency > 0) {
      const picked = pool.splice(bestCandidateIndex, 1)[0];
      selected.push(picked);
      remainingBudget -= picked.estimatedDurationSeconds;
    } else {
      break;
    }
  }

  const finalEval = evaluateObjective(selected, requirements);
  return {
    bestSubset: selected,
    bestScore: finalEval.netScore,
    totalDistance: finalEval.totalDistanceMeters,
  };
}

/**
 * Compiles an optimized interactive mission adhering strictly to bounded time limits.
 */
export function compileMissionV2(options: {
  roleTitle: string;
  roleSlug: string;
  requirements: RoleRequirement[];
  budget: VisitorTimeBudget;
  preferredGuideNpcId?: string;
  candidateSteps?: StepCandidateV2[];
}): CompiledMissionV2 {
  const {
    roleTitle,
    roleSlug,
    requirements,
    budget,
    preferredGuideNpcId,
    candidateSteps = CANONICAL_STEP_CANDIDATES,
  } = options;

  const budgetSeconds = BUDGET_LIMITS_SECONDS[budget] || 300;

  // 1. Solve optimization problem
  const solverUsed =
    candidateSteps.length <= 15 ? "EXACT_BRANCH_AND_BOUND" : "GREEDY_MARGINAL_GAIN";

  const { bestSubset, bestScore, totalDistance } =
    solverUsed === "EXACT_BRANCH_AND_BOUND"
      ? solveExactBranchAndBound(candidateSteps, requirements, budgetSeconds)
      : solveGreedyMarginalGain(candidateSteps, requirements, budgetSeconds);

  const consumedSeconds = bestSubset.reduce((sum, s) => sum + s.estimatedDurationSeconds, 0);
  const slackSeconds = budgetSeconds - consumedSeconds;

  // 2. Generate detailed explainability for each candidate step
  const stepDecisions: OptimizedStepDecision[] = candidateSteps.map((candidate) => {
    const isSelected = bestSubset.some((s) => s.id === candidate.id);
    const coveredReqs = requirements.filter((r) =>
      candidate.coveredSkillIds.includes(r.canonicalSkillId)
    );
    const unlockedIds = coveredReqs.map((r) => r.id);

    let explanation: string;
    let marginalGain = 0;

    if (isSelected) {
      const subsetWithoutCandidate = bestSubset.filter((s) => s.id !== candidate.id);
      const evalWithout = evaluateObjective(subsetWithoutCandidate, requirements);
      marginalGain = Math.round((bestScore - evalWithout.netScore) * 100) / 100;

      explanation = `Selected: satisfies ${unlockedIds.length} target requirement(s) with marginal objective gain of +${marginalGain} within ${candidate.estimatedDurationSeconds}s.`;
    } else {
      if (candidate.estimatedDurationSeconds > slackSeconds) {
        explanation = `Excluded: duration (${candidate.estimatedDurationSeconds}s) exceeds available budget slack of ${slackSeconds}s (${consumedSeconds}s / ${budgetSeconds}s allocated).`;
      } else {
        explanation = `Excluded: marginal requirement coverage redundant or suboptimal compared to higher-efficiency candidates.`;
      }
    }

    return {
      stepId: candidate.id,
      title: candidate.title,
      selected: isSelected,
      marginalGain,
      stepDurationSeconds: candidate.estimatedDurationSeconds,
      unlockedRequirementIds: unlockedIds,
      explanation,
    };
  });

  // 3. Fallback Mode determination
  const fallbackMode =
    bestSubset.length === 0 ? "EVIDENCE_ONLY_DOSSIER" : "PHYSICAL_CAMPUS_TOUR";

  // 4. Match requirements against evidence graph
  const matchedResults: EvidenceMatchResult[] = matchRequirementsToEvidence(
    requirements,
    ENGINEERING_EVIDENCE_GRAPH
  );

  // 5. Build Mission Steps
  const steps: MissionStep[] = bestSubset.map((candidate, idx) => {
    const coveredInStep = requirements
      .filter((r) => candidate.coveredSkillIds.includes(r.canonicalSkillId))
      .map((r) => r.id);

    return {
      stepIndex: idx + 1,
      id: candidate.id,
      title: candidate.title,
      roleExplanation: candidate.roleExplanation,
      demonstrationId: candidate.demonstrationId,
      projectId: candidate.projectId,
      facilityId: candidate.facilityId,
      coordinates: candidate.coordinates,
      approachLookAt: candidate.approachLookAt,
      coveredRequirementIds: coveredInStep,
      evidenceIds: candidate.evidenceIds,
      estimatedDurationSeconds: candidate.estimatedDurationSeconds,
      routeDescription: candidate.routeDescription,
      fallbackRoute: candidate.fallbackRoute,
      trialChallengeId: candidate.trialChallengeId,
    };
  });

  // 6. Identify Uncovered Requirements
  const coveredReqIds = new Set<string>();
  steps.forEach((s) => s.coveredRequirementIds.forEach((id) => coveredReqIds.add(id)));
  const uncoveredRequirements = requirements.filter((r) => !coveredReqIds.has(r.id));

  // 7. Guide NPC Assignment
  let guide = GUIDE_NPCS[preferredGuideNpcId || ""];
  if (!guide) {
    const preset = getRolePresetBySlug(roleSlug);
    if (preset?.recommendedGuideNpcId && GUIDE_NPCS[preset.recommendedGuideNpcId]) {
      guide = GUIDE_NPCS[preset.recommendedGuideNpcId];
    } else if (steps.length > 0) {
      const firstFac = steps[0].facilityId;
      const matchedNpc = Object.values(GUIDE_NPCS).find((g) => g.facilityId === firstFac);
      guide = matchedNpc || GUIDE_NPCS["marcus-vance"];
    } else {
      guide = GUIDE_NPCS["marcus-vance"];
    }
  }

  const missionId = `mission-v2-${roleSlug}-${budget.toLowerCase()}-${Date.now().toString(36)}`;

  return {
    missionId,
    roleTitle,
    roleSlug,
    visitorBudget: budget,
    registryVersion: "2.0.0-defense",
    compiledAt: new Date().toISOString(),
    steps,
    matchedRequirements: matchedResults,
    uncoveredRequirements,
    totalDurationSeconds: consumedSeconds,
    assignedGuideNpc: guide,
    optimizationAudit: {
      solverUsed,
      budgetSeconds,
      consumedSeconds,
      slackSeconds,
      objectiveScore: bestScore,
      stepDecisions,
      fallbackMode,
      routingDistanceMeters: totalDistance,
    },
  };
}


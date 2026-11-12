/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Adaptive Mission Compiler
 *
 * Solves a constrained weighted-coverage optimization to generate an interactive
 * 3D campus mission matching verified evidence within a visitor's time budget.
 */

import { ENGINEERING_EVIDENCE_GRAPH } from "./evidenceGraph";
import { matchRequirementsToEvidence } from "./evidenceMatcher";
import { getRolePresetBySlug } from "./skillTaxonomy";
import type {
  CompiledMission,
  CuratedRolePreset,
  EvidenceMatchResult,
  MissionStep,
  RoleRequirement,
  VisitorTimeBudget,
} from "./types";

export const BUDGET_LIMITS_SECONDS: Record<VisitorTimeBudget, number> = {
  QUICK_90S: 90,
  PROFESSIONAL_5M: 300,
  DEEP_DIVE: 600,
};

interface StepCandidate {
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

const STEP_CANDIDATES: StepCandidate[] = [
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
      "de-spatial-alignment",
      "be-timescaledb",
      "be-fastapi",
      "lang-sql",
      "be-websockets",
    ],
    evidenceIds: [
      "ev-livef1-ingestion",
      "ev-livef1-normalization",
      "ev-livef1-timescaledb",
      "ev-livef1-spatial",
    ],
    estimatedDurationSeconds: 40,
    routeDescription: "Ascend east into the Race Control Telemetry Tower ingestion command center.",
    fallbackRoute: "/multiverse?demo=live-f1",
    trialChallengeId: "systems_reliability_03",
  },
  {
    id: "step-sentinel-governance",
    title: "Sentinel AI — NIST RMF Governance & Vector Drift",
    roleExplanation: "Demonstrates cryptographic audit logs, embedding cosine drift detectors, and automated AI safety compliance.",
    demonstrationId: "demo-sentinel",
    projectId: "sentinel",
    facilityId: "aiml",
    coordinates: [24, 2, 24],
    approachLookAt: [24, 2, 30],
    coveredSkillIds: [
      "ai-governance-rmf",
      "ai-embeddings-drift",
      "se-security-crypto",
      "ai-model-evaluation",
      "lang-python",
      "se-testing",
    ],
    evidenceIds: ["ev-sentinel-governance", "ev-sentinel-crypto", "ev-sentinel-drift"],
    estimatedDurationSeconds: 40,
    routeDescription: "Head southeast toward the AI/ML Neural Architecture Lab secure server rack.",
    fallbackRoute: "/multiverse?demo=sentinel",
    trialChallengeId: "ml_reliability_02",
  },
  {
    id: "step-vyaparpulse-offline",
    title: "VyaparPulse AI — Durable Offline Double-Entry Ledger",
    roleExplanation: "Demonstrates SQLite write-ahead logging, zero-balance double-entry invariants, and acoustic speech parsing.",
    demonstrationId: "demo-vyaparpulse",
    projectId: "vyaparpulse",
    facilityId: "operations",
    coordinates: [-24, 2, 24],
    approachLookAt: [-24, 2, 30],
    coveredSkillIds: [
      "fe-offline-first",
      "be-double-entry",
      "ai-time-series",
      "lang-python",
      "be-fastapi",
    ],
    evidenceIds: [
      "ev-vyapar-offline",
      "ev-vyapar-doubleentry",
      "ev-vyapar-forecast",
      "ev-vyapar-asr",
    ],
    estimatedDurationSeconds: 35,
    routeDescription: "Enter the Team Operations Command Wing financial telemetry deck.",
    fallbackRoute: "/multiverse?demo=vyaparpulse",
  },
  {
    id: "step-simulation-dynamics",
    title: "Vehicle Dynamics & Quasi-Static Lap Solver",
    roleExplanation: "Demonstrates G-G friction envelope modeling, numerical 3-pass lap solver, and downforce aero maps.",
    demonstrationId: "demo-simulation",
    projectId: "world",
    facilityId: "simulation",
    coordinates: [0, 2, 32],
    approachLookAt: [0, 2, 38],
    coveredSkillIds: [
      "ms-vehicle-kinematics",
      "ms-tyre-degradation",
      "se-performance",
      "lang-typescript",
      "lang-python",
    ],
    evidenceIds: ["ev-world-threejs", "ev-racemind-tyrewear"],
    estimatedDurationSeconds: 30,
    routeDescription: "Step south into the Vehicle Dynamics Simulation Lab dynamometer bay.",
    fallbackRoute: "/sim",
    trialChallengeId: "race_performance_01",
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
 * Compiles an interactive mission matching requirements within the specified time budget.
 */
export function compileMission(options: {
  roleTitle: string;
  roleSlug: string;
  requirements: RoleRequirement[];
  budget: VisitorTimeBudget;
  preferredGuideNpcId?: string;
}): CompiledMission {
  const { roleTitle, roleSlug, requirements, budget, preferredGuideNpcId } = options;
  const budgetSeconds = BUDGET_LIMITS_SECONDS[budget] || 300;

  // 1. Match requirements against evidence graph
  const matchedResults = matchRequirementsToEvidence(requirements, ENGINEERING_EVIDENCE_GRAPH);

  // 2. Identify covered skills from direct and related matches
  const coveredSkillIds = new Set(
    matchedResults
      .filter((m) => m.strength === "DIRECT" || m.strength === "RELATED")
      .map((m) => m.requirement.canonicalSkillId)
  );

  // 3. Score step candidates using constrained weighted coverage
  const scoredCandidates = STEP_CANDIDATES.map((candidate) => {
    let score = 0;
    const coveredInThisStep: string[] = [];

    requirements.forEach((req) => {
      if (candidate.coveredSkillIds.includes(req.canonicalSkillId)) {
        coveredInThisStep.push(req.id);
        const priorityMultiplier =
          req.priority === "REQUIRED" ? 3.0 : req.priority === "PREFERRED" ? 1.8 : 1.0;
        const importanceWeight = req.importance || 3;
        score += priorityMultiplier * importanceWeight;
      }
    });

    const efficiency = candidate.estimatedDurationSeconds > 0
      ? score / candidate.estimatedDurationSeconds
      : 0;

    return {
      candidate,
      score,
      efficiency,
      coveredRequirementIds: coveredInThisStep,
    };
  });

  // Sort candidates by score descending, then efficiency descending, then id alphabetically (deterministic)
  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.efficiency !== a.efficiency) return b.efficiency - a.efficiency;
    return a.candidate.id.localeCompare(b.candidate.id);
  });

  // 4. Select steps greedily within budget
  const selectedSteps: MissionStep[] = [];
  let accumulatedTime = 0;
  const alreadyCoveredReqIds = new Set<string>();

  for (const item of scoredCandidates) {
    if (item.score === 0 && selectedSteps.length > 0) continue; // Skip zero-coverage if we have steps

    const willFit = accumulatedTime + item.candidate.estimatedDurationSeconds <= budgetSeconds;

    // Always take at least the highest-scoring step
    if (willFit || selectedSteps.length === 0) {
      selectedSteps.push({
        stepIndex: selectedSteps.length + 1,
        id: item.candidate.id,
        title: item.candidate.title,
        roleExplanation: item.candidate.roleExplanation,
        demonstrationId: item.candidate.demonstrationId,
        projectId: item.candidate.projectId,
        facilityId: item.candidate.facilityId,
        coordinates: item.candidate.coordinates,
        approachLookAt: item.candidate.approachLookAt,
        coveredRequirementIds: item.coveredRequirementIds,
        evidenceIds: item.candidate.evidenceIds,
        estimatedDurationSeconds: item.candidate.estimatedDurationSeconds,
        routeDescription: item.candidate.routeDescription,
        fallbackRoute: item.candidate.fallbackRoute,
        trialChallengeId: item.candidate.trialChallengeId,
      });

      accumulatedTime += item.candidate.estimatedDurationSeconds;
      item.coveredRequirementIds.forEach((id) => alreadyCoveredReqIds.add(id));
    }
  }

  // 5. Determine uncovered requirements
  const uncoveredRequirements = requirements.filter(
    (req) => !alreadyCoveredReqIds.has(req.id)
  );

  // 6. Select Guide NPC
  let guide = GUIDE_NPCS[preferredGuideNpcId || ""];
  if (!guide) {
    const preset = getRolePresetBySlug(roleSlug);
    if (preset?.recommendedGuideNpcId && GUIDE_NPCS[preset.recommendedGuideNpcId]) {
      guide = GUIDE_NPCS[preset.recommendedGuideNpcId];
    } else if (selectedSteps.length > 0) {
      // Pick guide closest to first step's facility
      const firstFac = selectedSteps[0].facilityId;
      const matchedNpc = Object.values(GUIDE_NPCS).find((g) => g.facilityId === firstFac);
      guide = matchedNpc || GUIDE_NPCS["marcus-vance"];
    } else {
      guide = GUIDE_NPCS["marcus-vance"];
    }
  }

  const missionId = `mission-${roleSlug}-${budget.toLowerCase()}-${Date.now().toString(36)}`;

  return {
    missionId,
    roleTitle,
    roleSlug,
    visitorBudget: budget,
    registryVersion: "1.0.0-rc1",
    compiledAt: new Date().toISOString(),
    steps: selectedSteps,
    matchedRequirements: matchedResults,
    uncoveredRequirements,
    totalDurationSeconds: accumulatedTime,
    assignedGuideNpc: guide,
  };
}


/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Core Type Definitions & System Contracts
 */

export type RequirementPriority =
  | "REQUIRED"
  | "PREFERRED"
  | "OPTIONAL"
  | "UNCLEAR";

export type EvidenceStrength =
  | "DIRECT"
  | "RELATED"
  | "PARTIAL"
  | "NONE";

export type ProvenanceLevel =
  | "VERIFIED_IMPLEMENTATION"
  | "VERIFIED_TEST_RESULT"
  | "REPRODUCIBLE_DEMONSTRATION"
  | "DOCUMENTED_CAPABILITY"
  | "PARTIAL_EVIDENCE"
  | "REPORTED_NOT_VERIFIED"
  | "UNAVAILABLE";

export type VisitorTimeBudget =
  | "QUICK_90S"
  | "PROFESSIONAL_5M"
  | "DEEP_DIVE";

export type SkillCategory =
  | "languages"
  | "software-engineering"
  | "backend-infra"
  | "ai-ml"
  | "data-engineering"
  | "motorsport-sim"
  | "frontend";

export interface CanonicalSkill {
  id: string;
  name: string;
  category: SkillCategory;
  aliases: string[];
  disambiguation?: {
    confusedWith: string;
    distinction: string;
  }[];
  keywords: string[];
  description: string;
}

export interface RoleRequirement {
  id: string;
  canonicalSkillId: string;
  skillName: string;
  originalTextSpan?: string;
  category: SkillCategory;
  priority: RequirementPriority;
  importance: number; // 1 (lowest) to 5 (highest)
  userConfirmed: boolean;
  userModified: boolean;
}

export interface CuratedRolePreset {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  discipline: string;
  targetAudience: string;
  defaultBudget: VisitorTimeBudget;
  description: string;
  coreRequirements: Omit<RoleRequirement, "id" | "userConfirmed" | "userModified">[];
  recommendedGuideNpcId: string;
}

export interface EngineeringEvidenceNode {
  id: string;
  projectId: string; // e.g. "racemind", "live-f1", "sentinel", "vyaparpulse", "simulation"
  skillIds: string[];
  title: string;
  description: string;
  sourceRepository: string;
  sourceCommit: string;
  sourceFilePath: string;
  lineRange?: [number, number];
  demonstrationId?: string;
  trialId?: string;
  testReferences: string[];
  provenance: ProvenanceLevel;
  limitations: string[];
  keyFormulas?: string[];
  metricCallout?: { label: string; value: string };
}

export interface EvidenceMatchResult {
  requirement: RoleRequirement;
  matchedEvidence: EngineeringEvidenceNode[];
  strength: EvidenceStrength;
  supportingProjectIds: string[];
  reason: string;
  limitations: string[];
}

export interface MissionStep {
  stepIndex: number;
  id: string;
  title: string;
  roleExplanation: string;
  demonstrationId: string;
  projectId: string;
  facilityId: string;
  coordinates: [number, number, number];
  approachLookAt: [number, number, number];
  coveredRequirementIds: string[];
  evidenceIds: string[];
  estimatedDurationSeconds: number;
  routeDescription: string;
  fallbackRoute: string;
  trialChallengeId?: string;
}

export interface CompiledMission {
  missionId: string;
  roleTitle: string;
  roleSlug: string;
  visitorBudget: VisitorTimeBudget;
  registryVersion: string;
  compiledAt: string;
  steps: MissionStep[];
  matchedRequirements: EvidenceMatchResult[];
  uncoveredRequirements: RoleRequirement[];
  totalDurationSeconds: number;
  assignedGuideNpc: {
    id: string;
    name: string;
    role: string;
    facilityId: string;
    introduction: string;
  };
}

export interface RoleForgeEvidenceBrief {
  briefId: string;
  targetRole: string;
  visitorBudget: VisitorTimeBudget;
  compiledMission: CompiledMission;
  directEvidenceCount: number;
  relatedEvidenceCount: number;
  uncoveredCount: number;
  technicalHighlights: {
    title: string;
    category: string;
    detail: string;
    sourcePath: string;
    githubUrl: string;
  }[];
  disclosedGaps: {
    skillName: string;
    reason: string;
  }[];
  verifiedRepositories: {
    name: string;
    url: string;
    commit: string;
    provenance: string;
  }[];
  candidateLinks: {
    github: string;
    portfolio: string;
    resumePdf: string;
    email: string;
  };
}


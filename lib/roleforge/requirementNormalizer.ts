/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Requirement Normalizer & User-Review State Transformations
 */

import { CANONICAL_SKILL_TAXONOMY, getSkillById } from "./skillTaxonomy";
import { parseJobDescription, type ParsedRequirementCandidate } from "./jobParser";
import type { CuratedRolePreset, RequirementPriority, RoleRequirement, SkillCategory } from "./types";

export function createRequirementsFromParsedCandidates(
  candidates: ParsedRequirementCandidate[]
): RoleRequirement[] {
  return candidates.map((cand, idx) => ({
    id: `req-${idx + 1}-${cand.skill.id}`,
    canonicalSkillId: cand.skill.id,
    skillName: cand.skill.name,
    originalTextSpan: cand.originalTextSpan,
    category: cand.skill.category,
    priority: cand.priority,
    importance: cand.importance,
    userConfirmed: true,
    userModified: false,
  }));
}

export function createRequirementsFromPreset(preset: CuratedRolePreset): RoleRequirement[] {
  return preset.coreRequirements.map((core, idx) => ({
    id: `preset-${preset.slug}-${idx + 1}`,
    canonicalSkillId: core.canonicalSkillId,
    skillName: core.skillName,
    originalTextSpan: `Core requirement for ${preset.title}: ${core.skillName}`,
    category: core.category,
    priority: core.priority,
    importance: core.importance,
    userConfirmed: true,
    userModified: false,
  }));
}

export function updateRequirementPriority(
  requirements: RoleRequirement[],
  requirementId: string,
  newPriority: RequirementPriority
): RoleRequirement[] {
  return requirements.map((req) => {
    if (req.id === requirementId) {
      return {
        ...req,
        priority: newPriority,
        userModified: true,
      };
    }
    return req;
  });
}

export function updateRequirementImportance(
  requirements: RoleRequirement[],
  requirementId: string,
  newImportance: number
): RoleRequirement[] {
  const clamped = Math.max(1, Math.min(5, newImportance));
  return requirements.map((req) => {
    if (req.id === requirementId) {
      return {
        ...req,
        importance: clamped,
        userModified: true,
      };
    }
    return req;
  });
}

export function removeRequirement(
  requirements: RoleRequirement[],
  requirementId: string
): RoleRequirement[] {
  return requirements.filter((req) => req.id !== requirementId);
}

export function addCustomRequirement(
  requirements: RoleRequirement[],
  skillId: string,
  priority: RequirementPriority = "REQUIRED",
  importance: number = 4
): RoleRequirement[] {
  // Check if skill already exists
  if (requirements.some((r) => r.canonicalSkillId === skillId)) {
    return requirements;
  }

  const skill = getSkillById(skillId);
  if (!skill) return requirements;

  const newReq: RoleRequirement = {
    id: `custom-req-${Date.now()}-${skill.id}`,
    canonicalSkillId: skill.id,
    skillName: skill.name,
    originalTextSpan: `Manually added by recruiter: ${skill.name}`,
    category: skill.category,
    priority,
    importance,
    userConfirmed: true,
    userModified: true,
  };

  return [...requirements, newReq];
}


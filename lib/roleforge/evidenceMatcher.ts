/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Explainable Evidence Matching Engine
 *
 * Categorizes requirement matches into DIRECT, RELATED, PARTIAL, or NONE.
 * Generates transparent engineering rationale and never fabricates scores.
 */

import { ENGINEERING_EVIDENCE_GRAPH } from "./evidenceGraph";
import { getSkillById } from "./skillTaxonomy";
import type {
  EngineeringEvidenceNode,
  EvidenceMatchResult,
  EvidenceStrength,
  RoleRequirement,
} from "./types";

const PROJECT_DISPLAY_NAMES: Record<string, string> = {
  racemind: "RaceMind AI",
  "live-f1": "Live F1 Intelligence",
  sentinel: "Sentinel AI",
  vyaparpulse: "VyaparPulse AI",
  world: "Frontier World & Digital Twin",
};

/**
 * Matches an array of role requirements against the engineering evidence graph.
 * Pure, deterministic function.
 */
export function matchRequirementsToEvidence(
  requirements: RoleRequirement[],
  graph: EngineeringEvidenceNode[] = ENGINEERING_EVIDENCE_GRAPH
): EvidenceMatchResult[] {
  return requirements.map((req) => matchSingleRequirement(req, graph));
}

/**
 * Matches a single requirement against the evidence graph.
 */
export function matchSingleRequirement(
  req: RoleRequirement,
  graph: EngineeringEvidenceNode[] = ENGINEERING_EVIDENCE_GRAPH
): EvidenceMatchResult {
  // 1. Check for DIRECT evidence (exact canonical skill ID)
  const directNodes = graph.filter((node) =>
    node.skillIds.includes(req.canonicalSkillId)
  );

  if (directNodes.length > 0) {
    const projectIds = Array.from(new Set(directNodes.map((n) => n.projectId)));
    const projectNames = projectIds
      .map((id) => PROJECT_DISPLAY_NAMES[id] || id)
      .join(" and ");

    const topEvidence = directNodes[0];
    const testCount = directNodes.reduce(
      (sum, n) => sum + (n.testReferences?.length || 0),
      0
    );

    const reason = `Direct verified implementation in ${projectNames}. Specifically demonstrated by "${topEvidence.title}" (${topEvidence.sourceFilePath}) with ${testCount > 0 ? `${testCount} verified test suites and ` : ""}${topEvidence.provenance.toLowerCase().replace(/_/g, " ")}.`;

    const limitations = Array.from(
      new Set(directNodes.flatMap((n) => n.limitations || []))
    );

    return {
      requirement: req,
      matchedEvidence: directNodes,
      strength: "DIRECT",
      supportingProjectIds: projectIds,
      reason,
      limitations,
    };
  }

  // 2. Check for unmapped skill outside taxonomy
  const canonicalSkill = getSkillById(req.canonicalSkillId);
  if (!canonicalSkill) {
    return {
      requirement: req,
      matchedEvidence: [],
      strength: "NONE",
      supportingProjectIds: [],
      reason: `No verified repository artifact in the public evidence graph directly matches "${req.skillName}". In accordance with Frontier verification standards, this requirement is marked as a disclosed gap rather than claiming unsubstantiated mastery.`,
      limitations: [
        `Public implementation for ${req.skillName} is not present in the verified portfolio commit tree.`,
      ],
    };
  }

  // 3. Check for RELATED evidence (same category or shared sub-discipline)
  const reqCategory = req.category;

  const relatedNodes = graph.filter((node) => {
    // Check if any skill in the node belongs to the same category
    return node.skillIds.some((sId) => {
      const s = getSkillById(sId);
      return s && s.category === reqCategory;
    });
  });

  if (relatedNodes.length > 0) {
    // Pick the most relevant related node based on priority/metrics
    const projectIds = Array.from(new Set(relatedNodes.map((n) => n.projectId)));
    const projectNames = projectIds
      .map((id) => PROJECT_DISPLAY_NAMES[id] || id)
      .slice(0, 2)
      .join(" and ");

    const bestNode = relatedNodes[0];
    const reason = `Related competency demonstrated in ${projectNames} within the ${reqCategory} domain. Demonstrated via "${bestNode.title}" (${bestNode.sourceFilePath}), showing production architectural patterns even though the specific framework or protocol varies.`;

    const limitations = Array.from(
      new Set(
        relatedNodes
          .flatMap((n) => n.limitations || [])
          .concat([
            `Verified implementation covers sibling ${reqCategory} capabilities rather than exact ${req.skillName} specialization.`,
          ])
      )
    );

    return {
      requirement: req,
      matchedEvidence: relatedNodes,
      strength: "RELATED",
      supportingProjectIds: projectIds,
      reason,
      limitations,
    };
  }

  // 3. Check for PARTIAL evidence (cross-disciplinary foundations e.g. software engineering / systems)
  const foundationalNodes = graph.filter((node) =>
    node.skillIds.some(
      (sId) => sId.startsWith("se-") || sId.startsWith("lang-")
    )
  );

  if (foundationalNodes.length > 0 && req.priority !== "REQUIRED") {
    const projectIds = Array.from(
      new Set(foundationalNodes.slice(0, 2).map((n) => n.projectId))
    );
    const reason = `Foundational software engineering practice verified across production repositories, providing transferable core principles for ${req.skillName}.`;

    return {
      requirement: req,
      matchedEvidence: foundationalNodes.slice(0, 2),
      strength: "PARTIAL",
      supportingProjectIds: projectIds,
      reason,
      limitations: [
        `No dedicated public codebase module for ${req.skillName}; relying on verified transferable systems engineering discipline.`,
      ],
    };
  }

  // 4. NONE (Honest disclosure of gap)
  return {
    requirement: req,
    matchedEvidence: [],
    strength: "NONE",
    supportingProjectIds: [],
    reason: `No verified repository artifact in the public evidence graph directly matches "${req.skillName}". In accordance with Frontier verification standards, this requirement is marked as a disclosed gap rather than claiming unsubstantiated mastery.`,
    limitations: [
      `Public implementation for ${req.skillName} is not present in the verified portfolio commit tree.`,
    ],
  };
}

/**
 * Aggregates match statistics without producing fake percentages.
 */
export function summarizeEvidenceMatches(matches: EvidenceMatchResult[]) {
  const directCount = matches.filter((m) => m.strength === "DIRECT").length;
  const relatedCount = matches.filter((m) => m.strength === "RELATED").length;
  const partialCount = matches.filter((m) => m.strength === "PARTIAL").length;
  const noneCount = matches.filter((m) => m.strength === "NONE").length;

  const requiredMatches = matches.filter(
    (m) => m.requirement.priority === "REQUIRED"
  );
  const requiredDirectCount = requiredMatches.filter(
    (m) => m.strength === "DIRECT"
  ).length;

  const total = matches.length;

  return {
    total,
    directCount,
    relatedCount,
    partialCount,
    noneCount,
    requiredCount: requiredMatches.length,
    requiredDirectCount,
    allRequiredAddressed:
      requiredMatches.length > 0
        ? requiredMatches.every((m) => m.strength !== "NONE")
        : true,
  };
}


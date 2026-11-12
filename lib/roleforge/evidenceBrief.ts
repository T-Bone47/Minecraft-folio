/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * RoleForge Evidence Brief Generator
 *
 * Compiles a printable, recruiter-ready executive summary and technical appendix
 * detailing verified evidence, GitHub permalinks, and disclosed gaps.
 */

import { summarizeEvidenceMatches } from "./evidenceMatcher";
import type { CompiledMission, RoleForgeEvidenceBrief } from "./types";

const REPOSITORY_DIRECTORY = [
  {
    name: "RaceMind-AI",
    url: "https://github.com/T-Bone47/RaceMind-AI",
    commit: "b8e4f1a",
    provenance: "Verified Git History & Pytest Suites",
  },
  {
    name: "live-f1-intelligence",
    url: "https://github.com/T-Bone47/live-f1-intelligence",
    commit: "4c7189d",
    provenance: "High-Throughput Replay Benchmarks & TimescaleDB Schema",
  },
  {
    name: "Sentinel-AI",
    url: "https://github.com/T-Bone47/Sentinel-AI",
    commit: "a192c73",
    provenance: "HMAC Cryptographic Ledger & Cosine Drift Detection",
  },
  {
    name: "vyaparpulse-ai",
    url: "https://github.com/T-Bone47/vyaparpulse-ai",
    commit: "f589b21",
    provenance: "Offline-First SQLite WAL & Zero-Sum Accounting Tests",
  },
  {
    name: "Minecraft-folio",
    url: "https://github.com/T-Bone47/Minecraft-folio",
    commit: "a7c8e4b",
    provenance: "Next.js 15 App Router & 60 FPS Three.js Voxel Engine",
  },
];

export function generateEvidenceBrief(
  mission: CompiledMission,
  targetRoleTitle?: string
): RoleForgeEvidenceBrief {
  const roleName = targetRoleTitle || mission.roleTitle;
  const matchStats = summarizeEvidenceMatches(mission.matchedRequirements);

  // Collect technical highlights from matched evidence
  const technicalHighlights: RoleForgeEvidenceBrief["technicalHighlights"] = [];
  const seenHighlights = new Set<string>();

  mission.matchedRequirements.forEach((m) => {
    m.matchedEvidence.forEach((node) => {
      if (!seenHighlights.has(node.id)) {
        seenHighlights.add(node.id);
        const githubUrl = `${node.sourceRepository}/blob/${node.sourceCommit}/${node.sourceFilePath}`;
        technicalHighlights.push({
          title: node.title,
          category: m.requirement.category,
          detail: node.description,
          sourcePath: node.sourceFilePath,
          githubUrl,
        });
      }
    });
  });

  // Collect disclosed gaps
  const disclosedGaps = mission.matchedRequirements
    .filter((m) => m.strength === "NONE" || m.strength === "PARTIAL")
    .map((m) => ({
      skillName: m.requirement.skillName,
      reason: m.reason,
    }));

  // Identify repositories relevant to this mission
  const activeProjectIds = new Set<string>();
  mission.steps.forEach((s) => activeProjectIds.add(s.projectId));
  mission.matchedRequirements.forEach((m) => {
    m.supportingProjectIds.forEach((p) => activeProjectIds.add(p));
  });

  const verifiedRepositories = REPOSITORY_DIRECTORY.filter((repo) => {
    if (activeProjectIds.has("racemind") && repo.name === "RaceMind-AI") return true;
    if (activeProjectIds.has("live-f1") && repo.name === "live-f1-intelligence") return true;
    if (activeProjectIds.has("sentinel") && repo.name === "Sentinel-AI") return true;
    if (activeProjectIds.has("vyaparpulse") && repo.name === "vyaparpulse-ai") return true;
    if (activeProjectIds.has("world") && repo.name === "Minecraft-folio") return true;
    return false;
  });

  // If none matched, include the primary portfolio repositories
  const finalRepositories =
    verifiedRepositories.length > 0
      ? verifiedRepositories
      : REPOSITORY_DIRECTORY.slice(0, 3);

  const briefId = `brief-${mission.roleSlug}-${Date.now().toString(36)}`;

  return {
    briefId,
    targetRole: roleName,
    visitorBudget: mission.visitorBudget,
    compiledMission: mission,
    directEvidenceCount: matchStats.directCount,
    relatedEvidenceCount: matchStats.relatedCount,
    uncoveredCount: mission.uncoveredRequirements.length,
    technicalHighlights: technicalHighlights.slice(0, 8),
    disclosedGaps,
    verifiedRepositories: finalRepositories,
    candidateLinks: {
      github: "https://github.com/T-Bone47",
      portfolio: "https://asish-engineering-world.vercel.app",
      resumePdf: "https://github.com/T-Bone47/Minecraft-folio/blob/main/public/resume.pdf",
      email: "mailto:asish.contact@engineering.frontier",
    },
  };
}


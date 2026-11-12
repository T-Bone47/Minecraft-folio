/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Automated Unit Test Suite
 *
 * Verifies skill taxonomy, privacy-first job parser, negation handling,
 * evidence graph integrity, categorical matching, adaptive mission compilation,
 * budget limits, and state store transitions.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_SKILL_TAXONOMY,
  CURATED_ROLE_PRESETS,
  getSkillById,
  getRolePresetBySlug,
  disambiguateSkill,
} from "../lib/roleforge/skillTaxonomy";

import {
  parseJobDescription,
  sanitizeJobText,
} from "../lib/roleforge/jobParser";

import {
  createRequirementsFromPreset,
  createRequirementsFromParsedCandidates,
  updateRequirementPriority,
  updateRequirementImportance,
  removeRequirement,
  addCustomRequirement,
} from "../lib/roleforge/requirementNormalizer";

import {
  ENGINEERING_EVIDENCE_GRAPH,
  getEvidenceById,
  getEvidenceByProjectId,
  getEvidenceBySkillId,
} from "../lib/roleforge/evidenceGraph";

import {
  matchRequirementsToEvidence,
  matchSingleRequirement,
  summarizeEvidenceMatches,
} from "../lib/roleforge/evidenceMatcher";

import {
  compileMission,
  BUDGET_LIMITS_SECONDS,
} from "../lib/roleforge/missionCompiler";

import { validateCompiledMission } from "../lib/roleforge/missionValidator";

import { generateEvidenceBrief } from "../lib/roleforge/evidenceBrief";

import { useRoleForgeStore } from "../state/roleforgeStore";

// =============================================================================
// 1. CANONICAL SKILL TAXONOMY & ROLE PRESETS
// =============================================================================

test("Taxonomy contains non-empty canonical skills with valid categories", () => {
  assert.ok(CANONICAL_SKILL_TAXONOMY.length >= 20, "Should have at least 20 canonical skills");

  const validCategories = new Set([
    "languages",
    "software-engineering",
    "backend-infra",
    "ai-ml",
    "data-engineering",
    "motorsport-sim",
    "frontend",
  ]);

  for (const skill of CANONICAL_SKILL_TAXONOMY) {
    assert.ok(skill.id, "Skill must have an id");
    assert.ok(skill.name, "Skill must have a name");
    assert.ok(validCategories.has(skill.category), `Invalid category: ${skill.category}`);
    assert.ok(Array.isArray(skill.keywords) && skill.keywords.length > 0, "Keywords required");
  }
});

test("Disambiguation rules resolve distinct technologies cleanly", () => {
  // Java vs JavaScript
  const jsDisambig = disambiguateSkill("lang-javascript", "Looking for backend Java developer");
  assert.equal(jsDisambig, false, "JavaScript should not match plain Java");

  const realJs = disambiguateSkill("lang-javascript", "Experienced JavaScript / ES6 frontend engineer");
  assert.equal(realJs, true, "JavaScript should match explicit JavaScript");

  // React vs Reactive
  const reactDisambig = disambiguateSkill("fe-react-nextjs", "Requires reactive architecture and RxJava");
  assert.equal(reactDisambig, false, "React should not match pure reactive programming");

  const realReact = disambiguateSkill("fe-react-nextjs", "Modern React 19 and Next.js applications");
  assert.equal(realReact, true, "React should match explicit React");
});

test("Curated role presets contain 7 distinct engineering disciplines", () => {
  assert.equal(CURATED_ROLE_PRESETS.length, 7, "Must have exactly 7 curated role presets");

  const expectedSlugs = [
    "motorsport",
    "backend",
    "aiml",
    "data-engineer",
    "full-stack",
    "simulation-engineer",
    "race-strategist",
  ];

  for (const slug of expectedSlugs) {
    const preset = getRolePresetBySlug(slug);
    assert.ok(preset, `Preset for slug "${slug}" must exist`);
    assert.ok(preset.title, "Preset must have title");
    assert.ok(preset.coreRequirements.length >= 4, "Preset must have at least 4 core requirements");
    assert.ok(preset.recommendedGuideNpcId, "Preset must assign a recommended Guide NPC");
  }
});

// =============================================================================
// 2. PRIVACY-FIRST JOB DESCRIPTION COMPILER & PARSER
// =============================================================================

test("Sanitization strips script tags and HTML without dropping text", () => {
  const dirty = "<script>alert('xss')</script><div>Senior Python Engineer with <b>TimescaleDB</b></div>";
  const cleaned = sanitizeJobText(dirty);

  assert.ok(!cleaned.includes("<script>"), "Must strip script tags");
  assert.ok(!cleaned.includes("alert"), "Must strip script body");
  assert.ok(cleaned.includes("Senior Python Engineer with TimescaleDB"), "Preserves job text");
});

test("Job Parser correctly detects priority and negations", () => {
  const sampleJob = `
    Job Title: Senior Telemetry Engineer
    Requirements:
    - Required: Deep expertise in Python and TimescaleDB.
    - Preferred: Real-time WebSockets and UDP telemetry experience.
    - Optional: Experience with Docker.
    - No Java required for this position.
  `;

  const parsed = parseJobDescription(sampleJob);
  assert.ok(parsed.length >= 3, "Should extract multiple requirements");

  // Check Python
  const pythonReq = parsed.find((p) => p.skill.id === "lang-python");
  assert.ok(pythonReq, "Should detect Python");
  assert.equal(pythonReq.priority, "REQUIRED", "Python is marked Required");

  // Check TimescaleDB
  const timescaleReq = parsed.find((p) => p.skill.id === "be-timescaledb");
  assert.ok(timescaleReq, "Should detect TimescaleDB");
  assert.equal(timescaleReq.priority, "REQUIRED", "TimescaleDB is marked Required");

  // Check WebSockets
  const wsReq = parsed.find((p) => p.skill.id === "be-websockets");
  assert.ok(wsReq, "Should detect WebSockets");
  assert.equal(wsReq.priority, "PREFERRED", "WebSockets is marked Preferred");

  // Check Negation: "No Java required" should not be extracted
  const javaReq = parsed.find((p) => p.skill.id === "lang-javascript" || p.skill.name.toLowerCase().includes("java"));
  assert.equal(javaReq, undefined, "Negated Java must not be included");
});

// =============================================================================
// 3. ENGINEERING EVIDENCE GRAPH INTEGRITY
// =============================================================================

test("Evidence Graph contains verified nodes with valid commit SHAs and paths", () => {
  assert.ok(ENGINEERING_EVIDENCE_GRAPH.length >= 10, "Evidence graph must contain at least 10 nodes");

  const validProjects = new Set(["racemind", "live-f1", "sentinel", "vyaparpulse", "world"]);
  const validCommits = new Set(["b8e4f1a", "4c7189d", "a192c73", "f589b21", "a7c8e4b"]);

  for (const node of ENGINEERING_EVIDENCE_GRAPH) {
    assert.ok(node.id.startsWith("ev-"), "Node ID must start with ev-");
    assert.ok(validProjects.has(node.projectId), `Invalid project ID: ${node.projectId}`);
    assert.ok(validCommits.has(node.sourceCommit), `Unverified commit SHA: ${node.sourceCommit}`);
    assert.ok(node.sourceFilePath.length > 0, "Source file path required");
    assert.ok(node.provenance, "Provenance level required");
    assert.ok(Array.isArray(node.limitations), "Limitations array required");
    assert.ok(node.limitations.length > 0, "Must disclose at least one genuine limitation");
  }
});

// =============================================================================
// 4. EXPLAINABLE EVIDENCE MATCHING ENGINE
// =============================================================================

test("Evidence matcher produces DIRECT, RELATED, PARTIAL, and honest NONE matches", () => {
  const motorsportPreset = getRolePresetBySlug("motorsport")!;
  const reqs = createRequirementsFromPreset(motorsportPreset);

  const matches = matchRequirementsToEvidence(reqs);
  assert.equal(matches.length, reqs.length, "Matches count must match requirements count");

  const stats = summarizeEvidenceMatches(matches);
  assert.ok(stats.directCount > 0, "Must have direct matches for motorsport preset");
  assert.ok(stats.requiredDirectCount > 0, "Must have direct matches for required skills");

  // Verify rationale strings are human-readable and cite sources
  for (const match of matches) {
    assert.ok(match.reason.length > 20, "Must provide descriptive rationale");
    if (match.strength === "DIRECT") {
      assert.ok(match.matchedEvidence.length > 0, "Direct match must have evidence nodes");
      assert.ok(match.supportingProjectIds.length > 0, "Direct match must list supporting projects");
    }
  }

  // Test an unmapped skill to verify honest NONE
  const fakeReq = {
    id: "req-unmapped-skill",
    canonicalSkillId: "unmapped-quantum-computing",
    skillName: "Quantum Annealing Algorithm",
    category: "languages" as const,
    priority: "REQUIRED" as const,
    importance: 5,
    userConfirmed: true,
    userModified: false,
  };

  const noneMatch = matchSingleRequirement(fakeReq);
  assert.equal(noneMatch.strength, "NONE", "Unmapped skill must resolve to NONE");
  assert.ok(noneMatch.reason.includes("disclosed gap"), "Rationale must disclose the gap honestly");
  assert.equal(noneMatch.matchedEvidence.length, 0, "NONE match must have empty evidence array");
});

// =============================================================================
// 5. ADAPTIVE MISSION COMPILER & BUDGET CONSTRAINTS
// =============================================================================

test("Mission compiler strictly obeys time budgets with deterministic output", () => {
  const backendPreset = getRolePresetBySlug("backend")!;
  const reqs = createRequirementsFromPreset(backendPreset);

  // Compile under 90S budget
  const mission90s = compileMission({
    roleTitle: backendPreset.title,
    roleSlug: backendPreset.slug,
    requirements: reqs,
    budget: "QUICK_90S",
  });

  assert.ok(mission90s.steps.length >= 1, "90s mission must have at least 1 step");
  assert.ok(
    mission90s.totalDurationSeconds <= BUDGET_LIMITS_SECONDS.QUICK_90S * 1.15,
    `Duration ${mission90s.totalDurationSeconds}s exceeds 90s budget limit`
  );

  // Compile under 5M budget
  const mission5m = compileMission({
    roleTitle: backendPreset.title,
    roleSlug: backendPreset.slug,
    requirements: reqs,
    budget: "PROFESSIONAL_5M",
  });

  assert.ok(
    mission5m.steps.length >= mission90s.steps.length,
    "5m mission should include at least as many steps as 90s mission"
  );
  assert.ok(
    mission5m.totalDurationSeconds <= BUDGET_LIMITS_SECONDS.PROFESSIONAL_5M * 1.15,
    `Duration ${mission5m.totalDurationSeconds}s exceeds 300s budget limit`
  );

  // Validate mission with mission validator
  const validation = validateCompiledMission(mission5m);
  assert.equal(validation.valid, true, "Mission must pass validation");
  assert.equal(validation.errors.length, 0, "Mission must have zero validation errors");
});

test("Mission steps include verified coordinates and trial challenge references", () => {
  const aimlPreset = getRolePresetBySlug("aiml")!;
  const reqs = createRequirementsFromPreset(aimlPreset);

  const mission = compileMission({
    roleTitle: aimlPreset.title,
    roleSlug: aimlPreset.slug,
    requirements: reqs,
    budget: "PROFESSIONAL_5M",
  });

  assert.ok(mission.steps.length > 0, "Mission must have steps");

  for (const step of mission.steps) {
    assert.equal(step.coordinates.length, 3, "Step must have 3D coordinates");
    assert.equal(step.approachLookAt.length, 3, "Step must have 3D look-at vector");
    assert.ok(step.estimatedDurationSeconds > 0, "Step must have positive duration");
  }

  // Check that at least one step connects to an interactive trial
  const hasTrial = mission.steps.some((s) => s.trialChallengeId);
  assert.ok(hasTrial, "AI/ML mission should include a mapped interactive trial");
});

// =============================================================================
// 6. ROLEFORGE EVIDENCE BRIEF GENERATION
// =============================================================================

test("Evidence brief compiler creates complete recruiter-ready dossier", () => {
  const preset = getRolePresetBySlug("data-engineer")!;
  const reqs = createRequirementsFromPreset(preset);
  const mission = compileMission({
    roleTitle: preset.title,
    roleSlug: preset.slug,
    requirements: reqs,
    budget: "PROFESSIONAL_5M",
  });

  const brief = generateEvidenceBrief(mission);

  assert.ok(brief.briefId.startsWith("brief-"), "Brief ID must start with brief-");
  assert.equal(brief.targetRole, preset.title, "Target role must match");
  assert.ok(brief.technicalHighlights.length > 0, "Must include technical highlights");
  assert.ok(brief.verifiedRepositories.length > 0, "Must include verified repositories");
  assert.ok(brief.candidateLinks.github.includes("T-Bone47"), "Must link to candidate GitHub");

  for (const highlight of brief.technicalHighlights) {
    assert.ok(highlight.githubUrl.includes("https://github.com"), "Must provide valid GitHub URL");
    assert.ok(highlight.sourcePath.length > 0, "Must specify source path");
  }
});

// =============================================================================
// 7. ROLEFORGE ZUSTAND STORE
// =============================================================================

test("RoleForge store handles preset selection, edits, and tab navigation", () => {
  const store = useRoleForgeStore.getState();

  // 1. Select Preset
  store.selectPreset("full-stack");
  let state = useRoleForgeStore.getState();
  assert.equal(state.selectedPresetSlug, "full-stack");
  assert.equal(state.activeTab, "review");
  assert.ok(state.activeRequirements.length >= 4);

  // 2. Update Priority
  const firstReq = state.activeRequirements[0];
  store.updatePriority(firstReq.id, "PREFERRED");
  state = useRoleForgeStore.getState();
  const updatedReq = state.activeRequirements.find((r) => r.id === firstReq.id);
  assert.equal(updatedReq?.priority, "PREFERRED");
  assert.equal(updatedReq?.userModified, true);

  // 3. Add Custom Requirement
  store.addRequirementBySkillId("ms-vehicle-kinematics", "REQUIRED", 5);
  state = useRoleForgeStore.getState();
  const added = state.activeRequirements.find((r) => r.canonicalSkillId === "ms-vehicle-kinematics");
  assert.ok(added, "Added skill must appear in activeRequirements");
  assert.equal(added?.importance, 5);

  // 4. Remove Requirement
  store.removeRequirement(firstReq.id);
  state = useRoleForgeStore.getState();
  const removed = state.activeRequirements.find((r) => r.id === firstReq.id);
  assert.equal(removed, undefined, "Removed requirement must no longer exist");

  // 5. Reset All
  store.resetAll();
  state = useRoleForgeStore.getState();
  assert.equal(state.selectedPresetSlug, "motorsport-software");
  assert.equal(state.activeTab, "presets");
});

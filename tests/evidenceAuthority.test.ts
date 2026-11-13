import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isValidGitCommitSha,
  isValidGitHubRepoUrl,
  buildGitHubBlobUrl,
  validateEvidenceNode,
  generateEvidenceManifest,
  assertEvidenceGraphIntegrity,
} from "../lib/roleforge/evidenceAuthority";
import { ENGINEERING_EVIDENCE_GRAPH } from "../lib/roleforge/evidenceGraph";

test("Evidence Authority Engine — validates Git commit SHAs accurately", () => {
  assert.strictEqual(isValidGitCommitSha("850d3c97e4fdf4aa37112efdde2e1eb7bfbd992d"), true);
  assert.strictEqual(isValidGitCommitSha("10d2f63"), true);
  assert.strictEqual(isValidGitCommitSha("invalid_sha"), false);
  assert.strictEqual(isValidGitCommitSha(""), false);
  assert.strictEqual(isValidGitCommitSha("12345"), false); // under 7 chars
});

test("Evidence Authority Engine — validates GitHub repository URLs strictly", () => {
  assert.strictEqual(isValidGitHubRepoUrl("https://github.com/T-Bone47/RaceMind-AI"), true);
  assert.strictEqual(isValidGitHubRepoUrl("https://github.com/T-Bone47/live-f1-intelligence/"), true);
  assert.strictEqual(isValidGitHubRepoUrl("https://gitlab.com/fake/repo"), false);
  assert.strictEqual(isValidGitHubRepoUrl("not_a_url"), false);
});

test("Evidence Authority Engine — builds canonical GitHub permalinks with line numbers", () => {
  const url = buildGitHubBlobUrl(
    "https://github.com/T-Bone47/RaceMind-AI",
    "850d3c9",
    "backend/strategy/pit_window.py",
    [14, 45]
  );
  assert.strictEqual(url, "https://github.com/T-Bone47/RaceMind-AI/blob/850d3c9/backend/strategy/pit_window.py#L14-L45");
});

test("Evidence Authority Engine — validates evidence nodes in the authoritative graph", () => {
  const node = ENGINEERING_EVIDENCE_GRAPH.find((n) => n.id === "ev-racemind-strategy");
  assert.ok(node, "Node ev-racemind-strategy must exist");

  const validation = validateEvidenceNode(node);
  assert.strictEqual(validation.status, "VERIFIED");
  assert.ok(validation.integrityScore >= 0.85, `Integrity score should be >= 0.85, got ${validation.integrityScore}`);
  assert.strictEqual(validation.passedChecksCount, validation.totalChecksCount);
  assert.ok(validation.githubPermalink.includes("https://github.com/T-Bone47/RaceMind-AI/blob/"));
  assert.ok(validation.disclosedLimitations.length > 0);
});

test("Evidence Authority Engine — generates an evidence manifest satisfying complete graph integrity", () => {
  const manifest = generateEvidenceManifest();
  assert.strictEqual(manifest.summary.totalNodes, ENGINEERING_EVIDENCE_GRAPH.length);
  assert.ok(manifest.summary.verifiedCount > 0);
  assert.ok(manifest.summary.averageIntegrityScore >= 0.7);
  assert.ok(manifest.summary.repositories.length >= 4);

  const integrity = assertEvidenceGraphIntegrity();
  assert.strictEqual(integrity.valid, true);
  assert.deepStrictEqual(integrity.errors, []);
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CANONICAL_REPOSITORIES, CANONICAL_INCIDENTS } from "../lib/livePulse/repositoryRegistry";
import { getLivePulseSnapshot } from "../lib/livePulse/githubSnapshot";

describe("Frontier Live Pulse Observatory", () => {
  it("registry tracks all 5 canonical engineering repositories", () => {
    assert.equal(CANONICAL_REPOSITORIES.length, 5);

    const expectedRepoNames = [
      "Minecraft-folio",
      "RaceMind-AI",
      "live-f1-intelligence",
      "Sentinel-AI",
      "vyaparpulse-ai",
    ];

    for (const name of expectedRepoNames) {
      const found = CANONICAL_REPOSITORIES.find((r) => r.name === name);
      assert.ok(found, `Repository ${name} must be registered`);
      assert.ok(found.url.startsWith("https://github.com/T-Bone47/"));
      assert.ok(found.lastCommit.sha.length >= 7);
      assert.ok(found.verifiedBenchmark.value.length > 0);
    }
  });

  it("snapshot provider returns live data without rate limits", () => {
    const snapshot = getLivePulseSnapshot();
    assert.equal(snapshot.totalRepositories, 5);
    assert.equal(snapshot.totalPassingTests, 116);
    assert.equal(snapshot.repositories.length, 5);
    assert.ok(snapshot.incidentLog.length >= 3);
  });

  it("incident post-mortem log documents root cause and exact fix", () => {
    for (const inc of CANONICAL_INCIDENTS) {
      assert.ok(inc.title.length > 5);
      assert.ok(inc.rootCause.length > 20, "Detailed root cause required");
      assert.ok(inc.exactFix.length > 20, "Actionable exact fix required");
      assert.ok(inc.verifiedInCi, "Incident must be verified in CI");
    }
  });
});


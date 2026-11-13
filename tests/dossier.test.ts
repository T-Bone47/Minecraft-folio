import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DOSSIER_PROFILES, getCandidateDossier } from "../lib/dossier/dossierData";
import { DossierTrackId } from "../lib/dossier/types";

describe("Hiring Committee Dossier Engine", () => {
  const canonicalTracks: DossierTrackId[] = ["motorsport", "systems", "aiml", "architect"];

  it("contains all 4 canonical hiring tracks", () => {
    for (const track of canonicalTracks) {
      assert.ok(DOSSIER_PROFILES[track], `Track ${track} must exist`);
      assert.equal(DOSSIER_PROFILES[track].id, track);
      assert.ok(DOSSIER_PROFILES[track].title.length > 0);
      assert.ok(DOSSIER_PROFILES[track].targetRoles.length >= 3);
    }
  });

  it("every track contains verified production metrics with verification levels", () => {
    for (const track of canonicalTracks) {
      const profile = DOSSIER_PROFILES[track];
      assert.equal(profile.keyMetrics.length, 4, `Track ${track} must declare 4 key metrics`);

      for (const metric of profile.keyMetrics) {
        assert.ok(metric.label.length > 0);
        assert.ok(metric.value.length > 0);
        assert.ok(metric.subtext.length > 0);
        assert.match(
          metric.verificationLevel,
          /^(PRODUCTION_VERIFIED|BENCHMARK_PROVED|CRYPTOGRAPHIC_AUDIT)$/
        );
      }
    }
  });

  it("featured projects declare verifiable Git commit SHAs and 6-layer evidence", () => {
    for (const track of canonicalTracks) {
      const profile = DOSSIER_PROFILES[track];
      assert.ok(profile.featuredProjects.length >= 2, `Track ${track} must have at least 2 featured projects`);

      for (const proj of profile.featuredProjects) {
        assert.ok(proj.name.length > 0);
        assert.match(proj.commitSha, /^[0-9a-f]{7,40}$/i, `Project ${proj.name} must declare valid commit SHA`);
        assert.ok(proj.repoUrl.startsWith("https://github.com/T-Bone47"), "Must reference canonical GitHub");
        assert.equal(proj.evidenceLayerCount, 6, "Must specify 6-layer evidence framework");
        assert.ok(proj.keyInvariants.length >= 2, "Must specify key invariants");
      }
    }
  });

  it("architectural invariants provide formal LaTeX derivations and existing test suites", () => {
    for (const track of canonicalTracks) {
      const profile = DOSSIER_PROFILES[track];
      assert.ok(profile.architecturalInvariants.length >= 2, `Track ${track} must have >= 2 formal invariants`);

      for (const inv of profile.architecturalInvariants) {
        assert.ok(inv.name.length > 0);
        assert.ok(inv.formulationLatex.length > 0);
        assert.ok(inv.explanation.length > 0);
        assert.ok(inv.testSuite.startsWith("tests/"), `Test suite ${inv.testSuite} must be in tests/`);
        assert.ok(inv.codeLocation.includes(":L"), `Code location must cite line numbers: ${inv.codeLocation}`);
      }
    }
  });

  it("candidate manifest resolves canonical author identity and defaults", () => {
    const defaultDossier = getCandidateDossier();
    assert.equal(defaultDossier.candidateName, "ASISH OLIVER M");
    assert.equal(defaultDossier.activeTrack, "motorsport");
    assert.equal(defaultDossier.githubProfile, "https://github.com/T-Bone47");
    assert.ok(defaultDossier.canonicalOrigin.includes("asish-engineering-world.vercel.app"));

    const systemsDossier = getCandidateDossier("systems");
    assert.equal(systemsDossier.activeTrack, "systems");
  });
});


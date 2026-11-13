import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { proofCastStories, motorsportBeats, backendBeats, aimlBeats } from "../lib/proofcast/storyRegistry";
import { compileProofCastStory, getAvailableProofCastRoles } from "../lib/proofcast/storyCompiler";
import { ProofCastPlaybackController } from "../lib/proofcast/playbackController";
import type { ProofCastRole } from "../lib/proofcast/types";

describe("Frontier ProofCast Engine", () => {
  it("authoritative story registry contains all 5 engineering roles", () => {
    const roles: ProofCastRole[] = ["motorsport", "backend", "aiml", "data", "software"];
    for (const role of roles) {
      assert.ok(proofCastStories[role], `Missing story for role: ${role}`);
      assert.equal(proofCastStories[role].beats.length, 6, `Role ${role} must have exactly 6 chapters`);
      assert.equal(proofCastStories[role].totalDurationSeconds, 60, "Recruiter mode duration must be 60s");
    }
  });

  it("all documentary beats contain verified GitHub provenance and code snippets", () => {
    const allBeats = [...motorsportBeats, ...backendBeats, ...aimlBeats];
    for (const beat of allBeats) {
      assert.ok(beat.evidenceProof.repoUrl.startsWith("https://github.com/T-Bone47/"), "Valid GitHub repo URL required");
      assert.ok(beat.evidenceProof.commitSha.length >= 7, "Valid commit SHA required");
      assert.ok(beat.evidenceProof.filePath.length > 0, "Valid file path required");
      assert.ok(beat.evidenceProof.codeSnippet.length > 20, "Substantial code snippet required");
      assert.ok(beat.keyMetric.verified, "Key metric must be verified");
    }
  });

  it("story compiler scales duration correctly for 60s and 3m modes", () => {
    const recruiterStory = compileProofCastStory("motorsport", "RECRUITER_60S");
    assert.equal(recruiterStory.totalDurationSeconds, 60);

    const showcaseStory = compileProofCastStory("motorsport", "SHOWCASE_3M");
    assert.equal(showcaseStory.totalDurationSeconds, 180);
    assert.equal(showcaseStory.beats[0].duration, 30);
  });

  it("playback controller advances state, seeks, and supports pause-to-inspect", () => {
    const story = compileProofCastStory("motorsport", "RECRUITER_60S");
    const controller = new ProofCastPlaybackController(story);

    const initial = controller.getState();
    assert.equal(initial.isPlaying, false);
    assert.equal(initial.currentTime, 0);
    assert.equal(initial.activeBeatIndex, 0);

    // Seek to chapter 3
    controller.seek(25);
    const stateAt25 = controller.getState();
    assert.equal(stateAt25.currentTime, 25);
    assert.equal(stateAt25.activeBeatIndex, 2);

    // Pause to inspect implementation
    controller.inspectBeat();
    const inspectingState = controller.getState();
    assert.equal(inspectingState.isInspecting, true);
    assert.ok(inspectingState.inspectedBeat !== null);
    assert.equal(inspectingState.isPlaying, false);

    controller.closeInspection();
    assert.equal(controller.getState().isInspecting, false);
    controller.dispose();
  });
});


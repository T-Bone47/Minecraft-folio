/**
 * FRONTIER PROOFCAST — STORY COMPILER
 * Dynamically compiles role-specific documentaries across presentation modes.
 */

import { proofCastStories } from "./storyRegistry";
import type { ProofCastRole, PresentationMode, ProofCastStory } from "./types";

export function compileProofCastStory(role: ProofCastRole, mode: PresentationMode = "RECRUITER_60S"): ProofCastStory {
  const baseStory = proofCastStories[role] || proofCastStories.motorsport;

  const durationMultiplier = mode === "DIRECTORS_CUT" ? 6.0 : mode === "SHOWCASE_3M" ? 3.0 : 1.0;
  const baseBeatDuration = 10 * durationMultiplier;

  let currentTimestamp = 0;
  const compiledBeats = baseStory.beats.map((beat, idx) => {
    const compiled = {
      ...beat,
      timestampStart: currentTimestamp,
      duration: baseBeatDuration,
    };
    currentTimestamp += baseBeatDuration;
    return compiled;
  });

  return {
    ...baseStory,
    mode,
    totalDurationSeconds: currentTimestamp,
    beats: compiledBeats,
  };
}

export function getAvailableProofCastRoles(): { role: ProofCastRole; label: string; description: string }[] {
  return [
    {
      role: "motorsport",
      label: "Motorsport Simulation",
      description: "60 Hz vehicle physics, RaceMind tyre degradation, and 3D spline telemetry.",
    },
    {
      role: "backend",
      label: "Distributed & Backend",
      description: "Provider fault isolation, canonical event models, and TimescaleDB hypertables.",
    },
    {
      role: "aiml",
      label: "Machine Learning / AI",
      description: "Kinematic feature extraction, 4th-order polynomial degradation, and MCTS race search.",
    },
    {
      role: "data",
      label: "Data Systems Architecture",
      description: "High-throughput stream processing, schema validation, and timeseries compression.",
    },
    {
      role: "software",
      label: "Full-Stack & Systems",
      description: "End-to-end architecture, 116 automated tests, and Impeccable design craftsmanship.",
    },
  ];
}


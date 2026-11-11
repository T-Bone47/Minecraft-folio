/**
 * DIGITAL TWIN COORDINATOR STORE & EVENT PIPELINE
 * ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin
 *
 * Coordinates:
 * - Authoritative recorded, reference, and hypothetical telemetry sessions
 * - Complete lap analysis (sectors, corners, distance deltas, insights)
 * - What-if scenario predictions
 * - Flagship Mission: "FROM LAP TO INTELLIGENCE"
 * - Recruiter Fast-Track Guided Walkthrough
 * - Real-time 3D World Reactivity & Conduit Light Pulses
 */

import { create } from "zustand";
import {
  type LapRecord,
  type DigitalTwinEvent,
  type DigitalTwinEventType,
  createLapRecord,
} from "@/lib/digitalTwin/telemetrySchema";
import {
  type CompleteLapAnalysis,
  performCompleteLapAnalysis,
} from "@/lib/digitalTwin/analysis";
import {
  type WhatIfPredictionResult,
  simulateWhatIfScenario,
  PRESET_SCENARIOS,
  type EngineeringScenarioConfig,
} from "@/lib/digitalTwin/decisionEngine";
import { generateReference } from "@/lib/frontier/drive";

export type MissionStep =
  | "DRIVE_OR_LOAD"
  | "INGEST_PIPELINE"
  | "ANALYSE_FEATURES"
  | "ENGINEERING_DECISION"
  | "CASE_STUDY_UNLOCKED";

export interface RecruiterWalkthroughState {
  active: boolean;
  step: number; // 0: Overview, 1: Telemetry, 2: Pipeline, 3: Analysis, 4: Decision, 5: Evidence
  totalSteps: number;
}

export interface DigitalTwinState {
  // Session & Telemetry Records
  recordedLap: LapRecord | null;
  referenceLap: LapRecord;
  hypotheticalLap: LapRecord | null;
  activeComparison: "reference" | "hypothetical";

  // Numerical Lap Analysis
  analysis: CompleteLapAnalysis | null;

  // What-If Decision System
  activeScenario: EngineeringScenarioConfig | null;
  whatIfResult: WhatIfPredictionResult | null;

  // Pipeline State & World Reactivity
  activePipelineStage: number; // 0 to 7
  isProcessingPipeline: boolean;
  conduitPulseTimestamp: number;
  lastEvent: DigitalTwinEvent | null;

  // Flagship Mission: "FROM LAP TO INTELLIGENCE"
  missionStep: MissionStep;
  missionCompleted: boolean;

  // Recruiter Walkthrough Mode
  recruiterWalkthrough: RecruiterWalkthroughState;

  // Actions
  ingestCompletedLap: (lap: LapRecord) => void;
  loadBundledReferenceLap: () => void;
  runAnalysis: () => void;
  applyWhatIfScenario: (config: EngineeringScenarioConfig) => void;
  clearWhatIfScenario: () => void;
  setPipelineStage: (stage: number) => void;
  dispatchDigitalTwinEvent: <T>(type: DigitalTwinEventType, payload: T) => void;
  advanceMissionStep: (targetStep: MissionStep) => void;
  resetMission: () => void;
  startRecruiterWalkthrough: () => void;
  nextRecruiterStep: () => void;
  prevRecruiterStep: () => void;
  exitRecruiterWalkthrough: () => void;
}

// Generate the canonical baseline reference lap once
const rawRef = generateReference();
const canonicalRef = createLapRecord(rawRef.state, rawRef.samples, "reference", "REF-2026-CANONICAL");

export const useDigitalTwinStore = create<DigitalTwinState>((set, get) => ({
  recordedLap: null,
  referenceLap: canonicalRef,
  hypotheticalLap: null,
  activeComparison: "reference",
  analysis: null,
  activeScenario: null,
  whatIfResult: null,

  activePipelineStage: 0,
  isProcessingPipeline: false,
  conduitPulseTimestamp: 0,
  lastEvent: null,

  missionStep: "DRIVE_OR_LOAD",
  missionCompleted: false,

  recruiterWalkthrough: {
    active: false,
    step: 0,
    totalSteps: 7,
  },

  ingestCompletedLap: (lap: LapRecord) => {
    const analysis = performCompleteLapAnalysis(lap, get().referenceLap);

    set({
      recordedLap: lap,
      analysis,
      activePipelineStage: 6, // Storage stage
      conduitPulseTimestamp: Date.now(),
      lastEvent: {
        type: "LAP_COMPLETED",
        timestamp: Date.now(),
        payload: { lapTime: lap.state.time, sessionId: lap.sessionId },
      },
    });

    // Advance mission if on step 1
    if (get().missionStep === "DRIVE_OR_LOAD") {
      get().advanceMissionStep("INGEST_PIPELINE");
    }
  },

  loadBundledReferenceLap: () => {
    const ref = get().referenceLap;
    const syntheticVisitor = createLapRecord(
      {
        ...ref.state,
        time: ref.state.time + 0.384, // slightly offset visitor lap for genuine delta
        collisions: 0,
        sectors: ref.state.sectors.map((s, i) => s + (i === 1 ? 0.22 : i === 2 ? 0.16 : 0.004)),
      },
      ref.samples.map((s, i) => ({
        ...s,
        speed: s.speed * (i > 40 && i < 70 ? 0.94 : 1.0),
        timestamp: s.timestamp * 1.005,
      })),
      "visitor",
      `SAMPLE-${Date.now().toString(36).toUpperCase()}`
    );

    get().ingestCompletedLap(syntheticVisitor);
  },

  runAnalysis: () => {
    const recorded = get().recordedLap ?? get().referenceLap;
    const analysis = performCompleteLapAnalysis(recorded, get().referenceLap);
    set({
      analysis,
      conduitPulseTimestamp: Date.now(),
      lastEvent: {
        type: "ANALYSIS_COMPLETED",
        timestamp: Date.now(),
        payload: { overallRating: analysis.overallRating },
      },
    });
  },

  applyWhatIfScenario: (config: EngineeringScenarioConfig) => {
    const base = get().recordedLap ?? get().referenceLap;
    const result = simulateWhatIfScenario(base, config);

    set({
      activeScenario: config,
      whatIfResult: result,
      hypotheticalLap: result.hypotheticalLap,
      activeComparison: "hypothetical",
      conduitPulseTimestamp: Date.now(),
      lastEvent: {
        type: "ENGINEERING_DECISION_RECORDED",
        timestamp: Date.now(),
        payload: { scenario: config.name, delta: result.deltaS },
      },
    });

    if (get().missionStep === "ENGINEERING_DECISION") {
      get().advanceMissionStep("CASE_STUDY_UNLOCKED");
    }
  },

  clearWhatIfScenario: () => {
    set({
      activeScenario: null,
      whatIfResult: null,
      hypotheticalLap: null,
      activeComparison: "reference",
    });
  },

  setPipelineStage: (stage: number) => {
    set({ activePipelineStage: stage, conduitPulseTimestamp: Date.now() });
  },

  dispatchDigitalTwinEvent: <T>(type: DigitalTwinEventType, payload: T) => {
    set({
      lastEvent: { type, timestamp: Date.now(), payload },
      conduitPulseTimestamp: Date.now(),
    });
  },

  advanceMissionStep: (targetStep: MissionStep) => {
    const isCompleted = targetStep === "CASE_STUDY_UNLOCKED";
    set({
      missionStep: targetStep,
      missionCompleted: isCompleted,
      conduitPulseTimestamp: Date.now(),
    });
  },

  resetMission: () => {
    set({
      missionStep: "DRIVE_OR_LOAD",
      missionCompleted: false,
    });
  },

  startRecruiterWalkthrough: () => {
    // Automatically load sample lap if none exists
    if (!get().recordedLap) {
      get().loadBundledReferenceLap();
    }
    set({
      recruiterWalkthrough: {
        active: true,
        step: 0,
        totalSteps: 7,
      },
    });
  },

  nextRecruiterStep: () => {
    const current = get().recruiterWalkthrough;
    if (current.step < current.totalSteps - 1) {
      set({
        recruiterWalkthrough: {
          ...current,
          step: current.step + 1,
        },
        conduitPulseTimestamp: Date.now(),
      });
    }
  },

  prevRecruiterStep: () => {
    const current = get().recruiterWalkthrough;
    if (current.step > 0) {
      set({
        recruiterWalkthrough: {
          ...current,
          step: current.step - 1,
        },
      });
    }
  },

  exitRecruiterWalkthrough: () => {
    set({
      recruiterWalkthrough: {
        active: false,
        step: 0,
        totalSteps: 6,
      },
    });
  },
}));


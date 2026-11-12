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
import { globalTraceRecorder } from "@/lib/xray/traceRecorder";
import { useXRayStore } from "@/state/xrayStore";

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
    // 1. Trace Vehicle Simulation
    globalTraceRecorder.startTrace("motorsport", "Simulator Lap Ingestion & Analysis");
    globalTraceRecorder.startSpan({
      spanId: "span_veh_sim",
      name: "Vehicle Physics Simulation",
      facilityId: "garage",
      subsystem: "motorsport",
      inputSummary: { lapTime: lap.state.time, collisions: lap.state.collisions },
      provenance: lap.source === "visitor" ? "SIMULATOR_TELEMETRY" : "DETERMINISTIC_REPLAY",
      sourceRef: {
        repo: "T-Bone47/Minecraft-folio",
        file: "components/vehicles/DriveableF1Car.tsx",
        symbol: "stepDrive",
        testFile: "tests/digital-twin.test.ts",
      },
    });
    globalTraceRecorder.endSpan({
      spanId: "span_veh_sim",
      outputSummary: { finalSpeedKmh: Math.round(Math.abs(lap.state.speed) * 3.6), gatesPassed: lap.state.nextGate - 1 },
    });

    // 2. Trace Sample Acquisition
    globalTraceRecorder.startSpan({
      spanId: "span_telem_acquire",
      parentSpanId: "span_veh_sim",
      name: "Telemetry Batch Acquisition",
      facilityId: "garage",
      subsystem: "telemetry_pipeline",
      inputSummary: { totalSamples: lap.samples.length, source: lap.source },
      sourceRef: {
        repo: "T-Bone47/Minecraft-folio",
        file: "lib/digitalTwin/telemetrySchema.ts",
        symbol: "createLapRecord",
        testFile: "tests/digital-twin.test.ts",
      },
    });
    globalTraceRecorder.endSpan({
      spanId: "span_telem_acquire",
      outputSummary: { byteEstimate: lap.samples.length * 32, sessionId: lap.sessionId },
    });

    // 3. Trace Schema Validation
    globalTraceRecorder.startSpan({
      spanId: "span_schema_val",
      parentSpanId: "span_telem_acquire",
      name: "Schema & Monotonicity Validation",
      facilityId: "telemetry",
      subsystem: "telemetry_pipeline",
      inputSummary: { schemaVersion: "1.0.0", checks: "bounds,monotonicity,vectors" },
      sourceRef: {
        repo: "T-Bone47/Minecraft-folio",
        file: "lib/digitalTwin/telemetrySchema.ts",
        symbol: "validateTelemetrySample",
        testFile: "tests/digital-twin.test.ts",
      },
    });
    const validCount = lap.samples.filter(s => s.valid).length;
    globalTraceRecorder.endSpan({
      spanId: "span_schema_val",
      outputSummary: { validSamples: validCount, rejectedSamples: lap.samples.length - validCount },
    });

    // 4. Trace Spatial Normalisation
    globalTraceRecorder.startSpan({
      spanId: "span_coord_norm",
      parentSpanId: "span_schema_val",
      name: "Spatial Track Normalisation",
      facilityId: "telemetry",
      subsystem: "telemetry_pipeline",
      inputSummary: { circuitRadiusM: 45, trackLengthM: 282.74 },
      sourceRef: {
        repo: "T-Bone47/Minecraft-folio",
        file: "lib/digitalTwin/analysis.ts",
        symbol: "interpolateSampleAtProgress",
        testFile: "tests/digital-twin.test.ts",
      },
    });
    globalTraceRecorder.endSpan({
      spanId: "span_coord_norm",
      outputSummary: { normalizedProgressRange: "0.0 -> 1.0" },
    });

    // 5. Trace Distance-Aligned Delta-T Solver
    globalTraceRecorder.startSpan({
      spanId: "span_spatial_align",
      parentSpanId: "span_coord_norm",
      name: "Distance-Aligned Delta-T Solver",
      facilityId: "simulation",
      subsystem: "simulation_solver",
      inputSummary: { visitorLapTime: lap.state.time, refLapTime: get().referenceLap.state.time },
      sourceRef: {
        repo: "T-Bone47/Minecraft-folio",
        file: "lib/digitalTwin/analysis.ts",
        symbol: "performCompleteLapAnalysis",
        testFile: "tests/digital-twin.test.ts",
      },
    });

    const analysis = performCompleteLapAnalysis(lap, get().referenceLap);

    globalTraceRecorder.endSpan({
      spanId: "span_spatial_align",
      outputSummary: {
        totalDeltaS: analysis.totalDeltaS,
        sectorDeltas: analysis.sectors.map(s => s.deltaS),
        overallRating: analysis.overallRating,
      },
    });

    // 6. Trace Corner Apex Analysis
    globalTraceRecorder.startSpan({
      spanId: "span_corner_diag",
      parentSpanId: "span_spatial_align",
      name: "Corner Apex Speed Analysis",
      facilityId: "aiml",
      subsystem: "aiml_evaluation",
      inputSummary: { cornersTotal: analysis.corners.length },
      sourceRef: {
        repo: "T-Bone47/Minecraft-folio",
        file: "lib/digitalTwin/analysis.ts",
        symbol: "analyzeCorners",
        testFile: "tests/digital-twin.test.ts",
      },
    });
    globalTraceRecorder.endSpan({
      spanId: "span_corner_diag",
      outputSummary: {
        corners: analysis.corners.map(c => `${c.name}: ${c.apexSpeedKmh}km/h`),
      },
    });

    // 7. Trace Strategic Coaching Generation
    globalTraceRecorder.startSpan({
      spanId: "span_insights_gen",
      parentSpanId: "span_corner_diag",
      name: "Engineering Strategy Generation",
      facilityId: "operations",
      subsystem: "systems_reliability",
      inputSummary: { actionableDeficits: analysis.insights.length },
      sourceRef: {
        repo: "T-Bone47/Minecraft-folio",
        file: "lib/digitalTwin/analysis.ts",
        symbol: "generateActionableInsights",
        testFile: "tests/digital-twin.test.ts",
      },
    });
    globalTraceRecorder.endSpan({
      spanId: "span_insights_gen",
      outputSummary: {
        insightsCount: analysis.insights.length,
        primaryRecommendation: analysis.insights[0]?.recommendation ?? "Maintain consistent trajectory",
      },
    });

    // Ingest trace into XRay Store
    const liveTrace = globalTraceRecorder.getTraceRecord(
      lap.source === "visitor" ? "Live Simulator Driving Trace" : "Deterministic Reference Lap Trace"
    );
    useXRayStore.getState().ingestLiveTrace(liveTrace);

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


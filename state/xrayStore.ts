/**
 * FRONTIER X-RAY: THE ENGINEERING REALITY ENGINE
 * Central Zustand Observability State Store
 */

import { create } from "zustand";
import {
  TraceRecord,
  ExecutionGraph,
  ExecutionGraphNode,
  XRaySubsystem,
  DetailLevel,
} from "@/lib/xray/types";
import { createBundledMotorsportTrace, globalTraceRecorder } from "@/lib/xray/traceRecorder";
import { buildExecutionGraph } from "@/lib/xray/traceGraph";
import { HISTORICAL_INCIDENTS } from "@/lib/xray/historyRegistry";
import { PUSH_TO_PROVE_EXPERIMENTS } from "@/lib/xray/experimentRegistry";

export type XRayModalTab = "overview" | "graph" | "timeline" | "timemachine" | "lab";
export type XRayTab = XRayModalTab;
export type SubsystemFilter = XRaySubsystem | "all";
export type { DetailLevel } from "@/lib/xray/types";

interface XRayStoreState {
  isXRayActive: boolean;
  isModalOpen: boolean;
  activeTab: XRayModalTab;
  activeSubsystem: XRaySubsystem;
  detailLevel: DetailLevel;
  currentTrace: TraceRecord;
  executionGraph: ExecutionGraph;
  selectedNodeId: string | null;
  selectedFacilityId: string | null;

  // Timeline & Replay
  timelineIndex: number;
  playbackState: "playing" | "paused" | "stopped";
  playbackSpeed: number;

  // Time Machine
  timeMachineSelectedId: string;
  timeMachineMode: "before" | "after";

  // Push-to-Prove Lab
  labExperimentId: string;
  labParams: Record<string, any>;
  labOutput: any | null;
  labValidation: { passed: boolean; message: string; metrics: Record<string, number | string> } | null;

  // Aliases and convenience accessors
  activeTrace: TraceRecord;
  selectedSubsystem: XRaySubsystem;
  isPlaying: boolean;
  activeTimestampMs: number;
  setModalOpen: (open: boolean) => void;
  playTimeline: () => void;
  pauseTimeline: () => void;
  stepTimeline: (delta: number) => void;

  // Actions
  toggleXRay: () => void;
  setXRayActive: (active: boolean) => void;
  openModal: (tab?: XRayModalTab) => void;
  closeModal: () => void;
  setActiveTab: (tab: XRayModalTab) => void;
  setSubsystem: (subsystem: XRaySubsystem) => void;
  setDetailLevel: (level: DetailLevel) => void;
  selectNode: (nodeId: string | null) => void;
  selectFacility: (facilityId: string | null) => void;

  // Replay actions
  setTimelineIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  restart: () => void;
  setPlaybackSpeed: (speed: number) => void;

  // Ingestion
  loadBundledTrace: () => void;
  ingestLiveTrace: (trace: TraceRecord) => void;

  // Time machine actions
  setTimeMachineSelectedId: (id: string) => void;
  setTimeMachineMode: (mode: "before" | "after") => void;

  // Lab actions
  setLabExperimentId: (id: string) => void;
  setLabParams: (params: Record<string, any>) => void;
  runLabExperiment: () => void;
}

const initialTrace = createBundledMotorsportTrace();
const initialGraph = buildExecutionGraph(initialTrace);
const initialExp = PUSH_TO_PROVE_EXPERIMENTS[0];

export const useXRayStore = create<XRayStoreState>((set, get) => ({
  isXRayActive: false,
  isModalOpen: false,
  activeTab: "overview",
  activeSubsystem: "motorsport",
  detailLevel: "BASIC",
  currentTrace: initialTrace,
  activeTrace: initialTrace,
  selectedSubsystem: "motorsport",
  isPlaying: false,
  activeTimestampMs: 0,
  executionGraph: initialGraph,
  selectedNodeId: initialGraph.nodes[0]?.id ?? null,
  selectedFacilityId: "garage",

  timelineIndex: 0,
  playbackState: "stopped",
  playbackSpeed: 1.0,

  timeMachineSelectedId: HISTORICAL_INCIDENTS[0].id,
  timeMachineMode: "after",

  labExperimentId: initialExp.id,
  labParams: { ...initialExp.defaultParams },
  labOutput: null,
  labValidation: null,

  setModalOpen: (open: boolean) => {
    if (open) get().openModal();
    else get().closeModal();
  },

  playTimeline: () => {
    set({ playbackState: "playing", isPlaying: true });
    get().play();
  },

  pauseTimeline: () => {
    set({ playbackState: "paused", isPlaying: false });
    get().pause();
  },

  stepTimeline: (delta: number) => {
    const curIdx = get().timelineIndex;
    const nextIdx = Math.max(0, curIdx + delta);
    get().setTimelineIndex(nextIdx);
    set({ activeTimestampMs: nextIdx });
  },

  toggleXRay: () => {
    const next = !get().isXRayActive;
    set({ isXRayActive: next });
    if (next && !get().currentTrace) {
      get().loadBundledTrace();
    }
  },

  setXRayActive: (active: boolean) => {
    set({ isXRayActive: active });
    if (active && !get().currentTrace) {
      get().loadBundledTrace();
    }
  },

  openModal: (tab?: XRayModalTab) => {
    set({
      isModalOpen: true,
      activeTab: tab ?? get().activeTab,
      isXRayActive: true, // opening modal enables technical overlay
    });
    // Ensure experiment is run on initial open if null
    if (!get().labOutput) {
      get().runLabExperiment();
    }
  },

  closeModal: () => {
    set({ isModalOpen: false });
  },

  setActiveTab: (tab: XRayModalTab) => {
    set({ activeTab: tab });
  },

  setSubsystem: (subsystem: XRaySubsystem) => {
    set({ activeSubsystem: subsystem, selectedSubsystem: subsystem });
    globalTraceRecorder.setSubsystem(subsystem);
  },

  setDetailLevel: (level: DetailLevel) => {
    set({ detailLevel: level });
    globalTraceRecorder.setDetailLevel(level);
  },

  selectNode: (nodeId: string | null) => {
    const node = get().executionGraph.nodes.find((n: ExecutionGraphNode) => n.id === nodeId);
    set({
      selectedNodeId: nodeId,
      selectedFacilityId: node?.facilityId ?? get().selectedFacilityId,
    });
  },

  selectFacility: (facilityId: string | null) => {
    const node = get().executionGraph.nodes.find((n: ExecutionGraphNode) => n.facilityId === facilityId);
    set({
      selectedFacilityId: facilityId,
      selectedNodeId: node ? node.id : get().selectedNodeId,
    });
  },

  setTimelineIndex: (index: number) => {
    const trace = get().currentTrace;
    const clamped = Math.max(0, Math.min(index, trace.spans.length - 1));
    const targetSpan = trace.spans[clamped];
    set({
      timelineIndex: clamped,
      selectedNodeId: targetSpan ? targetSpan.spanId : get().selectedNodeId,
      selectedFacilityId: targetSpan ? targetSpan.facilityId : get().selectedFacilityId,
    });
  },

  play: () => set({ playbackState: "playing" }),
  pause: () => set({ playbackState: "paused" }),

  stepForward: () => {
    const idx = get().timelineIndex;
    get().setTimelineIndex(idx + 1);
  },

  stepBackward: () => {
    const idx = get().timelineIndex;
    get().setTimelineIndex(idx - 1);
  },

  restart: () => {
    get().setTimelineIndex(0);
    set({ playbackState: "playing" });
  },

  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),

  loadBundledTrace: () => {
    const trace = createBundledMotorsportTrace();
    const graph = buildExecutionGraph(trace);
    set({
      currentTrace: trace,
      activeTrace: trace,
      executionGraph: graph,
      timelineIndex: 0,
      selectedNodeId: graph.nodes[0]?.id ?? null,
      selectedFacilityId: "garage",
    });
  },

  ingestLiveTrace: (trace: TraceRecord) => {
    const graph = buildExecutionGraph(trace);
    set({
      currentTrace: trace,
      activeTrace: trace,
      executionGraph: graph,
      timelineIndex: Math.max(0, trace.spans.length - 1),
      selectedNodeId: graph.nodes[graph.nodes.length - 1]?.id ?? null,
    });
  },

  setTimeMachineSelectedId: (id: string) => {
    set({ timeMachineSelectedId: id });
  },

  setTimeMachineMode: (mode: "before" | "after") => {
    set({ timeMachineMode: mode });
  },

  setLabExperimentId: (id: string) => {
    const exp = PUSH_TO_PROVE_EXPERIMENTS.find(e => e.id === id) || PUSH_TO_PROVE_EXPERIMENTS[0];
    set({
      labExperimentId: id,
      labParams: { ...exp.defaultParams },
    });
    // Immediately compute output
    const output = (exp.run as any)(exp.sampleInput, exp.defaultParams);
    const validation = (exp.validate as any)(output);
    set({ labOutput: output, labValidation: validation });
  },

  setLabParams: (params: Record<string, any>) => {
    set({ labParams: { ...get().labParams, ...params } });
  },

  runLabExperiment: () => {
    const expId = get().labExperimentId;
    const exp = PUSH_TO_PROVE_EXPERIMENTS.find(e => e.id === expId) || PUSH_TO_PROVE_EXPERIMENTS[0];
    const output = (exp.run as any)(exp.sampleInput, get().labParams);
    const validation = (exp.validate as any)(output);
    set({ labOutput: output, labValidation: validation });
  },
}));

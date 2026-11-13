/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Engineering Defense Arena Zustand Store
 */

import { create } from "zustand";
import type {
  DefenseComparison,
  DefenseExecutionResult,
  DefenseTrackId,
} from "@/lib/defense/types";
import {
  DEFENSE_TRACKS,
  getDefaultParameters,
  executeDefenseTrack,
} from "@/lib/defense/scenarioRegistry";
import { runCounterfactualComparison } from "@/lib/defense/counterfactualEngine";

export type DefenseArenaTab =
  | "briefing"
  | "lab"
  | "results"
  | "counterfactual"
  | "review"
  | "trace";

interface DefenseStoreState {
  isOpen: boolean;
  activeTrackId: DefenseTrackId;
  activeTab: DefenseArenaTab;
  selectedHypothesisId: string | null;
  parameters: Record<string, any>;
  baselineResult: DefenseExecutionResult | null;
  counterfactualResult: DefenseExecutionResult | null;
  comparison: DefenseComparison | null;
  isExecuting: boolean;

  // Actions
  openArena: (trackId?: DefenseTrackId, tab?: DefenseArenaTab) => void;
  closeArena: () => void;
  selectTrack: (trackId: DefenseTrackId) => void;
  setActiveTab: (tab: DefenseArenaTab) => void;
  selectHypothesis: (hypothesisId: string) => void;
  updateParameter: (key: string, value: any) => void;
  resetParameters: () => void;
  runSimulation: () => void;
  runCounterfactualTest: (counterfactualParams: Record<string, any>) => void;
  clearResults: () => void;
}

export const useDefenseStore = create<DefenseStoreState>((set, get) => ({
  isOpen: false,
  activeTrackId: "systems-reliability",
  activeTab: "briefing",
  selectedHypothesisId: null,
  parameters: getDefaultParameters("systems-reliability"),
  baselineResult: null,
  counterfactualResult: null,
  comparison: null,
  isExecuting: false,

  openArena: (trackId = "systems-reliability", tab = "briefing") => {
    const defaults = getDefaultParameters(trackId);
    set({
      isOpen: true,
      activeTrackId: trackId,
      activeTab: tab,
      parameters: defaults,
      selectedHypothesisId: null,
      baselineResult: null,
      counterfactualResult: null,
      comparison: null,
    });
  },

  closeArena: () => {
    set({ isOpen: false });
  },

  selectTrack: (trackId: DefenseTrackId) => {
    const defaults = getDefaultParameters(trackId);
    set({
      activeTrackId: trackId,
      parameters: defaults,
      selectedHypothesisId: null,
      baselineResult: null,
      counterfactualResult: null,
      comparison: null,
      activeTab: "briefing",
    });
  },

  setActiveTab: (tab: DefenseArenaTab) => {
    set({ activeTab: tab });
  },

  selectHypothesis: (hypothesisId: string) => {
    set({ selectedHypothesisId: hypothesisId });
  },

  updateParameter: (key: string, value: any) => {
    set((state) => ({
      parameters: {
        ...state.parameters,
        [key]: value,
      },
    }));
  },

  resetParameters: () => {
    const { activeTrackId } = get();
    set({
      parameters: getDefaultParameters(activeTrackId),
    });
  },

  runSimulation: () => {
    const { activeTrackId, parameters, selectedHypothesisId } = get();
    set({ isExecuting: true });

    try {
      const result = executeDefenseTrack(
        activeTrackId,
        parameters,
        selectedHypothesisId || undefined
      );

      set({
        baselineResult: result,
        activeTab: "results",
        isExecuting: false,
      });
    } catch (err) {
      console.error("Simulation execution failed:", err);
      set({ isExecuting: false });
    }
  },

  runCounterfactualTest: (counterfactualParams: Record<string, any>) => {
    const { activeTrackId, parameters, selectedHypothesisId } = get();
    set({ isExecuting: true });

    try {
      const comp = runCounterfactualComparison(
        activeTrackId,
        parameters,
        counterfactualParams,
        selectedHypothesisId || undefined
      );

      set({
        baselineResult: comp.baseline,
        counterfactualResult: comp.counterfactual,
        comparison: comp,
        activeTab: "counterfactual",
        isExecuting: false,
      });
    } catch (err) {
      console.error("Counterfactual execution failed:", err);
      set({ isExecuting: false });
    }
  },

  clearResults: () => {
    set({
      baselineResult: null,
      counterfactualResult: null,
      comparison: null,
      activeTab: "briefing",
    });
  },
}));


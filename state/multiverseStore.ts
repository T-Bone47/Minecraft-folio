/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER MULTIVERSE
 * Multiverse State Store (Zustand)
 *
 * Controls 3D Launch Bay navigation, portal modal states, interactive demos,
 * recruiter pathways, and 6-layer engineering evidence inspection.
 */

import { create } from "zustand";
import {
  multiverseProjects,
  getMultiverseProjectById,
} from "@/lib/multiverse/projectRegistry";
import {
  INITIAL_RACEMIND_DEMO_STATE,
  evaluateRaceMindStrategy,
  INITIAL_LIVE_F1_DEMO_STATE,
  stepLiveF1Replay,
  INITIAL_SENTINEL_DEMO_STATE,
  executeSentinelRemediation,
  INITIAL_VYAPARPULSE_DEMO_STATE,
  parseNaturalLanguageTransaction,
  commitVyaparTransaction,
  reconcileOfflineQueue,
} from "@/lib/multiverse/demoRegistry";
import type {
  MultiverseProjectId,
  RecruiterRolePathway,
  RaceMindDemoState,
  LiveF1DemoState,
  SentinelDemoState,
  VyaparPulseDemoState,
} from "@/lib/multiverse/projectTypes";

export type MultiverseViewMode = "demo" | "engineering" | "recruiter";

interface MultiverseStoreState {
  // Launch Bay & Portal Modal State
  isLaunchBayActive: boolean;
  activePortalId: MultiverseProjectId | null;
  activeViewMode: MultiverseViewMode;
  recruiterPathway: RecruiterRolePathway;
  activeLayerIndex: number; // 0..5 for 6 evidence layers
  isFastTrackActive: boolean;

  // Individual Project Demonstration States
  raceMindState: RaceMindDemoState;
  liveF1State: LiveF1DemoState;
  sentinelState: SentinelDemoState;
  vyaparPulseState: VyaparPulseDemoState;

  // Portal Management Actions
  setLaunchBayActive: (active: boolean) => void;
  openPortal: (portalId: MultiverseProjectId, viewMode?: MultiverseViewMode) => void;
  closePortal: () => void;
  setViewMode: (mode: MultiverseViewMode) => void;
  setRecruiterPathway: (pathway: RecruiterRolePathway) => void;
  setActiveLayerIndex: (index: number) => void;
  toggleFastTrack: () => void;

  // RaceMind Actions
  updateRaceMindCandidate: (candidate: RaceMindDemoState["candidateStrategy"]) => void;
  updateRaceMindSafetyCar: (sc: RaceMindDemoState["safetyCarStatus"]) => void;
  updateRaceMindTyreAge: (age: number) => void;
  evaluateRaceMind: () => void;

  // Live F1 Actions
  toggleLiveF1Playback: () => void;
  setLiveF1Speed: (speed: number) => void;
  setSelectedF1Driver: (driverCode: string) => void;
  stepLiveF1: (deltaSec: number) => void;

  // Sentinel Actions
  selectSentinelIncident: (incidentId: string) => void;
  remediateSentinelIncident: (incidentId: string) => void;

  // VyaparPulse Actions
  toggleVyaparNetwork: () => void;
  updateVyaparInput: (text: string) => void;
  commitVyaparEntry: () => void;
  reconcileVyaparQueue: () => void;
}

export const useMultiverseStore = create<MultiverseStoreState>((set, get) => ({
  // Defaults
  isLaunchBayActive: false,
  activePortalId: null,
  activeViewMode: "demo",
  recruiterPathway: "software-engineering",
  activeLayerIndex: 0,
  isFastTrackActive: false,

  // Initial demo states
  raceMindState: INITIAL_RACEMIND_DEMO_STATE,
  liveF1State: INITIAL_LIVE_F1_DEMO_STATE,
  sentinelState: INITIAL_SENTINEL_DEMO_STATE,
  vyaparPulseState: INITIAL_VYAPARPULSE_DEMO_STATE,

  // Action implementations
  setLaunchBayActive: (active) => set({ isLaunchBayActive: active }),

  openPortal: (portalId, viewMode = "demo") => {
    set({
      activePortalId: portalId,
      activeViewMode: viewMode,
      activeLayerIndex: 0,
    });
  },

  closePortal: () => set({ activePortalId: null }),

  setViewMode: (viewMode) => set({ activeViewMode: viewMode }),

  setRecruiterPathway: (recruiterPathway) => set({ recruiterPathway }),

  setActiveLayerIndex: (activeLayerIndex) => set({ activeLayerIndex: Math.max(0, Math.min(5, activeLayerIndex)) }),

  toggleFastTrack: () => set((state) => ({ isFastTrackActive: !state.isFastTrackActive })),

  // RaceMind
  updateRaceMindCandidate: (candidateStrategy) => {
    set((state) => {
      const next = { ...state.raceMindState, candidateStrategy, isEvaluating: true };
      return { raceMindState: evaluateRaceMindStrategy(next) };
    });
  },

  updateRaceMindSafetyCar: (safetyCarStatus) => {
    set((state) => {
      const next = { ...state.raceMindState, safetyCarStatus, isEvaluating: true };
      return { raceMindState: evaluateRaceMindStrategy(next) };
    });
  },

  updateRaceMindTyreAge: (currentTyreAge) => {
    set((state) => {
      const next = { ...state.raceMindState, currentTyreAge, isEvaluating: true };
      return { raceMindState: evaluateRaceMindStrategy(next) };
    });
  },

  evaluateRaceMind: () => {
    set((state) => ({ raceMindState: evaluateRaceMindStrategy(state.raceMindState) }));
  },

  // Live F1
  toggleLiveF1Playback: () => {
    set((state) => ({
      liveF1State: {
        ...state.liveF1State,
        isPlaying: !state.liveF1State.isPlaying,
      },
    }));
  },

  setLiveF1Speed: (speed) => {
    set((state) => ({
      liveF1State: {
        ...state.liveF1State,
        playbackSpeed: speed,
      },
    }));
  },

  setSelectedF1Driver: (driverCode) => {
    set((state) => ({
      liveF1State: {
        ...state.liveF1State,
        selectedDriver: driverCode,
      },
    }));
  },

  stepLiveF1: (deltaSec) => {
    set((state) => ({
      liveF1State: stepLiveF1Replay(state.liveF1State, deltaSec),
    }));
  },

  // Sentinel
  selectSentinelIncident: (selectedIncidentId) => {
    set((state) => ({
      sentinelState: {
        ...state.sentinelState,
        selectedIncidentId,
      },
    }));
  },

  remediateSentinelIncident: (incidentId) => {
    set((state) => ({
      sentinelState: executeSentinelRemediation(state.sentinelState, incidentId),
    }));
  },

  // VyaparPulse
  toggleVyaparNetwork: () => {
    set((state) => {
      const isOnline = !state.vyaparPulseState.isNetworkOnline;
      if (isOnline && state.vyaparPulseState.offlineQueueCount > 0) {
        return { vyaparPulseState: reconcileOfflineQueue(state.vyaparPulseState) };
      }
      return {
        vyaparPulseState: {
          ...state.vyaparPulseState,
          isNetworkOnline: isOnline,
        },
      };
    });
  },

  updateVyaparInput: (text) => {
    const preview = parseNaturalLanguageTransaction(text);
    set((state) => ({
      vyaparPulseState: {
        ...state.vyaparPulseState,
        naturalLanguageInput: text,
        parsedPreview: preview,
      },
    }));
  },

  commitVyaparEntry: () => {
    set((state) => {
      const preview = state.vyaparPulseState.parsedPreview;
      if (!preview) return state;
      return {
        vyaparPulseState: commitVyaparTransaction(state.vyaparPulseState, preview),
      };
    });
  },

  reconcileVyaparQueue: () => {
    set((state) => ({
      vyaparPulseState: reconcileOfflineQueue(state.vyaparPulseState),
    }));
  },
}));

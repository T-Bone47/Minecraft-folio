/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER DIRECTOR 2.0
 * Frontier Director Store (Zustand)
 *
 * Exposes reactive state for UI overlays, camera rigs, and HUD controls,
 * backed by the authoritative Unified Navigation Controller.
 */

import { create } from "zustand";
import {
  navigationController,
} from "@/lib/frontierDirector/navigationController";
import { useWorldStore } from "@/state/worldStore";
import type {
  DirectorMode,
  ExperienceId,
  EvidenceLayerId,
  NavigationState,
} from "@/lib/frontierDirector/types";

// Bridge navigationController actions with the underlying WorldStore
if (typeof window !== "undefined" || process.env.NODE_ENV === "test") {
  navigationController.registerWorldSync((action, payload) => {
    const world = useWorldStore.getState();
    switch (action) {
      case "SET_WORLD_MODE":
        world.setMode(payload as any);
        break;
      case "STOP_DRONE_TOUR":
        world.stopDroneTour();
        break;
      case "TELEPORT_PLAYER":
        world.setPlayerPosition(payload as [number, number, number]);
        break;
    }
  });
}

interface FrontierDirectorStoreState extends NavigationState {
  startShowcase: (experienceId: ExperienceId, recruiterMode?: boolean) => void;
  stepShowcase: (stepIndex: number) => void;
  skipShowcase: (layer?: EvidenceLayerId) => void;
  openEvidence: (experienceId?: ExperienceId, layer?: EvidenceLayerId) => void;
  switchEvidenceLayer: (layer: EvidenceLayerId) => void;
  closeEvidence: () => void;
  enterExploration: () => void;
  openExperienceModal: () => void;
  closeExperienceModal: () => void;
  fastTravelToFacility: (facilityId: string) => void;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: 1 | 1.5 | 2) => void;
}

export const useFrontierDirectorStore = create<FrontierDirectorStoreState>((set, get) => {
  // Sync state initially from navigationController
  const initial = navigationController.getState();

  // Listen to navigationController updates
  navigationController.subscribe((updated) => {
    set({ ...updated });
  });

  return {
    ...initial,

    startShowcase: (experienceId: ExperienceId, recruiterMode = false) => {
      navigationController.executeTransition({
        action: "START_SHOWCASE",
        experienceId,
        stepIndex: 0,
        recruiterMode,
      });
    },

    stepShowcase: (stepIndex: number) => {
      navigationController.executeTransition({
        action: "STEP_SHOWCASE",
        stepIndex,
      });
    },

    skipShowcase: (layer = "problem") => {
      navigationController.executeTransition({
        action: "SKIP_SHOWCASE",
        evidenceLayer: layer,
      });
    },

    openEvidence: (experienceId?: ExperienceId, layer = "problem") => {
      navigationController.executeTransition({
        action: "OPEN_EVIDENCE",
        experienceId,
        evidenceLayer: layer,
      });
    },

    switchEvidenceLayer: (layer: EvidenceLayerId) => {
      navigationController.executeTransition({
        action: "SWITCH_EVIDENCE_LAYER",
        evidenceLayer: layer,
      });
    },

    closeEvidence: () => {
      navigationController.executeTransition({
        action: "CLOSE_EVIDENCE",
      });
    },

    enterExploration: () => {
      navigationController.executeTransition({
        action: "ENTER_EXPLORATION",
      });
    },

    openExperienceModal: () => {
      navigationController.setExperienceModalOpen(true);
    },

    closeExperienceModal: () => {
      navigationController.setExperienceModalOpen(false);
    },

    fastTravelToFacility: (facilityId: string) => {
      navigationController.executeTransition({
        action: "FAST_TRAVEL",
        facilityId,
      });
    },

    togglePlayback: () => {
      const current = get().isPlaying;
      navigationController.setPlaybackState(!current);
    },

    setPlaybackSpeed: (speed: 1 | 1.5 | 2) => {
      navigationController.setPlaybackState(get().isPlaying, speed);
    },
  };
});

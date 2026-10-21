import { create } from "zustand";
import type { WorldMode, DeviceTier, InteractionTarget } from "@/types/world";
import { getFacilityById } from "@/data/facilities";

interface WorldState {
  mode: WorldMode;
  deviceTier: DeviceTier;
  activeLocation: string | null;
  activeProject: string | null;
  nearbyTarget: InteractionTarget | null;
  reducedMotion: boolean;
  audioEnabled: boolean;
  bootProgress: number;
  bootComplete: boolean;
  /**
   * Live player position, refreshed a few times a second by the controller.
   *
   * Per-frame values must stay in refs (see ADR in the architecture spec), so
   * this is deliberately low-frequency: it exists for the HUD readout and the
   * map, never for driving the simulation.
   */
  playerPosition: [number, number, number];

  setMode: (mode: WorldMode) => void;
  setDeviceTier: (tier: DeviceTier) => void;
  focusLocation: (id: string) => void;
  inspectProject: (slug: string) => void;
  closeInspection: () => void;
  setNearbyTarget: (target: InteractionTarget | null) => void;
  setBootProgress: (progress: number) => void;
  finishBoot: () => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleAudio: () => void;
  setPlayerPosition: (position: [number, number, number]) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  mode: "boot",
  deviceTier: "high",
  activeLocation: "garage",
  activeProject: null,
  nearbyTarget: null,
  reducedMotion: false,
  audioEnabled: false,
  bootProgress: 0,
  bootComplete: false,
  playerPosition: [-12, 2.15, 4],

  setMode: (mode) => set({ mode }),
  setDeviceTier: (deviceTier) => set({ deviceTier }),

  focusLocation: (id) => {
    const facility = getFacilityById(id);
    set({
      activeLocation: id,
      mode: "explore",
      activeProject: facility?.projectSlug || null,
    });
  },

  inspectProject: (slug) => {
    set({
      activeProject: slug,
      mode: "inspect",
    });
  },

  closeInspection: () => {
    set({
      activeProject: null,
      mode: "explore",
    });
  },

  setNearbyTarget: (nearbyTarget) => set({ nearbyTarget }),
  setBootProgress: (bootProgress) => set({ bootProgress }),
  finishBoot: () => set({ bootComplete: true, mode: "explore" }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
}));

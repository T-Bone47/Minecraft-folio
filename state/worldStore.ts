import { useMissionStore } from "./missionStore";
import { create } from "zustand";
import type { WorldMode, DeviceTier, InteractionTarget, PerspectiveMode } from "@/types/world";
import { getFacilityById } from "@/data/facilities";

interface WorldState {
  mode: WorldMode;
  deviceTier: DeviceTier;
  perspective: PerspectiveMode;
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
  isDriving: boolean;
  activeHotbarSlot: number;
  isDroneTourActive: boolean;
  f1Telemetry: {
    speedKmh: number;
    rpm: number;
    gear: number;
    throttle: number;
    brake: number;
  };

  setMode: (mode: WorldMode) => void;
  setDeviceTier: (tier: DeviceTier) => void;
  setPerspective: (perspective: PerspectiveMode) => void;
  togglePerspective: () => void;
  focusLocation: (id: string) => void;
  inspectProject: (slug: string) => void;
  closeInspection: () => void;
  setNearbyTarget: (target: InteractionTarget | null) => void;
  setBootProgress: (progress: number) => void;
  finishBoot: () => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleAudio: () => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  startDriving: () => void;
  stopDriving: () => void;
  setF1Telemetry: (telemetry: { speedKmh: number; rpm: number; gear: number; throttle: number; brake: number }) => void;
  setActiveHotbarSlot: (slot: number) => void;
  startDroneTour: () => void;
  stopDroneTour: () => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  mode: "boot",
  deviceTier: "high",
  perspective: "first-person",
  activeLocation: "garage",
  activeProject: null,
  nearbyTarget: null,
  reducedMotion: false,
  audioEnabled: false,
  bootProgress: 0,
  bootComplete: false,
  playerPosition: [-12, 2.15, 4],
  isDriving: false,
  activeHotbarSlot: 0,
  isDroneTourActive: false,
  f1Telemetry: {
    speedKmh: 0,
    rpm: 4000,
    gear: 1,
    throttle: 0,
    brake: 0,
  },

  setMode: (mode) => set({ mode }),
  setDeviceTier: (deviceTier) => set({ deviceTier }),
  setPerspective: (perspective) => set({ perspective }),
  togglePerspective: () =>
    set((state) => ({
      perspective:
        state.perspective === "first-person" ? "third-person" : "first-person",
    })),

  focusLocation: (id) => {
    set({
      activeLocation: id,
      mode: "explore",
      activeProject: null,
      isDriving: false,
      isDroneTourActive: false,
    });
  },

  inspectProject: (slug) => {
    set({
      activeProject: slug,
      mode: "inspect",
      isDriving: false,
    });
  },

  closeInspection: () => {
    set({
      activeProject: null,
      mode: "explore",
      activeLocation: null,
    });
  },

  setNearbyTarget: (nearbyTarget) => set({ nearbyTarget }),
  setBootProgress: (bootProgress) => set({ bootProgress }),
  finishBoot: () => set({ bootComplete: true, mode: "explore" }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  startDriving: () => {
    const send=useMissionStore.getState().send;
    send("drive",{type:"reset"});send("drive",{type:"start"});send("drive",{type:"objective",name:"inspect"});
    set({ isDriving: true, isDroneTourActive: false, mode: "explore", perspective: "third-person" });
  },
  stopDriving: () => set({ isDriving: false }),
  setF1Telemetry: (f1Telemetry) => set({ f1Telemetry }),
  setActiveHotbarSlot: (activeHotbarSlot) => set({ activeHotbarSlot }),
  startDroneTour: () => set({ isDroneTourActive: true, isDriving: false, mode: "cinematic" }),
  stopDroneTour: () => set({ isDroneTourActive: false, mode: "explore" }),
}));

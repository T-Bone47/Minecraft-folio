import { create } from "zustand";

export interface InteractiveObject {
  id: string;
  type: "facility" | "terminal" | "station" | "vehicle" | "wall";
  label: string;
  sublabel: string;
  actionPrompt: string; // e.g. "[E] INSPECT TELEMETRY TOWER"
  position: [number, number, number]; // 3D world coordinates
  boundsRadius: number; // Max interaction reach
  projectSlug?: string;
  facilityId?: string;
  onInteract: () => void;
}

interface InteractionRegistryState {
  interactiveObjects: InteractiveObject[];
  activeTarget: InteractiveObject | null;
  activeStationModal: string | null; // e.g. "ai_engineer", "simulation_runner", "strategy_board"

  registerObject: (obj: InteractiveObject) => void;
  unregisterObject: (id: string) => void;
  setActiveTarget: (target: InteractiveObject | null) => void;
  openStationModal: (stationId: string | null) => void;
}

export const useInteractionRegistry = create<InteractionRegistryState>((set) => ({
  interactiveObjects: [],
  activeTarget: null,
  activeStationModal: null,

  registerObject: (obj) =>
    set((state) => ({
      interactiveObjects: [
        ...state.interactiveObjects.filter((o) => o.id !== obj.id),
        obj,
      ],
    })),

  unregisterObject: (id) =>
    set((state) => ({
      interactiveObjects: state.interactiveObjects.filter((o) => o.id !== id),
      activeTarget: state.activeTarget?.id === id ? null : state.activeTarget,
    })),

  setActiveTarget: (activeTarget) => set({ activeTarget }),
  openStationModal: (activeStationModal) => set({ activeStationModal }),
}));

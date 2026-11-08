import { create } from "zustand";
import type { DeviceTier } from "@/types/world";

export type TimeOfDay = "day" | "sunset" | "night";

export interface RenderStats {
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  textureBytesEstimate: number;
}

interface SettingsState {
  qualityTierOverride: DeviceTier | "auto";
  showPerformanceHUD: boolean;
  showControlsHelp: boolean;
  directoryOpen: boolean;
  setDirectoryOpen: (open: boolean) => void;
  minimapOpen: boolean;
  commandPaletteOpen: boolean;
  profileModalOpen: boolean;
  timeOfDay: TimeOfDay;
  renderStats: RenderStats;

  setQualityTierOverride: (tier: DeviceTier | "auto") => void;
  togglePerformanceHUD: () => void;
  toggleControlsHelp: () => void;
  setMinimapOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setRenderStats: (stats: RenderStats) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  qualityTierOverride: "auto",
  showPerformanceHUD: false,
  showControlsHelp: true,
  directoryOpen: false,
  setDirectoryOpen: (directoryOpen) => set({ directoryOpen }),
  minimapOpen: false,
  commandPaletteOpen: false,
  profileModalOpen: false,
  timeOfDay: "day",
  renderStats: {
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    textureBytesEstimate: 0,
  },

  setQualityTierOverride: (qualityTierOverride) => set({ qualityTierOverride }),
  togglePerformanceHUD: () => set((s) => ({ showPerformanceHUD: !s.showPerformanceHUD })),
  toggleControlsHelp: () => set((s) => ({ showControlsHelp: !s.showControlsHelp })),
  setMinimapOpen: (minimapOpen) => set({ minimapOpen }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setProfileModalOpen: (profileModalOpen) => set({ profileModalOpen }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setRenderStats: (renderStats) => set({ renderStats }),
}));

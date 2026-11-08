import { create } from "zustand";
import { worldSound } from "@/lib/audio";

export interface Advancement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "exploration" | "motorsport" | "simulation" | "engineering" | "ai" | "mastery" | "performance";
  unlockedAt?: number;
}

export const ADVANCEMENTS: Record<string, Advancement> = {
  FIRST_FOOTPRINT: {
    id: "FIRST_FOOTPRINT",
    title: "First Footprint",
    description: "Stepped onto Asish Engineering World campus",
    icon: "👞",
    category: "exploration",
  },
  TELEMETRY_UPLINK: {
    id: "TELEMETRY_UPLINK",
    title: "Telemetry Ingestion",
    description: "Inspected Live F1 Intelligence streaming tower",
    icon: "📡",
    category: "engineering",
  },
  LAP_SOLVER: {
    id: "LAP_SOLVER",
    title: "Apex Mathematician",
    description: "Activated Quasi-Static Lap Solver in Simulation Lab",
    icon: "🧪",
    category: "simulation",
  },
  PIT_STRATEGIST: {
    id: "PIT_STRATEGIST",
    title: "Pit Wall Commander",
    description: "Visited Team Operations HQ & F1 Race Manager",
    icon: "🏁",
    category: "motorsport",
  },
  TEST_DRIVER: {
    id: "TEST_DRIVER",
    title: "Track Test Driver",
    description: "Piloted the MCL-47 single-seater onto the circuit",
    icon: "🏎️",
    category: "motorsport",
  },
  SPEED_TRAP: {
    id: "SPEED_TRAP",
    title: "300 Club",
    description: "Clocked 280+ km/h through the pit straight speed trap",
    icon: "⚡",
    category: "performance",
  },
  AI_ARCHITECT: {
    id: "AI_ARCHITECT",
    title: "Neural Vector",
    description: "Explored the EA FC Intelligence & VyaparPulse AI Lab",
    icon: "🧠",
    category: "ai",
  },
  GRAND_PRIX_ENGINEER: {
    id: "GRAND_PRIX_ENGINEER",
    title: "Grand Prix Engineer",
    description: "Discovered and inspected all 6 campus facilities",
    icon: "🏆",
    category: "mastery",
  },
};

interface AdvancementState {
  unlockedIds: string[];
  activeToast: Advancement | null;
  isModalOpen: boolean;

  unlockAdvancement: (id: string) => void;
  dismissToast: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const STORAGE_KEY = "asish_world_advancements_unlocked";

export const useAdvancementStore = create<AdvancementState>((set, get) => {
  let initialUnlocked: string[] = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        initialUnlocked = JSON.parse(saved);
      }
    } catch {
      // Ignored
    }
  }

  return {
    unlockedIds: initialUnlocked,
    activeToast: null,
    isModalOpen: false,

    unlockAdvancement: (id: string) => {
      const advancement = ADVANCEMENTS[id];
      if (!advancement) return;

      const { unlockedIds } = get();
      if (unlockedIds.includes(id)) return;

      const updated = [...unlockedIds, id];
      set({
        unlockedIds: updated,
        activeToast: advancement,
      });

      worldSound.playAdvancementFanfare();

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignored
        }
      }

      // Automatically dismiss toast after 6 seconds
      setTimeout(() => {
        if (get().activeToast?.id === id) {
          set({ activeToast: null });
        }
      }, 6000);
    },

    dismissToast: () => set({ activeToast: null }),
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
  };
});

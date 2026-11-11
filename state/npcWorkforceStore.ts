/**
 * LIVING NPC WORKFORCE STORE
 * Coordinates real-time state, task progression, and player dialogues.
 * ASISH: THE ENGINEERING FRONTIER
 */

import { create } from "zustand";
import type { Vec3 } from "@/lib/npc/npcTypes";
import {
  initializeWorkforce,
  stepNPCWorkforce,
  type NPCStateInstance,
} from "@/lib/npc/behaviorScheduler";

export interface NPCWorkforceState {
  instances: Record<string, NPCStateInstance>;
  interactedNPCId: string | null;
  activeDialogue: string | null;
  lapCompletedTriggered: boolean;
  pipelineFaultActive: boolean;

  // Actions
  interactWithNPC: (npcId: string) => void;
  dismissInteraction: () => void;
  notifyLapCompleted: () => void;
  setPipelineFaultActive: (active: boolean) => void;
  stepSimulation: (
    dt: number,
    isPlayerDriving: boolean,
    isPlayerNearbyF1Car: boolean,
    playerPos: Vec3
  ) => void;
}

export const useNPCWorkforceStore = create<NPCWorkforceState>((set, get) => ({
  instances: initializeWorkforce(),
  interactedNPCId: null,
  activeDialogue: null,
  lapCompletedTriggered: false,
  pipelineFaultActive: false,

  interactWithNPC: (npcId) => {
    const npc = get().instances[npcId];
    if (!npc) return;

    set({
      interactedNPCId: npcId,
      activeDialogue: npc.definition.dialogue.greeting,
    });
  },

  dismissInteraction: () => {
    set({
      interactedNPCId: null,
      activeDialogue: null,
    });
  },

  notifyLapCompleted: () => {
    set({ lapCompletedTriggered: true });
    // Keep high-priority lap reaction active for 20 seconds, then return to normal
    setTimeout(() => {
      set({ lapCompletedTriggered: false });
    }, 20000);
  },

  setPipelineFaultActive: (active) => {
    set({ pipelineFaultActive: active });
  },

  stepSimulation: (dt, isPlayerDriving, isPlayerNearbyF1Car, playerPos) => {
    const {
      instances,
      interactedNPCId,
      lapCompletedTriggered,
      pipelineFaultActive,
    } = get();

    const updated = stepNPCWorkforce(instances, {
      dt,
      isPlayerDriving,
      isPlayerNearbyF1Car,
      playerPos,
      interactedNPCId,
      lapCompletedTriggered,
      pipelineFaultActive,
    });

    // Direct state mutation without triggering React rerender on every frame
    // (Three.js component reads directly via reference or zustand getState)
  },
}));


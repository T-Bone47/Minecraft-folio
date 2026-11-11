/**
 * FRONTIER ENGINEERING TRIALS STORE
 * ASISH: THE ENGINEERING FRONTIER
 *
 * Coordinates:
 * - Active trial scenario lifecycle & state transitions
 * - Guided vs Independent mode configuration
 * - In-world NPC interaction & dialogue state
 * - Evidence collection & hypothesis selection
 * - Real-time evaluation & technical debrief reports
 */

import { create } from "zustand";
import type {
  TrialDivision,
  TrialState,
  TrialScenario,
  TrialEvaluationResult,
  TrialNPC,
} from "@/lib/trials/types";
import {
  ALL_TRIALS,
  getTrialById,
  getTrialByDivision,
} from "@/lib/trials/scenarioRegistry";
import { evaluateTrial } from "@/lib/trials/evaluationEngine";
import { useInteractionRegistry } from "./interactionRegistry";

export interface TrialsStoreState {
  // Active trial state
  activeTrialId: string | null;
  trialState: TrialState;
  guidanceMode: "guided" | "independent";
  selectedHypothesisId: string | null;
  selectedActionId: string | null;
  evidenceExamined: string[];
  evaluationResult: TrialEvaluationResult | null;
  completedTrials: Record<string, TrialEvaluationResult>;

  // NPC dialogue state
  activeNPC: TrialNPC | null;
  npcDialogueText: string | null;

  // UI Modal visibility
  isTerminalOpen: boolean;
  isInvestigationOpen: boolean;
  isDebriefOpen: boolean;

  // Actions
  setGuidanceMode: (mode: "guided" | "independent") => void;
  openTerminal: () => void;
  closeTerminal: () => void;
  openInvestigation: () => void;
  closeInvestigation: () => void;
  openDebrief: () => void;
  closeDebrief: () => void;

  startTrial: (trialId: string, mode?: "guided" | "independent") => void;
  startTrialByDivision: (division: TrialDivision) => void;
  advanceToInvestigation: () => void;
  examineEvidence: (evidenceKey: string) => void;
  selectHypothesis: (hypothesisId: string) => void;
  selectAction: (actionId: string) => void;
  submitEvaluation: () => TrialEvaluationResult | null;
  resetTrial: () => void;
  talkToNPC: (npc: TrialNPC) => void;
  dismissNPCDialogue: () => void;
}

export const useTrialsStore = create<TrialsStoreState>((set, get) => ({
  activeTrialId: null,
  trialState: "AVAILABLE",
  guidanceMode: "guided",
  selectedHypothesisId: null,
  selectedActionId: null,
  evidenceExamined: [],
  evaluationResult: null,
  completedTrials: {},

  activeNPC: null,
  npcDialogueText: null,

  isTerminalOpen: false,
  isInvestigationOpen: false,
  isDebriefOpen: false,

  setGuidanceMode: (mode) => set({ guidanceMode: mode }),

  openTerminal: () => {
    set({ isTerminalOpen: true, isInvestigationOpen: false, isDebriefOpen: false });
    useInteractionRegistry.getState().openStationModal("trials_terminal");
  },

  closeTerminal: () => {
    set({ isTerminalOpen: false });
    if (useInteractionRegistry.getState().activeStationModal === "trials_terminal") {
      useInteractionRegistry.getState().openStationModal(null);
    }
  },

  openInvestigation: () => {
    set({ isInvestigationOpen: true, isTerminalOpen: false, isDebriefOpen: false });
    useInteractionRegistry.getState().openStationModal("trials_investigation");
  },

  closeInvestigation: () => {
    set({ isInvestigationOpen: false });
    if (useInteractionRegistry.getState().activeStationModal === "trials_investigation") {
      useInteractionRegistry.getState().openStationModal(null);
    }
  },

  openDebrief: () => {
    set({ isDebriefOpen: true, isTerminalOpen: false, isInvestigationOpen: false });
    useInteractionRegistry.getState().openStationModal("trials_debrief");
  },

  closeDebrief: () => {
    set({ isDebriefOpen: false });
    if (useInteractionRegistry.getState().activeStationModal === "trials_debrief") {
      useInteractionRegistry.getState().openStationModal(null);
    }
  },

  startTrial: (trialId, mode) => {
    const scenario = getTrialById(trialId);
    if (!scenario) return;

    set({
      activeTrialId: trialId,
      trialState: "BRIEFING",
      guidanceMode: mode || get().guidanceMode,
      selectedHypothesisId: null,
      selectedActionId: null,
      evidenceExamined: [],
      evaluationResult: null,
      activeNPC: scenario.npc,
      npcDialogueText: scenario.npc.dialogue.briefing,
      isTerminalOpen: false,
      isInvestigationOpen: true,
      isDebriefOpen: false,
    });
    useInteractionRegistry.getState().openStationModal("trials_investigation");
  },

  startTrialByDivision: (division) => {
    const scenario = getTrialByDivision(division);
    if (scenario) {
      get().startTrial(scenario.id);
    }
  },

  advanceToInvestigation: () => {
    const { activeTrialId } = get();
    const scenario = activeTrialId ? getTrialById(activeTrialId) : null;
    set({
      trialState: "INVESTIGATING",
      npcDialogueText: scenario?.npc.dialogue.duringInvestigation || null,
    });
  },

  examineEvidence: (evidenceKey) => {
    const current = get().evidenceExamined;
    if (!current.includes(evidenceKey)) {
      set({ evidenceExamined: [...current, evidenceKey] });
    }
  },

  selectHypothesis: (hypothesisId) => {
    const { activeTrialId } = get();
    const scenario = activeTrialId ? getTrialById(activeTrialId) : null;
    const hypo = scenario?.hypotheses.find((h) => h.id === hypothesisId);

    const feedback = hypo?.isCorrect
      ? scenario?.npc.dialogue.onCorrectDiagnosis
      : scenario?.npc.dialogue.onWrongHypothesis;

    set({
      selectedHypothesisId: hypothesisId,
      trialState: "DECISION_PENDING",
      npcDialogueText: feedback || null,
    });
  },

  selectAction: (actionId) => {
    const { activeTrialId } = get();
    const scenario = activeTrialId ? getTrialById(activeTrialId) : null;
    const act = scenario?.actions.find((a) => a.id === actionId);

    const feedback = act?.isOptimal
      ? scenario?.npc.dialogue.onOptimalAction
      : scenario?.npc.dialogue.onSuboptimalAction;

    set({
      selectedActionId: actionId,
      npcDialogueText: feedback || null,
    });
  },

  submitEvaluation: () => {
    const {
      activeTrialId,
      selectedHypothesisId,
      selectedActionId,
      evidenceExamined,
    } = get();
    if (!activeTrialId || !selectedHypothesisId || !selectedActionId) return null;

    const scenario = getTrialById(activeTrialId);
    if (!scenario) return null;

    const selectedHypothesis = scenario.hypotheses.find(
      (h) => h.id === selectedHypothesisId
    );
    const selectedAction = scenario.actions.find((a) => a.id === selectedActionId);

    if (!selectedHypothesis || !selectedAction) return null;

    const result = evaluateTrial({
      scenario,
      selectedHypothesis,
      selectedAction,
      evidenceExamined,
    });

    set((state) => ({
      trialState: result.status,
      evaluationResult: result,
      completedTrials: {
        ...state.completedTrials,
        [scenario.id]: result,
      },
      npcDialogueText:
        result.status === "RESOLVED"
          ? scenario.npc.dialogue.completion
          : scenario.npc.dialogue.onSuboptimalAction,
      isInvestigationOpen: false,
      isDebriefOpen: true,
    }));

    useInteractionRegistry.getState().openStationModal("trials_debrief");
    return result;
  },

  resetTrial: () => {
    set({
      activeTrialId: null,
      trialState: "AVAILABLE",
      selectedHypothesisId: null,
      selectedActionId: null,
      evidenceExamined: [],
      evaluationResult: null,
      activeNPC: null,
      npcDialogueText: null,
      isInvestigationOpen: false,
      isDebriefOpen: false,
    });
    if (
      useInteractionRegistry.getState().activeStationModal === "trials_investigation" ||
      useInteractionRegistry.getState().activeStationModal === "trials_debrief"
    ) {
      useInteractionRegistry.getState().openStationModal(null);
    }
  },

  talkToNPC: (npc) => {
    const scenario = ALL_TRIALS.find((t) => t.npc.id === npc.id);
    const completed = scenario ? get().completedTrials[scenario.id] : null;

    let dialogue = npc.dialogue.greeting;
    if (completed) {
      dialogue = npc.dialogue.completion;
    } else if (get().activeTrialId === scenario?.id) {
      dialogue = npc.dialogue.duringInvestigation;
    }

    set({
      activeNPC: npc,
      npcDialogueText: dialogue,
    });
  },

  dismissNPCDialogue: () => {
    set({
      npcDialogueText: null,
    });
  },
}));

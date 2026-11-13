/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * RoleForge Zustand State Store
 *
 * Manages active role preset, job description parsing, requirement review,
 * adaptive mission compilation, active 3D navigation steps, and evidence briefs.
 */

import { create } from "zustand";
import { parseJobDescription } from "@/lib/roleforge/jobParser";
import {
  createRequirementsFromParsedCandidates,
  createRequirementsFromPreset,
  updateRequirementPriority,
  updateRequirementImportance,
  removeRequirement as removeReqHelper,
  addCustomRequirement as addReqHelper,
} from "@/lib/roleforge/requirementNormalizer";
import { compileMission } from "@/lib/roleforge/missionCompiler";
import { generateEvidenceBrief } from "@/lib/roleforge/evidenceBrief";
import {
  CURATED_ROLE_PRESETS,
  getRolePresetBySlug,
} from "@/lib/roleforge/skillTaxonomy";
import type {
  CompiledMission,
  CuratedRolePreset,
  RequirementPriority,
  RoleForgeEvidenceBrief,
  RoleRequirement,
  VisitorTimeBudget,
} from "@/lib/roleforge/types";

export type RoleForgeTab =
  | "presets"
  | "custom"
  | "review"
  | "matches"
  | "mission"
  | "brief";

export type MissionExecutionStatus =
  | "IDLE"
  | "READY"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

interface RoleForgeState {
  // Modal / Terminal State
  isOpen: boolean;
  activeTab: RoleForgeTab;
  currentBudget: VisitorTimeBudget;

  // Input & Requirements State
  selectedPresetSlug: string | null;
  customJobText: string;
  activeRequirements: RoleRequirement[];
  isParsing: boolean;

  // Compiled Mission State
  compiledMission: CompiledMission | null;
  activeStepIndex: number; // 0-based index
  missionStatus: MissionExecutionStatus;
  worldHighlightsActive: boolean;

  // Evidence Brief
  evidenceBrief: RoleForgeEvidenceBrief | null;

  // Actions
  openTerminal: (tab?: RoleForgeTab) => void;
  closeTerminal: () => void;
  setActiveTab: (tab: RoleForgeTab) => void;
  setBudget: (budget: VisitorTimeBudget) => void;
  selectPreset: (slug: string) => void;
  setCustomJobText: (text: string) => void;
  parseCustomJob: () => void;
  updatePriority: (reqId: string, priority: RequirementPriority) => void;
  updateImportance: (reqId: string, importance: number) => void;
  removeRequirement: (reqId: string) => void;
  addRequirementBySkillId: (skillId: string, priority?: RequirementPriority, importance?: number) => void;
  compileCurrentMission: () => void;
  startMission: () => void;
  pauseMission: () => void;
  resumeMission: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  completeMission: () => void;
  generateBrief: () => void;
  resetAll: () => void;
}

const DEFAULT_PRESET = CURATED_ROLE_PRESETS[0]; // Motorsport Software Engineer
const INITIAL_REQS = createRequirementsFromPreset(DEFAULT_PRESET);
const INITIAL_MISSION = compileMission({
  roleTitle: DEFAULT_PRESET.title,
  roleSlug: DEFAULT_PRESET.slug,
  requirements: INITIAL_REQS,
  budget: DEFAULT_PRESET.defaultBudget,
  preferredGuideNpcId: DEFAULT_PRESET.recommendedGuideNpcId,
});

export const useRoleForgeStore = create<RoleForgeState>((set, get) => ({
  isOpen: false,
  activeTab: "presets",
  currentBudget: DEFAULT_PRESET.defaultBudget,

  selectedPresetSlug: DEFAULT_PRESET.slug,
  customJobText: "",
  activeRequirements: INITIAL_REQS,
  isParsing: false,

  compiledMission: INITIAL_MISSION,
  activeStepIndex: 0,
  missionStatus: "READY",
  worldHighlightsActive: false,

  evidenceBrief: null,

  openTerminal: (tab = "presets") => {
    set({ isOpen: true, activeTab: tab });
  },

  closeTerminal: () => {
    set({ isOpen: false });
  },

  setActiveTab: (tab: RoleForgeTab) => {
    set({ activeTab: tab });
  },

  setBudget: (budget: VisitorTimeBudget) => {
    set({ currentBudget: budget });
    // Recompile mission with new budget
    get().compileCurrentMission();
  },

  selectPreset: (slug: string) => {
    const preset = getRolePresetBySlug(slug) || DEFAULT_PRESET;
    const reqs = createRequirementsFromPreset(preset);
    const mission = compileMission({
      roleTitle: preset.title,
      roleSlug: preset.slug,
      requirements: reqs,
      budget: preset.defaultBudget,
      preferredGuideNpcId: preset.recommendedGuideNpcId,
    });

    set({
      selectedPresetSlug: preset.slug,
      currentBudget: preset.defaultBudget,
      activeRequirements: reqs,
      compiledMission: mission,
      activeStepIndex: 0,
      missionStatus: "READY",
      activeTab: "review",
    });
  },

  setCustomJobText: (text: string) => {
    set({ customJobText: text });
  },

  parseCustomJob: () => {
    const text = get().customJobText;
    if (!text.trim()) return;

    set({ isParsing: true });
    const candidates = parseJobDescription(text);
    const reqs = createRequirementsFromParsedCandidates(candidates);

    const mission = compileMission({
      roleTitle: "Custom Role Candidate",
      roleSlug: "custom-role",
      requirements: reqs,
      budget: get().currentBudget,
    });

    set({
      isParsing: false,
      selectedPresetSlug: null,
      activeRequirements: reqs,
      compiledMission: mission,
      activeStepIndex: 0,
      missionStatus: "READY",
      activeTab: "review",
    });
  },

  updatePriority: (reqId: string, priority: RequirementPriority) => {
    const updated = updateRequirementPriority(get().activeRequirements, reqId, priority);
    set({ activeRequirements: updated });
    get().compileCurrentMission();
  },

  updateImportance: (reqId: string, importance: number) => {
    const updated = updateRequirementImportance(get().activeRequirements, reqId, importance);
    set({ activeRequirements: updated });
    get().compileCurrentMission();
  },

  removeRequirement: (reqId: string) => {
    const updated = removeReqHelper(get().activeRequirements, reqId);
    set({ activeRequirements: updated });
    get().compileCurrentMission();
  },

  addRequirementBySkillId: (skillId: string, priority = "REQUIRED", importance = 4) => {
    const updated = addReqHelper(get().activeRequirements, skillId, priority, importance);
    set({ activeRequirements: updated });
    get().compileCurrentMission();
  },

  compileCurrentMission: () => {
    const { activeRequirements, currentBudget, selectedPresetSlug, compiledMission } = get();
    const preset = selectedPresetSlug ? getRolePresetBySlug(selectedPresetSlug) : null;
    const roleTitle = preset ? preset.title : compiledMission?.roleTitle || "Custom Role Candidate";
    const roleSlug = preset ? preset.slug : compiledMission?.roleSlug || "custom-role";

    const mission = compileMission({
      roleTitle,
      roleSlug,
      requirements: activeRequirements,
      budget: currentBudget,
      preferredGuideNpcId: preset?.recommendedGuideNpcId,
    });

    set({
      compiledMission: mission,
      activeStepIndex: 0,
      missionStatus: "READY",
    });
  },

  startMission: () => {
    set({
      missionStatus: "ACTIVE",
      worldHighlightsActive: true,
      isOpen: false, // Close terminal to enter world
    });
  },

  pauseMission: () => {
    set({ missionStatus: "PAUSED" });
  },

  resumeMission: () => {
    set({ missionStatus: "ACTIVE", worldHighlightsActive: true });
  },

  nextStep: () => {
    const { compiledMission, activeStepIndex } = get();
    if (!compiledMission) return;
    if (activeStepIndex < compiledMission.steps.length - 1) {
      set({ activeStepIndex: activeStepIndex + 1 });
    } else {
      set({ missionStatus: "COMPLETED" });
    }
  },

  prevStep: () => {
    const { activeStepIndex } = get();
    if (activeStepIndex > 0) {
      set({ activeStepIndex: activeStepIndex - 1 });
    }
  },

  goToStep: (index: number) => {
    const { compiledMission } = get();
    if (!compiledMission) return;
    const clamped = Math.max(0, Math.min(compiledMission.steps.length - 1, index));
    set({ activeStepIndex: clamped });
  },

  completeMission: () => {
    set({ missionStatus: "COMPLETED", worldHighlightsActive: false });
    get().generateBrief();
  },

  generateBrief: () => {
    const { compiledMission } = get();
    if (!compiledMission) return;
    const brief = generateEvidenceBrief(compiledMission);
    set({ evidenceBrief: brief, activeTab: "brief" });
  },

  resetAll: () => {
    const defaultPreset = CURATED_ROLE_PRESETS[0];
    const defaultReqs = createRequirementsFromPreset(defaultPreset);
    const defaultMission = compileMission({
      roleTitle: defaultPreset.title,
      roleSlug: defaultPreset.slug,
      requirements: defaultReqs,
      budget: defaultPreset.defaultBudget,
      preferredGuideNpcId: defaultPreset.recommendedGuideNpcId,
    });

    set({
      activeTab: "presets",
      currentBudget: defaultPreset.defaultBudget,
      selectedPresetSlug: defaultPreset.slug,
      customJobText: "",
      activeRequirements: defaultReqs,
      compiledMission: defaultMission,
      activeStepIndex: 0,
      missionStatus: "READY",
      worldHighlightsActive: false,
      evidenceBrief: null,
    });
  },
}));


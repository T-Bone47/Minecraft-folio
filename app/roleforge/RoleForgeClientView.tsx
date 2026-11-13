/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Voxel Engineering Skill Forge Client View
 */

"use client";

import React from "react";
import { useRoleForgeStore, type RoleForgeTab } from "@/state/roleforgeStore";
import { RoleSelector } from "@/components/roleforge/RoleSelector";
import { JobDescriptionInput } from "@/components/roleforge/JobDescriptionInput";
import { RequirementReview } from "@/components/roleforge/RequirementReview";
import { EvidenceMatchView } from "@/components/roleforge/EvidenceMatchView";
import { MissionDirector } from "@/components/roleforge/MissionDirector";
import { EngineeringEvidenceBrief } from "@/components/roleforge/EngineeringEvidenceBrief";
import { VoxelTabs, VoxelStatusLamp } from "@/components/ui/voxel";
import type { VisitorTimeBudget } from "@/lib/roleforge/types";

const TABS: { id: RoleForgeTab; label: string }[] = [
  { id: "presets", label: "CURATED ROLES" },
  { id: "custom", label: "PASTE JOB SPEC" },
  { id: "review", label: "REQUIREMENTS" },
  { id: "matches", label: "EVIDENCE GRAPH" },
  { id: "mission", label: "CAMPUS MISSION" },
  { id: "brief", label: "EXECUTIVE BRIEF" },
];

const BUDGETS: { id: VisitorTimeBudget; label: string }[] = [
  { id: "QUICK_90S", label: "90s FAST" },
  { id: "PROFESSIONAL_5M", label: "5m PRO" },
  { id: "DEEP_DIVE", label: "DEEP DIVE" },
];

export const RoleForgeClientView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentBudget,
    setBudget,
    compiledMission,
  } = useRoleForgeStore();

  return (
    <div className="flex flex-col bg-[#14171d]">
      {/* Console Sub-Header with Budget Selector */}
      <div className="bg-[#181d24] border-b-2 border-[#242b36] p-4 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <VoxelStatusLamp tone="cyan" pulse />
          <div>
            <div className="font-pixel text-[8px] text-amber-400 uppercase tracking-widest">
              ROLE COMPILER ACTIVE
            </div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              Target: <span className="text-cyan-300">{compiledMission?.roleTitle || "Unset (Select Preset or Paste Spec)"}</span>
            </div>
          </div>
        </div>

        {/* Time Budget Selector — Voxel Inset Slot Matrix */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] text-zinc-400 uppercase">BUDGET:</span>
          <div className="flex items-center gap-1 bg-[#101216] p-1 border-2 border-[#2b3340]">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id)}
                className={`text-[9px] font-pixel px-2.5 py-1 transition-all ${
                  currentBudget === b.id
                    ? "bg-[#d96200] text-white border border-[#ffab40] shadow-sm mc-text-shadow"
                    : "text-zinc-400 hover:text-white hover:bg-[#202630]"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mechanical Tabs Bar */}
      <div className="bg-[#12141a] border-b-2 border-[#242b36] p-2 overflow-x-auto">
        <VoxelTabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
        />
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-6 min-h-[460px] bg-[#14171d]">
        {activeTab === "presets" && <RoleSelector />}
        {activeTab === "custom" && <JobDescriptionInput />}
        {activeTab === "review" && <RequirementReview />}
        {activeTab === "matches" && <EvidenceMatchView />}
        {activeTab === "mission" && <MissionDirector />}
        {activeTab === "brief" && <EngineeringEvidenceBrief />}
      </div>
    </div>
  );
};

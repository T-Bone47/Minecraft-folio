/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * 2D Embedded Operations Console Client View
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
import type { VisitorTimeBudget } from "@/lib/roleforge/types";

const TABS: { id: RoleForgeTab; label: string; icon: string }[] = [
  { id: "presets", label: "CURATED ROLES", icon: "📋" },
  { id: "custom", label: "PASTE JOB SPEC", icon: "📝" },
  { id: "review", label: "REQUIREMENTS", icon: "⚙️" },
  { id: "matches", label: "EVIDENCE GRAPH", icon: "🔗" },
  { id: "mission", label: "CAMPUS MISSION", icon: "🎯" },
  { id: "brief", label: "EXECUTIVE BRIEF", icon: "📑" },
];

const BUDGETS: { id: VisitorTimeBudget; label: string }[] = [
  { id: "QUICK_90S", label: "90s FAST" },
  { id: "PROFESSIONAL_5M", label: "5m PRO" },
  { id: "DEEP_DIVE", label: "DEEP DIVE" },
];

export const RoleForgeClientView: React.FC = () => {
  const {
    activeTab,
    openTerminal,
    currentBudget,
    setBudget,
    compiledMission,
  } = useRoleForgeStore();

  return (
    <div className="flex flex-col">
      {/* Console Sub-Header with Budget Selector */}
      <div className="bg-[#12151b] border-b border-zinc-800 p-4 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
            INTERACTIVE OPERATIONS CONSOLE
          </div>
          <div className="text-sm font-bold font-mono text-white">
            Active Role Target: <span className="text-cyan-300">{compiledMission?.roleTitle || "Unset"}</span>
          </div>
        </div>

        {/* Time Budget Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Visitor Budget:</span>
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-zinc-800">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                  currentBudget === b.id
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-[#0f1217] border-b border-zinc-800/80 px-4 sm:px-6 flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => openTerminal(tab.id)}
              className={`py-3 px-3.5 text-xs font-mono whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
                isActive
                  ? "border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#0d0f12] to-[#0a0b0d]">
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


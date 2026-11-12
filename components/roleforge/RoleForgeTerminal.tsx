/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * RoleForge Command Terminal (Master Modal)
 */

"use client";

import React, { useEffect } from "react";
import { useRoleForgeStore, type RoleForgeTab } from "@/state/roleforgeStore";
import { RoleSelector } from "./RoleSelector";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { RequirementReview } from "./RequirementReview";
import { EvidenceMatchView } from "./EvidenceMatchView";
import { MissionDirector } from "./MissionDirector";
import { EngineeringEvidenceBrief } from "./EngineeringEvidenceBrief";
import type { VisitorTimeBudget } from "@/lib/roleforge/types";

const TABS: { id: RoleForgeTab; label: string; icon: string }[] = [
  { id: "presets", label: "CURATED ROLES", icon: "📋" },
  { id: "custom", label: "PASTE JOB SPEC", icon: "📝" },
  { id: "review", label: "REQUIREMENTS", icon: "⚙️" },
  { id: "matches", label: "EVIDENCE GRAPH", icon: "🔗" },
  { id: "mission", label: "CAMPUS MISSION", icon: "🎯" },
  { id: "brief", label: "EXECUTIVE BRIEF", icon: "📑" },
];

const BUDGETS: { id: VisitorTimeBudget; label: string; time: string }[] = [
  { id: "QUICK_90S", label: "90s FAST", time: "90s" },
  { id: "PROFESSIONAL_5M", label: "5m PRO", time: "5m" },
  { id: "DEEP_DIVE", label: "DEEP DIVE", time: "10m" },
];

export const RoleForgeTerminal: React.FC = () => {
  const {
    isOpen,
    closeTerminal,
    activeTab,
    openTerminal,
    currentBudget,
    setBudget,
    compiledMission,
  } = useRoleForgeStore();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeTerminal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeTerminal]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="RoleForge Terminal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-[#0d0f12] border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#12151b] border-b border-zinc-800 p-3 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm shadow-[0_0_10px_rgba(34,211,238,0.4)]">
              RF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-widest font-mono">
                  FRONTIER ROLEFORGE
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  PROOF COMPILER
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                YOUR ROLE. MY ENGINEERING. REAL PROOF.
              </p>
            </div>
          </div>

          {/* Time Budget Selector & Close */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-zinc-800">
              <span className="text-[9px] font-mono text-zinc-500 uppercase px-1">Budget:</span>
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudget(b.id)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                    currentBudget === b.id
                      ? "bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={closeTerminal}
              aria-label="Close RoleForge Terminal"
              className="w-8 h-8 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center text-sm font-mono transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0f1217] border-b border-zinc-800/80 px-3 sm:px-5 flex items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => openTerminal(tab.id)}
                className={`py-2.5 px-3 text-xs font-mono whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
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

        {/* Tab Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-gradient-to-b from-[#0d0f12] to-[#0a0b0d]">
          {activeTab === "presets" && <RoleSelector />}
          {activeTab === "custom" && <JobDescriptionInput />}
          {activeTab === "review" && <RequirementReview />}
          {activeTab === "matches" && <EvidenceMatchView />}
          {activeTab === "mission" && <MissionDirector />}
          {activeTab === "brief" && <EngineeringEvidenceBrief />}
        </div>

        {/* Terminal Status Footer */}
        <div className="bg-[#0a0b0d] border-t border-zinc-800/80 p-3 px-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Active Role: <strong className="text-zinc-300">{compiledMission?.roleTitle || "None"}</strong>
            </span>
            <span>·</span>
            <span>
              Budget: <strong className="text-cyan-400">{currentBudget}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300">R</kbd> in world for quick toggle</span>
            <span>[ESC] to Exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};


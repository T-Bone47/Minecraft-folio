/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Arena Master Modal Component
 */

"use client";

import React, { useEffect } from "react";
import { useDefenseStore, type DefenseArenaTab } from "@/state/defenseStore";
import { DEFENSE_TRACKS, getAllDefenseTracks } from "@/lib/defense/scenarioRegistry";
import { ScenarioBriefing } from "./ScenarioBriefing";
import { ParameterControls } from "./ParameterControls";
import { ResultsViewer } from "./ResultsViewer";
import { CounterfactualComparisonView } from "./CounterfactualComparisonView";
import { TechnicalReviewBoard } from "./TechnicalReviewBoard";
import { buildDefenseTraceSpans } from "@/lib/defense/defenseTraceBridge";
import type { DefenseTrackId } from "@/lib/defense/types";

const TABS: { id: DefenseArenaTab; label: string; icon: string }[] = [
  { id: "briefing", label: "BRIEFING & HYPOTHESIS", icon: "📋" },
  { id: "lab", label: "PARAMETER LAB", icon: "⚙️" },
  { id: "results", label: "INVARIANT AUDIT", icon: "🛡️" },
  { id: "counterfactual", label: "COUNTERFACTUAL", icon: "⚡" },
  { id: "review", label: "TECH REVIEW BOARD", icon: "🏛️" },
];

export const DefenseArenaModal: React.FC = () => {
  const {
    isOpen,
    closeArena,
    activeTrackId,
    selectTrack,
    activeTab,
    setActiveTab,
    baselineResult,
    comparison,
  } = useDefenseStore();

  const allTracks = getAllDefenseTracks();
  const currentTrack = DEFENSE_TRACKS[activeTrackId] || allTracks[0];

  // Escape key and keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeArena();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeArena]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Engineering Defense Arena"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-[#0c0e12] border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#12151b] border-b border-zinc-800 p-3 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-950 border border-red-500/80 flex items-center justify-center text-red-400 font-mono font-bold text-sm shadow-[0_0_10px_rgba(220,38,38,0.3)]">
              DA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-widest font-mono">
                  ENGINEERING DEFENSE ARENA
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  DEFENSE SYSTEM 2.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                DON&apos;T JUST SHOW CAPABILITY. CHALLENGE & VERIFY IT.
              </p>
            </div>
          </div>

          {/* Track Switcher & Close */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-zinc-800">
              {allTracks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTrack(t.id)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                    activeTrackId === t.id
                      ? "bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t.shortTitle}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={closeArena}
              aria-label="Close Defense Arena"
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
            const isDisabled =
              (tab.id === "results" && !baselineResult) ||
              (tab.id === "counterfactual" && !comparison);

            return (
              <button
                key={tab.id}
                type="button"
                disabled={isDisabled}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-3 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                    : isDisabled
                    ? "border-transparent text-zinc-600 cursor-not-allowed"
                    : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto bg-[#0a0c10]">
          {activeTab === "briefing" && <ScenarioBriefing track={currentTrack} />}
          {activeTab === "lab" && <ParameterControls track={currentTrack} />}
          {activeTab === "results" && baselineResult && (
            <ResultsViewer result={baselineResult} />
          )}
          {activeTab === "counterfactual" && comparison && (
            <CounterfactualComparisonView comparison={comparison} />
          )}
          {activeTab === "review" && (
            <TechnicalReviewBoard
              review={currentTrack.review}
              title={currentTrack.title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

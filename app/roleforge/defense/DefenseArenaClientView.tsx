/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Arena Client View for /roleforge/defense
 */

"use client";

import React, { useEffect } from "react";
import { getAllDefenseTracks } from "@/lib/defense/scenarioRegistry";
import { useDefenseStore } from "@/state/defenseStore";
import { ScenarioBriefing } from "@/components/defense/ScenarioBriefing";
import { ParameterControls } from "@/components/defense/ParameterControls";
import { ResultsViewer } from "@/components/defense/ResultsViewer";
import { CounterfactualComparisonView } from "@/components/defense/CounterfactualComparisonView";
import { TechnicalReviewBoard } from "@/components/defense/TechnicalReviewBoard";
import type { DefenseArenaTab } from "@/state/defenseStore";
import type { DefenseTrackId } from "@/lib/defense/types";

interface DefenseArenaClientViewProps {
  initialTrackId?: DefenseTrackId;
}

export const DefenseArenaClientView: React.FC<DefenseArenaClientViewProps> = ({
  initialTrackId,
}) => {
  const {
    activeTrackId,
    selectTrack,
    activeTab,
    setActiveTab,
    baselineResult,
    comparison,
  } = useDefenseStore();

  const tracks = getAllDefenseTracks();

  useEffect(() => {
    if (initialTrackId && initialTrackId !== activeTrackId) {
      selectTrack(initialTrackId);
    }
  }, [initialTrackId, selectTrack, activeTrackId]);

  const currentTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  const TABS: { id: DefenseArenaTab; label: string; icon: string }[] = [
    { id: "briefing", label: "BRIEFING & HYPOTHESIS", icon: "📋" },
    { id: "lab", label: "PARAMETER LAB", icon: "⚙️" },
    { id: "results", label: "INVARIANT AUDIT", icon: "🛡️" },
    { id: "counterfactual", label: "COUNTERFACTUAL", icon: "⚡" },
    { id: "review", label: "TECH REVIEW BOARD", icon: "🏛️" },
  ];

  return (
    <div className="bg-[#0e1117] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Track Selector Bar */}
      <div className="bg-[#141822] border-b border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Select Track:
          </span>
          <div className="flex flex-wrap gap-2">
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTrack(t.id)}
                className={`text-xs font-mono px-3 py-1.5 rounded transition-all ${
                  activeTrackId === t.id
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    : "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white"
                }`}
              >
                {t.shortTitle}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-400">
          FACILITY: <span className="text-cyan-400 font-bold">{currentTrack.facilityId.toUpperCase()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#10131a] border-b border-zinc-800 px-4 flex items-center gap-1 overflow-x-auto">
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
              className={`py-3 px-3.5 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
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

      {/* Body View */}
      <div className="bg-[#0b0d12] min-h-[500px]">
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
  );
};

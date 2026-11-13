/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Arena: Scenario Briefing & Hypothesis Selection Component
 */

"use client";

import React from "react";
import type { DefenseTrackConfig } from "@/lib/defense/scenarioRegistry";
import { useDefenseStore } from "@/state/defenseStore";

interface ScenarioBriefingProps {
  track: DefenseTrackConfig;
}

export const ScenarioBriefing: React.FC<ScenarioBriefingProps> = ({ track }) => {
  const { selectedHypothesisId, selectHypothesis, setActiveTab, runSimulation } =
    useDefenseStore();

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      {/* Track Overview Hero */}
      <div className="bg-[#13171f] border border-zinc-800 rounded-lg p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider uppercase"
            style={{
              backgroundColor: `${track.color}20`,
              color: track.color,
              borderColor: `${track.color}50`,
              borderWidth: 1,
            }}
          >
            {track.badge}
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            FACILITY: {track.facilityId.toUpperCase()} • PROJECT: {track.associatedProjectId.toUpperCase()}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold font-mono text-white mb-2">
          {track.title}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {track.description}
        </p>

        {/* Verified Source Reference Badge */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓ VERIFIED REPOSITORY COMMIT</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-300">
              {track.review.sourceCodePermalink.split("/blob/")[1]?.split("/")[0] || "Pinned SHA"}
            </span>
          </div>
          <a
            href={track.review.sourceCodePermalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
          >
            <span>Inspect Real Source Code</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Selectable Engineering Hypotheses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase">
            Select Test Hypothesis to Verify or Challenge:
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">
            {track.hypotheses.length} PRESET DEFENSE SCENARIOS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {track.hypotheses.map((hyp) => {
            const isSelected = selectedHypothesisId === hyp.id;
            return (
              <div
                key={hyp.id}
                onClick={() => selectHypothesis(hyp.id)}
                className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-zinc-900/90 border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                    : "bg-[#11141a] border-zinc-800 hover:border-zinc-700 hover:bg-[#141820]"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-400 text-black font-bold"
                          : "border-zinc-600 bg-transparent text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <h4 className="text-xs sm:text-sm font-mono font-bold text-white">
                      {hyp.title}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 shrink-0 uppercase px-1.5 py-0.5 rounded bg-black/40 border border-zinc-800">
                    TARGET: {hyp.invariantToTest}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-zinc-400 ml-5.5 mt-1 leading-normal">
                  {hyp.description}
                </p>

                <div className="ml-5.5 mt-2 flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-cyan-400">EXPECTED:</span>
                  <span className="text-zinc-300">{hyp.expectedOutcome}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveTab("review")}
          className="text-xs font-mono px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          View Senior Staff Architecture Review ↗
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("lab")}
            className="text-xs font-mono px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-zinc-700"
          >
            Customize Parameters →
          </button>
          <button
            type="button"
            onClick={runSimulation}
            className="text-xs font-mono font-bold px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            Run Baseline Verification ⚡
          </button>
        </div>
      </div>
    </div>
  );
};

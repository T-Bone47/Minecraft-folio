/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Arena: Counterfactual Comparison View
 */

"use client";

import React from "react";
import type { DefenseComparison } from "@/lib/defense/types";
import { useDefenseStore } from "@/state/defenseStore";

interface CounterfactualComparisonViewProps {
  comparison: DefenseComparison;
}

export const CounterfactualComparisonView: React.FC<CounterfactualComparisonViewProps> = ({
  comparison,
}) => {
  const { setActiveTab } = useDefenseStore();
  const { baseline, counterfactual, metricDeltas, invariantsBroken, invariantsResolved, conclusion } =
    comparison;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-[#12161f] border border-zinc-800 rounded-lg p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 uppercase">
            COUNTERFACTUAL DIFFERENTIAL ANALYSIS
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            TRACK: {comparison.trackId.toUpperCase()}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-bold font-mono text-white mb-1">
          Causal Diagnosis & Invariant Transition
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono">
          {conclusion}
        </p>

        {/* State Changes Callouts */}
        {(invariantsBroken.length > 0 || invariantsResolved.length > 0) && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap gap-2 text-xs font-mono">
            {invariantsBroken.map((name) => (
              <span
                key={name}
                className="px-2.5 py-1 rounded bg-red-950/80 text-red-400 border border-red-500/40 flex items-center gap-1.5"
              >
                <span>✕ INVARIANT BROKEN:</span>
                <span className="font-bold">{name}</span>
              </span>
            ))}
            {invariantsResolved.map((name) => (
              <span
                key={name}
                className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5"
              >
                <span>✓ INVARIANT RESOLVED:</span>
                <span className="font-bold">{name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Side-by-Side Status Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Baseline Card */}
        <div className="bg-[#101319] border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              1. Baseline Run (Canonical)
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                baseline.passed
                  ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                  : "bg-red-950 text-red-400 border-red-500/40"
              }`}
            >
              {baseline.passed ? "PASSED" : "FAILED"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono mb-3">
            {baseline.technicalSummary}
          </p>
          <div className="bg-black/60 p-2.5 rounded border border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1">
            {Object.entries(baseline.parameters).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-500">{k}:</span>
                <span className="text-zinc-300 font-bold">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Counterfactual Card */}
        <div className="bg-[#101319] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              2. Counterfactual Run (Altered)
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                counterfactual.passed
                  ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                  : "bg-red-950 text-red-400 border-red-500/40"
              }`}
            >
              {counterfactual.passed ? "PASSED" : "FAILED"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono mb-3">
            {counterfactual.technicalSummary}
          </p>
          <div className="bg-black/60 p-2.5 rounded border border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1">
            {Object.entries(counterfactual.parameters).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-500">{k}:</span>
                <span className="text-zinc-300 font-bold">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quantitative Metric Deltas Table */}
      <div className="bg-[#11141a] border border-zinc-800 rounded-lg overflow-hidden">
        <div className="bg-[#151922] px-4 py-2.5 border-b border-zinc-800">
          <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
            Quantitative Differential Metrics
          </h3>
        </div>

        <div className="divide-y divide-zinc-800">
          {Object.entries(metricDeltas).map(([key, deltaItem]) => (
            <div
              key={key}
              className="px-4 py-3 flex items-center justify-between text-xs font-mono"
            >
              <div>
                <span className="text-white font-bold">{deltaItem.label}</span>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  Baseline: {deltaItem.baselineVal} {deltaItem.unit} → Counterfactual: {deltaItem.counterfactualVal} {deltaItem.unit}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    deltaItem.improved
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40"
                      : "bg-red-950/80 text-red-400 border border-red-800/40"
                  }`}
                >
                  {deltaItem.delta > 0 ? "+" : ""}
                  {deltaItem.delta} {deltaItem.unit} ({deltaItem.percentChange > 0 ? "+" : ""}
                  {deltaItem.percentChange}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("results")}
          className="text-xs font-mono text-zinc-400 hover:text-white"
        >
          ← Return to Baseline Results
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("review")}
          className="text-xs font-mono px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors"
        >
          Senior Staff Technical Review ↗
        </button>
      </div>
    </div>
  );
};


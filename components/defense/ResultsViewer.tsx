/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Arena: Simulation Results & Invariant Verification Viewer
 */

"use client";

import React, { useState } from "react";
import { useDefenseStore } from "@/state/defenseStore";
import type { DefenseExecutionResult } from "@/lib/defense/types";

interface ResultsViewerProps {
  result: DefenseExecutionResult;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({ result }) => {
  const { setActiveTab, runCounterfactualTest, activeTrackId } = useDefenseStore();
  const [showLogs, setShowLogs] = useState(false);

  // Suggested counterfactual parameter presets for one-click stress testing
  const handleQuickCounterfactual = () => {
    let modifiedParams: Record<string, any> = {};

    if (activeTrackId === "systems-reliability") {
      // Stress test: higher fault rate with strict barrier
      modifiedParams = {
        ...result.parameters,
        faultRatePercent: 25,
        recoveryPolicy: "strict-barrier",
        barrierTimeoutMs: 30,
      };
    } else if (activeTrackId === "motorsport-lap-delta") {
      // Coarse discretization test
      modifiedParams = {
        ...result.parameters,
        samplingResolutionMeters: 50,
        splineMethod: "linear",
      };
    } else if (activeTrackId === "aiml-model-leakage") {
      // Leakage trap test
      modifiedParams = {
        ...result.parameters,
        splitStrategy: "random-kfold",
        includeLookaheadPitFlag: "yes-leaked",
      };
    }

    runCounterfactualTest(modifiedParams);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#11141b] border border-zinc-800 p-4 rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider uppercase border ${
                result.passed
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                  : "bg-red-950/80 text-red-400 border-red-500/40"
              }`}
            >
              {result.passed ? "✓ ALL INVARIANTS SATISFIED" : "⚠ INVARIANT VIOLATION DETECTED"}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              RUN ID: {result.runId} • DURATION: {result.durationMs}ms
            </span>
          </div>
          <p className="text-xs text-zinc-300 font-mono">
            {result.technicalSummary}
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickCounterfactual}
          className="text-xs font-mono font-bold px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.3)] transition-colors flex items-center gap-1.5"
        >
          <span>Run Counterfactual Stress Test</span>
          <span>⚡</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {result.metrics.map((metric) => (
          <div
            key={metric.key}
            className="bg-[#12161f] border border-zinc-800 rounded-lg p-3 flex flex-col justify-between"
          >
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-lg sm:text-xl font-bold font-mono text-white">
                {metric.value}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {metric.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Invariants Verification Table */}
      <div className="bg-[#11141a] border border-zinc-800 rounded-lg overflow-hidden">
        <div className="bg-[#151922] px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-zinc-200 tracking-wider uppercase">
            System Invariant Verification Contract
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">
            {result.invariants.filter((i) => i.passed).length} / {result.invariants.length} PASSED
          </span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {result.invariants.map((inv) => (
            <div key={inv.id} className="p-3.5 sm:px-4 flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                      inv.passed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-red-500/20 text-red-400 border border-red-500/40"
                    }`}
                  >
                    {inv.passed ? "✓" : "✕"}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {inv.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-zinc-500">Threshold: {inv.thresholdValue}</span>
                  <span className="text-zinc-600">|</span>
                  <span
                    className={
                      inv.passed
                        ? "text-emerald-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    Actual: {inv.actualValue}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 ml-6 leading-normal">
                {inv.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Visualizer */}
      {result.artifactCharts && result.artifactCharts.length > 0 && (
        <div className="bg-[#11141b] border border-zinc-800 rounded-lg p-4">
          <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-3">
            {result.artifactCharts[0].label}
          </h3>

          <div className="h-32 flex items-end gap-1.5 pt-4 px-2 border-b border-l border-zinc-800">
            {result.artifactCharts[0].series.map((pt, idx) => {
              const yVal = typeof pt.y === "number" ? pt.y : 0;
              const maxY = Math.max(
                ...result.artifactCharts![0].series.map((s) => (typeof s.y === "number" ? s.y : 0)),
                1
              );
              const heightPct = Math.min(100, Math.max(10, (yVal / maxY) * 100));

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t transition-all ${
                      result.passed ? "bg-cyan-500/80 group-hover:bg-cyan-400" : "bg-red-500/80 group-hover:bg-red-400"
                    }`}
                  />
                  <span className="text-[8px] font-mono text-zinc-500 truncate max-w-[28px]">
                    {pt.x}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggle Execution Terminal Logs */}
      <div>
        <button
          type="button"
          onClick={() => setShowLogs(!showLogs)}
          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
        >
          <span>{showLogs ? "▼ Hide Execution Trace Logs" : "▶ Show Monotonic Execution Trace Logs"}</span>
          <span className="text-[10px] text-zinc-600">({result.logs.length} lines)</span>
        </button>

        {showLogs && (
          <div className="mt-2 bg-black border border-zinc-800 rounded-lg p-3 font-mono text-[11px] text-zinc-300 max-h-48 overflow-y-auto leading-relaxed">
            {result.logs.map((log, idx) => (
              <div key={idx} className="hover:bg-zinc-900/50">
                <span className="text-zinc-600 select-none mr-2">[{idx + 1}]</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("lab")}
          className="text-xs font-mono text-zinc-400 hover:text-white"
        >
          ← Adjust Parameters
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("review")}
          className="text-xs font-mono px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors"
        >
          Read Senior Technical Review Board ↗
        </button>
      </div>
    </div>
  );
};


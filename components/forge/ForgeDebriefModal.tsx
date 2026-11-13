"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, X, Terminal, Clock, ShieldCheck, Download } from "lucide-react";
import type { ExecutionTrace } from "@/lib/forge/types";

interface ForgeDebriefModalProps {
  trace: ExecutionTrace;
  onClose: () => void;
  onExportJson?: () => void;
}

export function ForgeDebriefModal({ trace, onClose, onExportJson }: ForgeDebriefModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forge-debrief-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-zinc-950 border-2 border-red-500/70 rounded-xl shadow-2xl shadow-red-950/40 overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded border ${
                trace.success
                  ? "bg-emerald-950 text-emerald-300 border-emerald-700/60"
                  : "bg-red-950 text-red-300 border-red-700/60"
              }`}
            >
              {trace.success ? "PIPELINE VERIFIED — ALL INVARIANTS PASSED" : "EXECUTION FAILED — INVARIANT BREACH"}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Executed: {new Date(trace.executedAt).toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close debrief"
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Banner */}
          <div
            className={`p-4 rounded-lg border text-xs sm:text-sm font-mono leading-relaxed ${
              trace.success
                ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-200"
                : "bg-red-950/30 border-red-900/60 text-red-200"
            }`}
          >
            {trace.debriefSummary}
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg">
              <span className="text-zinc-500 block mb-1">PROCESSED</span>
              <span className="text-lg font-bold text-white">{trace.totalEventsProcessed}</span>
              <span className="text-zinc-500 block">events</span>
            </div>

            <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg">
              <span className="text-zinc-500 block mb-1">QUARANTINED</span>
              <span className="text-lg font-bold text-amber-400">{trace.corruptedEventsHandled}</span>
              <span className="text-zinc-500 block">corrupt</span>
            </div>

            <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg">
              <span className="text-zinc-500 block mb-1">DEDUPLICATED</span>
              <span className="text-lg font-bold text-emerald-400">{trace.duplicateEventsDetected}</span>
              <span className="text-zinc-500 block">packets</span>
            </div>

            <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg">
              <span className="text-zinc-500 block mb-1">P50 / P99 LATENCY</span>
              <span className="text-lg font-bold text-white">
                {trace.p50LatencyMs} / {trace.p99LatencyMs}
              </span>
              <span className="text-zinc-500 block">ms / event</span>
            </div>
          </div>

          {/* Invariant Assertions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Engineering Invariant Assertions ({trace.invariants.length})</span>
            </h3>

            <div className="space-y-2">
              {trace.invariants.map((inv) => (
                <div
                  key={inv.name}
                  className={`p-3 rounded-lg border flex items-start gap-3 text-xs font-mono ${
                    inv.passed
                      ? "bg-zinc-900/40 border-emerald-900/40 text-zinc-300"
                      : "bg-red-950/20 border-red-900/60 text-red-300"
                  }`}
                >
                  <div className="mt-0.5">
                    {inv.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white">{inv.name}</div>
                    <div className="mt-0.5 text-zinc-400">{inv.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Execution Logs */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>Execution Event Stream Sample (First {trace.stepLogs.length} Steps)</span>
            </h3>

            <div className="max-h-56 overflow-y-auto rounded-lg border border-zinc-800 bg-black p-3 font-mono text-xs space-y-1">
              {trace.stepLogs.map((log) => (
                <div key={log.step} className="flex items-center gap-2 text-zinc-300">
                  <span className="text-zinc-500 w-8">#{log.step}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      log.status === "OK"
                        ? "bg-emerald-950 text-emerald-400"
                        : log.status === "WARN"
                        ? "bg-amber-950 text-amber-400"
                        : "bg-red-950 text-red-400"
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-zinc-400 w-28 truncate">[{log.nodeName}]</span>
                  <span className="text-zinc-300 truncate">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-900/90 border-t border-zinc-800 text-xs font-mono text-zinc-400">
          <div>Systems Forge Architecture Engine</div>
          <div className="flex items-center gap-3">
            {onExportJson && (
              <button
                onClick={onExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Trace</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 font-bold uppercase bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
            >
              Close Debrief
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React from "react";
import { useXRayStore } from "@/state/xrayStore";
import { HISTORICAL_INCIDENTS } from "@/lib/xray/historyRegistry";
import { ShieldCheck, GitCommit, FileCode, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const EngineeringTimeMachineView: React.FC = () => {
  const selectedId = useXRayStore((s) => s.timeMachineSelectedId);
  const mode = useXRayStore((s) => s.timeMachineMode);
  const setSelectedId = useXRayStore((s) => s.setTimeMachineSelectedId);
  const setMode = useXRayStore((s) => s.setTimeMachineMode);

  const activeIncident = HISTORICAL_INCIDENTS.find((inc) => inc.id === selectedId) || HISTORICAL_INCIDENTS[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-zinc-200">
      {/* 1. Incident Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2">
          Verified Incident Registry ({HISTORICAL_INCIDENTS.length})
        </div>
        <div className="space-y-2">
          {HISTORICAL_INCIDENTS.map((inc) => {
            const isSelected = inc.id === activeIncident.id;
            return (
              <button
                key={inc.id}
                onClick={() => setSelectedId(inc.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-900/20"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {inc.category}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">{inc.id}</span>
                </div>
                <div className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug">{inc.title}</div>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Engineering Honesty Contract
          </div>
          <p>
            Every case represents a genuine defect diagnosed and resolved in this repository&apos;s Git history. Diffs,
            root causes, and verification tests are reproducible from commit metadata.
          </p>
        </div>
      </div>

      {/* 2. Main Case Study Inspector */}
      <div className="flex-1 space-y-5 bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
              {activeIncident.category} CASE STUDY
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Provenance:</span>
              <span className="text-emerald-400 font-bold">{activeIncident.provenance}</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-zinc-100 mb-1">{activeIncident.title}</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">{activeIncident.summary}</p>
        </div>

        {/* Diagnosis & Root Cause */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-1.5">
            <div className="font-semibold text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Observed Failure Symptom
            </div>
            <p className="font-mono text-zinc-300 text-[11px]">{activeIncident.symptom}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
            <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5" />
              Diagnosed Root Cause
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">{activeIncident.rootCause}</p>
          </div>
        </div>

        {/* Git Commit Pair & Mode Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-zinc-500 mr-1.5">Before:</span>
              <code className="text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/60">
                {activeIncident.beforeCommit.slice(0, 7)}
              </code>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />
            <div>
              <span className="text-zinc-500 mr-1.5">After:</span>
              <code className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/60">
                {activeIncident.afterCommit.slice(0, 7)}
              </code>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-md border border-zinc-800">
            <button
              onClick={() => setMode("before")}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                mode === "before"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              BEFORE FIX
            </button>
            <button
              onClick={() => setMode("after")}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                mode === "after"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              AFTER FIX
            </button>
          </div>
        </div>

        {/* Code Diff Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeIncident.affectedFiles.join(", ")}</span>
            </div>
            <span className="text-[11px] font-semibold text-zinc-300">
              Showing {mode === "before" ? "Defective Baseline" : "Verified Implementation"}
            </span>
          </div>
          <pre
            className={`p-4 rounded-lg font-mono text-xs overflow-x-auto border leading-relaxed ${
              mode === "before"
                ? "bg-red-950/20 border-red-900/40 text-red-200"
                : "bg-emerald-950/20 border-emerald-900/40 text-emerald-200"
            }`}
          >
            {mode === "before" ? activeIncident.beforeSnippet : activeIncident.afterSnippet}
          </pre>
        </div>

        {/* Verification & Outcome */}
        <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Verification Test
            </span>
            <code className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              {activeIncident.verificationTest}
            </code>
          </div>
          <p className="text-zinc-400 text-[11px]">{activeIncident.verifiedOutcome}</p>
          {activeIncident.remainingLimitations && (
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              <strong className="text-zinc-400">Remaining Limitations:</strong> {activeIncident.remainingLimitations}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

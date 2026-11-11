"use client";

import React from "react";
import { useTrialsStore } from "@/state/trialsStore";
import { getTrialById, ALL_TRIALS } from "@/lib/trials/scenarioRegistry";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { worldSound } from "@/lib/audio";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowRight,
  RotateCcw,
  Code2,
  Share2,
} from "lucide-react";

export function EngineeringDebriefModal({ onClose }: { onClose: () => void }) {
  const { evaluationResult, openTerminal, resetTrial, startTrial } =
    useTrialsStore();
  const { openStationModal } = useInteractionRegistry();

  if (!evaluationResult) return null;

  const scenario = getTrialById(evaluationResult.trialId);
  const isResolved = evaluationResult.status === "RESOLVED";

  // Calculate rubric breakdown
  const hypoPoints = evaluationResult.selectedHypothesis.isCorrect ? 50 : 0;
  const actionPoints = evaluationResult.selectedAction.isOptimal
    ? 40
    : evaluationResult.selectedAction.simulatedDeltaS !== undefined &&
      evaluationResult.selectedAction.simulatedDeltaS < 0.2
    ? 15
    : 5;
  const evidencePoints = Math.min(
    10,
    Math.round((evaluationResult.evidenceExamined?.length || 0) * 3.5)
  );

  const handleDownloadJSON = () => {
    worldSound.playClick();
    const blob = new Blob([JSON.stringify(evaluationResult, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-debrief-${evaluationResult.trialId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Find next trial
  const currentIndex = ALL_TRIALS.findIndex((t) => t.id === evaluationResult.trialId);
  const nextTrial =
    currentIndex >= 0 && currentIndex < ALL_TRIALS.length - 1
      ? ALL_TRIALS[currentIndex + 1]
      : null;

  return (
    <div className="text-zinc-100 font-sans max-h-[84vh] overflow-y-auto pr-1">
      {/* Top Banner */}
      <div
        className={`p-4 border mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isResolved
            ? "bg-emerald-950/40 border-emerald-500/80"
            : "bg-amber-950/40 border-amber-500/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 border ${
              isResolved
                ? "bg-emerald-900 border-emerald-600 text-emerald-200"
                : "bg-amber-900 border-amber-600 text-amber-200"
            }`}
          >
            {isResolved ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-700 uppercase">
                {evaluationResult.provenanceLabel}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {new Date(evaluationResult.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h2 className="font-silkscreen text-base sm:text-lg font-bold text-zinc-100 mt-0.5">
              TRIAL {evaluationResult.status} {"//"} {evaluationResult.scorePct}% PROFICIENCY
            </h2>
            <p className="text-xs font-mono text-zinc-300">
              {evaluationResult.title}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadJSON}
          className="self-start sm:self-center px-3 py-2 text-xs font-silkscreen bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT DEBRIEF (JSON)</span>
        </button>
      </div>

      {/* Rubric Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <div className="bg-zinc-900/80 border border-zinc-800 p-3">
          <div className="text-[10px] font-mono text-zinc-500">1. HYPOTHESIS DIAGNOSIS</div>
          <div className="text-lg font-silkscreen font-bold text-zinc-200 mt-0.5">
            {hypoPoints} / 50 PTS
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-1 truncate">
            {evaluationResult.selectedHypothesis.label}
          </p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3">
          <div className="text-[10px] font-mono text-zinc-500">2. INTERVENTION OPTIMALITY</div>
          <div className="text-lg font-silkscreen font-bold text-zinc-200 mt-0.5">
            {actionPoints} / 40 PTS
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-1 truncate">
            {evaluationResult.selectedAction.label}
          </p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3">
          <div className="text-[10px] font-mono text-zinc-500">3. EVIDENCE THOROUGHNESS</div>
          <div className="text-lg font-silkscreen font-bold text-zinc-200 mt-0.5">
            {evidencePoints} / 10 PTS
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-1">
            {evaluationResult.evidenceExamined.length} data traces inspected
          </p>
        </div>
      </div>

      {/* Observed Consequences & Detailed Reasoning */}
      <div className="space-y-3 mb-4">
        <div className="bg-zinc-900/70 border border-zinc-800 p-4">
          <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider mb-1">
            OBSERVED SYSTEM / PHYSICAL CONSEQUENCES
          </h3>
          <p className="text-xs font-mono text-zinc-300 leading-relaxed">
            {evaluationResult.observedConsequences}
          </p>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 p-4">
          <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider mb-1">
            ARCHITECTURAL REASONING & TRADE-OFF ANALYSIS
          </h3>
          <p className="text-xs font-mono text-zinc-300 leading-relaxed">
            {evaluationResult.reasoning}
          </p>

          <div className="mt-3 pt-2 border-t border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              Accepted Trade-Offs:
            </span>
            <ul className="list-disc list-inside mt-1 text-xs font-mono text-zinc-400 space-y-0.5">
              {evaluationResult.tradeOffs.map((to, i) => (
                <li key={i}>{to}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skills Demonstrated */}
        <div className="bg-zinc-900/70 border border-zinc-800 p-3">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">
            Engineering Competencies Demonstrated:
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {evaluationResult.skillsDemonstrated.map((skill, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Code & Architecture References */}
        {scenario && scenario.codeReferences.length > 0 && (
          <div className="bg-zinc-900/70 border border-zinc-800 p-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-zinc-400" />
              Verified Codebase Implementations:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {scenario.codeReferences.map((ref, i) => (
                <div
                  key={i}
                  className="p-2 bg-zinc-950 border border-zinc-800 text-xs font-mono"
                >
                  <div className="font-bold text-zinc-200">{ref.title}</div>
                  <div className="text-[10px] text-zinc-500">{ref.file}</div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {ref.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-zinc-800">
        {nextTrial ? (
          <button
            onClick={() => {
              worldSound.playClick();
              startTrial(nextTrial.id);
            }}
            className="w-full sm:flex-1 py-3 text-xs font-silkscreen font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <span>PROCEED TO NEXT TRIAL: {nextTrial.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              worldSound.playClick();
              openTerminal();
            }}
            className="w-full sm:flex-1 py-3 text-xs font-silkscreen font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>RETURN TO OPERATIONS TERMINAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => {
            worldSound.playClick();
            resetTrial();
            onClose();
          }}
          className="w-full sm:w-auto px-4 py-3 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

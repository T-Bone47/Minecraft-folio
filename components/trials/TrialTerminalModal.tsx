"use client";

import React from "react";
import { useTrialsStore } from "@/state/trialsStore";
import { ALL_TRIALS } from "@/lib/trials/scenarioRegistry";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { worldSound } from "@/lib/audio";
import {
  Wrench,
  BrainCircuit,
  Server,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";

export function TrialTerminalModal({ onClose }: { onClose: () => void }) {
  const {
    guidanceMode,
    setGuidanceMode,
    startTrial,
    completedTrials,
    openDebrief,
  } = useTrialsStore();
  const { openStationModal } = useInteractionRegistry();

  const completedCount = Object.keys(completedTrials).length;
  const avgScore =
    completedCount > 0
      ? Math.round(
          Object.values(completedTrials).reduce((acc, r) => acc + r.scorePct, 0) /
            completedCount
        )
      : 0;

  return (
    <div className="text-zinc-100 font-sans max-h-[82vh] overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 inline-block" />
            <h2 className="font-silkscreen text-lg text-zinc-100 font-bold tracking-wide">
              FRONTIER ENGINEERING TRIALS
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Operational Engineering Challenges Across Motorsport, AI & Distributed Systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="bg-zinc-900 border border-zinc-800 p-0.5 flex text-[11px] font-mono">
            <button
              onClick={() => {
                worldSound.playClick();
                setGuidanceMode("guided");
              }}
              className={`px-2.5 py-1 transition-all ${
                guidanceMode === "guided"
                  ? "bg-red-600 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              GUIDED MODE
            </button>
            <button
              onClick={() => {
                worldSound.playClick();
                setGuidanceMode("independent");
              }}
              className={`px-2.5 py-1 transition-all ${
                guidanceMode === "independent"
                  ? "bg-red-600 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              INDEPENDENT MODE
            </button>
          </div>
        </div>
      </div>

      {/* Overview & Quick Recruiter Option */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="bg-zinc-900/80 border border-zinc-800 p-3">
          <div className="text-[10px] text-zinc-500 font-mono">CAMPUS READINESS</div>
          <div className="text-xl font-silkscreen font-bold text-zinc-200 mt-1">
            {completedCount} / 3 <span className="text-xs font-mono text-zinc-400 font-normal">TRIALS SOLVED</span>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3">
          <div className="text-[10px] text-zinc-500 font-mono">AVG RUBRIC SCORE</div>
          <div className="text-xl font-silkscreen font-bold text-emerald-400 mt-1">
            {avgScore}% <span className="text-xs font-mono text-zinc-400 font-normal">PROFICIENCY</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-950/40 to-zinc-900 border border-red-900/60 p-3 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-red-400 font-mono font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-red-400" /> RECRUITER FAST-TRACK
            </div>
            <div className="text-xs text-zinc-300 mt-1">
              Watch an end-to-end engineering trial solved in &lt; 60 seconds.
            </div>
          </div>
          <button
            onClick={() => {
              worldSound.playClick();
              openStationModal("recruiter_walkthrough");
            }}
            className="mt-2 text-[11px] font-silkscreen font-bold bg-red-600/90 hover:bg-red-600 text-white py-1 px-2 border border-red-500 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>WATCH FAST-TRACK DEMO</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Trial Divisions Cards */}
      <div className="space-y-3 mb-4">
        {ALL_TRIALS.map((trial, idx) => {
          const completedResult = completedTrials[trial.id];
          const isResolved = completedResult?.status === "RESOLVED";

          return (
            <div
              key={trial.id}
              className={`p-4 border transition-all ${
                isResolved
                  ? "bg-zinc-900/90 border-emerald-500/50"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 mt-0.5 border ${
                      trial.division === "race_performance"
                        ? "bg-red-950/40 border-red-800/80 text-red-400"
                        : trial.division === "ml_reliability"
                        ? "bg-cyan-950/40 border-cyan-800/80 text-cyan-400"
                        : "bg-emerald-950/40 border-emerald-800/80 text-emerald-400"
                    }`}
                  >
                    {trial.division === "race_performance" ? (
                      <Wrench className="w-5 h-5" />
                    ) : trial.division === "ml_reliability" ? (
                      <BrainCircuit className="w-5 h-5" />
                    ) : (
                      <Server className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-400 uppercase">
                        DIVISION 0{idx + 1} {"//"} {trial.division.replace("_", " ")}
                      </span>
                      {completedResult && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 border flex items-center gap-1 ${
                            isResolved
                              ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                              : "bg-amber-950 text-amber-300 border-amber-600"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {completedResult.status} ({completedResult.scorePct}%)
                        </span>
                      )}
                    </div>

                    <h3 className="font-silkscreen text-base font-bold text-zinc-100 mt-1">
                      {trial.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {trial.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-400 font-mono">
                      <span>
                        Lead: <strong className="text-zinc-200">{trial.npc.name}</strong> ({trial.npc.role})
                      </span>
                      <span>•</span>
                      <span>Facility: {trial.locationName}</span>
                      <span>•</span>
                      <span>Est: ~{trial.estimatedMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {completedResult ? (
                    <>
                      <button
                        onClick={() => {
                          worldSound.playInspect();
                          useTrialsStore.setState({
                            evaluationResult: completedResult,
                            activeTrialId: trial.id,
                          });
                          openDebrief();
                        }}
                        className="px-3 py-2 text-xs font-silkscreen bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                      >
                        VIEW DEBRIEF
                      </button>
                      <button
                        onClick={() => {
                          worldSound.playClick();
                          startTrial(trial.id);
                        }}
                        className="p-2 text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                        title="Replay Trial"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        worldSound.playClick();
                        startTrial(trial.id);
                      }}
                      className="px-4 py-2 text-xs font-silkscreen font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-all flex items-center gap-1.5 shadow-md shadow-red-950/50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>START TRIAL</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 p-3 text-[11px] font-mono text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Trials run in live client simulation; no fake static mocks.</span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-200 uppercase tracking-wider text-[10px]"
        >
          [ESC] RETURN TO CAMPUS
        </button>
      </div>
    </div>
  );
}

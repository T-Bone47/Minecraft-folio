/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Mission Director & Interactive Campus Stepper
 */

"use client";

import React from "react";
import { useRoleForgeStore } from "@/state/roleforgeStore";
import { useMultiverseStore } from "@/state/multiverseStore";
import type { MultiverseProjectId } from "@/lib/multiverse/projectTypes";

export const MissionDirector: React.FC = () => {
  const {
    compiledMission,
    activeStepIndex,
    goToStep,
    nextStep,
    prevStep,
    startMission,
    generateBrief,
  } = useRoleForgeStore();

  const { openPortal } = useMultiverseStore();

  if (!compiledMission || compiledMission.steps.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500 font-mono text-xs">
        No active mission compiled. Please select a role or paste a job description.
      </div>
    );
  }

  const steps = compiledMission.steps;
  const currentStep = steps[activeStepIndex] || steps[0];
  const guide = compiledMission.assignedGuideNpc;

  const handleLaunchDemonstration = (step: typeof currentStep) => {
    if (step.projectId && step.projectId !== "world") {
      openPortal(step.projectId as MultiverseProjectId, "demo");
    } else if (step.fallbackRoute) {
      window.open(step.fallbackRoute, "_blank");
    }
  };

  const handleLaunchTrial = (trialId?: string) => {
    if (!trialId) return;
    // Launch trial modal or route
    window.location.href = `/?trial=${trialId}`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Guide NPC Introduction */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
            {guide.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">{guide.name}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-cyan-300 border border-zinc-700">
                {guide.facilityId.toUpperCase()} FACILITY
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">{guide.role}</div>
            <div className="text-xs text-zinc-300 italic mt-0.5">&ldquo;{guide.introduction}&rdquo;</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono self-end sm:self-center">
          <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300">
            {compiledMission.totalDurationSeconds}s Total Time
          </span>
          <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            {steps.length} Campus Waypoints
          </span>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(idx)}
              className={`px-3 py-1.5 rounded text-[11px] font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[140px]">{step.facilityId.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Current Step Spotlight Card */}
      <div className="bg-zinc-900/60 border border-cyan-500/30 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-zinc-800 pb-2">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              WAYPOINT {currentStep.stepIndex} OF {steps.length} · {currentStep.facilityId.toUpperCase()} FACILITY
            </div>
            <h4 className="text-base font-bold text-white font-mono mt-0.5">
              {currentStep.title}
            </h4>
          </div>

          <div className="text-[10px] font-mono text-zinc-500">
            Coords: [{currentStep.coordinates.join(", ")}] · ~{currentStep.estimatedDurationSeconds}s
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed font-mono">
          {currentStep.roleExplanation}
        </p>

        <div className="bg-black/40 p-2.5 rounded border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1">
          <div>
            <strong className="text-zinc-300">Route:</strong> {currentStep.routeDescription}
          </div>
          <div>
            <strong className="text-zinc-300">Evidence Covered:</strong> {currentStep.coveredRequirementIds.length} requirement(s) addressed in this stage.
          </div>
        </div>

        {/* Action Buttons for Current Step */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLaunchDemonstration(currentStep)}
              className="px-3.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30 transition-colors flex items-center gap-1.5"
            >
              <span>⚡</span> INSPECT CODE & DEMO
            </button>

            {currentStep.trialChallengeId && (
              <button
                type="button"
                onClick={() => handleLaunchTrial(currentStep.trialChallengeId)}
                className="px-3.5 py-1.5 rounded bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-mono font-bold border border-red-500/40 transition-colors flex items-center gap-1.5"
              >
                <span>🎯</span> CHALLENGE MY ENGINEERING
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeStepIndex === 0}
              onClick={prevStep}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-xs font-mono text-zinc-300"
            >
              ← PREV
            </button>
            {activeStepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold"
              >
                NEXT WAYPOINT →
              </button>
            ) : (
              <button
                type="button"
                onClick={generateBrief}
                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold"
              >
                COMPILE BRIEF →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={startMission}
          className="w-full sm:w-auto px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2"
        >
          <span>🚀</span> START 3D CAMPUS WALKTHROUGH WITH {guide.name.toUpperCase()}
        </button>
      </div>
    </div>
  );
};


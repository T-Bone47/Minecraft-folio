/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * RoleForge HUD Pill & In-World Controller
 */

"use client";

import React, { useEffect, useCallback } from "react";
import { useRoleForgeStore } from "@/state/roleforgeStore";
import { gameplayBlocked, typingTarget } from "@/lib/frontier/input";
import { Target, CheckCircle2, ArrowRight } from "lucide-react";

export function RoleForgeHUD() {
  const isOpen = useRoleForgeStore((s) => s.isOpen);
  const openTerminal = useRoleForgeStore((s) => s.openTerminal);
  const closeTerminal = useRoleForgeStore((s) => s.closeTerminal);
  const compiledMission = useRoleForgeStore((s) => s.compiledMission);
  const activeStepIndex = useRoleForgeStore((s) => s.activeStepIndex);
  const missionStatus = useRoleForgeStore((s) => s.missionStatus);
  const nextStep = useRoleForgeStore((s) => s.nextStep);

  // Global KeyR listener to toggle RoleForge Terminal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyR" || e.key === "r" || e.key === "R") {
        if (typingTarget(e.target)) return;
        if (gameplayBlocked() && !isOpen) return;

        e.preventDefault();
        if (isOpen) {
          closeTerminal();
        } else {
          openTerminal("presets");
        }
      }
    },
    [isOpen, closeTerminal, openTerminal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentStep = compiledMission?.steps[activeStepIndex];

  return (
    <div
      data-testid="roleforge-hud-container"
      className="fixed top-32 left-4 z-40 flex flex-col items-start gap-2 font-mono select-none pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-cyan-500/40 bg-slate-950/85 backdrop-blur-md shadow-lg shadow-cyan-950/50">
        {/* Toggle RoleForge Terminal */}
        <button
          onClick={() => {
            if (isOpen) closeTerminal();
            else openTerminal("presets");
          }}
          data-testid="roleforge-hud-button"
          aria-label={isOpen ? "Close RoleForge Terminal" : "Open RoleForge Terminal"}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
            isOpen
              ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
              : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <Target className={`w-3.5 h-3.5 ${isOpen ? "text-cyan-400 animate-spin" : "text-cyan-400"}`} />
          <span>ROLEFORGE</span>
          <kbd className="text-[10px] px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">
            R
          </kbd>
        </button>

        {/* If mission is active, show fast-advance button */}
        {missionStatus === "ACTIVE" && currentStep && (
          <button
            onClick={() => nextStep()}
            title="Advance to next campus waypoint"
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-cyan-300 hover:bg-slate-900 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[11px]">NEXT WP</span>
          </button>
        )}
      </div>

      {/* Active Mission HUD Pill */}
      {missionStatus === "ACTIVE" && currentStep && (
        <div
          onClick={() => openTerminal("mission")}
          className="cursor-pointer px-3 py-1.5 rounded bg-cyan-950/90 border border-cyan-500/60 text-[10px] text-cyan-300 flex items-center gap-2 shadow-lg shadow-cyan-950/40 animate-pulse"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>
            STEP {currentStep.stepIndex}/{compiledMission?.steps.length}: {currentStep.facilityId.toUpperCase()} ({currentStep.title.split("—")[0]})
          </span>
        </div>
      )}
    </div>
  );
}


/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Arena HUD Pill & In-World Controller
 */

"use client";

import React, { useEffect, useCallback } from "react";
import { useDefenseStore } from "@/state/defenseStore";
import { gameplayBlocked, typingTarget } from "@/lib/frontier/input";
import { ShieldAlert } from "lucide-react";

export function DefenseHUD() {
  const isOpen = useDefenseStore((s) => s.isOpen);
  const openArena = useDefenseStore((s) => s.openArena);
  const closeArena = useDefenseStore((s) => s.closeArena);

  // Global KeyD listener to toggle Defense Arena
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyD" || e.key === "d" || e.key === "D") {
        if (typingTarget(e.target)) return;
        if (gameplayBlocked() && !isOpen) return;

        e.preventDefault();
        if (isOpen) {
          closeArena();
        } else {
          openArena("systems-reliability", "briefing");
        }
      }
    },
    [isOpen, closeArena, openArena]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      data-testid="defense-hud-container"
      className="fixed top-44 left-4 z-40 flex flex-col items-start gap-2 font-mono select-none pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-red-500/40 bg-slate-950/85 backdrop-blur-md shadow-lg shadow-red-950/50">
        <button
          onClick={() => {
            if (isOpen) closeArena();
            else openArena("systems-reliability", "briefing");
          }}
          data-testid="defense-hud-button"
          aria-label={isOpen ? "Close Defense Arena" : "Open Defense Arena"}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
            isOpen
              ? "bg-red-500/25 text-red-300 border border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.3)]"
              : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <ShieldAlert className={`w-3.5 h-3.5 ${isOpen ? "text-red-400 animate-pulse" : "text-red-400"}`} />
          <span>DEFENSE</span>
          <kbd className="text-[10px] px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">
            D
          </kbd>
        </button>
      </div>
    </div>
  );
}

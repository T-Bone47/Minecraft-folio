"use client";

import React, { useEffect, useCallback } from "react";
import { useMultiverseStore } from "@/state/multiverseStore";
import { useWorldStore } from "@/state/worldStore";
import { gameplayBlocked, typingTarget } from "@/lib/frontier/input";
import { Globe, Compass, ExternalLink } from "lucide-react";

export function MultiverseHUD() {
  const activePortalId = useMultiverseStore((s) => s.activePortalId);
  const openPortal = useMultiverseStore((s) => s.openPortal);
  const closePortal = useMultiverseStore((s) => s.closePortal);
  const isLaunchBayActive = useMultiverseStore((s) => s.isLaunchBayActive);
  const setPlayerPosition = useWorldStore((s) => s.setPlayerPosition);

  // Global KeyM listener to toggle Multiverse Modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyM" || e.key === "m" || e.key === "M") {
        if (typingTarget(e.target)) return;
        if (gameplayBlocked() && !activePortalId) return;

        e.preventDefault();
        if (activePortalId) {
          closePortal();
        } else {
          openPortal("racemind", "demo");
        }
      }
    },
    [activePortalId, closePortal, openPortal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleFastTravelToLaunchBay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Launch Bay entrance is at [0, 1.65, -23] looking north towards [0, 0, -32]
    setPlayerPosition([0, 1.65, -23]);
  };

  return (
    <div
      data-testid="multiverse-hud-container"
      className="fixed top-20 left-4 z-40 flex flex-col items-start gap-2 font-mono select-none pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-sky-500/30 bg-slate-950/80 backdrop-blur-md shadow-lg shadow-sky-950/40">
        {/* Toggle Multiverse Directory */}
        <button
          onClick={() => {
            if (activePortalId) closePortal();
            else openPortal("racemind", "demo");
          }}
          data-testid="multiverse-hud-button"
          aria-label={activePortalId ? "Close Multiverse Portals" : "Open Multiverse Portals"}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
            activePortalId
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/60 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
          }`}
        >
          <Globe className={`w-3.5 h-3.5 ${activePortalId ? "text-sky-400 animate-spin" : "text-sky-500"}`} />
          <span>MULTIVERSE</span>
          <kbd className="text-[10px] px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">
            M
          </kbd>
        </button>

        {/* Teleport to Launch Bay */}
        <button
          onClick={handleFastTravelToLaunchBay}
          data-testid="multiverse-teleport-button"
          title="Teleport to Project Launch Bay (FAC-06)"
          className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-slate-400 hover:text-sky-300 hover:bg-slate-900 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline text-[11px]">LAUNCH BAY</span>
        </button>
      </div>

      {/* In-World Presence Badge when inside Launch Bay */}
      {isLaunchBayActive && (
        <div className="px-2.5 py-1 rounded bg-sky-950/80 border border-sky-500/50 text-[10px] text-sky-300 flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>PROJECT LAUNCH BAY (4 PORTALS ACTIVE)</span>
        </div>
      )}
    </div>
  );
}


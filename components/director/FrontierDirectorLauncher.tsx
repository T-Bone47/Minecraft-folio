"use client";

import React, { useEffect } from "react";
import { Play, Shield, Compass, Sparkles, ChevronDown } from "lucide-react";
import { useFrontierDirectorStore } from "@/state/frontierDirectorStore";

export function FrontierDirectorLauncher() {
  const {
    openExperienceModal,
    openEvidence,
    currentMode,
    isInspectorOpen,
    isExperienceModalOpen,
  } = useFrontierDirectorStore();

  // Listen to keyboard shortcut [P] to open the showcase / evidence launcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "p" || e.key === "P") {
        if (isInspectorOpen || isExperienceModalOpen) return;
        e.preventDefault();
        openExperienceModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openExperienceModal, isInspectorOpen, isExperienceModalOpen]);

  // Don't render launcher if already inside modal or inspector
  if (isInspectorOpen || isExperienceModalOpen) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-[60] flex items-center gap-1.5 font-sans pointer-events-auto">
      <div className="flex items-center bg-[#171A20]/90 backdrop-blur-md border border-[#C8CDD2]/30 rounded-xl p-1 shadow-2xl">
        {/* Main Launcher Button */}
        <button
          onClick={openExperienceModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D71D35] hover:bg-[#b01428] text-white font-mono text-xs font-bold transition-all shadow-md group"
          title="Open Frontier Director 2.0 Engineering Showcases (Key: P)"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>FRONTIER DIRECTOR</span>
          <span className="hidden md:inline-block bg-black/30 px-1 py-0.2 rounded text-[10px] font-normal text-white/90">
            P
          </span>
        </button>

        {/* Quick Proof Mode Button */}
        <button
          onClick={() => openEvidence("motorsport", "problem")}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-[#22D3EE] hover:bg-white/5 font-mono text-xs transition-colors"
          title="Directly inspect 6-layer engineering proof"
        >
          <Shield className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span className="hidden sm:inline">PROOF MODE</span>
        </button>
      </div>
    </div>
  );
}


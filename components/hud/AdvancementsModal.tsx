"use client";

import React, { useEffect } from "react";
import { useAdvancementStore, ADVANCEMENTS, type Advancement } from "@/state/advancementStore";
import { worldSound } from "@/lib/audio";
import { Trophy, CheckCircle2, Lock, X } from "lucide-react";

export const AdvancementsModal: React.FC = () => {
  const isModalOpen = useAdvancementStore((s) => s.isModalOpen);
  const closeModal = useAdvancementStore((s) => s.closeModal);
  const unlockedIds = useAdvancementStore((s) => s.unlockedIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      } else if ((e.key === "l" || e.key === "L") && !e.ctrlKey && !e.metaKey) {
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        ) {
          return;
        }
        if (isModalOpen) closeModal();
        else useAdvancementStore.getState().openModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const allAdvancements = Object.values(ADVANCEMENTS);
  const unlockedCount = unlockedIds.length;
  const totalCount = allAdvancements.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-zinc-950 border-4 border-zinc-700 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header Bar styled like Minecraft Menu */}
        <div className="bg-zinc-900 border-b-2 border-zinc-800 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-pixel text-sm text-amber-300 drop-shadow">
                ENGINEERING ADVANCEMENTS
              </h2>
              <span className="text-[11px] font-mono text-zinc-400">
                CAMPUS EXPLORATION & TECHNICAL MASTERY
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              worldSound.playClick();
              closeModal();
            }}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border border-zinc-700"
            aria-label="Close advancements"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="bg-zinc-900/60 p-3 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-zinc-300">PROGRESS</span>
              <span className="text-amber-400 font-bold">
                {unlockedCount} / {totalCount} UNLOCKED ({progressPct}%)
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-800 border border-zinc-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Advancements List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {allAdvancements.map((adv) => {
            const isUnlocked = unlockedIds.includes(adv.id);

            return (
              <div
                key={adv.id}
                className={`p-3 border flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? "bg-zinc-900/90 border-amber-400/80 shadow-md"
                    : "bg-zinc-950/70 border-zinc-800 opacity-60"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 border-2 flex items-center justify-center shrink-0 text-2xl ${
                    isUnlocked
                      ? "bg-amber-950/60 border-amber-400 text-amber-200"
                      : "bg-zinc-900 border-zinc-700 text-zinc-600 grayscale"
                  }`}
                >
                  {adv.icon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-pixel text-xs text-white">
                      {adv.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 border ${
                        isUnlocked
                          ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800"
                      }`}
                    >
                      {adv.category}
                    </span>
                  </div>
                  <p className="text-[12px] font-mono text-zinc-300">
                    {adv.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0">
                  {isUnlocked ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-pixel text-[10px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>DONE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-zinc-500 font-pixel text-[10px]">
                      <Lock className="w-4 h-4 text-zinc-600" />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-2.5 text-center text-[10px] font-mono text-zinc-400">
          Press <kbd className="px-1 bg-zinc-800 border border-zinc-700 text-amber-300">L</kbd> to toggle advancements anytime
        </div>
      </div>
    </div>
  );
};


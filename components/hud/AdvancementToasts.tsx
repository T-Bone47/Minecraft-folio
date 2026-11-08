"use client";

import React from "react";
import { useAdvancementStore } from "@/state/advancementStore";
import { Award, X } from "lucide-react";

export const AdvancementToasts: React.FC = () => {
  const activeToast = useAdvancementStore((s) => s.activeToast);
  const dismissToast = useAdvancementStore((s) => s.dismissToast);
  const openModal = useAdvancementStore((s) => s.openModal);

  if (!activeToast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 pointer-events-auto animate-slide-left max-w-sm">
      <div
        onClick={() => {
          openModal();
          dismissToast();
        }}
        className="bg-zinc-950/95 border-2 border-amber-400 p-2.5 shadow-2xl flex items-center gap-3 cursor-pointer hover:border-amber-300 transition-colors"
      >
        {/* Recessed Icon Container */}
        <div className="w-11 h-11 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shrink-0 text-2xl shadow-inner">
          {activeToast.icon}
        </div>

        {/* Text Container */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-pixel text-[10px] text-amber-300 uppercase tracking-wider drop-shadow">
              Advancement Made!
            </span>
          </div>
          <div className="font-pixel text-xs text-white truncate drop-shadow">
            {activeToast.title}
          </div>
          <div className="text-[11px] font-mono text-zinc-300 leading-tight truncate">
            {activeToast.description}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissToast();
          }}
          className="text-zinc-500 hover:text-white p-1"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


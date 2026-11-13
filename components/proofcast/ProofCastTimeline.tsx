"use client";

import React from "react";
import { CheckCircle2, Play, Lock, Code, ShieldCheck } from "lucide-react";
import type { ProofCastBeat, ProofCastStory } from "@/lib/proofcast/types";

interface ProofCastTimelineProps {
  story: ProofCastStory;
  activeBeatIndex: number;
  onSelectBeat: (index: number) => void;
  onInspectBeat: (beat: ProofCastBeat) => void;
}

export function ProofCastTimeline({
  story,
  activeBeatIndex,
  onSelectBeat,
  onInspectBeat,
}: ProofCastTimelineProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400 px-1">
        <span>Story Chapters ({story.beats.length})</span>
        <span>Verified Evidence</span>
      </div>

      <div className="space-y-2">
        {story.beats.map((beat, idx) => {
          const isActive = idx === activeBeatIndex;
          const isPassed = idx < activeBeatIndex;

          return (
            <div
              key={beat.id}
              className={`p-3 rounded-lg border transition-all ${
                isActive
                  ? "bg-zinc-900/90 border-red-500/80 shadow-md shadow-red-950/30"
                  : isPassed
                  ? "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
                  : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => onSelectBeat(idx)}
                  className="flex-1 text-left flex items-start gap-3 group"
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                      isActive
                        ? "bg-red-600 text-white"
                        : isPassed
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                        : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div>
                    <div
                      className={`text-xs font-mono font-bold uppercase transition-colors ${
                        isActive
                          ? "text-red-400"
                          : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {beat.title}
                    </div>
                    <div className="text-xs font-mono text-zinc-400 line-clamp-1 mt-0.5">
                      {beat.subtitle}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {beat.keyMetric.value}
                  </span>
                  <button
                    onClick={() => onInspectBeat(beat)}
                    title="Inspect Implementation"
                    className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


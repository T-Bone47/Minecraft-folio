"use client";

import React from "react";
import { useTrialsStore } from "@/state/trialsStore";
import { ALL_TRIALS } from "@/lib/trials/scenarioRegistry";
import { worldSound } from "@/lib/audio";
import { Play, ArrowRight, X } from "lucide-react";

export function NPCDialogueModal({
  npcId,
  onClose,
}: {
  npcId: string;
  onClose: () => void;
}) {
  const { activeNPC, npcDialogueText, startTrial, completedTrials } =
    useTrialsStore();

  const trial = ALL_TRIALS.find((t) => t.npc.id === npcId);
  const npc = activeNPC || trial?.npc;
  if (!npc || !trial) return null;

  const completed = completedTrials[trial.id];
  const isRace = npc.avatarVariant === "race";
  const isAiml = npc.avatarVariant === "aiml";

  return (
    <div className="text-zinc-100 font-sans max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 flex items-center justify-center border font-silkscreen font-bold text-sm ${
              isRace
                ? "bg-red-950 border-red-700 text-red-200"
                : isAiml
                ? "bg-cyan-950 border-cyan-700 text-cyan-200"
                : "bg-emerald-950 border-emerald-700 text-emerald-200"
            }`}
          >
            {npc.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-silkscreen text-base font-bold text-zinc-100">
              {npc.name}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {npc.role} {"//"} {trial.locationName}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dialogue Content */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-4 mb-4">
        <p className="text-sm font-mono text-zinc-200 leading-relaxed">
          &ldquo;{npcDialogueText || npc.dialogue.briefing}&rdquo;
        </p>

        {completed && (
          <div className="mt-3 p-2 bg-emerald-950/40 border border-emerald-600 text-xs font-mono text-emerald-300">
            ✓ Trial previously resolved with {completed.scorePct}% rubric proficiency.
          </div>
        )}
      </div>

      {/* Trial Briefing Card */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 mb-4">
        <div className="text-[10px] font-mono text-zinc-500 uppercase">
          Associated Engineering Trial:
        </div>
        <div className="font-silkscreen text-sm text-zinc-200 font-bold mt-0.5">
          {trial.title}
        </div>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">
          {trial.subtitle}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            worldSound.playClick();
            startTrial(trial.id);
            onClose();
          }}
          className="flex-1 py-2.5 text-xs font-silkscreen font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{completed ? "RE-ENTER TRIAL" : "BEGIN TRIAL WORKBENCH"}</span>
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800"
        >
          RETURN
        </button>
      </div>
    </div>
  );
}

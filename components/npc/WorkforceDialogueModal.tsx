"use client";

import React from "react";
import { useNPCWorkforceStore } from "@/state/npcWorkforceStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useTrialsStore } from "@/state/trialsStore";
import { worldSound } from "@/lib/audio";
import {
  Wrench,
  Activity,
  Layers,
  CheckCircle2,
  Play,
  ArrowRight,
  X,
} from "lucide-react";

export function WorkforceDialogueModal({
  npcId,
  onClose,
}: {
  npcId: string;
  onClose: () => void;
}) {
  const { instances, activeDialogue, dismissInteraction } =
    useNPCWorkforceStore();
  const { openStationModal } = useInteractionRegistry();
  const { startTrial } = useTrialsStore();

  const instance = instances[npcId];
  if (!instance) return null;

  const def = instance.definition;
  const currentTask = def.schedule[instance.currentTaskIndex];

  const handleClose = () => {
    worldSound.playClick();
    dismissInteraction();
    onClose();
  };

  const isRace = def.role === "race_engineer";
  const isTech = def.role === "vehicle_technician";
  const isData = def.role === "data_engineer";
  const isSystems = def.role === "systems_technician";
  const isAI = def.role === "ai_researcher";

  return (
    <div className="text-zinc-100 font-sans max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 flex items-center justify-center border font-silkscreen font-bold text-sm ${
              isRace || isTech
                ? "bg-red-950 border-red-700 text-red-200"
                : isAI || isData
                ? "bg-cyan-950 border-cyan-700 text-cyan-200"
                : "bg-emerald-950 border-emerald-700 text-emerald-200"
            }`}
          >
            {def.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-silkscreen text-base font-bold text-zinc-100">
              {def.name}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {def.role.replace("_", " ").toUpperCase()} {"//"} {def.facility.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-zinc-500 hover:text-zinc-300 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Dialogue */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-4 mb-3">
        <p className="text-sm font-mono text-zinc-200 leading-relaxed">
          &ldquo;{activeDialogue || def.dialogue.ambient}&rdquo;
        </p>
      </div>

      {/* Current Task Station Indicator */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 mb-4 text-xs font-mono">
        <div className="text-[10px] text-zinc-500 uppercase">
          Assigned Engineering Station:
        </div>
        <div className="font-silkscreen text-zinc-200 font-bold mt-0.5">
          {currentTask ? currentTask.description : "Standard Operational Readiness"}
        </div>
        <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
          <span>Status:</span>
          <span className="text-emerald-400 font-bold uppercase">{instance.activity}</span>
          <span>•</span>
          <span>Prop: {instance.heldProp}</span>
        </div>
      </div>

      {/* Action Buttons based on Role */}
      <div className="space-y-2 mb-3">
        {isRace && (
          <>
            <button
              onClick={() => {
                worldSound.playClick();
                handleClose();
                startTrial("race_performance_01");
              }}
              className="w-full py-2.5 text-xs font-silkscreen font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START RACE TRIAL: &quot;THE MISSING FOUR TENTHS&quot;</span>
            </button>
            <button
              onClick={() => {
                worldSound.playInspect();
                handleClose();
                openStationModal("drive_debrief");
              }}
              className="w-full py-2 text-xs font-silkscreen bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>REVIEW TELEMETRY DEBRIEF</span>
            </button>
          </>
        )}

        {isTech && (
          <button
            onClick={() => {
              worldSound.playInspect();
              handleClose();
              openStationModal("f1_car_inspect");
            }}
            className="w-full py-2.5 text-xs font-silkscreen font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>INSPECT FRONTIER-01 CHASSIS & SUSPENSION</span>
          </button>
        )}

        {isAI && (
          <button
            onClick={() => {
              worldSound.playClick();
              handleClose();
              startTrial("ml_reliability_02");
            }}
            className="w-full py-2.5 text-xs font-silkscreen font-bold bg-cyan-700 hover:bg-cyan-600 text-white border border-cyan-500 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START AI TRIAL: &quot;THE MODEL THAT LOOKED PERFECT&quot;</span>
          </button>
        )}

        {isSystems && (
          <button
            onClick={() => {
              worldSound.playClick();
              handleClose();
              startTrial("systems_reliability_03");
            }}
            className="w-full py-2.5 text-xs font-silkscreen font-bold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START SYSTEMS TRIAL: &quot;THE BROKEN PIPELINE&quot;</span>
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        className="w-full py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800"
      >
        [ESC] RESUME ENGINEERING TASK
      </button>
    </div>
  );
}


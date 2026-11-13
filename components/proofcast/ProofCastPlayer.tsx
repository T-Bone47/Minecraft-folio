"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ProofCastPlaybackController,
} from "@/lib/proofcast/playbackController";
import { compileProofCastStory } from "@/lib/proofcast/storyCompiler";
import type {
  ProofCastRole,
  PresentationMode,
  PlaybackState,
  ProofCastBeat,
} from "@/lib/proofcast/types";
import { ProofCastControls } from "./ProofCastControls";
import { ProofCastTimeline } from "./ProofCastTimeline";
import { ProofCastEvidenceInspector } from "./ProofCastEvidenceInspector";
import {
  Activity,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

interface ProofCastPlayerProps {
  initialRole?: ProofCastRole;
  initialMode?: PresentationMode;
  autoPlay?: boolean;
}

export function ProofCastPlayer({
  initialRole = "motorsport",
  initialMode = "RECRUITER_60S",
  autoPlay = false,
}: ProofCastPlayerProps) {
  const [role, setRole] = useState<ProofCastRole>(initialRole);
  const [mode, setMode] = useState<PresentationMode>(initialMode);

  const story = useMemo(() => compileProofCastStory(role, mode), [role, mode]);

  const controller = useMemo(() => new ProofCastPlaybackController(story), [story]);

  const [playbackState, setPlaybackState] = useState<PlaybackState>(controller.getState());

  useEffect(() => {
    const unsubscribe = controller.subscribe((state) => {
      setPlaybackState(state);
    });
    if (autoPlay) {
      controller.play();
    }
    return () => {
      unsubscribe();
      controller.dispose();
    };
  }, [controller, autoPlay]);

  const activeBeat: ProofCastBeat = controller.getActiveBeat();

  return (
    <div className="w-full flex flex-col bg-zinc-950 border-4 border-[#262A31] shadow-2xl overflow-hidden text-zinc-100">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-[#191B20] border-b-2 border-zinc-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-red-500 border border-white/60 animate-pulse" />
          <span className="font-pixel text-xs tracking-wider uppercase text-white mc-text-shadow">
            FRONTIER PROOFCAST
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Interactive Engineering Documentary
          </span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {(["motorsport", "backend", "aiml", "data", "software"] as ProofCastRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 font-pixel text-[9px] uppercase transition-all ${
                role === r
                  ? "voxel-btn voxel-btn-redstone text-white"
                  : "voxel-btn voxel-btn-stone text-zinc-300 hover:text-white"
              }`}
            >
              {r === "aiml" ? "AI / ML" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cinematic Grid: Beat Display & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b-2 border-zinc-800 min-h-[460px]">
        {/* Left / Center: Cinematic Documentary Stage (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#101115] via-zinc-950 to-black relative overflow-hidden">
          {/* Ambient Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Chapter Metadata & Visual Tag */}
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 text-[10px] font-pixel uppercase bg-red-950/80 text-red-400 border border-red-800/60 mc-text-shadow">
                {activeBeat.chapterTitle}
              </span>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-red-400" />
                {activeBeat.visualTag}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-pixel text-white tracking-wide leading-tight mc-text-shadow">
                {activeBeat.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-[#00d2be] font-bold mt-1">
                {activeBeat.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-2xl mc-slot-box p-4 border-l-4 border-l-red-500">
              {activeBeat.narrative}
            </p>
          </div>

          {/* Mid Stage: Verified Metrics & Subsystem Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="p-4 mc-gui-box flex flex-col justify-between">
              <div className="text-[10px] font-pixel uppercase text-zinc-400 mb-1 flex items-center gap-1.5 mc-text-shadow">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                Architecture Subsystem
              </div>
              <div className="text-xs font-pixel text-white mc-text-shadow">{activeBeat.architectureStep.subsystem}</div>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                {activeBeat.architectureStep.description}
              </div>
            </div>

            <div className="p-4 mc-gui-box flex flex-col justify-between">
              <div className="text-[10px] font-pixel uppercase text-emerald-400 mb-1 flex items-center gap-1.5 mc-text-shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Invariant
              </div>
              <div className="text-lg font-pixel text-emerald-300 mc-text-shadow">
                {activeBeat.keyMetric.value}{" "}
                <span className="text-xs text-zinc-400 font-mono font-normal">
                  {activeBeat.keyMetric.unit || ""}
                </span>
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">{activeBeat.keyMetric.label}</div>
            </div>
          </div>

          {/* Stage Bottom: Quick Proof Banner with Direct Inspect Button */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-3 mc-slot-box border-red-900/40">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 truncate">
              <Code2 className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="truncate">{activeBeat.evidenceProof.filePath}</span>
            </div>

            <button
              onClick={() => controller.inspectBeat()}
              className="voxel-btn voxel-btn-redstone flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-pixel uppercase"
            >
              <span>Inspect Source Code</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Chapter Navigation Timeline (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-[#101115] border-t lg:border-t-0 lg:border-l-2 border-zinc-800 flex flex-col justify-between">
          <ProofCastTimeline
            story={story}
            activeBeatIndex={playbackState.activeBeatIndex}
            onSelectBeat={(idx) => controller.jumpToChapter(idx)}
            onInspectBeat={(beat) => controller.inspectBeat(beat)}
          />

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-500 flex items-center justify-between">
            <span>ProofCast 2.0 Reality Engine</span>
            <span>Deterministic 60 FPS</span>
          </div>
        </div>
      </div>

      {/* Transport Controls Bar */}
      <ProofCastControls
        story={story}
        playbackState={playbackState}
        onTogglePlay={() => controller.togglePlay()}
        onSeek={(sec) => controller.seek(sec)}
        onJumpChapter={(idx) => controller.jumpToChapter(idx)}
        onSetSpeed={(s) => controller.setSpeed(s)}
        onSetMode={(m) => setMode(m)}
        onInspect={() => controller.inspectBeat()}
      />

      {/* Inspector Modal */}
      {playbackState.isInspecting && playbackState.inspectedBeat && (
        <ProofCastEvidenceInspector
          beat={playbackState.inspectedBeat}
          onClose={() => controller.closeInspection()}
          onResume={() => {
            controller.closeInspection();
            controller.play();
          }}
        />
      )}
    </div>
  );
}


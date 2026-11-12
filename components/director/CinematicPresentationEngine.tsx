"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Shield,
  FastForward,
  ChevronRight,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useFrontierDirectorStore } from "@/state/frontierDirectorStore";
import { getExperienceById } from "@/lib/frontierDirector/experienceRegistry";
import { useCameraStore } from "@/state/cameraStore";
import { useWorldStore } from "@/state/worldStore";

export function CinematicPresentationEngine() {
  const {
    currentMode,
    activeExperienceId,
    activeStepIndex,
    isPlaying,
    playbackSpeed,
    stepShowcase,
    skipShowcase,
    enterExploration,
    togglePlayback,
    setPlaybackSpeed,
  } = useFrontierDirectorStore();

  const expId = activeExperienceId || "motorsport";
  const experience = getExperienceById(expId);
  const activeStep = experience?.presentationSteps[activeStepIndex];

  const [stepElapsed, setStepElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync camera transform whenever active step changes
  useEffect(() => {
    if (currentMode !== "showcase" || !activeStep) return;

    const { position, target } = activeStep.cameraShot;
    const cameraStore = useCameraStore.getState();
    cameraStore.setCameraMode("cinematic");
    cameraStore.setTargetTransform(position, target);
    cameraStore.setTransitioning(true);

    // Reset step elapsed timer
    setStepElapsed(0);
  }, [currentMode, activeStepIndex, activeStep]);

  // Timer loop for auto-advancing showcase steps
  useEffect(() => {
    if (currentMode !== "showcase" || !isPlaying || !activeStep) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 100;
    timerRef.current = setInterval(() => {
      setStepElapsed((prev) => {
        const next = prev + (intervalMs / 1000) * playbackSpeed;
        if (next >= activeStep.durationSec) {
          // If last step, auto-open proof inspector
          if (
            experience &&
            activeStepIndex >= experience.presentationSteps.length - 1
          ) {
            skipShowcase(activeStep.associatedEvidenceLayer);
            return 0;
          } else {
            // Advance to next step
            stepShowcase(activeStepIndex + 1);
            return 0;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    currentMode,
    isPlaying,
    playbackSpeed,
    activeStep,
    activeStepIndex,
    experience,
    stepShowcase,
    skipShowcase,
  ]);

  if (currentMode !== "showcase" || !experience || !activeStep) {
    return null;
  }

  const progressPercent = Math.min(
    100,
    (stepElapsed / activeStep.durationSec) * 100
  );
  const totalSteps = experience.presentationSteps.length;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Status Bar */}
      <header className="flex items-center justify-between pointer-events-auto bg-[#171A20]/90 backdrop-blur-md border border-[#C8CDD2]/30 rounded-xl px-4 py-2.5 max-w-4xl mx-auto w-full shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[#D71D35] animate-pulse" />
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-bold text-white uppercase tracking-wider">
              {experience.badge}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">
              STEP {activeStepIndex + 1} OF {totalSteps}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <button
            onClick={() => {
              const speeds: (1 | 1.5 | 2)[] = [1, 1.5, 2];
              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              setPlaybackSpeed(speeds[nextIdx]);
            }}
            className="px-2 py-1 rounded bg-[#121418] hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono border border-zinc-700 transition-colors"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>

          {/* Jump to Proof */}
          <button
            onClick={() => skipShowcase(activeStep.associatedEvidenceLayer)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 text-[#22D3EE] border border-[#22D3EE]/30 transition-colors font-bold"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>INSPECT PROOF</span>
          </button>

          {/* Exit to Campus */}
          <button
            onClick={enterExploration}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Exit Showcase and Explore Campus (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Center Camera Overlay / Vignette */}
      <div className="flex-1" />

      {/* Lower Third Cinematic Narrative Card */}
      <div className="pointer-events-auto max-w-4xl mx-auto w-full space-y-2">
        <div className="bg-[#171A20]/95 backdrop-blur-md border border-[#C8CDD2]/35 rounded-xl p-4 sm:p-6 shadow-2xl space-y-3.5 text-[#C8CDD2]">
          {/* Phase Badge & Hook */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#D71D35] text-white">
                {activeStep.phase.toUpperCase()}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeStep.title}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {Math.ceil(activeStep.durationSec - stepElapsed)}s remaining
            </span>
          </div>

          {/* Hook Headline */}
          <div className="text-sm sm:text-base font-semibold text-[#22D3EE] leading-snug">
            &ldquo;{activeStep.hook}&rdquo;
          </div>

          {/* Narrative Body */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            {activeStep.narrative}
          </p>

          {/* Technical Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 font-mono text-xs text-zinc-300">
            {activeStep.technicalDetails.map((detail, idx) => (
              <div
                key={idx}
                className="bg-[#121418] border border-zinc-800/80 rounded p-2 flex items-start gap-1.5 text-[11px]"
              >
                <span className="text-[#22D3EE] select-none">›</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>

          {/* Step Progress Bar */}
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D71D35] transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-zinc-800/80 text-xs font-mono">
            <div className="flex items-center gap-2">
              {/* Prev Button */}
              <button
                disabled={activeStepIndex === 0}
                onClick={() => stepShowcase(Math.max(0, activeStepIndex - 1))}
                className="p-1.5 rounded bg-[#121418] hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-zinc-700 transition-colors"
                title="Previous step"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlayback}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#D71D35] hover:bg-[#b01428] text-white font-bold shadow transition-colors"
                title={isPlaying ? "Pause presentation" : "Resume presentation"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlaying ? "PAUSE" : "RESUME"}</span>
              </button>

              {/* Next Button */}
              <button
                disabled={activeStepIndex >= totalSteps - 1}
                onClick={() => stepShowcase(Math.min(totalSteps - 1, activeStepIndex + 1))}
                className="p-1.5 rounded bg-[#121418] hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-zinc-700 transition-colors"
                title="Next step"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Skip to Proof Button */}
            <button
              onClick={() => skipShowcase(activeStep.associatedEvidenceLayer)}
              className="flex items-center gap-1 text-white hover:text-[#22D3EE] transition-colors"
            >
              <span>SKIP TO EVIDENCE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

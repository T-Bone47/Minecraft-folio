"use client";

import React from "react";
import { Play, Pause, SkipBack, SkipForward, Code2, Gauge, Clock } from "lucide-react";
import type { PlaybackState, ProofCastStory, PresentationMode } from "@/lib/proofcast/types";

interface ProofCastControlsProps {
  story: ProofCastStory;
  playbackState: PlaybackState;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onJumpChapter: (chapterIndex: number) => void;
  onSetSpeed: (speed: number) => void;
  onSetMode: (mode: PresentationMode) => void;
  onInspect: () => void;
}

export function ProofCastControls({
  story,
  playbackState,
  onTogglePlay,
  onSeek,
  onJumpChapter,
  onSetSpeed,
  onSetMode,
  onInspect,
}: ProofCastControlsProps) {
  const { currentTime, isPlaying, activeBeatIndex, playbackSpeed, mode } = playbackState;
  const total = story.totalDurationSeconds;
  const progressPct = total > 0 ? (currentTime / total) * 100 : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="w-full bg-zinc-950/95 border-t border-zinc-800 p-4 sm:p-5 rounded-b-xl text-zinc-200">
      {/* Chapter Marker Scrubber */}
      <div className="relative mb-4">
        {/* Visual Chapter Dividers */}
        <div className="absolute inset-x-0 -top-2 flex justify-between pointer-events-none px-1">
          {story.beats.map((beat, idx) => {
            const beatPct = (beat.timestampStart / total) * 100;
            const isActive = idx === activeBeatIndex;
            return (
              <div
                key={beat.id}
                style={{ left: `${beatPct}%` }}
                className={`absolute w-1.5 h-3 -translate-x-1/2 rounded-full transition-colors ${
                  isActive ? "bg-red-500 ring-2 ring-red-400" : "bg-zinc-700"
                }`}
                title={`${beat.chapterTitle}: ${beat.title}`}
              />
            );
          })}
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={total}
          step={0.1}
          value={currentTime}
          onChange={handleSeekChange}
          aria-label="Seek timeline"
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none"
        />

        {/* Time Indicators */}
        <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mt-1.5">
          <span>{formatTime(currentTime)}</span>
          <span className="text-zinc-500 uppercase">
            Chapter {activeBeatIndex + 1} of {story.beats.length}
          </span>
          <span>{formatTime(total)}</span>
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Transport Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onJumpChapter(Math.max(0, activeBeatIndex - 1))}
            disabled={activeBeatIndex === 0}
            aria-label="Previous chapter"
            className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
          >
            <SkipBack className="w-4 h-4 text-zinc-300" />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-mono font-bold uppercase transition-colors shadow-lg shadow-red-950/50"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => onJumpChapter(Math.min(story.beats.length - 1, activeBeatIndex + 1))}
            disabled={activeBeatIndex === story.beats.length - 1}
            aria-label="Next chapter"
            className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
          >
            <SkipForward className="w-4 h-4 text-zinc-300" />
          </button>

          {/* Inspect Implementation Button */}
          <button
            onClick={onInspect}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-zinc-900 border border-red-500/40 hover:border-red-500 hover:bg-red-950/30 text-red-400 text-xs font-mono font-bold uppercase transition-colors"
          >
            <Code2 className="w-4 h-4" />
            <span>Inspect Code</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 border border-zinc-800 rounded text-xs font-mono">
          <span className="text-zinc-500 px-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Format:
          </span>
          <button
            onClick={() => onSetMode("RECRUITER_60S")}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === "RECRUITER_60S"
                ? "bg-red-600 text-white font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            60s Recruiter
          </button>
          <button
            onClick={() => onSetMode("SHOWCASE_3M")}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === "SHOWCASE_3M"
                ? "bg-red-600 text-white font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            3m Deep Dive
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <Gauge className="w-3.5 h-3.5 text-zinc-500" />
          {[1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                playbackSpeed === s
                  ? "bg-zinc-800 border-red-500 text-red-400 font-bold"
                  : "border-zinc-800 hover:bg-zinc-900 text-zinc-400"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


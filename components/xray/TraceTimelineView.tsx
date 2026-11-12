"use client";

import React, { useEffect } from "react";
import { useXRayStore } from "@/state/xrayStore";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Clock, FastForward } from "lucide-react";

export const TraceTimelineView: React.FC = () => {
  const trace = useXRayStore((s) => s.currentTrace);
  const timelineIndex = useXRayStore((s) => s.timelineIndex);
  const playbackState = useXRayStore((s) => s.playbackState);
  const playbackSpeed = useXRayStore((s) => s.playbackSpeed);

  const setTimelineIndex = useXRayStore((s) => s.setTimelineIndex);
  const play = useXRayStore((s) => s.play);
  const pause = useXRayStore((s) => s.pause);
  const restart = useXRayStore((s) => s.restart);
  const stepForward = useXRayStore((s) => s.stepForward);
  const stepBackward = useXRayStore((s) => s.stepBackward);
  const setPlaybackSpeed = useXRayStore((s) => s.setPlaybackSpeed);

  // Playback loop
  useEffect(() => {
    if (playbackState !== "playing") return;

    const intervalMs = Math.round(1000 / playbackSpeed);
    const timer = setInterval(() => {
      const next = timelineIndex + 1;
      if (next < trace.spans.length) {
        setTimelineIndex(next);
      } else {
        pause();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [playbackState, playbackSpeed, timelineIndex, trace.spans.length, setTimelineIndex, pause]);

  const activeSpan = trace.spans[timelineIndex] || trace.spans[0];
  const progressPercent = trace.spans.length > 1 ? (timelineIndex / (trace.spans.length - 1)) * 100 : 100;

  return (
    <div className="space-y-6 text-zinc-200">
      {/* 1. Playback Control Bar */}
      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Main Transport Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={restart}
              title="Restart from Step 1"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={stepBackward}
              disabled={timelineIndex <= 0}
              title="Previous Step"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={playbackState === "playing" ? pause : play}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs shadow-lg shadow-cyan-950 transition-colors"
            >
              {playbackState === "playing" ? (
                <>
                  <Pause className="w-4 h-4 fill-black" />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  PLAY TRACE
                </>
              )}
            </button>
            <button
              onClick={stepForward}
              disabled={timelineIndex >= trace.spans.length - 1}
              title="Next Step"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selectors */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500 mr-1 flex items-center gap-1">
              <FastForward className="w-3 h-3" /> Speed:
            </span>
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded border text-xs ${
                  playbackSpeed === spd
                    ? "bg-cyan-950 border-cyan-500 text-cyan-300 font-bold"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Step Counter */}
          <div className="text-xs font-mono text-zinc-400">
            Step <strong className="text-cyan-400">{timelineIndex + 1}</strong> of {trace.spans.length} ·{" "}
            <span className="text-zinc-300 font-bold">{trace.totalDurationMs} ms</span> total
          </div>
        </div>

        {/* Scrub Bar */}
        <div className="space-y-1.5">
          <div className="relative w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>t = 0.0 ms (Vehicle Simulation)</span>
            <span>t = {trace.totalDurationMs} ms (Strategic Insights)</span>
          </div>
        </div>
      </div>

      {/* 2. Active Step Highlight Card */}
      {activeSpan && (
        <div className="p-4 bg-zinc-900/60 rounded-xl border border-cyan-800/40 text-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/60">
              CURRENT ACTIVE STAGE: {activeSpan.facilityId.toUpperCase()}
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Duration:</span>
              <span className="text-cyan-400 font-bold">{activeSpan.durationMs} ms</span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">{activeSpan.name}</h3>
            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
              Source: {activeSpan.sourceRef.file}::{activeSpan.sourceRef.symbol}()
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">Inputs:</span>
              <pre className="text-cyan-300 mt-1 overflow-x-auto">{JSON.stringify(activeSpan.inputSummary, null, 2)}</pre>
            </div>
            <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">Outputs:</span>
              <pre className="text-emerald-300 mt-1 overflow-x-auto">{JSON.stringify(activeSpan.outputSummary, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. Chronological Trace Spans Table */}
      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          Chronological Trace Execution Spans
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Stage Name</th>
                <th className="py-2 px-3">Facility</th>
                <th className="py-2 px-3">Duration</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {trace.spans.map((span, idx) => {
                const isSelected = idx === timelineIndex;
                return (
                  <tr
                    key={span.spanId}
                    className={`border-b border-zinc-800/50 transition-colors ${
                      isSelected ? "bg-cyan-950/40 text-cyan-200" : "hover:bg-zinc-900/60 text-zinc-300"
                    }`}
                  >
                    <td className="py-2 px-3">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-zinc-100">{span.name}</td>
                    <td className="py-2 px-3 uppercase text-[11px] text-zinc-400">{span.facilityId}</td>
                    <td className="py-2 px-3 text-cyan-400">{span.durationMs}ms</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {span.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => setTimelineIndex(idx)}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-200"
                      >
                        Seek
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

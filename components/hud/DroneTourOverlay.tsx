"use client";

import React, { useState, useEffect } from "react";
import { useWorldStore } from "@/state/worldStore";
import { TOUR_WAYPOINTS, TOUR_DURATION_SECONDS } from "../camera/DroneTourCamera";
import { worldSound } from "@/lib/audio";
import { Video, StopCircle, SkipForward } from "lucide-react";

export const DroneTourOverlay: React.FC = () => {
  const isDroneTourActive = useWorldStore((s) => s.isDroneTourActive);
  const stopDroneTour = useWorldStore((s) => s.stopDroneTour);
  const setPlayerPosition = useWorldStore((s) => s.setPlayerPosition);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isDroneTourActive) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= TOUR_DURATION_SECONDS) {
          clearInterval(interval);
          return TOUR_DURATION_SECONDS;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isDroneTourActive]);

  if (!isDroneTourActive) return null;

  const progress = Math.min(1.0, elapsed / TOUR_DURATION_SECONDS);
  const waypointIndex = Math.min(
    TOUR_WAYPOINTS.length - 1,
    Math.floor((progress * TOUR_WAYPOINTS.length))
  );
  const curWaypoint = TOUR_WAYPOINTS[waypointIndex] || TOUR_WAYPOINTS[0]!;
  const secondsLeft = Math.max(0, Math.ceil(TOUR_DURATION_SECONDS - elapsed));

  return (
    <div className="fixed inset-x-0 bottom-8 z-50 pointer-events-none flex flex-col items-center px-4 animate-fade-in">
      {/* Top Telemetry Tag */}
      <div className="mb-2 flex items-center gap-2">
        <div className="px-3 py-1 bg-red-950/90 border border-red-500 text-red-200 font-pixel text-[10px] tracking-widest flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          REC // 45-SEC RECRUITER FLYTHROUGH ({secondsLeft}S REMAINING)
        </div>
      </div>

      {/* Broadcast Lower-Third Card */}
      <div className="pointer-events-auto w-full max-w-2xl bg-zinc-950/95 border-2 border-zinc-700 p-4 shadow-2xl flex flex-col gap-2 rounded-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-pixel text-amber-400 tracking-wider">
              FACILITY STOP {waypointIndex + 1} OF {TOUR_WAYPOINTS.length} — {curWaypoint.facility}
            </div>
            <h2 className="text-base sm:text-lg font-pixel text-white font-bold tracking-tight">
              {curWaypoint.title}
            </h2>
            <p className="text-xs font-mono text-zinc-300 mt-0.5">
              {curWaypoint.subtitle}
            </p>
          </div>

          <button
            onClick={() => {
              worldSound.playClick();
              stopDroneTour();
              setPlayerPosition([0, 1.65, 5]);
            }}
            className="shrink-0 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 font-pixel text-[10px] flex items-center gap-1.5 shadow"
          >
            <StopCircle className="w-3.5 h-3.5 text-red-400" />
            <span>EXIT TOUR [ESC]</span>
          </button>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {curWaypoint.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-sky-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-sky-400 transition-all duration-100"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};


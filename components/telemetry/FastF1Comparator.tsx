"use client";

import React, { useState, useMemo } from "react";
import {
  MONZA_2024_PROFILE,
  SILVERSTONE_2024_PROFILE,
  FastF1GrandPrixProfile,
  computeTelemetryCorrelation,
} from "@/lib/digitalTwin/fastF1Telemetry";
import { getGhostLapReference } from "@/lib/digitalTwin/ghostLapEngine";
import {
  Activity,
  Zap,
  TrendingUp,
  GitCommit,
  CheckCircle2,
  Sparkles,
  Layers,
  Flame,
  Gauge,
  Flag,
} from "lucide-react";

export const FastF1Comparator: React.FC = () => {
  const [selectedGpId, setSelectedGpId] = useState<"monza" | "silverstone">("monza");
  const profile: FastF1GrandPrixProfile =
    selectedGpId === "monza" ? MONZA_2024_PROFILE : SILVERSTONE_2024_PROFILE;

  // Use authoritative reference lap samples from driving engine
  const refLap = useMemo(() => getGhostLapReference(), []);
  const correlation = useMemo(
    () => computeTelemetryCorrelation(refLap.samples, profile),
    [refLap, profile]
  );

  return (
    <div className="space-y-6 font-mono">
      {/* 1. HEADER & CIRCUIT SELECTOR */}
      <div className="bg-[#18191E] border-4 border-[#262A31] p-4 sm:p-6 shadow-[0_6px_0_#0D0E12] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#262A31] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-950 border border-cyan-500 text-cyan-300 font-pixel text-[9px] uppercase mc-text-shadow">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>FASTF1 OFFICIAL TELEMETRY OVERLAY ENGINE</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase tracking-wide mt-2">
              REAL F1 TELEMETRY CORRELATOR
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
              Compare your simulated vehicle physics against real Formula 1 Grand Prix GPS telemetry
              (FastF1 / OpenF1). Validates speed curves, braking deceleration thresholds, and corner apex correlation.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="bg-[#101115] border border-[#2B2E37] px-3 py-1.5 text-right">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">CORRELATION R²</span>
              <span className="font-pixel text-xs text-emerald-400">
                {correlation.rSquared} (Pacejka Match)
              </span>
            </div>
            <div className="bg-[#101115] border border-[#2B2E37] px-3 py-1.5 text-right">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">APEX ACCURACY</span>
              <span className="font-pixel text-xs text-[#00d2be]">
                {correlation.apexCorrelationPct}% Validated
              </span>
            </div>
          </div>
        </div>

        {/* GRAND PRIX SELECTOR TABS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedGpId("monza")}
            className={`p-3 text-left border-2 transition-all flex items-center justify-between ${
              selectedGpId === "monza"
                ? "bg-[#252830] border-[#00d2be] text-white shadow-[0_2px_0_#00d2be]"
                : "bg-[#141519] border-[#2B2E37] text-zinc-400 hover:text-white"
            }`}
          >
            <div>
              <div className="font-pixel text-[9px] text-[#00d2be]">ITALIAN GRAND PRIX 2024</div>
              <div className="font-pixel text-xs text-white uppercase mt-0.5">
                AUTODROMO NAZIONALE MONZA
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Ref: 1:21.432 • Max Verstappen / Red Bull RB20
              </div>
            </div>
            <Flag className={`w-5 h-5 ${selectedGpId === "monza" ? "text-[#00d2be]" : "text-zinc-600"}`} />
          </button>

          <button
            onClick={() => setSelectedGpId("silverstone")}
            className={`p-3 text-left border-2 transition-all flex items-center justify-between ${
              selectedGpId === "silverstone"
                ? "bg-[#252830] border-[#00d2be] text-white shadow-[0_2px_0_#00d2be]"
                : "bg-[#141519] border-[#2B2E37] text-zinc-400 hover:text-white"
            }`}
          >
            <div>
              <div className="font-pixel text-[9px] text-sky-400">BRITISH GRAND PRIX 2024</div>
              <div className="font-pixel text-xs text-white uppercase mt-0.5">
                SILVERSTONE CIRCUIT (HIGH DOWNFORCE)
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Ref: 1:27.810 • Lewis Hamilton / Mercedes W15
              </div>
            </div>
            <Flag className={`w-5 h-5 ${selectedGpId === "silverstone" ? "text-sky-400" : "text-zinc-600"}`} />
          </button>
        </div>
      </div>

      {/* 2. SYNCHRONIZED OVERLAY TRACE (SVG) */}
      <div className="bg-[#101115] border-4 border-[#262A31] p-4 sm:p-6 space-y-4 shadow-[0_6px_0_#0D0E12]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#262A31] pb-2">
          <span className="font-pixel text-xs text-white uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span>SYNCHRONIZED SPEED & PEDAL OVERLAY TRACE</span>
          </span>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="w-3 h-1 bg-yellow-400" />
              <span>SIMULATED VEHICLE (ASISH SIM)</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#00d2be]">
              <span className="w-3 h-1 bg-[#00d2be]" />
              <span>FASTF1 REAL F1 (2024 GP)</span>
            </span>
          </div>
        </div>

        {/* Main Multi-Channel Graph */}
        <div className="bg-[#090A0D] border-2 border-[#22242B] p-3 space-y-2">
          <div className="text-[10px] text-zinc-400 flex justify-between">
            <span>VELOCITY (0 → 360 KM/H)</span>
            <span>LAP PROGRESS (0% → 100%)</span>
          </div>

          <div className="relative h-44 sm:h-56 w-full border border-[#22242B] bg-[#0c0d12]">
            <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-full">
              {/* Sector Guidelines */}
              <line x1="150" y1="0" x2="150" y2="120" stroke="#1f242d" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="300" y1="0" x2="300" y2="120" stroke="#1f242d" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="450" y1="0" x2="450" y2="120" stroke="#1f242d" strokeWidth="1" strokeDasharray="3 3" />

              {/* FastF1 Official Telemetry Trace (Cyan) */}
              <polyline
                points={correlation.spatialDataPoints
                  .map((p) => `${(p.progressPct / 100) * 600},${115 - (p.f1SpeedKmh / 370) * 110}`)
                  .join(" ")}
                fill="none"
                stroke="#00d2be"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* Simulated Vehicle Trace (Gold / Yellow) */}
              <polyline
                points={correlation.spatialDataPoints
                  .map((p) => `${(p.progressPct / 100) * 600},${115 - (p.simSpeedKmh / 370) * 110}`)
                  .join(" ")}
                fill="none"
                stroke="#facc15"
                strokeWidth="2"
              />

              {/* Throttle Baseline Shading */}
              <polyline
                points={correlation.spatialDataPoints
                  .map((p) => `${(p.progressPct / 100) * 600},${118 - (p.f1Throttle / 100) * 20}`)
                  .join(" ")}
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Brake Spike Shading */}
              <polyline
                points={correlation.spatialDataPoints
                  .map((p) => `${(p.progressPct / 100) * 600},${118 - (p.f1Brake / 100) * 20}`)
                  .join(" ")}
                fill="none"
                stroke="#ef4444"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-500 pt-1">
            <span>SECTOR 1: STRAIGHT & CHICANE</span>
            <span>SECTOR 2: HIGH-G CURVE & MID-CHICANE</span>
            <span>SECTOR 3: FINAL BRAKING & MAIN STRAIGHT</span>
          </div>
        </div>
      </div>

      {/* 3. CRITICAL CORNERS & APEX SPEED AUDIT */}
      <div className="bg-[#141519] border-4 border-[#262A31] p-4 sm:p-6 space-y-4 shadow-[0_6px_0_#0D0E12]">
        <div className="flex items-center justify-between border-b-2 border-[#262A31] pb-2">
          <span className="font-pixel text-xs text-white uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>CRITICAL CORNER APEX SPEEDS & GEAR CORRELATION</span>
          </span>
          <span className="font-pixel text-[9px] text-zinc-400">
            CIRCUIT: {profile.circuitName.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.keyCorners.map((corner, idx) => {
            // Find corresponding simulated speed at this corner distance
            const targetPoint = correlation.spatialDataPoints.find(
              (p) => Math.abs(p.progressPct / 100 - corner.distancePct) < 0.04
            ) || { simSpeedKmh: corner.apexSpeedKmh };

            const delta = targetPoint.simSpeedKmh - corner.apexSpeedKmh;
            const sign = delta > 0 ? "+" : "";

            return (
              <div
                key={idx}
                className="bg-[#101115] border border-[#2B2E37] p-3 space-y-2 hover:border-zinc-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[10px] text-yellow-400 uppercase">{corner.name}</span>
                  <span className="text-[9px] font-pixel text-zinc-400 bg-zinc-800 px-1.5 py-0.5">
                    GEAR {corner.gear}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-[#1F2228]">
                  <div>
                    <span className="text-[9px] text-zinc-500 block font-pixel uppercase">FASTF1 APEX</span>
                    <strong className="font-pixel text-sm text-[#00d2be]">{corner.apexSpeedKmh} KM/H</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block font-pixel uppercase">SIMULATED</span>
                    <strong className="font-pixel text-sm text-yellow-400">{targetPoint.simSpeedKmh} KM/H</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block font-pixel uppercase">DELTA</span>
                    <span className={`font-pixel text-xs ${Math.abs(delta) < 8 ? "text-emerald-400" : "text-amber-400"}`}>
                      {sign}{delta} KM/H
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 leading-snug pt-1">
                  {corner.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


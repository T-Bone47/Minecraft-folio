"use client";

import React from "react";
import { useMultiverseStore } from "@/state/multiverseStore";
import { Gauge, ShieldAlert, Award, Play, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

export const RaceMindDemoView: React.FC = () => {
  const raceMindState = useMultiverseStore((s) => s.raceMindState);
  const updateRaceMindCandidate = useMultiverseStore((s) => s.updateRaceMindCandidate);
  const updateRaceMindSafetyCar = useMultiverseStore((s) => s.updateRaceMindSafetyCar);
  const updateRaceMindTyreAge = useMultiverseStore((s) => s.updateRaceMindTyreAge);

  const {
    currentLap,
    totalLaps,
    trackCondition,
    safetyCarStatus,
    currentPosition,
    gapToP2,
    currentTyreCompound,
    currentTyreAge,
    candidateStrategy,
    pitLossDeltaSec,
    reentryPosition,
    reentryGapSec,
    tyreGripAdvantagePercent,
    netRaceTimeDeltaSec,
    recommendedAction,
    overtakeProbabilityPercent,
  } = raceMindState;

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans" data-testid="racemind-demo-container">
      {/* 1. Header Banner & Provenance Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-red-950/30 border border-red-500/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-bold uppercase tracking-wider text-red-300 font-mono">
              THE RACE ENGINEER&apos;S DECISION ROOM
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tactical decision engine evaluating safety car pit windows, non-linear tyre degradation, and undercut deltas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            PROVENANCE: REPRODUCIBLE_LOCAL_DEMO
          </span>
        </div>
      </div>

      {/* 2. Live Scenario Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Track Incident Status */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="text-xs font-mono uppercase text-slate-400 block mb-2 font-bold">
            Track Incident State
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["NONE", "VSC", "FULL_SAFETY_CAR"] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => updateRaceMindSafetyCar(sc)}
                className={`px-2 py-2 rounded text-xs font-mono font-bold transition-all ${
                  safetyCarStatus === sc
                    ? "bg-red-500 text-white shadow-md shadow-red-950"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {sc === "NONE" ? "GREEN" : sc === "VSC" ? "VSC" : "SAFETY CAR"}
              </button>
            ))}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2.5">
            Pit Delta Loss: <span className="text-amber-400 font-bold">{pitLossDeltaSec}s</span>{" "}
            {safetyCarStatus === "FULL_SAFETY_CAR" ? "(Delta saved: -9.5s)" : "(Standard green flag loss)"}
          </div>
        </div>

        {/* Current Tyre Stint Age */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-mono uppercase text-slate-400 font-bold">
              Current Tyre Age
            </label>
            <span className="text-xs font-mono font-bold text-red-400">
              {currentTyreAge} / 38 Laps ({currentTyreCompound})
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={38}
            value={currentTyreAge}
            onChange={(e) => updateRaceMindTyreAge(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>Lap 1 (Fresh)</span>
            <span>Lap 24 (Worn)</span>
            <span>Lap 38 (Cliff)</span>
          </div>
        </div>

        {/* Race Stint Progress */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="text-xs font-mono uppercase text-slate-400 block mb-2 font-bold">
            Race Stint Progress
          </label>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Active Lap:</span>
            <span className="font-bold text-slate-100">{currentLap} / {totalLaps}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2.5">
            <div
              className="bg-red-500 h-full rounded-full transition-all"
              style={{ width: `${(currentLap / totalLaps) * 100}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Track Position: <span className="text-emerald-400 font-bold">P{currentPosition}</span> (Gap to P2: +{gapToP2}s)
          </div>
        </div>
      </div>

      {/* 3. Candidate Strategy Selector */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <label className="text-xs font-mono uppercase text-slate-400 block mb-3 font-bold">
          Evaluate Tactical Strategy Directive
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "STAY_OUT", label: "STAY OUT", compound: "CURRENT", color: "bg-slate-700" },
            { id: "BOX_FOR_SOFTS", label: "BOX FOR SOFTS", compound: "SOFT (RED)", color: "bg-red-600" },
            { id: "BOX_FOR_MEDIUMS", label: "BOX FOR MEDIUMS", compound: "MEDIUM (YELLOW)", color: "bg-amber-500" },
            { id: "BOX_FOR_HARDS", label: "BOX FOR HARDS", compound: "HARD (WHITE)", color: "bg-slate-400" },
          ].map((strat) => (
            <button
              key={strat.id}
              onClick={() => updateRaceMindCandidate(strat.id as any)}
              className={`p-3 rounded-lg border text-left transition-all ${
                candidateStrategy === strat.id
                  ? "border-red-500 bg-red-950/40 shadow-lg shadow-red-950/50"
                  : "border-slate-800 bg-slate-950/40 hover:bg-slate-800/60"
              }`}
            >
              <div className="text-xs font-mono font-bold text-slate-200">{strat.label}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">{strat.compound}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Real-Time Evaluated Outcomes Matrix */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-950/90 border border-red-500/20 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-red-400" />
          <h4 className="text-xs font-mono uppercase font-bold text-red-300">
            Real-Time Strategy Outcome & Telemetry Projection
          </h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Re-entry Position */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Re-Entry Position</div>
            <div className="text-xl font-mono font-bold mt-1 text-slate-100">
              P{reentryPosition}{" "}
              <span className={`text-xs ${reentryGapSec >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                ({reentryGapSec >= 0 ? `+${reentryGapSec}s` : `${reentryGapSec}s`})
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {reentryPosition === 1 ? "Retains race lead" : "Surrenders lead to P2"}
            </div>
          </div>

          {/* Tyre Grip Advantage */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Tyre Grip Delta</div>
            <div className="text-xl font-mono font-bold mt-1 text-emerald-400">
              +{tyreGripAdvantagePercent}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Compound friction envelope</div>
          </div>

          {/* Net Race Delta */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Net Race Time Delta</div>
            <div className={`text-xl font-mono font-bold mt-1 ${netRaceTimeDeltaSec > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {netRaceTimeDeltaSec > 0 ? `+${netRaceTimeDeltaSec}s` : `${netRaceTimeDeltaSec}s`}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {netRaceTimeDeltaSec > 0 ? "Cumulative pace saved" : "Time lost vs staying out"}
            </div>
          </div>

          {/* Overtake Probability */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Win / Overtake Prob.</div>
            <div className="text-xl font-mono font-bold mt-1 text-sky-400">
              {overtakeProbabilityPercent}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Monte Carlo pace trajectory</div>
          </div>
        </div>

        {/* Recommended Action Directive */}
        <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
          <div className="text-xs font-mono">
            <span className="text-red-300 font-bold uppercase mr-2">VERDICT:</span>
            <span className="text-slate-200">{recommendedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

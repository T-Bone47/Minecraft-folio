"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Flame,
  Radio,
  Clock,
  Shuffle,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Award,
  Zap,
} from "lucide-react";
import {
  CANONICAL_STRATEGY_PLANS,
  MONZA_DEFAULT_ENVIRONMENT,
  runMonteCarloRaceSimulation,
} from "@/lib/strategy/monteCarloStrategyEngine";
import { RaceStrategyPlan, StrategyEnvironment, TireCompound } from "@/lib/strategy/types";

export function RaceStrategySimulator() {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("1_stop_med_hard");
  const [trackTemp, setTrackTemp] = useState<number>(38.0);
  const [scProbability, setScProbability] = useState<number>(0.024);
  const [copied, setCopied] = useState<boolean>(false);

  const env: StrategyEnvironment = useMemo(() => {
    return {
      ...MONZA_DEFAULT_ENVIRONMENT,
      trackTempCelsius: trackTemp,
      safetyCarProbabilityPerLap: scProbability,
    };
  }, [trackTemp, scProbability]);

  const activeStrategy = useMemo(() => {
    return CANONICAL_STRATEGY_PLANS.find((s) => s.id === selectedStrategyId) || CANONICAL_STRATEGY_PLANS[0];
  }, [selectedStrategyId]);

  // Run Monte Carlo simulation for all 4 strategies so we can compare win probabilities directly
  const allSummaries = useMemo(() => {
    return CANONICAL_STRATEGY_PLANS.map((strat) =>
      runMonteCarloRaceSimulation(strat, env, 200)
    );
  }, [env]);

  const activeSummary = useMemo(() => {
    return allSummaries.find((s) => s.strategyId === selectedStrategyId) || allSummaries[0];
  }, [allSummaries, selectedStrategyId]);

  const handleCopyStrategy = () => {
    const exportData = {
      engineer: "Asish Oliver M",
      circuit: env.trackName,
      strategyName: activeStrategy.name,
      stints: activeStrategy.stints,
      simulationMetrics: {
        deterministicTotalTime: activeSummary.deterministicTotalTimeFormatted,
        stochasticMeanTimeSec: activeSummary.stochasticMeanTimeSec,
        stochasticStdDevSec: activeSummary.stochasticStdDevSec,
        winProbability: `${activeSummary.winProbabilityPct}%`,
        pitStops: activeSummary.pitStopsCount,
      },
      verifiedAt: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getCompoundColor = (compound: TireCompound) => {
    switch (compound) {
      case "soft":
        return "bg-rose-600 text-white border-rose-400";
      case "medium":
        return "bg-amber-500 text-black border-amber-300";
      case "hard":
        return "bg-zinc-200 text-black border-white";
      default:
        return "bg-emerald-600 text-white border-emerald-400";
    }
  };

  const getCompoundDot = (compound: TireCompound) => {
    switch (compound) {
      case "soft":
        return "#f43f5e";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#e4e4e7";
      default:
        return "#10b981";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="mc-panel p-6 border-b-4 border-rose-600/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-pixel bg-rose-950/80 text-rose-300 border border-rose-500/50 uppercase tracking-widest">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                PIT WALL STRATEGY & MONTE CARLO · 53 LAPS
              </span>
              <span className="font-pixel text-[9px] text-zinc-400">
                OPERATIONS RESEARCH & APPLIED AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-pixel text-zinc-100 tracking-wider">
              RACE STRATEGY & TIRE DEGRADATION OPTIMIZER
            </h1>
            <p className="text-sm text-zinc-300 mt-1 max-w-3xl leading-relaxed">
              Stochastic pit-stop decision engine modeling non-linear tire degradation cliffs ($\Delta t_{\text{deg}} = \alpha \cdot l^\beta$), fuel weight burn-off ($-0.033\,\text{s/kg}$), and Virtual Safety Car exploitation across 300 Monte Carlo race iterations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleCopyStrategy}
              className="mc-button px-3.5 py-2 text-xs flex items-center gap-2 font-mono text-zinc-200 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-rose-400" />}
              <span>{copied ? "PLAN COPIED" : "EXPORT STRATEGY (JSON)"}</span>
            </button>
            <Link
              href="/cli"
              className="mc-button px-3.5 py-2 text-xs flex items-center gap-2 font-mono bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white"
            >
              <span>RUN IN CLI (~ /cli)</span>
            </Link>
          </div>
        </div>

        {/* Strategy Switcher Pills */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-2">
          <span className="text-rose-400 font-pixel text-[10px] mr-1">STRATEGIES:</span>
          {CANONICAL_STRATEGY_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedStrategyId(plan.id)}
              className={`px-3 py-1.5 font-pixel text-[10px] transition-all flex items-center gap-2 ${
                selectedStrategyId === plan.id
                  ? "bg-rose-700 text-white border border-rose-300 shadow-md"
                  : "bg-zinc-800/80 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
              }`}
            >
              <span>{plan.name.split(":")[0]}</span>
              <span className="text-[9px] opacity-75 hidden sm:inline">
                ({plan.stints.map((s) => s.compound.toUpperCase().slice(0, 1)).join("→")})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Stint Gantt Chart & Monte Carlo Gauges + 53-Lap SVG Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stint Timeline & Monte Carlo Probabilities (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Strategy Card */}
          <div className="mc-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-pixel text-[11px] text-rose-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-400" />
                STINT BREAKDOWN & PIT WINDOWS
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                {activeSummary.pitStopsCount} PIT STOP{activeSummary.pitStopsCount > 1 ? "S" : ""}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-pixel text-zinc-100">{activeStrategy.name}</div>
              <div className="text-xs text-zinc-400 font-mono">{activeStrategy.tagline}</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                {activeStrategy.description}
              </p>
            </div>

            {/* Visual Stint Gantt Bar (Laps 1 to 53) */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>LAP 1</span>
                <span>LAP 26 (HALFWAY)</span>
                <span>LAP 53</span>
              </div>
              <div className="w-full h-8 bg-zinc-950 border border-zinc-800 flex overflow-hidden p-0.5 gap-0.5">
                {activeStrategy.stints.map((stint, idx) => {
                  const stintLaps = stint.endLap - stint.startLap + 1;
                  const widthPct = (stintLaps / env.totalLaps) * 100;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${widthPct}%` }}
                      className={`h-full flex items-center justify-center font-pixel text-[9px] border ${getCompoundColor(
                        stint.compound
                      )}`}
                    >
                      {stint.compound.toUpperCase()} ({stintLaps}L)
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Probabilistic Output Matrix */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">RACE TIME (MEAN)</div>
                <div className="text-xl font-pixel text-rose-300 mt-0.5">
                  {Math.floor(activeSummary.stochasticMeanTimeSec / 60)}m{" "}
                  {(activeSummary.stochasticMeanTimeSec % 60).toFixed(0)}s
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  σ = ±{activeSummary.stochasticStdDevSec}s (Variance)
                </div>
              </div>

              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">WIN PROBABILITY</div>
                <div className="text-xl font-pixel text-emerald-300 mt-0.5">
                  {activeSummary.winProbabilityPct}%
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  vs Benchmark Field
                </div>
              </div>

              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">BEST STOCHASTIC CASE</div>
                <div className="text-lg font-pixel text-cyan-300 mt-0.5">
                  {Math.floor(activeSummary.stochasticBestTimeSec / 60)}m{" "}
                  {(activeSummary.stochasticBestTimeSec % 60).toFixed(0)}s
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  Free VSC Pit Stop
                </div>
              </div>

              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">WORST TRAFFIC DELAY</div>
                <div className="text-lg font-pixel text-amber-300 mt-0.5">
                  {Math.floor(activeSummary.stochasticWorstTimeSec / 60)}m{" "}
                  {(activeSummary.stochasticWorstTimeSec % 60).toFixed(0)}s
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  Full Green Flag Traffic
                </div>
              </div>
            </div>

            {/* Environmental Conditions Sliders */}
            <div className="space-y-3 pt-3 border-t border-zinc-800">
              <div className="text-[11px] font-pixel text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  ASPHALT TEMPERATURE:
                </span>
                <span className="text-amber-400 font-mono">{trackTemp}°C</span>
              </div>
              <input
                type="range"
                min="25"
                max="50"
                step="1"
                value={trackTemp}
                onChange={(e) => setTrackTemp(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>25°C (Cool/Mild)</span>
                <span>38°C (Monza Summer)</span>
                <span>50°C (Extreme Thermal Cliff)</span>
              </div>

              <div className="text-[11px] font-pixel text-zinc-300 flex items-center justify-between pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  SAFETY CAR RISK PER LAP:
                </span>
                <span className="text-rose-400 font-mono">{(scProbability * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.060"
                step="0.005"
                value={scProbability}
                onChange={(e) => setScProbability(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: 53-Lap Multi-Channel SVG Lap Time Pace Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="mc-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-pixel text-[11px] text-rose-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                53-LAP EVOLUTION PACE CHART (SEC/LAP)
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Soft
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Medium
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-300 inline-block" /> Hard
                </span>
              </div>
            </div>

            {/* SVG Pace Curve */}
            <div className="relative h-64 bg-black/60 border border-zinc-800 p-3">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 530 160" preserveAspectRatio="none">
                {/* Horizontal time grids: 82s, 84s, 86s, 88s */}
                <line x1="0" y1="130" x2="530" y2="130" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <text x="5" y="126" fill="#71717a" fontSize="8" fontFamily="monospace">82.0s (Peak Grip)</text>

                <line x1="0" y1="85" x2="530" y2="85" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <text x="5" y="81" fill="#71717a" fontSize="8" fontFamily="monospace">84.0s (Fuel Adjusted)</text>

                <line x1="0" y1="40" x2="530" y2="40" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <text x="5" y="36" fill="#71717a" fontSize="8" fontFamily="monospace">86.0s (Degradation)</text>

                {/* Stint Lap Data Points */}
                <polyline
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="2"
                  points={activeSummary.lapsData
                    .map((pt) => {
                      const x = (pt.lap / 53) * 520 + 5;
                      // Lap time clamp for SVG view: 81s (y=140) to 88s (y=15), pit stops cap at y=5
                      const effectiveTime = pt.isPitInLap ? 88.5 : Math.min(88.0, Math.max(81.0, pt.netLapTimeSec));
                      const y = 140 - ((effectiveTime - 81.0) / 7.5) * 125;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* Individual lap dots colored by compound */}
                {activeSummary.lapsData.map((pt) => {
                  const x = (pt.lap / 53) * 520 + 5;
                  const effectiveTime = pt.isPitInLap ? 88.5 : Math.min(88.0, Math.max(81.0, pt.netLapTimeSec));
                  const y = 140 - ((effectiveTime - 81.0) / 7.5) * 125;
                  return (
                    <circle
                      key={pt.lap}
                      cx={x}
                      cy={y}
                      r={pt.isPitInLap ? "5" : "2.5"}
                      fill={pt.isPitInLap ? "#fbbf24" : getCompoundDot(pt.compound)}
                      stroke="#000"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>LAP 1 (Full 105kg Fuel)</span>
              <span>LAP 26 (Tire Wear vs Fuel Burn Cross-over)</span>
              <span>LAP 53 (Low Fuel Sprint)</span>
            </div>

            {/* Direct Strategy Comparative Matrix */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <div className="text-[10px] font-pixel text-zinc-400">
                ALL STRATEGIES WIN-PROBABILITY BENCHMARK
              </div>
              <div className="space-y-1.5">
                {allSummaries.map((summary) => (
                  <div
                    key={summary.strategyId}
                    onClick={() => setSelectedStrategyId(summary.strategyId)}
                    className={`p-2.5 flex items-center justify-between cursor-pointer border transition-all ${
                      summary.strategyId === selectedStrategyId
                        ? "bg-rose-950/40 border-rose-500"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="font-pixel text-[10px] text-zinc-200">{summary.strategyName}</div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {summary.pitStopsCount} Pit Stop{summary.pitStopsCount > 1 ? "s" : ""} · Expected:{" "}
                        {Math.floor(summary.stochasticMeanTimeSec / 60)}m{" "}
                        {(summary.stochasticMeanTimeSec % 60).toFixed(0)}s
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-pixel text-sm text-emerald-400">{summary.winProbabilityPct}%</div>
                      <div className="text-[9px] font-mono text-zinc-500">P1 PROBABILITY</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mc-panel p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <Link href="/garage" className="text-amber-400 hover:underline flex items-center gap-1 font-pixel text-[10px]">
            ← F1 GARAGE & SETUP
          </Link>
          <span className="text-zinc-600">·</span>
          <Link href="/telemetry" className="text-zinc-300 hover:text-white flex items-center gap-1">
            FASTF1 OVERLAY
          </Link>
          <span className="text-zinc-600">·</span>
          <Link href="/chaos" className="text-zinc-300 hover:text-white flex items-center gap-1">
            CHAOS STRESS LAB
          </Link>
          <span className="text-zinc-600">·</span>
          <Link href="/cli" className="text-emerald-400 hover:underline flex items-center gap-1">
            QUAKE CLI (~)
          </Link>
        </div>

        <Link
          href="/world"
          className="mc-button px-4 py-1.5 text-xs font-pixel text-zinc-100 flex items-center gap-2 hover:bg-rose-700"
        >
          <span>SIMULATE ON 3D TRACK</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

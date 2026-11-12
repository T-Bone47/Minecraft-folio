"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { LapReplay } from "./LapReplay";
import { useDriveStore } from "@/state/driveStore";
import { useMissionStore } from "@/state/missionStore";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";
import { performCompleteLapAnalysis } from "@/lib/digitalTwin/analysis";
import { createLapRecord } from "@/lib/digitalTwin/telemetrySchema";
import { PRESET_SCENARIOS, type EngineeringScenarioConfig } from "@/lib/digitalTwin/decisionEngine";
import { Download, Sliders, CheckCircle2, AlertTriangle, ArrowRight, Activity, Gauge } from "lucide-react";

export function DriveDebrief() {
  const storeLastLap = useDriveStore((s) => s.lastLap);
  const driveProgress = useMissionStore((s) => s.progress.drive);
  const {
    referenceLap,
    recordedLap,
    whatIfResult,
    applyWhatIfScenario,
    clearWhatIfScenario,
    missionStep,
    advanceMissionStep,
  } = useDigitalTwinStore();

  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);

  // Use stored lap if available, otherwise fallback to recorded or create from storeLastLap
  const activeLap = useMemo(() => {
    if (recordedLap) return recordedLap;
    if (storeLastLap) {
      return createLapRecord(storeLastLap.state, storeLastLap.samples, storeLastLap.source);
    }
    return null;
  }, [recordedLap, storeLastLap]);

  const analysis = useMemo(() => {
    if (!activeLap) return null;
    return performCompleteLapAnalysis(activeLap, referenceLap);
  }, [activeLap, referenceLap]);

  if (!activeLap) {
    return (
      <div className="p-6 text-zinc-300 font-mono text-xs space-y-4">
        <p className="text-amber-300 font-bold uppercase">
          NO TIMED SIMULATOR LAP RECORDED IN CURRENT SESSION.
        </p>
        <p>
          You can either enter the <strong>Frontier-01</strong> in the Race Engineering Garage to drive through all 4 timing gates, or load the bundled reference session to inspect full telemetry.
        </p>
        <button
          onClick={() => useDigitalTwinStore.getState().loadBundledReferenceLap()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-wider transition-colors"
        >
          LOAD BUNDLED BENCHMARK TELEMETRY
        </button>
      </div>
    );
  }

  const exportLapJson = () => {
    const dataStr = JSON.stringify(activeLap, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asish-digital-twin-lap-${activeLap.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyScenario = (scenario: EngineeringScenarioConfig) => {
    applyWhatIfScenario(scenario);
  };

  const maxSpeedKmh = Math.max(
    ...activeLap.samples.map((s) => Math.abs(s.speed) * 3.6),
    ...referenceLap.samples.map((s) => Math.abs(s.speed) * 3.6),
    1
  );

  return (
    <div className="frontier-flow text-xs font-mono space-y-5 text-zinc-200">
      {/* 1. Header & Provenance */}
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              TIMED LAP VALIDATED // 4 ORDERED SECTORS
            </h3>
          </div>
          <span className="px-2 py-0.5 text-[10px] bg-zinc-800 border border-zinc-700 text-amber-300">
            {activeLap.provenanceLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-zinc-900">
          <div className="bg-zinc-950 p-2.5 border border-zinc-800">
            <div className="text-[10px] text-zinc-400">YOUR LAP TIME</div>
            <div className="text-xl font-bold text-amber-400">
              {activeLap.state.time.toFixed(3)}s
            </div>
          </div>
          <div className="bg-zinc-950 p-2.5 border border-zinc-800">
            <div className="text-[10px] text-zinc-400">REFERENCE TIME</div>
            <div className="text-xl font-bold text-cyan-400">
              {referenceLap.state.time.toFixed(3)}s
            </div>
          </div>
          <div className="bg-zinc-950 p-2.5 border border-zinc-800">
            <div className="text-[10px] text-zinc-400">LAP DELTA</div>
            <div
              className={`text-xl font-bold ${
                (analysis?.totalDeltaS ?? 0) <= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {(analysis?.totalDeltaS ?? 0) > 0 ? "+" : ""}
              {(analysis?.totalDeltaS ?? 0).toFixed(3)}s
            </div>
          </div>
          <div className="bg-zinc-950 p-2.5 border border-zinc-800">
            <div className="text-[10px] text-zinc-400">TOP VELOCITY</div>
            <div className="text-xl font-bold text-white">
              {activeLap.summary.topSpeedKmh} <span className="text-xs text-zinc-400">KM/H</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Synchronized Multi-Channel Replay */}
      <LapReplay lap={activeLap} referenceLap={referenceLap} />

      {/* 3. Measured Sector Performance Table */}
      {analysis && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>SECTOR TIMING BREAKDOWN</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-zinc-800 bg-zinc-950/70">
              <thead className="bg-zinc-900/90 text-zinc-400 text-[10px]">
                <tr>
                  <th className="p-2 border-b border-zinc-800">SECTOR</th>
                  <th className="p-2 border-b border-zinc-800">YOU (S)</th>
                  <th className="p-2 border-b border-zinc-800">REF (S)</th>
                  <th className="p-2 border-b border-zinc-800">DELTA</th>
                  <th className="p-2 border-b border-zinc-800">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {analysis.sectors.map((sec) => (
                  <tr key={sec.sectorNumber} className="hover:bg-zinc-900/50">
                    <td className="p-2 font-bold text-zinc-300">SECTOR {sec.sectorNumber}</td>
                    <td className="p-2 text-white">{sec.visitorTimeS.toFixed(3)}</td>
                    <td className="p-2 text-cyan-400">{sec.referenceTimeS.toFixed(3)}</td>
                    <td
                      className={`p-2 font-bold ${
                        sec.deltaS <= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {sec.deltaS > 0 ? "+" : ""}
                      {sec.deltaS.toFixed(3)}s ({sec.percentageDiff > 0 ? "+" : ""}
                      {sec.percentageDiff}%)
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] uppercase font-bold ${
                          sec.status === "faster"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                            : sec.status === "slower"
                            ? "bg-red-950 text-red-400 border border-red-700"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {sec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Turn-by-Turn Corner Apex Segmentation */}
      {analysis && (
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" />
            <span>CORNER SEGMENTATION & APEX VELOCITY ANALYSIS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {analysis.corners.map((corner) => (
              <div
                key={corner.cornerIndex}
                className="bg-zinc-950 p-3 border border-zinc-800 space-y-1.5"
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-white text-[11px]">{corner.name}</span>
                  <span className="text-[10px] text-zinc-400 uppercase">{corner.type}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] pt-1 border-t border-zinc-900">
                  <div>
                    <span className="text-zinc-400 block">ENTRY</span>
                    <span className="text-zinc-200 font-bold">{corner.approachSpeedKmh} KM/H</span>
                  </div>
                  <div>
                    <span className="text-amber-400 block">APEX MIN</span>
                    <span className="text-amber-300 font-bold">{corner.apexSpeedKmh} KM/H</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 block">EXIT</span>
                    <span className="text-emerald-300 font-bold">{corner.exitSpeedKmh} KM/H</span>
                  </div>
                </div>
                {corner.timeDeltaS !== undefined && (
                  <div className="text-[10px] text-zinc-400 flex justify-between pt-1">
                    <span>CORNER DELTA:</span>
                    <span
                      className={`font-bold ${
                        corner.timeDeltaS <= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {corner.timeDeltaS > 0 ? "+" : ""}
                      {corner.timeDeltaS.toFixed(3)}s (Ref apex: {corner.refApexSpeedKmh} KM/H)
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Actionable Engineering Coaching Insights */}
      {analysis && analysis.insights.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ACTIONABLE ENGINEERING COACHING INSIGHTS</span>
          </div>
          <div className="space-y-2">
            {analysis.insights.map((ins) => (
              <div
                key={ins.id}
                className={`p-3 border text-[11px] leading-relaxed ${
                  ins.severity === "critical"
                    ? "bg-red-950/40 border-red-500/50 text-red-200"
                    : ins.severity === "moderate"
                    ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
                    : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                }`}
              >
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>{ins.location}</span>
                  <span>Impact: ~{Math.abs(ins.timeImpactS).toFixed(2)}s</span>
                </div>
                <p className="mb-1 text-zinc-300">{ins.observation}</p>
                <p className="font-bold text-white">
                  RECOMMENDATION: <span className="font-normal">{ins.recommendation}</span>
                </p>
                <p className="text-[9px] text-zinc-400 mt-1 italic">Evidence: {ins.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Race Engineering What-If Decision System */}
      <div className="bg-zinc-950 p-4 border border-zinc-800 space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>RACE ENGINEERING WHAT-IF DECISION CENTRE</span>
          </div>
          <span className="text-[10px] text-zinc-400">BOUNDED DETERMINISTIC MODEL</span>
        </div>
        <p className="text-[11px] text-zinc-400">
          Apply a hypothetical setup or braking modification to your measured lap to simulate projected stint outcomes. Original measured data is strictly isolated.
        </p>

        {/* Preset Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_SCENARIOS.map((scenario, idx) => (
            <button
              key={scenario.name}
              onClick={() => {
                setSelectedScenarioIdx(idx);
                handleApplyScenario(scenario);
              }}
              className={`p-2.5 text-left border transition-colors ${
                selectedScenarioIdx === idx && whatIfResult
                  ? "bg-purple-950/60 border-purple-400 text-white"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <div className="font-bold text-[10px] uppercase text-purple-300">{scenario.name}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{scenario.description}</div>
            </button>
          ))}
        </div>

        {/* What-If Result Card */}
        {whatIfResult && (
          <div className="bg-purple-950/30 border border-purple-500/40 p-3 mt-3 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-purple-300 font-bold uppercase text-[11px]">
                {whatIfResult.scenarioName}
              </span>
              <span
                className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                  whatIfResult.recommendationVerdict === "APPROVED FOR STINT"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                    : whatIfResult.recommendationVerdict === "REJECTED (HIGH DEFICIT)"
                    ? "bg-red-950 text-red-400 border border-red-700"
                    : "bg-amber-950 text-amber-400 border border-amber-700"
                }`}
              >
                {whatIfResult.recommendationVerdict}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-purple-900/60 text-center">
              <div>
                <span className="text-[10px] text-zinc-400 block">BASE LAP</span>
                <span className="text-white font-bold">{whatIfResult.originalLapTimeS.toFixed(3)}s</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-300 block">PREDICTED LAP</span>
                <span className="text-purple-200 font-bold">{whatIfResult.predictedLapTimeS.toFixed(3)}s</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">PROJECTED DELTA</span>
                <span
                  className={`font-bold ${
                    whatIfResult.deltaS <= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {whatIfResult.deltaS > 0 ? "+" : ""}
                  {whatIfResult.deltaS.toFixed(3)}s
                </span>
              </div>
            </div>

            <div className="text-[10px] space-y-1 pt-2 border-t border-purple-900/40">
              <div className="text-zinc-300 font-bold">MODEL TRADE-OFFS:</div>
              <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                {whatIfResult.tradeOffs.map((to, i) => (
                  <li key={i}>{to}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={clearWhatIfScenario}
              className="text-[10px] text-zinc-400 underline hover:text-white pt-1"
            >
              Reset to Base Measured Lap
            </button>
          </div>
        )}
      </div>

      {/* 7. Action Buttons & Mission Progression */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => useMissionStore.getState().send("drive", { type: "objective", name: "review" })}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Review comparison</span>
          </button>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 border border-zinc-800 bg-zinc-900/60 px-2 py-1">
            <span>{activeLap.samples.length} recorded samples · mission:</span>
            <span className="font-bold text-emerald-400">{driveProgress.status}</span>
          </div>
          <button
            onClick={exportLapJson}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT TELEMETRY JSON</span>
          </button>
          {missionStep === "DRIVE_OR_LOAD" && (
            <button
              onClick={() => advanceMissionStep("INGEST_PIPELINE")}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>PROCEED TO TELEMETRY TOWER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href="/projects/racemind-ai"
            className="text-[11px] text-cyan-400 hover:underline"
          >
            RaceMind-AI Evidence ↗
          </Link>
          <Link
            href="/projects/live-f1-intelligence"
            className="text-[11px] text-cyan-400 hover:underline"
          >
            Live F1 Intelligence ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

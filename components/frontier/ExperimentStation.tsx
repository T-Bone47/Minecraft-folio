"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  makeDataset,
  runExperiment,
  type DatasetId,
  type ModelId,
  type ExperimentResult,
} from "@/lib/frontier/ml";
import { useMissionStore } from "@/state/missionStore";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";
import { ArrowRight, Brain, Cpu, Database, Gauge, LineChart, Sparkles } from "lucide-react";

let cached: {
  dataset: DatasetId;
  model: ModelId;
  iterations: number;
  penalty: number;
  result: ExperimentResult | null;
  inspected: boolean;
} | null = null;

export function ExperimentStation() {
  const [activeTab, setActiveTab] = useState<"feature_extraction" | "ml_models">("ml_models");

  // Digital Twin state
  const { recordedLap, referenceLap, missionStep, advanceMissionStep } = useDigitalTwinStore();
  const currentLap = recordedLap ?? referenceLap;

  // ML Experiment state
  const [dataset, setDataset] = useState<DatasetId>(cached?.dataset ?? "classification");
  const [model, setModel] = useState<ModelId>(cached?.model ?? "linear");
  const [iterations, setIterations] = useState(cached?.iterations ?? 400);
  const [penalty, setPenalty] = useState(cached?.penalty ?? 0.01);
  const [result, setResult] = useState<ExperimentResult | null>(cached?.result ?? null);
  const [inspected, setInspected] = useState(cached?.inspected ?? false);

  useEffect(() => {
    cached = { dataset, model, iterations, penalty, result, inspected };
  }, [dataset, model, iterations, penalty, result, inspected]);

  const progress = useMissionStore((s) => s.progress.experiment);
  const send = useMissionStore((s) => s.send);
  const data = makeDataset(dataset);

  const reset = () => {
    setResult(null);
    setInspected(false);
    send("experiment", { type: "reset" });
  };

  const inspect = () => {
    send("experiment", { type: "reset" });
    send("experiment", { type: "start" });
    send("experiment", { type: "objective", name: "inspect" });
    setInspected(true);
    setResult(null);
  };

  const run = () => {
    setResult(runExperiment(dataset, model, iterations, penalty));
    send("experiment", { type: "objective", name: "evaluate" });
  };

  // Extract kinematic features from active session
  const engineeredFeatures = useMemo(() => {
    const s = currentLap.samples;
    if (s.length === 0) return null;

    let fullThrottleTicks = 0;
    let totalBrakeDemand = 0;
    let steeringDeltas = 0;

    for (let i = 0; i < s.length; i++) {
      if (s[i].throttle > 0.85) fullThrottleTicks++;
      totalBrakeDemand += s[i].brake;
      if (i > 0) steeringDeltas += Math.abs(s[i].steering - s[i - 1].steering);
    }

    const throttleCommitment = Math.round((fullThrottleTicks / s.length) * 100);
    const brakeDutyCycle = Math.round((totalBrakeDemand / s.length) * 100);
    const steeringSmoothness = Math.round((steeringDeltas / s.length) * 1000) / 1000;

    return {
      sampleCount: s.length,
      lapTime: currentLap.state.time,
      topSpeedKmh: currentLap.summary.topSpeedKmh,
      throttleCommitmentPct: throttleCommitment,
      brakeDutyCyclePct: brakeDutyCycle,
      steeringSmoothnessIndex: steeringSmoothness,
      provenance: currentLap.provenanceLabel,
    };
  }, [currentLap]);

  return (
    <div className="frontier-flow text-xs font-mono space-y-4 text-zinc-200">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <Link href="/engineering" className="text-cyan-400 hover:underline">
          Read the simulation architecture and methods ↗
        </Link>
        <span className="text-[10px] text-zinc-400">AI / ML INTELLIGENCE LAB</span>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("feature_extraction")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-colors border-b-2 ${
            activeTab === "feature_extraction"
              ? "border-cyan-400 text-cyan-300 bg-cyan-950/30"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Lap Telemetry Feature Extraction
        </button>
        <button
          onClick={() => setActiveTab("ml_models")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-colors border-b-2 ${
            activeTab === "ml_models"
              ? "border-purple-400 text-purple-300 bg-purple-950/30"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Reproducible ML Benchmark ({progress.status})
        </button>
      </div>

      {/* ====================================================
          TAB 1: TELEMETRY FEATURE EXTRACTION
          ==================================================== */}
      {activeTab === "feature_extraction" && (
        <div className="space-y-4">
          <div className="p-3 bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">ACTIVE DATASET ORIGIN:</span>
              <span className="font-bold text-white text-[11px]">
                {engineeredFeatures?.provenance} — {engineeredFeatures?.sampleCount} samples
              </span>
            </div>
            <span className="px-2 py-0.5 text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-700 font-bold uppercase">
              10 HZ FEATURE TENSOR
            </span>
          </div>

          <p className="text-zinc-300 leading-relaxed text-[11px]">
            In motorsport software and predictive telemetry systems (e.g. <strong>RaceMind AI</strong>), raw high-frequency sensor readings are normalized and transformed into domain-engineered feature representations before model inference.
          </p>

          {engineeredFeatures && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">THROTTLE COMMITMENT</span>
                <span className="text-xl font-bold text-emerald-400">
                  {engineeredFeatures.throttleCommitmentPct}%
                </span>
                <span className="text-[9px] text-zinc-400 block mt-1">Wide-Open Throttle duty cycle</span>
              </div>

              <div className="bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">BRAKE AGGRESSION</span>
                <span className="text-xl font-bold text-red-400">
                  {engineeredFeatures.brakeDutyCyclePct}%
                </span>
                <span className="text-[9px] text-zinc-400 block mt-1">Normalized deceleration demand</span>
              </div>

              <div className="bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">STEERING SMOOTHNESS</span>
                <span className="text-xl font-bold text-cyan-400">
                  {engineeredFeatures.steeringSmoothnessIndex}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-1">Mean absolute jerk index</span>
              </div>

              <div className="bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">PEAK STINT VELOCITY</span>
                <span className="text-xl font-bold text-white">
                  {engineeredFeatures.topSpeedKmh} KM/H
                </span>
                <span className="text-[9px] text-zinc-400 block mt-1">Main straight speed trap</span>
              </div>

              <div className="bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">LAP DURATION TARGET</span>
                <span className="text-xl font-bold text-amber-400">
                  {engineeredFeatures.lapTime.toFixed(3)}s
                </span>
                <span className="text-[9px] text-zinc-400 block mt-1">Ground-truth regression label</span>
              </div>

              <div className="bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">FEATURE PIPELINE STATUS</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <Sparkles className="w-4 h-4" /> READY FOR INFERENCE
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Vector dim: 5D</span>
              </div>
            </div>
          )}

          {missionStep === "ANALYSE_FEATURES" && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => advanceMissionStep("ENGINEERING_DECISION")}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1.5 transition-colors uppercase text-[11px]"
              >
                <span>RETURN TO GARAGE FOR WHAT-IF DECISION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================
          TAB 2: REPRODUCIBLE ML BENCHMARK
          ==================================================== */}
      {activeTab === "ml_models" && (
        <div className="space-y-4">
          <p className="frontier-kicker">THE EXPERIMENT / {progress.status} · {progress.step}/3</p>
          <p>
            Fit a model locally, predict unseen examples, and compare it with a simple baseline. These are real computations on synthetic teaching datasets.
          </p>

          <div className="frontier-actions grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="text-zinc-300">
              Dataset
              <select
                value={dataset}
                onChange={(e) => {
                  setDataset(e.target.value as DatasetId);
                  setModel("linear");
                  reset();
                }}
                className="w-full bg-zinc-900 border border-zinc-700 p-1.5 text-white mt-1"
              >
                <option value="classification">Sensor alert classification</option>
                <option value="regression">Lap-time regression</option>
                <option value="forecast">Daily demand forecast</option>
              </select>
            </label>

            <label className="text-zinc-300">
              Model
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value as ModelId);
                  reset();
                }}
                className="w-full bg-zinc-900 border border-zinc-700 p-1.5 text-white mt-1"
              >
                <option value="linear">
                  {dataset === "classification" ? "Logistic regression" : "Regularised linear regression"}
                </option>
                {dataset === "classification" && <option value="stump">Decision stump (depth 1)</option>}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-zinc-300">
              Training iterations
              <input
                disabled={model === "stump"}
                type="number"
                min="10"
                max="2000"
                value={iterations}
                onChange={(e) => {
                  setIterations(Math.max(10, Math.min(2000, Number(e.target.value) || 10)));
                  reset();
                }}
                className="w-full bg-zinc-900 border border-zinc-700 p-1.5 text-white mt-1"
              />
            </label>

            <label className="text-zinc-300">
              L2 penalty
              <select
                disabled={model === "stump"}
                value={penalty}
                onChange={(e) => {
                  setPenalty(Number(e.target.value));
                  reset();
                }}
                className="w-full bg-zinc-900 border border-zinc-700 p-1.5 text-white mt-1"
              >
                <option value="0">0</option>
                <option value="0.01">0.01</option>
                <option value="1">1</option>
              </select>
            </label>
          </div>

          <p className="text-zinc-300">
            {data.description}
            <br />
            Features: {data.features.join(", ")}. Target: {data.target}.
          </p>

          <p className="text-[11px] text-zinc-400">
            144 training / 36 held-out rows.{" "}
            {dataset === "forecast"
              ? "Chronological: train days 0–143, test days 144–179. No future targets are used in fitting or baseline predictions."
              : "Fixed seeded shuffle; no overlapping row IDs. Normalisation fits on training data only."}
          </p>

          <div className="frontier-actions flex gap-2">
            <button
              onClick={inspect}
              className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold"
            >
              Inspect dataset and split
            </button>
            <button
              disabled={!inspected}
              onClick={run}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold"
            >
              Run experiment
            </button>
            <button onClick={reset} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white">
              Reset experiment
            </button>
          </div>

          {result && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-white uppercase">Held-out results</h4>
              <table data-testid="experiment-results" className="w-full text-left border border-zinc-800">
                <caption className="text-left text-zinc-400 pb-1">
                  Model vs {result.baselineName}
                </caption>
                <thead className="bg-zinc-900 text-zinc-400 text-[10px]">
                  <tr>
                    <th className="p-1.5 border-b border-zinc-800">Metric</th>
                    <th className="p-1.5 border-b border-zinc-800">Model</th>
                    <th className="p-1.5 border-b border-zinc-800">Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {Object.entries(result.metrics)
                    .filter(([k]) => !["tp", "tn", "fp", "fn"].includes(k))
                    .map(([k, v]) => (
                      <tr key={k}>
                        <th className="p-1.5 text-zinc-300 font-normal">{k.toUpperCase()}</th>
                        <td className="p-1.5 text-emerald-400 font-bold">{v.toFixed(4)}</td>
                        <td className="p-1.5 text-zinc-400">{result.baselineMetrics[k].toFixed(4)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <p className="text-[10px] text-zinc-400">
                Local fit and evaluation: {result.fitMs.toFixed(2)} ms on this browser. This is a single run, not a benchmark.
              </p>

              <button
                onClick={() => send("experiment", { type: "objective", name: "compare" })}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white"
              >
                Compare with baseline
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="frontier-actions flex flex-wrap gap-3 pt-3 border-t border-zinc-800 text-[11px]">
        <Link href="/projects/vyaparpulse" className="text-cyan-400 hover:underline">
          VyaparPulse evidence ↗
        </Link>
        <Link href="/projects/saksham" className="text-cyan-400 hover:underline">
          SAKSHAM evidence ↗
        </Link>
        <Link href="/projects/f1-lap-time-simulator" className="text-cyan-400 hover:underline">
          Lap-time engineering ↗
        </Link>
        <a
          href="https://github.com/T-Bone47/IGNICT"
          target="_blank"
          rel="noreferrer"
          className="text-cyan-400 hover:underline"
        >
          IGNICT repository ↗
        </a>
      </div>
    </div>
  );
}

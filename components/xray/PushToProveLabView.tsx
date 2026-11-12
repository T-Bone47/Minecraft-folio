"use client";

import React from "react";
import { useXRayStore } from "@/state/xrayStore";
import { PUSH_TO_PROVE_EXPERIMENTS } from "@/lib/xray/experimentRegistry";
import { Play, CheckCircle2, AlertOctagon, Terminal, ExternalLink, Sliders } from "lucide-react";

export const PushToProveLabView: React.FC = () => {
  const activeId = useXRayStore((s) => s.labExperimentId);
  const params = useXRayStore((s) => s.labParams);
  const output = useXRayStore((s) => s.labOutput);
  const validation = useXRayStore((s) => s.labValidation);

  const setExperimentId = useXRayStore((s) => s.setLabExperimentId);
  const setParams = useXRayStore((s) => s.setLabParams);
  const runExperiment = useXRayStore((s) => s.runLabExperiment);

  const activeExp = PUSH_TO_PROVE_EXPERIMENTS.find((e) => e.id === activeId) || PUSH_TO_PROVE_EXPERIMENTS[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-zinc-200">
      {/* 1. Experiment Selector Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2">
          Push-to-Prove Laboratories ({PUSH_TO_PROVE_EXPERIMENTS.length})
        </div>
        <div className="space-y-2">
          {PUSH_TO_PROVE_EXPERIMENTS.map((exp) => {
            const isSelected = exp.id === activeExp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setExperimentId(exp.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-900/20"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 w-fit mb-1.5">
                  {exp.subsystem.replace("_", " ")}
                </div>
                <div className="text-xs font-semibold text-zinc-100">{exp.title}</div>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Execution Sandbox Notice
          </div>
          <p>
            Zero mock strings or simulated graphics. Calculations are executed in pure deterministic TypeScript
            functions directly in your browser.
          </p>
        </div>
      </div>

      {/* 2. Main Experiment Canvas */}
      <div className="flex-1 space-y-5 bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
            LABORATORY SPECIFICATION
          </div>
          <h2 className="text-lg font-bold text-zinc-100 mb-1">{activeExp.title}</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">{activeExp.problemStatement}</p>
        </div>

        {/* Algorithm Summary */}
        <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Mathematical & Algorithmic Formulation
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">{activeExp.algorithmSummary}</p>
        </div>

        {/* Interactive Parameter Controls */}
        <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Adjust Bounded Parameters
            </span>
            <button
              onClick={runExperiment}
              className="flex items-center gap-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs rounded-md shadow-lg shadow-cyan-950 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              RUN ALGORITHM
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {activeExp.id === "exp_motorsport_telemetry" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-zinc-300">
                    <span>Visitor Pace Multiplier:</span>
                    <span className="font-mono text-cyan-400">{params.visitorSpeedMultiplier ?? 1.0}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.02"
                    value={params.visitorSpeedMultiplier ?? 1.0}
                    onChange={(e) => {
                      setParams({ visitorSpeedMultiplier: parseFloat(e.target.value) });
                      runExperiment();
                    }}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-zinc-500">0.8x (Slower) to 1.2x (Faster than reference)</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-zinc-300">
                    <span>Spatial Step Grid:</span>
                    <span className="font-mono text-cyan-400">{params.interpolationStepM ?? 2.0}m</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.5"
                    value={params.interpolationStepM ?? 2.0}
                    onChange={(e) => {
                      setParams({ interpolationStepM: parseFloat(e.target.value) });
                      runExperiment();
                    }}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-zinc-500">Spatial delta integration resolution (ds)</span>
                </div>
              </>
            )}

            {activeExp.id === "exp_aiml_evaluation" && (
              <>
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded border border-zinc-800">
                  <div>
                    <div className="font-semibold text-zinc-200">Include Leaking Target Column</div>
                    <div className="text-[10px] text-zinc-400">futureLapTime correlated feature</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={params.includeLeakageFeature ?? false}
                    onChange={(e) => {
                      setParams({ includeLeakageFeature: e.target.checked });
                      runExperiment();
                    }}
                    className="w-4 h-4 accent-red-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-zinc-300">
                    <span>Train/Test Split Ratio:</span>
                    <span className="font-mono text-cyan-400">{Math.round((params.trainSplitRatio ?? 0.8) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.9"
                    step="0.05"
                    value={params.trainSplitRatio ?? 0.8}
                    onChange={(e) => {
                      setParams({ trainSplitRatio: parseFloat(e.target.value) });
                      runExperiment();
                    }}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-zinc-500">Hold-out dataset validation boundary</span>
                </div>
              </>
            )}

            {activeExp.id === "exp_systems_reliability" && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-zinc-300 font-semibold mb-1">Controlled Fault to Inject:</label>
                  <select
                    value={params.faultToInject ?? "OUT_OF_ORDER_TIMESTAMP"}
                    onChange={(e) => {
                      setParams({ faultToInject: e.target.value });
                      runExperiment();
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 rounded p-2 text-xs font-mono"
                  >
                    <option value="NONE">NONE (Clean Streaming Baseline)</option>
                    <option value="DUPLICATE_PACKET">DUPLICATE_PACKET (Network Frame Echo)</option>
                    <option value="OUT_OF_ORDER_TIMESTAMP">OUT_OF_ORDER_TIMESTAMP (UDP Reordering)</option>
                    <option value="SCHEMA_CORRUPTION">SCHEMA_CORRUPTION (Malformed NaN Payload)</option>
                    <option value="CLOCK_DRIFT">CLOCK_DRIFT (Sensor Jitter Gap)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded border border-zinc-800">
                  <div>
                    <div className="font-semibold text-zinc-200">Pipeline Invariant Auto-Repair</div>
                    <div className="text-[10px] text-zinc-400">Strict monotonicity re-sequencing</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={params.autoRepairEnabled ?? true}
                    onChange={(e) => {
                      setParams({ autoRepairEnabled: e.target.checked });
                      runExperiment();
                    }}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Execution Output */}
        {output && validation && (
          <div className="space-y-4">
            {/* Validation Banner */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                validation.passed
                  ? "bg-emerald-950/30 border-emerald-800 text-emerald-200"
                  : "bg-red-950/30 border-red-800 text-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {validation.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span>{validation.message}</span>
              </div>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-xs">
                {output.verdict}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              {Object.entries(validation.metrics).map(([key, val]) => (
                <div key={key} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="text-[10px] uppercase text-zinc-500 truncate">{key}</div>
                  <div className="text-sm font-bold text-cyan-400 mt-1">{String(val)}</div>
                </div>
              ))}
            </div>

            {/* Specific Visuals */}
            {activeExp.id === "exp_motorsport_telemetry" && output.cornerInsights && (
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-2">
                <div className="font-semibold text-zinc-300">Sector Split Deltas & Corner Breakdown:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  {output.sectorDeltas.map((s: number, i: number) => (
                    <div key={i} className="p-2 bg-zinc-900 rounded border border-zinc-800">
                      <div className="text-zinc-500">Sector {i + 1}</div>
                      <div className={s > 0 ? "text-red-400" : "text-emerald-400"}>
                        {s > 0 ? `+${s}s` : `${s}s`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Source References */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-3 border-t border-zinc-800">
          <span>Source: {activeExp.sourceRef.file}</span>
          <span className="text-cyan-400 flex items-center gap-1">
            Test: {activeExp.sourceRef.testFile} <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};


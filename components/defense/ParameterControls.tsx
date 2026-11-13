/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Arena: Parameter Controls Component
 */

"use client";

import React from "react";
import type { DefenseTrackConfig } from "@/lib/defense/scenarioRegistry";
import { useDefenseStore } from "@/state/defenseStore";

interface ParameterControlsProps {
  track: DefenseTrackConfig;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({ track }) => {
  const { parameters, updateParameter, resetParameters, runSimulation, setActiveTab } =
    useDefenseStore();

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-bold font-mono text-white tracking-wider uppercase">
            Parameter Stress Lab: {track.shortTitle}
          </h2>
          <p className="text-xs text-zinc-400">
            Adjust system boundaries, fault rates, or discretization steps to test invariant limits.
          </p>
        </div>
        <button
          type="button"
          onClick={resetParameters}
          className="text-[11px] font-mono px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-colors"
        >
          Reset Defaults
        </button>
      </div>

      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {track.parameters.map((param) => {
          const val = parameters[param.id] ?? param.defaultValue;

          return (
            <div
              key={param.id}
              className="bg-[#12151c] border border-zinc-800 rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`param-${param.id}`}
                    className="text-xs font-mono font-bold text-zinc-200"
                  >
                    {param.name}
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    {val} {param.unit || ""}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mb-3 leading-normal">
                  {param.description}
                </p>
              </div>

              {param.type === "number" ? (
                <div className="flex flex-col gap-1 pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      id={`param-${param.id}`}
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={Number(val)}
                      onChange={(e) => updateParameter(param.id, Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>
                      {param.min} {param.unit}
                    </span>
                    <span>
                      Default: {param.defaultValue} {param.unit}
                    </span>
                    <span>
                      {param.max} {param.unit}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <select
                    id={`param-${param.id}`}
                    value={val}
                    onChange={(e) => updateParameter(param.id, e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {param.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Run Simulation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("briefing")}
          className="text-xs font-mono text-zinc-400 hover:text-white"
        >
          ← Return to Briefing
        </button>

        <button
          type="button"
          onClick={runSimulation}
          className="text-xs font-mono font-bold px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2"
        >
          <span>Execute Simulation Experiment</span>
          <span>⚡</span>
        </button>
      </div>
    </div>
  );
};


"use client";

import React, { useState } from "react";
import { CANONICAL_CIRCUITS } from "@/lib/silicon/circuitRegistry";
import { SiliconCircuit } from "@/lib/silicon/types";
import {
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileText,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Radio,
} from "lucide-react";

export const VoxelSiliconInspector: React.FC = () => {
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>("abs-interlock");
  const circuit: SiliconCircuit = CANONICAL_CIRCUITS[selectedCircuitId] || CANONICAL_CIRCUITS["abs-interlock"];

  // Initialize input state from circuit default values
  const [inputs, setInputs] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    circuit.inputs.forEach((p) => {
      init[p.id] = p.defaultValue;
    });
    return init;
  });

  const [activeTab, setActiveTab] = useState<"truth" | "code" | "math">("truth");

  // Handle circuit change
  const handleSelectCircuit = (id: string) => {
    setSelectedCircuitId(id);
    const newCircuit = CANONICAL_CIRCUITS[id];
    const newInputs: Record<string, boolean> = {};
    newCircuit.inputs.forEach((p) => {
      newInputs[p.id] = p.defaultValue;
    });
    setInputs(newInputs);
  };

  // Toggle input pin
  const handleToggleInput = (pinId: string) => {
    setInputs((prev) => ({
      ...prev,
      [pinId]: !prev[pinId],
    }));
  };

  // Evaluate current circuit state
  const evaluation = circuit.evaluate(inputs);
  const currentOutputs = evaluation.outputs;

  // Find active truth table row
  const activeTableRowIndex = circuit.truthTable.findIndex((row) => {
    return Object.entries(row.inputs).every(([k, v]) => !!inputs[k] === !!v);
  });

  return (
    <div className="space-y-6 font-mono">
      {/* 1. TOP HEADER & CIRCUIT SWITCHER */}
      <div className="bg-[#18191E] border-4 border-[#262A31] p-4 sm:p-6 shadow-[0_6px_0_#0D0E12] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#262A31] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-950 border border-red-500 text-red-400 font-pixel text-[9px] uppercase mc-text-shadow">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>REDSTONE-TO-SILICON LOGIC LABORATORY</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase tracking-wide mt-2">
              VOXEL SILICON & VEHICLE LOGIC GATES
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
              Inspect how low-level computer architecture, digital logic gates, and Minecraft Redstone circuits
              execute real-world motorsport telemetry, active safety interlocks, and ECU decision engines.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#101115] border border-[#2B2E37] px-3 py-1.5 text-right">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">LATENCY BUDGET</span>
              <span className="font-pixel text-xs text-yellow-400">
                {circuit.latencyBudgetMicroseconds} µs (Real-Time)
              </span>
            </div>
            <div className="bg-[#101115] border border-[#2B2E37] px-3 py-1.5 text-right">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">PHYSICS CLOCK</span>
              <span className="font-pixel text-xs text-[#00d2be]">60 Hz Monotonic</span>
            </div>
          </div>
        </div>

        {/* CIRCUIT TABS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.values(CANONICAL_CIRCUITS).map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCircuit(c.id)}
              className={`p-3 text-left border-2 transition-all ${
                selectedCircuitId === c.id
                  ? "bg-[#252830] border-[#EF4444] text-white shadow-[0_2px_0_#EF4444]"
                  : "bg-[#141519] border-[#2B2E37] text-zinc-400 hover:text-white hover:border-zinc-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] text-zinc-500 uppercase">{c.domain}</span>
                {selectedCircuitId === c.id && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <div className="font-pixel text-xs text-white uppercase mt-1 truncate">{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE TEST BENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* LEFT: LEVER SWITCHBOARD (4 COLS)                          */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 bg-[#141519] border-4 border-[#262A31] p-4 sm:p-5 space-y-4 shadow-[0_4px_0_#0D0E12]">
          <div className="flex items-center justify-between border-b-2 border-[#262A31] pb-2">
            <span className="font-pixel text-xs text-white uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500" />
              <span>VOXEL INPUT LEVERS</span>
            </span>
            <span className="text-[9px] font-pixel text-zinc-400">CLICK TO TOGGLE</span>
          </div>

          <div className="space-y-3">
            {circuit.inputs.map((pin) => {
              const isHigh = !!inputs[pin.id];
              return (
                <div
                  key={pin.id}
                  onClick={() => handleToggleInput(pin.id)}
                  className={`cursor-pointer p-3 border-2 transition-all select-none ${
                    isHigh
                      ? "bg-[#2A1616] border-[#EF4444] shadow-[inset_0_0_12px_rgba(239,68,68,0.25)]"
                      : "bg-[#101115] border-[#22242B] opacity-75 hover:opacity-100 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-white">{pin.label}</span>
                    <div
                      className={`font-pixel text-[10px] px-2 py-0.5 border ${
                        isHigh
                          ? "bg-red-950 text-red-300 border-red-500"
                          : "bg-zinc-900 text-zinc-500 border-zinc-700"
                      }`}
                    >
                      {isHigh ? "STATE: 1 [HIGH]" : "STATE: 0 [LOW]"}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-1.5 leading-snug">
                    {pin.description}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[9px] text-zinc-500">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isHigh ? "#EF4444" : "#3F3F46" }} />
                    <span>Redstone Signal: {isHigh ? "Strength 15" : "Strength 0"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#0D0E12] border border-[#22242B] p-3 text-[10px] text-zinc-400 space-y-1">
            <span className="font-pixel text-[9px] text-yellow-400 uppercase block">HARDWARE TIMING</span>
            <div>• Clock: Deterministic single-cycle propagation</div>
            <div>• Redstone Delay: 1 Redstone Tick = 100 ms</div>
            <div>• Logic Family: CMOS 3.3V Low-Power Logic</div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER: SCHEMATIC & OUTPUT LAMPS (8 COLS)                 */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* SCHEMATIC VISUALIZER */}
          <div className="bg-[#101115] border-4 border-[#262A31] p-4 sm:p-5 space-y-4 shadow-[0_4px_0_#0D0E12]">
            <div className="flex items-center justify-between border-b-2 border-[#262A31] pb-2">
              <span className="font-pixel text-xs text-white uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>REDSTONE CONDUIT & SILICON GATE TOPOLOGY</span>
              </span>
              <span className="font-pixel text-[9px] text-[#00d2be]">
                EQUIVALENCE: 100% GROUNDED
              </span>
            </div>

            {/* Redstone Dust & Components Flow Matrix */}
            <div className="bg-[#090A0D] border-2 border-[#22242B] p-4 space-y-4 relative overflow-hidden">
              <div className="text-[10px] text-zinc-400">
                ACTIVE CIRCUIT: <strong className="text-white">{circuit.name}</strong>
              </div>

              {/* Dynamic Components Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {circuit.redstoneComponents.map((comp) => {
                  return (
                    <div
                      key={comp.id}
                      className="bg-[#15161A] border border-[#2B2E37] p-2.5 space-y-1 hover:border-zinc-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-pixel text-[9px] text-yellow-400 uppercase">{comp.label}</span>
                        <span className="text-[8px] font-pixel px-1 bg-zinc-800 text-zinc-300">
                          {comp.siliconGate}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-300">{comp.redstoneEquivalent}</div>
                      <div className="text-[9px] text-zinc-500 leading-tight">Role: {comp.role}</div>
                    </div>
                  );
                })}
              </div>

              {/* Formula & Boolean Equation */}
              <div className="bg-[#141519] border border-[#2B2E37] p-3 text-center space-y-1">
                <span className="font-pixel text-[9px] text-zinc-400 uppercase block">
                  BOOLEAN LOGIC EQUATION
                </span>
                <div className="font-mono text-sm text-[#00d2be] font-bold">
                  <code>{circuit.booleanFormula}</code>
                </div>
              </div>
            </div>

            {/* OUTPUT LAMPS DISPLAY */}
            <div className="space-y-2">
              <span className="font-pixel text-[10px] text-zinc-400 uppercase tracking-wider block">
                ACTUATOR OUTPUTS & DASHBOARD STATUS LAMPS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {circuit.outputs.map((out) => {
                  const isHigh = !!currentOutputs[out.id];
                  return (
                    <div
                      key={out.id}
                      className={`p-3.5 border-2 transition-all flex items-center justify-between ${
                        isHigh
                          ? "bg-[#2B230B] border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.35)]"
                          : "bg-[#101115] border-[#22242B]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 border ${
                              isHigh
                                ? "bg-yellow-400 border-white shadow-[0_0_8px_#fde047]"
                                : "bg-zinc-800 border-zinc-700"
                            }`}
                          />
                          <span className="font-pixel text-xs text-white uppercase">{out.label}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 max-w-xs">{out.description}</p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-pixel text-xs px-2 py-1 border block ${
                            isHigh
                              ? "bg-yellow-950 text-yellow-300 border-yellow-500"
                              : "bg-zinc-900 text-zinc-500 border-zinc-700"
                          }`}
                        >
                          {isHigh ? "ACTIVE [1]" : "OFF [0]"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LOWER TABS: TRUTH TABLE / ECU FIRMWARE / MATH */}
          <div className="bg-[#141519] border-4 border-[#262A31] p-4 sm:p-5 space-y-4 shadow-[0_4px_0_#0D0E12]">
            <div className="flex items-center gap-2 border-b-2 border-[#262A31] pb-2">
              {[
                { id: "truth", label: "LIVE TRUTH TABLE", icon: Activity },
                { id: "code", label: "ECU C++ FIRMWARE", icon: Code2 },
                { id: "math", label: "PHYSICAL DERIVATION", icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 border ${
                      activeTab === tab.id
                        ? "bg-[#252830] border-[#00d2be] text-white"
                        : "bg-[#101115] border-[#22242B] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: TRUTH TABLE */}
            {activeTab === "truth" && (
              <div className="space-y-2 overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B2E37] text-zinc-400 font-pixel text-[9px]">
                      <th className="p-2">ROW</th>
                      <th className="p-2">INPUTS</th>
                      <th className="p-2">OUTPUTS</th>
                      <th className="p-2">OPERATIONAL MEANING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {circuit.truthTable.map((row, idx) => {
                      const isCurrentRow = idx === activeTableRowIndex;
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-[#1E2026] transition-colors ${
                            isCurrentRow
                              ? "bg-emerald-950/40 border-l-4 border-l-emerald-500 font-bold"
                              : "hover:bg-[#1C1E24]"
                          }`}
                        >
                          <td className="p-2 font-pixel text-[9px] text-zinc-500">
                            #{idx + 1} {isCurrentRow && "◄ ACTIVE"}
                          </td>
                          <td className="p-2 text-zinc-300">
                            {Object.entries(row.inputs)
                              .map(([k, v]) => `${k}:${v ? "1" : "0"}`)
                              .join(" ")}
                          </td>
                          <td className="p-2">
                            <span
                              className={`font-pixel text-[10px] ${
                                Object.values(row.outputs).some((v) => v)
                                  ? "text-yellow-400"
                                  : "text-zinc-500"
                              }`}
                            >
                              {Object.entries(row.outputs)
                                .map(([k, v]) => `${k}:${v ? "1" : "0"}`)
                                .join(" ")}
                            </span>
                          </td>
                          <td className="p-2 text-zinc-400 text-[10px]">
                            {row.conditionLabel || "Normal state"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: ECU C++ FIRMWARE */}
            {activeTab === "code" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span>EMBEDDED AUTOMOTIVE FIRMWARE IMPLEMENTATION</span>
                  <span>LANGUAGE: C++20 / AUTOSAR</span>
                </div>
                <pre className="bg-[#090A0D] border border-[#22242B] p-3 text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{circuit.ecuFirmwareCpp}</code>
                </pre>
              </div>
            )}

            {/* TAB 3: PHYSICAL DERIVATION */}
            {activeTab === "math" && (
              <div className="space-y-3 bg-[#090A0D] border border-[#22242B] p-4 text-xs text-zinc-300">
                <span className="font-pixel text-xs text-white uppercase block">
                  PHYSICAL VEHICLE KINEMATICS & DERIVATION
                </span>
                <div className="bg-[#141519] border border-[#2B2E37] p-3 text-center text-sm font-mono text-yellow-300">
                  <code>{circuit.physicalEquation}</code>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  {circuit.description}
                </p>
                <div className="text-[10px] text-zinc-500 pt-2 border-t border-[#22242B]">
                  Grounded in PACEJKA 1994 tire telemetry analysis and FIA Formula 1 sporting regulations.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

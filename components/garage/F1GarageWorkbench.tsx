"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wrench,
  Gauge,
  Wind,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Activity,
  Layers,
  ChevronRight,
  Zap,
} from "lucide-react";
import { GARAGE_CIRCUITS, DEFAULT_SETUP_PARAMETERS, SETUP_PRESETS } from "@/lib/garage/circuits";
import { simulateVehicleSetup } from "@/lib/garage/vehicleSetupEngine";
import { VehicleSetupParameters, CircuitSetupTarget } from "@/lib/garage/types";

export function F1GarageWorkbench() {
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>("monza");
  const [setup, setSetup] = useState<VehicleSetupParameters>({ ...DEFAULT_SETUP_PARAMETERS });
  const [copied, setCopied] = useState(false);
  const [appliedToCar, setAppliedToCar] = useState(false);

  const selectedCircuit = useMemo(() => {
    return GARAGE_CIRCUITS.find((c) => c.id === selectedCircuitId) || GARAGE_CIRCUITS[0];
  }, [selectedCircuitId]);

  const simResult = useMemo(() => {
    return simulateVehicleSetup(setup, selectedCircuit);
  }, [setup, selectedCircuit]);

  const handleUpdate = <K extends keyof VehicleSetupParameters>(
    key: K,
    val: VehicleSetupParameters[K]
  ) => {
    setSetup((prev) => ({ ...prev, [key]: val }));
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = SETUP_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSetup({ ...preset.setup });
      setSelectedCircuitId(preset.circuitId);
    }
  };

  const handleCopyManifest = () => {
    const manifest = {
      engineer: "Asish Oliver M",
      circuit: selectedCircuit.name,
      setupParameters: setup,
      simulationOutputs: {
        topSpeedKmh: simResult.topSpeedKmh,
        lapTime: simResult.simulatedLapTimeFormatted,
        deltaToRecord: simResult.deltaToRecordSec,
        liftCl: simResult.liftCoefficientCl,
        dragCd: simResult.dragCoefficientCd,
        aeroEfficiency: simResult.aeroEfficiencyLd,
        aeroBalancePct: simResult.aeroBalancePct,
        porpoisingRisk: simResult.porpoisingRisk,
        handling: simResult.handlingCharacteristic,
      },
      verifiedAt: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleApplyToCar = () => {
    try {
      localStorage.setItem("f1_garage_custom_setup", JSON.stringify(setup));
      setAppliedToCar(true);
      setTimeout(() => setAppliedToCar(false), 2500);
    } catch {
      // Storage unavailable fallback
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="mc-panel p-6 border-b-4 border-amber-600/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-pixel bg-amber-950/80 text-amber-300 border border-amber-500/50 uppercase tracking-widest">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                VEHICLE DYNAMICS BENCH · 2026 SPEC
              </span>
              <span className="font-pixel text-[9px] text-zinc-400">
                AERODYNAMICS & CHASSIS LAB
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-pixel text-zinc-100 tracking-wider">
              F1 GARAGE & AERODYNAMIC SETUP WORKBENCH
            </h1>
            <p className="text-sm text-zinc-300 mt-1 max-w-3xl leading-relaxed">
              Quasi-static physical simulation modeling Venturi underfloor ground effects, wing incidence angles, suspension heave rates, and brake bias. Calibrated to live telemetry and lap records across canonical Grand Prix circuits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleCopyManifest}
              className="mc-button px-3.5 py-2 text-xs flex items-center gap-2 font-mono text-zinc-200 hover:text-white"
              title="Copy setup JSON manifest to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? "MANIFEST COPIED" : "EXPORT SHEET (JSON)"}</span>
            </button>
            <button
              onClick={handleApplyToCar}
              className="mc-button px-3.5 py-2 text-xs flex items-center gap-2 font-mono bg-amber-900/40 border-amber-500 text-amber-200 hover:bg-amber-800/50"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{appliedToCar ? "SYNCED TO 3D CAR!" : "APPLY TO 3D CAR"}</span>
            </button>
          </div>
        </div>

        {/* Quick Circuit Switcher */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-amber-400 font-pixel text-[10px]">SELECT TRACK:</span>
            <div className="flex flex-wrap gap-1.5">
              {GARAGE_CIRCUITS.map((circuit) => (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuitId(circuit.id)}
                  className={`px-3 py-1 font-pixel text-[10px] transition-all ${
                    selectedCircuitId === circuit.id
                      ? "bg-amber-600 text-black border border-amber-300 shadow-md"
                      : "bg-zinc-800/80 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                  }`}
                >
                  {circuit.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <span className="text-zinc-500 text-[10px] font-pixel">PRESETS:</span>
            {SETUP_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset.id)}
                className="px-2 py-0.5 bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:border-amber-400 hover:text-amber-300 text-[10px]"
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Gauges + Car Schematic + Setup Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real-time Telemetry & Performance Gauges (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Primary Performance HUD */}
          <div className="mc-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-pixel text-[11px] text-amber-400 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-400" />
                SIMULATED TELEMETRY GAUGES
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                {selectedCircuit.name}
              </span>
            </div>

            {/* Lap Time & Delta Box */}
            <div className="mc-slot-box p-4 bg-black/60 border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">SIMULATED LAP TIME</span>
                <span className={`text-[10px] font-pixel px-2 py-0.5 border ${
                  simResult.deltaToRecordSec <= 0
                    ? "bg-emerald-950 text-emerald-400 border-emerald-500"
                    : "bg-rose-950 text-rose-400 border-rose-500"
                }`}>
                  DELTA: {simResult.deltaToRecordSec > 0 ? `+${simResult.deltaToRecordSec}s` : `${simResult.deltaToRecordSec}s`}
                </span>
              </div>
              <div className="text-3xl font-pixel text-zinc-100 tracking-wider mt-1 text-emerald-300">
                {simResult.simulatedLapTimeFormatted}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 mt-1 flex justify-between">
                <span>BENCHMARK RECORD: {selectedCircuit.trackRecordTimeSec}s</span>
                <span className="text-zinc-500">({selectedCircuit.trackRecordDriver.split("/")[0].trim()})</span>
              </div>
            </div>

            {/* 4 Metric Pills */}
            <div className="grid grid-cols-2 gap-3">
              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">V-MAX TOP SPEED</div>
                <div className="text-xl font-pixel text-amber-300 mt-0.5">
                  {simResult.topSpeedKmh} <span className="text-[10px] text-zinc-400 font-mono">KM/H</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  {(simResult.topSpeedKmh / 1.609).toFixed(0)} MPH · Gear 8
                </div>
              </div>

              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">AERO EFFICIENCY (L/D)</div>
                <div className="text-xl font-pixel text-cyan-300 mt-0.5">
                  {simResult.aeroEfficiencyLd} <span className="text-[10px] text-zinc-400 font-mono">RATIO</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  Cl: {simResult.liftCoefficientCl} | Cd: {simResult.dragCoefficientCd}
                </div>
              </div>

              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">PEAK LATERAL G</div>
                <div className="text-xl font-pixel text-rose-300 mt-0.5">
                  {simResult.peakLateralG} <span className="text-[10px] text-zinc-400 font-mono">G</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  Apex grip envelope
                </div>
              </div>

              <div className="mc-slot-box p-3 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-pixel text-zinc-400">AERO BALANCE</div>
                <div className="text-xl font-pixel text-emerald-300 mt-0.5">
                  {simResult.aeroBalancePct}% <span className="text-[10px] text-zinc-400 font-mono">FRONT</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  Target: {selectedCircuit.optimalAeroBalance}%
                </div>
              </div>
            </div>

            {/* Invariant Warnings & Porpoising Monitor */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
                  GROUND-EFFECT PORPOISING STATUS:
                </span>
                <span
                  className={`font-pixel text-[9px] px-2 py-0.5 border ${
                    simResult.porpoisingRisk === "none"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500"
                      : simResult.porpoisingRisk === "moderate"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500"
                      : "bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse"
                  }`}
                >
                  {simResult.porpoisingRisk === "none"
                    ? "NOMINAL (SAFE)"
                    : simResult.porpoisingRisk === "moderate"
                    ? "WARN: BUMP OSCILLATION"
                    : "CRITICAL: FLOOR STALL & PORPOISE"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-zinc-400" />
                  HANDLING DYNAMICS:
                </span>
                <span
                  className={`font-pixel text-[9px] px-2 py-0.5 border ${
                    simResult.handlingCharacteristic === "neutral"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500"
                      : simResult.handlingCharacteristic === "understeer"
                      ? "bg-cyan-950/80 text-cyan-300 border-cyan-500"
                      : "bg-amber-950/80 text-amber-300 border-amber-500"
                  }`}
                >
                  {simResult.handlingCharacteristic.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Speed Curve SVG */}
          <div className="mc-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[10px] text-zinc-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                SIMULATED LAP VELOCITY TRACE (KM/H)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">10 SPATIAL SECTORS</span>
            </div>

            <div className="relative h-28 bg-black/60 border border-zinc-800 p-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />

                {/* Speed polyline */}
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  points={simResult.telemetrySpeedCurve
                    .map((pt, idx) => {
                      const x = (idx / (simResult.telemetrySpeedCurve.length - 1)) * 400;
                      // Speed maps from 50 km/h (y=95) to 370 km/h (y=10)
                      const y = 95 - ((pt.speedKmh - 50) / 320) * 85;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* Apex markers */}
                {simResult.telemetrySpeedCurve.map((pt, idx) => {
                  const x = (idx / (simResult.telemetrySpeedCurve.length - 1)) * 400;
                  const y = 95 - ((pt.speedKmh - 50) / 320) * 85;
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="#18181b"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>START / T1</span>
              <span>SECTOR 2 HIGH-G</span>
              <span>PARABOLICA / S3</span>
            </div>
          </div>
        </div>

        {/* Right Column: Setup Sliders & Mechanical Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="mc-panel p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-pixel text-[11px] text-amber-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                AERODYNAMIC & CHASSIS PARAMETER TUNING
              </span>
              <button
                onClick={() => setSetup({ ...DEFAULT_SETUP_PARAMETERS })}
                className="text-[10px] font-mono text-zinc-400 hover:text-amber-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                RESET DEFAULTS
              </button>
            </div>

            {/* Aerodynamics Category */}
            <div className="space-y-4">
              <div className="text-[11px] font-pixel text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 inline-block" />
                WING ANGLES & DRS CONFIGURATION
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front Wing */}
                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Front Wing Angle</span>
                    <span className="font-pixel text-amber-300">{setup.frontWingAngleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    step="1"
                    value={setup.frontWingAngleDeg}
                    onChange={(e) => handleUpdate("frontWingAngleDeg", parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>10° (Low Drag)</span>
                    <span>45° (Max Bite)</span>
                  </div>
                </div>

                {/* Rear Wing */}
                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Rear Wing Angle</span>
                    <span className="font-pixel text-amber-300">{setup.rearWingAngleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="55"
                    step="1"
                    value={setup.rearWingAngleDeg}
                    onChange={(e) => handleUpdate("rearWingAngleDeg", parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>15° (Monza Trim)</span>
                    <span>55° (Monaco Wall)</span>
                  </div>
                </div>
              </div>

              {/* Toggles: Gurney flap and DRS Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between mc-slot-box p-3 bg-zinc-900/60">
                  <div>
                    <div className="text-xs font-mono text-zinc-200">Gurney Flap Strip</div>
                    <div className="text-[10px] text-zinc-500">+0.12 Cl, trailing vortex</div>
                  </div>
                  <button
                    onClick={() => handleUpdate("gurneyFlapEnabled", !setup.gurneyFlapEnabled)}
                    className={`px-3 py-1 font-pixel text-[10px] border transition-all ${
                      setup.gurneyFlapEnabled
                        ? "bg-amber-600 text-black border-amber-300"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                    }`}
                  >
                    {setup.gurneyFlapEnabled ? "ATTACHED" : "OFF"}
                  </button>
                </div>

                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="text-xs font-mono text-zinc-200">DRS Wing Package</div>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {(["monza_low_drag", "balanced", "monaco_high_downforce"] as const).map((prof) => (
                      <button
                        key={prof}
                        onClick={() => handleUpdate("drsProfile", prof)}
                        className={`py-1 text-[9px] font-pixel border text-center transition-all ${
                          setup.drsProfile === prof
                            ? "bg-amber-600 text-black border-amber-300"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        {prof === "monza_low_drag" ? "SKINNY" : prof === "balanced" ? "BALANCED" : "MAX-DF"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suspension & Ground Effect Category */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="text-[11px] font-pixel text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 inline-block" />
                SUSPENSION HEAVE & VENTURI TUNNEL RAKE
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front Ride Height */}
                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Front Ride Height</span>
                    <span className={`font-pixel ${setup.frontRideHeightMm <= 22 ? "text-rose-400 animate-pulse" : "text-cyan-300"}`}>
                      {setup.frontRideHeightMm} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="45"
                    step="1"
                    value={setup.frontRideHeightMm}
                    onChange={(e) => handleUpdate("frontRideHeightMm", parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span className="text-rose-400">20mm (Stall)</span>
                    <span>45mm (High)</span>
                  </div>
                </div>

                {/* Rear Ride Height */}
                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Rear Ride Height (Rake)</span>
                    <span className="font-pixel text-cyan-300">{setup.rearRideHeightMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="55"
                    max="105"
                    step="1"
                    value={setup.rearRideHeightMm}
                    onChange={(e) => handleUpdate("rearRideHeightMm", parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>55mm (Flat)</span>
                    <span>105mm (High Rake)</span>
                  </div>
                </div>

                {/* Front Spring Stiffness */}
                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Front Spring Rate</span>
                    <span className="font-pixel text-cyan-300">{setup.frontSpringRateNmm} N/mm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="240"
                    step="5"
                    value={setup.frontSpringRateNmm}
                    onChange={(e) => handleUpdate("frontSpringRateNmm", parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>120 N/mm (Soft)</span>
                    <span>240 N/mm (Rigid)</span>
                  </div>
                </div>

                {/* Brake Bias */}
                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Front Brake Bias</span>
                    <span className="font-pixel text-rose-300">{setup.brakeBiasPct.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="62"
                    step="0.5"
                    value={setup.brakeBiasPct}
                    onChange={(e) => handleUpdate("brakeBiasPct", parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>50% (Rear Lock)</span>
                    <span>62% (Front Lock)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Powertrain ERS & Diff */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="text-[11px] font-pixel text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 inline-block" />
                POWERTRAIN ERS & TRACTION DIFFERENTIAL
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Throttle Differential</span>
                    <span className="font-pixel text-emerald-300">{setup.differentialOnThrottlePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={setup.differentialOnThrottlePct}
                    onChange={(e) => handleUpdate("differentialOnThrottlePct", parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>50% (Open - Traction)</span>
                    <span>100% (Spool - Snap)</span>
                  </div>
                </div>

                <div className="space-y-1.5 mc-slot-box p-3 bg-zinc-900/60">
                  <div className="text-xs font-mono text-zinc-200">ERS Deployment Mode</div>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {(["qualifying_hotlap", "balanced_race", "overtake_boost"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => handleUpdate("ersDeploymentMode", m)}
                        className={`py-1 text-[8px] font-pixel border text-center transition-all ${
                          setup.ersDeploymentMode === m
                            ? "bg-emerald-600 text-black border-emerald-300"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        {m === "qualifying_hotlap" ? "HOTLAP" : m === "balanced_race" ? "RACE" : "BOOST"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Back to Campus & Telemetry */}
      <div className="mc-panel p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <Link href="/telemetry" className="text-amber-400 hover:underline flex items-center gap-1 font-pixel text-[10px]">
            ← FASTF1 OVERLAY
          </Link>
          <span className="text-zinc-600">·</span>
          <Link href="/chaos" className="text-zinc-300 hover:text-white flex items-center gap-1">
            CHAOS STRESS LAB
          </Link>
          <span className="text-zinc-600">·</span>
          <Link href="/silicon" className="text-zinc-300 hover:text-white flex items-center gap-1">
            VOXEL REDSTONE SILICON
          </Link>
        </div>

        <Link
          href="/world"
          className="mc-button px-4 py-1.5 text-xs font-pixel text-zinc-100 flex items-center gap-2 hover:bg-red-700"
        >
          <span>ENTER 3D CIRCUIT WITH THIS SETUP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

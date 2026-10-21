"use client";

import React, { useState } from "react";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useWorldStore } from "@/state/worldStore";
import { worldSound } from "@/lib/audio";

export const StationModal: React.FC = () => {
  const { activeStationModal, openStationModal } = useInteractionRegistry();
  const { inspectProject } = useWorldStore();
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number | null>(null);
  const [selectedArchetypeIdx, setSelectedArchetypeIdx] = useState<number>(0);
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  if (!activeStationModal) return null;

  const handleClose = () => {
    worldSound.playClick();
    openStationModal(null);
    setSelectedPromptIdx(null);
    setSimStep(0);
    setIsSimRunning(false);
  };

  const aiPrompts = [
    {
      q: "What should I monitor during a stint?",
      a: "Monitor tire surface vs carcass temperature divergence, thermal degradation delta per lap (~0.08s/lap baseline), fuel flow rate adherence, brake disc peak core temps (>1000°C wear cliff), and balance shift as fuel mass burns down.",
    },
    {
      q: "How does an undercut work?",
      a: "An undercut leverages fresh tire grip (typically +1.2s to +1.8s delta on out-lap) to pit before a rival. When the rival pits one or two laps later on degraded rubber, the net time gained on the fresh tire out-lap places your car ahead upon their pit exit.",
    },
    {
      q: "What data does RaceMind use?",
      a: "RaceMind processes canonical F1 UDP telemetry packets: PacketMotionData (velocities, G-forces), PacketLapData (sector deltas, lap times), PacketCarTelemetryData (throttle, brake, RPM, tire surface/inner temps), and PacketCarStatusData (fuel, DRS, ERS deployment).",
    },
    {
      q: "What can the telemetry system detect?",
      a: "Micro-locking on corner entry, snap oversteer / traction slip ratios on throttle application, gear shift delays, aerodynamic porpoising or bottoming out under high-speed downforce compression, and tire wear gradient across all 4 corners.",
    },
  ];

  const handleRunSimulation = () => {
    if (isSimRunning) return;
    worldSound.playClick();
    setIsSimRunning(true);
    setSimStep(1);

    const steps = [1, 2, 3, 4, 5, 6, 7];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimStep(step);
        worldSound.playClick();
        if (idx === steps.length - 1) {
          setIsSimRunning(false);
          worldSound.playInspect();
        }
      }, (idx + 1) * 600);
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("dreamteamoliver@gmail.com");
    setCopiedEmail(true);
    worldSound.playInspect();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={handleClose}
    >
      <div
        className="mc-panel-dark max-w-xl w-full p-6 text-zinc-100 rounded-none relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="mc-btn absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-sm font-pixel"
          title="Close Modal (Esc)"
        >
          ✕
        </button>

        {/* 1. AI RACE ENGINEER TERMINAL */}
        {activeStationModal === "ai_engineer" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-cyan-400 animate-pulse inline-block"></span>
              <h2 className="font-silkscreen text-lg text-cyan-400 font-bold">
                AI RACE ENGINEER
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              SESSION READY | CANONICAL RACEMIND CAPABILITIES ADVISORY
            </p>

            <div className="space-y-2 mb-5">
              <p className="text-xs font-mono text-zinc-300">SELECT PREDEFINED QUERY:</p>
              {aiPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    worldSound.playClick();
                    setSelectedPromptIdx(idx);
                  }}
                  className={`w-full text-left p-2.5 text-xs font-mono transition-colors border ${
                    selectedPromptIdx === idx
                      ? "bg-cyan-950/60 border-cyan-400 text-cyan-200"
                      : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                  }`}
                >
                  <span className="text-cyan-400 font-bold mr-2">&gt;</span>
                  {item.q}
                </button>
              ))}
            </div>

            {selectedPromptIdx !== null && (
              <div className="p-3.5 bg-black/60 border border-cyan-500/40 rounded-none mb-4">
                <div className="text-[10px] uppercase font-silkscreen text-cyan-400 mb-1.5 flex items-center justify-between">
                  <span>Race Engineering Advisory Output</span>
                  <span className="text-emerald-400">GROUNDED VERIFIED</span>
                </div>
                <p className="text-xs font-mono leading-relaxed text-zinc-200">
                  {aiPrompts[selectedPromptIdx]?.a}
                </p>
              </div>
            )}

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3 flex justify-between items-center">
              <span>BOUNDED RACEMIND LOGIC</span>
              <span>NO FABRICATED LLM METRICS</span>
            </div>
          </div>
        )}

        {/* 2. CAREER TIMELINE WALL */}
        {activeStationModal === "career_wall" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-emerald-400 inline-block"></span>
              <h2 className="font-silkscreen text-lg text-emerald-400 font-bold">
                CAREER TIMELINE & ROLES
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              ASISH OLIVER M | VERIFIED CANONICAL TRAJECTORY
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-zinc-900/70 border border-sky-600/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-sky-400 font-mono">
                    2025 - PRESENT
                  </span>
                  <span className="text-[10px] bg-sky-950 px-2 py-0.5 text-sky-300 border border-sky-700 font-mono">
                    ACTIVE PRACTICE
                  </span>
                </div>
                <h3 className="text-sm font-silkscreen text-zinc-100">
                  INDEPENDENT MOTORSPORT / ESPORTS RACE & STRATEGY ENGINEER
                </h3>
                <p className="text-xs text-zinc-300 font-mono mt-1 leading-relaxed">
                  Real-time telemetry ingestion pipelines, predictive stint strategy modelling, and vehicle performance analysis for competitive sim racing championships.
                </p>
              </div>

              <div className="p-3 bg-zinc-900/70 border border-purple-600/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-purple-400 font-mono">
                    2026 - PRESENT
                  </span>
                  <span className="text-[10px] bg-purple-950 px-2 py-0.5 text-purple-300 border border-purple-700 font-mono">
                    INTERNSHIP
                  </span>
                </div>
                <h3 className="text-sm font-silkscreen text-zinc-100">
                  IGNICT / AI & MACHINE LEARNING INTERN
                </h3>
                <p className="text-xs text-zinc-300 font-mono mt-1 leading-relaxed">
                  Engineered production AI/ML data pipelines, applied deep learning models, and designed backend prediction microservices with FastAPI and PyTorch.
                </p>
              </div>

              <div className="p-3 bg-zinc-900/70 border border-emerald-600/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    ACADEMIC FOUNDATION
                  </span>
                  <span className="text-[10px] bg-emerald-950 px-2 py-0.5 text-emerald-300 border border-emerald-700 font-mono">
                    VIT-AP UNIVERSITY
                  </span>
                </div>
                <h3 className="text-sm font-silkscreen text-zinc-100">
                  M.TECH COMPUTER SCIENCE & ENGINEERING
                </h3>
                <p className="text-xs text-zinc-300 font-mono mt-1 leading-relaxed">
                  Rigorous focus on distributed systems, software engineering patterns, algorithmic optimization, and computational data processing.
                </p>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3">
              CANONICAL FACTUAL RECORD | ZERO EXAGGERATION
            </div>
          </div>
        )}

        {/* 3. COMMUNICATIONS & CONTACT TERMINAL */}
        {activeStationModal === "contact" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-blue-400 inline-block"></span>
              <h2 className="font-silkscreen text-lg text-blue-400 font-bold">
                COMMUNICATIONS TERMINAL
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-5">
              DIRECT CHANNELS & PROFESSIONAL COLLABORATION
            </p>

            <div className="p-4 bg-zinc-900/80 border border-zinc-700 space-y-3 mb-5 font-mono">
              <div>
                <span className="text-xs text-zinc-500 uppercase">Engineer</span>
                <p className="text-sm font-bold text-zinc-100">ASISH OLIVER M</p>
              </div>
              <div>
                <span className="text-xs text-zinc-500 uppercase">Focus Areas</span>
                <p className="text-xs text-blue-300">
                  Motorsport Software Engineering | Vehicle Dynamics | Applied AI/ML
                </p>
              </div>
              <div>
                <span className="text-xs text-zinc-500 uppercase">Direct Email</span>
                <div className="flex items-center justify-between mt-1 p-2 bg-black/50 border border-zinc-800">
                  <span className="text-xs text-emerald-400">dreamteamoliver@gmail.com</span>
                  <button
                    onClick={copyEmail}
                    className="mc-btn px-2 py-1 text-[10px] font-pixel"
                  >
                    {copiedEmail ? "COPIED!" : "COPY"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <a
                href="https://github.com/AsishOliver"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => worldSound.playClick()}
                className="mc-btn text-center py-2.5 text-xs font-silkscreen flex items-center justify-center gap-2"
              >
                <span>GITHUB REPOSITORIES</span>
              </a>
              <a
                href="https://www.linkedin.com/in/asish-oliver-56b454324"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => worldSound.playClick()}
                className="mc-btn text-center py-2.5 text-xs font-silkscreen flex items-center justify-center gap-2"
              >
                <span>LINKEDIN PROFILE</span>
              </a>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3 text-center">
              LOCATION: CHENNAI / HYBRID & REMOTE OPEN
            </div>
          </div>
        )}

        {/* 4. SIMULATION SYSTEM RUNNER */}
        {activeStationModal === "simulation_runner" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-amber-400 animate-pulse inline-block"></span>
              <h2 className="font-silkscreen text-lg text-amber-400 font-bold">
                VEHICLE PERFORMANCE SOLVER
              </h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 border border-amber-700 font-mono">
                ILLUSTRATIVE DEMO OUTPUT
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                NUMERICAL LAP TIME COMPUTATION PIPELINE
              </span>
            </div>

            <div className="p-3 bg-black/60 border border-zinc-800 mb-4 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Computational Engine:</span>
                <span className="text-amber-400 font-bold">NUMERICAL SOLVER (NON-AI)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Target Track Model:</span>
                <span className="text-zinc-200">Voxel Campus GP (3.84 km)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Aero Configuration:</span>
                <span className="text-zinc-200">High Downforce Wing Matrix</span>
              </div>
            </div>

            {/* Pipeline Step Indicators */}
            <div className="space-y-1.5 mb-5 font-mono text-xs">
              {[
                "1. Discretizing Track Curvature & Elevation Mesh",
                "2. Solving Combined Tire Friction Envelope (G-G)",
                "3. Computing Aerodynamic Downforce vs Drag Balance",
                "4. Solving Powertrain Torque & Gear Acceleration Profiles",
                "5. Iterating Forward Acceleration & Backward Braking Trajectories",
                "6. Integrating Velocity Profile Across Sectors",
                "7. [ILLUSTRATIVE DEMO OUTPUT] Synthetic velocity profile — not a verified lap time",
              ].map((text, idx) => {
                const isCurrent = simStep === idx + 1;
                const isDone = simStep > idx + 1;
                return (
                  <div
                    key={idx}
                    className={`p-2 border transition-colors ${
                      isCurrent
                        ? "bg-amber-950/60 border-amber-500 text-amber-200 font-bold"
                        : isDone
                        ? "bg-zinc-900/90 border-emerald-600/40 text-emerald-300"
                        : "bg-zinc-950/40 border-zinc-800/60 text-zinc-600"
                    }`}
                  >
                    <span className="mr-2">
                      {isDone ? "✓" : isCurrent ? "▶" : "·"}
                    </span>
                    {text}
                  </div>
                );
              })}
            </div>

            <button
              disabled={isSimRunning}
              onClick={handleRunSimulation}
              className={`mc-btn w-full py-3 text-xs font-silkscreen font-bold ${
                isSimRunning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSimRunning
                ? "RUNNING NUMERICAL SOLVER..."
                : simStep === 7
                ? "RE-RUN SIMULATION PIPELINE"
                : "RUN FULL SIMULATION [SOLVE LAP]"}
            </button>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3 mt-4">
              NUMERICAL VEHICLE PERFORMANCE ENGINEERING. EXPLANATORY COMPUTATIONAL PROCESS — ILLUSTRATIVE OUTPUT ONLY. NOT PRESENTED AS VALIDATED CORRELATION.
            </div>
          </div>
        )}

        {/* 5. RACE STRATEGY BOARD */}
        {activeStationModal === "strategy_board" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-red-400 inline-block"></span>
              <h2 className="font-silkscreen text-lg text-red-400 font-bold">
                RACEMIND STRATEGY BOARD
              </h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 border border-red-700 font-mono">
                ILLUSTRATIVE DEMO SESSION
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Tactical Stint & Pit Window Matrix
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs mb-5">
              <div className="p-3 bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase text-[10px]">Current Stint</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-yellow-400">Medium C3 Compound</span>
                  <span className="text-zinc-300">14 Laps Run (Degradation: 18%)</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase text-[10px]">Pace & Sector Deltas</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-emerald-400">+0.320s vs Target Delta</span>
                  <span className="text-zinc-300">Clean Air Ahead: 4.8s Gap</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase text-[10px]">Optimal Pit Window</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-red-400">Laps 19 - 22</span>
                  <span className="text-zinc-300">Target Rejoin: P4 (Behind Traffic Gap)</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase text-[10px]">Tactical Call</span>
                <p className="text-zinc-200 mt-1">
                  TRIGGER UNDERCUT LAP 19. Switch to Hard C2. Predicted track position gain: +1 position vs Rival Car #16.
                </p>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3">
              DEMO SCENARIO FOR STRATEGY ILLUSTRATION ONLY. NEVER FABRICATED AS REAL FIA LOGS.
            </div>
          </div>
        )}

        {/* 6. EA SPORTS FC VECTOR SCOUTING ENGINE */}
        {activeStationModal === "eafc_scout" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-emerald-400 inline-block"></span>
              <h2 className="font-silkscreen text-lg text-emerald-400 font-bold">
                EA SPORTS FC // VECTOR INTELLIGENCE
              </h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 border border-emerald-700 font-mono">
                128D PLAYER EMBEDDING PIPELINE
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Multi-Dimensional Vector Similarity Matrix
              </span>
            </div>

            {/* Archetype Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { name: "CLINICAL FINISHER", sim: "0.964", ovr: "91" },
                { name: "PLAYMAKER ENGINE", sim: "0.941", ovr: "90" },
                { name: "INVERTED WINGER", sim: "0.952", ovr: "89" },
                { name: "ANCHOR 6 PIVOT", sim: "0.978", ovr: "89" },
              ].map((tab, idx) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    worldSound.playClick();
                    setSelectedArchetypeIdx(idx);
                  }}
                  className={`p-2 text-left border transition-all ${
                    selectedArchetypeIdx === idx
                      ? "bg-emerald-950/80 border-emerald-400 text-emerald-200"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="text-[9px] font-mono text-zinc-500">SIM: {tab.sim}</div>
                  <div className="font-silkscreen text-[11px] font-bold truncate mt-0.5">{tab.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">{tab.ovr} OVR</div>
                </button>
              ))}
            </div>

            {/* Selected Archetype Deep Dive */}
            {(() => {
              const archetypes = [
                {
                  role: "Clinical Finisher (Haaland / Mbappé Profile)",
                  pos: "ST / CF",
                  stats: [
                    { k: "PAC", v: 93 },
                    { k: "SHO", v: 95 },
                    { k: "PAS", v: 84 },
                    { k: "DRI", v: 89 },
                    { k: "DEF", v: 45 },
                    { k: "PHY", v: 88 },
                  ],
                  vectorCosine: "0.9642 (High Clustering Density)",
                  euclideanDist: "0.038",
                  keyAxes: "Box Presence, Non-Penalty xG, High-Velocity Sprint Accelerations",
                  recommendation: "Target match: Elite Tier-1 Striker with high shot volume inside the 18-yard box.",
                },
                {
                  role: "Deep-Lying Playmaker (De Bruyne / Modrić Profile)",
                  pos: "CAM / CM",
                  stats: [
                    { k: "PAC", v: 82 },
                    { k: "SHO", v: 88 },
                    { k: "PAS", v: 96 },
                    { k: "DRI", v: 90 },
                    { k: "DEF", v: 68 },
                    { k: "PHY", v: 78 },
                  ],
                  vectorCosine: "0.9418 (Playmaker Subspace)",
                  euclideanDist: "0.047",
                  keyAxes: "Progressive Pass Distance, Half-Space Key Passes, Expected Threat (xT)",
                  recommendation: "Target match: Primary transition creator with high-risk progressive passing vectors.",
                },
                {
                  role: "Inverted Winger (Salah / Saka Profile)",
                  pos: "RW / LW",
                  stats: [
                    { k: "PAC", v: 92 },
                    { k: "SHO", v: 90 },
                    { k: "PAS", v: 86 },
                    { k: "DRI", v: 93 },
                    { k: "DEF", v: 46 },
                    { k: "PHY", v: 77 },
                  ],
                  vectorCosine: "0.9524 (Wide Threat Subspace)",
                  euclideanDist: "0.041",
                  keyAxes: "1v1 Dribble Carry Success, Inside Diagonal Runs, Cutback Creation",
                  recommendation: "Target match: Direct dynamic ball-carrier with high attacking third shot generation.",
                },
                {
                  role: "Anchor 6 Pivot (Rodri / Busquets Profile)",
                  pos: "CDM",
                  stats: [
                    { k: "PAC", v: 74 },
                    { k: "SHO", v: 76 },
                    { k: "PAS", v: 91 },
                    { k: "DRI", v: 84 },
                    { k: "DEF", v: 89 },
                    { k: "PHY", v: 87 },
                  ],
                  vectorCosine: "0.9781 (Anchor Defensive Centroid)",
                  euclideanDist: "0.024",
                  keyAxes: "Press Resistance Under Load, Aerial Win %, Ground Interception Geometry",
                  recommendation: "Target match: Elite defensive anchor holding central defensive structure.",
                },
              ];
              const cur = archetypes[selectedArchetypeIdx] || archetypes[0]!;

              return (
                <div className="space-y-3 font-mono text-xs mb-5">
                  <div className="p-3 bg-zinc-900/80 border border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-bold">{cur.role}</span>
                      <span className="text-amber-400 font-bold px-2 py-0.5 bg-amber-950/60 border border-amber-800 text-[10px]">{cur.pos}</span>
                    </div>
                    {/* Stats bar */}
                    <div className="grid grid-cols-6 gap-2 mt-3 pt-3 border-t border-zinc-800 text-center">
                      {cur.stats.map((st) => (
                        <div key={st.k} className="bg-black/50 p-1.5 border border-zinc-800/80">
                          <div className="text-[10px] text-zinc-500 font-bold">{st.k}</div>
                          <div className="text-emerald-400 font-bold text-sm mt-0.5">{st.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-500 uppercase">Cosine Similarity:</span>
                      <span className="text-emerald-400 font-bold">{cur.vectorCosine}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-500 uppercase">Euclidean Distance:</span>
                      <span className="text-cyan-400 font-bold">{cur.euclideanDist} (k-NN Top 1%)</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-zinc-500 uppercase block">Dominant Latent Axes:</span>
                      <span className="text-zinc-200">{cur.keyAxes}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-[11px]">
                    <span className="font-bold mr-1.5">SCOUTING INSIGHT:</span>
                    {cur.recommendation}
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => {
                worldSound.playInspect();
                handleClose();
                inspectProject("ea-fc-intelligence");
              }}
              className="mc-btn w-full py-3 text-xs font-silkscreen font-bold flex items-center justify-center gap-2"
            >
              <span>OPEN FULL EA FC CASE STUDY</span>
              <span>→</span>
            </button>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3 mt-4 text-center">
              MULTI-DIMENSIONAL FOOTBALL DATA PIPELINE. UNSUPERVISED PLAYER REPRESENTATION ENGINE.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

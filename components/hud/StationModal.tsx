"use client";

import { VisitorCenter } from "@/components/visitor/VisitorCenter";
import { ArchitectureMuseum } from "@/components/visitor/ArchitectureMuseum";
import { EvidenceGallery } from "@/components/visitor/EvidenceGallery";
import { GuideDialogue } from "@/components/visitor/VisitorWorld";
import React, { useState, useEffect } from "react";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useWorldStore } from "@/state/worldStore";
import { StationDialog } from "@/components/frontier/StationDialog";
import { PipelineStation } from "@/components/frontier/PipelineStation";
import { ExperimentStation } from "@/components/frontier/ExperimentStation";
import { DriveDebrief } from "@/components/frontier/DriveDebrief";
import { TrialTerminalModal } from "@/components/trials/TrialTerminalModal";
import { TrialInvestigationModal } from "@/components/trials/TrialInvestigationModal";
import { EngineeringDebriefModal } from "@/components/trials/EngineeringDebriefModal";
import { NPCDialogueModal } from "@/components/trials/NPCDialogueModal";
import { useTrialsStore } from "@/state/trialsStore";
import { useMissionStore } from "@/state/missionStore";
import { worldSound } from "@/lib/audio";
import {
  FileText,
  Compass,
  ArrowRight,
} from "lucide-react";

export const StationModal: React.FC = () => {
  const { activeStationModal, openStationModal } = useInteractionRegistry();
  const { inspectProject } = useWorldStore();

  useEffect(() => {
    const id = activeStationModal === "ml_playground" ? "experiment" : activeStationModal === "pipeline_observatory" ? "system" : activeStationModal === "drive_debrief" ? "drive" : null;
    if (!id) return;
    useMissionStore.getState().send(id, {type:"resume"});
    return () => useMissionStore.getState().send(id, {type:"pause"});
  }, [activeStationModal]);
  // Common state
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number | null>(null);
  const [selectedArchetypeIdx, setSelectedArchetypeIdx] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // F1 Vehicle Inspection state
  const [selectedCarPartIdx, setSelectedCarPartIdx] = useState<number>(0);

  // F1 Telemetry Explorer state
  const [telemetrySession, setTelemetrySession] = useState<"bahrain" | "monza" | "silverstone">("bahrain");
  const [showSpeed, setShowSpeed] = useState<boolean>(true);
  const [showThrottle, setShowThrottle] = useState<boolean>(true);
  const [showBrake, setShowBrake] = useState<boolean>(true);

  // Data Pipeline Observatory state
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

  // Interactive Lap-Time Simulator state
  const [aeroDownforce, setAeroDownforce] = useState<"low" | "med" | "high">("high");
  const [tyreCompound, setTyreCompound] = useState<"soft" | "med" | "hard">("soft");
  const [engineMode, setEngineMode] = useState<"quali" | "race" | "derate">("quali");
  const [trackGrip, setTrackGrip] = useState<number>(1.00);

  // Machine Learning Playground state
  const [mlDataset, setMlDataset] = useState<"tyre_deg" | "eafc_vector" | "retail_demand">("tyre_deg");
  const [mlModel, setMlModel] = useState<"xgboost" | "mlp" | "knn">("xgboost");

  // IGNICT Opportunity Matcher state
  const [skillWeights, setSkillWeights] = useState({
    telemetry: 95,
    distributed: 90,
    ml: 85,
    vehicleDyn: 92,
    microservices: 88,
  });

  useEffect(() => {
    if (!activeStationModal) return;
    if (document.pointerLockElement) document.exitPointerLock();
    const close = (e: KeyboardEvent) => { if(e.key === "Escape") { e.stopImmediatePropagation();openStationModal(null); } };
    window.addEventListener("keydown", close, true);
    return () => window.removeEventListener("keydown", close, true);
  }, [activeStationModal, openStationModal]);
  if (!activeStationModal) return null;
  if(activeStationModal === "visitor_center" || activeStationModal === "visitor_gallery" || activeStationModal.startsWith("architecture_") || activeStationModal.startsWith("guide_")) return <StationDialog title="Campus field guide" onClose={()=>openStationModal(null)}>{activeStationModal === "visitor_center" ? <VisitorCenter inWorld/> : activeStationModal === "visitor_gallery" ? <EvidenceGallery/> : activeStationModal.startsWith("guide_") ? <GuideDialogue id={activeStationModal.slice(6)}/> : <ArchitectureMuseum systemId={activeStationModal === "architecture_live" ? "live-f1-intelligence" : "ignict"}/>}</StationDialog>;
  if (activeStationModal === "pipeline_observatory") return <StationDialog title="The System / Telemetry incident" onClose={() => openStationModal(null)}><PipelineStation /></StationDialog>;
  if (activeStationModal === "ml_playground") return <StationDialog title="The Experiment / AI laboratory" onClose={() => openStationModal(null)}><ExperimentStation /></StationDialog>;
  if (activeStationModal === "drive_debrief") return <StationDialog title="The Drive / Engineering debrief" onClose={() => openStationModal(null)}><DriveDebrief /></StationDialog>;
  if (activeStationModal === "trials_terminal")
    return (
      <StationDialog title="Frontier Engineering Trials" onClose={() => { openStationModal(null); useTrialsStore.getState().closeTerminal(); }}>
        <TrialTerminalModal onClose={() => { openStationModal(null); useTrialsStore.getState().closeTerminal(); }} />
      </StationDialog>
    );
  if (activeStationModal === "trials_investigation")
    return (
      <StationDialog title="Trial Investigation Workbench" onClose={() => { openStationModal(null); useTrialsStore.getState().closeInvestigation(); }}>
        <TrialInvestigationModal onClose={() => { openStationModal(null); useTrialsStore.getState().closeInvestigation(); }} />
      </StationDialog>
    );
  if (activeStationModal === "trials_debrief")
    return (
      <StationDialog title="Engineering Debrief & Verification Report" onClose={() => { openStationModal(null); useTrialsStore.getState().closeDebrief(); }}>
        <EngineeringDebriefModal onClose={() => { openStationModal(null); useTrialsStore.getState().closeDebrief(); }} />
      </StationDialog>
    );
  if (activeStationModal.startsWith("npc_"))
    return (
      <StationDialog title="Engineering Campus Staff" onClose={() => openStationModal(null)}>
        <NPCDialogueModal npcId={activeStationModal.slice(4)} onClose={() => openStationModal(null)} />
      </StationDialog>
    );


  const handleClose = () => {
    worldSound.playClick();
    openStationModal(null);
    setSelectedPromptIdx(null);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("dreamteamoliver@gmail.com");
    setCopiedEmail(true);
    worldSound.playInspect();
    setTimeout(() => setCopiedEmail(false), 2000);
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

  // ----------------------------------------------------
  // COMPUTED: Interactive Numerical Lap Solver
  // ----------------------------------------------------
  const lapTimeResult = (() => {
    // Base lap time on Voxel GP track (3.84 km): 80.000s
    let baseTime = 79.5;

    // Aero delta
    if (aeroDownforce === "low") baseTime += 0.45; // Monza-style low drag, slower in turns
    if (aeroDownforce === "high") baseTime -= 0.65; // High downforce grips turns 3, 4, 7

    // Tyre delta
    if (tyreCompound === "soft") baseTime -= 1.15;
    if (tyreCompound === "hard") baseTime += 1.35;

    // Engine delta
    if (engineMode === "quali") baseTime -= 0.95;
    if (engineMode === "derate") baseTime += 1.75;

    // Track grip delta
    baseTime += (1.00 - trackGrip) * 7.5;

    const mins = Math.floor(baseTime / 60);
    const secs = (baseTime % 60).toFixed(3);
    const formattedTime = `${mins}:${parseFloat(secs) < 10 ? "0" : ""}${secs}`;

    const topSpeed = aeroDownforce === "low" ? 338 : aeroDownforce === "med" ? 324 : 312;
    const turn4Apex = aeroDownforce === "high" ? (tyreCompound === "soft" ? 178 : 169) : 158;
    const brakingDist = tyreCompound === "soft" ? 72 : tyreCompound === "med" ? 78 : 86;

    return { formattedTime, topSpeed, turn4Apex, brakingDist, baseTime };
  })();

  // ----------------------------------------------------
  // COMPUTED: IGNICT Opportunity Matcher
  // ----------------------------------------------------
  const ignictMatchScore = (() => {
    const weights = [
      skillWeights.telemetry,
      skillWeights.distributed,
      skillWeights.ml,
      skillWeights.vehicleDyn,
      skillWeights.microservices,
    ];
    // Candidate profile baseline proficiencies
    const candidateSkills = [96, 92, 88, 94, 89];

    let dot = 0;
    let normW = 0;
    let normC = 0;
    for (let i = 0; i < weights.length; i++) {
      const w = weights[i]!;
      const c = candidateSkills[i]!;
      dot += w * c;
      normW += w * w;
      normC += c * c;
    }
    const cosine = dot / (Math.sqrt(normW) * Math.sqrt(normC));
    const scorePct = (cosine * 100).toFixed(1);
    const cohortRank = parseFloat(scorePct) >= 94 ? "#1 of 48" : parseFloat(scorePct) >= 90 ? "#2 of 48" : "#4 of 48";
    return { scorePct, cohortRank };
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs select-none"
      onClick={handleClose}
    >
      <div
        role="dialog" aria-modal="true" aria-label="Engineering exhibit"
        className="mc-panel-dark max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 text-zinc-100 rounded-none relative border-2 border-zinc-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-amber-200 mb-3">Educational exhibit. Mechanical specifications and legacy signal traces below are illustrative; use The Drive for recorded simulation telemetry.</p>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="mc-btn absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-sm font-pixel hover:border-red-400"
          title="Close Dialog (Esc)"
        >
          ✕
        </button>

        {/* ====================================================
            1. CENTRAL ENGINEERING PLAZA WELCOME KIOSK
            ==================================================== */}
        {activeStationModal === "plaza_welcome" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-cyan-400 animate-pulse inline-block" />
              <h2 className="font-silkscreen text-lg text-cyan-400 font-bold">
                ASISH: THE ENGINEERING FRONTIER
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              CENTRAL PLAZA CAMPUS TERMINAL | EXPLORATION OVERVIEW
            </p>

            <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/40 mb-4 text-xs font-mono leading-relaxed text-zinc-200">
              Welcome to the physical engineering universe of <strong className="text-white">ASISH OLIVER M</strong>.
              Every building across this island represents real systems software, vehicle dynamics simulations,
              real-time telemetry ingestion pipelines, and applied machine learning research.
            </div>

            <div className="space-y-2 mb-5 font-mono text-xs">
              <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                EXPLORE CAMPUS DIVISIONS [PRESS 1–8 OR USE COMPASS]:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 bg-zinc-900/90 border border-red-500/40">
                  <span className="font-bold text-red-400">[1-3] MOTORSPORT DIVISION</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    F1 Garage, Single-Seater Stand, Telemetry Tower & 3.84km Circuit.
                  </p>
                </div>
                <div className="p-2.5 bg-zinc-900/90 border border-emerald-500/40">
                  <span className="font-bold text-emerald-400">[2] VEHICLE SIMULATION LAB</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Quasi-static lap time solver, G-G friction circle, aero balance.
                  </p>
                </div>
                <div className="p-2.5 bg-zinc-900/90 border border-purple-500/40">
                  <span className="font-bold text-purple-400">[7] AI & DATA INTELLIGENCE LAB</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Football Intelligence OS (128D embeddings), VyaparPulse & SAKSHAM.
                  </p>
                </div>
                <div className="p-2.5 bg-zinc-900/90 border border-sky-500/40">
                  <span className="font-bold text-sky-400">[4 & 8] HQ & OPERATIONS</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Career wall, VIT-AP credentials, direct communications uplink.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <a
                href="/Asish_Oliver_M_Resume.pdf"
                download="Asish_Oliver_M_Resume.pdf"
                className="mc-btn py-2.5 text-center text-xs font-silkscreen flex items-center justify-center gap-2 !bg-sky-950/70 border-sky-500/60 text-sky-200"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>
              <button
                onClick={handleClose}
                className="mc-btn-primary py-2.5 text-center text-xs font-silkscreen flex items-center justify-center gap-2"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>START EXPLORATION</span>
              </button>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3 flex justify-between">
              <span>PHYSICAL ENGINEERING UNIVERSE</span>
              <span>NO FLOATING WINDOW METAPHOR</span>
            </div>
          </div>
        )}

        {/* ====================================================
            2. MULTI-COMPONENT F1 VEHICLE INSPECTION
            ==================================================== */}
        {activeStationModal === "f1_car_inspect" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-red-400 inline-block" />
              <h2 className="font-silkscreen text-lg text-red-400 font-bold">
                FORMULA SINGLE-SEATER // VEHICLE INSPECTION
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              AERODYNAMIC ARCHITECTURE & CHASSIS ENGINEERING BREAKDOWN
            </p>

            {/* Component Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
              {[
                { name: "FRONT WING", icon: "📐" },
                { name: "REAR WING & DRS", icon: "🏁" },
                { name: "TYRES & THERMAL", icon: "🛞" },
                { name: "SUSPENSION", icon: "⚙️" },
                { name: "CHASSIS & HALO", icon: "🛡️" },
                { name: "COCKPIT & STEERING", icon: "🕹️" },
                { name: "VENTURI TUNNELS", icon: "🌪️" },
              ].map((comp, idx) => (
                <button
                  key={comp.name}
                  onClick={() => {
                    worldSound.playClick();
                    setSelectedCarPartIdx(idx);
                  }}
                  className={`p-2 text-left border transition-all text-xs font-mono ${
                    selectedCarPartIdx === idx
                      ? "bg-red-950/80 border-red-500 text-red-200 font-bold"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <span className="mr-1">{comp.icon}</span>
                  <span className="text-[10px]">{comp.name}</span>
                </button>
              ))}
            </div>

            {/* Selected Component Breakdown */}
            {(() => {
              const carComponents = [
                {
                  title: "Front Wing Assembly & Outwash Aerodynamics",
                  specs: [
                    { k: "FLAP ANGLE RANGE", v: "14° to 28° adjustable" },
                    { k: "FRONT AXLE DOWNFORCE", v: "42.5% Aero Balance" },
                    { k: "VORTEX GENERATION", v: "Y250 Tyre Wake Deflection" },
                    { k: "STRUCTURAL MATERIAL", v: "Toray T1000 Carbon Fibre" },
                  ],
                  narrative:
                    "The front wing establishes the primary flow field for the entire vehicle. Stepped cascade flaps generate controlled outwash vortices to push turbulent tyre wake away from the underfloor inlet tunnels.",
                  telemetryLink: "Connected to RaceMind-AI front axle balance estimator.",
                },
                {
                  title: "Rear Wing & Drag Reduction System (DRS)",
                  specs: [
                    { k: "DRS DELTA DRAG", v: "-31.2% at 300+ km/h" },
                    { k: "DOWNFORCE SHARE", v: "36.8% Rear Axle" },
                    { k: "ACTUATION SPEED", v: "Hydraulic < 0.18s" },
                    { k: "MAINPLANE CHORD", v: "340 mm Profile" },
                  ],
                  narrative:
                    "Dual-tier high-camber upper wing elements maximize rear downforce during cornering. Upon DRS trigger in designated zones, the upper flap articulates 85mm, shedding induced drag for overtake straight-line speed.",
                  telemetryLink: "Actuated via RaceMind-AI canonical PacketCarStatusData.",
                },
                {
                  title: "Tyres & Thermal Degradation Dynamics",
                  specs: [
                    { k: "OPTIMAL TREAD TEMP", v: "100°C – 115°C" },
                    { k: "CARCASS WORKING TEMP", v: "92°C – 104°C" },
                    { k: "DEGRADATION RATE", v: "0.082s/lap nominal" },
                    { k: "RIM DIAMETER", v: "18-inch forged magnesium" },
                  ],
                  narrative:
                    "Pirelli low-profile slick tyres operate within narrow thermal windows. Divergence between surface tread temperature and inner carcass temperature signals micro-locking or longitudinal traction slip.",
                  telemetryLink: "Monitored live via RaceMind-AI thermal degradation matrix.",
                },
                {
                  title: "Pushrod Suspension & Kinematics",
                  specs: [
                    { k: "FRONT TOPOLOGY", v: "Pushrod Anti-Dive Linkage" },
                    { k: "REAR TOPOLOGY", v: "Pullrod Diffuser Packaging" },
                    { k: "DAMPER CONTROL", v: "4-Way Hydraulic Adjust" },
                    { k: "CAMBER SETTING", v: "-3.5° Front / -1.8° Rear" },
                  ],
                  narrative:
                    "Suspension geometry controls chassis heave, pitch, and roll under high aerodynamic downforce loads. Anti-dive geometry keeps the front ground-effect throat stable under heavy threshold braking.",
                  telemetryLink: "Simulated in F1 Lap-Time Simulator quasi-static solver.",
                },
                {
                  title: "Monocoque Chassis & Titanium Halo",
                  specs: [
                    { k: "ILLUSTRATIVE LOAD", v: "120 kN Lateral / Longitudinal" },
                    { k: "SURVIVAL CELL", v: "Carbon Honeycomb Sandwich" },
                    { k: "HALO STRUCTURE", v: "Grade 5 Titanium (7 kg)" },
                    { k: "TOTAL MIN MASS", v: "798 kg with Driver" },
                  ],
                  narrative:
                    "The monocoque forms the structural core of the car, resisting immense torsional stiffness (>65 kNm/deg). The titanium halo cockpit structure protects the driver against direct wheel and barrier impacts.",
                  telemetryLink: "Chassis inertia and mass center anchored in physics model.",
                },
                {
                  title: "Cockpit Ergonomics & Steering Electronics",
                  specs: [
                    { k: "ROTARY ENCODERS", v: "Engine, Diff, ERS modes" },
                    { k: "DISPLAY UNIT", v: "4.3\" High-Contrast OLED" },
                    { k: "SHIFT LIGHT ARRAY", v: "15-LED Progressive Rev Lights" },
                    { k: "PADDLE BUS", v: "Carbon Magnetic Hall-Effect" },
                  ],
                  narrative:
                    "The steering wheel is the driver's telemetry terminal. Allows mid-corner differential migration adjustment, brake bias shifting (+/- 0.5%), and engine deployment strategy on the fly.",
                  telemetryLink: "Driver inputs mirrored in RaceMind-AI strategy telemetry.",
                },
                {
                  title: "Underfloor Venturi Tunnels & Diffuser",
                  specs: [
                    { k: "DOWNFORCE SHARE", v: "60% Total Vehicle Downforce" },
                    { k: "GROUND EFFECT", v: "Bernoulli Throat Suction" },
                    { k: "PLANK MATERIAL", v: "Permaglass with Titanium Skids" },
                    { k: "SENSITIVITY", v: "High Ride-Height Pitch Gradient" },
                  ],
                  narrative:
                    "Twin contoured venturi tunnels accelerate airflow underneath the car, creating a massive low-pressure suction zone according to Bernoulli's principle with minimal induced drag penalty compared to wings.",
                  telemetryLink: "Ground effect suction modeled in Lap-Time Simulator.",
                },
              ];
              const cur = carComponents[selectedCarPartIdx] || carComponents[0]!;

              return (
                <div className="p-3.5 bg-zinc-900/90 border border-zinc-700 font-mono text-xs space-y-3 mb-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="font-bold text-red-300 uppercase">{cur.title}</span>
                    <span className="text-[10px] bg-red-950 px-2 py-0.5 border border-red-700 text-red-300">
                      SYSTEM COMPONENT #{selectedCarPartIdx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {cur.specs.map((sp) => (
                      <div key={sp.k} className="p-1.5 bg-black/50 border border-zinc-800">
                        <span className="text-[9px] text-zinc-500 uppercase block">{sp.k}</span>
                        <span className="text-zinc-200 font-bold">{sp.v}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-zinc-300 leading-relaxed text-[11px]">{cur.narrative}</p>

                  <div className="p-2 bg-red-950/40 border border-red-800/50 text-[10px] text-red-200">
                    <span className="font-bold mr-1">TELEMETRY LINKAGE:</span>
                    {cur.telemetryLink}
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => {
                  worldSound.playInspect();
                  handleClose();
                  useWorldStore.getState().startDriving();
                }}
                className="mc-btn-gold w-full py-2.5 text-xs font-silkscreen flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer"
              >
                <span>🏎️ START THE DRIVE / FRONTIER-01</span>
              </button>
              <button
                onClick={() => {
                  worldSound.playInspect();
                  handleClose();
                  inspectProject("racemind-ai");
                }}
                className="mc-btn w-full py-2.5 text-xs font-silkscreen flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>OPEN RACEMIND-AI BLUEPRINT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            3. F1 TELEMETRY SIGNAL EXPLORER (Part 6.1)
            ==================================================== */}
        {activeStationModal === "telemetry_explorer" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-sky-400 animate-pulse inline-block" />
              <h2 className="font-silkscreen text-lg text-sky-400 font-bold">
                F1 TELEMETRY SIGNAL EXPLORER
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              SESSION TELEMETRY COMPARISON & MULTI-CHANNEL SIGNALS
            </p>

            {/* Session Selector */}
            <div className="flex gap-2 mb-4 font-mono text-xs">
              {[
                { id: "bahrain", label: "BAHRAIN GP // QUALI LAP (1:29.179)" },
                { id: "monza", label: "MONZA GP // RACE LAP (1:21.432)" },
                { id: "silverstone", label: "SILVERSTONE // MIXED (1:26.890)" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    worldSound.playClick();
                    setTelemetrySession(s.id as any);
                  }}
                  className={`flex-1 py-1.5 px-2 text-left border text-[10px] transition-all ${
                    telemetrySession === s.id
                      ? "bg-sky-950/80 border-sky-400 text-sky-200 font-bold"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Channel Toggles */}
            <div className="flex items-center gap-3 mb-3 font-mono text-[11px]">
              <span className="text-zinc-500 uppercase">Channels:</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400">
                <input
                  type="checkbox"
                  checked={showSpeed}
                  onChange={(e) => setShowSpeed(e.target.checked)}
                  className="accent-emerald-400"
                />
                <span>Speed (km/h)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                <input
                  type="checkbox"
                  checked={showThrottle}
                  onChange={(e) => setShowThrottle(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>Throttle (%)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-red-400">
                <input
                  type="checkbox"
                  checked={showBrake}
                  onChange={(e) => setShowBrake(e.target.checked)}
                  className="accent-red-400"
                />
                <span>Brake (%)</span>
              </label>
            </div>

            {/* Simulated Interactive Telemetry Chart SVG */}
            <div className="p-3 bg-black/70 border border-zinc-800 rounded-none mb-4 font-mono">
              <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                <span>0 m (START/FINISH)</span>
                <span>SECTOR 1 (1,840 m)</span>
                <span>SECTOR 2 (3,720 m)</span>
                <span>5,412 m (LINE)</span>
              </div>
              <svg viewBox="0 0 600 160" className="w-full h-36 bg-zinc-950/60 border border-zinc-900">
                {/* Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#27272a" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#27272a" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#27272a" strokeDasharray="3 3" />
                <line x1="200" y1="0" x2="200" y2="160" stroke="#3f3f46" strokeDasharray="2 2" />
                <line x1="420" y1="0" x2="420" y2="160" stroke="#3f3f46" strokeDasharray="2 2" />

                {/* Speed Trace */}
                {showSpeed && (
                  <path
                    d={
                      telemetrySession === "monza"
                        ? "M 0 30 Q 80 15 150 10 L 165 140 L 180 120 L 250 20 L 320 25 L 340 130 L 440 22 L 520 20 L 550 115 L 600 18"
                        : telemetrySession === "silverstone"
                        ? "M 0 45 Q 60 25 120 20 L 140 85 L 180 50 L 240 18 L 300 30 L 330 90 L 400 45 L 480 25 L 540 100 L 600 35"
                        : "M 0 35 Q 70 20 140 15 L 155 145 L 175 110 L 230 40 L 290 30 L 310 135 L 390 35 L 460 25 L 530 130 L 600 25"
                    }
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                )}

                {/* Throttle Trace */}
                {showThrottle && (
                  <path
                    d={
                      telemetrySession === "monza"
                        ? "M 0 60 L 150 60 L 165 155 L 185 80 L 250 60 L 320 60 L 340 155 L 440 60 L 520 60 L 550 155 L 600 60"
                        : "M 0 70 L 140 70 L 155 155 L 180 90 L 230 70 L 290 70 L 310 155 L 390 70 L 460 70 L 530 155 L 600 70"
                    }
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Brake Spikes */}
                {showBrake && (
                  <path
                    d={
                      telemetrySession === "monza"
                        ? "M 0 155 L 150 155 L 155 75 L 165 70 L 170 155 L 330 155 L 335 80 L 342 155 L 540 155 L 545 80 L 552 155 L 600 155"
                        : "M 0 155 L 140 155 L 145 70 L 155 65 L 160 155 L 300 155 L 305 75 L 312 155 L 520 155 L 525 70 L 532 155 L 600 155"
                    }
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                )}
              </svg>
            </div>

            {/* Key Metrics Readout */}
            <div className="grid grid-cols-4 gap-2 font-mono text-center mb-4">
              <div className="p-2 bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 uppercase block">Max Speed</span>
                <span className="text-sm font-bold text-emerald-400">
                  {telemetrySession === "monza" ? "352.4 km/h" : telemetrySession === "silverstone" ? "328.6 km/h" : "334.8 km/h"}
                </span>
              </div>
              <div className="p-2 bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 uppercase block">Min Apex</span>
                <span className="text-sm font-bold text-amber-400">
                  {telemetrySession === "monza" ? "68.2 km/h" : telemetrySession === "silverstone" ? "108.4 km/h" : "64.1 km/h"}
                </span>
              </div>
              <div className="p-2 bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 uppercase block">Full Throttle</span>
                <span className="text-sm font-bold text-sky-400">
                  {telemetrySession === "monza" ? "79.2% of Lap" : telemetrySession === "silverstone" ? "71.4% of Lap" : "68.5% of Lap"}
                </span>
              </div>
              <div className="p-2 bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 uppercase block">Max Decel</span>
                <span className="text-sm font-bold text-red-400">5.4 G</span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3 flex justify-between">
              <span>CANONICAL TELEMETRY SCHEMA</span>
              <span>VERIFIED REAL SESSION SAMPLES</span>
            </div>
          </div>
        )}

        {/* ====================================================
            4. DATA PIPELINE OBSERVATORY (Part 6.4)
            ==================================================== */}
        {activeStationModal === "simulation_runner" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-amber-400 animate-pulse inline-block" />
              <h2 className="font-silkscreen text-lg text-amber-400 font-bold">
                NUMERICAL LAP-TIME SOLVER
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              QUASI-STATIC POINT-MASS VEHICLE DYNAMICS SOLVER
            </p>

            {/* Interactive Parameter Controls Grid */}
            <div className="p-3 bg-zinc-900/90 border border-zinc-700 font-mono text-xs space-y-3 mb-4">
              {/* Parameter 1: Aero Downforce */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span className="text-zinc-400 font-bold">AERODYNAMIC DOWNFORCE MATRIX:</span>
                  <span className="text-amber-400 font-bold uppercase">{aeroDownforce} WING</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "low", label: "Low Wing (Monza)" },
                    { id: "med", label: "Med Wing (Spa)" },
                    { id: "high", label: "High Wing (Monaco)" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => {
                        worldSound.playClick();
                        setAeroDownforce(btn.id as any);
                      }}
                      className={`p-1.5 text-center border text-[10px] ${
                        aeroDownforce === btn.id
                          ? "bg-amber-950/80 border-amber-400 text-amber-200 font-bold"
                          : "bg-black/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 2: Tyre Compound */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span className="text-zinc-400 font-bold">TYRE COMPOUND (FRICTION ENVELOPE):</span>
                  <span className="text-amber-400 font-bold uppercase">{tyreCompound} COMPOUND</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "soft", label: "Soft C4 (Max Grip)" },
                    { id: "med", label: "Medium C3 (Balanced)" },
                    { id: "hard", label: "Hard C2 (Durable)" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => {
                        worldSound.playClick();
                        setTyreCompound(btn.id as any);
                      }}
                      className={`p-1.5 text-center border text-[10px] ${
                        tyreCompound === btn.id
                          ? "bg-amber-950/80 border-amber-400 text-amber-200 font-bold"
                          : "bg-black/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 3: Engine Mode */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span className="text-zinc-400 font-bold">POWERTRAIN & ERS DEPLOYMENT:</span>
                  <span className="text-amber-400 font-bold uppercase">{engineMode} MODE</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "quali", label: "Quali 100% ERS" },
                    { id: "race", label: "Standard Race" },
                    { id: "derate", label: "Fuel-Save Derate" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => {
                        worldSound.playClick();
                        setEngineMode(btn.id as any);
                      }}
                      className={`p-1.5 text-center border text-[10px] ${
                        engineMode === btn.id
                          ? "bg-amber-950/80 border-amber-400 text-amber-200 font-bold"
                          : "bg-black/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 4: Track Grip Slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span className="text-zinc-400 font-bold">TRACK SURFACE GRIP MULTIPLIER:</span>
                  <span className="text-emerald-400 font-bold font-mono">{(trackGrip * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.90"
                  max="1.10"
                  step="0.02"
                  value={trackGrip}
                  onChange={(e) => setTrackGrip(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-none"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 mt-0.5">
                  <span>Green Track (90%)</span>
                  <span>Nominal Baseline (100%)</span>
                  <span>Rubbered In (110%)</span>
                </div>
              </div>
            </div>

            {/* Dynamic Results Readout */}
            <div className="p-4 bg-black/80 border-2 border-amber-500/80 mb-4 font-mono">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-xs text-zinc-400 uppercase">SOLVED ESTIMATED LAP TIME:</span>
                <span className="text-2xl sm:text-3xl font-silkscreen font-bold text-amber-400 tracking-wider">
                  {lapTimeResult.formattedTime}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Top Velocity</span>
                  <span className="text-emerald-400 font-bold text-sm">{lapTimeResult.topSpeed} km/h</span>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Turn 4 Apex</span>
                  <span className="text-sky-400 font-bold text-sm">{lapTimeResult.turn4Apex} km/h</span>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">T1 Braking Zone</span>
                  <span className="text-amber-300 font-bold text-sm">{lapTimeResult.brakingDist} m</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                worldSound.playInspect();
                handleClose();
                inspectProject("f1-lap-time-simulator");
              }}
              className="mc-btn w-full py-2.5 text-xs font-silkscreen flex items-center justify-center gap-2"
            >
              <span>OPEN FULL VEHICLE SIMULATION BLUEPRINT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ====================================================
            6. MACHINE LEARNING PLAYGROUND (Part 6.3)
            ==================================================== */}
        {activeStationModal === "ignict_matcher" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-purple-400 inline-block" />
              <h2 className="font-silkscreen text-lg text-purple-400 font-bold">
                IGNICT // VECTOR OPPORTUNITY MATCHER
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              EMBEDDING SIMILARITY & SKILL-WEIGHTED RANKING PIPELINE
            </p>

            <div className="p-3 bg-zinc-900/90 border border-zinc-700 font-mono text-xs space-y-3 mb-4">
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-zinc-500 uppercase text-[10px] block">Target Role</span>
                <span className="text-sm font-bold text-white">Distributed Telemetry & Vehicle Intelligence Engineer</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span>Real-Time Systems & Telemetry Ingestion:</span>
                  <span className="text-purple-400 font-bold">{skillWeights.telemetry}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={skillWeights.telemetry}
                  onChange={(e) =>
                    setSkillWeights({ ...skillWeights, telemetry: parseInt(e.target.value) })
                  }
                  className="w-full accent-purple-400 bg-zinc-800 h-1.5"
                />

                <div className="flex justify-between items-center">
                  <span>Distributed Architecture & SPSC Queues:</span>
                  <span className="text-purple-400 font-bold">{skillWeights.distributed}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={skillWeights.distributed}
                  onChange={(e) =>
                    setSkillWeights({ ...skillWeights, distributed: parseInt(e.target.value) })
                  }
                  className="w-full accent-purple-400 bg-zinc-800 h-1.5"
                />

                <div className="flex justify-between items-center">
                  <span>Vehicle Dynamics & Numerical Solvers:</span>
                  <span className="text-purple-400 font-bold">{skillWeights.vehicleDyn}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={skillWeights.vehicleDyn}
                  onChange={(e) =>
                    setSkillWeights({ ...skillWeights, vehicleDyn: parseInt(e.target.value) })
                  }
                  className="w-full accent-purple-400 bg-zinc-800 h-1.5"
                />

                <div className="flex justify-between items-center">
                  <span>Applied Machine Learning & PyTorch:</span>
                  <span className="text-purple-400 font-bold">{skillWeights.ml}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={skillWeights.ml}
                  onChange={(e) =>
                    setSkillWeights({ ...skillWeights, ml: parseInt(e.target.value) })
                  }
                  className="w-full accent-purple-400 bg-zinc-800 h-1.5"
                />
              </div>
            </div>

            {/* Computed Cosine Score Output */}
            <div className="p-3.5 bg-black/80 border-2 border-purple-500/80 mb-4 font-mono">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-zinc-400 uppercase">SYNTHETIC CANDIDATE MATCH SCORE:</span>
                <span className="text-2xl font-silkscreen font-bold text-purple-400">
                  {ignictMatchScore.scorePct}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-zinc-300">
                <span>Cohort Applicant Rank:</span>
                <span className="text-emerald-400 font-bold">{ignictMatchScore.cohortRank}</span>
              </div>
              <div className="mt-2.5 p-2 bg-purple-950/40 border border-purple-800/60 text-[10px] text-purple-200">
                <span className="font-bold mr-1">RANKING EXPLANATION:</span>
                Strong alignment across real-time telemetry, low-latency concurrent queues, and vehicle dynamics simulation.
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-800 pt-3 flex justify-between">
              <span>IGNICT INTERNSHIP RESEARCH DEMONSTRATION</span>
              <span>SYNTHETIC PROFILE DATA</span>
            </div>
          </div>
        )}

        {/* ====================================================
            ORIGINAL EXISTING MODALS (PRESERVED & UNCHANGED)
            ==================================================== */}
        {activeStationModal === "ai_engineer" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-cyan-400 animate-pulse inline-block" />
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

        {activeStationModal === "career_wall" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-emerald-400 inline-block" />
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

        {activeStationModal === "contact" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-blue-400 inline-block" />
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
                href="https://github.com/T-Bone47"
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

        {activeStationModal === "strategy_board" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-red-400 inline-block" />
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

        {activeStationModal === "eafc_scout" && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-emerald-400 inline-block" />
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
          </div>
        )}
      </div>
    </div>
  );
};


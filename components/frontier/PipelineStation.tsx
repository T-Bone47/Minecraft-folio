"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  incidents,
  repairs,
  pipelineStages,
  makeIncident,
  runPipeline,
  type FaultId,
  type RepairId,
  type PipelineResult,
} from "@/lib/frontier/pipeline";
import { useMissionStore } from "@/state/missionStore";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";
import { ArrowRight, CheckCircle2, Cpu, Database, Network, ShieldCheck, Terminal, Layers } from "lucide-react";

let cached: {
  fault: FaultId;
  repair: RepairId;
  result: PipelineResult | null;
  stage: number;
} | null = null;

export const DIGITAL_TWIN_STAGES = [
  {
    index: 0,
    name: "Model / Source",
    icon: Cpu,
    purpose: "Vehicle dynamics physics loop running at 60 Hz fixed timestep.",
    input: "User keyboard (WASD) and touch inputs: throttle [-1, 1], brake [0, 1], steering [-1, 1].",
    output: "Kinematic state: position [x, z], yaw heading, velocity m/s, gate progress.",
    rules: "Fixed dt = 1/60s integration. Boundaries clamp radius to [43.3m, 46.7m].",
    codeRef: "lib/frontier/drive.ts :: stepDrive()",
  },
  {
    index: 1,
    name: "Raw Sample Buffer",
    icon: Terminal,
    purpose: "Downsamples simulation to 10 Hz time-series wire format (6 ticks per sample).",
    input: "Continuous 60 Hz physics state updates.",
    output: "Array of TelemetrySample records: timestamp, position, yaw, speed, controls, progress.",
    rules: "Buffer capped at 6,000 samples (10 minutes max flight) to bound memory.",
    codeRef: "components/vehicles/DriveableF1Car.tsx :: accumulator loop",
  },
  {
    index: 2,
    name: "Schema Validation",
    icon: ShieldCheck,
    purpose: "Strict type guard validation ensuring non-null, finite values and monotonic timestamps.",
    input: "Unchecked TelemetrySample packet from vehicle worker or network.",
    output: "Validated telemetry batch or quarantined fault payload.",
    rules: "NaN, null, or out-of-order timestamps trigger validation failure and drop.",
    codeRef: "lib/digitalTwin/telemetrySchema.ts :: validateTelemetrySchema()",
  },
  {
    index: 3,
    name: "Normalisation",
    icon: Layers,
    purpose: "Converts internal SI quantities into canonical display and analytical coordinate frames.",
    input: "Raw speed (m/s), steering (rad), raw yaw (rad).",
    output: "Speed in km/h (speed * 3.6), steering angle in degrees, sector-relative progress (0..1).",
    rules: "Explicit SI units preserved in storage; normalization applied at boundary.",
    codeRef: "lib/digitalTwin/telemetrySchema.ts :: CANONICAL_UNITS",
  },
  {
    index: 4,
    name: "Event Processing",
    icon: Network,
    purpose: "Track progress state machine verifying ordered crossing of 4 circuit timing gates.",
    input: "Current progress radian angle compared to gate threshold (π/2 radians per sector).",
    output: "Sector completion events, sector duration splits, lap validation flag.",
    rules: "Must cross gates in strict sequence 1 → 2 → 3 → 4. Reversing does not trigger gates.",
    codeRef: "lib/frontier/drive.ts :: stepDrive() gate evaluation",
  },
  {
    index: 5,
    name: "Session Storage",
    icon: Database,
    purpose: "Persists completed laps with metadata, schemaVersion 2, and deterministic summary.",
    input: "DriveState + TelemetrySample[] array upon gate 4 completion.",
    output: "Canonical LapRecord persisted in Zustand state and downloadable as JSON.",
    rules: "Isolated stores: measured visitor lap, benchmark reference, and what-if predictions.",
    codeRef: "state/digitalTwinStore.ts :: ingestCompletedLap()",
  },
  {
    index: 6,
    name: "Analytics Engine",
    icon: Cpu,
    purpose: "Numerical distance-aligned spatial solver and corner apex segmentation.",
    input: "Visitor LapRecord and benchmark reference LapRecord.",
    output: "CompleteLapAnalysis: 100-point distance delta curve, corner apex speeds, coaching insights.",
    rules: "Spatial distance alignment (progress s ∈ [0, 1]) prevents timestamp skew.",
    codeRef: "lib/digitalTwin/analysis.ts :: performCompleteLapAnalysis()",
  },
  {
    index: 7,
    name: "Presentation / Decision",
    icon: CheckCircle2,
    purpose: "Surfaces data across Cockpit HUD, Replay Scrubbers, AI Lab, and Garage What-If Centre.",
    input: "CompleteLapAnalysis + EngineeringScenarioConfig.",
    output: "Interactive SVG multi-channel charts, 2D radar tracking, and predicted what-if stint deltas.",
    rules: "Clear provenance labels: Simulator-Generated vs Bundled Reference vs Hypothetical.",
    codeRef: "components/frontier/DriveDebrief.tsx, LapReplay.tsx",
  },
];

export function PipelineStation() {
  const [activeTab, setActiveTab] = useState<"digital_twin" | "diagnostics">("diagnostics");
  const [digitalTwinStageIdx, setDigitalTwinStageIdx] = useState<number>(0);

  // Diagnostic incident state
  const [fault, setFault] = useState<FaultId>(cached?.fault ?? "malformed");
  const [repair, setRepair] = useState<RepairId>(cached?.repair ?? "none");
  const [result, setResult] = useState<PipelineResult | null>(cached?.result ?? null);
  const [stage, setStage] = useState(cached?.stage ?? 0);

  const progress = useMissionStore((s) => s.progress.system);
  const send = useMissionStore((s) => s.send);
  const { recordedLap, missionStep, advanceMissionStep } = useDigitalTwinStore();

  useEffect(() => {
    cached = { fault, repair, result, stage };
  }, [fault, repair, result, stage]);

  const incident = incidents[fault];

  const start = () => {
    send("system", { type: "reset" });
    send("system", { type: "start" });
    setRepair("none");
    setResult(runPipeline(fault, "none"));
  };

  const inspect = () => {
    send("system", { type: "objective", name: "inspect" });
    setStage(incident.stage);
  };

  const apply = () => {
    const r = runPipeline(fault, repair);
    setResult(r);
    if (r.recovered) send("system", { type: "objective", name: "repair" });
  };

  const selectedTwinStage = DIGITAL_TWIN_STAGES[digitalTwinStageIdx];
  const TwinIcon = selectedTwinStage.icon;

  return (
    <div className="frontier-flow text-xs font-mono space-y-4 text-zinc-200">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <Link href="/engineering" className="text-cyan-400 hover:underline">
          Read the simulation architecture and methods ↗
        </Link>
        <span className="text-[10px] text-zinc-400">TELEMETRY TOWER PIPELINE</span>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("digital_twin")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-colors border-b-2 ${
            activeTab === "digital_twin"
              ? "border-cyan-400 text-cyan-300 bg-cyan-950/30"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Digital Twin 8-Stage Architecture
        </button>
        <button
          onClick={() => setActiveTab("diagnostics")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-colors border-b-2 ${
            activeTab === "diagnostics"
              ? "border-amber-400 text-amber-300 bg-amber-950/30"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Fault Diagnosis Lab ({progress.status})
        </button>
      </div>

      {/* ====================================================
          TAB 1: DIGITAL TWIN 8-STAGE ARCHITECTURE
          ==================================================== */}
      {activeTab === "digital_twin" && (
        <div className="space-y-4">
          {/* Active Session Ingestion Banner */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">ACTIVE INGESTION STREAM:</span>
              <span className="font-bold text-white text-[11px]">
                {recordedLap
                  ? `Session ${recordedLap.sessionId} — ${recordedLap.samples.length} samples ingested`
                  : "Standby — Ingesting live simulation telemetry or bundled benchmark session."}
              </span>
            </div>
            {recordedLap && (
              <span className="px-2 py-0.5 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold uppercase">
                {recordedLap.summary.valid ? "HEALTHY STREAM" : "CONTAINS COLLISION FLAGS"}
              </span>
            )}
          </div>

          {/* 8-Stage Pipeline Interactive Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIGITAL_TWIN_STAGES.map((stg) => {
              const StgIcon = stg.icon;
              return (
                <button
                  key={stg.index}
                  onClick={() => setDigitalTwinStageIdx(stg.index)}
                  className={`p-2.5 text-left border transition-all ${
                    digitalTwinStageIdx === stg.index
                      ? "bg-cyan-950/60 border-cyan-400 text-white shadow-sm"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                    <StgIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">STAGE {stg.index + 1}</span>
                  </div>
                  <div className="font-bold text-[11px] text-zinc-200">{stg.name}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Stage Blueprint Inspector */}
          <div className="bg-zinc-950 p-4 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <TwinIcon className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase">
                Stage {selectedTwinStage.index + 1}: {selectedTwinStage.name}
              </h4>
            </div>

            <p className="text-zinc-300 leading-relaxed text-[11px]">
              {selectedTwinStage.purpose}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] pt-1">
              <div className="bg-zinc-900/60 p-2.5 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-bold uppercase block">INPUT DATA:</span>
                <p className="text-zinc-300 font-mono">{selectedTwinStage.input}</p>
              </div>
              <div className="bg-zinc-900/60 p-2.5 border border-zinc-800 space-y-1">
                <span className="text-cyan-400 font-bold uppercase block">OUTPUT CONTRACT:</span>
                <p className="text-zinc-300 font-mono">{selectedTwinStage.output}</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 p-2.5 border border-zinc-800 text-[10px] space-y-1">
              <span className="text-amber-400 font-bold uppercase block">PROCESSING RULES & INVARIANTS:</span>
              <p className="text-zinc-300 font-mono">{selectedTwinStage.rules}</p>
              <div className="pt-1 text-[9px] text-zinc-400">
                Implementation: <code className="text-cyan-300">{selectedTwinStage.codeRef}</code>
              </div>
            </div>

            {missionStep === "INGEST_PIPELINE" && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => advanceMissionStep("ANALYSE_FEATURES")}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1.5 transition-colors uppercase text-[11px]"
                >
                  <span>ADVANCE TO AI/ML INTELLIGENCE LAB</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 2: FAULT DIAGNOSIS LAB (PRESERVED TESTS & SCENARIOS)
          ==================================================== */}
      {activeTab === "diagnostics" && (
        <div className="space-y-4">
          <p className="frontier-kicker">THE SYSTEM / {progress.status} · {progress.step}/3</p>
          <p>
            Diagnose a finite telemetry replay. Counters come from real processing of deterministic fixtures; arrival times, service times and throughput are simulated, not production benchmarks.
          </p>

          <label className="block text-zinc-300">
            Fault scenario
            <select
              value={fault}
              onChange={(e) => {
                setFault(e.target.value as FaultId);
                setResult(null);
                setRepair("none");
                send("system", { type: "reset" });
              }}
              className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white mt-1"
            >
              {Object.entries(incidents).map(([id, v]) => (
                <option key={id} value={id}>
                  {v.title}
                </option>
              ))}
            </select>
          </label>

          <div className="frontier-actions flex gap-2">
            <button onClick={start} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white">
              Start incident / reset
            </button>
            <button
              disabled={!result}
              onClick={inspect}
              className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white"
            >
              Inspect incident evidence
            </button>
          </div>

          <p className="text-amber-200">{incident.hint}</p>

          <ol className="frontier-pipeline flex flex-wrap gap-1 text-[10px]">
            {pipelineStages.map((s, i) => (
              <li key={s}>
                <button
                  aria-pressed={stage === i}
                  onClick={() => setStage(i)}
                  className={`px-2 py-1 border ${
                    stage === i ? "bg-cyan-900 border-cyan-400 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  {i + 1}. {s}
                  {result ? ` · ${result.stageCounts[i]} events` : ""}
                </button>
              </li>
            ))}
          </ol>

          <p className="text-[11px] text-zinc-300">
            Inspecting: <strong>{pipelineStages[stage]}</strong>.{" "}
            {stage === incident.stage
              ? incident.hint
              : stage >= 6
              ? "Accepted canonical events flow to storage, API and delivery. A successful transport does not guarantee correct data."
              : "Check record counts, payload shape and event order before selecting a response."}
          </p>

          {result && (
            <>
              <pre
                aria-label="Raw incident evidence"
                className="bg-black/80 p-2 border border-zinc-800 text-[10px] text-zinc-400 max-h-32 overflow-y-auto"
              >
                {makeIncident(fault)
                  .slice(10, 15)
                  .map((e) => `arrival ${e.arrival} ms / ${e.payload}`)
                  .join("\n")}
              </pre>

              <pre
                aria-label="Pipeline execution log"
                className="bg-black/80 p-2 border border-zinc-800 text-[10px] text-emerald-400 max-h-32 overflow-y-auto"
              >
                {result.trace.join("\n")}
              </pre>

              <div className="frontier-actions space-y-2">
                <label className="block text-zinc-300">
                  Engineering response
                  <select
                    value={repair}
                    onChange={(e) => setRepair(e.target.value as RepairId)}
                    className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white mt-1"
                  >
                    {Object.entries(repairs).map(([id, label]) => (
                      <option value={id} key={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  disabled={progress.step < 1}
                  onClick={apply}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold"
                >
                  Apply repair and replay
                </button>
              </div>

              <table data-testid="pipeline-results" className="w-full text-left border border-zinc-800 mt-2">
                <caption className="text-left text-zinc-400 pb-1">
                  Simulation outcomes over {result.duration} ms
                </caption>
                <thead className="bg-zinc-900 text-zinc-400 text-[10px]">
                  <tr>
                    <th className="p-1.5 border-b border-zinc-800">Metric</th>
                    <th className="p-1.5 border-b border-zinc-800">Observed in fixture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {Object.entries({
                    "Events processed": result.processed,
                    "Rejected events": result.rejected,
                    "Validation failures observed": result.validationFailures,
                    "Queue backlog": result.backlog,
                    "Undelivered events": result.undelivered,
                    "Mean simulated latency (ms)": result.latency,
                    "Simulated throughput (events/s)": result.throughput,
                  }).map(([k, v]) => (
                    <tr key={k}>
                      <th className="p-1.5 text-zinc-300 font-normal">{k}</th>
                      <td className="p-1.5 text-white font-bold">{v.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p
                role="status"
                className={`font-bold ${
                  result.recovered ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {result.recovered
                  ? "RECOVERED — 60 unique, ordered valid events delivered."
                  : "NOT RECOVERED — inspect the evidence and revise your response."}
              </p>

              <button
                disabled={!result.recovered || progress.step !== 2}
                onClick={() => send("system", { type: "objective", name: "validate" })}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white"
              >
                Validate recovered output
              </button>

              <p className="text-[10px] text-zinc-400">
                Quarantined malformed records remain counted as validation failures. Recovery means valid data is preserved; it does not erase the incident. This finite replay does not model distributed failure, durability, real network latency or exactly-once transport guarantees.
              </p>
            </>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="frontier-actions flex flex-wrap gap-3 pt-3 border-t border-zinc-800 text-[11px]">
        <Link href="/projects/live-f1-intelligence" className="text-cyan-400 hover:underline">
          Live F1 architecture ↗
        </Link>
        <Link href="/projects/racemind-ai" className="text-cyan-400 hover:underline">
          RaceMind-AI architecture ↗
        </Link>
        <a
          href="https://github.com/T-Bone47/Football_OS"
          target="_blank"
          rel="noreferrer"
          className="text-cyan-400 hover:underline"
        >
          Football Intelligence source ↗
        </a>
      </div>
    </div>
  );
}

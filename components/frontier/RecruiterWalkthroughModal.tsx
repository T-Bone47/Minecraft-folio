"use client";

import React from "react";
import Link from "next/link";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";
import { useTrialsStore } from "@/state/trialsStore";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Cpu,
  Activity,
  Layers,
  Sliders,
  FileText,
  ExternalLink,
  Github,
  CheckCircle2,
  Wrench,
} from "lucide-react";

export function RecruiterWalkthroughModal() {
  const {
    recruiterWalkthrough,
    recordedLap,
    referenceLap,
    analysis,
    whatIfResult,
    nextRecruiterStep,
    prevRecruiterStep,
    exitRecruiterWalkthrough,
  } = useDigitalTwinStore();

  React.useEffect(() => {
    if (!recruiterWalkthrough.active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitRecruiterWalkthrough();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [recruiterWalkthrough.active, exitRecruiterWalkthrough]);

  if (!recruiterWalkthrough.active) return null;

  const currentLap = recordedLap ?? referenceLap;
  const step = recruiterWalkthrough.step;

  const STEPS_DATA = [
    {
      title: "1. Living Engineering Digital Twin Overview",
      subtitle: "Full-Stack Motorsport Telemetry & Distributed Architecture",
      icon: Cpu,
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            Welcome to the <strong>Living Engineering Digital Twin</strong> of Asish Oliver M&apos;s portfolio. Rather than presenting static resume bullet points or disconnected web widgets, this project integrates genuine vehicle physics, high-frequency telemetry ingestion, numerical performance solvers, and machine learning into a single cohesive 3D system.
          </p>
          <div className="p-3 bg-zinc-900/80 border border-zinc-700 text-[11px] space-y-1">
            <span className="text-cyan-400 font-bold block uppercase">KEY ARCHITECTURAL HIGHLIGHTS:</span>
            <ul className="list-disc list-inside text-zinc-300 space-y-0.5">
              <li><strong>Authoritative Physics Simulation:</strong> 60 Hz fixed-step kinematics with Ackermann-inspired steering.</li>
              <li><strong>Telemetry Ingestion Pipeline:</strong> 10 Hz time-series buffering with strict schema validation.</li>
              <li><strong>Distance-Aligned Time-Loss Engine:</strong> Spatial track progress solver isolating sector and apex deltas.</li>
              <li><strong>Bounded What-If Decision System:</strong> Quasi-static lateral friction model testing setup trade-offs.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "2. Real-Time Telemetry Acquisition",
      subtitle: "10 Hz Multi-Channel Kinematic Data Stream",
      icon: Activity,
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            Every lap completed in the 3D world (or loaded from the bundled deterministic benchmark) produces a structured time-series dataset. The car streams 13 distinct sensor channels at 10 Hz.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2 bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">SESSION ID</span>
              <span className="font-bold text-white text-xs">{currentLap.sessionId}</span>
            </div>
            <div className="p-2 bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">RECORDED DURATION</span>
              <span className="font-bold text-amber-400 text-xs">{currentLap.state.time.toFixed(3)}s</span>
            </div>
            <div className="p-2 bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">TOP VELOCITY</span>
              <span className="font-bold text-emerald-400 text-xs">{currentLap.summary.topSpeedKmh} KM/H</span>
            </div>
            <div className="p-2 bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">SAMPLE COUNT</span>
              <span className="font-bold text-cyan-400 text-xs">{currentLap.samples.length}</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400">
            Channels captured: Timestamp, Position (x, z), Yaw, Velocity (m/s), Longitudinal Acceleration (m/s²), Throttle, Brake, Steering Angle, Lap Progress, Sector, Lap Time, Validity Flag.
          </p>
        </div>
      ),
    },
    {
      title: "3. Telemetry Tower Ingestion Pipeline",
      subtitle: "8-Stage Normalisation & Event Processing",
      icon: Layers,
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            Raw packets pass through the Telemetry Tower&apos;s 8-stage architectural pipeline:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-zinc-900/60 border border-zinc-800">
              <span className="text-cyan-400 font-bold block">1. Model / Source → 2. Wire Buffer</span>
              <span className="text-zinc-400">60 Hz vehicle state downsampled to 10 Hz bounded wire packets.</span>
            </div>
            <div className="p-2 bg-zinc-900/60 border border-zinc-800">
              <span className="text-cyan-400 font-bold block">3. Schema Validation → 4. Normalisation</span>
              <span className="text-zinc-400">Strict NaN/null guards and conversion into canonical SI units.</span>
            </div>
            <div className="p-2 bg-zinc-900/60 border border-zinc-800">
              <span className="text-cyan-400 font-bold block">5. Event Processing → 6. Session Storage</span>
              <span className="text-zinc-400">4-gate checkpoint state machine and persistent Zustand storage.</span>
            </div>
            <div className="p-2 bg-zinc-900/60 border border-zinc-800">
              <span className="text-cyan-400 font-bold block">7. Analytics Engine → 8. Presentation</span>
              <span className="text-zinc-400">Numerical distance alignment, coaching generation, and interactive HUD.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "4. Numerical Lap & Corner Analysis",
      subtitle: "Distance-Aligned Spatial Time-Loss Solver",
      icon: Activity,
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            Comparing laps by timestamp creates progressive skew because a faster car reaches corners earlier. The engine solves this by <strong>discretizing the circuit into 100 spatial distance points</strong> $s \in [0, 1]$ and computing the exact spatial delta curve.
          </p>
          {analysis && (
            <div className="space-y-2 pt-1">
              <div className="p-2.5 bg-zinc-900 border border-zinc-800 flex justify-between items-center text-[11px]">
                <span className="font-bold text-white">OVERALL STINT RATING:</span>
                <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 font-bold border border-cyan-700 uppercase">
                  {analysis.overallRating}
                </span>
              </div>
              <div className="text-[11px] text-zinc-300">
                Key finding:{" "}
                <span className="text-amber-300">
                  {analysis.insights[0]?.observation ?? "Lap closely matched the reference trajectory."}
                </span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "5. Race Engineering What-If Decisions",
      subtitle: "Simulated Stint Trade-Off Evaluation",
      icon: Sliders,
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            In competitive motorsport, race engineers evaluate hypothetical modifications against measured baseline telemetry. The Digital Twin features a bounded deterministic what-if solver testing:
          </p>
          <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-1">
            <li><strong>Braking Point Shifts:</strong> Moving deceleration onset deeper to shave lap tenths.</li>
            <li><strong>Aerodynamic Downforce Trim:</strong> Balancing high-speed corner grip against straight-line drag.</li>
            <li><strong>Tyre Compounds:</strong> Quantifying soft compound mechanical grip versus thermal cliff degradation.</li>
          </ul>
          <p className="text-[11px] text-emerald-400 font-bold pt-1">
            Integrity Rule: Original measured telemetry is never mutated; hypothetical projections are tagged and isolated.
          </p>
        </div>
      ),
    },
    {
      title: "6. Verified Project Evidence & Connect",
      subtitle: "Production Source Code & Credentials",
      icon: FileText,
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            Everything demonstrated in this digital twin directly reflects Asish Oliver M&apos;s open-source projects, algorithms, and engineering background:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <Link
              href="/projects/live-f1-intelligence"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-between text-white"
            >
              <span>Live F1 Intelligence</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
            <Link
              href="/projects/racemind-ai"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-between text-white"
            >
              <span>RaceMind AI</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
            <a
              href="https://github.com/T-Bone47"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-between text-white"
            >
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" /> GitHub Profile
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a
              href="/Asish_Oliver_M_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-between text-white"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Official Resume (PDF)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-600/40 text-[11px] text-emerald-200">
            <strong>Contact:</strong> Asish Oliver M · Integrated M.Tech (CSE) @ VIT-AP · <a href="mailto:dreamteamoliver@gmail.com" className="underline">dreamteamoliver@gmail.com</a>
          </div>
        </div>
      ),
    },
    {
      title: "7. Frontier Engineering Trials — Problem Solved",
      subtitle: "Watch An Operational Engineering Incident Diagnosed & Solved",
      icon: Wrench,
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            The <strong>Frontier Engineering Trials</strong> put visitors into real engineering incidents across Motorsport, AI/ML, and Systems Reliability:
          </p>
          <div className="p-3 bg-zinc-900/90 border border-zinc-700 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-red-400 font-silkscreen text-[11px]">CASE: &quot;THE MISSING FOUR TENTHS&quot;</strong>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">VERIFIED (95%)</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Diagnosed Turn 3 apex velocity deficit (-12.4 km/h) using spatial distance-aligned telemetry. Instructed 8m deeper trail-braking, projecting a 0.284s recovery.
            </p>
          </div>
          <button
            onClick={() => {
              exitRecruiterWalkthrough();
              useTrialsStore.getState().startTrial("race_performance_01");
            }}
            className="w-full py-2.5 font-silkscreen text-xs font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 flex items-center justify-center gap-2 transition-colors"
          >
            <span>LAUNCH INTERACTIVE TRIALS TERMINAL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const currentStepData = STEPS_DATA[step];
  const StepIcon = currentStepData.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none"
      onClick={exitRecruiterWalkthrough}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recruiter Engineering Walkthrough"
        className="mc-panel-dark max-w-xl w-full p-5 sm:p-6 text-zinc-100 rounded-none relative border-2 border-cyan-500/60 shadow-2xl font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={exitRecruiterWalkthrough}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Exit Walkthrough"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <StepIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              RECRUITER FAST TRACK // STEP {step + 1} OF {recruiterWalkthrough.totalSteps}
            </span>
          </div>
          <h2 className="text-base font-bold text-white uppercase">{currentStepData.title}</h2>
          <p className="text-[11px] text-zinc-400">{currentStepData.subtitle}</p>
        </div>

        {/* Step Content */}
        <div className="min-h-[220px] text-zinc-200 text-xs">{currentStepData.content}</div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800">
          <button
            onClick={prevRecruiterStep}
            disabled={step === 0}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white font-bold flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>PREV</span>
          </button>

          <div className="flex gap-1.5">
            {STEPS_DATA.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 ${
                  i === step ? "bg-cyan-400" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>

          {step < recruiterWalkthrough.totalSteps - 1 ? (
            <button
              onClick={nextRecruiterStep}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1 transition-colors uppercase"
            >
              <span>NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={exitRecruiterWalkthrough}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold flex items-center gap-1 transition-colors uppercase"
            >
              <span>EXPLORE CAMPUS</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

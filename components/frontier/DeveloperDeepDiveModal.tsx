"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Code2, Database, Activity, Cpu, Layers, GitBranch, ShieldAlert } from "lucide-react";

interface DeveloperDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperDeepDiveModal({ isOpen, onClose }: DeveloperDeepDiveModalProps) {
  const [activeSection, setActiveSection] = useState<
    "architecture" | "simulation" | "schema" | "algorithms" | "performance" | "testing"
  >("architecture");

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none font-mono text-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Senior Developer Technical Deep Dive"
        className="mc-panel-dark max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 text-zinc-100 rounded-none relative border-2 border-zinc-700 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Close Dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Code2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              SOFTWARE ARCHITECTURE // SENIOR DEVELOPER DEEP DIVE
            </span>
          </div>
          <h2 className="text-base font-bold text-white uppercase">
            The Living Engineering Digital Twin Implementation
          </h2>
          <p className="text-[11px] text-zinc-400">
            Design contracts, data ownership, numerical algorithms, and performance budgets.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-zinc-800 pb-2 text-[10px]">
          {(
            [
              { id: "architecture", label: "Pipeline & Data Flow" },
              { id: "simulation", label: "Simulation State" },
              { id: "schema", label: "Event & Telemetry Schema" },
              { id: "algorithms", label: "Spatial Delta Solver" },
              { id: "performance", label: "Performance & Memory" },
              { id: "testing", label: "QA & Verification" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-1.5 border transition-colors ${
                activeSection === tab.id
                  ? "bg-cyan-950 border-cyan-400 text-white font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Architecture */}
        {activeSection === "architecture" && (
          <div className="space-y-3 leading-relaxed text-zinc-300">
            <h3 className="font-bold text-white text-sm uppercase">1. System Topology & Event Flow</h3>
            <p>
              The digital twin separates physics computation, telemetry ingestion, analytical derivation, and rendering. Components communicate via an event-driven typed pipeline:
            </p>
            <div className="p-3 bg-black/60 border border-zinc-800 text-[11px] text-cyan-300 font-mono">
              USER INPUT (WASD / Touch)
              <br />→ Fixed-Step Vehicle Kinematics Loop (60 Hz dt=1/60s)
              <br />→ Time-Series Downsampler (10 Hz wire rate)
              <br />→ Schema Validator & SI Normalizer (Zod-level guards)
              <br />→ Checkpoint State Machine (4 circuit sectors)
              <br />→ Canonical Zustand Session Storage (useDigitalTwinStore)
              <br />→ Distance-Aligned Spatial Delta Solver (100-bin interpolation)
              <br />→ Race Engineering Decision Centre & Presentation HUD
            </div>
            <p className="text-[11px] text-zinc-400">
              Primary code: <code className="text-white">lib/digitalTwin/telemetrySchema.ts</code> and <code className="text-white">state/digitalTwinStore.ts</code>.
            </p>
          </div>
        )}

        {/* Tab 2: Simulation */}
        {activeSection === "simulation" && (
          <div className="space-y-3 leading-relaxed text-zinc-300">
            <h3 className="font-bold text-white text-sm uppercase">2. Authoritative Kinematics Loop</h3>
            <p>
              Vehicle dynamics run inside a decoupled accumulator loop:
            </p>
            <pre className="bg-black/70 p-3 border border-zinc-800 text-[10px] text-emerald-400 overflow-x-auto">
{`// Fixed timestep integration: dt = 1/60s (0.01667s)
while (accumulator >= FIXED_DT) {
  accumulator -= FIXED_DT;
  // Speed-sensitive steering resistance
  steering += (clamp(input.steering, -1, 1) * 0.55 / (1 + |speed| * 0.025) - steering) * dt * 9;
  
  // Aerodynamic drag + rolling resistance
  drag = 0.015 * speed * |speed| + 0.35 * sign(speed);
  speed = clamp(speed + (throttle * 8 - drag) * dt, -5, 22);
  
  // Yaw integration & Cartesian position update
  yaw += (speed / 2.8) * tan(steering) * dt;
  x += sin(yaw) * speed * dt;
  z += cos(yaw) * speed * dt;
}`}
            </pre>
            <p className="text-[11px] text-zinc-400">
              Boundary collision clamping ensures the vehicle is retained within track perimeter with a speed degradation penalty factor ($0.75$) instead of physical clipping or wall sticking.
            </p>
          </div>
        )}

        {/* Tab 3: Schema */}
        {activeSection === "schema" && (
          <div className="space-y-3 leading-relaxed text-zinc-300">
            <h3 className="font-bold text-white text-sm uppercase">3. Canonical Telemetry Event Schema</h3>
            <p>
              Every telemetry record conforms to Schema Version 2.0.0 with explicit SI units:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-zinc-900/60 p-2 border border-zinc-800">
                <strong className="text-cyan-400 block">time: &quot;s&quot;</strong>
                <span className="text-zinc-400">Floating-point seconds from stint start.</span>
              </div>
              <div className="bg-zinc-900/60 p-2 border border-zinc-800">
                <strong className="text-cyan-400 block">speed: &quot;m/s&quot;</strong>
                <span className="text-zinc-400">Internal SI metres/second; converted to km/h (* 3.6) for UI.</span>
              </div>
              <div className="bg-zinc-900/60 p-2 border border-zinc-800">
                <strong className="text-cyan-400 block">steering: &quot;rad&quot;</strong>
                <span className="text-zinc-400">Steered wheel angle [-0.55, +0.55] rad.</span>
              </div>
              <div className="bg-zinc-900/60 p-2 border border-zinc-800">
                <strong className="text-cyan-400 block">lapProgress: &quot;fraction&quot;</strong>
                <span className="text-zinc-400">Dimensionless ratio [0.0, 1.0] along track perimeter.</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400">
              Implementation: <code className="text-white">lib/digitalTwin/telemetrySchema.ts</code>.
            </p>
          </div>
        )}

        {/* Tab 4: Algorithms */}
        {activeSection === "algorithms" && (
          <div className="space-y-3 leading-relaxed text-zinc-300">
            <h3 className="font-bold text-white text-sm uppercase">4. Distance-Aligned Spatial Delta Solver</h3>
            <p>
              Traditional naive telemetry delta calculations simply compare $t_1(i) - t_2(i)$ at sample index $i$, which introduces progressive temporal distortion as the faster car pulls ahead.
            </p>
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-2">
              <strong className="text-amber-400 block uppercase">Spatial Discretization Solution:</strong>
              <p>
                1. Discretize normalized track progress s in [0, 1] into N=100 equidistant distance bins (2.83m each).
                <br />2. For both visitor and reference sample series, perform binary search to locate adjacent bounding samples.
                <br />3. Linearly interpolate speed v(s) and elapsed time t(s) at spatial point s.
                <br />4. Compute cumulative time delta: Delta t(s) = t_visitor(s) - t_ref(s).
              </p>
            </div>
            <p className="text-[11px] text-zinc-400">
              Implementation: <code className="text-white">lib/digitalTwin/analysis.ts :: solveDistanceAlignedDeltas()</code>.
            </p>
          </div>
        )}

        {/* Tab 5: Performance */}
        {activeSection === "performance" && (
          <div className="space-y-3 leading-relaxed text-zinc-300">
            <h3 className="font-bold text-white text-sm uppercase">5. Performance Budgets & GC Management</h3>
            <ul className="list-disc list-inside text-[11px] space-y-1.5">
              <li><strong>Zero Per-Frame Garbage Allocation:</strong> Fixed Vector3 and Matrix4 scratch objects allocated once outside `useFrame`.</li>
              <li><strong>Bounded Memory Buffer:</strong> Sample array hard-capped at 6,000 samples (~10 minutes continuous flight, ~680 KB JSON payload).</li>
              <li><strong>Downsampled Wire Rate:</strong> Simulation runs at 60 Hz, but telemetry capture is throttled to 10 Hz (`tick % 6 === 0`), reducing storage by 83.3%.</li>
              <li><strong>Memoized Analytics:</strong> Full lap analysis is computed only upon session completion or what-if scenario parameter changes.</li>
            </ul>
          </div>
        )}

        {/* Tab 6: Testing */}
        {activeSection === "testing" && (
          <div className="space-y-3 leading-relaxed text-zinc-300">
            <h3 className="font-bold text-white text-sm uppercase">6. Testing & Automated Verification</h3>
            <p>
              The digital twin is validated through 51 unit tests and headless Chromium Puppeteer end-to-end testing:
            </p>
            <div className="p-3 bg-black/60 border border-zinc-800 text-[11px] text-zinc-300 font-mono space-y-1">
              <div>✔ Deterministic reference lap generation (&lt;120s, 4 sectors)</div>
              <div>✔ Non-tunneling wall collision resolution (R=0.38m)</div>
              <div>✔ Zero-leakage ML train/test splitting (144 train / 36 test holdout)</div>
              <div>✔ Pipeline fault recovery under 7 wire-level anomalies</div>
              <div>✔ Distance-aligned spatial interpolation and what-if isolation</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-[11px]">
          <a
            href="https://github.com/T-Bone47/Minecraft-folio"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Inspect GitHub Repository</span>
            <GitBranch className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
          >
            CLOSE INSPECTION
          </button>
        </div>
      </div>
    </div>
  );
}

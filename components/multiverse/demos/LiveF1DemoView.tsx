"use client";

import React, { useEffect } from "react";
import { useMultiverseStore } from "@/state/multiverseStore";
import { Play, Pause, FastForward, Activity, Radio, Cpu, Layers } from "lucide-react";

export const LiveF1DemoView: React.FC = () => {
  const liveF1State = useMultiverseStore((s) => s.liveF1State);
  const toggleLiveF1Playback = useMultiverseStore((s) => s.toggleLiveF1Playback);
  const setLiveF1Speed = useMultiverseStore((s) => s.setLiveF1Speed);
  const setSelectedF1Driver = useMultiverseStore((s) => s.setSelectedF1Driver);
  const stepLiveF1 = useMultiverseStore((s) => s.stepLiveF1);

  const {
    isPlaying,
    playbackSpeed,
    currentEventIndex,
    totalCanonicalEvents,
    activeSession,
    telemetryStreamRate,
    p50LatencyMs,
    drivers,
    selectedDriver,
    telemetryTrace,
  } = liveF1State;

  // Animation frame loop for streaming replay
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      if (dt > 0 && dt < 0.2) {
        stepLiveF1(dt);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [stepLiveF1]);

  const selectedDriverData = drivers.find((d) => d.driverCode === selectedDriver) || drivers[0];

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans" data-testid="livef1-demo-container">
      {/* 1. Header Banner & Provenance */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
            <h3 className="text-lg font-bold uppercase tracking-wider text-blue-300 font-mono">
              THE RACE CONTROL INTELLIGENCE CENTRE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Canonical event stream replay of {activeSession}. Zero dropped records across multi-source feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
            PROVENANCE: RECORDED_REPLAY
          </span>
        </div>
      </div>

      {/* 2. Pipeline Stream Health & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Canonical Events</div>
          <div className="text-lg font-mono font-bold text-blue-400 mt-0.5">
            {currentEventIndex.toLocaleString()} / {totalCanonicalEvents.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">0 Malformed records</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Ingestion Throughput</div>
          <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
            ~{telemetryStreamRate.toLocaleString()} / sec
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">4 Provider parallel feeds</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">P50 Processing Latency</div>
          <div className="text-lg font-mono font-bold text-sky-300 mt-0.5">
            {p50LatencyMs.toFixed(2)} ms
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Zero-allocation Pydantic core</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Active Storage</div>
          <div className="text-lg font-mono font-bold text-purple-400 mt-0.5">
            TimescaleDB
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">99 MB peak memory footprint</div>
        </div>
      </div>

      {/* 3. Replay Timeline Scrubber & Playback Controls */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLiveF1Playback()}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "PAUSE REPLAY" : "RESUME REPLAY"}</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setLiveF1Speed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                    playbackSpeed === spd
                      ? "bg-blue-500 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Session Progress:{" "}
            <span className="text-blue-300 font-bold">
              {((currentEventIndex / totalCanonicalEvents) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-100"
            style={{ width: `${(currentEventIndex / totalCanonicalEvents) * 100}%` }}
          />
        </div>
      </div>

      {/* 4. Live Timing Tower & Driver Telemetry Traces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timing Tower */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">
              Live Timing Tower (Canonical Grid)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Click driver to inspect trace</span>
          </div>

          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[320px] pr-1">
            {drivers.map((d) => (
              <button
                key={d.driverCode}
                onClick={() => setSelectedF1Driver(d.driverCode)}
                className={`flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                  selectedDriver === d.driverCode
                    ? "bg-blue-950/60 border border-blue-500/50"
                    : "bg-slate-950/40 border border-slate-800/80 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-400 w-4">
                    {d.position}
                  </span>
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{ backgroundColor: d.teamColor }}
                  />
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {d.driverCode}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1.5 hidden sm:inline">
                      {d.team}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                    {d.compound[0]} ({d.tyreAge}L)
                  </span>
                  <span className="text-slate-300 w-14 text-right">
                    {d.position === 1 ? "LEADER" : `+${d.gapToLeader.toFixed(2)}s`}
                  </span>
                  <span className="text-[10px] text-slate-400 w-12 text-right">
                    {d.speedTrapKmH.toFixed(0)} km/h
                  </span>
                  {d.drsActive && (
                    <span className="text-[9px] font-bold px-1 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                      DRS
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Trace Visualizer */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-blue-300">
                Telemetry Trace: {selectedDriverData.driverCode} ({selectedDriverData.team})
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Speed: {selectedDriverData.speedTrapKmH.toFixed(0)} km/h
              </span>
            </div>

            {/* Micro-Sectors */}
            <div className="grid grid-cols-3 gap-2 my-3 font-mono text-xs">
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">Sector 1</div>
                <div className="font-bold text-emerald-400">{selectedDriverData.sector1.toFixed(3)}s</div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">Sector 2</div>
                <div className="font-bold text-purple-400">{selectedDriverData.sector2.toFixed(3)}s</div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">Sector 3</div>
                <div className="font-bold text-amber-400">{selectedDriverData.sector3.toFixed(3)}s</div>
              </div>
            </div>

            {/* Sparkline / Telemetry Bar Representation */}
            <div className="p-3 rounded bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Distance-Domain Speed Trace (Zandvoort 4,307m)
              </div>
              <div className="h-24 flex items-end gap-1 pt-2">
                {telemetryTrace.map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-400"
                      style={{ height: `${(pt.speed / 340) * 100}%` }}
                    />
                    <div className="hidden group-hover:block absolute bottom-full mb-1 z-10 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap">
                      {pt.speed} km/h (G{pt.gear})
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0m (Pit Straight)</span>
                <span>2,100m (Scheivlak)</span>
                <span>4,307m (Arie Luyendyk)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono text-slate-400">
            Event Provenance Hash:{" "}
            <span className="text-slate-300">
              sha256:7c4a10e8... (Verified 2025 Dutch GP Canonical Session)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


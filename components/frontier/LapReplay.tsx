"use client";

import React, { useEffect, useState, useRef } from "react";
import type { LapRecord } from "@/lib/digitalTwin/telemetrySchema";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";

interface LapReplayProps {
  lap: LapRecord;
  referenceLap?: LapRecord;
}

export function LapReplay({ lap, referenceLap }: LapReplayProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 2>(1);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const samples = lap.samples;
  const currentSample = samples[index] || samples[0] || {
    timestamp: 0,
    x: -45,
    z: 0,
    yaw: 0,
    speed: 0,
    steering: 0,
    throttle: 0,
    brake: 0,
    lapProgress: 0,
  };

  useEffect(() => {
    if (!playing) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTickRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      const targetInterval = 0.1 / playbackSpeed; // Samples recorded at ~10Hz (every 0.1s)

      if (elapsed >= targetInterval) {
        lastTickRef.current = now;
        setIndex((prev) => {
          if (prev >= samples.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [playing, playbackSpeed, samples.length]);

  const handleSeek = (newIdx: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(samples.length - 1, newIdx)));
  };

  const handleRestart = () => {
    setPlaying(false);
    setIndex(0);
  };

  const currentSpeedKmh = Math.abs(currentSample.speed) * 3.6;

  return (
    <div className="bg-zinc-950/90 border border-zinc-800 p-4 rounded-none text-zinc-100 my-4 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-none animate-pulse" />
          <span className="text-cyan-400 font-bold uppercase tracking-wider">
            SYNCHRONIZED TELEMETRY REPLAY // 10 HZ
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span>SOURCE: <strong className="text-amber-300">{lap.provenanceLabel}</strong></span>
          <span>·</span>
          <span>{samples.length} SAMPLES</span>
        </div>
      </div>

      {/* Main Visualizer Grid: 2D Radar Track Map (Left) + Cockpit Steering Gauge (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
        {/* 2D Overhead Circuit Radar */}
        <div className="bg-black/60 border border-zinc-800 p-2 relative flex flex-col items-center">
          <span className="absolute top-2 left-2 text-[10px] text-zinc-400">
            2D TRACK POSITION & HEADING
          </span>
          <svg
            viewBox="-60 -60 120 120"
            className="w-48 h-48 sm:w-56 sm:h-56"
            role="img"
            aria-label="2D Track Overhead Map"
          >
            {/* Track Outer/Inner Boundary (R=45m, Width=5m) */}
            <circle cx="0" cy="0" r="47.5" fill="none" stroke="#2a2e37" strokeWidth="6" />
            <circle cx="0" cy="0" r="45" fill="none" stroke="#444b58" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="0" cy="0" r="42.5" fill="none" stroke="#2a2e37" strokeWidth="6" />

            {/* Timing Sectors */}
            <line x1="-50" y1="0" x2="-40" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="0" y1="-50" x2="0" y2="-40" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="50" y1="0" x2="40" y2="0" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="0" y1="50" x2="0" y2="40" stroke="#06b6d4" strokeWidth="1.5" />

            {/* Reference Car Position (if provided) */}
            {referenceLap && referenceLap.samples[index] && (
              <circle
                cx={referenceLap.samples[index].x}
                cy={referenceLap.samples[index].z}
                r="2.5"
                fill="#22d3ee"
                opacity="0.6"
              />
            )}

            {/* Current Car Marker (Oriented with Heading) */}
            <g
              transform={`translate(${currentSample.x}, ${currentSample.z}) rotate(${
                (-currentSample.yaw * 180) / Math.PI + 90
              })`}
            >
              {/* Car Body Triangle */}
              <polygon points="0,-4 3,4 -3,4" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
              <line x1="0" y1="-4" x2="0" y2="-7" stroke="#22d3ee" strokeWidth="1" />
            </g>
          </svg>
          <div className="w-full flex justify-between text-[10px] text-zinc-400 px-2 mt-1">
            <span>S1 (0° N)</span>
            <span>S2 (90° E)</span>
            <span>S3 (180° S)</span>
            <span>S4 (270° W)</span>
          </div>
        </div>

        {/* Cockpit Gauges & Steering Angle */}
        <div className="flex flex-col justify-center space-y-3 p-3 bg-black/60 border border-zinc-800">
          <div className="flex justify-between items-baseline border-b border-zinc-800 pb-2">
            <div>
              <div className="text-[10px] text-zinc-400">VEHICLE VELOCITY</div>
              <div className="text-2xl font-bold text-white font-mono">
                {currentSpeedKmh.toFixed(1)} <span className="text-xs text-cyan-400">KM/H</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-400">SIMULATION TIME</div>
              <div className="text-lg font-bold text-amber-400">
                {currentSample.timestamp.toFixed(2)}s
              </div>
            </div>
          </div>

          {/* Steering Angle Wheel Dial */}
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 50" className="w-24 h-12">
              <rect x="5" y="15" width="90" height="20" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
              <g
                transform={`translate(50, 25) rotate(${
                  (currentSample.steering * 180) / Math.PI * 2.8
                })`}
              >
                <circle cx="0" cy="0" r="16" fill="none" stroke="#22d3ee" strokeWidth="3" />
                <line x1="0" y1="-16" x2="0" y2="16" stroke="#ffffff" strokeWidth="2" />
                <line x1="-16" y1="0" x2="16" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
              </g>
            </svg>
            <div className="text-[11px] space-y-0.5">
              <div className="text-zinc-400">
                STEERING: <span className="text-cyan-300 font-bold">{(currentSample.steering * 57.2958).toFixed(1)}°</span>
              </div>
              <div className="text-zinc-400">
                ACCEL: <span className="text-zinc-200">{(currentSample.acceleration || 0).toFixed(2)} m/s²</span>
              </div>
            </div>
          </div>

          {/* Throttle and Brake Pedals */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-14 text-emerald-400">THROTTLE:</span>
              <div className="flex-1 bg-zinc-900 h-2 border border-zinc-700">
                <div
                  className="bg-emerald-500 h-full transition-all duration-75"
                  style={{ width: `${Math.round(currentSample.throttle * 100)}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-zinc-300">
                {Math.round(currentSample.throttle * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-14 text-red-400">BRAKE:</span>
              <div className="flex-1 bg-zinc-900 h-2 border border-zinc-700">
                <div
                  className="bg-red-500 h-full transition-all duration-75"
                  style={{ width: `${Math.round(currentSample.brake * 100)}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-zinc-300">
                {Math.round(currentSample.brake * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Multi-Channel Telemetry Chart */}
      <div className="space-y-2 mb-4 bg-black/40 border border-zinc-800 p-2">
        <div className="flex justify-between items-center text-[10px] text-zinc-400">
          <span>SPEED & INPUT CHANNELS OVER LAP PROGRESS (0% → 100%)</span>
          <div className="flex gap-3">
            <span className="text-amber-400">■ Speed</span>
            <span className="text-emerald-400">■ Throttle</span>
            <span className="text-red-400">■ Brake</span>
            <span className="text-cyan-400">■ Steering</span>
          </div>
        </div>

        <div className="relative h-28 w-full border border-zinc-800 bg-zinc-950">
          <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Sector Division Lines */}
            <line x1="150" y1="0" x2="150" y2="100" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="300" y1="0" x2="300" y2="100" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="450" y1="0" x2="450" y2="100" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />

            {/* Speed Trace */}
            <polyline
              points={samples
                .map((s) => `${s.lapProgress * 600},${90 - (Math.abs(s.speed) / 22) * 80}`)
                .join(" ")}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />

            {/* Throttle Trace (Green) */}
            <polyline
              points={samples
                .map((s) => `${s.lapProgress * 600},${95 - s.throttle * 25}`)
                .join(" ")}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Brake Trace (Red) */}
            <polyline
              points={samples
                .map((s) => `${s.lapProgress * 600},${95 - s.brake * 25}`)
                .join(" ")}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Steering Trace (Cyan) */}
            <polyline
              points={samples
                .map((s) => `${s.lapProgress * 600},${50 - (s.steering / 0.55) * 35}`)
                .join(" ")}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              opacity="0.7"
            />

            {/* Scrubber Playhead Line */}
            <line
              x1={currentSample.lapProgress * 600}
              y1="0"
              x2={currentSample.lapProgress * 600}
              y2="100"
              stroke="#38bdf8"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Replay Controls & Timeline Scrubber */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/60 p-2 border border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlaying(!playing)}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1.5 transition-colors"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{playing ? "Pause replay" : "Play replay"}</span>
          </button>
          <button
            onClick={handleRestart}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Restart Replay"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center border border-zinc-700 bg-zinc-950 text-[10px]">
            {([0.5, 1, 2] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 ${
                  playbackSpeed === spd ? "bg-cyan-500 text-black font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={samples.length - 1}
            value={index}
            onChange={(e) => handleSeek(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer"
            aria-label="Replay time"
          />
          <span className="text-[10px] text-zinc-400 min-w-14 text-right">
            {index + 1} / {samples.length}
          </span>
        </div>
      </div>
    </div>
  );
}

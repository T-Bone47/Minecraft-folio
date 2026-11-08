"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSettingsStore } from "@/state/settingsStore";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { facilities } from "@/data/facilities";
import { CIRCUIT_WAYPOINTS } from "@/data/world";
import { X, Navigation, ExternalLink, Compass } from "lucide-react";

export const WorldMap: React.FC = () => {
  const { minimapOpen, setMinimapOpen } = useSettingsStore();
  const { activeLocation, focusLocation, inspectProject } = useWorldStore();
  const { setTargetTransform } = useCameraStore();
  const playerPosition = useWorldStore((s) => s.playerPosition);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  if (!minimapOpen) return null;

  // Map world coordinate [-40, 40] to SVG viewBox [0, 400]
  const mapCoord = (x: number, z: number) => {
    const svgX = ((x + 55) / 110) * 400;
    const svgY = ((z + 55) / 110) * 400;
    return { x: svgX, y: svgY };
  };

  const circuitPath =
    CIRCUIT_WAYPOINTS.map((wp, idx) => {
      const { x, y } = mapCoord(wp[0], wp[2]);
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ") + " Z";

  const playerSvg = mapCoord(playerPosition[0], playerPosition[2]);
  const activeFac = selectedFacilityId
    ? facilities.find((f) => f.id === selectedFacilityId)
    : facilities.find((f) => f.id === activeLocation) || facilities[0];

  const handleTeleport = (facId: string) => {
    const fac = facilities.find((f) => f.id === facId);
    if (fac) {
      focusLocation(fac.id);
      const [sx, , sz] = fac.approachPosition;
      setTargetTransform(
        [sx, fac.coordinates[1] + 1.65, sz],
        fac.approachLookAt
      );
      setMinimapOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-silkscreen select-none">
      <div className="w-full max-w-4xl mc-panel-dark border-4 border-[#52525b] shadow-2xl p-5 md:p-7 relative">
        <button className="mc-btn p-2 mb-2" onClick={() => { useWorldStore.getState().setMode("explore");setTargetTransform([-12,2.15,4],[-12,1.4,-8]);setMinimapOpen(false); }}>Return to spawn</button>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block">
              CARTOGRAPHER MAP
            </span>
            <span className="text-white text-sm font-bold tracking-tight">
              {"// MOTORSPORT CAMPUS"}
            </span>
          </div>
          <button
            onClick={() => setMinimapOpen(false)}
            className="mc-btn p-1.5 text-zinc-300 hover:text-white"
            title="Close (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* 2D Voxel Cartographer Canvas */}
          <div className="md:col-span-2 relative aspect-square w-full bg-[#1b2617] border-4 border-zinc-700 shadow-inner overflow-hidden">
            {/* Voxel parchment map pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#4d7c0f 15%, transparent 16%), radial-gradient(#15803d 15%, transparent 16%)`,
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0, 4px 4px",
              }}
            />

            <svg viewBox="0 0 400 400" className="w-full h-full p-2">
              {/* Island Boundary */}
              <circle
                cx="200"
                cy="200"
                r="185"
                fill="#2d4a1d"
                stroke="#4d7c0f"
                strokeWidth="4"
              />
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="#365e23"
              />

              {/* Water Pond in Center */}
              <circle
                cx="230"
                cy="190"
                r="25"
                fill="#2563eb"
                stroke="#1d4ed8"
                strokeWidth="2"
              />

              {/* Campus Cobblestone Paths */}
              {/* Garage to Operations */}
              <line
                x1={mapCoord(-12, 0).x}
                y1={mapCoord(-12, 0).y}
                x2={mapCoord(-12, 14).x}
                y2={mapCoord(-12, 14).y}
                stroke="#71717a"
                strokeWidth="4"
                strokeDasharray="2 2"
              />
              {/* AI to Center */}
              <line
                x1={mapCoord(0, 24).x}
                y1={mapCoord(0, 24).y}
                x2={mapCoord(0, 8).x}
                y2={mapCoord(0, 8).y}
                stroke="#71717a"
                strokeWidth="4"
                strokeDasharray="2 2"
              />
              {/* Simulation to Center */}
              <line
                x1={mapCoord(22, 8).x}
                y1={mapCoord(22, 8).y}
                x2={mapCoord(12, 8).x}
                y2={mapCoord(12, 8).y}
                stroke="#71717a"
                strokeWidth="4"
                strokeDasharray="2 2"
              />

              {/* Circuit Outer Line & Kerbs */}
              <path
                d={circuitPath}
                fill="none"
                stroke="#ef4444"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={circuitPath}
                fill="none"
                stroke="#18181b"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={circuitPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Start / Finish Line marker */}
              <rect
                x={mapCoord(-24, -2).x - 4}
                y={mapCoord(-24, -2).y - 2}
                width="8"
                height="4"
                fill="#fbbf24"
              />

              {/* Facility Nodes */}
              {facilities.map((fac) => {
                const { x, y } = mapCoord(fac.coordinates[0], fac.coordinates[2]);
                const isSelected = activeFac?.id === fac.id;
                return (
                  <g
                    key={fac.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedFacilityId(fac.id)}
                  >
                    <rect
                      x={x - (isSelected ? 9 : 7)}
                      y={y - (isSelected ? 9 : 7)}
                      width={isSelected ? 18 : 14}
                      height={isSelected ? 18 : 14}
                      fill={fac.colorAccent}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text
                      x={x + 12}
                      y={y + 4}
                      fill="#ffffff"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="drop-shadow"
                    >
                      {fac.code.split(" / ")[1]}
                    </text>
                  </g>
                );
              })}

              {/* Player Icon with Pulsing Compass Beacon */}
              <g transform={`translate(${playerSvg.x}, ${playerSvg.y})`}>
                <circle cx="0" cy="0" r="5" fill="#38bdf8" />
                <circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="animate-ping"
                />
              </g>
            </svg>
          </div>

          {/* Selected Facility Details Sidebar */}
          {activeFac && (
            <div className="mc-panel-dark border-2 border-zinc-700 p-4 flex flex-col justify-between h-full min-h-[340px]">
              <div>
                <div className="font-pixel text-[8px] text-amber-400 mb-1">
                  {activeFac.code}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {activeFac.name}
                </h3>
                <div className="text-[10px] text-sky-300 mb-2 font-mono">
                  {activeFac.tagline}
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mb-3">
                  {activeFac.description}
                </p>

                <div className="text-[9px] uppercase text-zinc-500 font-bold mb-1.5">
                  FACILITY FEATURES
                </div>
                <div className="space-y-1 mb-4">
                  {activeFac.features.slice(0, 3).map((feat, i) => (
                    <div
                      key={i}
                      className="text-[10px] text-zinc-300 flex items-start gap-1 font-mono"
                    >
                      <span className="text-amber-400">&gt;</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => handleTeleport(activeFac.id)}
                  className="mc-btn w-full py-2 px-3 text-xs flex items-center justify-center gap-1.5 text-white !bg-emerald-700 hover:!bg-emerald-600 border-emerald-400"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>TRAVEL TO FACILITY</span>
                </button>

                {activeFac.projectSlug && (
                  <Link
                    href={`/work/${activeFac.projectSlug}`}
                    className="mc-btn w-full py-2 px-3 text-xs flex items-center justify-center gap-1.5 text-zinc-200 hover:text-white"
                  >
                    <span>OPEN CASE STUDY</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t-2 border-zinc-700 flex flex-wrap items-center justify-between gap-2 text-[9px] text-zinc-400 font-pixel">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-red-500 inline-block" /> GARAGE
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-blue-500 inline-block" /> TELEMETRY
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 inline-block" /> SIMULATION
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-500 inline-block" /> OPERATIONS
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-purple-500 inline-block" /> AI LAB
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-cyan-500 inline-block" /> ENG HQ
            </span>
          </div>
          <span className="text-sky-300">CLICK NODE TO TELEPORT</span>
        </div>
      </div>
    </div>
  );
};

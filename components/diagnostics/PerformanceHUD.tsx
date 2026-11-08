"use client";

import React, { useEffect, useState } from "react";
import { useSettingsStore } from "@/state/settingsStore";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";

export const PerformanceHUD: React.FC = () => {
  const { showPerformanceHUD, togglePerformanceHUD, renderStats, timeOfDay, qualityTierOverride } =
    useSettingsStore();
  const { deviceTier, mode, activeLocation, playerPosition } = useWorldStore();
  const { cameraMode } = useCameraStore();

  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);

  useEffect(() => {
    if (!showPerformanceHUD) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 1000) {
        const measuredFps = Math.round((frameCount * 1000) / delta);
        setFps(measuredFps);
        setFrameTime(parseFloat((delta / frameCount).toFixed(1)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [showPerformanceHUD]);

  if (!showPerformanceHUD) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-auto border border-[#3b82f6]/40 bg-[#09090b]/95 backdrop-blur-md p-4 font-mono text-[11px] text-[#f4f4f5] shadow-2xl min-w-[240px]">
      <div className="flex items-center justify-between border-b border-[#27272a] pb-2 mb-2 text-[#3b82f6] font-bold">
        <span>ENGINEERING DIAGNOSTICS [F3]</span>
        <button
          onClick={togglePerformanceHUD}
          className="text-[#71717a] hover:text-white cursor-pointer px-1"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">FPS:</span>
          <span
            className={`font-bold ${
              fps >= 55
                ? "text-[#10b981]"
                : fps >= 30
                ? "text-[#f59e0b]"
                : "text-[#ef4444]"
            }`}
          >
            {fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">FRAME TIME:</span>
          <span>{frameTime} ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">DRAW CALLS:</span>
          <span className="text-white font-bold">{renderStats.drawCalls}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">TRIANGLES:</span>
          <span className="text-white">{renderStats.triangles.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">GEOMETRIES:</span>
          <span className="text-[#38bdf8]">{renderStats.geometries}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">TEXTURES:</span>
          <span className="text-[#38bdf8]">{renderStats.textures}</span>
        </div>
        <div>TEXTURE ESTIMATE: {(renderStats.textureBytesEstimate / 1048576).toFixed(2)} MiB (RGBA+mips)</div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">ENVIRONMENT:</span>
          <span className="uppercase text-[#f59e0b] font-bold">{timeOfDay}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">FACILITY:</span>
          <span className="uppercase text-[#10b981]">{activeLocation || "CAMPUS"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">TIER:</span>
          <span className="uppercase text-[#3b82f6]">{qualityTierOverride === "auto" ? deviceTier : qualityTierOverride}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">WORLD MODE:</span>
          <span className="uppercase text-white">{mode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a1aa]">POSITION:</span>
          <span>
            [{playerPosition.map((n) => n.toFixed(1)).join(", ")}]
          </span>
        </div>
      </div>
    </div>
  );
};

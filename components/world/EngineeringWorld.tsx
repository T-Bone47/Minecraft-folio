"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWorldStore } from "@/state/worldStore";
import { isWebGLAvailable, detectDeviceTier } from "@/lib/deviceTier";
import { prefersReducedMotion } from "@/lib/accessibility";
import { WorldBoot } from "./WorldBoot";
import { WorldHUD } from "../hud/WorldHUD";
import { InspectionOverlay } from "../inspection/InspectionOverlay";
import { WorldMap } from "../hud/WorldMap";
import { WorldCommandPalette } from "../hud/WorldCommandPalette";
import { PerformanceHUD } from "../diagnostics/PerformanceHUD";
import { WorldFallback } from "./WorldFallback";

// Dynamic import of the 3D Canvas with ssr disabled to protect the server bundle
const WorldCanvas = dynamic(
  () => import("./WorldCanvas").then((mod) => mod.WorldCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#09090b] flex items-center justify-center font-mono text-xs text-[#3b82f6]">
        _ LOADING 3D WORLD ASSETS...
      </div>
    ),
  }
);

export const EngineeringWorld: React.FC = () => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const { setDeviceTier, setReducedMotion } = useWorldStore();

  useEffect(() => {
    const supported = isWebGLAvailable();
    setWebglSupported(supported);

    if (supported) {
      setDeviceTier(detectDeviceTier());
      if (prefersReducedMotion()) {
        setReducedMotion(true);
      }
    }
  }, [setDeviceTier, setReducedMotion]);

  if (webglSupported === false) {
    return <WorldFallback />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#09090b]">
      {/* 3D WebGL Canvas Viewport */}
      {webglSupported && <WorldCanvas />}

      {/* Boot Sequencer Overlay */}
      <WorldBoot />

      {/* Engineering 2D HUD */}
      <WorldHUD />

      {/* Slide-In Deep Inspection Panel */}
      <InspectionOverlay />

      {/* 2D Minimap / Radar Overlay */}
      <WorldMap />

      {/* Command Palette */}
      <WorldCommandPalette />

      {/* F3 Telemetry / Diagnostics Overlay */}
      <PerformanceHUD />
    </main>
  );
};

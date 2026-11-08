"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { FirstPersonPlayer } from "../camera/FirstPersonPlayer";
import { WorldScene } from "./WorldScene";
import { WorldResourceBoundary } from "./WorldResourceBoundary";
import { useWorldStore } from "@/state/worldStore";
import { useSettingsStore } from "@/state/settingsStore";
import { resolveQualityProfile } from "@/lib/renderQuality";

export const WorldCanvas: React.FC = () => {
  const deviceTier = useWorldStore((s) => s.deviceTier);
  const qualityTierOverride = useSettingsStore((s) => s.qualityTierOverride);

  const quality = useMemo(
    () => resolveQualityProfile(qualityTierOverride, deviceTier),
    [qualityTierOverride, deviceTier]
  );

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Canvas
        onCreated={({gl})=>{gl.domElement.addEventListener("webglcontextlost",()=>window.dispatchEvent(new Event("frontier-context-lost")),{once:true});}}
        shadows={quality.shadows}
        dpr={quality.dpr}
        gl={{
          antialias: quality.antialias,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 70,
          near: 0.1,
          far: 260,
          position: [-12, 2.15, 4],
        }}
      >
        <Suspense fallback={null}>
          <FirstPersonPlayer />
          <WorldScene quality={quality} />
          <WorldResourceBoundary />
        </Suspense>
      </Canvas>
    </div>
  );
};

"use client";

import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useAdvancementStore } from "@/state/advancementStore";
import { gameplayBlocked, touchInput } from "@/lib/frontier/input";
import { WorldAudio } from "@/components/frontier/AudioControls";
import { VisitorHUD } from "@/components/visitor/VisitorWorld";
import { NearbyMission } from "@/components/frontier/NearbyMission";
import { TouchControls } from "@/components/frontier/TouchControls";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSettingsStore } from "@/state/settingsStore";
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

const EngineeringWorldContent: React.FC = () => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const { setDeviceTier, setReducedMotion } = useWorldStore();

  useEffect(() => {
    const preset = new URLSearchParams(location.search).get("quality");
    if (preset === "low" || preset === "medium" || preset === "high") useSettingsStore.getState().setQualityTierOverride(preset);
    const lost=()=>setWebglSupported(false);
    window.addEventListener("frontier-context-lost",lost);
    const supported = isWebGLAvailable();
    setWebglSupported(supported);

    if (supported) {
      setDeviceTier(detectDeviceTier());
      if (prefersReducedMotion()) {
        setReducedMotion(true);
      }
    }
    return ()=>window.removeEventListener("frontier-context-lost",lost);
  }, [setDeviceTier, setReducedMotion]);

  useEffect(()=>{
    const clearTouch=()=>{for(const key of ["forward","backward","left","right","jump","sprint"] as const)touchInput[key]=false;touchInput.lookX=touchInput.lookY=0;};
    const sync=()=>{if(gameplayBlocked()){clearTouch();if(document.pointerLockElement)document.exitPointerLock();}};
    const unsub=[useWorldStore.subscribe(sync),useSettingsStore.subscribe(sync),useInteractionRegistry.subscribe(sync),useAdvancementStore.subscribe(sync)];
    window.addEventListener("blur",clearTouch);
    return()=>{unsub.forEach(fn=>fn());window.removeEventListener("blur",clearTouch);};
  },[]);
  if (webglSupported === false) {
    return <WorldFallback />;
  }

  return (
    <main id="main-content" className="relative w-screen h-screen overflow-hidden bg-[#09090b]">
      {/* 3D WebGL Canvas Viewport */}
      {webglSupported && <WorldCanvas />}

      {/* Boot Sequencer Overlay */}
      <WorldBoot />

      {/* Engineering 2D HUD */}
      <WorldHUD />
      <TouchControls /><WorldAudio/>
      <NearbyMission /><VisitorHUD />

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

export class EngineeringWorld extends React.Component<Record<string, never>, {failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<WorldFallback />:<EngineeringWorldContent />;}
}


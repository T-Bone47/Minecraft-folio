"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSettingsStore } from "@/state/settingsStore";

export const ThreeDiagnosticsTracker: React.FC = () => {
  const { gl } = useThree();
  const setRenderStats = useSettingsStore((s) => s.setRenderStats);
  const showPerformanceHUD = useSettingsStore((s) => s.showPerformanceHUD);
  const lastUpdateTime = useRef(0);

  useFrame((state) => {
    // Only query WebGL info if HUD is active or at periodic intervals
    const now = state.clock.getElapsedTime();
    if (now - lastUpdateTime.current > 0.5) {
      lastUpdateTime.current = now;

      if (gl?.info) {
        setRenderStats({
          drawCalls: gl.info.render.calls,
          triangles: gl.info.render.triangles,
          geometries: gl.info.memory.geometries,
          textures: gl.info.memory.textures,
        });
      }
    }
  });

  return null;
};

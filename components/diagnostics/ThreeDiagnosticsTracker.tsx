"use client";

import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSettingsStore } from "@/state/settingsStore";

export const ThreeDiagnosticsTracker: React.FC = () => {
  const { gl, scene } = useThree();
  const setRenderStats = useSettingsStore((s) => s.setRenderStats);
  const showPerformanceHUD = useSettingsStore((s) => s.showPerformanceHUD);
  const lastUpdateTime = useRef(0);

  useFrame((state) => {
    // Only query WebGL info if HUD is active or at periodic intervals
    if(!showPerformanceHUD)return;
    const now = state.clock.getElapsedTime();
    if (now - lastUpdateTime.current > 0.5) {
      lastUpdateTime.current = now;

      if (gl?.info) {
        let textureBytesEstimate=0;
        const textures=new Set<THREE.Texture>();
        scene.traverse(obj=>{const mesh=obj as THREE.Mesh;if(!mesh.isMesh)return;const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];for(const material of materials)for(const value of Object.values(material)){if(value instanceof THREE.Texture)textures.add(value);}});
        for(const texture of textures){const image=texture.image as {width?:number;height?:number}|undefined;textureBytesEstimate+=(image?.width??0)*(image?.height??0)*4*(texture.generateMipmaps?4/3:1);}
        setRenderStats({
          textureBytesEstimate:Math.round(textureBytesEstimate),
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

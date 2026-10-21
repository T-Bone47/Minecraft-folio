"use client";

import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { disposeHierarchy } from "@/lib/performance";
import { disposeAllVoxelResources } from "@/lib/voxelTextures";

/**
 * Owns teardown of GPU resources for the world scene.
 *
 * `lib/performance.ts#disposeHierarchy` and
 * `lib/voxelTextures.ts#disposeAllVoxelResources` both existed but nothing
 * ever called them, so every navigation away from `/world` leaked the cached
 * materials and their canvas textures. Navigating back and forth between the
 * case-study pages and the world grew the resource count without bound.
 *
 * This component is mounted inside the Canvas so it can reach the scene graph
 * and walk it, and it deliberately disposes only on unmount — shared cached
 * materials must not be released while the scene is still using them.
 */
export const WorldResourceBoundary: React.FC = () => {
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    // Force a compile on first paint so shader compilation does not spike
    // mid-exploration the first time the player walks toward a landmark.
    gl.compile(scene, camera);
    invalidate();

    return () => {
      // Deliberately NOT calling gl.forceContextLoss(). It irreversibly
      // invalidates the context, and this effect runs twice under React
      // StrictMode (mount -> unmount -> mount) as well as on every Fast
      // Refresh, which would leave the remounted canvas permanently dead.
      // Releasing the renderer-level caches is enough; the browser reclaims
      // the context itself once the canvas is detached.
      disposeHierarchy(scene);
      disposeAllVoxelResources();
      gl.renderLists.dispose();
    };
  }, [scene, gl, camera, invalidate]);

  return null;
};
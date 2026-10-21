"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useSettingsStore } from "@/state/settingsStore";
import { CAMPUS_ISLAND_RADIUS } from "@/lib/terrainModel";
import type { QualityProfile } from "@/lib/renderQuality";

/**
 * Atmosphere and lighting rig.
 *
 * The previous rig used only an ambient light plus a directional sun. Because
 * a voxel block's top face and its side face receive identical light under a
 * single ambient term, stepped terrain read as flat cardboard. A hemisphere
 * light separates sky-facing from ground-facing normals, which is what makes
 * the terraced hills and building roofs legible.
 */
export interface VoxelSkyProps {
  quality: QualityProfile;
}

interface AtmosphereProfile {
  skyColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  skyLightColor: string;
  groundLightColor: string;
  hemisphereIntensity: number;
  bounceColor: string;
  bounceIntensity: number;
  cloudColor: string;
  cloudOpacity: number;
  isSunVisible: boolean;
  isMoonVisible: boolean;
}

const ATMOSPHERES: Record<TimeOfDay, AtmosphereProfile> = {
  day: {
    skyColor: "#73a9ff",
    fogColor: "#8fbfff",
    fogNear: 55,
    fogFar: 165,
    sunPosition: [48, 70, 34],
    sunColor: "#fff6e2",
    sunIntensity: 1.45,
    // Cool skylight from above, warm bounce off the grass below. The
    // ground colour is deliberately light: it is what fills the undersides
    // of roofs and overhangs, which otherwise render as black voids.
    skyLightColor: "#bcd9ff",
    groundLightColor: "#8ba36a",
    hemisphereIntensity: 0.62,
    bounceColor: "#8fbf62",
    bounceIntensity: 0.18,
    cloudColor: "#ffffff",
    cloudOpacity: 0.9,
    isSunVisible: true,
    isMoonVisible: false,
  },
  sunset: {
    skyColor: "#c9562a",
    fogColor: "#b8542a",
    fogNear: 40,
    fogFar: 130,
    sunPosition: [72, 18, 46],
    sunColor: "#ff9a4d",
    sunIntensity: 1.25,
    skyLightColor: "#f0a97a",
    groundLightColor: "#8a6244",
    hemisphereIntensity: 0.5,
    bounceColor: "#c2703a",
    bounceIntensity: 0.16,
    cloudColor: "#ffd2b5",
    cloudOpacity: 0.85,
    isSunVisible: true,
    isMoonVisible: false,
  },
  night: {
    skyColor: "#050a18",
    fogColor: "#070e24",
    fogNear: 35,
    fogFar: 120,
    sunPosition: [-52, 68, -42],
    sunColor: "#c7d6f0",
    sunIntensity: 0.42,
    skyLightColor: "#2b3f66",
    groundLightColor: "#1a2740",
    hemisphereIntensity: 0.34,
    bounceColor: "#1e2b45",
    bounceIntensity: 0.1,
    cloudColor: "#1e293b",
    cloudOpacity: 0.5,
    isSunVisible: false,
    isMoonVisible: true,
  },
};

type TimeOfDay = "day" | "sunset" | "night";

export const VoxelSky: React.FC<VoxelSkyProps> = ({ quality }) => {
  const reducedMotion = useWorldStore((s) => s.reducedMotion);
  const timeOfDay = useSettingsStore((s) => s.timeOfDay);
  const cloudsRef = useRef<THREE.Group>(null);

  const config = ATMOSPHERES[timeOfDay];

  // Fog range follows the quality profile so weaker devices do not pay to
  // resolve distant geometry that is about to be fogged out anyway.
  const fogFar = Math.min(config.fogFar, quality.fogFar);

  const cloudBlocks = useMemo(() => {
    const blocks: Array<{ x: number; y: number; z: number; w: number; d: number }> = [];
    const clusters = [
      { cx: -20, cz: -10, count: 6 },
      { cx: 30, cz: 25, count: 8 },
      { cx: -15, cz: 45, count: 7 },
      { cx: 40, cz: -40, count: 6 },
    ];

    for (const cluster of clusters) {
      for (let i = 0; i < cluster.count; i++) {
        blocks.push({
          x: cluster.cx + (i % 3) * 8 + Math.sin(i * 3) * 4,
          z: cluster.cz + Math.floor(i / 3) * 8 + Math.cos(i * 2) * 4,
          y: 44 + (i % 2) * 0.8,
          w: 8 + (i % 3) * 4,
          d: 8 + (i % 2) * 6,
        });
      }
    }
    return blocks;
  }, []);

  // Deterministic star field. Math.random() in render would reshuffle the sky
  // on every mount and break server/client markup agreement.
  const stars = useMemo(() => {
    const list: Array<{ x: number; y: number; z: number; size: number }> = [];
    let seed = 1337;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < 90; i++) {
      const theta = random() * Math.PI * 2;
      const phi = random() * (Math.PI / 2.3);
      const radius = 150;
      list.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi) + 20,
        z: radius * Math.sin(phi) * Math.sin(theta),
        size: 0.6 + random() * 0.5,
      });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (cloudsRef.current && !reducedMotion) {
      cloudsRef.current.position.x += delta * 1.2;
      if (cloudsRef.current.position.x > 80) {
        cloudsRef.current.position.x = -80;
      }
    }
  });

  // Fit the shadow frustum to the island rather than a fixed 110-unit box, so
  // the shadow map's texels land on actual geometry instead of empty space.
  const shadowExtent = CAMPUS_ISLAND_RADIUS + 6;

  return (
    <>
      <color attach="background" args={[config.skyColor]} />
      <fog attach="fog" args={[config.fogColor, config.fogNear, fogFar]} />

      {/* Key light. Shadow frustum tracks the island bounds. */}
      <directionalLight
        position={config.sunPosition}
        intensity={config.sunIntensity}
        color={config.sunColor}
        castShadow={quality.shadows}
        shadow-mapSize-width={quality.shadowMapSize}
        shadow-mapSize-height={quality.shadowMapSize}
        shadow-camera-near={20}
        shadow-camera-far={200}
        shadow-camera-left={-shadowExtent}
        shadow-camera-right={shadowExtent}
        shadow-camera-top={shadowExtent}
        shadow-camera-bottom={-shadowExtent}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      {/* Hemisphere fill: the single biggest readability win for voxel terrain.
          Without it, top and side faces of a block receive identical light. */}
      <hemisphereLight
        color={config.skyLightColor}
        groundColor={config.groundLightColor}
        intensity={config.hemisphereIntensity}
      />

      {/* Weak opposing fill so north-facing walls are not solid black. */}
      <directionalLight
        position={[-config.sunPosition[0], 24, -config.sunPosition[2]]}
        intensity={config.bounceIntensity}
        color={config.bounceColor}
      />

      {config.isSunVisible && (
        <group position={[78, 86, 56]}>
          <mesh>
            <boxGeometry args={[14, 14, 0.4]} />
            <meshBasicMaterial
              color={timeOfDay === "sunset" ? "#ffedd5" : "#fffbe6"}
              fog={false}
            />
          </mesh>
        </group>
      )}

      {config.isMoonVisible && (
        <group position={[-70, 84, -50]}>
          <mesh>
            <boxGeometry args={[12, 12, 0.4]} />
            <meshBasicMaterial color="#f1f5f9" fog={false} />
          </mesh>
        </group>
      )}

      {timeOfDay === "night" && (
        <group>
          {stars.map((star, index) => (
            <mesh key={index} position={[star.x, star.y, star.z]}>
              <boxGeometry args={[star.size, star.size, star.size]} />
              <meshBasicMaterial color="#f8fafc" fog={false} />
            </mesh>
          ))}
        </group>
      )}

      {quality.clouds && (
        <group ref={cloudsRef}>
          {cloudBlocks.map((cloud, index) => (
            <mesh key={index} position={[cloud.x, cloud.y, cloud.z]}>
              <boxGeometry args={[cloud.w, 1.4, cloud.d]} />
              <meshStandardMaterial
                color={config.cloudColor}
                roughness={0.95}
                transparent
                opacity={config.cloudOpacity}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
};
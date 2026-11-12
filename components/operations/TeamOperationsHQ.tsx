"use client";
import { chromeEra } from "@/data/chromeEra";
import { FacilityWalls } from "@/components/theme/FacilityWalls";


import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { getVoxelMaterial, getVoxelSignMaterial } from "@/lib/voxelTextures";
import { worldSound } from "@/lib/audio";

interface TeamOperationsHQProps {
  position?: [number, number, number];
}

export const TeamOperationsHQ: React.FC<TeamOperationsHQProps> = ({
  position = [-12, 0, 14],
}) => {
  const { inspectProject, activeProject, mode, reducedMotion } = useWorldStore();
  const { registerObject, unregisterObject } = useInteractionRegistry();
  const groupRef = useRef<THREE.Group>(null);
  const radarDishRef = useRef<THREE.Group>(null);

  // Register interactive operations station
  useEffect(() => {
    const terminalPos: [number, number, number] = [
      position[0] + 3.2,
      position[1] + 1.7,
      position[2],
    ];

    registerObject({
      id: "operations_board",
      type: "terminal",
      label: "Team Operations Strategy Board",
      sublabel: "F1 Team Management & Strategy Game Architecture",
      actionPrompt: "[E] INSPECT TEAM OPERATIONS HQ",
      position: terminalPos,
      boundsRadius: 8,
      projectSlug: "f1-race-manager",
      facilityId: "operations",
      onInteract: () => {
        worldSound.playInspectChime();
        inspectProject("f1-race-manager");
      },
    });

    return () => unregisterObject("operations_board");
  }, [position, registerObject, unregisterObject, inspectProject]);

  const stoneBrickMat = useMemo(() => getVoxelMaterial("chrome_brushed"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("chrome_graphite"), []);
  const signMat = useMemo(
    () => getVoxelSignMaterial("TEAM OPERATIONS HQ", "F1 RACE MANAGER"),
    []
  );
  const glassMat = useMemo(
    () =>
      getVoxelMaterial("chrome_glass", {
        transparent: true,
        opacity: 0.65,
      }),
    []
  );
  const glowstoneMat = useMemo(
    () =>
      getVoxelMaterial("chrome_light", {
        emissive: new THREE.Color(chromeEra.white),
        emissiveIntensity: 1.6,
      }),
    []
  );
  const monitorMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);

  // Frame loop for rotating weather radar dish
  useFrame((_, delta) => {
    if (radarDishRef.current && !reducedMotion) {
      radarDishRef.current.rotation.y += delta * 1.4;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    worldSound.playInspectChime();
    inspectProject("f1-race-manager");
  };

  return (
    <group
      ref={groupRef}
      position={position}
    >
      {/* 1. Stone Foundation (12x10 blocks) */}
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <boxGeometry args={[12, 0.5, 10]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 2. Lower Floor (Operations & Driver Management Hub) */}
      <FacilityWalls id="operations" height={3.3} />

      {/* Lower Glass Windows */}
      <mesh position={[0, 2.0, 4.55]} castShadow>
        <boxGeometry args={[8.0, 1.8, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* 3. Mid-Level Balcony Slab (12x10) */}
      <mesh position={[0, 3.7, 0]}><boxGeometry args={[4, .08, 3]} /><primitive object={glowstoneMat} attach="material" /></mesh>
      <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 0.5, 10]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 4. Upper Floor (Strategy War Room) */}
      <mesh position={[0, 5.5, -0.5]} castShadow>
        <boxGeometry args={[9, 2.6, 7]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Upper Panoramic War-Room Windows */}
      <mesh position={[0, 5.5, 3.05]} castShadow>
        <boxGeometry args={[7.5, 1.8, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* Strategy War Room Screens (Weather radar + Safety Car / Pit Matrix) */}
      <group position={[0, 5.5, 2.9]}>
        {/* Left: Weather Radar */}
        <mesh position={[-2.2, 0, 0]}>
          <planeGeometry args={[2.0, 1.2]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        {/* Center: Pit Strategy Matrix */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.0, 1.2]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Right: Driver Management */}
        <mesh position={[2.2, 0, 0]}>
          <planeGeometry args={[2.0, 1.2]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* 5. Roof Platform */}
      <mesh position={[0, 7.0, -0.5]} castShadow>
        <boxGeometry args={[10, 0.5, 8]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Rotating Weather Radar Satellite Dish on Roof */}
      <group position={[0, 8.2, -0.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 1.8, 0.6]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <group ref={radarDishRef} position={[0, 1.1, 0]}>
          <mesh castShadow rotation={[0.4, 0, 0]}>
            <boxGeometry args={[2.0, 1.5, 0.3]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.2, 0.5]} castShadow>
            <boxGeometry args={[0.2, 0.2, 0.8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* Glowstone Lanterns */}
      {[-4, 4].map((x) => (
        <mesh key={x} position={[x, 3.5, 4.5]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      ))}

      {/* 6. Physical Minecraft Sign: [ TEAM OPERATIONS HQ / F1 RACE MANAGER (GAME) ] */}
      <group position={[0, 2.0, 5.2]}>
        <mesh castShadow>
          <boxGeometry args={[6.5, 1.1, 0.2]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        <mesh position={[-3.0, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[3.0, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
      </group>

      {/* 7. Interactive Terminal Pedestal */}
      <group position={[3.2, 0.5, 0]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.9]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.65, 0.2]} />
          <primitive object={monitorMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      </group>

      {/* 8. Physical Minecraft Sign: [ TEAM OPERATIONS HQ / F1 RACE MANAGER ] */}
      <group position={[0, 3.2, -4.15]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow>
          <boxGeometry args={[6.2, 1.0, 0.2]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[6.0, 0.9]} />
          <primitive object={signMat} attach="material" />
        </mesh>
        <mesh position={[-2.8, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[2.8, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

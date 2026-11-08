"use client";

import { ChromePlazaCrown } from "@/components/theme/ChromeCampusDetails";
import { getVoxelMaterial } from "@/lib/voxelTextures";
import { chromeEra } from "@/data/chromeEra";
import React, { useEffect } from "react";
import * as THREE from "three";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useWorldStore } from "@/state/worldStore";

export const CentralPlaza: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 0],
}) => {
  const { registerObject, unregisterObject, openStationModal } = useInteractionRegistry();
  const { focusLocation } = useWorldStore();

  // Register Welcome Kiosk interaction
  useEffect(() => {
    const kioskId = "plaza_welcome_kiosk";
    registerObject({
      id: kioskId,
      type: "station",
      label: "CAMPUS WELCOME KIOSK",
      sublabel: "Central Plaza Navigation & Divisions Overview",
      actionPrompt: "[E] OPEN CAMPUS WELCOME & DIRECTORY",
      position: [position[0], position[1] + 1, position[2] - 2],
      boundsRadius: 3.5,
      onInteract: () => {
        openStationModal("plaza_welcome");
      },
    });

    return () => unregisterObject(kioskId);
  }, [position, registerObject, unregisterObject, openStationModal]);

  return (
    <group position={position}><ChromePlazaCrown/>
      {/* 1. CENTRAL ENGINEERING OBELISK / COMPASS MONOLITH */}
      {/* Base Pedestal (3x3 stepped stone) */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color="#27272a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>

      {/* Main Obelisk Column */}
      <mesh position={[0, 2.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 3.5, 1.2]} />
        <primitive attach="material" object={getVoxelMaterial("chrome_polished")}/>
      </mesh>

      {/* Glowing Technology Accent Stripes on 4 faces */}
      <mesh position={[0, 2.75, 0.61]}>
        <planeGeometry args={[0.3, 2.8]} />
        <meshBasicMaterial color={chromeEra.red} />
      </mesh>
      <mesh position={[0, 2.75, -0.61]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.3, 2.8]} />
        <meshBasicMaterial color={chromeEra.red} />
      </mesh>
      <mesh position={[0.61, 2.75, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.3, 2.8]} />
        <meshBasicMaterial color={chromeEra.red} />
      </mesh>
      <mesh position={[-0.61, 2.75, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.3, 2.8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Obelisk Pyramidion & Glowing Beacon Core */}
      <mesh position={[0, 4.75, 0]} castShadow>
        <coneGeometry args={[0.85, 1.2, 4]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.7} />
      </mesh>
      <pointLight position={[0, 5.2, 0]} color={chromeEra.red} intensity={2.5} distance={12} />

      {/* 2. CAMPUS WELCOME & DIRECTORY PEDESTAL KIOSK */}
      <group position={[0, 0, -2.2]}>
        {/* Pedestal Stand */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} />
        </mesh>
        {/* Terminal Screen Console (Angled) */}
        <group position={[0, 1.1, 0]} rotation={[-0.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.1, 0.6]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <pointLight position={[0, 0.2, 0]} color="#38bdf8" intensity={1.2} distance={4} />
        </group>
      </group>

      {/* 3. FOUR-WAY DIRECTIONAL CAMPUS SIGNPOSTS */}
      <group position={[0, 0, 1.8]}>
        {/* Wooden Post */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 2.5, 0.2]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.9} />
        </mesh>

        {/* North Sign: AI & DATA LAB */}
        <group position={[0, 2.2, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.3, 0.06]} />
            <meshStandardMaterial color={chromeEra.red} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.4, 0.2]} />
            <meshBasicMaterial color="#ddd6fe" />
          </mesh>
        </group>

        {/* South Sign: MOTORSPORT GARAGE & CIRCUIT */}
        <group position={[0, 1.8, -0.15]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 0.3, 0.06]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, 0, -0.04]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.5, 0.2]} />
            <meshBasicMaterial color="#fecaca" />
          </mesh>
        </group>

        {/* East Sign: SIMULATION LAB */}
        <group position={[0.15, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 0.3, 0.06]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.3, 0.2]} />
            <meshBasicMaterial color="#a7f3d0" />
          </mesh>
        </group>

        {/* West Sign: HQ & OPERATIONS */}
        <group position={[-0.15, 1.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 0.3, 0.06]} />
            <meshStandardMaterial color={chromeEra.red} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.3, 0.2]} />
            <meshBasicMaterial color="#cffafe" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getVoxelMaterial } from "@/lib/voxelTextures";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useTrialsStore } from "@/state/trialsStore";
import type { TrialNPC } from "@/lib/trials/types";
import { getTrialById } from "@/lib/trials/scenarioRegistry";

const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
type Vec3 = [number, number, number];

function VoxelBlock({
  pos,
  scale,
  material = "engineer_jacket",
  rot = [0, 0, 0],
}: {
  pos: Vec3;
  scale: Vec3;
  material?: string;
  rot?: Vec3;
}) {
  return (
    <mesh
      geometry={cubeGeom}
      position={pos}
      scale={scale}
      rotation={rot}
      castShadow
      receiveShadow
    >
      <primitive object={getVoxelMaterial(material)} attach="material" />
    </mesh>
  );
}

interface EngineerNPCAvatarProps {
  npc: TrialNPC;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
}

export function EngineerNPCAvatar({
  npc,
  position = npc.coordinates,
  rotation = [0, 0, 0],
  scale = 1.0,
}: EngineerNPCAvatarProps) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armLeftRef = useRef<THREE.Group>(null);
  const armRightRef = useRef<THREE.Group>(null);

  const { registerObject, unregisterObject, openStationModal } =
    useInteractionRegistry();

  // Register in-world interaction
  useEffect(() => {
    registerObject({
      id: npc.id,
      type: "station",
      label: npc.name.toUpperCase(),
      sublabel: npc.role.toUpperCase(),
      actionPrompt: `[E] CONVERSE WITH ${npc.name.toUpperCase()}`,
      position,
      boundsRadius: 3.2,
      onInteract: () => {
        useTrialsStore.getState().talkToNPC(npc);
        openStationModal(`npc_${npc.id}`);
      },
    });

    return () => {
      unregisterObject(npc.id);
    };
  }, [npc, position, registerObject, unregisterObject, openStationModal]);

  // Gentle idle breathing & subtle head turn
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rootRef.current) {
      // Gentle breathing bob
      rootRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.02;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.9) * 0.08;
      headRef.current.rotation.x = Math.sin(t * 1.8) * 0.03;
    }
    if (armLeftRef.current) {
      armLeftRef.current.rotation.x = Math.sin(t * 1.2) * 0.05 + 0.1;
    }
    if (armRightRef.current) {
      armRightRef.current.rotation.x = -Math.sin(t * 1.2) * 0.05 - 0.2;
    }
  });

  // Livery themes
  const isRace = npc.avatarVariant === "race";
  const isAiml = npc.avatarVariant === "aiml";
  const isSystems = npc.avatarVariant === "systems";

  const jacketMat = isRace
    ? "engineer_jacket"
    : isAiml
    ? "chrome_graphite"
    : "chrome_carbon";

  const accentMat = isRace
    ? "chrome_red"
    : isAiml
    ? "telemetry_cyan"
    : "chrome_red";

  const trousersMat = isSystems ? "chrome_carbon" : "engineer_trousers";

  return (
    <group
      ref={rootRef}
      name={`NPC-${npc.id}`}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Legs */}
      <group position={[-0.18, 0.86, 0]}>
        <VoxelBlock pos={[0, -0.34, 0]} scale={[0.3, 0.68, 0.32]} material={trousersMat} />
        <VoxelBlock pos={[0, -0.75, 0.05]} scale={[0.32, 0.15, 0.44]} material="chrome_carbon" />
      </group>
      <group position={[0.18, 0.86, 0]}>
        <VoxelBlock pos={[0, -0.34, 0]} scale={[0.3, 0.68, 0.32]} material={trousersMat} />
        <VoxelBlock pos={[0, -0.75, 0.05]} scale={[0.32, 0.15, 0.44]} material="chrome_carbon" />
      </group>

      {/* Torso */}
      <group position={[0, 0.86, 0]}>
        <VoxelBlock pos={[0, 0.38, 0]} scale={[0.66, 0.74, 0.38]} material={jacketMat} />
        {/* Belt */}
        <VoxelBlock pos={[0, 0.04, 0]} scale={[0.68, 0.09, 0.4]} material="chrome_carbon" />
        {/* Division Accent Stripes */}
        <VoxelBlock pos={[0, 0.38, 0.198]} scale={[0.04, 0.68, 0.016]} material={accentMat} />
        <VoxelBlock pos={[0.16, 0.52, 0.198]} scale={[0.12, 0.1, 0.016]} material={accentMat} />

        {/* Systems Toolpack or Race Telemetry Clip */}
        {isSystems && (
          <VoxelBlock pos={[0, 0.38, -0.22]} scale={[0.42, 0.5, 0.12]} material="chrome_graphite" />
        )}
      </group>

      {/* Left Arm */}
      <group ref={armLeftRef} position={[-0.42, 1.48, 0]}>
        <VoxelBlock pos={[0, -0.28, 0]} scale={[0.22, 0.64, 0.22]} material={jacketMat} />
        {/* Left hand holding item */}
        <VoxelBlock pos={[0, -0.66, 0]} scale={[0.18, 0.16, 0.18]} material="chrome_brushed" />
      </group>

      {/* Right Arm */}
      <group ref={armRightRef} position={[0.42, 1.48, 0]}>
        <VoxelBlock pos={[0, -0.28, 0]} scale={[0.22, 0.64, 0.22]} material={jacketMat} />
        <VoxelBlock pos={[0, -0.66, 0]} scale={[0.18, 0.16, 0.18]} material="chrome_brushed" />

        {/* Handheld Device */}
        {isRace && (
          /* Race clipboard / datapad */
          <group position={[0, -0.68, 0.18]} rotation={[0.4, 0, 0]}>
            <VoxelBlock pos={[0, 0, 0]} scale={[0.28, 0.38, 0.03]} material="chrome_carbon" />
            <VoxelBlock pos={[0, 0, 0.02]} scale={[0.24, 0.32, 0.01]} material="chrome_white" />
          </group>
        )}
        {isAiml && (
          /* Glowing AI Neural Pad */
          <group position={[0, -0.68, 0.18]} rotation={[0.4, 0, 0]}>
            <VoxelBlock pos={[0, 0, 0]} scale={[0.3, 0.42, 0.03]} material="chrome_graphite" />
            <VoxelBlock pos={[0, 0, 0.02]} scale={[0.26, 0.36, 0.01]} material="telemetry_cyan" />
          </group>
        )}
        {isSystems && (
          /* Telemetry diagnostic multimeter */
          <group position={[0, -0.68, 0.18]} rotation={[0.4, 0, 0]}>
            <VoxelBlock pos={[0, 0, 0]} scale={[0.22, 0.32, 0.05]} material="chrome_carbon" />
            <VoxelBlock pos={[0, 0.06, 0.03]} scale={[0.18, 0.14, 0.01]} material="terminal_screen" />
          </group>
        )}
      </group>

      {/* Head */}
      <group ref={headRef} position={[0, 1.62, 0]}>
        {/* Head Block */}
        <VoxelBlock pos={[0, 0.22, 0]} scale={[0.46, 0.46, 0.46]} material="chrome_brushed" />
        {/* Hair / Headgear */}
        <VoxelBlock pos={[0, 0.42, 0]} scale={[0.48, 0.12, 0.48]} material="chrome_carbon" />

        {/* Race Headset */}
        {isRace && (
          <group>
            {/* Earcups */}
            <VoxelBlock pos={[-0.24, 0.22, 0]} scale={[0.06, 0.18, 0.18]} material="chrome_red" />
            <VoxelBlock pos={[0.24, 0.22, 0]} scale={[0.06, 0.18, 0.18]} material="chrome_red" />
            {/* Headband */}
            <VoxelBlock pos={[0, 0.46, 0]} scale={[0.5, 0.04, 0.12]} material="chrome_carbon" />
            {/* Mic boom */}
            <VoxelBlock pos={[0.22, 0.14, 0.18]} scale={[0.03, 0.03, 0.24]} material="chrome_carbon" />
          </group>
        )}

        {/* AI Visor */}
        {isAiml && (
          <group>
            {/* Cyber optical band */}
            <VoxelBlock pos={[0, 0.24, 0.24]} scale={[0.48, 0.08, 0.02]} material="telemetry_cyan" />
          </group>
        )}

        {/* Systems Safety Comms / LED */}
        {isSystems && (
          <group>
            <VoxelBlock pos={[-0.24, 0.22, 0]} scale={[0.05, 0.14, 0.14]} material="chrome_graphite" />
            <VoxelBlock pos={[0.24, 0.22, 0]} scale={[0.05, 0.14, 0.14]} material="chrome_graphite" />
          </group>
        )}
      </group>

      {/* Floating Nameplate Banner */}
      <group position={[0, 2.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.2, 0.45]} />
          <meshBasicMaterial color="#171A20" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.16, 0.41]} />
          <meshBasicMaterial
            color={isRace ? "#D71D35" : isAiml ? "#22D3EE" : "#34D399"}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
}


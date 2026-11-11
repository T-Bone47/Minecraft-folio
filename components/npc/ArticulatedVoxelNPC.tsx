"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getVoxelMaterial } from "@/lib/voxelTextures";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useNPCWorkforceStore } from "@/state/npcWorkforceStore";
import type { NPCDefinition, PropType, Vec3 } from "@/lib/npc/npcTypes";
import { createInitialPose, updateNPCPose } from "@/lib/npc/npcKinematics";

const cubeGeom = new THREE.BoxGeometry(1, 1, 1);

function VoxelBox({
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

interface ArticulatedVoxelNPCProps {
  definition: NPCDefinition;
}

export function ArticulatedVoxelNPC({ definition }: ArticulatedVoxelNPCProps) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const toolRef = useRef<THREE.Group>(null);

  const poseRef = useRef(createInitialPose());
  const prevPosRef = useRef<Vec3>([...definition.currentPosition]);

  const { registerObject, unregisterObject, openStationModal } =
    useInteractionRegistry();

  // Register in-world interaction
  useEffect(() => {
    registerObject({
      id: definition.id,
      type: "station",
      label: definition.name.toUpperCase(),
      sublabel: `${definition.role.replace("_", " ").toUpperCase()} // ${definition.facility.toUpperCase()}`,
      actionPrompt: `[E] CONVERSE WITH ${definition.name.toUpperCase()}`,
      position: definition.homePosition,
      boundsRadius: 3.2,
      onInteract: () => {
        useNPCWorkforceStore.getState().interactWithNPC(definition.id);
        openStationModal(`workforce_${definition.id}`);
      },
    });

    return () => {
      unregisterObject(definition.id);
    };
  }, [definition, registerObject, unregisterObject, openStationModal]);

  // Frame update: kinematics, state execution, and transform synchronization
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();
    const store = useNPCWorkforceStore.getState();
    const instance = store.instances[definition.id];
    if (!instance || !rootRef.current) return;

    // Distance-based Level of Detail (LOD)
    const camPos = state.camera.position;
    const distToCam = Math.hypot(
      camPos.x - instance.position[0],
      camPos.z - instance.position[2]
    );

    // Skip heavy limb kinematics if NPC is far off-screen (> 45m)
    if (distToCam > 45) {
      rootRef.current.position.set(...instance.position);
      rootRef.current.rotation.y = instance.yaw;
      return;
    }

    // Calculate current movement speed (m/s)
    const distTraveled = Math.hypot(
      instance.position[0] - prevPosRef.current[0],
      instance.position[2] - prevPosRef.current[2]
    );
    const speed = dt > 0.001 ? Math.min(4.0, distTraveled / dt) : 0;
    prevPosRef.current = [...instance.position];

    // Smoothly apply world position and rotation
    rootRef.current.position.set(...instance.position);
    rootRef.current.rotation.y = instance.yaw;

    // Check if player is nearby to trigger head look-at
    let lookTarget: Vec3 | null = null;
    if (distToCam < 8.0 && !store.interactedNPCId) {
      lookTarget = [camPos.x, camPos.y, camPos.z];
    } else if (store.interactedNPCId === definition.id) {
      lookTarget = [camPos.x, camPos.y, camPos.z];
    }

    // Update skeletal kinematics
    const p = updateNPCPose(poseRef.current, {
      dt,
      time,
      activity: instance.activity,
      speed,
      lookAtTarget: lookTarget,
      npcPosition: instance.position,
      npcYaw: instance.yaw,
    });

    // Apply joint transforms
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.86 + p.torsoBob;
      torsoRef.current.rotation.x = p.torsoLean;
    }
    if (headRef.current) {
      headRef.current.rotation.y = p.headYaw;
      headRef.current.rotation.x = p.headPitch;
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = p.leftArmPitch;
      leftArmRef.current.rotation.z = p.leftArmRoll;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = p.rightArmPitch;
      rightArmRef.current.rotation.z = p.rightArmRoll;
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = p.leftLegPitch;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = p.rightLegPitch;
    }
    if (toolRef.current) {
      toolRef.current.rotation.x = p.toolPitch;
    }
  });

  // Livery Materials based on Role
  const isRaceEngineer = definition.role === "race_engineer";
  const isTechnician = definition.role === "vehicle_technician";
  const isDataEngineer = definition.role === "data_engineer";
  const isAssistant = definition.role === "garage_assistant";
  const isAI = definition.role === "ai_researcher";
  const isSystems = definition.role === "systems_technician";

  const jacketMat = isRaceEngineer
    ? "engineer_jacket"
    : isTechnician
    ? "chrome_graphite"
    : isAI
    ? "chrome_graphite"
    : isSystems
    ? "chrome_carbon"
    : "engineer_jacket";

  const trousersMat = isTechnician || isSystems
    ? "chrome_carbon"
    : "engineer_trousers";

  const accentMat = isRaceEngineer || isTechnician
    ? "chrome_red"
    : isAI
    ? "telemetry_cyan"
    : isDataEngineer
    ? "telemetry_cyan"
    : "chrome_red";

  return (
    <group
      ref={rootRef}
      name={`LivingNPC-${definition.id}`}
      position={definition.homePosition}
      rotation={[0, definition.homeYaw, 0]}
    >
      {/* 1. Legs (Pivot at hip y=0.86) */}
      <group position={[-0.18, 0.86, 0]}>
        <group ref={leftLegRef}>
          <VoxelBox pos={[0, -0.34, 0]} scale={[0.28, 0.68, 0.3]} material={trousersMat} />
          {/* Boots */}
          <VoxelBox pos={[0, -0.74, 0.04]} scale={[0.3, 0.16, 0.42]} material="chrome_carbon" />
        </group>
      </group>
      <group position={[0.18, 0.86, 0]}>
        <group ref={rightLegRef}>
          <VoxelBox pos={[0, -0.34, 0]} scale={[0.28, 0.68, 0.3]} material={trousersMat} />
          <VoxelBox pos={[0, -0.74, 0.04]} scale={[0.3, 0.16, 0.42]} material="chrome_carbon" />
        </group>
      </group>

      {/* 2. Torso (Pivot at waist y=0.86) */}
      <group ref={torsoRef} position={[0, 0.86, 0]}>
        <VoxelBox pos={[0, 0.38, 0]} scale={[0.66, 0.74, 0.38]} material={jacketMat} />
        {/* Belt */}
        <VoxelBox pos={[0, 0.04, 0]} scale={[0.68, 0.09, 0.4]} material="chrome_carbon" />
        {/* Role Accent Trim */}
        <VoxelBox pos={[0, 0.38, 0.198]} scale={[0.04, 0.68, 0.016]} material={accentMat} />
        <VoxelBox pos={[0.16, 0.52, 0.198]} scale={[0.12, 0.1, 0.016]} material={accentMat} />

        {/* Technician Toolbelt & Pouch */}
        {isTechnician && (
          <group position={[0, 0.05, 0]}>
            <VoxelBox pos={[-0.24, 0, 0.22]} scale={[0.14, 0.12, 0.08]} material="chrome_carbon" />
            <VoxelBox pos={[0.24, 0, 0.22]} scale={[0.14, 0.12, 0.08]} material="chrome_carbon" />
          </group>
        )}

        {/* Left Arm (Pivot at shoulder y=1.48) */}
        <group position={[-0.42, 0.62, 0]}>
          <group ref={leftArmRef}>
            <VoxelBox pos={[0, -0.28, 0]} scale={[0.22, 0.64, 0.22]} material={jacketMat} />
            <VoxelBox pos={[0, -0.66, 0]} scale={[0.18, 0.16, 0.18]} material="chrome_brushed" />

            {/* If holding toolcase in left hand */}
            {definition.heldProp === "toolcase" && (
              <group position={[0, -0.85, 0]}>
                <VoxelBox pos={[0, 0, 0]} scale={[0.28, 0.35, 0.48]} material="chrome_carbon" />
                <VoxelBox pos={[0, 0.19, 0]} scale={[0.04, 0.08, 0.2]} material="chrome_red" />
              </group>
            )}
          </group>
        </group>

        {/* Right Arm (Pivot at shoulder y=1.48) */}
        <group position={[0.42, 0.62, 0]}>
          <group ref={rightArmRef}>
            <VoxelBox pos={[0, -0.28, 0]} scale={[0.22, 0.64, 0.22]} material={jacketMat} />
            <VoxelBox pos={[0, -0.66, 0]} scale={[0.18, 0.16, 0.18]} material="chrome_brushed" />

            {/* Handheld Props */}
            <group ref={toolRef} position={[0, -0.7, 0.12]}>
              {/* 1. Engineering Tablet */}
              {definition.heldProp === "tablet" && (
                <group rotation={[0.4, 0, 0]}>
                  <VoxelBox pos={[0, 0, 0]} scale={[0.28, 0.38, 0.03]} material="chrome_carbon" />
                  <VoxelBox pos={[0, 0, 0.02]} scale={[0.24, 0.32, 0.01]} material={accentMat} />
                </group>
              )}

              {/* 2. Pneumatic Torque Wrench */}
              {definition.heldProp === "wrench" && (
                <group rotation={[-0.6, 0, 0]}>
                  <VoxelBox pos={[0, 0, 0]} scale={[0.08, 0.32, 0.08]} material="chrome_carbon" />
                  <VoxelBox pos={[0, 0.16, 0.08]} scale={[0.08, 0.08, 0.22]} material="chrome_red" />
                  <VoxelBox pos={[0, 0.16, 0.2]} scale={[0.05, 0.05, 0.12]} material="chrome_brushed" />
                </group>
              )}

              {/* 3. Handheld Diagnostic Scanner */}
              {definition.heldProp === "scanner" && (
                <group rotation={[0.2, 0, 0]}>
                  <VoxelBox pos={[0, 0, 0]} scale={[0.16, 0.28, 0.08]} material="chrome_carbon" />
                  <VoxelBox pos={[0, 0.08, 0.05]} scale={[0.12, 0.12, 0.01]} material="telemetry_cyan" />
                  <VoxelBox pos={[0, 0.18, 0]} scale={[0.03, 0.12, 0.03]} material="chrome_red" />
                </group>
              )}
            </group>
          </group>
        </group>

        {/* Head (Pivot at neck y=1.62) */}
        <group position={[0, 0.76, 0]}>
          <group ref={headRef}>
            {/* Cubic Face & Head */}
            <VoxelBox pos={[0, 0.22, 0]} scale={[0.46, 0.46, 0.46]} material="chrome_brushed" />
            {/* Hair / Headwear */}
            <VoxelBox pos={[0, 0.42, 0]} scale={[0.48, 0.12, 0.48]} material="chrome_carbon" />

            {/* Race Headset (Marcus Vance) */}
            {isRaceEngineer && (
              <group>
                <VoxelBox pos={[-0.24, 0.22, 0]} scale={[0.06, 0.18, 0.18]} material="chrome_red" />
                <VoxelBox pos={[0.24, 0.22, 0]} scale={[0.06, 0.18, 0.18]} material="chrome_red" />
                <VoxelBox pos={[0, 0.46, 0]} scale={[0.5, 0.04, 0.12]} material="chrome_carbon" />
                <VoxelBox pos={[0.22, 0.14, 0.18]} scale={[0.03, 0.03, 0.24]} material="chrome_carbon" />
              </group>
            )}

            {/* Cyber Visor (Dr. Aris Thorne / AI) */}
            {isAI && (
              <VoxelBox pos={[0, 0.24, 0.24]} scale={[0.48, 0.08, 0.02]} material="telemetry_cyan" />
            )}
          </group>
        </group>

        {/* Floating In-World Role Indicator */}
        <group position={[0, 1.65, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2.0, 0.38]} />
            <meshBasicMaterial color="#171A20" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.96, 0.34]} />
            <meshBasicMaterial color={accentMat === "telemetry_cyan" ? "#22D3EE" : "#D71D35"} wireframe />
          </mesh>
        </group>
      </group>
    </group>
  );
}


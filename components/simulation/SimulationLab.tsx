"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { getVoxelMaterial, getVoxelSignMaterial } from "@/lib/voxelTextures";
import { worldSound } from "@/lib/audio";

interface SimulationLabProps {
  position?: [number, number, number];
}

export const SimulationLab: React.FC<SimulationLabProps> = ({
  position = [22, 0, 8],
}) => {
  const { inspectProject, activeProject, mode, reducedMotion } = useWorldStore();
  const { registerObject, unregisterObject } = useInteractionRegistry();
  const groupRef = useRef<THREE.Group>(null);
  const ggTraceDotRef = useRef<THREE.Mesh>(null);
  const turbineRef = useRef<THREE.Group>(null);

  const [isActivated, setIsActivated] = useState(false);

  // Register interactive terminal
  useEffect(() => {
    const terminalPos: [number, number, number] = [
      position[0],
      position[1] + 1.2,
      position[2] + 6.6,
    ];

    registerObject({
      id: "simulation_terminal",
      type: "terminal",
      label: "Vehicle Simulation Solver Station",
      sublabel: "Numerical Quasi-Static Point-Mass Lap Solver",
      actionPrompt: "[E] RUN VEHICLE LAP SIMULATION",
      position: terminalPos,
      boundsRadius: 8,
      projectSlug: "f1-lap-time-simulator",
      facilityId: "simulation",
      onInteract: () => {
        worldSound.playInspectChime();
        inspectProject("f1-lap-time-simulator");
      },
    });

    return () => unregisterObject("simulation_terminal");
  }, [position, registerObject, unregisterObject, inspectProject]);

  const stoneBrickMat = useMemo(() => getVoxelMaterial("stone_bricks"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("oak_planks"), []);
  const signMat = useMemo(
    () => getVoxelSignMaterial("SIMULATION LAB", "F1 LAP-TIME SIMULATOR"),
    []
  );
  const glassMat = useMemo(
    () =>
      getVoxelMaterial("glass", {
        transparent: true,
        opacity: 0.65,
      }),
    []
  );
  const glowstoneMat = useMemo(
    () =>
      getVoxelMaterial("glowstone", {
        emissive: new THREE.Color("#fab005"),
        emissiveIntensity: 1.6,
      }),
    []
  );
  const monitorMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);

  // Frame loop for turbine rotation & G-G trace animation
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Check proximity to player
    const camPos = state.camera.position;
    const dist = Math.hypot(camPos.x - position[0], camPos.z - position[2]);
    const active = dist < 16;
    if (active !== isActivated) {
      setIsActivated(active);
    }

    // 1. Wind-tunnel turbine rotation
    if (turbineRef.current && !reducedMotion) {
      turbineRef.current.rotation.z += delta * (active ? 6.0 : 2.0);
    }

    // 2. Animate G-G friction circle point (simulating combined braking and lateral cornering forces)
    if (ggTraceDotRef.current && !reducedMotion) {
      // Trace realistic friction circle boundary: braking (Ax < 0) + cornering (Ay != 0)
      const angle = t * 1.8;
      const radius = 0.52 + Math.sin(t * 4.0) * 0.12; // envelope variation
      const ax = Math.cos(angle) * radius;
      const ay = Math.sin(angle) * radius;

      ggTraceDotRef.current.position.x = ax;
      ggTraceDotRef.current.position.y = ay;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    worldSound.playInspectChime();
    inspectProject("f1-lap-time-simulator");
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {/* 1. Foundation Slab (12x10 blocks) */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[12, 0.5, 10]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 2. Main Lab Structure Walls */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[11, 4.0, 9]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 3. Observation Glass Windows (Front & Sides) */}
      <mesh position={[0, 2.6, 4.55]} castShadow>
        <boxGeometry args={[8.0, 2.0, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[-5.55, 2.6, 0]} castShadow>
        <boxGeometry args={[0.2, 2.0, 6.0]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[5.55, 2.6, 0]} castShadow>
        <boxGeometry args={[0.2, 2.0, 6.0]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* 4. Roof Platform with Aerodynamic Ventilation Ducts */}
      <mesh position={[0, 4.75, 0]} castShadow>
        <boxGeometry args={[12, 0.5, 10]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Aerodynamic Wind Tunnel Intake & Spinning Turbine on Roof */}
      <group position={[0, 5.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.0, 1.4, 4.0]} />
          <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Rotating intake fan blades */}
        <group ref={turbineRef} position={[0, 0, 2.02]}>
          <mesh>
            <boxGeometry args={[2.8, 0.3, 0.1]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[2.8, 0.3, 0.1]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* 5. G-G Friction Circle Visualization Display Wall (Interior / Front View) */}
      <group position={[0, 2.6, 4.4]}>
        <mesh>
          <boxGeometry args={[5.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#064e3b" roughness={0.8} />
        </mesh>
        {/* Outer Friction boundary circle */}
        <mesh position={[0, 0, 0.08]}>
          <ringGeometry args={[0.65, 0.72, 32]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
        {/* Inner reference ring */}
        <mesh position={[0, 0, 0.08]}>
          <ringGeometry args={[0.35, 0.38, 32]} />
          <meshBasicMaterial color="#059669" opacity={0.6} transparent />
        </mesh>
        {/* Axes (Ax Longitudinal, Ay Lateral) */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[1.7, 0.04]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 0, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.7, 0.04]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        {/* Live animated friction trace dot */}
        <mesh ref={ggTraceDotRef} position={[0.2, 0.3, 0.09]}>
          <boxGeometry args={[0.12, 0.12, 0.04]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* 6. Glowstone Lantern Blocks */}
      {[-4, 4].map((x) => (
        <mesh key={x} position={[x, 4.2, 4.2]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      ))}

      {/* 7. Physical Minecraft Sign: [ VEHICLE SIMULATION LAB / LAP-TIME SOLVER ] */}
      <group position={[0, 2.0, 5.2]}>
        <mesh castShadow>
          <boxGeometry args={[6.0, 1.0, 0.2]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[5.8, 0.9]} />
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

      {/* 8. Interactive Terminal Pedestal */}
      <group position={[0, 0, 6.6]}>
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
    </group>
  );
};

"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { getVoxelMaterial } from "@/lib/voxelTextures";

interface VoxelGadgetProps {
  slotIndex: number;
  scale?: number;
}

export const VoxelGadget: React.FC<VoxelGadgetProps> = ({ slotIndex, scale = 1 }) => {
  const carbonMat = useMemo(() => getVoxelMaterial("chrome_carbon"), []);
  const papayaMat = useMemo(() => getVoxelMaterial("chrome_red"), []);
  const cyanMat = useMemo(() => getVoxelMaterial("chrome_polished"), []);
  const goldMat = useMemo(() => getVoxelMaterial("chrome_polished"), []);
  const ironMat = useMemo(() => getVoxelMaterial("chrome_graphite"), []);
  const screenMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);

  switch (slotIndex) {
    case 0:
      // 1. Telemetry Diagnostic Tablet (Glowing screen, carbon frame, antenna)
      return (
        <group scale={scale}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.46, 0.04]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.02, 0.025]}>
            <boxGeometry args={[0.28, 0.36, 0.01]} />
            <primitive object={screenMat} attach="material" />
          </mesh>
          <mesh position={[0.13, 0.26, 0]}>
            <boxGeometry args={[0.02, 0.12, 0.02]} />
            <primitive object={cyanMat} attach="material" />
          </mesh>
        </group>
      );

    case 1:
      // 2. Quasi-Static Lap Solver Dial & G-G Compass
      return (
        <group scale={scale}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 12]} />
            <meshBasicMaterial color="#0c4a6e" />
          </mesh>
          {/* Cyan G-G Needle */}
          <mesh position={[0, 0.045, 0]} rotation={[0, 0.78, 0]}>
            <boxGeometry args={[0.22, 0.01, 0.03]} />
            <primitive object={cyanMat} attach="material" />
          </mesh>
        </group>
      );

    case 2:
      // 3. ASISH Racing keyfob (silver, red and carbon)
      return (
        <group scale={scale}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.28, 0.05]} />
            <primitive object={papayaMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.04, 0.03]}>
            <boxGeometry args={[0.1, 0.12, 0.01]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
          {/* Key Ring */}
          <mesh position={[0, 0.16, 0]}>
            <torusGeometry args={[0.04, 0.012, 8, 12]} />
            <primitive object={ironMat} attach="material" />
          </mesh>
        </group>
      );

    case 3:
      // 4. Team Operations Carbon Pit Wall Clipboard
      return (
        <group scale={scale}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.44, 0.03]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
          <mesh position={[0, -0.01, 0.02]}>
            <boxGeometry args={[0.26, 0.34, 0.01]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          {/* Top Metal Clip */}
          <mesh position={[0, 0.2, 0.03]}>
            <boxGeometry args={[0.14, 0.04, 0.03]} />
            <primitive object={ironMat} attach="material" />
          </mesh>
        </group>
      );

    case 4:
      // 5. 3D Holographic Campus Voxel Map Device
      return (
        <group scale={scale}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.38, 0.04]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
          {/* Hologram Projector Screen */}
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.26, 0.32, 0.01]} />
            <meshBasicMaterial color="#065f46" />
          </mesh>
          {/* Glowing Green Grid lines */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.18, 0.18, 0.01]} />
            <meshBasicMaterial color="#34d399" wireframe />
          </mesh>
        </group>
      );

    case 5:
      // 6. High-Performance Silicon Storage Drive (Canonical Projects)
      return (
        <group scale={scale}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.34, 0.04]} />
            <meshBasicMaterial color="#14532d" />
          </mesh>
          {/* Gold Connector Pins */}
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.02]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
          {/* Processor Silicon Die */}
          <mesh position={[0, 0.02, 0.025]}>
            <boxGeometry args={[0.12, 0.12, 0.02]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
        </group>
      );

    case 6:
      // 7. Neural AI Core (EA FC & VyaparPulse Tensor Cube)
      return (
        <group scale={scale}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color="#7c3aed" wireframe />
          </mesh>
          <mesh>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        </group>
      );

    case 7:
    default:
      // 8. Engineering HQ Gold ID Monolith Badge (Asish Oliver M Credentials)
      return (
        <group scale={scale}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.38, 0.04]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
          {/* Lanyard Clip */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.06, 0.04, 0.02]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
          {/* Monolith Microchip */}
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.18, 0.24, 0.01]} />
            <primitive object={papayaMat} attach="material" />
          </mesh>
        </group>
      );
  }
};


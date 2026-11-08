"use client";

import { CarChromeDetails } from "./CarChromeDetails";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { getVoxelMaterial } from "@/lib/voxelTextures";

interface VoxelF1CarProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const VoxelF1Car: React.FC<VoxelF1CarProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { reducedMotion } = useWorldStore();

  const carbonMat = useMemo(() => getVoxelMaterial("chrome_carbon"), []);
  const silverMat = useMemo(() => getVoxelMaterial("chrome_polished"), []);
  const redMat = useMemo(() => getVoxelMaterial("chrome_red"), []);
  const whiteMat = useMemo(() => getVoxelMaterial("curb_white"), []);
  const tireMat = useMemo(() => getVoxelMaterial("tire_black"), []);
  const screenMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);

  // Subtle mechanical garage idle vibration
  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 16) * 0.003;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <CarChromeDetails/>
      {/* 1. Carbon Floor / Underbody Plank */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.1, 4.4]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>

      {/* 2. Stepped Front Wing Assembly */}
      <group position={[0, 0.18, 2.3]}>
        {/* Main lower plane */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.08, 0.5]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        {/* Upper flap element */}
        <mesh position={[0, 0.07, -0.08]} castShadow>
          <boxGeometry args={[2.3, 0.06, 0.3]} />
          <primitive object={redMat} attach="material" />
        </mesh>
        {/* Left vertical endplate */}
        <mesh position={[1.2, 0.12, 0]} castShadow>
          <boxGeometry args={[0.08, 0.32, 0.55]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        {/* Right vertical endplate */}
        <mesh position={[-1.2, 0.12, 0]} castShadow>
          <boxGeometry args={[0.08, 0.32, 0.55]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* 3. Stepped Nosecone */}
      {/* Front nose tip */}
      <mesh position={[0, 0.28, 1.85]} castShadow>
        <boxGeometry args={[0.42, 0.2, 0.6]} />
        <primitive object={silverMat} attach="material" />
      </mesh>
      {/* Mid nose with cyan aerodynamic stripe */}
      <mesh position={[0, 0.34, 1.35]} castShadow>
        <boxGeometry args={[0.54, 0.26, 0.7]} />
        <primitive object={silverMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.48, 1.35]}>
        <boxGeometry args={[0.12, 0.02, 0.65]} />
        <primitive object={redMat} attach="material" />
      </mesh>
      {/* Front bulkhead */}
      <mesh position={[0, 0.42, 0.75]} castShadow>
        <boxGeometry args={[0.68, 0.34, 0.7]} />
        <primitive object={silverMat} attach="material" />
      </mesh>

      {/* 4. Cockpit & Driver Tub */}
      <mesh position={[0, 0.44, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.42, 0.8]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>
      {/* Cockpit opening cutout */}
      <mesh position={[0, 0.55, 0.1]}>
        <boxGeometry args={[0.52, 0.15, 0.5]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
      {/* Voxel Steering Wheel with digital screen */}
      <mesh position={[0, 0.52, 0.32]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.26, 0.16, 0.05]} />
        <primitive object={screenMat} attach="material" />
      </mesh>

      {/* 5. Voxel Halo Protection Frame */}
      <group position={[0, 0.62, 0.08]}>
        {/* Center forward pillar */}
        <mesh position={[0, 0.02, 0.28]} castShadow>
          <boxGeometry args={[0.08, 0.26, 0.08]} />
          <primitive object={redMat} attach="material" />
        </mesh>
        {/* Top protective hoop */}
        <mesh position={[0, 0.14, 0.02]} castShadow>
          <boxGeometry args={[0.62, 0.08, 0.64]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* 6. Engine Cover, Airbox & Shark Fin */}
      {/* Airbox scoop */}
      <mesh position={[0, 0.76, -0.42]} castShadow>
        <boxGeometry args={[0.42, 0.38, 0.8]} />
        <primitive object={silverMat} attach="material" />
      </mesh>
      {/* Air intake aperture */}
      <mesh position={[0, 0.82, -0.02]}>
        <boxGeometry args={[0.24, 0.18, 0.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Vertical shark fin */}
      <mesh position={[0, 0.85, -0.9]} castShadow>
        <boxGeometry args={[0.06, 0.4, 1.2]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>

      {/* 7. Aerodynamic Sidepods (Left & Right) */}
      {/* Left sidepod (Papaya Orange + Carbon) */}
      <group position={[0.64, 0.36, -0.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.36, 1.6]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        {/* Front radiator intake cutout */}
        <mesh position={[0, 0.02, 0.78]}>
          <boxGeometry args={[0.42, 0.28, 0.06]} />
          <meshBasicMaterial color="#0a0a0c" />
        </mesh>
      </group>
      {/* Right sidepod (Papaya Orange + Carbon) */}
      <group position={[-0.64, 0.36, -0.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.36, 1.6]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        {/* Front radiator intake cutout */}
        <mesh position={[0, 0.02, 0.78]}>
          <boxGeometry args={[0.42, 0.28, 0.06]} />
          <meshBasicMaterial color="#0a0a0c" />
        </mesh>
      </group>

      {/* 8. Stepped Rear Wing Assembly */}
      <group position={[0, 0.82, -1.85]}>
        {/* Lower beam wing */}
        <mesh position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[1.4, 0.06, 0.3]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        {/* Main wing plane */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[1.65, 0.08, 0.4]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        {/* DRS flap */}
        <mesh position={[0, 0.2, -0.05]} castShadow>
          <boxGeometry args={[1.6, 0.05, 0.28]} />
          <primitive object={redMat} attach="material" />
        </mesh>
        {/* Left endplate */}
        <mesh position={[0.82, 0.0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.58, 0.58]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        {/* Right endplate */}
        <mesh position={[-0.82, 0.0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.58, 0.58]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        {/* Rear Rain LED Safety Light (Emissive Red Cube) */}
        <mesh position={[0, -0.36, -0.12]}>
          <boxGeometry args={[0.16, 0.14, 0.06]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={2.0}
          />
        </mesh>
      </group>

      {/* 9. Chunky Voxel Wheels (Tire blocks + Papaya / Cyan rim accents) */}
      {/* Front Left */}
      <group position={[1.12, 0.35, 1.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.68, 0.68]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
        <mesh position={[0.18, 0, 0]}>
          <boxGeometry args={[0.05, 0.28, 0.28]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[-1.12, 0.35, 1.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.68, 0.68]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
        <mesh position={[-0.18, 0, 0]}>
          <boxGeometry args={[0.05, 0.28, 0.28]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* Rear Left (Wider) */}
      <group position={[1.15, 0.38, -1.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.74, 0.74]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <boxGeometry args={[0.05, 0.32, 0.32]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* Rear Right (Wider) */}
      <group position={[-1.15, 0.38, -1.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.74, 0.74]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
        <mesh position={[-0.22, 0, 0]}>
          <boxGeometry args={[0.05, 0.32, 0.32]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* 10. Voxel Suspension Wishbones */}
      {/* Front Wishbone blocks */}
      <mesh position={[0.65, 0.34, 1.25]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.65, 0.06, 0.1]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>
      <mesh position={[-0.65, 0.34, 1.25]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.65, 0.06, 0.1]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>
      {/* Rear Wishbone blocks */}
      <mesh position={[0.68, 0.36, -1.25]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.65, 0.06, 0.1]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>
      <mesh position={[-0.68, 0.36, -1.25]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.65, 0.06, 0.1]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>
    </group>
  );
};

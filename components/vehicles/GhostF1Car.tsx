"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleGhostCarAtProgress, GhostCarState } from "@/lib/digitalTwin/ghostLapEngine";

interface GhostF1CarProps {
  playerProgress: number; // 0.0 to 1.0 from driving simulation
  visible?: boolean;
}

export const GhostF1Car: React.FC<GhostF1CarProps> = ({
  playerProgress,
  visible = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Translucent holographic cyan materials for Asish's authoritative ghost car
  const ghostBodyMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#00d2be"),
      emissive: new THREE.Color("#004d40"),
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      metalness: 0.8,
      depthWrite: false,
    });
  }, []);

  const ghostAccentMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#38bdf8"),
      emissive: new THREE.Color("#0284c7"),
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
  }, []);

  const ghostWheelMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0f172a"),
      emissive: new THREE.Color("#1e293b"),
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;

    // Sample authoritative ghost position based on lap progress
    const ghostState: GhostCarState = sampleGhostCarAtProgress(playerProgress);

    // Subtle holographic hovering pulse
    const hover = Math.sin(state.clock.getElapsedTime() * 4) * 0.02;

    groupRef.current.position.set(ghostState.x, 0.45 + hover, ghostState.z);
    groupRef.current.rotation.y = ghostState.yaw;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* 1. Ghost Floor / Main Body Chassis */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.6, 0.1, 4.2]} />
        <primitive object={ghostBodyMat} attach="material" />
      </mesh>

      {/* 2. Ghost Cockpit Halo */}
      <mesh position={[0, 0.55, -0.2]}>
        <boxGeometry args={[0.9, 0.45, 1.8]} />
        <primitive object={ghostBodyMat} attach="material" />
      </mesh>

      {/* 3. Ghost Front Wing Assembly */}
      <group position={[0, 0.18, 2.2]}>
        <mesh>
          <boxGeometry args={[2.3, 0.08, 0.5]} />
          <primitive object={ghostAccentMat} attach="material" />
        </mesh>
      </group>

      {/* 4. Ghost Rear Wing & DRS Flap */}
      <group position={[0, 0.85, -2.1]}>
        <mesh>
          <boxGeometry args={[1.8, 0.08, 0.45]} />
          <primitive object={ghostAccentMat} attach="material" />
        </mesh>
      </group>

      {/* 5. Holographic Wireframe Wheels */}
      <group position={[1.05, 0.35, 1.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.45, 12]} />
          <primitive object={ghostWheelMat} attach="material" />
        </mesh>
      </group>
      <group position={[-1.05, 0.35, 1.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.45, 12]} />
          <primitive object={ghostWheelMat} attach="material" />
        </mesh>
      </group>
      <group position={[1.1, 0.38, -1.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.55, 12]} />
          <primitive object={ghostWheelMat} attach="material" />
        </mesh>
      </group>
      <group position={[-1.1, 0.38, -1.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.55, 12]} />
          <primitive object={ghostWheelMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

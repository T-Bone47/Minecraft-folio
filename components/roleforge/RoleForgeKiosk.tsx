/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * 3D Physical RoleForge Kiosk Terminal
 */

"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRoleForgeStore } from "@/state/roleforgeStore";

interface RoleForgeKioskProps {
  position?: [number, number, number];
  rotationY?: number;
}

export const RoleForgeKiosk: React.FC<RoleForgeKioskProps> = ({
  position = [4, 0, -4],
  rotationY = 0,
}) => {
  const [hovered, setHovered] = useState(false);
  const screenRef = useRef<THREE.Mesh>(null);
  const openTerminal = useRoleForgeStore((s) => s.openTerminal);

  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        const pulse = Math.sin(state.clock.elapsedTime * 3.0) * 0.2 + 0.8;
        mat.emissiveIntensity = hovered ? 1.6 : 0.8 * pulse;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    openTerminal("presets");
  };

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base Plinth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Terminal Angled Column */}
      <mesh position={[0, 1.2, 0]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 1.0, 0.2]} />
        <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Glowing Screen */}
      <mesh ref={screenRef} position={[0, 1.25, 0.11]} rotation={[-0.15, 0, 0]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#22d3ee"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Hologram Sign Top */}
      <mesh position={[0, 1.85, 0]}>
        <boxGeometry args={[1.1, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#0e7490"
          emissive="#06b6d4"
          emissiveIntensity={hovered ? 1.5 : 0.6}
        />
      </mesh>
    </group>
  );
};


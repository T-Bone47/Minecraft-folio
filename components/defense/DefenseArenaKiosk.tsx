/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * 3D Physical Defense Arena Kiosk Terminal
 */

"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDefenseStore } from "@/state/defenseStore";

interface DefenseArenaKioskProps {
  position?: [number, number, number];
  rotationY?: number;
}

export const DefenseArenaKiosk: React.FC<DefenseArenaKioskProps> = ({
  position = [-4, 0, -4],
  rotationY = Math.PI / 4,
}) => {
  const [hovered, setHovered] = useState(false);
  const screenRef = useRef<THREE.Mesh>(null);
  const openArena = useDefenseStore((s) => s.openArena);

  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        const pulse = Math.sin(state.clock.elapsedTime * 4.0) * 0.25 + 0.75;
        mat.emissiveIntensity = hovered ? 1.8 : 0.9 * pulse;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    openArena("systems-reliability", "briefing");
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
        <meshStandardMaterial color="#1f1113" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Terminal Angled Column */}
      <mesh position={[0, 1.2, 0]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 1.0, 0.2]} />
        <meshStandardMaterial color="#2d1519" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Glowing Screen */}
      <mesh ref={screenRef} position={[0, 1.25, 0.11]} rotation={[-0.15, 0, 0]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Hologram Sign Top */}
      <mesh position={[0, 1.85, 0]}>
        <boxGeometry args={[1.1, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#991b1b"
          emissive="#ef4444"
          emissiveIntensity={hovered ? 1.8 : 0.8}
        />
      </mesh>
    </group>
  );
};

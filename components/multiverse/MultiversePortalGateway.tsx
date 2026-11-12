"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMultiverseStore } from "@/state/multiverseStore";
import { useWorldStore } from "@/state/worldStore";
import type { MultiverseProject } from "@/lib/multiverse/projectTypes";

interface MultiversePortalGatewayProps {
  project: MultiverseProject;
  position: [number, number, number];
  rotationY: number;
}

export const MultiversePortalGateway: React.FC<MultiversePortalGatewayProps> = ({
  project,
  position,
  rotationY,
}) => {
  const portalFieldRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const openPortal = useMultiverseStore((s) => s.openPortal);
  const playerPosition = useWorldStore((s) => s.playerPosition);

  // Calculate distance from player to portal for auto-prompting or proximity glow
  useFrame((state, delta) => {
    if (portalFieldRef.current) {
      const mat = portalFieldRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        // Subtle wave pulsation
        const pulse = Math.sin(state.clock.elapsedTime * 3.0) * 0.15 + 0.85;
        mat.emissiveIntensity = hovered ? 1.8 : 0.9 * pulse;
        mat.opacity = hovered ? 0.95 : 0.75 + Math.sin(state.clock.elapsedTime * 2.0) * 0.1;
      }
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  const [pr, pg, pb] = project.accentRgb;
  const portalColor = new THREE.Color(pr, pg, pb);

  const handleClick = (e: any) => {
    e.stopPropagation();
    openPortal(project.id, "demo");
  };

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Portal Outer Voxel Frame Pillars */}
      {/* Left Pillar */}
      <mesh position={[-1.6, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 4.4, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Right Pillar */}
      <mesh position={[1.6, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 4.4, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Top Lintel Arch */}
      <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.4, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Base Threshold Pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.1, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* 2. Glowing Neon Accents on Frame */}
      <mesh position={[-1.4, 2.2, 0.26]}>
        <boxGeometry args={[0.08, 4.0, 0.04]} />
        <meshBasicMaterial color={portalColor} />
      </mesh>
      <mesh position={[1.4, 2.2, 0.26]}>
        <boxGeometry args={[0.08, 4.0, 0.04]} />
        <meshBasicMaterial color={portalColor} />
      </mesh>
      <mesh position={[0, 4.2, 0.26]}>
        <boxGeometry args={[2.88, 0.08, 0.04]} />
        <meshBasicMaterial color={portalColor} />
      </mesh>

      {/* 3. Dimensional Portal Energy Field (Interactive Trigger) */}
      <mesh
        ref={portalFieldRef}
        position={[0, 2.2, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2.8, 4.0]} />
        <meshStandardMaterial
          color={portalColor}
          emissive={portalColor}
          emissiveIntensity={1.0}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Rotating Energy Ring Inside Portal */}
      <group ref={ringRef} position={[0, 2.2, 0]}>
        <mesh>
          <ringGeometry args={[0.9, 1.05, 32]} />
          <meshBasicMaterial
            color={portalColor}
            transparent
            opacity={hovered ? 0.8 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 5. Overhead Floating Hologram Signboard */}
      <group position={[0, 4.9, 0]}>
        {/* Background plaque */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 0.6, 0.1]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[3.1, 0.5]} />
          <meshBasicMaterial color={hovered ? "#38bdf8" : "#0f172a"} />
        </mesh>
      </group>

      {/* Point Light casting coloured portal glow onto floor */}
      <pointLight
        position={[0, 2.2, 0.5]}
        color={portalColor}
        intensity={hovered ? 3.5 : 2.0}
        distance={6}
        decay={2}
      />
    </group>
  );
};

"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MultiversePortalGateway } from "./MultiversePortalGateway";
import { multiverseProjects } from "@/lib/multiverse/projectRegistry";
import { useMultiverseStore } from "@/state/multiverseStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useWorldStore } from "@/state/worldStore";

interface ProjectLaunchBayProps {
  position?: [number, number, number];
}

export const ProjectLaunchBay: React.FC<ProjectLaunchBayProps> = ({
  position = [0, 0, -32],
}) => {
  const holoCoreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const openPortal = useMultiverseStore((s) => s.openPortal);
  const setLaunchBayActive = useMultiverseStore((s) => s.setLaunchBayActive);
  const registerObject = useInteractionRegistry((s) => s.registerObject);
  const unregisterObject = useInteractionRegistry((s) => s.unregisterObject);
  const playerPosition = useWorldStore((s) => s.playerPosition);

  // Register the 4 interactive portal stations in the interaction registry
  useEffect(() => {
    multiverseProjects.forEach((proj) => {
      const portalWorldX = position[0] + proj.portalOffset[0];
      const portalWorldY = position[1] + 1.2;
      const portalWorldZ = position[2] + proj.portalOffset[2];

      registerObject({
        id: `portal-${proj.id}`,
        type: "terminal",
        label: `${proj.shortName.toUpperCase()} DIMENSIONAL PORTAL`,
        sublabel: proj.tagline,
        actionPrompt: `[E] ENTER ${proj.shortName.toUpperCase()} PORTAL`,
        position: [portalWorldX, portalWorldY, portalWorldZ],
        boundsRadius: 3.2,
        facilityId: "multiverse",
        onInteract: () => {
          openPortal(proj.id, "demo");
        },
      });
    });

    // Central command console
    registerObject({
      id: "multiverse-central-core",
      type: "terminal",
      label: "MULTIVERSE COMMAND CORE",
      sublabel: "Four Connected Production Software Systems",
      actionPrompt: "[E] ACCESS MULTIVERSE DIRECTORY",
      position: [position[0], position[1] + 1.0, position[2]],
      boundsRadius: 2.8,
      facilityId: "multiverse",
      onInteract: () => {
        openPortal("racemind", "demo");
      },
    });

    return () => {
      multiverseProjects.forEach((proj) => {
        unregisterObject(`portal-${proj.id}`);
      });
      unregisterObject("multiverse-central-core");
    };
  }, [position, registerObject, unregisterObject, openPortal]);

  // Frame update for central hologram & launch bay presence detection
  useFrame((state, delta) => {
    if (holoCoreRef.current) {
      holoCoreRef.current.rotation.y += delta * 0.8;
      holoCoreRef.current.rotation.x += delta * 0.4;
      const scale = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
      holoCoreRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.6;
    }

    // Check proximity to Launch Bay chamber
    const dx = playerPosition[0] - position[0];
    const dz = playerPosition[2] - position[2];
    const distSq = dx * dx + dz * dz;
    const isInside = distSq < 144; // within 12 meters
    setLaunchBayActive(isInside);
  });

  const [cx, cy, cz] = position;

  // Retrieve projects
  const racemind = multiverseProjects.find((p) => p.id === "racemind")!;
  const liveF1 = multiverseProjects.find((p) => p.id === "live-f1")!;
  const sentinel = multiverseProjects.find((p) => p.id === "sentinel")!;
  const vyaparpulse = multiverseProjects.find((p) => p.id === "vyaparpulse")!;

  return (
    <group position={[cx, cy, cz]}>
      {/* 1. Launch Bay Floor Base Structure (18x18m Chamber) */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[18, 0.04, 18]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Decorative Floor Inlay Rings */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[2.5, 2.7, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[5.8, 6.0, 32]} />
        <meshBasicMaterial color="#64748b" transparent opacity={0.4} />
      </mesh>

      {/* 2. Floor Conduits leading from Center to each Portal */}
      {/* North Conduit (RaceMind - Red) */}
      <mesh position={[0, 0.04, -3.2]}>
        <boxGeometry args={[0.3, 0.02, 6.0]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* East Conduit (Live F1 - Blue) */}
      <mesh position={[3.2, 0.04, 0]}>
        <boxGeometry args={[6.0, 0.02, 0.3]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      {/* South Conduit (Sentinel - Purple) */}
      <mesh position={[0, 0.04, 3.2]}>
        <boxGeometry args={[0.3, 0.02, 6.0]} />
        <meshBasicMaterial color="#8b5cf6" />
      </mesh>
      {/* West Conduit (VyaparPulse - Emerald) */}
      <mesh position={[-3.2, 0.04, 0]}>
        <boxGeometry args={[6.0, 0.02, 0.3]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* 3. Perimeter Architecture: 8 Corner Columns */}
      {[
        [-8.5, -8.5],
        [8.5, -8.5],
        [-8.5, 8.5],
        [8.5, 8.5],
        [-8.5, 0],
        [8.5, 0],
        [0, -8.5],
        [0, 8.5],
      ].map(([px, pz], idx) => (
        <mesh key={idx} position={[px, 3.0, pz]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 6.0, 0.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* 4. Roof Overhead Beams */}
      <mesh position={[0, 6.0, 0]}>
        <boxGeometry args={[18, 0.3, 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 6.0, 0]}>
        <boxGeometry args={[0.5, 0.3, 18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* 5. Central Holographic Command Table */}
      <group position={[0, 0, 0]}>
        {/* Table pedestal base */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.9, 8]} />
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Glowing table rim */}
        <mesh position={[0, 0.92, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.06, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Rotating central holographic core */}
        <mesh ref={holoCoreRef} position={[0, 1.6, 0]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.5}
            wireframe
          />
        </mesh>

        {/* Orbiting hologram energy ring */}
        <group ref={ringRef} position={[0, 1.6, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.7, 0.78, 32]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Central command light */}
        <pointLight position={[0, 2.0, 0]} color="#38bdf8" intensity={2.5} distance={8} decay={2} />
      </group>

      {/* 6. Four Connected Multiverse Gateways */}
      {/* North: RaceMind AI */}
      <MultiversePortalGateway
        project={racemind}
        position={[racemind.portalOffset[0], 0, racemind.portalOffset[2]]}
        rotationY={0}
      />

      {/* East: Live F1 Intelligence */}
      <MultiversePortalGateway
        project={liveF1}
        position={[liveF1.portalOffset[0], 0, liveF1.portalOffset[2]]}
        rotationY={-Math.PI / 2}
      />

      {/* South: Sentinel AI */}
      <MultiversePortalGateway
        project={sentinel}
        position={[sentinel.portalOffset[0], 0, sentinel.portalOffset[2]]}
        rotationY={Math.PI}
      />

      {/* West: VyaparPulse AI */}
      <MultiversePortalGateway
        project={vyaparpulse}
        position={[vyaparpulse.portalOffset[0], 0, vyaparpulse.portalOffset[2]]}
        rotationY={Math.PI / 2}
      />
    </group>
  );
};


"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useXRayStore } from "@/state/xrayStore";
import { facilities } from "@/data/facilities";
import { getVoxelSignMaterial } from "@/lib/voxelTextures";

// Technical conduit connections between campus facilities
const CONDUIT_PATHS: Array<{ from: string; to: string; label: string }> = [
  { from: "garage", to: "telemetry", label: "RAW TELEMETRY BUS" },
  { from: "telemetry", to: "simulation", label: "NORMALIZED TELEMETRY" },
  { from: "simulation", to: "aiml", label: "SPATIAL DELTAS" },
  { from: "aiml", to: "operations", label: "CORNER DIAGNOSTICS" },
  { from: "operations", to: "hq", label: "DECISION AUDIT" },
];

export const XRayWorldOverlay: React.FC = () => {
  const isXRayActive = useXRayStore((s) => s.isXRayActive);
  const selectedFacilityId = useXRayStore((s) => s.selectedFacilityId);
  const selectFacility = useXRayStore((s) => s.selectFacility);
  const openModal = useXRayStore((s) => s.openModal);

  const pulseRef = useRef<THREE.Group>(null);

  // Build conduit lines
  const conduitGeometries = useMemo(() => {
    return CONDUIT_PATHS.map((path) => {
      const fromFac = facilities.find((f) => f.id === path.from);
      const toFac = facilities.find((f) => f.id === path.to);
      if (!fromFac || !toFac) return null;

      const p1 = new THREE.Vector3(fromFac.approachPosition[0], 2.2, fromFac.approachPosition[2]);
      const p2 = new THREE.Vector3(toFac.approachPosition[0], 2.2, toFac.approachPosition[2]);

      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      return { geom, path, p1, p2 };
    }).filter(Boolean);
  }, []);

  // Animate pulse packets
  useFrame(({ clock }) => {
    if (!isXRayActive || !pulseRef.current) return;
    const t = (clock.getElapsedTime() * 0.8) % 1;

    let idx = 0;
    pulseRef.current.children.forEach((child) => {
      const conduit = conduitGeometries[idx];
      if (conduit) {
        child.position.lerpVectors(conduit.p1, conduit.p2, t);
      }
      idx++;
    });
  });

  // Conduit line material
  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.65 }),
    []
  );

  if (!isXRayActive) return null;

  return (
    <group name="frontier-xray-reality-overlay">
      {/* 1. Technical Conduits (Laser Paths connecting facilities) */}
      {conduitGeometries.map((c, i) =>
        c ? (
          <primitive key={i} object={new THREE.Line(c.geom, lineMaterial)} />
        ) : null
      )}

      {/* 2. Flowing Data Packet Pulses */}
      <group ref={pulseRef}>
        {conduitGeometries.map((_, i) => (
          <mesh key={`pulse-${i}`}>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        ))}
      </group>

      {/* 3. Facility X-Ray Holographic Beacons & Process Nodes */}
      {facilities.map((fac) => {
        const isSelected = selectedFacilityId === fac.id;
        const [x, y, z] = fac.approachPosition;

        return (
          <group
            key={fac.id}
            position={[x, y + 0.1, z]}
            onClick={(e) => {
              e.stopPropagation();
              selectFacility(fac.id);
              openModal("graph");
            }}
          >
            {/* Ground Technical Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.8, 2.3, 16]} />
              <meshBasicMaterial
                color={isSelected ? "#22D3EE" : "#34D399"}
                transparent
                opacity={isSelected ? 0.9 : 0.45}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Vertical Energy Beam */}
            <mesh position={[0, 4, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 8, 8]} />
              <meshBasicMaterial
                color={isSelected ? "#38BDF8" : "#22D3EE"}
                transparent
                opacity={isSelected ? 0.75 : 0.35}
              />
            </mesh>

            {/* Floating Technical Node Hologram */}
            <mesh position={[0, 4.2, 0]}>
              <octahedronGeometry args={[0.6, 0]} />
              <meshStandardMaterial
                color={isSelected ? "#0284C7" : "#0F172A"}
                emissive={isSelected ? "#38BDF8" : "#22D3EE"}
                emissiveIntensity={isSelected ? 0.8 : 0.4}
                wireframe
              />
            </mesh>

            {/* Floating Process Sign */}
            <mesh position={[0, 5.2, 0]}>
              <boxGeometry args={[3.6, 0.7, 0.1]} />
              <primitive
                attach="material"
                object={getVoxelSignMaterial(
                  `X-RAY: ${fac.name.toUpperCase()}`,
                  isSelected ? "ACTIVE STAGE INSPECTOR" : "CLICK TO TRACE PIPELINE"
                )}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * 3D World Mission Highlights & Adaptive Waypoint Beacons
 */

"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRoleForgeStore } from "@/state/roleforgeStore";

export const WorldMissionHighlights: React.FC = () => {
  const { compiledMission, activeStepIndex, worldHighlightsActive, openTerminal } =
    useRoleForgeStore();

  const beamRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 4.0) * 0.15;
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
    }
  });

  if (!worldHighlightsActive || !compiledMission || compiledMission.steps.length === 0) {
    return null;
  }

  const steps = compiledMission.steps;
  const currentStep = steps[activeStepIndex] || steps[0];
  const [cx, cy, cz] = currentStep.coordinates;

  return (
    <group>
      {/* Active Step Vertical Beacon Beam */}
      <group position={[cx, cy, cz]}>
        <mesh ref={beamRef} position={[0, 15, 0]}>
          <cylinderGeometry args={[0.3, 0.8, 30, 16, 1, true]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Pulsing Ground Waypoint Target */}
        <mesh
          ref={ringRef}
          position={[0, 0.2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => openTerminal("mission")}
        >
          <ringGeometry args={[1.2, 1.8, 32]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Dimmer indicators for remaining steps */}
      {steps.map((step, idx) => {
        if (idx === activeStepIndex) return null;
        const [sx, sy, sz] = step.coordinates;
        return (
          <group key={step.id} position={[sx, sy, sz]}>
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.8, 1.1, 16]} />
              <meshBasicMaterial
                color="#64748b"
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};


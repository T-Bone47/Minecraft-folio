"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";

export const DigitalTwinWorldReactivity: React.FC = () => {
  const conduitPulseTimestamp = useDigitalTwinStore((s) => s.conduitPulseTimestamp);
  const recordedLap = useDigitalTwinStore((s) => s.recordedLap);
  const activePipelineStage = useDigitalTwinStore((s) => s.activePipelineStage);

  // Pulse meshes
  const pulseGroup1Ref = useRef<THREE.Group>(null);
  const pulseGroup2Ref = useRef<THREE.Group>(null);
  const pulseBeaconsRef = useRef<THREE.Group>(null);

  // Define Conduit 3D Splines:
  // Route 1: Garage (-12, 0.4, 0) -> Plaza (0, 0.4, 0) -> Telemetry Tower (14, 0.4, -18)
  const curve1 = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, 0.45, 0),
      new THREE.Vector3(-6, 0.45, -1),
      new THREE.Vector3(0, 0.45, 0),
      new THREE.Vector3(7, 0.45, -8),
      new THREE.Vector3(14, 0.45, -18),
    ]);
  }, []);

  // Route 2: Telemetry Tower (14, 0.4, -18) -> Simulation Lab (20, 0.4, 10) -> AI Lab (0, 0.4, 24)
  const curve2 = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(14, 0.45, -18),
      new THREE.Vector3(18, 0.45, -4),
      new THREE.Vector3(20, 0.45, 10),
      new THREE.Vector3(12, 0.45, 18),
      new THREE.Vector3(0, 0.45, 24),
    ]);
  }, []);

  const tubeGeo1 = useMemo(() => new THREE.TubeGeometry(curve1, 32, 0.12, 6, false), [curve1]);
  const tubeGeo2 = useMemo(() => new THREE.TubeGeometry(curve2, 32, 0.12, 6, false), [curve2]);

  // Translucent Conduit Outer Shell Material
  const conduitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#182635",
        emissive: "#083344",
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.65,
      }),
    []
  );

  // Core Pulse Sphere Material
  const pulseMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#22d3ee",
      }),
    []
  );

  // Animation Loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulse 1 traveling along Route 1 (Garage -> Tower)
    if (pulseGroup1Ref.current) {
      const progress1 = (t * 0.4) % 1;
      const pos1 = curve1.getPointAt(progress1);
      pulseGroup1Ref.current.position.copy(pos1);
    }

    // Pulse 2 traveling along Route 2 (Tower -> Labs)
    if (pulseGroup2Ref.current) {
      const progress2 = (t * 0.35 + 0.5) % 1;
      const pos2 = curve2.getPointAt(progress2);
      pulseGroup2Ref.current.position.copy(pos2);
    }

    // Telemetry Tower Beacon Reaction
    if (pulseBeaconsRef.current) {
      const isRecentPulse = Date.now() - conduitPulseTimestamp < 4000;
      const pulseSpeed = isRecentPulse ? 12 : 3;
      const scale = 1 + Math.sin(t * pulseSpeed) * 0.25;
      pulseBeaconsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group name="digital-twin-reactivity">
      {/* 1. Fiber-Optic Telemetry Conduit Route 1 */}
      <mesh geometry={tubeGeo1} material={conduitMaterial} />

      {/* 2. Fiber-Optic Telemetry Conduit Route 2 */}
      <mesh geometry={tubeGeo2} material={conduitMaterial} />

      {/* Traveling Data Packet Light 1 */}
      <group ref={pulseGroup1Ref} position={[-12, 0.45, 0]}>
        <mesh material={pulseMaterial}>
          <sphereGeometry args={[0.22, 8, 8]} />
        </mesh>
        <pointLight color="#22d3ee" intensity={1.8} distance={3.5} />
      </group>

      {/* Traveling Data Packet Light 2 */}
      <group ref={pulseGroup2Ref} position={[14, 0.45, -18]}>
        <mesh material={pulseMaterial}>
          <sphereGeometry args={[0.22, 8, 8]} />
        </mesh>
        <pointLight color="#34d399" intensity={1.8} distance={3.5} />
      </group>

      {/* Reactive Beacon at Telemetry Tower Gantry [14, 18, -18] */}
      <group position={[14, 18.2, -18]} ref={pulseBeaconsRef}>
        <mesh material={pulseMaterial}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
        </mesh>
        <pointLight
          color={recordedLap ? "#22d3ee" : "#38bdf8"}
          intensity={recordedLap ? 3.5 : 1.5}
          distance={10}
        />
      </group>
    </group>
  );
};

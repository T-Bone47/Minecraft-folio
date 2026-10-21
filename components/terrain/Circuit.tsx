"use client";

import React, { useMemo, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { getVoxelMaterial } from "@/lib/voxelTextures";

export const Circuit: React.FC = () => {
  const asphaltRef = useRef<THREE.InstancedMesh>(null);
  const curbRedRef = useRef<THREE.InstancedMesh>(null);
  const curbWhiteRef = useRef<THREE.InstancedMesh>(null);
  const tireRef = useRef<THREE.InstancedMesh>(null);
  const pitWallRef = useRef<THREE.InstancedMesh>(null);

  // Generate voxel block coordinates for the entire circuit
  const circuitBlocks = useMemo(() => {
    const asphalt: Array<{ x: number; y: number; z: number }> = [];
    const curbRed: Array<{ x: number; y: number; z: number }> = [];
    const curbWhite: Array<{ x: number; y: number; z: number }> = [];
    const tires: Array<{ x: number; y: number; z: number }> = [];
    const pitWall: Array<{ x: number; y: number; z: number }> = [];

    // Helper to add a block track segment
    const addTrackSlab = (cx: number, cz: number, width = 4) => {
      const half = Math.floor(width / 2);
      for (let w = -half; w <= half; w++) {
        asphalt.push({ x: cx + w, y: 0.05, z: cz });
      }
    };

    // 1. Main Pit Straight: x = -24, running from z = -20 to z = 18 (width = 4)
    for (let z = -20; z <= 18; z += 1.0) {
      for (let w = -2; w <= 2; w++) {
        asphalt.push({ x: -24 + w, y: 0.05, z });
      }
      // Outer barrier at x = -27
      tires.push({ x: -27, y: 0.5, z });
      tires.push({ x: -27, y: 1.5, z });
    }

    // 2. Pit Lane: x = -15, running from z = -14 to z = 14 (width = 3)
    for (let z = -14; z <= 14; z += 1.0) {
      for (let w = -1; w <= 1; w++) {
        asphalt.push({ x: -15 + w, y: 0.05, z });
      }
    }

    // 3. Pit Wall separating Main Straight and Pit Lane at x = -19 (from z = -14 to z = 14)
    for (let z = -14; z <= 14; z += 1.0) {
      pitWall.push({ x: -19, y: 0.5, z });
      pitWall.push({ x: -19, y: 1.5, z });
    }

    // 4. Turn 1 & Turn 2 Sweeper (z = 18 to 26, bending from x = -24 to x = 8)
    let curbIndex = 0;
    for (let t = 0; t <= 1; t += 0.04) {
      // Quadratic Bezier from (-24, 18) through (-20, 26) to (0, 24)
      const u = 1 - t;
      const x = Math.round(u * u * -24 + 2 * u * t * -18 + t * t * 0);
      const z = Math.round(u * u * 18 + 2 * u * t * 26 + t * t * 24);

      for (let w = -2; w <= 2; w++) {
        asphalt.push({ x: x + w, y: 0.05, z });
      }

      // Outer Red & White Curbs
      const isRed = (curbIndex++) % 2 === 0;
      if (isRed) {
        curbRed.push({ x: x - 3, y: 0.25, z });
      } else {
        curbWhite.push({ x: x - 3, y: 0.25, z });
      }

      // Turn 1 Runoff Tire Wall
      tires.push({ x: x - 5, y: 0.5, z: z + 2 });
      tires.push({ x: x - 5, y: 1.5, z: z + 2 });
    }

    // 5. Back Straight & High-speed Section (from x = 0, z = 24 to x = 24, z = 4)
    for (let t = 0; t <= 1; t += 0.04) {
      const u = 1 - t;
      const x = Math.round(u * u * 0 + 2 * u * t * 14 + t * t * 24);
      const z = Math.round(u * u * 24 + 2 * u * t * 16 + t * t * 4);

      for (let w = -2; w <= 2; w++) {
        asphalt.push({ x: x + w, y: 0.05, z });
      }

      const isRed = (curbIndex++) % 2 === 0;
      if (isRed) {
        curbRed.push({ x: x + 3, y: 0.25, z });
      } else {
        curbWhite.push({ x: x + 3, y: 0.25, z });
      }
    }

    // 6. South Curve & Return to Main Straight (from x = 24, z = 4 to x = -24, z = -20)
    for (let t = 0; t <= 1; t += 0.035) {
      const u = 1 - t;
      const x = Math.round(u * u * 24 + 2 * u * t * 6 + t * t * -24);
      const z = Math.round(u * u * 4 + 2 * u * t * -24 + t * t * -20);

      for (let w = -2; w <= 2; w++) {
        asphalt.push({ x: x + w, y: 0.05, z });
      }

      const isRed = (curbIndex++) % 2 === 0;
      if (isRed) {
        curbRed.push({ x: x, y: 0.25, z: z - 3 });
      } else {
        curbWhite.push({ x: x, y: 0.25, z: z - 3 });
      }

      // Perimeter tire barrier on turn
      if (t > 0.4 && t < 0.8) {
        tires.push({ x, y: 0.5, z: z - 5 });
        tires.push({ x, y: 1.5, z: z - 5 });
      }
    }

    // Remove duplicates
    const uniqueBlocks = (arr: Array<{ x: number; y: number; z: number }>) => {
      const seen = new Set<string>();
      return arr.filter((b) => {
        const key = `${b.x},${b.y},${b.z}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    return {
      asphalt: uniqueBlocks(asphalt),
      curbRed: uniqueBlocks(curbRed),
      curbWhite: uniqueBlocks(curbWhite),
      tires: uniqueBlocks(tires),
      pitWall: uniqueBlocks(pitWall),
    };
  }, []);

  // Update InstancedMesh matrices
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    if (asphaltRef.current) {
      circuitBlocks.asphalt.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z);
        dummy.updateMatrix();
        asphaltRef.current!.setMatrixAt(i, dummy.matrix);
      });
      asphaltRef.current.instanceMatrix.needsUpdate = true;
    }

    if (curbRedRef.current) {
      circuitBlocks.curbRed.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z);
        dummy.updateMatrix();
        curbRedRef.current!.setMatrixAt(i, dummy.matrix);
      });
      curbRedRef.current.instanceMatrix.needsUpdate = true;
    }

    if (curbWhiteRef.current) {
      circuitBlocks.curbWhite.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z);
        dummy.updateMatrix();
        curbWhiteRef.current!.setMatrixAt(i, dummy.matrix);
      });
      curbWhiteRef.current.instanceMatrix.needsUpdate = true;
    }

    if (tireRef.current) {
      circuitBlocks.tires.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z);
        dummy.updateMatrix();
        tireRef.current!.setMatrixAt(i, dummy.matrix);
      });
      tireRef.current.instanceMatrix.needsUpdate = true;
    }

    if (pitWallRef.current) {
      circuitBlocks.pitWall.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z);
        dummy.updateMatrix();
        pitWallRef.current!.setMatrixAt(i, dummy.matrix);
      });
      pitWallRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [circuitBlocks]);

  const asphaltMat = useMemo(() => getVoxelMaterial("asphalt"), []);
  const curbRedMat = useMemo(() => getVoxelMaterial("curb_red"), []);
  const curbWhiteMat = useMemo(() => getVoxelMaterial("curb_white"), []);
  const tireMat = useMemo(() => getVoxelMaterial("tire_black"), []);
  const pitWallMat = useMemo(() => getVoxelMaterial("stone_bricks"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("oak_planks"), []);

  return (
    <group>
      {/* 1. Track Asphalt Voxels */}
      <instancedMesh
        ref={asphaltRef}
        args={[undefined, asphaltMat, circuitBlocks.asphalt.length]}
        receiveShadow
      >
        <boxGeometry args={[1.0, 0.1, 1.0]} />
      </instancedMesh>

      {/* 2. Red Curb Voxels */}
      <instancedMesh
        ref={curbRedRef}
        args={[undefined, curbRedMat, circuitBlocks.curbRed.length]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.0, 0.4, 1.0]} />
      </instancedMesh>

      {/* 3. White Curb Voxels */}
      <instancedMesh
        ref={curbWhiteRef}
        args={[undefined, curbWhiteMat, circuitBlocks.curbWhite.length]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.0, 0.4, 1.0]} />
      </instancedMesh>

      {/* 4. Tire Barrier Blocks */}
      <instancedMesh
        ref={tireRef}
        args={[undefined, tireMat, circuitBlocks.tires.length]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.0, 1.0, 1.0]} />
      </instancedMesh>

      {/* 5. Pit Wall Blocks (Stone Bricks) */}
      <instancedMesh
        ref={pitWallRef}
        args={[undefined, pitWallMat, circuitBlocks.pitWall.length]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.0, 1.0, 1.0]} />
      </instancedMesh>

      {/* 6. Checkered Start/Finish Line at x = -24, z = -2 */}
      {[-2, -1, 0, 1, 2].map((w) => (
        <group key={w} position={[-24 + w, 0.11, -2]}>
          <mesh position={[0, 0, -0.25]}>
            <planeGeometry args={[1.0, 0.5]} />
            <meshBasicMaterial color={w % 2 === 0 ? "#ffffff" : "#1a1a1a"} />
          </mesh>
          <mesh position={[0, 0, 0.25]}>
            <planeGeometry args={[1.0, 0.5]} />
            <meshBasicMaterial color={w % 2 === 0 ? "#1a1a1a" : "#ffffff"} />
          </mesh>
        </group>
      ))}

      {/* 7. Start/Finish Timing Gantry (Block Arch over Main Straight) */}
      <group position={[-24, 0, -2]}>
        {/* Left Pillar (x = -3, 6 blocks high) */}
        {[1, 2, 3, 4, 5, 6].map((y) => (
          <mesh key={y} position={[-3.5, y - 0.5, 0]} castShadow>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
            <primitive object={pitWallMat} attach="material" />
          </mesh>
        ))}
        {/* Right Pillar (x = +3, 6 blocks high) */}
        {[1, 2, 3, 4, 5, 6].map((y) => (
          <mesh key={y} position={[3.5, y - 0.5, 0]} castShadow>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
            <primitive object={pitWallMat} attach="material" />
          </mesh>
        ))}
        {/* Overhead Crossbeam (7 blocks across at y = 6.5) */}
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <mesh key={x} position={[x, 6.0, 0]} castShadow>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
            <primitive object={pitWallMat} attach="material" />
          </mesh>
        ))}
        {/* Red Timing Lights (5 glowing blocks) */}
        {[-2, -1, 0, 1, 2].map((x) => (
          <mesh key={x} position={[x, 5.0, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={2.5}
            />
          </mesh>
        ))}
      </group>

      {/* 8. Voxel Grandstand (Stepped Oak Bleachers facing Main Straight at x = -30) */}
      <group position={[-30, 0, -5]}>
        {/* Tier 1 (1 block high) */}
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((z) => (
          <mesh key={`t1_${z}`} position={[0, 0.5, z]} castShadow>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
            <primitive object={oakPlankMat} attach="material" />
          </mesh>
        ))}
        {/* Tier 2 (2 blocks high) */}
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((z) => (
          <mesh key={`t2_${z}`} position={[-1, 1.5, z]} castShadow>
            <boxGeometry args={[1.0, 2.0, 1.0]} />
            <primitive object={oakPlankMat} attach="material" />
          </mesh>
        ))}
        {/* Tier 3 (3 blocks high) */}
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((z) => (
          <mesh key={`t3_${z}`} position={[-2, 2.5, z]} castShadow>
            <boxGeometry args={[1.0, 3.0, 1.0]} />
            <primitive object={oakPlankMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 9. Turn 1 Brake Marker Boards (150m, 100m, 50m) */}
      {[
        { dist: "150", z: 6 },
        { dist: "100", z: 10 },
        { dist: "50", z: 14 },
      ].map((b) => (
        <group key={b.dist} position={[-21.2, 0, b.z]}>
          {/* Post */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Board */}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[0.15, 0.6, 0.8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Black Text Marker Face */}
          <mesh position={[-0.09, 1.3, 0]}>
            <boxGeometry args={[0.02, 0.45, 0.65]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}

      {/* 10. DRS Detection Line on Main Straight (Green Dashed Line) */}
      {[-2, -1, 0, 1, 2].map((w) => (
        <mesh key={`drs_${w}`} position={[-24 + w, 0.11, -12]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      ))}
    </group>
  );
};

"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { getVoxelMaterial } from "@/lib/voxelTextures";
import { VoxelGadget } from "./VoxelGadget";

interface FirstPersonHandProps {
  activeSlot: number;
  isMoving: boolean;
  isSprinting: boolean;
}

export const FirstPersonHand: React.FC<FirstPersonHandProps> = ({
  activeSlot,
  isMoving,
  isSprinting,
}) => {
  const { camera } = useThree();
  const handGroupRef = useRef<THREE.Group>(null);
  const bobPhase = useRef(0);
  const prevSlot = useRef(activeSlot);
  const equipProgress = useRef(1); // 0 (hidden) to 1 (equipped)

  const jacketMat = getVoxelMaterial("chrome_carbon");
  const skinMat = getVoxelMaterial("steve_skin");
  const cuffMat = getVoxelMaterial("chrome_red");

  useFrame((_, delta) => {
    if (!handGroupRef.current) return;

    // Equip transition when switching hotbar slots
    if (prevSlot.current !== activeSlot) {
      prevSlot.current = activeSlot;
      equipProgress.current = 0; // trigger swing-up animation
    }

    if (equipProgress.current < 1) {
      equipProgress.current = Math.min(1, equipProgress.current + delta * 6);
    }

    // Walking / Running bobbing
    if (isMoving) {
      const bobSpeed = isSprinting ? 14 : 9;
      bobPhase.current += delta * bobSpeed;
    } else {
      // Gentle idle breathing
      bobPhase.current += delta * 1.8;
    }

    const bobX = Math.cos(bobPhase.current) * (isMoving ? 0.016 : 0.002);
    const bobY = -Math.abs(Math.sin(bobPhase.current)) * (isMoving ? 0.022 : 0.003);

    // Equip dip
    const equipDipY = (1 - equipProgress.current) * -0.25;

    // Transform hand into camera coordinate space
    const localOffset = new THREE.Vector3(0.32 + bobX, -0.28 + bobY + equipDipY, -0.48);
    const worldPos = localOffset.applyMatrix4(camera.matrixWorld);

    handGroupRef.current.position.copy(worldPos);
    handGroupRef.current.quaternion.copy(camera.quaternion);
    handGroupRef.current.rotateX(0.15 + (1 - equipProgress.current) * 0.4);
    handGroupRef.current.rotateY(-0.25);
    handGroupRef.current.rotateZ(0.12 + bobX * 1.5);
  });

  return (
    <group ref={handGroupRef}>
      {/* Sleeve / Arm */}
      <mesh position={[0, -0.15, 0.12]} rotation={[0.4, 0, -0.1]} castShadow>
        <boxGeometry args={[0.13, 0.38, 0.13]} />
        <primitive object={jacketMat} attach="material" />
      </mesh>

      {/* Papaya Tech Cuff */}
      <mesh position={[0, 0.02, 0.06]} rotation={[0.4, 0, -0.1]}>
        <boxGeometry args={[0.135, 0.03, 0.135]} />
        <primitive object={cuffMat} attach="material" />
      </mesh>

      {/* Voxel Hand */}
      <mesh position={[0, 0.08, 0.03]} castShadow>
        <boxGeometry args={[0.11, 0.1, 0.11]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* Held Physical Technical Gadget */}
      <group position={[0, 0.14, -0.06]} rotation={[-0.2, 0.2, 0]}>
        <VoxelGadget slotIndex={activeSlot} scale={0.7} />
      </group>
    </group>
  );
};

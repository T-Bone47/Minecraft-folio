"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { getVoxelMaterial } from "@/lib/voxelTextures";

interface VoxelEngineerAvatarProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Subtle idle pose offset for the landing-scene presentation. */
  idlePose?: boolean;
}

export const VoxelEngineerAvatar: React.FC<VoxelEngineerAvatarProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  idlePose = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { reducedMotion } = useWorldStore();

  const graphiteMat = useMemo(() => getVoxelMaterial("avatar_graphite"), []);
  const graphiteLightMat = useMemo(() => getVoxelMaterial("avatar_graphite_light"), []);
  const accentOrangeMat = useMemo(() => getVoxelMaterial("avatar_orange"), []);
  const cyanAccentMat = useMemo(() => getVoxelMaterial("avatar_cyan"), []);
  const trouserMat = useMemo(() => getVoxelMaterial("avatar_trousers"), []);
  const bootMat = useMemo(() => getVoxelMaterial("avatar_boots"), []);
  const skinMat = useMemo(() => getVoxelMaterial("avatar_skin"), []);
  const headsetMat = useMemo(() => getVoxelMaterial("avatar_headset"), []);
  const tabletMat = useMemo(() => getVoxelMaterial("avatar_tablet"), []);
  const badgeMat = useMemo(() => getVoxelMaterial("avatar_badge"), []);

  // Very subtle breathing/weight shift for a lived-in engineering presence.
  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      const t = state.clock.getElapsedTime();
      const breathe = Math.sin(t * 2.2) * 0.004;
      const sway = Math.sin(t * 0.9) * 0.005;
      groupRef.current.position.y = position[1] + breathe;
      groupRef.current.rotation.z = sway * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* =========================================================
          1. LEGS & BOOTS
          ========================================================= */}
      {/* Left leg (dark technical trousers) */}
      <mesh position={[-0.28, 0.45, 0]} castShadow>
        <boxGeometry args={[0.34, 0.55, 0.34]} />
        <primitive object={trouserMat} attach="material" />
      </mesh>
      {/* Right leg (dark technical trousers) */}
      <mesh position={[0.28, 0.45, 0]} castShadow>
        <boxGeometry args={[0.34, 0.55, 0.34]} />
        <primitive object={trouserMat} attach="material" />
      </mesh>
      {/* Left boot */}
      <mesh position={[-0.28, 0.12, 0.08]} castShadow>
        <boxGeometry args={[0.32, 0.22, 0.38]} />
        <primitive object={bootMat} attach="material" />
      </mesh>
      {/* Right boot */}
      <mesh position={[0.28, 0.12, 0.08]} castShadow>
        <boxGeometry args={[0.32, 0.22, 0.38]} />
        <primitive object={bootMat} attach="material" />
      </mesh>

      {/* =========================================================
          2. TORSO — dark graphite engineering jacket
          ========================================================= */}
      {/* Main jacket body */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.88, 0.46]} />
        <primitive object={graphiteMat} attach="material" />
      </mesh>

      {/* Left jacket panel (accent orange technical stripe) */}
      <mesh position={[-0.42, 1.05, 0]} castShadow>
        <boxGeometry args={[0.16, 0.6, 0.04]} />
        <primitive object={accentOrangeMat} attach="material" />
      </mesh>
      {/* Right jacket panel (accent orange technical stripe) */}
      <mesh position={[0.42, 1.05, 0]} castShadow>
        <boxGeometry args={[0.16, 0.6, 0.04]} />
        <primitive object={accentOrangeMat} attach="material" />
      </mesh>

      {/* Jacket collar / neckline */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.32]} />
        <primitive object={graphiteLightMat} attach="material" />
      </mesh>

      {/* Tool pocket / utility strip on front (cyan detail) */}
      <mesh position={[0, 0.85, 0.24]} castShadow>
        <boxGeometry args={[0.22, 0.1, 0.02]} />
        <primitive object={cyanAccentMat} attach="material" />
      </mesh>

      {/* Engineer badge / ID panel on chest */}
      <mesh position={[0, 1.15, 0.24]} castShadow>
        <boxGeometry args={[0.18, 0.14, 0.02]} />
        <primitive object={badgeMat} attach="material" />
      </mesh>

      {/* =========================================================
          3. ARMS
          ========================================================= */}
      {/* Left upper arm */}
      <mesh position={[-0.54, 1.25, 0.02]} castShadow>
        <boxGeometry args={[0.22, 0.42, 0.22]} />
        <primitive object={graphiteMat} attach="material" />
      </mesh>
      {/* Left forearm (angled slightly toward tablet) */}
      <mesh position={[-0.68, 0.95, 0.18]} castShadow>
        <boxGeometry args={[0.2, 0.38, 0.2]} />
        <primitive object={graphiteLightMat} attach="material" />
      </mesh>

      {/* Right upper arm */}
      <mesh position={[0.54, 1.25, -0.02]} castShadow>
        <boxGeometry args={[0.22, 0.42, 0.22]} />
        <primitive object={graphiteMat} attach="material" />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.66, 0.98, -0.14]} castShadow>
        <boxGeometry args={[0.2, 0.36, 0.2]} />
        <primitive object={graphiteLightMat} attach="material" />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.66, 0.74, 0.22]} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      <mesh position={[0.64, 0.78, -0.16]} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* =========================================================
          4. HEAD, FACE & HEADSET
          ========================================================= */}
      {/* Neck */}
      <mesh position={[0, 1.68, 0]} castShadow>
        <boxGeometry args={[0.22, 0.12, 0.2]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.44, 0.44]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* Vertex-style face detail: subtle beard/edge shadow */}
      <mesh position={[0, 1.86, 0.22]}>
        <boxGeometry args={[0.34, 0.06, 0.02]} />
        <primitive object={graphiteLightMat} attach="material" />
      </mesh>

      {/* Hair / cap brim (subtle dark engineering cap band) */}
      <mesh position={[0, 2.14, 0]} castShadow>
        <boxGeometry args={[0.46, 0.06, 0.46]} />
        <primitive object={graphiteMat} attach="material" />
      </mesh>
      {/* Cap accent stripe */}
      <mesh position={[0, 2.16, 0]} castShadow>
        <boxGeometry args={[0.46, 0.02, 0.1]} />
        <primitive object={accentOrangeMat} attach="material" />
      </mesh>

      {/* Communication headset earpiece — left */}
      <mesh position={[-0.34, 1.94, 0.08]} castShadow>
        <boxGeometry args={[0.1, 0.14, 0.12]} />
        <primitive object={headsetMat} attach="material" />
      </mesh>
      {/* Communication headset earpiece — right */}
      <mesh position={[0.34, 1.94, 0.08]} castShadow>
        <boxGeometry args={[0.1, 0.14, 0.12]} />
        <primitive object={headsetMat} attach="material" />
      </mesh>
      {/* Headset headband */}
      <mesh position={[0, 2.04, 0.06]} castShadow>
        <boxGeometry args={[0.44, 0.06, 0.06]} />
        <primitive object={headsetMat} attach="material" />
      </mesh>

      {/* =========================================================
          5. ENGINEERING TABLET / DIAGNOSTIC TOOL (right hand side)
          ========================================================= */}
      {/* Tablet body */}
      <mesh position={[0.74, 0.78, -0.18]} castShadow>
        <boxGeometry args={[0.3, 0.42, 0.06]} />
        <primitive object={tabletMat} attach="material" />
      </mesh>
      {/* Tablet screen */}
      <mesh position={[0.74, 0.78, -0.22]}>
        <boxGeometry args={[0.24, 0.34, 0.01]} />
        <meshStandardMaterial
          color="#0b1b2a"
          emissive="#0b1b2a"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Cyan status LED on tablet edge */}
      <mesh position={[0.86, 0.94, -0.22]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* =========================================================
          6. IDLE POSE OFFSET — lean toward tablet for presentation
          ========================================================= */}
      {idlePose && (
        <>
          {/* Tilt the whole figure slightly toward the tablet side.
              Kept tiny so the silhouette stays readable. */}
          <group position={[0.02, 0, 0]} rotation={[0, 0, 0.06]}>
            {/* Reinforce tablet forward in the pose */}
            <mesh position={[0.78, 0.78, -0.26]} castShadow>
              <boxGeometry args={[0.04, 0.04, 0.04]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
};

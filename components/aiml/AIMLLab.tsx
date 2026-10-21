"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import {
  getVoxelMaterial,
  getVoxelSignMaterial,
  getEAFCCardMaterial,
  getEAFCLedMaterial,
} from "@/lib/voxelTextures";
import { worldSound } from "@/lib/audio";

interface AIMLLabProps {
  position?: [number, number, number];
}

interface ShotStats {
  speed: number;
  xg: number;
  curl: number;
  target: string;
}

export const AIMLLab: React.FC<AIMLLabProps> = ({
  position = [0, 0, 24],
}) => {
  const { inspectProject, reducedMotion } = useWorldStore();
  const { registerObject, unregisterObject, openStationModal } = useInteractionRegistry();

  const groupRef = useRef<THREE.Group>(null);
  const ballMeshRef = useRef<THREE.Mesh>(null);
  const neuralSpireRef = useRef<THREE.Mesh>(null);

  // Ball Kick Animation State
  const [kickState, setKickState] = useState<{
    kicking: boolean;
    startTime: number;
    stats: ShotStats;
  }>({
    kicking: false,
    startTime: 0,
    stats: {
      speed: 104.8,
      xg: 0.86,
      curl: 14.2,
      target: "TOP RIGHT CORNER",
    },
  });

  const triggerBallKick = () => {
    worldSound.playBallKick();
    const speed = +(98 + Math.random() * 16).toFixed(1);
    const xg = +(0.78 + Math.random() * 0.18).toFixed(2);
    const curl = +(12 + Math.random() * 5).toFixed(1);
    const target = Math.random() > 0.5 ? "TOP RIGHT CORNER" : "TOP LEFT CORNER";

    setKickState({
      kicking: true,
      startTime: performance.now() / 1000,
      stats: { speed, xg, curl, target },
    });
  };

  // Register interactive terminals & kickable match ball
  useEffect(() => {
    // 1. Kickable EA FC Match Ball on Penalty Spot (world z ≈ 18)
    registerObject({
      id: "eafc_ball",
      type: "station",
      label: "EA FC Match Ball",
      sublabel: "Interactive Shot Physics & Trajectory Analytics",
      actionPrompt: "[E] KICK FOOTBALL // SHOT ANALYTICS",
      position: [position[0], position[1] + 0.3, position[2] - 6],
      boundsRadius: 3.5,
      projectSlug: "ea-fc-intelligence",
      facilityId: "aiml",
      onInteract: () => {
        triggerBallKick();
      },
    });

    // 2. EA FC Tactical Vector Dugout Station
    registerObject({
      id: "eafc_tactical_board",
      type: "station",
      label: "EA FC Tactical Vector Dugout",
      sublabel: "128D Player Embedding & Cosine Similarity Matrix",
      actionPrompt: "[E] OPEN VECTOR SCOUT MATRIX",
      position: [position[0] - 7.6, position[1] + 0.7, position[2] - 6],
      boundsRadius: 4.5,
      projectSlug: "ea-fc-intelligence",
      facilityId: "aiml",
      onInteract: () => {
        worldSound.playInspectChime();
        openStationModal("eafc_scout");
      },
    });

    // 3. EA FC Player Vector Intelligence Terminal (East Wing / Left)
    registerObject({
      id: "eafc_terminal",
      type: "terminal",
      label: "EA FC Player Intelligence Terminal",
      sublabel: "Player Representation Vectors & Recommendation Pipeline",
      actionPrompt: "[E] INSPECT EA FC INTELLIGENCE",
      position: [position[0] - 4.5, position[1] + 1.2, position[2] - 1.5],
      boundsRadius: 5.5,
      projectSlug: "ea-fc-intelligence",
      facilityId: "aiml",
      onInteract: () => {
        worldSound.playInspectChime();
        inspectProject("ea-fc-intelligence");
      },
    });

    // 4. VyaparPulse Forecasting Terminal (West Wing / Right)
    registerObject({
      id: "vyaparpulse_terminal",
      type: "terminal",
      label: "VyaparPulse Voice Ledger Terminal",
      sublabel: "Vosk Offline STT & XGBoost Revenue Forecasting",
      actionPrompt: "[E] INSPECT VYAPARPULSE PIPELINE",
      position: [position[0] + 4.5, position[1] + 1.2, position[2] - 1.5],
      boundsRadius: 5.5,
      projectSlug: "vyaparpulse",
      facilityId: "aiml",
      onInteract: () => {
        worldSound.playInspectChime();
        inspectProject("vyaparpulse");
      },
    });

    return () => {
      unregisterObject("eafc_ball");
      unregisterObject("eafc_tactical_board");
      unregisterObject("eafc_terminal");
      unregisterObject("vyaparpulse_terminal");
    };
  }, [position, registerObject, unregisterObject, inspectProject, openStationModal]);

  // Materials
  const stoneBrickMat = useMemo(() => getVoxelMaterial("stone_bricks"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("oak_planks"), []);
  const pitchLightMat = useMemo(() => getVoxelMaterial("pitch_grass_light"), []);
  const pitchDarkMat = useMemo(() => getVoxelMaterial("pitch_grass_dark"), []);
  const pitchLineMat = useMemo(() => getVoxelMaterial("pitch_line"), []);
  const footballMat = useMemo(() => getVoxelMaterial("football_leather"), []);
  const eafcCardMat = useMemo(() => getEAFCCardMaterial(), []);
  const eafcLedMat = useMemo(() => getEAFCLedMaterial(), []);
  const monitorMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);
  const signMat = useMemo(
    () => getVoxelSignMaterial("EA FC & AI LAB", "FOOTBALL & DATA INTELLIGENCE"),
    []
  );
  const netMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      }),
    []
  );
  const floodlightMat = useMemo(
    () =>
      getVoxelMaterial("glowstone", {
        emissive: new THREE.Color("#f8fafc"),
        emissiveIntensity: 2.5,
      }),
    []
  );

  // Ball Kick Trajectory Animation Loop
  useFrame((state) => {
    // 1. Spire pulsing beacon
    if (neuralSpireRef.current && !reducedMotion) {
      const t = state.clock.getElapsedTime();
      const pulse = 0.8 + 0.6 * Math.sin(t * 4);
      if (neuralSpireRef.current.material && "emissiveIntensity" in neuralSpireRef.current.material) {
        (neuralSpireRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 2.0;
      }
    }

    // 2. Ball flight physics
    if (ballMeshRef.current) {
      if (kickState.kicking) {
        const now = state.clock.getElapsedTime();
        const elapsed = now - kickState.startTime;

        if (elapsed < 0.95) {
          // Trajectory towards top corner
          const t = elapsed / 0.95;
          const targetX = kickState.stats.target.includes("RIGHT") ? 1.6 : -1.6;
          // Curving parabola
          const currentX = THREE.MathUtils.lerp(0, targetX, t) + Math.sin(t * Math.PI) * 0.4;
          const currentY = 0.28 + Math.sin(t * Math.PI) * 2.1;
          const currentZ = THREE.MathUtils.lerp(-6, -1.8, t);

          ballMeshRef.current.position.set(currentX, currentY, currentZ);
          ballMeshRef.current.rotation.x += 0.45;
          ballMeshRef.current.rotation.z += 0.25;
        } else if (elapsed < 3.2) {
          // Resting in net
          const targetX = kickState.stats.target.includes("RIGHT") ? 1.6 : -1.6;
          ballMeshRef.current.position.set(targetX, 0.45, -1.8);
        } else {
          // Reset ball to penalty spot
          ballMeshRef.current.position.set(0, 0.28, -6);
          ballMeshRef.current.rotation.set(0, 0, 0);
          setKickState((prev) => ({ ...prev, kicking: false }));
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ======================================================== */}
      {/* 1. REGULATION FOOTBALL TRAINING PITCH (Mowing Stripes)    */}
      {/* ======================================================== */}
      <group position={[0, 0.05, -6]}>
        {/* Alternating 1.8m pitch mowing grass stripes */}
        {[-4, -2, 0, 2, 4].map((offset, i) => (
          <mesh
            key={offset}
            position={[0, 0, offset]}
            receiveShadow
          >
            <boxGeometry args={[14, 0.1, 1.8]} />
            <primitive
              object={i % 2 === 0 ? pitchLightMat : pitchDarkMat}
              attach="material"
            />
          </mesh>
        ))}

        {/* Pitch Boundary Chalk Lines (White) */}
        {/* Outer Rect Border */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[14.1, 0.02, 0.12]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.06, 4.9]}>
          <boxGeometry args={[14.1, 0.02, 0.12]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.06, -4.9]}>
          <boxGeometry args={[14.1, 0.02, 0.12]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>
        <mesh position={[-7.0, 0.06, 0]}>
          <boxGeometry args={[0.12, 0.02, 9.9]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>
        <mesh position={[7.0, 0.06, 0]}>
          <boxGeometry args={[0.12, 0.02, 9.9]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>

        {/* Penalty Box (around the goal at z = 4.2 relative to pitch center) */}
        <mesh position={[0, 0.06, 2.5]}>
          <boxGeometry args={[7.0, 0.02, 0.1]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>
        <mesh position={[-3.5, 0.06, 3.7]}>
          <boxGeometry args={[0.1, 0.02, 2.5]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>
        <mesh position={[3.5, 0.06, 3.7]}>
          <boxGeometry args={[0.1, 0.02, 2.5]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>

        {/* Halfway Line & Center Circle (at z = -4.5 relative to pitch) */}
        <mesh position={[0, 0.06, -4.8]}>
          <ringGeometry args={[1.5, 1.62, 32]} />
          <meshBasicMaterial color="#f8fafc" side={THREE.DoubleSide} />
        </mesh>

        {/* Penalty Spot */}
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          <primitive object={pitchLineMat} attach="material" />
        </mesh>

        {/* 4 Corner Flags */}
        {([
          [-6.9, 4.8],
          [6.9, 4.8],
          [-6.9, -4.8],
          [6.9, -4.8],
        ] as const).map(([cx, cz], idx) => (
          <group key={idx} position={[cx, 0, cz]}>
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0.2, 1.4, 0]}>
              <boxGeometry args={[0.4, 0.3, 0.02]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
        ))}

        {/* Pitchside LED Ribbon Boards (Front Edge) */}
        <mesh position={[0, 0.45, -5.1]}>
          <boxGeometry args={[13.8, 0.7, 0.15]} />
          <primitive object={eafcLedMat} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. REGULATION WHITE FOOTBALL GOALPOST & NET (z = -2)      */}
      {/* ======================================================== */}
      <group position={[0, 0, -2]}>
        {/* Left Upright Post */}
        <mesh position={[-2.2, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 2.5, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Right Upright Post */}
        <mesh position={[2.2, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 2.5, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Top Crossbar */}
        <mesh position={[0, 2.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 4.49, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Back Support Posts */}
        <mesh position={[-2.2, 0.6, 1.0]} rotation={[-0.4, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[2.2, 0.6, 1.0]} rotation={[-0.4, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* White Goal Net Mesh */}
        <mesh position={[0, 1.25, 0.6]}>
          <boxGeometry args={[4.4, 2.4, 1.2]} />
          <primitive object={netMat} attach="material" />
        </mesh>

        {/* Live In-World Shot Analytics Display above crossbar */}
        <group position={[0, 3.1, 0]}>
          <mesh>
            <boxGeometry args={[4.6, 0.65, 0.15]} />
            <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <planeGeometry args={[4.4, 0.55]} />
            <meshBasicMaterial color="#022c22" />
          </mesh>
          {/* Glowing HUD Shot Result */}
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[4.2, 0.45]} />
            <meshStandardMaterial
              color={kickState.kicking ? "#10b981" : "#38bdf8"}
              emissive={kickState.kicking ? "#10b981" : "#38bdf8"}
              emissiveIntensity={1.4}
            />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE 3D VOXEL FOOTBALL (Penalty Spot)          */}
      {/* ======================================================== */}
      <mesh
        ref={ballMeshRef}
        position={[0, 0.28, -6]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          triggerBallKick();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.32, 16, 16]} />
        <primitive object={footballMat} attach="material" />
      </mesh>

      {/* ======================================================== */}
      {/* 4. STADIUM FLOODLIGHT TOWERS                             */}
      {/* ======================================================== */}
      {([
        [-7.5, -2],
        [7.5, -2],
      ] as const).map(([fx, fz], idx) => (
        <group key={idx} position={[fx, 0, fz]}>
          {/* Truss Column */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <boxGeometry args={[0.4, 6.4, 0.4]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Angled Floodlight Head Array */}
          <group position={[0, 6.5, 0]} rotation={[0.4, fx < 0 ? 0.3 : -0.3, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.8, 1.2, 0.4]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Glowing Lamp Cluster */}
            <mesh position={[0, 0, -0.21]}>
              <boxGeometry args={[1.6, 1.0, 0.05]} />
              <primitive object={floodlightMat} attach="material" />
            </mesh>
          </group>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 5. TEAM DUGOUT BENCH (Sideline at x = -7.6)              */}
      {/* ======================================================== */}
      <group position={[-7.6, 0, -6]}>
        {/* Canopy Cover */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[1.4, 0.1, 3.6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Bench Seats */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 3.2]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Tactical iPad Display */}
        <mesh position={[0.1, 0.7, 0]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.35, 0.25, 0.04]} />
          <primitive object={monitorMat} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. GIANT STADIUM JUMBOTRON (EA FC 91 OVR GOLD CARD)      */}
      {/* ======================================================== */}
      <group position={[0, 7.8, 1.5]}>
        {/* Steel Gantry Frame */}
        <mesh castShadow>
          <boxGeometry args={[5.6, 7.8, 0.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* The Authentic EA FC Ultimate Team Gold Card Screen (facing North toward pitch) */}
        <mesh position={[0, 0, -0.32]}>
          <planeGeometry args={[5.2, 7.4]} />
          <primitive object={eafcCardMat} attach="material" />
        </mesh>
        {/* Top Stadium Beacon */}
        <mesh position={[0, 4.1, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.4]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 7. MAIN AI / DATA LAB FACILITY ARCHITECTURE              */}
      {/* ======================================================== */}
      {/* Base Foundation (16x10 blocks) */}
      <mesh position={[0, 0.25, 4.0]} receiveShadow>
        <boxGeometry args={[16, 0.5, 8]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Central Neural Atrium & Server Block */}
      <mesh position={[0, 2.5, 4.0]} castShadow receiveShadow>
        <boxGeometry args={[6, 4.0, 7.5]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Front North Glass Observation Window */}
      <mesh position={[0, 2.6, 0.2]} castShadow>
        <boxGeometry args={[4.5, 2.2, 0.2]} />
        <primitive object={getVoxelMaterial("glass", { transparent: true, opacity: 0.65 })} attach="material" />
      </mesh>

      {/* Left Wing: EA FC Intelligence Wing (x = -5.5) */}
      <group
        position={[-5.5, 2.0, 4.0]}
        onClick={(e) => {
          e.stopPropagation();
          inspectProject("ea-fc-intelligence");
        }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 3.5, 7.0]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        {/* Front window */}
        <mesh position={[0, 0.2, -3.55]} castShadow>
          <boxGeometry args={[3.8, 1.8, 0.2]} />
          <primitive object={getVoxelMaterial("glass", { transparent: true, opacity: 0.65 })} attach="material" />
        </mesh>
        {/* Interior EA FC Vector Display */}
        <mesh position={[0, 0.2, -3.4]}>
          <planeGeometry args={[3.2, 1.4]} />
          <meshBasicMaterial color="#7c3aed" />
        </mesh>
      </group>

      {/* Right Wing: VyaparPulse Intelligence Wing (x = +5.5) */}
      <group
        position={[5.5, 2.0, 4.0]}
        onClick={(e) => {
          e.stopPropagation();
          inspectProject("vyaparpulse");
        }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 3.5, 7.0]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        {/* Front window */}
        <mesh position={[0, 0.2, -3.55]} castShadow>
          <boxGeometry args={[3.8, 1.8, 0.2]} />
          <primitive object={getVoxelMaterial("glass", { transparent: true, opacity: 0.65 })} attach="material" />
        </mesh>
        {/* Interior VyaparPulse Voice / Forecast Pipeline Display */}
        <mesh position={[0, 0.2, -3.4]}>
          <planeGeometry args={[3.2, 1.4]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* Physical Minecraft Sign: [ EA FC & AI LAB / FOOTBALL & DATA INTELLIGENCE ] */}
      <group position={[0, 2.0, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[6.8, 1.0, 0.2]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, -0.11]}>
          <planeGeometry args={[6.6, 0.9]} />
          <primitive object={signMat} attach="material" />
        </mesh>
        <mesh position={[-3.1, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[3.1, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
      </group>

      {/* Interactive EA FC Terminal (Left / North Entrance) */}
      <group
        position={[-4.5, 0, -1.5]}
        onClick={(e) => {
          e.stopPropagation();
          inspectProject("ea-fc-intelligence");
        }}
      >
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.9]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.65, 0.2]} />
          <primitive object={monitorMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* Interactive VyaparPulse Terminal (Right / North Entrance) */}
      <group
        position={[4.5, 0, -1.5]}
        onClick={(e) => {
          e.stopPropagation();
          inspectProject("vyaparpulse");
        }}
      >
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.9]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.65, 0.2]} />
          <primitive object={monitorMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.8} />
        </mesh>
      </group>
    </group>
  );
};

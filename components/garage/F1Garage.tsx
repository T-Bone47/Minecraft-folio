"use client";
import { chromeEra } from "@/data/chromeEra";


import { ChromeGarageFitout } from "@/components/theme/ChromeCampusDetails";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VoxelF1Car } from "../vehicles/VoxelF1Car";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { getVoxelMaterial, getVoxelSignMaterial } from "@/lib/voxelTextures";
import { worldSound } from "@/lib/audio";

interface F1GarageProps {
  position?: [number, number, number];
}

export const F1Garage: React.FC<F1GarageProps> = ({ position = [-12, 0, -8] }) => {
  const { inspectProject, activeProject, mode, reducedMotion } = useWorldStore();
  const { registerObject, unregisterObject, openStationModal } = useInteractionRegistry();
  const groupRef = useRef<THREE.Group>(null);
  const strategyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const strategyTexRef = useRef<THREE.CanvasTexture | null>(null);

  const [isInsideGarage, setIsInsideGarage] = useState(false);

  // Register interactive stations in the garage
  useEffect(() => {
    // 1. Single-Seater F1 Car — Test Drive or Chassis Inspection
    registerObject({
      id: "garage_f1_car",
      type: "vehicle",
      label: "Frontier-01 / modernised Chrome Era",
      sublabel: "Inspect the chassis, then drive a timed engineering lap",
      actionPrompt: "[E] INSPECT / DRIVE FRONTIER-01",
      position: [position[0], position[1] + 0.6, position[2]],
      boundsRadius: 5.5,
      projectSlug: "racemind-ai",
      facilityId: "garage",
      onInteract: () => {
        worldSound.playInspectChime();
        openStationModal("f1_car_inspect");
      },
    });

    // 2. Race Engineer Strategy Board
    registerObject({
      id: "garage_strategy_board",
      type: "station",
      label: "Race Strategy Terminal Wall",
      sublabel: "Stint Degradation & Pit Window Strategy",
      actionPrompt: "[E] INSPECT STRATEGY BOARD (DEMO)",
      position: [position[0], position[1] + 1.4, position[2] - 6.2],
      boundsRadius: 5.0,
      projectSlug: "racemind-ai",
      facilityId: "garage",
      onInteract: () => {
        worldSound.playInspectChime();
        openStationModal("strategy_board");
      },
    });

    // 3. AI Race Engineer Terminal
    registerObject({
      id: "garage_ai_engineer",
      type: "terminal",
      label: "AI Race Engineer Terminal",
      sublabel: "Real-time Contextual Telemetry Reasoning Core",
      actionPrompt: "[E] CONSULT AI RACE ENGINEER",
      position: [position[0] + 3.2, position[1] + 1.2, position[2] + 2.5],
      boundsRadius: 4.5,
      projectSlug: "racemind-ai",
      facilityId: "garage",
      onInteract: () => {
        worldSound.playInspectChime();
        openStationModal("ai_engineer");
      },
    });

    // 4. Team Operations & Race Manager Bridge Terminal
    registerObject({
      id: "garage_race_manager",
      type: "terminal",
      label: "F1 Race Manager Operations Bridge",
      sublabel: "F1 Team Strategy & Simulation Game Architecture",
      actionPrompt: "[E] INSPECT F1 RACE MANAGER",
      position: [position[0] - 3.2, position[1] + 1.2, position[2] + 2.5],
      boundsRadius: 4.5,
      projectSlug: "f1-race-manager",
      facilityId: "garage",
      onInteract: () => {
        worldSound.playInspectChime();
        inspectProject("f1-race-manager");
      },
    });

    return () => {
      unregisterObject("garage_f1_car");
      unregisterObject("garage_strategy_board");
      unregisterObject("garage_ai_engineer");
      unregisterObject("garage_race_manager");
    };
  }, [position, registerObject, unregisterObject, inspectProject, openStationModal]);

  // Strategy monitor canvas texture
  const strategyScreenMaterial = useMemo(() => {
    if (typeof document === "undefined") {
      return getVoxelMaterial("monitor_screen");
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    strategyCanvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    strategyTexRef.current = tex;

    return new THREE.MeshBasicMaterial({ map: tex });
  }, []);

  // Frame update for strategy board animations
  useFrame((state) => {
    const camPos = state.camera.position;
    const dist = Math.hypot(camPos.x - position[0], camPos.z - position[2]);
    const inside = dist < 12;
    if (inside !== isInsideGarage) {
      setIsInsideGarage(inside);
    }

    if (strategyCanvasRef.current && strategyTexRef.current && !reducedMotion) {
      const ctx = strategyCanvasRef.current.getContext("2d");
      const t = state.clock.getElapsedTime();
      if (ctx) {
        ctx.fillStyle = "#0c121e";
        ctx.fillRect(0, 0, 256, 128);

        ctx.font = "bold 9px monospace";
        ctx.fillStyle = inside ? "#f59e0b" : "#64748b";
        ctx.fillText("RACEMIND STRATEGY CORE", 8, 14);

        ctx.font = "8px monospace";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("STINT: 18 LAPS | TYRE: C3 (MED) 64%", 8, 28);
        ctx.fillText("PIT WINDOW: LAPS 22-26 | DELTA: +0.34s", 8, 40);

        ctx.fillStyle = "#10b981";
        ctx.fillText("UNDERCUT RISK: LOW | WEATHER: DRY", 8, 52);

        // Degradation curve
        ctx.beginPath();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1.5;
        for (let x = 0; x < 230; x += 4) {
          const deg = (x / 230) * 45 + Math.sin(x * 0.1 - t * 2) * 2;
          const y = 64 + deg;
          if (x === 0) ctx.moveTo(12 + x, y);
          else ctx.lineTo(12 + x, y);
        }
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "7px monospace";
        ctx.fillText("[ILLUSTRATIVE DEMO SESSION]", 8, 120);

        strategyTexRef.current.needsUpdate = true;
      }
    }
  });

  const stoneBrickMat = useMemo(() => getVoxelMaterial("chrome_brushed"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("chrome_graphite"), []);
  const glassMat = useMemo(
    () =>
      getVoxelMaterial("chrome_glass", {
        transparent: true,
        opacity: 0.65,
      }),
    []
  );
  const glowstoneMat = useMemo(
    () =>
      getVoxelMaterial("chrome_light", {
        emissive: new THREE.Color(chromeEra.white),
        emissiveIntensity: 1.8,
      }),
    []
  );
  const tireMat = useMemo(() => getVoxelMaterial("tire_black"), []);
  const redMat = useMemo(() => getVoxelMaterial("curb_red"), []);
  const monitorMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);
  const signMat = useMemo(
    () => getVoxelSignMaterial("ASISH RACING DIVISION", "CHROME ERA / MODERNISED SIMULATOR"),
    []
  );

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    inspectProject("racemind-ai");
  };

  return (
    <group
      ref={groupRef}
      position={position}
    >
      <ChromeGarageFitout/>
      {/* 1. Garage Foundation (Stone Brick Floor) */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 16]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Pit Stop Box & Guide Line (Yellow & Red Voxel Markings) */}
      <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 13]} />
        <meshBasicMaterial color={chromeEra.white} />
      </mesh>
      <mesh position={[0, 0.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 5.2]} />
        <meshBasicMaterial color="#D71D35" opacity={0.35} transparent />
      </mesh>

      {/* 2. Rear Wall (Block-built Stone Bricks) */}
      <mesh position={[0, 2.5, -7.5]} castShadow receiveShadow>
        <boxGeometry args={[14, 5.0, 1.0]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 3. Left Wall with Glass Windows */}
      {/* Lower solid base */}
      <mesh position={[-6.5, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 2.0, 16]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>
      {/* Glass block window row */}
      <mesh position={[-6.5, 2.75, 0]} castShadow>
        <boxGeometry args={[0.8, 1.5, 14]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      {/* Upper wall beam */}
      <mesh position={[-6.5, 4.25, 0]} castShadow>
        <boxGeometry args={[1.0, 1.5, 16]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 4. Right Wall with Glass Windows */}
      <mesh position={[6.5, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 2.0, 16]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>
      <mesh position={[6.5, 2.75, 0]} castShadow>
        <boxGeometry args={[0.8, 1.5, 14]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[6.5, 4.25, 0]} castShadow>
        <boxGeometry args={[1.0, 1.5, 16]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 5. Roof Canopy (Block Slab Layer) */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <boxGeometry args={[15, 0.6, 17]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 6. Glowstone Lantern Blocks (Warm Interior Lighting) */}
      {[-3, 3].map((x) =>
        [-4, 0, 4].map((z) => (
          <group key={`glow_${x}_${z}`} position={[x, 4.5, z]}>
            <mesh>
              <boxGeometry args={[2.8, 0.12, 1.1]} />
              <primitive object={glowstoneMat} attach="material" />
            </mesh>
            <pointLight color={chromeEra.white} intensity={0.9} distance={10} />
          </group>
        ))
      )}

      {/* 7. Minecraft Wooden Entrance Sign: [ RACE ENGINEERING / RACEMIND-AI ] */}
      <group position={[0, 4.2, 7.8]}>
        {/* Oak wooden board */}
        <mesh castShadow>
          <boxGeometry args={[7.2, 1.2, 0.3]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        {/* Sign border iron posts */}
        <mesh position={[-3.7, -0.6, 0]} castShadow>
          <boxGeometry args={[0.2, 1.8, 0.2]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[3.7, -0.6, 0]} castShadow>
          <boxGeometry args={[0.2, 1.8, 0.2]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        {/* Text banner plate */}
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[6.8, 0.9]} />
          <primitive attach="material" object={signMat}/>
        </mesh>
      </group>

      {/* 8. Rear Race Engineer Strategy Workstation (Desk + Monitors) */}
      <group position={[0, 0.5, -6.2]}>
        {/* Desk built of wood and stone */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.0, 0.2, 1.6]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        {/* Desk legs */}
        {[-3.6, -1.2, 1.2, 3.6].map((x) => (
          <mesh key={x} position={[x, 0.4, 0]} castShadow>
            <boxGeometry args={[0.3, 0.8, 1.4]} />
            <primitive object={stoneBrickMat} attach="material" />
          </mesh>
        ))}
        {/* 4 Voxel Strategy Monitors */}
        {[-2.5, -0.8, 0.8, 2.5].map((x, i) => (
          <group key={i} position={[x, 1.4, 0.1]}>
            {/* Monitor frame */}
            <mesh castShadow>
              <boxGeometry args={[1.3, 0.8, 0.12]} />
              <primitive object={stoneBrickMat} attach="material" />
            </mesh>
            {/* CRT Screen */}
            <mesh position={[0, 0, 0.07]}>
              <planeGeometry args={[1.15, 0.68]} />
              <primitive object={i === 1 || i === 2 ? strategyScreenMaterial : monitorMat} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 9. Tyre Warming Racks (Left Side) with Voxel Tyres */}
      <group position={[-5.0, 0.5, -1.5]}>
        {/* Wooden / metal rack structure */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.2, 2.4, 4.4]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        {/* Stacked voxel tyre blocks with red tyre warmers */}
        {[-1.2, 0, 1.2].map((z, i) => (
          <group key={i} position={[0, 0.6 + i * 0.75, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.65, 0.9]} />
              <primitive object={tireMat} attach="material" />
            </mesh>
            {/* Red heating blanket */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.92, 0.25, 0.92]} />
              <primitive object={redMat} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 10. High-Pressure Air Tools & Diagnostics Trolley (Right Side) */}
      <group position={[5.2, 0.5, -1.5]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[1.1, 1.8, 2.6]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        {/* Blue nitrogen canisters (voxel style) */}
        {[-0.6, 0.6].map((z) => (
          <mesh key={z} position={[0, 1.5, z]} castShadow>
            <boxGeometry args={[0.4, 1.4, 0.4]} />
            <meshStandardMaterial color="#0284c7" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* 11. CENTRAL SINGLE-SEATER VOXEL F1 CAR */}
      <VoxelF1Car position={[0, 0.55, 0]} rotation={[0, 0, 0]} scale={1.0} />

      {/* 12. Interactive Voxel AI Race Engineer Terminal Station (Right of the car) */}
      <group
        position={[3.2, 0.5, 2.5]}
        onClick={(e) => {
          e.stopPropagation();
          worldSound.playInspectChime();
          openStationModal("ai_engineer");
        }}
      >
        {/* Pedestal block */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.8, 1.0, 0.8]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        {/* Terminal screen block */}
        <mesh position={[0, 1.2, 0]} rotation={[-0.2, -0.4, 0]} castShadow>
          <boxGeometry args={[0.9, 0.6, 0.2]} />
          <primitive object={monitorMat} attach="material" />
        </mesh>
        {/* Glowstone accent indicator */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      </group>

      {/* 12b. Interactive F1 Race Manager Bridge Terminal (Left of the car) */}
      <group
        position={[-3.2, 0.5, 2.5]}
        onClick={(e) => {
          e.stopPropagation();
          worldSound.playInspectChime();
          inspectProject("f1-race-manager");
        }}
      >
        {/* Pedestal block */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.8, 1.0, 0.8]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        {/* Terminal screen block */}
        <mesh position={[0, 1.2, 0]} rotation={[-0.2, 0.4, 0]} castShadow>
          <boxGeometry args={[0.9, 0.6, 0.2]} />
          <primitive object={monitorMat} attach="material" />
        </mesh>
        {/* Amber strategy indicator */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.8} />
        </mesh>
      </group>

    </group>
  );
};

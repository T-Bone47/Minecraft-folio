"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { getVoxelMaterial, getVoxelSignMaterial } from "@/lib/voxelTextures";
import { worldSound } from "@/lib/audio";

interface TelemetryTowerProps {
  position?: [number, number, number];
}

export const TelemetryTower: React.FC<TelemetryTowerProps> = ({
  position = [14, 0, -18],
}) => {
  const { inspectProject, activeProject, mode, reducedMotion } = useWorldStore();
  const { registerObject, unregisterObject } = useInteractionRegistry();
  const beaconRef = useRef<THREE.Mesh>(null);
  const dishClusterRef = useRef<THREE.Group>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTexRef = useRef<THREE.CanvasTexture | null>(null);

  const [isActivated, setIsActivated] = useState(false);

  // Register interactive terminal
  useEffect(() => {
    const terminalPos: [number, number, number] = [
      position[0],
      position[1] + 1.2,
      position[2] + 5.8,
    ];

    registerObject({
      id: "telemetry_terminal",
      type: "terminal",
      label: "Live F1 Telemetry Terminal",
      sublabel: "1,067,193 Canonical Event Stream Gantry",
      actionPrompt: "[E] INSPECT RACE CONTROL TELEMETRY",
      position: terminalPos,
      boundsRadius: 7,
      projectSlug: "live-f1-intelligence",
      facilityId: "telemetry",
      onInteract: () => {
        worldSound.playInspectChime();
        inspectProject("live-f1-intelligence");
      },
    });

    return () => unregisterObject("telemetry_terminal");
  }, [position, registerObject, unregisterObject, inspectProject]);

  // Create dynamic canvas texture for race control timing screen
  const dynamicScreenMaterial = useMemo(() => {
    if (typeof document === "undefined") {
      return getVoxelMaterial("monitor_screen");
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    screenCanvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    screenTexRef.current = tex;

    return new THREE.MeshBasicMaterial({ map: tex });
  }, []);

  const stoneBrickMat = useMemo(() => getVoxelMaterial("stone_bricks"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("oak_planks"), []);
  const signMat = useMemo(
    () => getVoxelSignMaterial("TELEMETRY TOWER", "LIVE F1 INTELLIGENCE"),
    []
  );
  const glassMat = useMemo(
    () =>
      getVoxelMaterial("glass", {
        transparent: true,
        opacity: 0.65,
      }),
    []
  );
  const glowstoneMat = useMemo(
    () =>
      getVoxelMaterial("glowstone", {
        emissive: new THREE.Color("#fab005"),
        emissiveIntensity: 1.5,
      }),
    []
  );
  const monitorMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);

  // Frame loop for beacon flashing, rotating satellite dishes, and animated telemetry trace
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Check activation distance to player
    const camPos = state.camera.position;
    const dist = Math.hypot(camPos.x - position[0], camPos.z - position[2]);
    const active = dist < 16;
    if (active !== isActivated) {
      setIsActivated(active);
    }

    // 1. Aviation Beacon Flashing
    if (beaconRef.current && !reducedMotion) {
      const intensity = 0.5 + 0.5 * Math.sin(t * 5);
      if (beaconRef.current.material && "emissiveIntensity" in beaconRef.current.material) {
        (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          intensity * 2.5;
      }
    }

    // 2. Slow Dish Scanning Rotation
    if (dishClusterRef.current && !reducedMotion) {
      dishClusterRef.current.rotation.y = Math.sin(t * 0.4) * 0.25;
    }

    // 3. Dynamic Telemetry Trace Rendering on Monitor
    if (screenCanvasRef.current && screenTexRef.current && !reducedMotion) {
      const ctx = screenCanvasRef.current.getContext("2d");
      if (ctx) {
        // Dark terminal background
        ctx.fillStyle = "#070d18";
        ctx.fillRect(0, 0, 256, 128);

        // Header & Status
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = active ? "#38bdf8" : "#64748b";
        ctx.fillText(active ? "RACE CONTROL // STREAM ACTIVE" : "RACE CONTROL // STANDBY", 8, 14);

        ctx.font = "8px monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText("CANONICAL: 1,067,193", 8, 26);
        ctx.fillText("0 MALFORMED | ~2,650 EVT/S", 8, 38);

        // Draw illustrative telemetry speed waveform trace
        ctx.beginPath();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        for (let x = 0; x < 240; x += 3) {
          const wave =
            Math.sin((x * 0.08) - t * 4) * 16 +
            Math.cos((x * 0.04) + t * 2) * 8 +
            Math.sin((x * 0.15) - t * 6) * 4;
          const y = 80 + wave;
          if (x === 0) ctx.moveTo(8 + x, y);
          else ctx.lineTo(8 + x, y);
        }
        ctx.stroke();

        // Footer note
        ctx.fillStyle = "#f59e0b";
        ctx.font = "7px monospace";
        ctx.fillText("ILLUSTRATIVE ENGINEERING TRACE (P50: ~0.10ms)", 8, 120);

        screenTexRef.current.needsUpdate = true;
      }
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    worldSound.playInspectChime();
    inspectProject("live-f1-intelligence");
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {/* 1. Stone Brick Foundation (10x10 blocks) */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[10, 0.5, 10]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 2. Lower Control Hub (Stone Brick Walls, 8x8x4 high) */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.0, 4.0, 8.0]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Ground Floor Windows (Glass Blocks on 4 sides) */}
      <mesh position={[0, 2.5, 4.05]} castShadow>
        <boxGeometry args={[6.0, 1.8, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[0, 2.5, -4.05]} castShadow>
        <boxGeometry args={[6.0, 1.8, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* 3. Mid-Level Overhang Balcony (9x9 slab) */}
      <mesh position={[0, 4.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.2, 0.5, 9.2]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 4. Upper Race Control / Telemetry Processing Room (6x6x4 high) */}
      {[-2.8, 2.8].map((x) =>
        [-2.8, 2.8].map((z) => (
          <mesh key={`col_${x}_${z}`} position={[x, 6.75, z]} castShadow>
            <boxGeometry args={[1.0, 3.5, 1.0]} />
            <primitive object={stoneBrickMat} attach="material" />
          </mesh>
        ))
      )}

      {/* Panoramic Glass Observation Windows around the deck */}
      <mesh position={[0, 6.75, 2.85]} castShadow>
        <boxGeometry args={[4.8, 2.6, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[0, 6.75, -2.85]} castShadow>
        <boxGeometry args={[4.8, 2.6, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[2.85, 6.75, 0]} castShadow>
        <boxGeometry args={[0.2, 2.6, 4.8]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[-2.85, 6.75, 0]} castShadow>
        <boxGeometry args={[0.2, 2.6, 4.8]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* Interior Glowing Telemetry Monitor Array (Dynamic Canvas Texture) */}
      <mesh position={[0, 6.75, 2.5]}>
        <boxGeometry args={[4.2, 1.8, 0.1]} />
        <primitive object={dynamicScreenMaterial} attach="material" />
      </mesh>

      {/* 5. Roof Platform (7x7 slab) */}
      <mesh position={[0, 8.75, 0]} castShadow>
        <boxGeometry args={[7.4, 0.5, 7.4]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Roof Corner Glowstone Lanterns */}
      {[-3, 3].map((x) =>
        [-3, 3].map((z) => (
          <mesh key={`r_glow_${x}_${z}`} position={[x, 9.3, z]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <primitive object={glowstoneMat} attach="material" />
          </mesh>
        ))
      )}

      {/* 6. High-Altitude Voxel Antenna Mast */}
      <mesh position={[0, 11.0, 0]} castShadow>
        <boxGeometry args={[0.8, 4.0, 0.8]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>
      <mesh position={[0, 14.0, 0]} castShadow>
        <boxGeometry args={[0.4, 2.5, 0.4]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>
      {/* Topmost beacon block */}
      <mesh ref={beaconRef} position={[0, 15.5, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* 7. Four Voxel Satellite Intake Dishes on scanning group */}
      <group ref={dishClusterRef}>
        {[
          { pos: [2.5, 9.5, 2.5], rot: [0.3, 0.6, 0], label: "OpenF1" },
          { pos: [-2.5, 9.5, 2.5], rot: [0.3, -0.6, 0], label: "FastF1" },
          { pos: [-2.5, 9.5, -2.5], rot: [-0.3, -2.2, 0], label: "Jolpica" },
          { pos: [2.5, 9.5, -2.5], rot: [-0.3, 2.2, 0], label: "SignalR" },
        ].map((dish, i) => (
          <group
            key={i}
            position={dish.pos as [number, number, number]}
            rotation={dish.rot as [number, number, number]}
          >
            <mesh castShadow>
              <boxGeometry args={[1.2, 1.2, 0.3]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.4]} castShadow>
              <boxGeometry args={[0.15, 0.15, 0.6]} />
              <primitive object={stoneBrickMat} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 8. Physical Minecraft Sign at Tower Base: [ TELEMETRY TOWER / LIVE F1 INTELLIGENCE ] */}
      <group position={[0, 2.0, 4.4]}>
        <mesh castShadow>
          <boxGeometry args={[5.2, 1.0, 0.2]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[5.0, 0.9]} />
          <primitive object={signMat} attach="material" />
        </mesh>
        <mesh position={[-2.4, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[2.4, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
      </group>

      {/* 9. Interactive Telemetry Terminal Station (Out in front) */}
      <group position={[0, 0, 5.8]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.9]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.65, 0.2]} />
          <primitive object={dynamicScreenMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

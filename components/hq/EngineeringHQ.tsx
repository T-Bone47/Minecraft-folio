"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { getVoxelMaterial, getVoxelSignMaterial } from "@/lib/voxelTextures";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { worldSound } from "@/lib/audio";

interface EngineeringHQProps {
  position?: [number, number, number];
}

export const EngineeringHQ: React.FC<EngineeringHQProps> = ({
  position = [-26, 0, -22],
}) => {
  const { focusLocation, activeLocation } = useWorldStore();
  const { registerObject, unregisterObject, openStationModal } = useInteractionRegistry();
  const groupRef = useRef<THREE.Group>(null);
  const isActivated = activeLocation === "hq";

  const stoneBrickMat = useMemo(() => getVoxelMaterial("stone_bricks"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("oak_planks"), []);
  const signMat = useMemo(
    () => getVoxelSignMaterial("ENGINEERING HQ", "ASISH OLIVER M"),
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
        emissiveIntensity: isActivated ? 2.2 : 1.2,
      }),
    [isActivated]
  );
  const monitorMat = useMemo(() => getVoxelMaterial("monitor_screen"), []);

  // 1. Career Timeline Canvas Texture (Panel 1: Motorsport)
  const motorsportTimelineTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#02121e";
      ctx.fillRect(0, 0, 512, 340);
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 24px monospace";
      ctx.fillText("2025 - PRESENT", 24, 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px monospace";
      ctx.fillText("INDEPENDENT MOTORSPORT", 24, 90);
      ctx.fillText("RACE & STRATEGY ENGINEER", 24, 118);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px monospace";
      ctx.fillText("Telemetry pipelines & live", 24, 160);
      ctx.fillText("stint analytics for sim racing.", 24, 185);
      ctx.fillText("F1 23/24/25 UDP ingestion.", 24, 210);

      ctx.fillStyle = "#0284c7";
      ctx.fillRect(24, 240, 464, 3);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "14px monospace";
      ctx.fillText("STATUS: ACTIVE PRACTICE", 24, 280);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);

  // 2. Career Timeline Canvas Texture (Panel 2: IGNICT AI/ML)
  const aiTimelineTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0f081d";
      ctx.fillRect(0, 0, 512, 340);
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = "#c084fc";
      ctx.font = "bold 24px monospace";
      ctx.fillText("2026 - PRESENT", 24, 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px monospace";
      ctx.fillText("IGNICT", 24, 90);
      ctx.fillText("AI / ML INTERN", 24, 118);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px monospace";
      ctx.fillText("Predictive architecture &", 24, 160);
      ctx.fillText("applied machine learning models.", 24, 185);
      ctx.fillText("FastAPI & PyTorch pipelines.", 24, 210);

      ctx.fillStyle = "#7c3aed";
      ctx.fillRect(24, 240, 464, 3);

      ctx.fillStyle = "#c084fc";
      ctx.font = "14px monospace";
      ctx.fillText("STATUS: ACTIVE INTERNSHIP", 24, 280);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);

  // 3. Career Timeline Canvas Texture (Panel 3: Education & Foundation)
  const eduTimelineTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#031510";
      ctx.fillRect(0, 0, 512, 340);
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 24px monospace";
      ctx.fillText("ACADEMIC FOUNDATION", 24, 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px monospace";
      ctx.fillText("VIT-AP UNIVERSITY", 24, 90);
      ctx.fillText("M.TECH COMP. SCI. & ENGG", 24, 118);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px monospace";
      ctx.fillText("Distributed systems, software", 24, 160);
      ctx.fillText("architecture & high-throughput", 24, 185);
      ctx.fillText("data processing focus.", 24, 210);

      ctx.fillStyle = "#059669";
      ctx.fillRect(24, 240, 464, 3);

      ctx.fillStyle = "#34d399";
      ctx.font = "14px monospace";
      ctx.fillText("VERIFIED CANONICAL DATA", 24, 280);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);

  // Register Interactive Elements
  useEffect(() => {
    // 1. Engineering HQ Building
    registerObject({
      id: "facility_hq",
      type: "facility",
      label: "ENGINEERING HQ",
      sublabel: "Personal identity anchor & career timeline",
      actionPrompt: "[E] ENTER ENGINEERING HQ",
      position: [position[0], position[1] + 1.5, position[2] + 6.0],
      boundsRadius: 5.5,
      facilityId: "hq",
      onInteract: () => {
        focusLocation("hq");
        worldSound.playClick();
      },
    });

    // 2. Career Wall
    registerObject({
      id: "hq_career_wall",
      type: "wall",
      label: "CAREER TIMELINE & ROLES",
      sublabel: "Verified engineering roles & academic background",
      actionPrompt: "[E] VIEW CAREER DETAILS",
      position: [position[0], position[1] + 2.6, position[2] + 5.3],
      boundsRadius: 4.5,
      facilityId: "hq",
      onInteract: () => {
        openStationModal("career_wall");
        worldSound.playInspect();
      },
    });

    // 3. Contact Terminal
    registerObject({
      id: "hq_contact_terminal",
      type: "terminal",
      label: "COMMUNICATIONS TERMINAL",
      sublabel: "Connect with Asish Oliver M",
      actionPrompt: "[E] OPEN COMMUNICATIONS",
      position: [position[0], position[1] + 1.2, position[2] + 7.6],
      boundsRadius: 3.5,
      facilityId: "hq",
      onInteract: () => {
        openStationModal("contact");
        worldSound.playInspect();
      },
    });

    return () => {
      unregisterObject("facility_hq");
      unregisterObject("hq_career_wall");
      unregisterObject("hq_contact_terminal");
    };
  }, [position, registerObject, unregisterObject, focusLocation, openStationModal]);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    focusLocation("hq");
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {/* 1. Monolith Foundation (14x12 blocks) */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[14, 0.5, 12]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 2. Lower Floor (13x11x4 high) */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[13, 4.0, 11]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Grand Front Glass Portal facing the campus */}
      <mesh position={[0, 2.5, 5.55]} castShadow>
        <boxGeometry args={[9.0, 2.8, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* 3. Upper Tower Level (10x8x3 high) */}
      <mesh position={[0, 5.8, -1.0]} castShadow>
        <boxGeometry args={[10, 2.6, 8]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* Upper Observation Deck Window */}
      <mesh position={[0, 5.8, 3.05]} castShadow>
        <boxGeometry args={[8.0, 1.8, 0.2]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* 4. Roof Platform (11x9) */}
      <mesh position={[0, 7.3, -1.0]} castShadow>
        <boxGeometry args={[11, 0.5, 9]} />
        <primitive object={stoneBrickMat} attach="material" />
      </mesh>

      {/* 5. ENGINEERING TIMELINE WALL (Mounted on interior rear wall, visible through glass) */}
      <group position={[0, 2.6, 5.3]}>
        {/* Timeline Panel 1: Independent Motorsport / eSports Engineer */}
        <group position={[-2.8, 0, 0]}>
          <mesh>
            <planeGeometry args={[2.4, 1.6]} />
            <meshBasicMaterial map={motorsportTimelineTex} />
          </mesh>
        </group>
        {/* Timeline Panel 2: IGNICT AI/ML Intern */}
        <group position={[0, 0, 0]}>
          <mesh>
            <planeGeometry args={[2.4, 1.6]} />
            <meshBasicMaterial map={aiTimelineTex} />
          </mesh>
        </group>
        {/* Timeline Panel 3: VIT-AP M.Tech CSE & Academic Foundation */}
        <group position={[2.8, 0, 0]}>
          <mesh>
            <planeGeometry args={[2.4, 1.6]} />
            <meshBasicMaterial map={eduTimelineTex} />
          </mesh>
        </group>
      </group>

      {/* Glowstone Lanterns */}
      {[-5, 5].map((x) => (
        <mesh key={x} position={[x, 4.2, 5.6]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      ))}

      {/* 6. Physical Minecraft Sign: [ ENGINEERING HQ / ASISH OLIVER M ] */}
      <group position={[0, 2.0, 6.2]}>
        <mesh castShadow>
          <boxGeometry args={[6.5, 1.1, 0.2]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[6.3, 1.0]} />
          <primitive object={signMat} attach="material" />
        </mesh>
        <mesh position={[-3.0, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[3.0, -0.8, 0]} castShadow>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
      </group>

      {/* 7. Interactive Contact Terminal Pedestal */}
      <group position={[0, 0, 7.6]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.9]} />
          <primitive object={stoneBrickMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.65, 0.2]} />
          <primitive object={monitorMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};


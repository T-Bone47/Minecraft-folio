"use client";
import { chromeEra } from "@/data/chromeEra";
import { FacilityWalls } from "@/components/theme/FacilityWalls";


import React, { useRef, useMemo, useEffect } from "react";
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

  const stoneBrickMat = useMemo(() => getVoxelMaterial("chrome_brushed"), []);
  const oakPlankMat = useMemo(() => getVoxelMaterial("chrome_graphite"), []);
  const signMat = useMemo(
    () => getVoxelSignMaterial("ENGINEERING HQ", "ASISH OLIVER M"),
    []
  );
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
      ctx.fillStyle = chromeEra.carbon;
      ctx.fillRect(0, 0, 512, 340);
      ctx.strokeStyle = chromeEra.red;
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "bold 24px monospace";
      ctx.fillText("2025 - PRESENT", 24, 48);

      ctx.fillStyle = chromeEra.white;
      ctx.font = "bold 20px monospace";
      ctx.fillText("INDEPENDENT MOTORSPORT", 24, 90);
      ctx.fillText("RACE & STRATEGY ENGINEER", 24, 118);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "16px monospace";
      ctx.fillText("Telemetry pipelines & live", 24, 160);
      ctx.fillText("stint analytics for sim racing.", 24, 185);
      ctx.fillText("F1 23/24/25 UDP ingestion.", 24, 210);

      ctx.fillStyle = chromeEra.red;
      ctx.fillRect(24, 240, 464, 3);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "14px monospace";
      ctx.fillText("STATUS: ACTIVE PRACTICE", 24, 280);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
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
      ctx.fillStyle = chromeEra.carbon;
      ctx.fillRect(0, 0, 512, 340);
      ctx.strokeStyle = chromeEra.red;
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "bold 24px monospace";
      ctx.fillText("2026 - PRESENT", 24, 48);

      ctx.fillStyle = chromeEra.white;
      ctx.font = "bold 20px monospace";
      ctx.fillText("IGNICT", 24, 90);
      ctx.fillText("AI / ML INTERN", 24, 118);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "16px monospace";
      ctx.fillText("Predictive architecture &", 24, 160);
      ctx.fillText("applied machine learning models.", 24, 185);
      ctx.fillText("FastAPI & PyTorch pipelines.", 24, 210);

      ctx.fillStyle = chromeEra.red;
      ctx.fillRect(24, 240, 464, 3);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "14px monospace";
      ctx.fillText("STATUS: ACTIVE INTERNSHIP", 24, 280);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
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
      ctx.fillStyle = chromeEra.carbon;
      ctx.fillRect(0, 0, 512, 340);
      ctx.strokeStyle = chromeEra.red;
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "bold 24px monospace";
      ctx.fillText("ACADEMIC FOUNDATION", 24, 48);

      ctx.fillStyle = chromeEra.white;
      ctx.font = "bold 20px monospace";
      ctx.fillText("VIT-AP UNIVERSITY", 24, 90);
      ctx.fillText("M.TECH COMP. SCI. & ENGG", 24, 118);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "16px monospace";
      ctx.fillText("Distributed systems, software", 24, 160);
      ctx.fillText("architecture & high-throughput", 24, 185);
      ctx.fillText("data processing focus.", 24, 210);

      ctx.fillStyle = chromeEra.red;
      ctx.fillRect(24, 240, 464, 3);

      ctx.fillStyle = chromeEra.silver;
      ctx.font = "14px monospace";
      ctx.fillText("PROFILE / OWNER-SUPPLIED", 24, 280);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);

  useEffect(() => () => {
    motorsportTimelineTex.dispose();
    aiTimelineTex.dispose();
    eduTimelineTex.dispose();
  }, [motorsportTimelineTex, aiTimelineTex, eduTimelineTex]);

  // Register Interactive Elements
  useEffect(() => {
    // 1. Engineering HQ Building
    registerObject({
      id: "facility_hq",
      type: "facility",
      label: "ENGINEERING HQ",
      sublabel: "Personal identity anchor & career timeline",
      actionPrompt: "[E] ENTER ENGINEERING HQ",
      position: [position[0] + 6.4, position[1] + 1.5, position[2] + 1],
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
      sublabel: "Owner-supplied roles and academic background; inspect source details",
      actionPrompt: "[E] VIEW CAREER DETAILS",
      position: [position[0] - 4.85, position[1] + 2.6, position[2] + 1],
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
      position: [position[0] + 3.3, position[1] + 1.7, position[2] + 1],
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
      <mesh position={[0, 0.28, 1]} receiveShadow>
        <boxGeometry args={[14, 0.5, 14]} />
        <primitive object={getVoxelMaterial("chrome_floor")} attach="material" />
      </mesh>

      {/* Visible walls follow the canonical collision footprint, including its
          open east entrance. A single solid box previously hid that doorway. */}
      <FacilityWalls id="hq" height={3.9} />
      <mesh position={[0, 4.5, 1]} castShadow><boxGeometry args={[12.8, .3, 12.8]} /><primitive object={oakPlankMat} attach="material" /></mesh>
      <mesh position={[7, 4.25, 1]} castShadow><boxGeometry args={[3, .2, 6.5]} /><primitive object={getVoxelMaterial("chrome_polished")} attach="material" /></mesh>
      <mesh position={[8.45, 4.14, 1]}><boxGeometry args={[.08, .08, 6.3]} /><primitive object={getVoxelMaterial("chrome_red")} attach="material" /></mesh>
      {[-1.5, 3.5].map(z => <mesh key={z} position={[6.08, 2.35, z]}><boxGeometry args={[.14, 3.6, .14]} /><primitive object={getVoxelMaterial("chrome_red")} attach="material" /></mesh>)}
      <mesh position={[2, 4.28, 1]}><boxGeometry args={[4.8, .09, 3.6]} /><primitive object={glowstoneMat} attach="material" /></mesh>

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

      {/* 5. Timeline faces the physical east entrance across the open foyer. */}
      <group position={[-4.94, 2.6, 1]} rotation={[0, Math.PI / 2, 0]}>
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
      {[-1.5, 3.5].map((z) => (
        <mesh key={z} position={[6.1, 4.0, z]}>
          <boxGeometry args={[0.12, 0.12, 0.7]} />
          <primitive object={glowstoneMat} attach="material" />
        </mesh>
      ))}

      {/* 6. Physical Minecraft Sign: [ ENGINEERING HQ / ASISH OLIVER M ] */}
      <group position={[6.2, 3.65, 1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[6.5, 1.1, 0.2]} />
          <primitive object={oakPlankMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[6.3, 1.0]} />
          <primitive object={signMat} attach="material" />
        </mesh>
      </group>

      {/* 7. Interactive Contact Terminal Pedestal */}
      <group position={[3.3, 0.5, 1]} rotation={[0, Math.PI / 2, 0]}>
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

"use client";

import React, { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { CAMPUS_WORKFORCE_DEFINITIONS } from "@/lib/npc/behaviorScheduler";
import { ArticulatedVoxelNPC } from "./ArticulatedVoxelNPC";
import { useNPCWorkforceStore } from "@/state/npcWorkforceStore";
import { useWorldStore } from "@/state/worldStore";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";

export function LivingNPCWorkforce() {
  const stepSimulation = useNPCWorkforceStore((s) => s.stepSimulation);
  const notifyLapCompleted = useNPCWorkforceStore((s) => s.notifyLapCompleted);

  // Subscribe to Digital Twin lap completion
  useEffect(() => {
    const unsub = useDigitalTwinStore.subscribe((state, prevState) => {
      if (state.recordedLap && state.recordedLap !== prevState.recordedLap) {
        notifyLapCompleted();
      }
    });
    return unsub;
  }, [notifyLapCompleted]);

  // Central simulation update loop inside Three.js frame
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const camPos = state.camera.position;
    const isDriving = useWorldStore.getState().isDriving;

    // Check distance to the F1 single-seater in garage: [-12, 0.55, -8]
    const distToCar = Math.hypot(camPos.x - (-12.0), camPos.z - (-8.0));
    const isPlayerNearbyF1Car = distToCar < 4.2;

    stepSimulation(
      dt,
      isDriving,
      isPlayerNearbyF1Car,
      [camPos.x, camPos.y, camPos.z]
    );
  });

  return (
    <group name="Living-NPC-Workforce">
      {CAMPUS_WORKFORCE_DEFINITIONS.map((def) => (
        <ArticulatedVoxelNPC key={def.id} definition={def} />
      ))}
    </group>
  );
}


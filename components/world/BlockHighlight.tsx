import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry, InteractiveObject } from "@/state/interactionRegistry";
import { facilities } from "@/data/facilities";

export const BlockHighlight: React.FC = () => {
  const { camera } = useThree();
  const { mode, inspectProject, setNearbyTarget } = useWorldStore();
  const { interactiveObjects, setActiveTarget, activeTarget } = useInteractionRegistry();

  const boxRef = useRef<THREE.LineSegments>(null);
  const [highlightPos, setHighlightPos] = useState<[number, number, number] | null>(
    null
  );

  useFrame(() => {
    if (mode === "inspect" || mode === "boot") {
      if (highlightPos) setHighlightPos(null);
      if (activeTarget) setActiveTarget(null);
      return;
    }

    // Raycast forward from camera center
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const camPos = camera.position;

    let bestTarget: InteractiveObject | null = null;
    let minScore = Infinity;

    // 1. Check registered interactive stations and terminals first
    for (const obj of interactiveObjects) {
      const targetPos = new THREE.Vector3(...obj.position);
      const toTarget = targetPos.clone().sub(camPos);
      const dist = toTarget.length();

      if (dist <= obj.boundsRadius) {
        toTarget.normalize();
        const dot = forward.dot(toTarget);
        if (dot > 0.72) {
          const score = dist * (1.1 - dot);
          if (score < minScore) {
            minScore = score;
            bestTarget = obj;
          }
        }
      }
    }

    // 2. Fallback check against facility centers if no specific station is focused
    if (!bestTarget) {
      for (const fac of facilities) {
        const targetPos = new THREE.Vector3(...fac.coordinates);
        const toTarget = targetPos.clone().sub(camPos);
        const dist = toTarget.length();

        if (dist <= 14) {
          toTarget.normalize();
          const dot = forward.dot(toTarget);
          if (dot > 0.75) {
            const score = dist * (1.1 - dot);
            if (score < minScore) {
              minScore = score;
              bestTarget = {
                id: fac.id,
                type: "facility",
                label: fac.name,
                sublabel: fac.tagline,
                actionPrompt: `[E] INSPECT ${fac.code.split(" / ")[1]}`,
                position: [fac.coordinates[0], fac.coordinates[1] + 1.0, fac.coordinates[2]],
                boundsRadius: 14,
                projectSlug: fac.projectSlug,
                facilityId: fac.id,
                onInteract: () => {
                  if (fac.projectSlug) {
                    inspectProject(fac.projectSlug);
                  }
                },
              };
            }
          }
        }
      }
    }

    if (bestTarget) {
      setHighlightPos(bestTarget.position);
      if (activeTarget?.id !== bestTarget.id) {
        setActiveTarget(bestTarget);
        setNearbyTarget({
          id: bestTarget.id,
          type: "facility",
          label: bestTarget.label,
          sublabel: bestTarget.sublabel,
          position: bestTarget.position,
          radius: bestTarget.boundsRadius,
          projectSlug: bestTarget.projectSlug,
          action: bestTarget.onInteract,
        });
      }
    } else {
      if (highlightPos) setHighlightPos(null);
      if (activeTarget !== null) {
        setActiveTarget(null);
        setNearbyTarget(null);
      }
    }
  });

  if (!highlightPos) return null;

  return (
    <group position={highlightPos}>
      {/* Subtle authentic Minecraft 3D Block Wireframe Outline (Black, 1.02 scale) */}
      <lineSegments ref={boxRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.02, 1.02, 1.02)]} />
        <lineBasicMaterial color="#000000" linewidth={2} depthTest={false} transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
};

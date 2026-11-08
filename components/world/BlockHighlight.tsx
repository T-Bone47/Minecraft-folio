import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry, InteractiveObject } from "@/state/interactionRegistry";
import { facilities } from "@/data/facilities";

// Module-level reusable scratch vectors to eliminate garbage collection stutters
const _forward = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _toTarget = new THREE.Vector3();

export const BlockHighlight: React.FC = () => {
  const { camera } = useThree();
  const mode = useWorldStore((s) => s.mode);
  const inspectProject = useWorldStore((s) => s.inspectProject);
  const setNearbyTarget = useWorldStore((s) => s.setNearbyTarget);
  const interactiveObjects = useInteractionRegistry((s) => s.interactiveObjects);
  const setActiveTarget = useInteractionRegistry((s) => s.setActiveTarget);
  const activeTarget = useInteractionRegistry((s) => s.activeTarget);

  const groupRef = useRef<THREE.Group>(null);
  const activeTargetIdRef = useRef<string | null>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    if (mode === "inspect" || mode === "boot") {
      groupRef.current.visible = false;
      if (activeTargetIdRef.current !== null) {
        activeTargetIdRef.current = null;
        setActiveTarget(null);
      }
      return;
    }

    // Raycast forward from camera center
    camera.getWorldDirection(_forward);
    const camPos = camera.position;

    let bestTarget: InteractiveObject | null = null;
    let minScore = Infinity;

    // 1. Check registered interactive stations and terminals first
    for (const obj of interactiveObjects) {
      _targetPos.set(obj.position[0], obj.position[1], obj.position[2]);
      _toTarget.subVectors(_targetPos, camPos);
      const dist = _toTarget.length();

      if (dist <= obj.boundsRadius) {
        _toTarget.divideScalar(dist || 1);
        const dot = _forward.dot(_toTarget);
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
        _targetPos.set(fac.coordinates[0], fac.coordinates[1], fac.coordinates[2]);
        _toTarget.subVectors(_targetPos, camPos);
        const dist = _toTarget.length();

        if (dist <= 14) {
          _toTarget.divideScalar(dist || 1);
          const dot = _forward.dot(_toTarget);
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
      groupRef.current.position.set(
        bestTarget.position[0],
        bestTarget.position[1],
        bestTarget.position[2]
      );
      groupRef.current.visible = true;

      if (activeTargetIdRef.current !== bestTarget.id) {
        activeTargetIdRef.current = bestTarget.id;
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
      groupRef.current.visible = false;
      if (activeTargetIdRef.current !== null) {
        activeTargetIdRef.current = null;
        setActiveTarget(null);
        setNearbyTarget(null);
      }
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Subtle authentic Minecraft 3D Block Wireframe Outline (Black, 1.02 scale) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.02, 1.02, 1.02)]} />
        <lineBasicMaterial color="#000000" linewidth={2} depthTest={false} transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
};

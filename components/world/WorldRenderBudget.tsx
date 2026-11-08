"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityProfile } from "@/lib/renderQuality";
/** Decorative emissive blocks stay visible; cap costly dynamic illumination. */
export function WorldRenderBudget({ quality }: {
    quality: QualityProfile;
}) { const elapsed = useRef(1); useFrame(({ scene, camera }, delta) => { elapsed.current += delta; if (elapsed.current < .5)
    return; elapsed.current = 0; const lights: THREE.PointLight[] = []; scene.traverse(o => { if (o instanceof THREE.PointLight)
    lights.push(o); }); const temp = new THREE.Vector3(); lights.sort((a, b) => a.getWorldPosition(temp).distanceToSquared(camera.position) - b.getWorldPosition(new THREE.Vector3()).distanceToSquared(camera.position)); const budget = quality.id === "low" || quality.id === "mobile" ? 0 : quality.id === "medium" ? 3 : 6; lights.forEach((light, i) => { light.visible = i < budget; }); }, -1); return null; }

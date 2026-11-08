"use client";

import { getFacilityById } from "@/data/facilities";
import { getVoxelMaterial } from "@/lib/voxelTextures";

/** Render the same perimeter segments used by walking and camera collision. */
export function FacilityWalls({ id, height = 4 }: { id: string; height?: number }) {
  const facility = getFacilityById(id);
  if (!facility) return null;
  const [x, , z] = facility.coordinates;
  return <group name={`${id}-walkable-shell`}>{facility.collision.map((wall, i) =>
    <mesh key={i} position={[(wall.minX + wall.maxX) / 2 - x, .5 + height / 2, (wall.minZ + wall.maxZ) / 2 - z]} castShadow receiveShadow>
      <boxGeometry args={[wall.maxX - wall.minX, height, wall.maxZ - wall.minZ]} />
      <primitive object={getVoxelMaterial("chrome_brushed")} attach="material" />
    </mesh>
  )}</group>;
}

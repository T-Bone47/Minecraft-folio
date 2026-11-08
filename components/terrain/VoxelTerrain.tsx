"use client";

import React, { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  getGrassBlockMaterials,
  getVoxelMaterial,
  getOakLogMaterials,
} from "@/lib/voxelTextures";
import {
  CAMPUS_HALF_EXTENT,
  CHUNK_SIZE,
  POND,
  TREE_POSITIONS,
  canPlantTreeAt,
  chunkCoordinateFor,
  isBlockExposed,
  sampleColumn,
} from "@/lib/terrainModel";
import { useWorldStore } from "@/state/worldStore";
import type { QualityProfile } from "@/lib/renderQuality";

type BlockKind = "grass" | "stone" | "path" | "log" | "leaves";

interface Block {
  x: number;
  y: number;
  z: number;
}

interface ChunkData {
  key: string;
  blocks: Record<BlockKind, Block[]>;
  centerX: number;
  centerZ: number;
}

interface LayerSpec {
  kind: BlockKind;
  /** Flattened slab geometry rather than a full block. */
  flat?: boolean;
  /** Multiplier applied to the profile's terrain shadow distance. */
  shadowFactor: number;
  /** Detail-only layers are culled outright beyond the profile LOD distance. */
  detail?: boolean;
}

const LAYERS: readonly LayerSpec[] = [
  { kind: "grass", shadowFactor: 1 },
  { kind: "stone", shadowFactor: 0.75 },
  { kind: "log", shadowFactor: 0.6 },
  { kind: "leaves", shadowFactor: 0.6 },
  { kind: "path", flat: true, shadowFactor: 0, detail: true },
];

/** Seconds between LOD re-evaluations. */
const LOD_INTERVAL = 0.25;

const BLOCK_GEOMETRY: ReadonlyArray<[number, number, number]> = [
  [1, 1, 1],
  [1, 0.1, 1],
];

/**
 * Chunked voxel terrain.
 *
 * Three optimisations, in order of impact:
 *
 *  1. **Exposure culling** — terrain fills each column down to bedrock, but
 *     ~88% of those stone blocks are fully enclosed by their neighbours and
 *     can never be seen. Skipping them removes ~92k triangles without
 *     changing a single rendered pixel.
 *
 *  2. **Spatial chunking** — each 16×16 chunk owns its own InstancedMesh, so
 *     Three.js can frustum-cull whole regions. One world-spanning mesh can
 *     only ever be drawn as a single unit, so culling never helps it.
 *
 *  3. **Distance LOD** — footpaths are thin high-frequency detail that is
 *     imperceptible past ~70 units, so distant chunks drop them and trim
 *     their shadow casters.
 *
 * All geometry derives from `lib/terrainModel`, the same module the player
 * controller samples, so what you see is exactly what you walk on.
 */
export interface VoxelTerrainProps {
  quality: QualityProfile;
}

export const VoxelTerrain: React.FC<VoxelTerrainProps> = ({ quality }) => {
  const chunks = useMemo<ChunkData[]>(() => buildChunks(), []);

  const materials = useMemo(() => {
    // `alphaTest` rather than `transparent`: cutout foliage can be rendered in
    // the opaque pass, which skips per-frame depth sorting entirely.
    const leaves = getVoxelMaterial("oak_leaves", {
      alphaTest: 0.35,
      side: THREE.DoubleSide,
    });
    const water = getVoxelMaterial("water", {
      transparent: true,
      opacity: 0.82,
      roughness: 0.15,
      metalness: 0.35,
    });
    const glowstone = getVoxelMaterial("chrome_light", {
      emissive: new THREE.Color("#F4F3EF"),
      emissiveIntensity: 1.5,
    });

    const map: Record<BlockKind, THREE.Material | THREE.Material[]> = {
      grass: getGrassBlockMaterials(),
      stone: getVoxelMaterial("stone"),
      path: getVoxelMaterial("stone_bricks"),
      log: getOakLogMaterials(),
      leaves,
    };

    return { map, water, glowstone, post: getVoxelMaterial("chrome_graphite") };
  }, []);

  return (
    <group>
      {chunks.map((chunk) => (
        <TerrainChunk
          key={chunk.key}
          chunk={chunk}
          materials={materials}
          quality={quality}
        />
      ))}

      {/* Pond surface. One continuous body of water, so never split per chunk. */}
      <mesh position={[POND.x, POND.waterTopY - 0.35, POND.z]} receiveShadow>
        <boxGeometry args={[POND.radius * 2, 0.7, POND.radius * 2]} />
        <primitive object={materials.water} attach="material" />
      </mesh>

      {/* Lantern posts lining the main footpaths. */}
      {LANTERNS.map((position) => (
        <group key={`${position[0]},${position[1]}`} position={[position[0], 0, position[1]]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[0.2, 2.0, 0.2]} />
            <primitive object={materials.post} attach="material" />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <primitive object={materials.glowstone} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const LANTERNS: ReadonlyArray<readonly [number, number]> = [
  [-15, 6],
  [3, 12],
  [18, -10],
  [18, 8],
  [-22, -25],
];

// ---------------------------------------------------------------------------
// CHUNK GENERATION
// ---------------------------------------------------------------------------

function buildChunks(): ChunkData[] {
  const byKey = new Map<string, ChunkData>();

  const ensureChunk = (x: number, z: number): ChunkData => {
    const cx = chunkCoordinateFor(x);
    const cz = chunkCoordinateFor(z);
    const key = `${cx},${cz}`;
    let chunk = byKey.get(key);
    if (!chunk) {
      chunk = {
        key,
        blocks: { grass: [], stone: [], path: [], log: [], leaves: [] },
        centerX: (cx + 0.5) * CHUNK_SIZE,
        centerZ: (cz + 0.5) * CHUNK_SIZE,
      };
      byKey.set(key, chunk);
    }
    return chunk;
  };

  for (let x = -CAMPUS_HALF_EXTENT; x <= CAMPUS_HALF_EXTENT; x += 1) {
    for (let z = -CAMPUS_HALF_EXTENT; z <= CAMPUS_HALF_EXTENT; z += 1) {
      const column = sampleColumn(x, z);
      if (column.kind === "void") continue;

      const chunk = ensureChunk(x, z);

      if (column.kind === "pond") {
        chunk.blocks.stone.push({ x, y: POND.floorY, z });
        continue;
      }

      if (column.kind === "path") {
        // A thin slab laid flush into the ground plane.
        chunk.blocks.path.push({ x, y: column.surfaceY - 0.45, z });
      } else {
        chunk.blocks.grass.push({ x, y: column.height, z });
      }

      for (let y = column.height - 1; y >= -1; y--) {
        if (isBlockExposed(x, y, z)) {
          chunk.blocks.stone.push({ x, y, z });
        }
      }
    }
  }

  // Trees. Trunks start at the sampled surface so nothing floats on a slope,
  // and positions landing on tarmac, a pad or the pond are rejected outright.
  for (const position of TREE_POSITIONS) {
    if (!canPlantTreeAt(position.x, position.z)) continue;
    const chunk = ensureChunk(position.x, position.z);
    const baseY = sampleColumn(position.x, position.z).height;
    const trunkHeight = 4;
    const topY = baseY + trunkHeight;

    for (let h = 0; h < trunkHeight; h++) {
      chunk.blocks.log.push({ x: position.x, y: baseY + h, z: position.z });
    }

    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
        chunk.blocks.leaves.push({ x: position.x + dx, y: topY - 1, z: position.z + dz });
      }
    }

    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        chunk.blocks.leaves.push({ x: position.x + dx, y: topY, z: position.z + dz });
      }
    }

    const cap: ReadonlyArray<[number, number]> = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [dx, dz] of cap) {
      chunk.blocks.leaves.push({ x: position.x + dx, y: topY + 1, z: position.z + dz });
    }
  }

  return Array.from(byKey.values());
}

// ---------------------------------------------------------------------------
// CHUNK RENDERER
// ---------------------------------------------------------------------------

interface TerrainMaterials {
  map: Record<BlockKind, THREE.Material | THREE.Material[]>;
  water: THREE.Material;
  glowstone: THREE.Material;
  post: THREE.Material;
}

interface TerrainChunkProps {
  chunk: ChunkData;
  materials: TerrainMaterials;
  quality: QualityProfile;
}

/**
 * One spatial chunk of terrain.
 *
 * Each layer is its own InstancedMesh so the renderer can cull them
 * independently, and each gets an explicit bounding sphere — without it
 * Three.js falls back to the shared unit cube and the chunk is never culled.
 */
const TerrainChunk: React.FC<TerrainChunkProps> = ({ chunk, materials, quality }) => {
  const meshes = useRef<Partial<Record<BlockKind, THREE.InstancedMesh | null>>>({});
  const lodClock = useRef(0);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    for (const layer of LAYERS) {
      const blocks = chunk.blocks[layer.kind];
      const mesh = meshes.current[layer.kind];
      if (!mesh || blocks.length === 0) continue;

      for (let index = 0; index < blocks.length; index++) {
        const block = blocks[index]!;
        dummy.position.set(block.x, block.y, block.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }
      mesh.count = blocks.length;
      mesh.instanceMatrix.needsUpdate = true;
      // Essential: without this, frustum culling uses the unit-cube bounds of
      // the shared geometry and the chunk is drawn no matter where you look.
      mesh.computeBoundingSphere();
    }
  }, [chunk]);

  useFrame(({ camera, clock }, delta) => {
    lodClock.current += delta;
    if (lodClock.current < LOD_INTERVAL) return;
    lodClock.current = 0;

    const distance = Math.hypot(
      camera.position.x - chunk.centerX,
      camera.position.z - chunk.centerZ
    );

    for (const layer of LAYERS) {
      const mesh = meshes.current[layer.kind];
      if (!mesh) continue;

      if (layer.detail && distance > quality.lodDistance) {
        mesh.visible = false;
        continue;
      }
      mesh.visible = true;
      // Shadow casting dominates draw cost; distant terrain contributes
      // almost nothing to the visible shadow field.
      mesh.castShadow =
        quality.shadows && distance <= quality.terrainShadowDistance * layer.shadowFactor;
    }
  });

  return (
    <group>
      {LAYERS.map((layer, layerIndex) => {
        const blocks = chunk.blocks[layer.kind];
        if (blocks.length === 0) return null;
        const size = BLOCK_GEOMETRY[layer.flat ? 1 : 0]!;

        return (
          <instancedMesh
            key={layer.kind}
            ref={(mesh) => {
              meshes.current[layer.kind] = mesh;
            }}
            args={[undefined, materials.map[layer.kind], blocks.length]}
            castShadow={quality.shadows && !layer.detail}
            receiveShadow
            frustumCulled
          >
            <boxGeometry args={[size[0], size[1], size[2]]} />
          </instancedMesh>
        );
      })}
    </group>
  );
};
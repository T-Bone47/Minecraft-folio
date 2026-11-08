/**
 * CAMPUS TERRAIN MODEL — single source of truth for world geometry.
 *
 * Both the voxel terrain renderer (`components/terrain/VoxelTerrain.tsx`) and
 * the first-person controller (`components/camera/FirstPersonPlayer.tsx`)
 * derive their geometry from this module. Previously each kept a private copy
 * of the hill function with slightly different thresholds and radii, which
 * made the player sink into and float above the visible terrain.
 *
 * Design rules:
 *  - Pure TypeScript. No Three.js, no React. Safe to import from anywhere.
 *  - No mutable state. All functions are referentially transparent.
 *  - Facility pads and collision boxes are DERIVED from `data/facilities.ts`
 *    so a facility's map pin, camera framing, flattened ground and collision
 *    volume can never drift apart.
 */

import { TRACK_RADIUS, TRACK_HALF_WIDTH } from "@/lib/frontier/drive";
import { facilities } from "@/data/facilities";

// ---------------------------------------------------------------------------
// CAMPUS EXTENTS
// ---------------------------------------------------------------------------

/** Half-width of the generated island, in blocks. */
export const CAMPUS_HALF_EXTENT = 50;

/** Radial cutoff beyond which no terrain is generated (rounded island edge). */
export const CAMPUS_ISLAND_RADIUS = 52;

/** The player is clamped inside this radius, keeping them off the cliff edge. */
export const PLAYER_CLAMP_RADIUS = 49;

/** Island plane is walked on at this radius before the stepped hills begin. */
export const HILL_START_RADIUS = 26;

/** Blocks are 1×1×1; a surface block centred at y=h has its top face at h+0.5. */
export const BLOCK_SIZE = 1;

/** Y of the top face of a full block centred at the origin height. */
export const SURFACE_OFFSET = BLOCK_SIZE / 2;

/** Height of the stepped hills, in blocks. */
export const MAX_HILL_HEIGHT = 3;

/** Hill noise thresholds, ordered high → low. */
const HILL_THRESHOLD_3 = 2.6;
const HILL_THRESHOLD_2 = 1.5;
const HILL_THRESHOLD_1 = 0.65;

/** Perimeter ramp rate applied once past `HILL_START_RADIUS`. */
const HILL_RAMP_RATE = 0.3;

/** Spatial chunk size in blocks, used for frustum-cullable terrain batching. */
export const CHUNK_SIZE = 16;

// ---------------------------------------------------------------------------
// SCENIC POND
// ---------------------------------------------------------------------------

export const POND = {
  x: 6,
  z: -2,
  radius: 5.5,
  /** Stone floor block centre. Top face sits at -0.5, i.e. one block down. */
  floorY: -1,
  /** Top face of the water volume. */
  waterTopY: 0.2,
} as const;

// ---------------------------------------------------------------------------
// CIRCUIT FLATTENING (elliptical band the track is laid into)
// ---------------------------------------------------------------------------

const CIRCUIT = {
  radiusX: 24,
  radiusZ: 18,
  inner: 0.65,
  outer: 1.35,
} as const;

export function isCircuitArea(x: number, z: number): boolean {
  const dx = x / CIRCUIT.radiusX;
  const dz = z / CIRCUIT.radiusZ;
  const r = Math.sqrt(dx * dx + dz * dz);
  return (r > CIRCUIT.inner && r < CIRCUIT.outer) || Math.abs(Math.hypot(x, z) - TRACK_RADIUS) < TRACK_HALF_WIDTH + 4.5;
}

// ---------------------------------------------------------------------------
// FOOTPATHS
// ---------------------------------------------------------------------------

/**
 * Walkways connecting facilities. `axis` is the axis the path runs along;
 * `from`/`to` bound the extent on the perpendicular axis.
 */
const PATHS: ReadonlyArray<{
  axis: "x" | "z";
  at: number;
  from: number;
  to: number;
}> = [
  { axis: "x", at: -12, from: 0, to: 14 }, // Garage → Team Operations
  { axis: "z", at: -8, from: -16, to: -12 }, // Garage → main straight
  { axis: "x", at: 0, from: 6, to: 20 }, // AI Lab → centre green
  { axis: "z", at: 8, from: 12, to: 20 }, // Simulation Lab → centre green
  { axis: "x", at: 14, from: -14, to: -8 }, // Telemetry Tower → track
  { axis: "z", at: -20, from: -25, to: -20 }, // Engineering HQ → track
];

export function isPathArea(x: number, z: number): boolean {
  for (const path of PATHS) {
    if (path.axis === "x") {
      if (Math.abs(x - path.at) <= 1 && z >= path.from && z <= path.to) {
        return true;
      }
    } else {
      if (Math.abs(z - path.at) <= 1 && x >= path.from && x <= path.to) {
        return true;
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// FACILITY PADS + COLLISION
// ---------------------------------------------------------------------------

/**
 * Ground reserved for a facility, as [minX, maxX, minZ, maxZ].
 * Terrain inside a pad is flattened to y=0 so buildings never intersect hills.
 */
export function getFacilityPad(
  facilityId: string
): readonly [number, number, number, number] | undefined {
  const facility = facilities.find((f) => f.id === facilityId);
  return facility?.pad;
}

export function isFacilityArea(x: number, z: number): boolean {
  for (const facility of facilities) {
    const pad = facility.pad;
    if (
      x >= pad[0] &&
      x <= pad[1] &&
      z >= pad[2] &&
      z <= pad[3]
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Solid volumes the player cannot walk through, as
 * [minX, maxX, minZ, maxZ] axis-aligned boxes.
 *
 * A facility may declare several boxes (e.g. the garage is a U-shape with a
 * doorway), and each box may declare a `doorways` list of gaps along one
 * horizontal edge so the player can actually enter and leave.
 */
export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /**
   * Openings cut into the box, expressed as a world-space span along one
   * horizontal axis. A doorway only applies where the player is also within
   * the box's extent on the perpendicular axis, i.e. standing at that wall.
   */
  doorways: ReadonlyArray<{
    axis: "x" | "z";
    from: number;
    to: number;
  }>;
}

/** Static campus obstacles that are not facilities. */
const STATIC_COLLIDERS: ReadonlyArray<CollisionBox> = [
  // Pit wall running alongside the main straight.
  {
    minX: -19.6,
    maxX: -18.4,
    minZ: -14,
    maxZ: 14,
    doorways: [{ axis: "z", from: 6, to: 11 }],
  },
];

function toCollisionBox(box: {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  doorways?: ReadonlyArray<{ axis: "x" | "z"; from: number; to: number }>;
}): CollisionBox {
  return { ...box, doorways: box.doorways ?? [] };
}

/** Every solid volume in the campus, facility-derived plus static. */
export const COLLISION_BOXES: readonly CollisionBox[] = [
  ...facilities.flatMap((facility) => facility.collision.map(toCollisionBox)),
  ...STATIC_COLLIDERS,
];

/** True when (x, z) falls inside a doorway gap cut into `box`. */
function isInsideDoorway(box: CollisionBox, x: number, z: number): boolean {
  for (const doorway of box.doorways) {
    const coord = doorway.axis === "x" ? x : z;
    const cross = doorway.axis === "x" ? z : x;
    const crossMin = doorway.axis === "x" ? box.minZ : box.minX;
    const crossMax = doorway.axis === "x" ? box.maxZ : box.maxX;
    if (coord >= doorway.from && coord <= doorway.to && cross >= crossMin && cross <= crossMax) {
      return true;
    }
  }
  return false;
}

/**
 * Axis-separated collision test used for wall sliding.
 *
 * Returns true when the player, expanded by `radius`, overlaps a solid volume
 * along the given axis. Doorways return false so the player can walk through
 * building entrances instead of being sealed out of every facility.
 */
export function collidesAt(
  x: number,
  z: number,
  radius: number
): boolean {
  for (const box of COLLISION_BOXES) {
    if (
      x + radius <= box.minX ||
      x - radius >= box.maxX ||
      z + radius <= box.minZ ||
      z - radius >= box.maxZ
    ) {
      continue;
    }
    if (!isInsideDoorway(box, x, z)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// COLUMN SAMPLING
// ---------------------------------------------------------------------------

export type ColumnKind = "grass" | "path" | "pond" | "void";

export interface TerrainColumn {
  /** Height of the topmost solid block, in blocks above the base plane. */
  height: number;
  /** Y coordinate of the walkable top face. */
  surfaceY: number;
  kind: ColumnKind;
}

/** True when (x, z) lies inside the generated island. */
export function isInsideIsland(x: number, z: number): boolean {
  return Math.sqrt(x * x + z * z) <= CAMPUS_ISLAND_RADIUS;
}

export function isPondArea(x: number, z: number): boolean {
  const dx = x - POND.x;
  const dz = z - POND.z;
  return Math.sqrt(dx * dx + dz * dz) < POND.radius;
}

/** Areas deliberately kept level: circuit, facility pads and footpaths. */
export function isFlattenedArea(x: number, z: number): boolean {
  return isCircuitArea(x, z) || isFacilityArea(x, z) || isPathArea(x, z);
}

/**
 * Continuous hill field. Deliberately identical to the value used for terrain
 * generation so the controller can sample it without drift.
 */
function hillNoise(x: number, z: number, distFromCenter: number): number {
  return (
    Math.sin(x * 0.12) * 1.5 +
    Math.cos(z * 0.12) * 1.5 +
    (distFromCenter > HILL_START_RADIUS
      ? (distFromCenter - HILL_START_RADIUS) * HILL_RAMP_RATE
      : 0)
  );
}

/** Quantises the hill field into the discrete stepped-terrain heights. */
export function quantizeHillHeight(noise: number): number {
  if (noise > HILL_THRESHOLD_3) return 3;
  if (noise > HILL_THRESHOLD_2) return 2;
  if (noise > HILL_THRESHOLD_1) return 1;
  return 0;
}

/**
 * Samples the terrain column at an integer block coordinate.
 * This is the authoritative answer to "what is the ground here".
 */
export function sampleColumn(x: number, z: number): TerrainColumn {
  const distFromCenter = Math.sqrt(x * x + z * z);

  if (distFromCenter > CAMPUS_ISLAND_RADIUS) {
    return { height: 0, surfaceY: 0, kind: "void" };
  }

  if (isPondArea(x, z)) {
    return {
      height: POND.floorY,
      surfaceY: POND.floorY + SURFACE_OFFSET,
      kind: "pond",
    };
  }

  let height = 0;
  if (!isFlattenedArea(x, z)) {
    height = quantizeHillHeight(hillNoise(x, z, distFromCenter));
  }

  const kind: ColumnKind = isPathArea(x, z) ? "path" : "grass";
  return { height, surfaceY: height + SURFACE_OFFSET, kind };
}

/**
 * Walkable surface height at an arbitrary (fractional) world position.
 * Falls back to the nearest column so sub-block sampling stays stable.
 */
export function getTerrainSurfaceY(x: number, z: number): number {
  return sampleColumn(Math.round(x), Math.round(z)).surfaceY;
}

// ---------------------------------------------------------------------------
// EXPOSURE CULLING
// ---------------------------------------------------------------------------

/**
 * True when at least one vertical face of the block at (x, y, z) is exposed
 * to air, meaning a player could ever see it.
 *
 * Terrain fills each column from its surface down to y = -1, so the vast
 * majority of stone blocks are fully enclosed by neighbours and are never
 * visible. Skipping them removes the single largest source of wasted geometry
 * without changing a single rendered pixel.
 */
export function isBlockExposed(x: number, y: number, z: number): boolean {
  // Above the surface: always exposed.
  const here = sampleColumn(x, z);
  if (y > here.height) return true;

  // A neighbouring column is shorter, so it exposes this block's side face.
  const neighbours: ReadonlyArray<[number, number]> = [
    [x + 1, z],
    [x - 1, z],
    [x, z + 1],
    [x, z - 1],
  ];

  for (const [nx, nz] of neighbours) {
    const neighbour = sampleColumn(nx, nz);
    // A shorter neighbour (or the void beyond the island) leaves this face open.
    if (neighbour.height <= y) return true;
  }

  // Fully enclosed horizontally; only visible from directly below.
  return y <= -1 && !isInsideIsland(x, z + 1);
}

// ---------------------------------------------------------------------------
// TREE PLACEMENT
// ---------------------------------------------------------------------------

/** Authored tree positions, validated against the terrain at build time. */
export const TREE_POSITIONS: ReadonlyArray<{ x: number; z: number }> = [
  { x: -24, z: 26 },
  { x: -28, z: 22 },
  { x: -18, z: 32 },
  { x: 10, z: 28 },
  { x: 16, z: 26 },
  { x: 26, z: 22 },
  { x: 30, z: -4 },
  { x: 28, z: -14 },
  { x: 22, z: -28 },
  { x: -6, z: -28 },
  { x: 4, z: -30 },
  { x: -32, z: -8 },
  { x: -34, z: 8 },
  { x: 2, z: -8 },
  { x: 14, z: -4 },
];

/**
 * Trees may only stand on natural grass: never on the track, a facility pad,
 * a footpath or in the pond. Trees on a slope are still planted, but their
 * trunk is extended down to the ground so they never float.
 */
export function canPlantTreeAt(x: number, z: number): boolean {
  const column = sampleColumn(x, z);
  if (column.kind !== "grass") return false;
  // Keep a one-block clearance from circuit edges and building pads.
  for (const [dx, dz] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as ReadonlyArray<[number, number]>) {
    if (sampleColumn(x + dx, z + dz).kind !== "grass") return false;
    if (isFlattenedArea(x + dx, z + dz)) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// CHUNKING
// ---------------------------------------------------------------------------

/** Integer chunk coordinate containing a block. */
export function chunkCoordinateFor(value: number): number {
  return Math.floor(value / CHUNK_SIZE);
}

/** Stable key identifying a chunk, e.g. "1,-2". */
export function chunkKey(cx: number, cz: number): string {
  return `${cx},${cz}`;
}

/**
 * If (x, z) intersects any solid collision box (e.g. from an unlucky spawn or
 * fast-travel coordinate), depenetrate finds the minimum translation vector
 * to gently push the player to the nearest non-colliding boundary.
 */
export function depenetrate(
  x: number,
  z: number,
  radius: number
): { x: number; z: number } {
  let resolvedX = x;
  let resolvedZ = z;

  for (const box of COLLISION_BOXES) {
    if (
      resolvedX + radius <= box.minX ||
      resolvedX - radius >= box.maxX ||
      resolvedZ + radius <= box.minZ ||
      resolvedZ - radius >= box.maxZ
    ) {
      continue;
    }
    if (isInsideDoorway(box, resolvedX, resolvedZ)) continue;

    // Inside a solid volume. Calculate shortest push-out distances.
    const distWest = Math.abs(resolvedX + radius - box.minX);
    const distEast = Math.abs(box.maxX - (resolvedX - radius));
    const distNorth = Math.abs(resolvedZ + radius - box.minZ);
    const distSouth = Math.abs(box.maxZ - (resolvedZ - radius));

    const minDist = Math.min(distWest, distEast, distNorth, distSouth);

    if (minDist === distWest) {
      resolvedX = box.minX - radius - 0.05;
    } else if (minDist === distEast) {
      resolvedX = box.maxX + radius + 0.05;
    } else if (minDist === distNorth) {
      resolvedZ = box.minZ - radius - 0.05;
    } else {
      resolvedZ = box.maxZ + radius + 0.05;
    }
  }

  return { x: resolvedX, z: resolvedZ };
}

/**
 * Resolves a move against the campus collision volumes, returning the
 * accepted position on each axis independently so the player slides along
 * walls instead of sticking to them. If the player is already penetrating a
 * volume, it depenetrates them first so they can never become immobilized.
 */
export function resolveMovement(
  fromX: number,
  fromZ: number,
  deltaX: number,
  deltaZ: number,
  radius: number
): { x: number; z: number } {
  // First ensure starting position is not embedded in a collider
  const freed = depenetrate(fromX, fromZ, radius);
  let x = freed.x;
  let z = freed.z;

  // Subdivide fast movement so a long frame cannot tunnel through a thin wall.
  const steps = Math.max(1, Math.ceil(Math.hypot(deltaX, deltaZ) / 0.18));
  for (let i = 0; i < steps; i++) {
    if (!collidesAt(x + deltaX / steps, z, radius)) x += deltaX / steps;
    if (!collidesAt(x, z + deltaZ / steps, radius)) z += deltaZ / steps;
  }
  return { x, z };
}
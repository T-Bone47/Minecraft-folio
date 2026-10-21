export const WORLD_BOUNDS = {
  minX: -40,
  maxX: 40,
  minZ: -40,
  maxZ: 40,
  size: 80,
  gridStep: 1,
};

// Circuit centerline curve waypoints (counter-clockwise loop)
export const CIRCUIT_WAYPOINTS: [number, number, number][] = [
  [-28, 0, -5],
  [-25, 0, -18],
  [-10, 0, -26],
  [12, 0, -25],
  [26, 0, -15],
  [28, 0, 0],
  [25, 0, 18],
  [12, 0, 26],
  [-8, 0, 25],
  [-24, 0, 16],
  [-28, 0, 2],
];

// Pit lane parallel to the start/finish straight
export const PIT_LANE_WAYPOINTS: [number, number, number][] = [
  [-18, 0, -4],
  [-12, 0, -8],
  [-4, 0, -12],
  [6, 0, -14],
];

// Key Camera Waypoints for the cinematic reveal
export const CINEMATIC_CAMERA_PATH = {
  startPos: [0, 28, 32] as [number, number, number],
  startLook: [0, 0, 0] as [number, number, number],
  circuitPos: [18, 14, -6] as [number, number, number],
  circuitLook: [0, 1, 0] as [number, number, number],
  garagePos: [-12, 3.2, 0] as [number, number, number],
  garageLook: [-12, 1.4, -8] as [number, number, number],
  playerSpawnPos: [-8, 2.0, 4] as [number, number, number],
  playerSpawnLook: [-12, 1.4, -8] as [number, number, number],
};

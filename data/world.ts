import { TRACK_RADIUS } from "@/lib/frontier/drive";
export const WORLD_BOUNDS = {
  minX: -55,
  maxX: 55,
  minZ: -55,
  maxZ: 55,
  size: 110,
  gridStep: 1,
};

// Circuit centerline curve waypoints (counter-clockwise loop)
export const CIRCUIT_WAYPOINTS: [number, number, number][] = Array.from({length:96},(_,i)=>[-TRACK_RADIUS*Math.cos(i*Math.PI/48),0,TRACK_RADIUS*Math.sin(i*Math.PI/48)]);

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

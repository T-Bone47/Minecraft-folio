import { generateReference, LapRecord, TelemetrySample, TRACK_RADIUS } from "@/lib/frontier/drive";

let cachedReferenceLap: LapRecord | null = null;

export function getGhostLapReference(): LapRecord {
  if (!cachedReferenceLap) {
    cachedReferenceLap = generateReference();
  }
  return cachedReferenceLap;
}

export interface GhostCarState {
  x: number;
  z: number;
  yaw: number;
  speed: number;
  time: number;
  progress: number;
  throttle: number;
  brake: number;
}

export interface GhostDeltaResult {
  deltaSeconds: number;
  formattedDelta: string;
  isAhead: boolean;
  ghostSpeedKmh: number;
  playerSpeedKmh: number;
  speedDeltaKmh: number;
}

/**
 * Samples ghost car kinematic position and heading for a given lap progress (0.0 to 1.0).
 */
export function sampleGhostCarAtProgress(progress: number): GhostCarState {
  const ref = getGhostLapReference();
  const samples = ref.samples;
  if (!samples.length) {
    return { x: -TRACK_RADIUS, z: 0, yaw: 0, speed: 0, time: 0, progress: 0, throttle: 0, brake: 0 };
  }

  const p = Math.max(0, Math.min(1, progress));

  // Find surrounding samples
  let lower = samples[0];
  let upper = samples[samples.length - 1];

  for (let i = 0; i < samples.length - 1; i++) {
    if (samples[i].lapProgress <= p && samples[i + 1].lapProgress >= p) {
      lower = samples[i];
      upper = samples[i + 1];
      break;
    }
  }

  const span = upper.lapProgress - lower.lapProgress || 0.001;
  const alpha = Math.max(0, Math.min(1, (p - lower.lapProgress) / span));

  const x = lower.x + (upper.x - lower.x) * alpha;
  const z = lower.z + (upper.z - lower.z) * alpha;
  const yaw = lower.yaw + (upper.yaw - lower.yaw) * alpha;
  const speed = lower.speed + (upper.speed - lower.speed) * alpha;
  const time = lower.timestamp + (upper.timestamp - lower.timestamp) * alpha;
  const throttle = lower.throttle + (upper.throttle - lower.throttle) * alpha;
  const brake = lower.brake + (upper.brake - lower.brake) * alpha;

  return { x, z, yaw, speed, time, progress: p, throttle, brake };
}

/**
 * Computes the real-time spatial delta between player lap time and Asish's authoritative ghost reference lap.
 * Negative delta = Player is FASTER / AHEAD (green).
 * Positive delta = Player is SLOWER / BEHIND (red).
 */
export function computeGhostLapDelta(
  playerTime: number,
  playerProgress: number,
  playerSpeed: number
): GhostDeltaResult {
  const ghost = sampleGhostCarAtProgress(playerProgress);
  const delta = playerTime - ghost.time;

  const playerSpeedKmh = Math.abs(playerSpeed) * 3.6;
  const ghostSpeedKmh = Math.abs(ghost.speed) * 3.6;

  const isAhead = delta <= 0;
  const sign = delta > 0 ? "+" : "-";
  const absDelta = Math.abs(delta).toFixed(2);

  return {
    deltaSeconds: Number(delta.toFixed(2)),
    formattedDelta: `${sign}${absDelta}s`,
    isAhead,
    ghostSpeedKmh: Math.round(ghostSpeedKmh),
    playerSpeedKmh: Math.round(playerSpeedKmh),
    speedDeltaKmh: Math.round(playerSpeedKmh - ghostSpeedKmh),
  };
}


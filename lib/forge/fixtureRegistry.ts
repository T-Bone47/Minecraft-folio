/**
 * FRONTIER SYSTEMS FORGE — FIXTURE REGISTRY
 * Deterministic telemetry packet fixtures for pipeline verification and fault testing.
 */

import type { TelemetryPacketFixture } from "./types";

export function generateTelemetryFixtures(count = 100): TelemetryPacketFixture[] {
  const fixtures: TelemetryPacketFixture[] = [];
  const baseTime = 1714000000000;

  for (let i = 0; i < count; i++) {
    const isLapMarker = i > 0 && i % 30 === 0;
    const lapNum = Math.floor(i / 30) + 1;
    const speed = 180 + Math.sin(i / 5) * 110; // 70 to 290 kph
    const throttle = speed > 200 ? 1.0 : 0.6;

    fixtures.push({
      id: `pkt-${i + 1}`,
      driverId: "VER",
      sessionTimeMs: baseTime + i * 16, // ~60 Hz intervals
      speedKph: Math.round(speed * 10) / 10,
      throttlePct: throttle,
      gear: Math.min(8, Math.max(1, Math.floor(speed / 40) + 1)),
      lapNumber: lapNum,
    });
  }

  // Inject 10 duplicate packets (e.g. retransmits on UDP buffer replay)
  const duplicateIndices = [12, 25, 38, 45, 59, 68, 77, 84, 91, 95];
  for (const idx of duplicateIndices) {
    if (fixtures[idx]) {
      const dup = { ...fixtures[idx], id: `${fixtures[idx].id}-DUP`, isDuplicate: true };
      fixtures.splice(idx + 1, 0, dup);
    }
  }

  // Inject 6 corrupted packets (e.g. sensor disconnect or corrupted bytes)
  const corruptIndices = [18, 32, 54, 71, 88, 102];
  for (const idx of corruptIndices) {
    if (fixtures[idx]) {
      fixtures[idx] = {
        ...fixtures[idx],
        speedKph: idx % 2 === 0 ? 840.5 : -12.0, // Impossible speed!
        isCorrupt: true,
        corruptReason: idx % 2 === 0 ? "SPEED_EXCEEDS_MAX_380" : "NEGATIVE_SPEED",
      };
    }
  }

  return fixtures;
}

export const PRESET_FIXTURE_SUITE = generateTelemetryFixtures(100);


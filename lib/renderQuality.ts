import type { DeviceTier } from "@/types/world";

/**
 * Render quality profiles.
 *
 * The device tier was previously detected and stored, then never read — every
 * visitor got the same expensive settings regardless of their hardware. These
 * profiles turn that number into concrete renderer configuration, and expose a
 * manual override so a visitor on a powerful machine is not stuck with whatever
 * their user-agent string guessed.
 */
export interface QualityProfile {
  id: DeviceTier;
  label: string;
  /** Device pixel ratio clamp handed to the R3F canvas. */
  dpr: [number, number];
  /** Enable the shadow map at all. */
  shadows: boolean;
  /** Shadow map resolution. Ignored when `shadows` is false. */
  shadowMapSize: number;
  /** Multisampling on the WebGL context. */
  antialias: boolean;
  /** Distance at which chunk detail layers are dropped. */
  lodDistance: number;
  /** Distance past which terrain stops casting shadows. */
  terrainShadowDistance: number;
  /** Draw the sky's drifting cloud layer. */
  clouds: boolean;
  /** Distance at which the atmosphere fades to fog. */
  fogFar: number;
}

export const QUALITY_PROFILES: Record<DeviceTier, QualityProfile> = {
  high: {
    id: "high",
    label: "HIGH",
    dpr: [1, 1.35],
    shadows: true,
    shadowMapSize: 1024,
    antialias: true,
    lodDistance: 80,
    terrainShadowDistance: 56,
    clouds: true,
    fogFar: 145,
  },
  medium: {
    id: "medium",
    label: "MEDIUM",
    dpr: [1, 1.2],
    shadows: true,
    shadowMapSize: 1024,
    antialias: true,
    lodDistance: 60,
    terrainShadowDistance: 40,
    clouds: true,
    fogFar: 120,
  },
  low: {
    id: "low",
    label: "LOW",
    dpr: [0.75, 1],
    shadows: false,
    shadowMapSize: 512,
    antialias: false,
    lodDistance: 44,
    terrainShadowDistance: 28,
    clouds: false,
    fogFar: 96,
  },
  mobile: {
    id: "mobile",
    label: "MOBILE",
    dpr: [1, 1.2],
    shadows: false,
    shadowMapSize: 512,
    antialias: false,
    // Mobile gets a guided location menu rather than FPS controls, so the
    // camera is usually parked and looking at one facility. Detail can be
    // dropped aggressively without the visitor ever walking the campus.
    lodDistance: 40,
    terrainShadowDistance: 24,
    clouds: false,
    fogFar: 90,
  },
};

/** Manual override offered in the HUD, plus automatic detection. */
export const QUALITY_OPTIONS: ReadonlyArray<{
  value: DeviceTier | "auto";
  label: string;
}> = [
  { value: "auto", label: "AUTO" },
  { value: "high", label: "HIGH" },
  { value: "medium", label: "MED" },
  { value: "low", label: "LOW" },
];

/**
 * Resolves the active profile.
 *
 * `auto` follows the detected device tier, but never *raises* quality above
 * what the hardware reports — an explicit override is the only way to opt in
 * to more expensive settings.
 */
export function resolveQualityProfile(
  override: DeviceTier | "auto",
  detectedTier: DeviceTier
): QualityProfile {
  if (override === "auto") return QUALITY_PROFILES[detectedTier];
  return QUALITY_PROFILES[override];
}
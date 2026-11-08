export type WorldMode =
  | "boot"
  | "cinematic"
  | "explore"
  | "inspect"
  | "map"
  | "command"
  | "fallback";

export type DeviceTier = "high" | "medium" | "low" | "mobile";

export type PerspectiveMode = "first-person" | "third-person";

export type CameraMode =
  | "boot"
  | "cinematic"
  | "explore"
  | "focus"
  | "inspect"
  | "map"
  | "guided";

export interface FacilityLocation {
  id: string;
  name: string;
  code: string;
  tagline: string;
  discipline: string;
  projectSlug?: string;
  coordinates: [number, number, number]; // [x, y, z] — authoritative anchor
  /** Authoritative player arrival position outside the facility entrance, clear of all collision. */
  approachPosition: [number, number, number];
  /** Direction vector or target coordinate the player camera/avatar looks toward upon arrival. */
  approachLookAt: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  colorAccent: string;
  accentRgb: [number, number, number];
  description: string;
  features: string[];
  /**
   * Ground reserved for this facility as [minX, maxX, minZ, maxZ].
   * The terrain generator flattens everything inside it to y=0 so buildings
   * never intersect hills. Single source of truth for the reservation.
   */
  pad: readonly [number, number, number, number];
  /**
   * Solid volumes the player collides with. A facility may declare several
   * boxes; `doorways` cut openings into a box so the player can enter it.
   */
  collision: ReadonlyArray<{
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    doorways?: ReadonlyArray<{
      axis: "x" | "z";
      from: number;
      to: number;
    }>;
  }>;
}

export interface InteractionTarget {
  id: string;
  type: "project" | "facility" | "vehicle" | "terminal" | "telemetry" | "portal";
  label: string;
  sublabel: string;
  position: [number, number, number];
  radius: number;
  projectSlug?: string;
  action: () => void;
}

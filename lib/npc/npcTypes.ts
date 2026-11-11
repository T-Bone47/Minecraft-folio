/**
 * LIVING NPC WORKFORCE — CORE TYPE CONTRACTS
 * Version 1.0.0 — ASISH: THE ENGINEERING FRONTIER
 */

export type NPCRole =
  | "race_engineer"
  | "vehicle_technician"
  | "data_engineer"
  | "garage_assistant"
  | "telemetry_analyst"
  | "systems_technician"
  | "ai_researcher"
  | "data_scientist"
  | "operations_coordinator";

export type NPCActivityState =
  | "IDLE"
  | "WALKING"
  | "WORKING"
  | "INSPECTING"
  | "TYPING"
  | "READING_TABLET"
  | "CARRYING_EQUIPMENT"
  | "DISCUSSING"
  | "REACTING"
  | "PLAYER_INTERACTION"
  | "INCIDENT_RESPONSE"
  | "SAFETY_CLEAR";

export type PropType = "none" | "tablet" | "wrench" | "scanner" | "toolcase";

export type FacilityId = "garage" | "telemetry" | "aiml" | "hq" | "simulation" | "operations";

export type Vec3 = [number, number, number];

export interface Workstation {
  id: string;
  facility: FacilityId;
  name: string;
  position: Vec3;
  facingYaw: number; // In radians
  permittedRoles: NPCRole[];
  interactionDistance: number;
  propRequired: PropType;
  defaultActivity: NPCActivityState;
  occupiedByNPCId: string | null;
  description: string;
}

export interface NPCTask {
  id: string;
  role: NPCRole;
  workstationId: string;
  targetPosition: Vec3;
  targetYaw: number;
  activity: NPCActivityState;
  durationS: number;
  prop: PropType;
  description: string;
  onArrivalDialogue?: string;
  isHighPriority?: boolean;
}

export interface NPCKinematicPose {
  phase: number;
  headYaw: number;
  headPitch: number;
  torsoLean: number;
  torsoBob: number;
  leftArmPitch: number;
  leftArmRoll: number;
  rightArmPitch: number;
  rightArmRoll: number;
  leftLegPitch: number;
  rightLegPitch: number;
  toolPitch: number;
}

export interface NPCDefinition {
  id: string;
  name: string;
  role: NPCRole;
  facility: FacilityId;
  assignedStationId: string;
  currentStationId: string;
  schedule: NPCTask[];
  homePosition: Vec3;
  homeYaw: number;
  currentPosition: Vec3;
  currentYaw: number;
  activity: NPCActivityState;
  heldProp: PropType;
  dialogue: {
    greeting: string;
    ambient: string;
    onLapCompleted?: string;
    onIncident?: string;
    onCarApproach?: string;
  };
}


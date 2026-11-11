/**
 * LIVING NPC WORKFORCE — WORKSTATION REGISTRY & NAVIGATION GRAPH
 * Authoritative workstations, permitted roles, and obstacle-free waypoints.
 * ASISH: THE ENGINEERING FRONTIER
 */

import type { Workstation, Vec3, NPCRole } from "./npcTypes";

export const CAMPUS_WORKSTATIONS: Workstation[] = [
  // --- RACE ENGINEERING GARAGE ---
  {
    id: "ws_garage_telemetry",
    facility: "garage",
    name: "Pit Wall Telemetry Terminal",
    position: [-12.0, 0.5, -13.8],
    facingYaw: Math.PI, // Facing monitors (North)
    permittedRoles: ["race_engineer", "data_engineer"],
    interactionDistance: 2.5,
    propRequired: "tablet",
    defaultActivity: "TYPING",
    occupiedByNPCId: null,
    description: "Multi-channel spatial telemetry and live delta monitor workstation.",
  },
  {
    id: "ws_garage_car_front_left",
    facility: "garage",
    name: "Frontier-01 Front-Left Hub & Suspension",
    position: [-13.4, 0.5, -6.6],
    facingYaw: -Math.PI / 2, // Facing car (East)
    permittedRoles: ["vehicle_technician"],
    interactionDistance: 2.2,
    propRequired: "wrench",
    defaultActivity: "INSPECTING",
    occupiedByNPCId: null,
    description: "Wheel hub nut torque check and pushrod suspension inspection.",
  },
  {
    id: "ws_garage_car_rear_right",
    facility: "garage",
    name: "Frontier-01 Rear-Right Wing & Diffuser",
    position: [-10.6, 0.5, -9.4],
    facingYaw: Math.PI / 2, // Facing car (West)
    permittedRoles: ["vehicle_technician"],
    interactionDistance: 2.2,
    propRequired: "scanner",
    defaultActivity: "INSPECTING",
    occupiedByNPCId: null,
    description: "Rear wing flap angle calibration and diffuser airflow check.",
  },
  {
    id: "ws_garage_car_front_wing",
    facility: "garage",
    name: "Frontier-01 Nose Cone & Front Aero Flaps",
    position: [-12.0, 0.5, -5.2],
    facingYaw: 0, // Facing car nose (South)
    permittedRoles: ["vehicle_technician", "garage_assistant"],
    interactionDistance: 2.0,
    propRequired: "wrench",
    defaultActivity: "INSPECTING",
    occupiedByNPCId: null,
    description: "Front endplate aero flap angle and pitot tube alignment.",
  },
  {
    id: "ws_garage_data_console",
    facility: "garage",
    name: "AI Strategy Terminal & Server Rack",
    position: [-8.8, 0.5, -5.5],
    facingYaw: -2.35, // Facing North-West
    permittedRoles: ["data_engineer", "race_engineer"],
    interactionDistance: 2.5,
    propRequired: "tablet",
    defaultActivity: "TYPING",
    occupiedByNPCId: null,
    description: "Race strategy core and server telemetry bridge console.",
  },
  {
    id: "ws_garage_tyre_rack",
    facility: "garage",
    name: "Thermal Tyre Warmer Blankets",
    position: [-16.8, 0.5, -9.5],
    facingYaw: Math.PI / 2, // Facing tyre rack (East)
    permittedRoles: ["garage_assistant", "vehicle_technician"],
    interactionDistance: 2.2,
    propRequired: "scanner",
    defaultActivity: "INSPECTING",
    occupiedByNPCId: null,
    description: "C3 Medium slick tyre thermal blanket regulation and pressure audit.",
  },
  {
    id: "ws_garage_tool_rack",
    facility: "garage",
    name: "High-Pressure Air Tools & Diagnostics",
    position: [-7.2, 0.5, -9.5],
    facingYaw: -Math.PI / 2, // Facing tool rack (West)
    permittedRoles: ["garage_assistant", "vehicle_technician"],
    interactionDistance: 2.2,
    propRequired: "toolcase",
    defaultActivity: "CARRYING_EQUIPMENT",
    occupiedByNPCId: null,
    description: "Pneumatic tool pressure verification and hardware trolley.",
  },
  {
    id: "ws_garage_briefing_point",
    facility: "garage",
    name: "Pit Lane Operations Briefing Point",
    position: [-12.0, 0.5, -3.4],
    facingYaw: 0, // Facing track (South)
    permittedRoles: ["race_engineer", "vehicle_technician", "data_engineer"],
    interactionDistance: 3.0,
    propRequired: "tablet",
    defaultActivity: "DISCUSSING",
    occupiedByNPCId: null,
    description: "Pit wall coordination and track entry debrief waypoint.",
  },
  {
    id: "ws_garage_safety_curb",
    facility: "garage",
    name: "Garage Safety Clear Zone",
    position: [-14.5, 0.5, -7.5],
    facingYaw: Math.PI / 2, // Facing car from safe distance (East)
    permittedRoles: ["vehicle_technician", "garage_assistant"],
    interactionDistance: 3.5,
    propRequired: "none",
    defaultActivity: "SAFETY_CLEAR",
    occupiedByNPCId: null,
    description: "Safe standby location when the single-seater vehicle is live/occupied.",
  },

  // --- TELEMETRY TOWER ---
  {
    id: "ws_telemetry_stream_desk",
    facility: "telemetry",
    name: "Telemetry Ingestion Control Console",
    position: [14.0, 0.5, -18.0],
    facingYaw: Math.PI,
    permittedRoles: ["telemetry_analyst"],
    interactionDistance: 2.5,
    propRequired: "tablet",
    defaultActivity: "TYPING",
    occupiedByNPCId: null,
    description: "Stream ingestion rate and timestamp sequence monitoring station.",
  },
  {
    id: "ws_telemetry_server_rack",
    facility: "telemetry",
    name: "Stage 3 Ingestion Buffer Server Rack",
    position: [16.2, 0.5, -19.5],
    facingYaw: -Math.PI / 2,
    permittedRoles: ["systems_technician"],
    interactionDistance: 2.2,
    propRequired: "scanner",
    defaultActivity: "INSPECTING",
    occupiedByNPCId: null,
    description: "Packet sequence reordering buffer and network packet trace audit.",
  },

  // --- AI / ML LAB ---
  {
    id: "ws_aiml_eval_bench",
    facility: "aiml",
    name: "Tyre Model Evaluation Terminal",
    position: [0.0, 0.5, 24.0],
    facingYaw: Math.PI,
    permittedRoles: ["ai_researcher"],
    interactionDistance: 2.5,
    propRequired: "tablet",
    defaultActivity: "TYPING",
    occupiedByNPCId: null,
    description: "Holdout R² calculation and live streaming degradation evaluation.",
  },
  {
    id: "ws_aiml_dataset_board",
    facility: "aiml",
    name: "Chronological Stint Dataset Board",
    position: [3.5, 0.5, 23.0],
    facingYaw: -Math.PI / 2,
    permittedRoles: ["data_scientist", "ai_researcher"],
    interactionDistance: 2.5,
    propRequired: "tablet",
    defaultActivity: "READING_TABLET",
    occupiedByNPCId: null,
    description: "Feature correlation matrix and temporal leakage inspection panel.",
  },

  // --- ENGINEERING HQ ---
  {
    id: "ws_hq_operations_console",
    facility: "hq",
    name: "Engineering Operations Central Console",
    position: [-27.5, 0.5, -17.5],
    facingYaw: 0,
    permittedRoles: ["operations_coordinator"],
    interactionDistance: 3.0,
    propRequired: "tablet",
    defaultActivity: "READING_TABLET",
    occupiedByNPCId: null,
    description: "Campus trials status and mission coordination console.",
  },
  {
    id: "ws_hq_strategy_table",
    facility: "hq",
    name: "Technical Operations Wall",
    position: [-24.0, 0.5, -20.0],
    facingYaw: -Math.PI / 2,
    permittedRoles: ["operations_coordinator"],
    interactionDistance: 3.0,
    propRequired: "none",
    defaultActivity: "TYPING",
    occupiedByNPCId: null,
    description: "Career milestones, academic research and systems architecture wall.",
  },
];

// --- WAYPOINT GRAPH FOR OBSTACLE-FREE LOCAL NAVIGATION ---
export interface NavWaypoint {
  id: string;
  facility: string;
  position: Vec3;
  connectedWaypointIds: string[];
}

export const CAMPUS_NAV_WAYPOINTS: Record<string, NavWaypoint> = {
  // Garage perimeter loop around the central F1 car
  wp_garage_front: {
    id: "wp_garage_front",
    facility: "garage",
    position: [-12.0, 0.5, -4.0],
    connectedWaypointIds: ["wp_garage_left", "wp_garage_right"],
  },
  wp_garage_left: {
    id: "wp_garage_left",
    facility: "garage",
    position: [-14.5, 0.5, -7.5],
    connectedWaypointIds: ["wp_garage_front", "wp_garage_rear"],
  },
  wp_garage_right: {
    id: "wp_garage_right",
    facility: "garage",
    position: [-9.5, 0.5, -7.5],
    connectedWaypointIds: ["wp_garage_front", "wp_garage_rear"],
  },
  wp_garage_rear: {
    id: "wp_garage_rear",
    facility: "garage",
    position: [-12.0, 0.5, -12.5],
    connectedWaypointIds: ["wp_garage_left", "wp_garage_right"],
  },

  // Telemetry Tower corridor
  wp_telemetry_center: {
    id: "wp_telemetry_center",
    facility: "telemetry",
    position: [14.0, 0.5, -16.0],
    connectedWaypointIds: ["wp_telemetry_desk", "wp_telemetry_rack"],
  },
  wp_telemetry_desk: {
    id: "wp_telemetry_desk",
    facility: "telemetry",
    position: [14.0, 0.5, -18.0],
    connectedWaypointIds: ["wp_telemetry_center"],
  },
  wp_telemetry_rack: {
    id: "wp_telemetry_rack",
    facility: "telemetry",
    position: [16.2, 0.5, -19.5],
    connectedWaypointIds: ["wp_telemetry_center"],
  },

  // AI/ML Lab corridor
  wp_aiml_center: {
    id: "wp_aiml_center",
    facility: "aiml",
    position: [1.5, 0.5, 22.0],
    connectedWaypointIds: ["wp_aiml_bench", "wp_aiml_board"],
  },
  wp_aiml_bench: {
    id: "wp_aiml_bench",
    facility: "aiml",
    position: [0.0, 0.5, 24.0],
    connectedWaypointIds: ["wp_aiml_center"],
  },
  wp_aiml_board: {
    id: "wp_aiml_board",
    facility: "aiml",
    position: [3.5, 0.5, 23.0],
    connectedWaypointIds: ["wp_aiml_center"],
  },

  // Engineering HQ corridor
  wp_hq_center: {
    id: "wp_hq_center",
    facility: "hq",
    position: [-25.5, 0.5, -18.5],
    connectedWaypointIds: ["wp_hq_console", "wp_hq_table"],
  },
  wp_hq_console: {
    id: "wp_hq_console",
    facility: "hq",
    position: [-27.5, 0.5, -17.5],
    connectedWaypointIds: ["wp_hq_center"],
  },
  wp_hq_table: {
    id: "wp_hq_table",
    facility: "hq",
    position: [-24.0, 0.5, -20.0],
    connectedWaypointIds: ["wp_hq_center"],
  },
};

export function getWorkstationById(id: string): Workstation | undefined {
  return CAMPUS_WORKSTATIONS.find((w) => w.id === id);
}

export function getWorkstationsByFacility(facility: string): Workstation[] {
  return CAMPUS_WORKSTATIONS.filter((w) => w.facility === facility);
}

/**
 * Calculates a simple obstacle-free path from start to end position using waypoints
 */
export function planPath(
  facility: string,
  start: Vec3,
  destination: Vec3
): Vec3[] {
  const directDist = Math.hypot(start[0] - destination[0], start[2] - destination[2]);
  if (directDist < 1.8) {
    return [destination];
  }

  // Find nearest start waypoint and nearest destination waypoint in this facility
  const facilityWps = Object.values(CAMPUS_NAV_WAYPOINTS).filter(
    (wp) => wp.facility === facility
  );
  if (facilityWps.length === 0) {
    return [destination];
  }

  let nearestStartWp = facilityWps[0];
  let minStartDist = Infinity;
  let nearestDestWp = facilityWps[0];
  let minDestDist = Infinity;

  for (const wp of facilityWps) {
    const dStart = Math.hypot(start[0] - wp.position[0], start[2] - wp.position[2]);
    if (dStart < minStartDist) {
      minStartDist = dStart;
      nearestStartWp = wp;
    }
    const dDest = Math.hypot(destination[0] - wp.position[0], destination[2] - wp.position[2]);
    if (dDest < minDestDist) {
      minDestDist = dDest;
      nearestDestWp = wp;
    }
  }

  if (nearestStartWp.id === nearestDestWp.id) {
    return [nearestStartWp.position, destination];
  }

  return [nearestStartWp.position, nearestDestWp.position, destination];
}


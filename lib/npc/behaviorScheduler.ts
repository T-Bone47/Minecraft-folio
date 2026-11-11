/**
 * LIVING NPC WORKFORCE — BEHAVIOR STATE MACHINE & TASK SCHEDULER
 * Finite-State Machine, priority scheduling, and event-driven reactions.
 * ASISH: THE ENGINEERING FRONTIER
 */

import type {
  NPCDefinition,
  NPCTask,
  NPCActivityState,
  Vec3,
} from "./npcTypes";
import { getWorkstationById, planPath } from "./workstationRegistry";

export const CAMPUS_WORKFORCE_DEFINITIONS: NPCDefinition[] = [
  // 1. Marcus Vance — Race Performance Lead (Garage)
  {
    id: "npc_marcus_vance",
    name: "Marcus Vance",
    role: "race_engineer",
    facility: "garage",
    assignedStationId: "ws_garage_telemetry",
    currentStationId: "ws_garage_telemetry",
    homePosition: [-12.0, 0.5, -13.8],
    homeYaw: Math.PI,
    currentPosition: [-12.0, 0.5, -13.8],
    currentYaw: Math.PI,
    activity: "TYPING",
    heldProp: "tablet",
    dialogue: {
      greeting: "Marcus Vance here, Race Performance Lead. We are analyzing the Frontier-01's telemetry traces.",
      ambient: "Looking at distance-aligned speed delta over Turn 3. Driver is losing three tenths on entry.",
      onLapCompleted: "Outstanding lap! Telemetry pipeline ingested your data. Check the monitor for sector splits.",
      onCarApproach: "Car is primed for track testing. Check tyre blanket temps before heading onto the circuit.",
    },
    schedule: [
      {
        id: "task_marcus_telemetry_monitor",
        role: "race_engineer",
        workstationId: "ws_garage_telemetry",
        targetPosition: [-12.0, 0.5, -13.8],
        targetYaw: Math.PI,
        activity: "TYPING",
        durationS: 16,
        prop: "tablet",
        description: "Reviewing multi-channel telemetry and sector time deltas.",
      },
      {
        id: "task_marcus_pit_briefing",
        role: "race_engineer",
        workstationId: "ws_garage_briefing_point",
        targetPosition: [-12.0, 0.5, -3.4],
        targetYaw: 0,
        activity: "DISCUSSING",
        durationS: 12,
        prop: "tablet",
        description: "Coordinating race strategy at pit wall entry.",
      },
      {
        id: "task_marcus_strategy_core",
        role: "race_engineer",
        workstationId: "ws_garage_data_console",
        targetPosition: [-8.8, 0.5, -5.5],
        targetYaw: -2.35,
        activity: "TYPING",
        durationS: 14,
        prop: "tablet",
        description: "Cross-checking tyre degradation against RaceMind AI models.",
      },
    ],
  },

  // 2. Elena Cruz — Lead Vehicle Technician (Garage)
  {
    id: "npc_elena_cruz",
    name: "Elena Cruz",
    role: "vehicle_technician",
    facility: "garage",
    assignedStationId: "ws_garage_car_front_left",
    currentStationId: "ws_garage_car_front_left",
    homePosition: [-13.4, 0.5, -6.6],
    homeYaw: -Math.PI / 2,
    currentPosition: [-13.4, 0.5, -6.6],
    currentYaw: -Math.PI / 2,
    activity: "INSPECTING",
    heldProp: "wrench",
    dialogue: {
      greeting: "Elena Cruz, Vehicle Technician. Keep clear of the wheel hubs while the pneumatic wrench is active.",
      ambient: "Torquing front-left wheel nut to 580 Nm. Pushrod damper pressures are optimal.",
      onLapCompleted: "Brake disk temperatures reached 640°C in Turn 3. Bleeding the front cooling ducts now.",
      onCarApproach: "Frontier-01 is green. Pushrod dampers and carbon wishbones verified. Ready for ignition.",
    },
    schedule: [
      {
        id: "task_elena_front_left_wheel",
        role: "vehicle_technician",
        workstationId: "ws_garage_car_front_left",
        targetPosition: [-13.4, 0.5, -6.6],
        targetYaw: -Math.PI / 2,
        activity: "INSPECTING",
        durationS: 18,
        prop: "wrench",
        description: "Torquing center-lock wheel nut and checking pushrod suspension.",
      },
      {
        id: "task_elena_front_wing_aero",
        role: "vehicle_technician",
        workstationId: "ws_garage_car_front_wing",
        targetPosition: [-12.0, 0.5, -5.2],
        targetYaw: 0,
        activity: "INSPECTING",
        durationS: 14,
        prop: "wrench",
        description: "Calibrating front wing endplate angle and pitot tube sensors.",
      },
      {
        id: "task_elena_rear_right_diffuser",
        role: "vehicle_technician",
        workstationId: "ws_garage_car_rear_right",
        targetPosition: [-10.6, 0.5, -9.4],
        targetYaw: Math.PI / 2,
        activity: "INSPECTING",
        durationS: 16,
        prop: "scanner",
        description: "Laser scanning rear wing flap slot-gap and diffuser strakes.",
      },
      {
        id: "task_elena_air_tools",
        role: "vehicle_technician",
        workstationId: "ws_garage_tool_rack",
        targetPosition: [-7.2, 0.5, -9.5],
        targetYaw: -Math.PI / 2,
        activity: "CARRYING_EQUIPMENT",
        durationS: 10,
        prop: "toolcase",
        description: "Inspecting pneumatic torque wrenches and diagnostic probes.",
      },
    ],
  },

  // 3. Leo Patel — Data Systems Engineer (Garage)
  {
    id: "npc_leo_patel",
    name: "Leo Patel",
    role: "data_engineer",
    facility: "garage",
    assignedStationId: "ws_garage_data_console",
    currentStationId: "ws_garage_data_console",
    homePosition: [-8.8, 0.5, -5.5],
    homeYaw: -2.35,
    currentPosition: [-8.8, 0.5, -5.5],
    currentYaw: -2.35,
    activity: "TYPING",
    heldProp: "tablet",
    dialogue: {
      greeting: "Leo Patel, Data Systems Engineer. Monitoring telemetry packet pipelines between car and pit wall.",
      ambient: "CAN bus telemetry telemetry streaming at 60 Hz with 0 dropped frames. CRC verification is clean.",
      onLapCompleted: "New lap stored! Packet buffer committed to local time-series store.",
    },
    schedule: [
      {
        id: "task_leo_strategy_console",
        role: "data_engineer",
        workstationId: "ws_garage_data_console",
        targetPosition: [-8.8, 0.5, -5.5],
        targetYaw: -2.35,
        activity: "TYPING",
        durationS: 20,
        prop: "tablet",
        description: "Monitoring live telemetry packet queues and buffer memory.",
      },
      {
        id: "task_leo_tyre_blanket_scan",
        role: "data_engineer",
        workstationId: "ws_garage_tyre_rack",
        targetPosition: [-16.8, 0.5, -9.5],
        targetYaw: Math.PI / 2,
        activity: "INSPECTING",
        durationS: 14,
        prop: "scanner",
        description: "Checking thermocouple telemetry on C3 Medium slick tyres.",
      },
      {
        id: "task_leo_telemetry_compare",
        role: "data_engineer",
        workstationId: "ws_garage_telemetry",
        targetPosition: [-12.0, 0.5, -13.8],
        targetYaw: Math.PI,
        activity: "DISCUSSING",
        durationS: 12,
        prop: "tablet",
        description: "Discussing sensor calibration with Marcus at pit wall.",
      },
    ],
  },

  // 4. Toby Vance — Garage Operations Assistant (Garage)
  {
    id: "npc_toby_vance",
    name: "Toby Vance",
    role: "garage_assistant",
    facility: "garage",
    assignedStationId: "ws_garage_tool_rack",
    currentStationId: "ws_garage_tool_rack",
    homePosition: [-7.2, 0.5, -9.5],
    homeYaw: -Math.PI / 2,
    currentPosition: [-7.2, 0.5, -9.5],
    currentYaw: -Math.PI / 2,
    activity: "CARRYING_EQUIPMENT",
    heldProp: "toolcase",
    dialogue: {
      greeting: "Toby Vance, Operations Assistant. Transporting spare carbon parts and wheel heat blankets.",
      ambient: "Tyre warmers are holding steady at 80°C. Nitrogen canisters pressurized to 220 bar.",
    },
    schedule: [
      {
        id: "task_toby_carry_tools",
        role: "garage_assistant",
        workstationId: "ws_garage_tyre_rack",
        targetPosition: [-16.8, 0.5, -9.5],
        targetYaw: Math.PI / 2,
        activity: "CARRYING_EQUIPMENT",
        durationS: 16,
        prop: "toolcase",
        description: "Transporting thermal regulation gear to tyre racks.",
      },
      {
        id: "task_toby_inspect_nose",
        role: "garage_assistant",
        workstationId: "ws_garage_car_front_wing",
        targetPosition: [-12.0, 0.5, -5.2],
        targetYaw: 0,
        activity: "INSPECTING",
        durationS: 12,
        prop: "wrench",
        description: "Wiping nose camera lenses and checking pitot tube covers.",
      },
      {
        id: "task_toby_return_tools",
        role: "garage_assistant",
        workstationId: "ws_garage_tool_rack",
        targetPosition: [-7.2, 0.5, -9.5],
        targetYaw: -Math.PI / 2,
        activity: "CARRYING_EQUIPMENT",
        durationS: 14,
        prop: "toolcase",
        description: "Restocking diagnostic trolleys and nitrogen lines.",
      },
    ],
  },

  // 5. Viktor Cole — Systems Reliability Lead (Telemetry Tower)
  {
    id: "npc_viktor_cole",
    name: "Viktor Cole",
    role: "systems_technician",
    facility: "telemetry",
    assignedStationId: "ws_telemetry_stream_desk",
    currentStationId: "ws_telemetry_stream_desk",
    homePosition: [14.0, 0.5, -18.0],
    homeYaw: Math.PI,
    currentPosition: [14.0, 0.5, -18.0],
    currentYaw: Math.PI,
    activity: "TYPING",
    heldProp: "tablet",
    dialogue: {
      greeting: "Viktor Cole, Systems Reliability Lead. Telemetry ingestion broker operating at 60 Hz.",
      ambient: "Deduplication sliding window is holding 0 dropped packets and monotonic ordering.",
      onIncident: "Packet sequence inversion detected at Stage 3! Inspecting reorder buffer.",
    },
    schedule: [
      {
        id: "task_viktor_stream_desk",
        role: "systems_technician",
        workstationId: "ws_telemetry_stream_desk",
        targetPosition: [14.0, 0.5, -18.0],
        targetYaw: Math.PI,
        activity: "TYPING",
        durationS: 20,
        prop: "tablet",
        description: "Auditing UDP stream packet arrival timestamps.",
      },
      {
        id: "task_viktor_server_rack",
        role: "systems_technician",
        workstationId: "ws_telemetry_server_rack",
        targetPosition: [16.2, 0.5, -19.5],
        targetYaw: -Math.PI / 2,
        activity: "INSPECTING",
        durationS: 16,
        prop: "scanner",
        description: "Diagnosing server rack memory ring buffers.",
      },
    ],
  },

  // 6. Dr. Aris Thorne — AI Research Lead (AI/ML Lab)
  {
    id: "npc_aris_thorne",
    name: "Dr. Aris Thorne",
    role: "ai_researcher",
    facility: "aiml",
    assignedStationId: "ws_aiml_eval_bench",
    currentStationId: "ws_aiml_eval_bench",
    homePosition: [0.0, 0.5, 24.0],
    homeYaw: Math.PI,
    currentPosition: [0.0, 0.5, 24.0],
    currentYaw: Math.PI,
    activity: "TYPING",
    heldProp: "tablet",
    dialogue: {
      greeting: "Dr. Aris Thorne, AI Research Lead. Verifying neural tyre degradation generalization.",
      ambient: "Temporal block splitting prevents auto-correlated future signal from leaking into training folds.",
    },
    schedule: [
      {
        id: "task_aris_eval_bench",
        role: "ai_researcher",
        workstationId: "ws_aiml_eval_bench",
        targetPosition: [0.0, 0.5, 24.0],
        targetYaw: Math.PI,
        activity: "TYPING",
        durationS: 22,
        prop: "tablet",
        description: "Evaluating holdout RMSE curves against real simulator laps.",
      },
      {
        id: "task_aris_dataset_board",
        role: "ai_researcher",
        workstationId: "ws_aiml_dataset_board",
        targetPosition: [3.5, 0.5, 23.0],
        targetYaw: -Math.PI / 2,
        activity: "READING_TABLET",
        durationS: 18,
        prop: "tablet",
        description: "Reviewing feature attribution weights and target proxy leakage flags.",
      },
    ],
  },
];

export interface NPCStateInstance {
  definition: NPCDefinition;
  currentTaskIndex: number;
  taskTimer: number;
  activity: NPCActivityState;
  position: Vec3;
  yaw: number;
  pathWaypoints: Vec3[];
  pathIndex: number;
  heldProp: "none" | "tablet" | "wrench" | "scanner" | "toolcase";
  interruptedByPlayer: boolean;
  safetyOverrideActive: boolean;
  activeDialogue: string;
}

export function initializeWorkforce(): Record<string, NPCStateInstance> {
  const instances: Record<string, NPCStateInstance> = {};
  for (const def of CAMPUS_WORKFORCE_DEFINITIONS) {
    instances[def.id] = {
      definition: def,
      currentTaskIndex: 0,
      taskTimer: 0,
      activity: def.activity,
      position: [...def.homePosition],
      yaw: def.homeYaw,
      pathWaypoints: [],
      pathIndex: 0,
      heldProp: def.heldProp,
      interruptedByPlayer: false,
      safetyOverrideActive: false,
      activeDialogue: def.dialogue.ambient,
    };
  }
  return instances;
}

export interface SimulationStepInput {
  dt: number;
  isPlayerDriving: boolean;
  isPlayerNearbyF1Car: boolean;
  playerPos: Vec3;
  interactedNPCId: string | null;
  lapCompletedTriggered: boolean;
  pipelineFaultActive: boolean;
}

export function stepNPCWorkforce(
  instances: Record<string, NPCStateInstance>,
  input: SimulationStepInput
): Record<string, NPCStateInstance> {
  const {
    dt,
    isPlayerDriving,
    isPlayerNearbyF1Car,
    playerPos,
    interactedNPCId,
    lapCompletedTriggered,
    pipelineFaultActive,
  } = input;

  for (const [id, npc] of Object.entries(instances)) {
    // 1. Priority A: Player Interaction Override
    if (interactedNPCId === id) {
      npc.interruptedByPlayer = true;
      npc.activity = "PLAYER_INTERACTION";
      // Face towards player
      const dx = playerPos[0] - npc.position[0];
      const dz = playerPos[2] - npc.position[2];
      npc.yaw = Math.atan2(dx, dz);
      npc.activeDialogue = npc.definition.dialogue.greeting;
      continue;
    } else if (npc.interruptedByPlayer) {
      // Released from player interaction: resume previous schedule safely
      npc.interruptedByPlayer = false;
      const currentTask = npc.definition.schedule[npc.currentTaskIndex];
      npc.activity = currentTask.activity;
      npc.heldProp = currentTask.prop;
      npc.activeDialogue = npc.definition.dialogue.ambient;
    }

    // 2. Priority B: Vehicle Safety Override (Garage mechanics step back if car is driven or approached)
    const isCarWorkstation =
      npc.definition.schedule[npc.currentTaskIndex]?.workstationId.startsWith("ws_garage_car_");

    if (
      (isPlayerDriving || isPlayerNearbyF1Car) &&
      npc.definition.role === "vehicle_technician" &&
      isCarWorkstation
    ) {
      npc.safetyOverrideActive = true;
      const safetyStation = getWorkstationById("ws_garage_safety_curb")!;
      // Smoothly move to safety curb
      const distToSafety = Math.hypot(
        npc.position[0] - safetyStation.position[0],
        npc.position[2] - safetyStation.position[2]
      );
      if (distToSafety > 0.4) {
        npc.activity = "WALKING";
        const dx = safetyStation.position[0] - npc.position[0];
        const dz = safetyStation.position[2] - npc.position[2];
        npc.yaw = Math.atan2(dx, dz);
        const speed = 1.6;
        npc.position[0] += Math.sin(npc.yaw) * speed * dt;
        npc.position[2] += Math.cos(npc.yaw) * speed * dt;
      } else {
        npc.activity = "SAFETY_CLEAR";
        npc.yaw = safetyStation.facingYaw;
        npc.heldProp = "none";
        npc.activeDialogue =
          npc.definition.dialogue.onCarApproach || "Track is live! Stand clear of vehicle departure zone.";
      }
      continue;
    } else if (npc.safetyOverrideActive && !isPlayerDriving && !isPlayerNearbyF1Car) {
      // Resume normal mechanic duties
      npc.safetyOverrideActive = false;
      const task = npc.definition.schedule[npc.currentTaskIndex];
      npc.activity = task.activity;
      npc.heldProp = task.prop;
      npc.activeDialogue = npc.definition.dialogue.ambient;
    }

    // 3. Priority C: Event-Driven Incident Reactions
    if (lapCompletedTriggered && id === "npc_marcus_vance") {
      npc.activeDialogue = npc.definition.dialogue.onLapCompleted!;
      // Temporarily snap focus to telemetry monitor
      const telemStation = getWorkstationById("ws_garage_telemetry")!;
      npc.activity = "TYPING";
      npc.yaw = telemStation.facingYaw;
      npc.heldProp = "tablet";
      continue;
    }

    if (pipelineFaultActive && id === "npc_viktor_cole") {
      npc.activeDialogue = npc.definition.dialogue.onIncident!;
      npc.activity = "INCIDENT_RESPONSE";
      continue;
    }

    // 4. Priority D: Regular Scheduled Locomotion & Station Work
    const currentTask = npc.definition.schedule[npc.currentTaskIndex];
    if (!currentTask) continue;

    // Check if NPC is in transit (walking to target workstation)
    if (npc.pathWaypoints.length > 0 && npc.pathIndex < npc.pathWaypoints.length) {
      npc.activity = "WALKING";
      const targetWp = npc.pathWaypoints[npc.pathIndex];
      const dx = targetWp[0] - npc.position[0];
      const dz = targetWp[2] - npc.position[2];
      const dist = Math.hypot(dx, dz);

      if (dist < 0.3) {
        // Reached current waypoint
        npc.pathIndex++;
        if (npc.pathIndex >= npc.pathWaypoints.length) {
          // Reached final destination workstation!
          npc.pathWaypoints = [];
          npc.pathIndex = 0;
          npc.position = [...currentTask.targetPosition];
          npc.yaw = currentTask.targetYaw;
          npc.activity = currentTask.activity;
          npc.heldProp = currentTask.prop;
          npc.taskTimer = 0;
        }
      } else {
        // Move towards target waypoint
        const walkSpeed = 1.4; // Realistic walking pace 1.4 m/s
        const angle = Math.atan2(dx, dz);
        npc.yaw = angle;
        npc.position[0] += Math.sin(angle) * walkSpeed * dt;
        npc.position[2] += Math.cos(angle) * walkSpeed * dt;
      }
      continue;
    }

    // NPC is actively working at the workstation
    npc.activity = currentTask.activity;
    npc.heldProp = currentTask.prop;
    npc.taskTimer += dt;

    // Has current task duration finished?
    if (npc.taskTimer >= currentTask.durationS) {
      // Transition to next scheduled task
      npc.currentTaskIndex = (npc.currentTaskIndex + 1) % npc.definition.schedule.length;
      const nextTask = npc.definition.schedule[npc.currentTaskIndex];
      npc.taskTimer = 0;

      // Plan obstacle-free path to next workstation
      npc.pathWaypoints = planPath(
        npc.definition.facility,
        npc.position,
        nextTask.targetPosition
      );
      npc.pathIndex = 0;
      npc.activity = "WALKING";
    }
  }

  return instances;
}


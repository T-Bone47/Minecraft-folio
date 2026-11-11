import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CAMPUS_WORKFORCE_DEFINITIONS,
  initializeWorkforce,
  stepNPCWorkforce,
} from "@/lib/npc/behaviorScheduler";
import {
  CAMPUS_WORKSTATIONS,
  getWorkstationById,
  planPath,
} from "@/lib/npc/workstationRegistry";
import {
  createInitialPose,
  updateNPCPose,
} from "@/lib/npc/npcKinematics";

test("Living NPC Workforce definitions and facility distribution", () => {
  assert.ok(CAMPUS_WORKFORCE_DEFINITIONS.length >= 6);

  // Verify Garage workforce
  const garageWorkers = CAMPUS_WORKFORCE_DEFINITIONS.filter(
    (w) => w.facility === "garage"
  );
  assert.equal(garageWorkers.length, 4, "Garage must contain 4 active workers");

  const roles = garageWorkers.map((w) => w.role);
  assert.ok(roles.includes("race_engineer"));
  assert.ok(roles.includes("vehicle_technician"));
  assert.ok(roles.includes("data_engineer"));
  assert.ok(roles.includes("garage_assistant"));

  // Verify Telemetry and AI Lab workers
  const telemetryWorkers = CAMPUS_WORKFORCE_DEFINITIONS.filter(
    (w) => w.facility === "telemetry"
  );
  assert.ok(telemetryWorkers.length >= 1);

  const aimlWorkers = CAMPUS_WORKFORCE_DEFINITIONS.filter(
    (w) => w.facility === "aiml"
  );
  assert.ok(aimlWorkers.length >= 1);

  // Each worker has valid schedules
  for (const worker of CAMPUS_WORKFORCE_DEFINITIONS) {
    assert.ok(worker.id.length > 0);
    assert.ok(worker.name.length > 0);
    assert.ok(worker.schedule.length >= 2, `${worker.name} must have >= 2 tasks in schedule`);
    for (const task of worker.schedule) {
      assert.ok(task.durationS > 0);
      assert.ok(task.workstationId.length > 0);
      assert.ok(getWorkstationById(task.workstationId), `Task station ${task.workstationId} must exist`);
    }
  }
});

test("Campus Workstations and obstacle-free waypoint navigation", () => {
  assert.ok(CAMPUS_WORKSTATIONS.length >= 10);

  // Verify Garage car workstations
  const frontLeft = getWorkstationById("ws_garage_car_front_left");
  const rearRight = getWorkstationById("ws_garage_car_rear_right");
  const frontWing = getWorkstationById("ws_garage_car_front_wing");
  const safetyCurb = getWorkstationById("ws_garage_safety_curb");

  assert.ok(frontLeft);
  assert.ok(rearRight);
  assert.ok(frontWing);
  assert.ok(safetyCurb);

  // Test waypoint path generation inside the garage
  const path = planPath("garage", [-12.0, 0.5, -13.8], [-13.4, 0.5, -6.6]);
  assert.ok(path.length >= 2);
  // Destination must be the final waypoint
  const finalWp = path[path.length - 1];
  assert.equal(finalWp[0], -13.4);
  assert.equal(finalWp[2], -6.6);
});

test("Procedural NPC Kinematics computes bounded limb angles for all activities", () => {
  const pose = createInitialPose();
  assert.equal(pose.leftLegPitch, 0);
  assert.equal(pose.rightLegPitch, 0);

  // Test Walking Kinematics
  const walkingPose = updateNPCPose({ ...pose }, {
    dt: 0.016,
    time: 1.0,
    activity: "WALKING",
    speed: 1.4,
    npcPosition: [0, 0, 0],
    npcYaw: 0,
  });
  assert.ok(Math.abs(walkingPose.leftLegPitch) > 0);
  assert.ok(walkingPose.torsoLean > 0);

  // Test Inspecting (Vehicle Bending) Kinematics
  const inspectingPose = updateNPCPose({ ...pose }, {
    dt: 0.1,
    time: 1.0,
    activity: "INSPECTING",
    speed: 0,
    npcPosition: [-13, 0.5, -6],
    npcYaw: 0,
  });
  // Must bend torso forward > 0.3 rad
  assert.ok(inspectingPose.torsoLean > 0.25);
  assert.ok(inspectingPose.headPitch > 0.25);

  // Test Typing Kinematics (converges over 2-3 frames with exponential smoothing)
  let typingPose = { ...pose };
  for (let step = 0; step < 3; step++) {
    typingPose = updateNPCPose(typingPose, {
      dt: 0.1,
      time: 1.0 + step * 0.1,
      activity: "TYPING",
      speed: 0,
      npcPosition: [-12, 0.5, -13],
      npcYaw: Math.PI,
    });
  }
  assert.ok(typingPose.leftArmPitch < -0.8);
  assert.ok(typingPose.rightArmPitch < -0.8);

  // Test Head Look-At Clamping
  const lookPose = updateNPCPose({ ...pose }, {
    dt: 0.1,
    time: 1.0,
    activity: "IDLE",
    speed: 0,
    lookAtTarget: [10, 0, 0], // Extreme 90 deg right
    npcPosition: [0, 0, 0],
    npcYaw: 0,
  });
  // Head yaw should be clamped within physiological limit (<= 0.75 rad)
  assert.ok(lookPose.headYaw <= 0.75);
});

test("NPC Behavior Scheduler manages priority overrides and task progression", () => {
  const workforce = initializeWorkforce();
  const elena = workforce["npc_elena_cruz"];
  const marcus = workforce["npc_marcus_vance"];
  assert.ok(elena);
  assert.ok(marcus);

  // 1. Player Interaction Override
  stepNPCWorkforce(workforce, {
    dt: 0.05,
    isPlayerDriving: false,
    isPlayerNearbyF1Car: false,
    playerPos: [-12, 0.5, -10],
    interactedNPCId: "npc_marcus_vance",
    lapCompletedTriggered: false,
    pipelineFaultActive: false,
  });
  assert.equal(marcus.activity, "PLAYER_INTERACTION");
  assert.equal(marcus.interruptedByPlayer, true);

  // Release player interaction
  stepNPCWorkforce(workforce, {
    dt: 0.05,
    isPlayerDriving: false,
    isPlayerNearbyF1Car: false,
    playerPos: [-12, 0.5, -10],
    interactedNPCId: null,
    lapCompletedTriggered: false,
    pipelineFaultActive: false,
  });
  assert.notEqual(marcus.activity, "PLAYER_INTERACTION");

  // 2. Vehicle Safety Override: when player enters F1 car, Elena steps back to safety curb
  stepNPCWorkforce(workforce, {
    dt: 0.05,
    isPlayerDriving: true, // Player driving
    isPlayerNearbyF1Car: true,
    playerPos: [-12, 0.55, -8],
    interactedNPCId: null,
    lapCompletedTriggered: false,
    pipelineFaultActive: false,
  });
  assert.ok(elena.safetyOverrideActive);

  // 3. Lap Completion Event: Marcus focuses on telemetry
  stepNPCWorkforce(workforce, {
    dt: 0.05,
    isPlayerDriving: false,
    isPlayerNearbyF1Car: false,
    playerPos: [-5, 0.5, 0],
    interactedNPCId: null,
    lapCompletedTriggered: true,
    pipelineFaultActive: false,
  });
  assert.equal(marcus.activity, "TYPING");
  assert.ok(marcus.activeDialogue.includes("lap"));

  // 4. Task Duration Expiration: advances to next scheduled task
  const leo = workforce["npc_leo_patel"];
  const initialTaskIdx = leo.currentTaskIndex;
  // Advance timer beyond task duration (20s)
  leo.taskTimer = 25.0;
  stepNPCWorkforce(workforce, {
    dt: 0.1,
    isPlayerDriving: false,
    isPlayerNearbyF1Car: false,
    playerPos: [0, 0, 0],
    interactedNPCId: null,
    lapCompletedTriggered: false,
    pipelineFaultActive: false,
  });
  assert.equal(leo.currentTaskIndex, (initialTaskIdx + 1) % leo.definition.schedule.length);
  assert.equal(leo.activity, "WALKING");
});

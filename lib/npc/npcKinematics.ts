/**
 * PROCEDURAL NPC KINEMATICS & POSE BLENDER
 * Real-time delta-time blended limb calculations for voxel characters.
 * ASISH: THE ENGINEERING FRONTIER
 */

import type { NPCActivityState, NPCKinematicPose, Vec3 } from "./npcTypes";

export function createInitialPose(): NPCKinematicPose {
  return {
    phase: 0,
    headYaw: 0,
    headPitch: 0,
    torsoLean: 0,
    torsoBob: 0,
    leftArmPitch: 0,
    leftArmRoll: 0,
    rightArmPitch: 0,
    rightArmRoll: 0,
    leftLegPitch: 0,
    rightLegPitch: 0,
    toolPitch: 0,
  };
}

export interface KinematicContext {
  dt: number;
  time: number;
  activity: NPCActivityState;
  speed: number; // Current walking speed (m/s)
  lookAtTarget?: Vec3 | null; // e.g. player camera or work target
  npcPosition: Vec3;
  npcYaw: number;
}

export function updateNPCPose(
  pose: NPCKinematicPose,
  ctx: KinematicContext
): NPCKinematicPose {
  const { dt, time, activity, speed, lookAtTarget, npcPosition, npcYaw } = ctx;
  const clampedDt = Math.max(0.001, Math.min(0.1, dt));
  const blend = 1 - Math.exp(-14 * clampedDt);

  // Update locomotion cycle phase
  if (speed > 0.05) {
    pose.phase += clampedDt * (speed * 4.2);
  } else {
    pose.phase += clampedDt * 1.5;
  }

  // Target values to blend toward
  let tHeadYaw = 0;
  let tHeadPitch = 0;
  let tTorsoLean = 0;
  let tTorsoBob = 0;
  let tLeftArmPitch = 0;
  let tLeftArmRoll = 0;
  let tRightArmPitch = 0;
  let tRightArmRoll = 0;
  let tLeftLegPitch = 0;
  let tRightLegPitch = 0;
  let tToolPitch = 0;

  // 1. Calculate Head Look-At if player or target is nearby
  if (lookAtTarget) {
    const dx = lookAtTarget[0] - npcPosition[0];
    const dz = lookAtTarget[2] - npcPosition[2];
    const dy = lookAtTarget[1] - (npcPosition[1] + 1.6); // Eyes height ~1.6m
    const targetAngle = Math.atan2(dx, dz);
    let deltaYaw = targetAngle - npcYaw;

    // Normalize deltaYaw to [-PI, PI]
    while (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
    while (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;

    const distXZ = Math.hypot(dx, dz);
    const deltaPitch = -Math.atan2(dy, Math.max(0.5, distXZ));

    // Clamp head orientation to realistic physiological bounds
    tHeadYaw = Math.max(-0.75, Math.min(0.75, deltaYaw));
    tHeadPitch = Math.max(-0.35, Math.min(0.35, deltaPitch));
  }

  // 2. State-Specific Targets
  switch (activity) {
    case "WALKING": {
      const stride = Math.sin(pose.phase) * Math.min(0.65, speed * 0.45 + 0.15);
      tLeftLegPitch = stride;
      tRightLegPitch = -stride;
      tLeftArmPitch = -stride * 0.75;
      tRightArmPitch = stride * 0.75;
      tTorsoLean = Math.min(0.12, speed * 0.05);
      tTorsoBob = Math.abs(Math.sin(pose.phase)) * 0.035;
      if (!lookAtTarget) {
        tHeadPitch = 0.04;
      }
      break;
    }

    case "TYPING": {
      // Hands resting at keyboard with rapid alternating strokes
      const keyStrokeLeft = Math.sin(time * 12.0) * 0.04;
      const keyStrokeRight = Math.cos(time * 12.0 + 0.5) * 0.04;
      tTorsoLean = 0.08;
      tTorsoBob = Math.sin(time * 2.0) * 0.005;
      tHeadPitch = 0.22; // Looking at screen
      tLeftArmPitch = -1.1 + keyStrokeLeft;
      tLeftArmRoll = 0.22;
      tRightArmPitch = -1.1 + keyStrokeRight;
      tRightArmRoll = -0.22;
      break;
    }

    case "READING_TABLET": {
      // Left arm holding tablet in front of chest, right hand tapping/gesturing
      const tap = Math.sin(time * 3.5) * 0.03;
      tTorsoLean = 0.05;
      tHeadPitch = 0.32; // Looking down at tablet
      tLeftArmPitch = -1.25;
      tLeftArmRoll = 0.28;
      tRightArmPitch = -0.95 + tap;
      tRightArmRoll = -0.18;
      break;
    }

    case "INSPECTING": {
      // Bending down toward wheel hub or aerodynamic surface
      const torquePulse = Math.sin(time * 4.5) * 0.08;
      tTorsoLean = 0.38; // Significant forward bend
      tTorsoBob = -0.04; // Lower body center of gravity
      tHeadPitch = 0.42; // Focused on mechanical target
      tLeftArmPitch = -0.3; // Rest on knee / steady
      tLeftArmRoll = 0.15;
      tRightArmPitch = -0.85 + torquePulse; // Applying wrench or tool
      tRightArmRoll = -0.15;
      tToolPitch = torquePulse * 1.5;
      break;
    }

    case "CARRYING_EQUIPMENT": {
      // Both arms angled forward holding toolcase
      const carrySway = Math.sin(time * 2.5) * 0.02;
      tTorsoLean = 0.04;
      tLeftArmPitch = -0.45 + carrySway;
      tLeftArmRoll = 0.15;
      tRightArmPitch = -0.45 - carrySway;
      tRightArmRoll = -0.15;
      break;
    }

    case "DISCUSSING": {
      // Conversational gesturing with one arm, subtle nodding
      const nod = Math.sin(time * 3.0) * 0.06;
      const gesture = Math.sin(time * 2.2) * 0.18;
      tTorsoLean = 0.02;
      tHeadPitch = 0.05 + nod;
      tLeftArmPitch = -0.25;
      tRightArmPitch = -0.65 + gesture;
      tRightArmRoll = -0.25;
      break;
    }

    case "PLAYER_INTERACTION": {
      // Welcoming posture, direct engagement
      tTorsoLean = 0.02;
      tLeftArmPitch = -0.2;
      tRightArmPitch = -0.55;
      tRightArmRoll = -0.3;
      break;
    }

    case "INCIDENT_RESPONSE": {
      // High alert, expedited stance
      tTorsoLean = 0.12;
      tHeadPitch = 0.05;
      tLeftArmPitch = -0.4;
      tRightArmPitch = -0.7;
      break;
    }

    case "SAFETY_CLEAR": {
      // Stepped back safely from active racing car
      tTorsoLean = -0.04; // Leaning back away from danger
      tHeadPitch = 0.02;
      tLeftArmPitch = -0.15;
      tRightArmPitch = -0.45; // "Track is clear / go" signal
      tRightArmRoll = -0.4;
      break;
    }

    case "IDLE":
    default: {
      // Natural human breathing and weight shifting
      const breathe = Math.sin(time * 1.8) * 0.012;
      const drift = Math.sin(time * 0.6) * 0.04;
      tTorsoLean = 0.02;
      tTorsoBob = breathe;
      tHeadYaw = drift;
      tLeftArmPitch = -0.12 + breathe * 2;
      tRightArmPitch = -0.12 - breathe * 2;
      break;
    }
  }

  // 3. Exponential smooth blending
  pose.headYaw += (tHeadYaw - pose.headYaw) * blend;
  pose.headPitch += (tHeadPitch - pose.headPitch) * blend;
  pose.torsoLean += (tTorsoLean - pose.torsoLean) * blend;
  pose.torsoBob += (tTorsoBob - pose.torsoBob) * blend;
  pose.leftArmPitch += (tLeftArmPitch - pose.leftArmPitch) * blend;
  pose.leftArmRoll += (tLeftArmRoll - pose.leftArmRoll) * blend;
  pose.rightArmPitch += (tRightArmPitch - pose.rightArmPitch) * blend;
  pose.rightArmRoll += (tRightArmRoll - pose.rightArmRoll) * blend;
  pose.leftLegPitch += (tLeftLegPitch - pose.leftLegPitch) * blend;
  pose.rightLegPitch += (tRightLegPitch - pose.rightLegPitch) * blend;
  pose.toolPitch += (tToolPitch - pose.toolPitch) * blend;

  return pose;
}


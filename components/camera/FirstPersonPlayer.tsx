"use client";

import { gameplayBlocked, typingTarget, touchInput } from "@/lib/frontier/input";
import React, { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { useSettingsStore } from "@/state/settingsStore";
import { worldSound } from "@/lib/audio";
import {
  PLAYER_CLAMP_RADIUS,
  getTerrainSurfaceY,
  resolveMovement,
  depenetrate,
  collidesAt,
  isCircuitArea,
  isPathArea,
} from "@/lib/terrainModel";
import { AnimatedVoxelAvatar } from "./AnimatedVoxelAvatar";
import { FirstPersonHand } from "./FirstPersonHand";

/** Eye height above feet in first-person (Minecraft canonical is 1.62). */
const EYE_HEIGHT = 1.65;
/** Player collision cylinder radius. */
const PLAYER_RADIUS = 0.38;
const GRAVITY = -28.0;
const WALK_SPEED = 4.8;
const SPRINT_SPEED = 7.2;
const JUMP_VELOCITY = 8.4;
const MAX_STEP_HEIGHT =
  (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * Math.abs(GRAVITY)) + 0.05;

/** Third-person follow camera parameters. */
const THIRD_PERSON_DISTANCE = 3.6;
const THIRD_PERSON_HEIGHT_OFFSET = 1.7;

export const FirstPersonPlayer: React.FC = () => {
  const { camera, gl } = useThree();
  const {
    mode,
    activeLocation,
    nearbyTarget,
    reducedMotion,
    perspective,
    togglePerspective,
    focusLocation,
    setPlayerPosition,
    isDriving,
    isDroneTourActive,
    activeHotbarSlot,
  } = useWorldStore();
  const { targetPosition, targetLookAt, isTransitioning, setTransitioning } =
    useCameraStore();
  const { setMinimapOpen } = useSettingsStore();

  // Spatial states
  const playerPos = useRef(new THREE.Vector3(-12, 0.5, 4));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(true);
  const stepDistance = useRef(0);

  // Orientation (Euler angles in radians)
  const yaw = useRef(0);
  const cameraDistance = useRef(THIRD_PERSON_DISTANCE);
  const pitch = useRef(0);
  const avatarYaw = useRef(Math.PI);

  // State flags for animation
  const isMoving = useRef(false);
  const isSprinting = useRef(false);
  useEffect(() => {
    if(perspective === "third-person") avatarYaw.current=yaw.current+Math.PI;
  },[perspective]);
  const avatarState = useRef({position:[0,0,0] as [number,number,number],yaw:0,isMoving:false,isSprinting:false,isGrounded:true,verticalVelocity:0});
  const readAvatarState = useCallback(() => {
    const state=avatarState.current;
    state.position[0]=playerPos.current.x;state.position[1]=playerPos.current.y;state.position[2]=playerPos.current.z;
    state.yaw=avatarYaw.current;state.isMoving=isMoving.current;state.isSprinting=isSprinting.current;
    state.isGrounded=isGrounded.current;state.verticalVelocity=velocity.current.y;
    return state;
  },[]);

  // Restore saved player position if returning
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("asish_world_player_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.x === "number") {
            playerPos.current.set(parsed.x, parsed.y, parsed.z);
            if (typeof parsed.yaw === "number") {
              yaw.current = parsed.yaw;
              avatarYaw.current = parsed.yaw + Math.PI;
            }
            if (typeof parsed.pitch === "number") pitch.current = parsed.pitch;
            if (parsed.activeLocation) focusLocation(parsed.activeLocation);
          }
        }
      } catch {
        // Fallback to default
      }
    }
  }, [focusLocation]);

  // Save player position before unload
  useEffect(() => {
    const saveState = () => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            "asish_world_player_state",
            JSON.stringify({
              x: playerPos.current.x,
              y: playerPos.current.y,
              z: playerPos.current.z,
              yaw: yaw.current,
              pitch: pitch.current,
              activeLocation,
            })
          );
        } catch {
          // Ignored
        }
      }
    };

    window.addEventListener("beforeunload", saveState);
    return () => window.removeEventListener("beforeunload", saveState);
  }, [activeLocation]);

  // Key tracking
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  });

  const isPointerLocked = useRef(false);

  // Mouse look & Pointer Lock Handlers
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas;
    };

    const handleViewportClick = (e: MouseEvent) => {
      // Ignore clicks on interactive DOM buttons, links, or inputs
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest("input") ||
        target?.closest("[role='dialog']") ||
        target?.closest(".pointer-events-auto")
      ) {
        return;
      }

      if (mode === "explore" && !gameplayBlocked() && !isDriving && !isPointerLocked.current) {
        e.stopImmediatePropagation();
        try { const request = canvas.requestPointerLock?.(); request?.catch(() => {}); } catch {}
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current || gameplayBlocked() || isDriving) return;

      const sensitivity = 0.0032;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;

      // Clamp vertical pitch to prevent camera flipping
      const maxPitch = perspective === "first-person"
        ? (82 * Math.PI) / 180
        : (65 * Math.PI) / 180;
      const minPitch = perspective === "first-person"
        ? (-82 * Math.PI) / 180
        : (-35 * Math.PI) / 180;

      pitch.current = Math.max(minPitch, Math.min(maxPitch, pitch.current));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameplayBlocked() || isDriving || typingTarget(e.target)) return;
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
      // Do not process movement while user is typing in form inputs
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Hotkey V: Seamless Perspective Toggle
      if (!e.repeat && (e.code === "KeyV" || e.key === "v" || e.key === "V")) {
        e.preventDefault();
        worldSound.playClick();
        togglePerspective();
        return;
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;
        case "Space":
          keys.current.jump = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
        case "Space":
          keys.current.jump = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = false;
          break;
      }
    };

    // Clear stuck keys if the user tabs away
    const handleWindowBlur = () => {
      keys.current.forward = false;
      keys.current.backward = false;
      keys.current.left = false;
      keys.current.right = false;
      keys.current.jump = false;
      keys.current.sprint = false;
    };

    const handleWheel = (e: WheelEvent) => { if (!gameplayBlocked() && perspective === "third-person") cameraDistance.current = Math.max(1.5, Math.min(7, cameraDistance.current + e.deltaY * 0.005)); };
    canvas.addEventListener("wheel", handleWheel);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    canvas.addEventListener("click", handleViewportClick, true);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      canvas.removeEventListener("click", handleViewportClick, true);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [gl, mode, nearbyTarget, perspective, togglePerspective, setMinimapOpen, isDriving]);

  // Sync player position and orientation when fast-traveling
  useEffect(() => {
    if (mode === "explore" && isTransitioning) {
      const freed = depenetrate(targetPosition[0], targetPosition[2], PLAYER_RADIUS);
      const groundY = getTerrainSurfaceY(freed.x, freed.z);
      playerPos.current.set(
        freed.x,
        groundY,
        freed.z
      );
      velocity.current.set(0, 0, 0);

      // Orient camera and avatar toward targetLookAt
      const lookDirX = targetLookAt[0] - targetPosition[0];
      const lookDirZ = targetLookAt[2] - targetPosition[2];
      if (Math.hypot(lookDirX, lookDirZ) > 0.1) {
        yaw.current = Math.atan2(-lookDirX, -lookDirZ);
        avatarYaw.current = yaw.current + Math.PI;
        pitch.current = 0.04;
      }

      setTransitioning(false);
    }
  }, [mode, isTransitioning, targetPosition, targetLookAt, setTransitioning]);

  // Reusable object to avoid per-frame GC allocations
  const safeCamPosRef = useRef({ x: 0, y: 0, z: 0 });

  // Spring-Arm Camera Collision Solver for Third-Person
  const resolveThirdPersonCamera = useCallback(
    (focusX: number, focusY: number, focusZ: number, targetYaw: number, targetPitch: number) => {
      const nominalDist = cameraDistance.current;
      const cosPitch = Math.cos(targetPitch);
      const sinPitch = Math.sin(targetPitch);

      // Desired camera vector pointing backward (behind) from focus point
      const dirX = Math.sin(targetYaw) * cosPitch;
      const dirY = sinPitch;
      const dirZ = Math.cos(targetYaw) * cosPitch;

      // Cast sample ray backward from avatar head to test for wall/terrain intersection
      let safeDist = nominalDist;
      const sampleSteps = Math.ceil(nominalDist / 0.15);
      for (let i = 1; i <= sampleSteps; i++) {
        const testFraction = i / sampleSteps;
        const testDist = nominalDist * testFraction;
        const testX = focusX + dirX * testDist;
        const testY = focusY + dirY * testDist;
        const testZ = focusZ + dirZ * testDist;

        // Test collision against building walls and ground
        const collidesWall = collidesAt(testX, testZ, 0.25);
        const groundY = getTerrainSurfaceY(testX, testZ) + 0.3;

        if (collidesWall || testY < groundY) {
          // Pull camera closer to avatar head with safety margin
          safeDist = Math.max(0.1, ((i - 1) / sampleSteps) * nominalDist - 0.05);
          break;
        }
      }

      const res = safeCamPosRef.current;
      res.x = focusX + dirX * safeDist;
      res.y = Math.max(
        getTerrainSurfaceY(res.x, focusZ + dirZ * safeDist) + 0.35,
        focusY + dirY * safeDist
      );
      res.z = focusZ + dirZ * safeDist;
      return res;
    },
    []
  );

  // Physics, Locomotion, and Camera Loop
  const hudClock = useRef(0);

  useFrame((_, delta) => {
    // 0. Yield camera & player locomotion if F1 Driving or Cinematic Drone Tour is active
    if (isDriving || isDroneTourActive) {
      return;
    }

    // 1a. BOOT / PANORAMA MODE: Rotating Title Panorama
    if (mode === "boot") {
      hudClock.current += delta;
      if (reducedMotion) {
        camera.position.set(0, 22, 28);
        camera.lookAt(0, 2, 0);
      } else {
        const angle = hudClock.current * 0.08;
        const radius = 32;
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.position.y = 19 + Math.sin(hudClock.current * 0.05) * 1.5;
        camera.lookAt(0, 2.5, 0);
      }
      return;
    }

    // 1b. INSPECT MODE: Glide camera smoothly to facility station view
    if (mode === "inspect") {
      const inspectPos = new THREE.Vector3(...targetPosition);
      const inspectLook = new THREE.Vector3(...targetLookAt);

      if (reducedMotion) {
        camera.position.copy(inspectPos);
        camera.lookAt(inspectLook);
      } else {
        camera.position.lerp(inspectPos, 1.0 - Math.exp(-4.0 * delta));
        const currentTarget = new THREE.Vector3();
        camera.getWorldDirection(currentTarget);
        currentTarget.add(camera.position);
        currentTarget.lerp(inspectLook, 1.0 - Math.exp(-4.0 * delta));
        camera.lookAt(currentTarget);
      }
      return;
    }

    if (gameplayBlocked()) {
      Object.keys(keys.current).forEach(k => { keys.current[k as keyof typeof keys.current] = false; });
      velocity.current.set(0, 0, 0);
      isMoving.current = false;
      if (document.pointerLockElement) document.exitPointerLock();
      return;
    }
    yaw.current -= touchInput.lookX;
    pitch.current = Math.max(-1.1, Math.min(1.1, pitch.current - touchInput.lookY));
    touchInput.lookX = touchInput.lookY = 0;
    // 2. EXPLORATION MODE: Real Playable Player Controller
    const dt = Math.min(delta, 0.1);

    // Camera directional vectors
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    // Input vector
    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.current.forward || touchInput.forward) moveDir.add(forward);
    if (keys.current.backward || touchInput.backward) moveDir.sub(forward);
    if (keys.current.right || touchInput.right) moveDir.add(right);
    if (keys.current.left || touchInput.left) moveDir.sub(right);

    const hasInput = moveDir.lengthSq() > 0;
    if (hasInput) {
      moveDir.normalize();
      // Rotate avatar smoothly to face direction of motion in third-person
      const targetAvatarYaw = Math.atan2(moveDir.x, moveDir.z);
      const turn = Math.atan2(Math.sin(targetAvatarYaw-avatarYaw.current), Math.cos(targetAvatarYaw-avatarYaw.current));
      avatarYaw.current += turn * (1-Math.exp(-18*dt));
    }

    const currentSpeed = (keys.current.sprint || touchInput.sprint) ? SPRINT_SPEED : WALK_SPEED;
    const targetVelX = moveDir.x * currentSpeed;
    const targetVelZ = moveDir.z * currentSpeed;

    isMoving.current = hasInput;
    isSprinting.current = (keys.current.sprint || touchInput.sprint) && hasInput;

    // Instantaneous, crisp, snappy Minecraft-style ground acceleration & braking
    const accelFactor = 1 - Math.exp(-(isGrounded.current ? 22 : 7) * dt);
    velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetVelX, accelFactor);
    velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetVelZ, accelFactor);

    // Jump & Gravity
    if (isGrounded.current && (keys.current.jump || touchInput.jump)) {
      velocity.current.y = JUMP_VELOCITY;
      isGrounded.current = false;
      worldSound.playClick();
    } else if (!isGrounded.current) {
      velocity.current.y += GRAVITY * dt;
    }

    // Resolve horizontal movement with sliding collision against perimeter walls
    const resolved = resolveMovement(
      playerPos.current.x,
      playerPos.current.z,
      velocity.current.x * dt,
      velocity.current.z * dt,
      PLAYER_RADIUS
    );

    // Footstep audio synthesis based on ground surface & speed
    const deltaMoveX = resolved.x - playerPos.current.x;
    const deltaMoveZ = resolved.z - playerPos.current.z;
    const distMoved = Math.hypot(deltaMoveX, deltaMoveZ);
    if (distMoved > 0.001 && isGrounded.current) {
      stepDistance.current += distMoved;
      const stepInterval = isSprinting.current ? 1.55 : 1.22;
      if (stepDistance.current >= stepInterval) {
        stepDistance.current = 0;
        let surface: "grass" | "stone" | "metal" | "tarmac" = "grass";
        if (isCircuitArea(resolved.x, resolved.z)) {
          surface = "tarmac";
        } else if (isPathArea(resolved.x, resolved.z)) {
          surface = "stone";
        }
        worldSound.playFootstep(surface, isSprinting.current);
      }
    }

    playerPos.current.x = resolved.x;
    playerPos.current.z = resolved.z;

    // Island boundary clamp
    const distCenter = Math.hypot(playerPos.current.x, playerPos.current.z);
    if (distCenter > PLAYER_CLAMP_RADIUS) {
      const angle = Math.atan2(playerPos.current.z, playerPos.current.x);
      playerPos.current.x = Math.cos(angle) * PLAYER_CLAMP_RADIUS;
      playerPos.current.z = Math.sin(angle) * PLAYER_CLAMP_RADIUS;
    }

    // Vertical physics & ground snapping
    const groundTargetY = getTerrainSurfaceY(playerPos.current.x, playerPos.current.z);
    playerPos.current.y += velocity.current.y * dt;

    if (playerPos.current.y <= groundTargetY) {
      const rise = groundTargetY - playerPos.current.y;
      playerPos.current.y = groundTargetY;
      velocity.current.y = 0;
      isGrounded.current = true;
      // Auto-step: snap up small curbs / single blocks without a jump
      if (rise > 0.01 && rise <= MAX_STEP_HEIGHT) velocity.current.y = 0;
    } else {
      isGrounded.current = false;
    }

    // 3. CAMERA PERSPECTIVE POSITIONING & AIM
    if (perspective === "first-person") {
      // First-Person: Camera at exact eye height
      camera.position.set(
        playerPos.current.x,
        playerPos.current.y + EYE_HEIGHT,
        playerPos.current.z
      );

      const lookTarget = new THREE.Vector3(
        playerPos.current.x - Math.sin(yaw.current) * Math.cos(pitch.current),
        playerPos.current.y + EYE_HEIGHT + Math.sin(pitch.current),
        playerPos.current.z - Math.cos(yaw.current) * Math.cos(pitch.current)
      );
      camera.lookAt(lookTarget);
    } else {
      // Third-Person: Spring-Arm Orbital Camera behind Avatar
      const focusPoint = {
        x: playerPos.current.x,
        y: playerPos.current.y + THIRD_PERSON_HEIGHT_OFFSET,
        z: playerPos.current.z,
      };

      const safeCamPos = resolveThirdPersonCamera(
        focusPoint.x,
        focusPoint.y,
        focusPoint.z,
        yaw.current,
        pitch.current
      );

      camera.position.lerp(new THREE.Vector3(safeCamPos.x, safeCamPos.y, safeCamPos.z), reducedMotion || collidesAt(camera.position.x, camera.position.z, 0.25) ? 1 : 1 - Math.exp(-18 * dt));
      camera.lookAt(focusPoint.x, focusPoint.y - 0.25, focusPoint.z);
    }

    // Spatial sound updates based on player position
    worldSound.updateSpatialDistance(playerPos.current.x, playerPos.current.z);

    // Publish player position for HUD and minimap when moving or periodically
    hudClock.current += delta;
    if (hudClock.current >= 0.15) {
      hudClock.current = 0;
      setPlayerPosition([
        playerPos.current.x,
        playerPos.current.y + EYE_HEIGHT,
        playerPos.current.z,
      ]);
    }
  });

  return (
    <>
      {/* First-Person In-Hand Equippable Developer Gadget */}
      {perspective === "first-person" && !isDriving && !isDroneTourActive && mode === "explore" && (
        <FirstPersonHand
          activeSlot={activeHotbarSlot}
          isMoving={isMoving.current}
          isSprinting={isSprinting.current}
        />
      )}

      {/* Third-Person Animated Character Model (hidden in First-Person) */}
      {perspective === "third-person" && !isDriving && !isDroneTourActive && (
        <AnimatedVoxelAvatar
          liveState={readAvatarState}
          position={[playerPos.current.x, playerPos.current.y, playerPos.current.z]}
          yaw={avatarYaw.current}
          isMoving={isMoving.current}
          isSprinting={isSprinting.current}
          isGrounded={isGrounded.current}
          verticalVelocity={velocity.current.y}
        />
      )}
    </>
  );
};

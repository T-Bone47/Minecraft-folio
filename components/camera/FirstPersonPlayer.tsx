import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { worldSound } from "@/lib/audio";
import {
  PLAYER_CLAMP_RADIUS,
  getTerrainSurfaceY,
  resolveMovement,
} from "@/lib/terrainModel";

/** Eye height above the feet, in blocks (Minecraft's is 1.62). */
const EYE_HEIGHT = 1.65;
/** Collision radius of the player capsule. */
const PLAYER_RADIUS = 0.42;
const GRAVITY = -28.0;
const WALK_SPEED = 4.8;
const SPRINT_SPEED = 7.2;
const JUMP_VELOCITY = 8.4;
/** Vertical rise the jump velocity buys, used to size the auto-step. */
const MAX_STEP_HEIGHT =
  (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * Math.abs(GRAVITY)) + 0.05;

export const FirstPersonPlayer: React.FC = () => {
  const { camera, gl } = useThree();
  const { mode, activeLocation, activeProject, reducedMotion, focusLocation, setPlayerPosition } =
    useWorldStore();
  const { targetPosition, targetLookAt, isTransitioning, setTransitioning } =
    useCameraStore();

  // Player spatial state. `feetY` is the walkable surface; the camera sits
  // one eye-height above it, so the head never sinks into the terrain.
  const playerPos = useRef(new THREE.Vector3(-12, 2.65, 4)); // In front of garage
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(true);

  // Rotation angles (Euler angles: yaw & pitch)
  const yaw = useRef(0); // Horizontal rotation in radians
  const pitch = useRef(0); // Vertical rotation in radians

  // Restore player position & yaw from sessionStorage if returning from case study
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("asish_world_player_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.x === "number") {
            playerPos.current.set(parsed.x, parsed.y, parsed.z);
            if (typeof parsed.yaw === "number") yaw.current = parsed.yaw;
            if (typeof parsed.pitch === "number") pitch.current = parsed.pitch;
            if (parsed.activeLocation) focusLocation(parsed.activeLocation);
          }
        }
      } catch {
        // Fallback to default garage front
      }
    }
  }, [focusLocation]);

  // Persist player position to sessionStorage whenever mode changes or before unload
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

    saveState();
    window.addEventListener("beforeunload", saveState);
    return () => window.removeEventListener("beforeunload", saveState);
  }, [mode, activeLocation]);

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

  // Pointer Lock and Mouse Look Event Handlers
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas;
    };

    const handleCanvasClick = () => {
      if (mode === "explore" && !isPointerLocked.current) {
        canvas.requestPointerLock?.();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current || mode !== "explore") return;

      const sensitivity = 0.0022;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;

      // Clamp vertical pitch between -80 and +80 degrees
      const maxPitch = (80 * Math.PI) / 180;
      pitch.current = Math.max(-maxPitch, Math.min(maxPitch, pitch.current));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
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

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    canvas.addEventListener("click", handleCanvasClick);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      canvas.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, mode]);

  // Sync player position when fast-traveling / camera store updates
  useEffect(() => {
    if (mode === "explore" && isTransitioning) {
      // `targetPosition` is a camera-space eye position, so the feet sit one
      // eye-height below it.
      playerPos.current.set(
        targetPosition[0],
        targetPosition[1] - EYE_HEIGHT,
        targetPosition[2]
      );
      velocity.current.set(0, 0, 0);
      setTransitioning(false);
    }
  }, [mode, isTransitioning, targetPosition, setTransitioning]);

  // Physics and Camera Update Frame
  const hudClock = useRef(0);
  useFrame((_, delta) => {
    // 1. INSPECT MODE: Camera smoothly glides to inspection coordinates
    if (mode === "inspect" || mode === "boot") {
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

    // 2. EXPLORATION MODE: Minecraft First-Person Controller
    const dt = Math.min(delta, 0.1);

    // Compute forward and right directional vectors from yaw
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    // Input movement vector
    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.current.forward) moveDir.add(forward);
    if (keys.current.backward) moveDir.sub(forward);
    if (keys.current.right) moveDir.add(right);
    if (keys.current.left) moveDir.sub(right);

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
    }

    const currentSpeed = keys.current.sprint ? SPRINT_SPEED : WALK_SPEED;
    const targetVelX = moveDir.x * currentSpeed;
    const targetVelZ = moveDir.z * currentSpeed;

    // Smooth horizontal acceleration and deceleration (damping factor 0.22)
    const accelFactor = isGrounded.current ? 0.22 : 0.08;
    velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetVelX, accelFactor);
    velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetVelZ, accelFactor);

    // Gravity & Jump
    if (isGrounded.current && keys.current.jump) {
      velocity.current.y = JUMP_VELOCITY;
      isGrounded.current = false;
    } else if (!isGrounded.current) {
      velocity.current.y += GRAVITY * dt;
    }

    // Horizontal movement, resolved against campus collision volumes with
    // per-axis sliding so the player never sticks to a wall.
    const resolved = resolveMovement(
      playerPos.current.x,
      playerPos.current.z,
      velocity.current.x * dt,
      velocity.current.z * dt,
      PLAYER_RADIUS
    );
    playerPos.current.x = resolved.x;
    playerPos.current.z = resolved.z;

    // Island boundary clamp keeps the player off the cliff edge.
    const distCenter = Math.hypot(playerPos.current.x, playerPos.current.z);
    if (distCenter > PLAYER_CLAMP_RADIUS) {
      const angle = Math.atan2(playerPos.current.z, playerPos.current.x);
      playerPos.current.x = Math.cos(angle) * PLAYER_CLAMP_RADIUS;
      playerPos.current.z = Math.sin(angle) * PLAYER_CLAMP_RADIUS;
    }

    // Ground level is sampled from the same terrain model the renderer uses,
    // so feet land exactly on the visible block faces at any terrain height.
    const groundTargetY = getTerrainSurfaceY(playerPos.current.x, playerPos.current.z);
    playerPos.current.y += velocity.current.y * dt;

    if (playerPos.current.y <= groundTargetY) {
      const rise = groundTargetY - playerPos.current.y;
      playerPos.current.y = groundTargetY;
      velocity.current.y = 0;
      isGrounded.current = true;
      // Auto-step: snap up small ledges rather than requiring a jump.
      if (rise > 0.01 && rise <= MAX_STEP_HEIGHT) velocity.current.y = 0;
    } else {
      isGrounded.current = false;
    }

    // Camera sits one eye-height above the feet.
    camera.position.set(
      playerPos.current.x,
      playerPos.current.y + EYE_HEIGHT,
      playerPos.current.z
    );

    // Construct look-at target from yaw and pitch
    const lookTarget = new THREE.Vector3(
      playerPos.current.x - Math.sin(yaw.current) * Math.cos(pitch.current),
      playerPos.current.y + EYE_HEIGHT + Math.sin(pitch.current),
      playerPos.current.z - Math.cos(yaw.current) * Math.cos(pitch.current)
    );
    camera.lookAt(lookTarget);

    // Update spatial sound volume based on proximity to circuit / server labs
    worldSound.updateSpatialDistance(playerPos.current.x, playerPos.current.z);

    // Publish position for the HUD and minimap at a low, fixed rate rather
    // than every frame — per-frame state does not belong in the store.
    hudClock.current += delta;
    if (hudClock.current >= 0.1) {
      hudClock.current = 0;
      setPlayerPosition([
        playerPos.current.x,
        playerPos.current.y + EYE_HEIGHT,
        playerPos.current.z,
      ]);
    }
  });

  return null;
};

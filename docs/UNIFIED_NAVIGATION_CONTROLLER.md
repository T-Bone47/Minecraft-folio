# FRONTIER DIRECTOR 2.0 — UNIFIED NAVIGATION CONTROLLER
**Project:** ASISH: THE ENGINEERING FRONTIER  
**Module:** `lib/frontierDirector/navigationController.ts`  
**State Store:** `state/frontierDirectorStore.ts`  
**Repository:** https://github.com/T-Bone47/Minecraft-folio  

---

## 1. Problem Statement & Root Cause Analysis

In previous iterations, independent components directly manipulated the camera, player position, pointer lock, and mode states. This caused three failure modes:
1. **Camera Ownership Fighting:** `FirstPersonPlayer` and `CameraController` fighting for frame-by-frame camera orientation.
2. **Fast Travel Freeze:** Moving to coordinates (e.g. `[22.0, 7.1, 12.0]` outside the Simulation Lab) while an interrupted drone tour kept `isDroneTourActive: true`, causing early return in player physics loops.
3. **Pointer Lock Traps:** Opening modal dialogues while pointer lock remained captured, leaving mouse clicks invisible and buttons unclickable.

---

## 2. Transition State Machine

The Unified Navigation Transition Controller enforces an authoritative state machine:

```
                  +---------------------------------------------------+
                  |                 EXPLORATION                       |
                  |  - FirstPersonPlayer / AnimatedVoxelAvatar active |
                  |  - WASD + Mouse Pointer Lock active               |
                  +---------------------------------------------------+
                       |                       ^               ^
        START_SHOWCASE |        ENTER_EXPLORE  |               |  CLOSE_EVIDENCE
                       v                       |               |
                  +-----------------------+    |    +-----------------------+
                  |       SHOWCASE        |----+    |     PROOF MODE        |
                  |  - Cinematic Cam Rig  |         |  - 6-Layer Modal      |
                  |  - Lower-Third HUD    |-------->|  - Pointer Lock Free  |
                  |  - Automated Progress |  SKIP   |  - Keyboard 1-6 nav   |
                  +-----------------------+         +-----------------------+
```

---

## 3. Invariants & Safety Guarantees

### Invariant 1: Clean Pointer Lock Exit
Whenever transitioning to `showcase`, `proof`, or `modal`, the controller executes:
```typescript
if (typeof document !== "undefined" && document.pointerLockElement) {
  document.exitPointerLock();
}
```

### Invariant 2: Active DOM Focus Clearing
To prevent Enter/Space key presses from triggering background buttons while typing or navigating modals:
```typescript
if (document.activeElement && document.activeElement instanceof HTMLElement) {
  document.activeElement.blur();
}
```

### Invariant 3: Ground Clamping & Depenetration
When teleporting or restoring coordinates, position is never blindly assumed. It passes through:
```typescript
public sanitizePlayerCoordinates(x: number, z: number): [number, number, number] {
  const safe2D = depenetrate(x, z, 0.45);
  const surfaceY = getTerrainSurfaceY(safe2D.x, safe2D.z);
  const safeY = Math.max(0, surfaceY) + 1.65;
  return [safe2D.x, safeY, safe2D.z];
}
```

### Invariant 4: Subsystem Tour Cancellation
Before changing camera targets, all competing spline tours are cancelled:
```typescript
useWorldStore.getState().stopDroneTour();
```

---

## 4. URL Synchronization Without Reload

The controller synchronizes state with browser address bar query parameters using `window.history.replaceState`:
- `/?experience=motorsport&mode=showcase&step=0`
- `/?experience=motorsport&mode=proof&layer=algorithm`
- `/?mode=explore`

This enables direct bookmarking and shareable links that restore the exact showcase step or evidence layer on cold reload.


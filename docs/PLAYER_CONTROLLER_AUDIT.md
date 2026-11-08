# ASISH: THE ENGINEERING FRONTIER — Player Controller & Movement Audit

> **Document Version**: 2.0.0  
> **Status**: COMPLETED & VERIFIED  
> **Focus**: Player Controller, Physics & Collision Systems, Input Routing, Focus & Pointer Lock, First-Person & Third-Person Camera Systems

---

## 1. Executive Summary

A comprehensive forensic audit of the player movement, camera rig, collision engine, and UI overlay hierarchy revealed five interconnected architectural defects that caused player movement to seize or freeze:

1. **Solid Collision Volumes**: Facilities (`telemetry`, `simulation`, `operations`, `aiml`, and `hq`) were modeled in `data/facilities.ts` as single solid axis-aligned bounding boxes (AABBs) covering their entire footprint. When a player walked into a doorway or fast-traveled to an exhibit, the collision solver detected them inside the solid volume and zeroed out all horizontal delta vectors (`deltaX = 0`, `deltaZ = 0`), permanently trapping the player.
2. **Persistent `activeLocation === "hq"` State Loop**: `components/inspection/InspectionOverlay.tsx` bypassed the `mode === "inspect"` check with `if (mode !== "inspect" && activeLocation !== "hq") return null;`. Furthermore, `closeInspection()` in `state/worldStore.ts` reset `mode: "explore"` but left `activeLocation: "hq"` untouched, causing the Engineering HQ panel to remain perpetually open on screen, swallowing pointer lock and blocking world interaction.
3. **Inspect Mode Execution Halt**: In `components/camera/FirstPersonPlayer.tsx`, whenever `mode === "inspect"`, the frame loop executed an early return, bypassing all velocity integration, gravity, WASD input resolution, and physics step.
4. **Pointer Lock Capture Isolation**: Pointer lock request listeners were registered solely on `gl.domElement` (`<canvas>`), while the DOM was overlaid with fixed full-screen containers (`WorldHUD`, `ProfileSpawn`, `InspectionOverlay`), preventing click events from reaching the canvas.
5. **Absence of Third-Person System**: The controller had no third-person camera mode, no third-person orbital rig with collision avoidance, and no animated voxel avatar rendering player locomotion.

---

## 2. Root Cause Analysis Table

| Subsystem | File & Lines | Failure Mode | Impact | Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **Collision Engine** | `data/facilities.ts` (lines 31–191) & `lib/terrainModel.ts` | Facilities declared as monolithic solid rectangles rather than hollow perimeter walls with doorway openings. | Entering or spawning inside a building traps the player in infinite collision clamp. | Redefine all facility colliders as 4 hollow wall segments (North, South, East, West) with clear, generous doorways and walkable interiors. |
| **Inspection UI** | `components/inspection/InspectionOverlay.tsx` (line 26) | `if (mode !== "inspect" && activeLocation !== "hq") return null;` forced HQ panel to render in `explore` mode. | Permanent UI overlay on right half of screen; canvas clicks diverted to DOM buttons. | Require `mode === "inspect"` strictly; update `closeInspection()` to reset `activeLocation: null` or clean up state. |
| **State Store** | `state/worldStore.ts` (lines 52–73) | `closeInspection()` cleared `activeProject` but retained `activeLocation`. | Inability to fully dismiss modal without reload. | Ensure `closeInspection()` clears both `activeProject` and sets mode to `"explore"`. |
| **Input Routing** | `components/camera/FirstPersonPlayer.tsx` (lines 102–126) | Pointer lock click listener attached strictly to `canvas`; mouse move ignored when `!isPointerLocked.current`. | Clicks in non-canvas UI areas fail to engage camera look; camera feels frozen. | Attach click listener to non-blocking viewport wrapper with intelligent check for interactive elements (`button`, `a`, `input`). |
| **Locomotion Loop** | `components/camera/FirstPersonPlayer.tsx` (lines 240–260) | Early return in `mode === "inspect"`. | Player completely frozen whenever inspecting. | Restrict inspect mode to deliberate inspection camera glides; return smoothly to exploration upon closing. |
| **Perspective Rig** | `components/camera/FirstPersonPlayer.tsx` | No third-person camera or animated character model. | Lack of third-person perspective and character visualization. | Implement unified dual-perspective controller with `V` toggle, orbital camera, collision spring-arm, and procedural animated voxel avatar. |

---

## 3. Architectural Remedy Plan

1. **Hollow Facility Perimeter Colliders**:
   - Split each building collider in `data/facilities.ts` into individual perimeter walls (Thickness: 1.0–1.2 blocks).
   - Carve generous entrance portals ($2.5–3.5$ blocks wide) matching visible building openings.
   - Leave the entire interior hall ($y=0$ floor) free of collision so players can freely walk inside, approach workstations, inspect telemetry monitors, and exit.

2. **Unified Perspective Controller (`UnifiedPlayerController.tsx`)**:
   - **First-Person Mode**: Eye height ($1.65$ blocks), pitch-clamped mouse look ($-80^\circ$ to $+80^\circ$), hidden avatar to prevent clipping.
   - **Third-Person Mode**: Visible voxel engineer avatar with procedural walking, running, idle breathing, and jumping animations.
   - **Spring-Arm Camera Collision**: Third-person follow camera casts a ray from the player's head toward the desired camera position; if a wall or obstacle intervenes, the camera smoothly pulls inward to avoid wall clipping.
   - **Perspective Toggle**: Hotkey <kbd>V</kbd> + HUD toggle button.

3. **Event Propagation & UI Focus Management**:
   - Clean distinction between **Blocking Modals** (`StationModal`, `ProfileModal`, `WorldMap`) and **Non-Blocking HUD** (Crosshair, Coordinates, Quick Travel Hotbar).
   - Window blur listener to clear stuck keys (`keys.current.forward = false`, etc.).
   - Keyup / Keydown sanitization ensuring WASD is ignored ONLY when typing in actual text inputs.


# Player and camera

WASD/arrows move; Shift sprints; Space jumps. V changes first/third person without moving the player. Pointer lock mouse look clamps pitch. Wheel adjusts third-person distance from 1.5 to 7 metres. A sampled spring arm checks walls every 0.15 metres. Movement uses facility wall colliders and shared terrain heights. The avatar receives live frame state instead of stale HUD-rate positions.

Six collision-aware approach-to-interior tests cover the canonical facilities. These test the collision model; browser QA separately checks visible traversal. The ground is voxel stepped, not a rigid-body physics world. Tower upper floors are decorative; the ground-level workstation is the accessible exhibit.

Car exit depenetrates the on-foot position and updates the camera transfer target, including the HUD exit button. Touch users receive held direction buttons, jump, drag-look and interact. Touch support requires separate device testing beyond desktop emulation.

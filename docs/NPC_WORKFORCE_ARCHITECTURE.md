# LIVING NPC WORKFORCE & AUTONOMOUS CAMPUS — ARCHITECTURE SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER

---

## 1. System Overview & Engineering Purpose

The **Living NPC Workforce** transforms the facilities of **ASISH: THE ENGINEERING FRONTIER** from static voxel set-pieces into an active, believable motorsport and software engineering campus. Rather than populating the scene with generic crowds or looping two-second idle poses, every non-player character represents an articulated, role-specific engineer operating on an autonomous schedule.

When visitors explore facilities—especially the **Race Engineering Garage**, **Telemetry Control Tower**, **AI / ML Research Lab**, and **Engineering HQ**—engineers are actively:
- Analysing real-time telemetry at monitors.
- Inspecting the Frontier-01 single-seater suspension and aerodynamics with mechanical tools.
- Transporting thermal tyre blankets and pneumatic toolcases between workstations.
- Diagnosing stream ingestion buffers during pipeline events.
- Stepping back safely to standby curbs when visitors approach or enter the racing car.

---

## 2. Core Architecture Pipeline

```
 +-----------------------------------------------------------------------------------+
 |                             Three.js / Canvas Scene                               |
 |   +---------------------------------------------------------------------------+   |
 |   |                      LivingNPCWorkforce (Coordinator)                     |   |
 |   |        (Single central useFrame loop: steps simulation & kinematic poses) |   |
 |   +-------------------------------------+-------------------------------------+   |
 +-----------------------------------------|-----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v                                             v
       +-------------------------+                   +-------------------------+
       |   Behavior Scheduler    |                   |   Workstation Registry  |
       |   & Finite State Mach.  |                   |   & Waypoint Navigation |
       | - Safety Overrides      |                   | - 12 Campus Workstations|
       | - Event Reactions       |                   | - Obstacle-free Loops   |
       | - Task Progression      |                   | - Permitted Role Gates  |
       +------------+------------+                   +------------+------------+
                    |                                             |
                    +----------------------+----------------------+
                                           |
                                           v
                             +---------------------------+
                             |   Procedural Kinematics   |
                             |   (Delta-Time Blender)    |
                             | - Head Look-At Clamping   |
                             | - Torso Forward Bending   |
                             | - Alternating Typing      |
                             | - Tool Torquing Pulses    |
                             +-------------+-------------+
                                           |
                                           v
                             +---------------------------+
                             |    ArticulatedVoxelNPC    |
                             |    (Mesh & Joint Transforms)
                             +---------------------------+
```

---

## 3. Subsystem Breakdown

### 3.1 Procedural Kinematics Engine (`lib/npc/npcKinematics.ts`)
- **Exponential Smoothing**: Prevents angular popping during state transitions:
  $$\theta \leftarrow \theta + (\theta_{\text{target}} - \theta) \cdot (1 - e^{-k \cdot \Delta t})$$
- **Physiological Clamping**: Constrains head rotation within $[-43^\circ, +43^\circ]$ yaw and $[-20^\circ, +20^\circ]$ pitch to avoid unnatural neck twisting.
- **Micro-Motion Synthesis**: Generates high-frequency key-striking vibrations ($12\text{ Hz}$) for typing and cyclic torque pulses ($4.5\text{ Hz}$) for tool inspection.

### 3.2 Behavior State Machine & Scheduler (`lib/npc/behaviorScheduler.ts`)
Executes a strict priority hierarchy:
1. **Safety & Unstuck Recovery**: If a visitor approaches or enters the car, mechanics immediately yield the work area.
2. **Active Player Interaction**: Worker halts locomotion, faces the visitor, and engages in contextual conversation.
3. **World Event Incidents**: Responds dynamically to `LAP_COMPLETED` (Marcus turns to telemetry terminal) or `PIPELINE_FAULT` (Viktor inspects buffer rack).
4. **Scheduled Engineering Tasks**: Executes defined multi-station work loops ($12\text{s} - 22\text{s}$ per task).
5. **Ambient Workstation Idle**: Subtle human breathing and weight shifting.

### 3.3 Workstation System (`lib/npc/workstationRegistry.ts`)
Registers 12 physical workstations with world coordinates, facing yaw, permitted roles, and required handheld accessories (`wrench`, `tablet`, `scanner`, `toolcase`). Local obstacle-free waypoint loops prevent workers from clipping through walls or the central vehicle.


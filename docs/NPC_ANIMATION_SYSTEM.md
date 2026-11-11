# LIVING NPC WORKFORCE — ARTICULATED ANIMATION SYSTEM
## ASISH: THE ENGINEERING FRONTIER

---

## 1. Kinematic Primitives & Skeletal Articulation

The NPC animation system (`lib/npc/npcKinematics.ts` & `components/npc/ArticulatedVoxelNPC.tsx`) provides procedural skeletal joint articulation for Minecraft-inspired cubic characters without relying on heavyweight external animation packages or expensive rig baking.

Every NPC character model contains six primary articulated pivot joints:
1. **Head (`[0, 1.62, 0]`)**: Dual-axis yaw and pitch rotation with physiological clamping.
2. **Torso (`[0, 0.86, 0]`)**: Pitch lean and vertical breathing/walking bobbing.
3. **Left Arm (`[-0.42, 1.48, 0]`)**: Dual-axis pitch and roll articulation.
4. **Right Arm (`[0.42, 1.48, 0]`)**: Dual-axis pitch and roll articulation with tool/accessory attachment socket.
5. **Left Leg (`[-0.18, 0.86, 0]`)**: Locomotion stride pitch.
6. **Right Leg (`[0.18, 0.86, 0]`)**: Counter-stride locomotion pitch.

---

## 2. Activity Pose Synthesizers

| Activity State | Torso Lean | Head Orientation | Arm Angles & Dynamics | Handheld Tool / Accessory |
|---|---|---|---|---|
| **`WALKING`** | $+0.08\text{ rad}$ (forward) | Forward aligned | Natural counter-stride swing ($\pm 0.45\text{ rad}$) | Role-dependent accessory |
| **`TYPING`** | $+0.08\text{ rad}$ | Tilted to monitor ($+0.22\text{ rad}$) | Raised to keyboard ($\theta_p = -1.1\text{ rad}$) with $12\text{ Hz}$ alternating strokes | Held tablet / terminal screen |
| **`INSPECTING`** | **$+0.38\text{ rad}$ (bent)** | **Focused on hub ($+0.42\text{ rad}$)** | Right arm extended down ($\theta_p = -0.85\text{ rad}$) with $4.5\text{ Hz}$ torque pulses | Pneumatic torque wrench or scanner |
| **`READING_TABLET`** | $+0.05\text{ rad}$ | Tilted to screen ($+0.32\text{ rad}$) | Left arm elevated holding datapad; right hand tapping | Datapad with cyan/red telemetry texture |
| **`CARRYING_EQUIPMENT`**| $+0.04\text{ rad}$ | Forward aligned | Both arms angled forward in front of hips ($\theta_p = -0.45\text{ rad}$) | Heavy-duty voxel toolcase |
| **`DISCUSSING`** | $+0.02\text{ rad}$ | Subtle nodding ($3\text{ Hz}$) | Alternating conversational gestures ($\theta_p = -0.65\text{ rad}$) | Tablet / scanner |
| **`SAFETY_CLEAR`** | $-0.04\text{ rad}$ (back) | Track aligned | Stepped back; right arm giving "track is clear" gesture | None |
| **`IDLE`** | $+0.02\text{ rad}$ | Subtle yaw drift ($\pm 0.04\text{ rad}$) | Resting at sides with $1.8\text{ Hz}$ breathing bob | Standby pose |

---

## 3. Head Look-At & Attention Behavior

When a visitor camera enters the worker's perception sphere ($< 8.0\text{m}$), the head smoothly pivots to acknowledge the visitor:
$$\text{Yaw}_{\text{target}} = \text{atan2}(\Delta x, \Delta z) - \text{Yaw}_{\text{body}}$$
Clamped strictly to:
$$-43^\circ \le \text{Yaw}_{\text{head}} \le +43^\circ, \quad -20^\circ \le \text{Pitch}_{\text{head}} \le +20^\circ$$
This prevents eerie $180^\circ$ neck snaps while ensuring workers feel aware of the player's presence.


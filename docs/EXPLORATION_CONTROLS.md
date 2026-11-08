# ASISH: THE ENGINEERING FRONTIER — Exploration & Locomotion Controls Manual

> **Product Identity**: ASISH: THE ENGINEERING FRONTIER  
> **Document Version**: 2.0.0  
> **Target Audience**: Visitors, Recruiters, Engineers, QA Testers

---

## 1. Quick Reference Control Scheme

### Desktop Controls

| Key / Action | Function | Scope & Details |
| :--- | :--- | :--- |
| **<kbd>W</kbd> / <kbd>↑</kbd>** | Move Forward | Follows camera horizontal facing vector |
| **<kbd>S</kbd> / <kbd>↓</kbd>** | Move Backward | Follows camera horizontal facing vector |
| **<kbd>A</kbd> / <kbd>←</kbd>** | Strafe Left | Normalised horizontal directional vector |
| **<kbd>D</kbd> / <kbd>→</kbd>** | Strafe Right | Normalised horizontal directional vector |
| **<kbd>Space</kbd>** | Jump | $8.4$ m/s vertical impulse, gravity $-28$ m/s² |
| **<kbd>Shift</kbd>** | Sprint | Increases speed from $4.8$ m/s to $7.2$ m/s |
| **Mouse Look** | Rotate Camera | Yaw & Pitch rotation (Pointer Locked) |
| **Click World** | Engage Pointer Lock | Captures mouse cursor for exploration |
| **<kbd>Esc</kbd>** | Release Pointer Lock | Releases cursor or dismisses active panel |
| **<kbd>V</kbd>** | **Toggle Perspective** | **Seamless First-Person $\leftrightarrow$ Third-Person switch** |
| **<kbd>E</kbd>** | Interact / Inspect | Proximity trigger for stations, exhibits & cars |
| **<kbd>M</kbd>** | Cartographer World Map | Full campus radar and facility overview |
| **<kbd>I</kbd>** | Canonical Projects | Minecraft inventory style project archive |
| **<kbd>P</kbd>** | Technical Dossier | Detailed resume, trajectory & credentials |
| **<kbd>/</kbd> or <kbd>Ctrl+K</kbd>** | Command Palette | Quick terminal teleportation & diagnostics |
| **<kbd>B</kbd>** | Toggle Spawn Backdrop | Switches between 3D Live Panorama and Dirt |
| **<kbd>1</kbd> – <kbd>8</kbd>** | Hotbar Quick Travel | Direct travel to campus engineering divisions |

### Mobile & Touch Controls

- **Left On-Screen D-Pad**: Move Forward, Backward, Strafe Left, Strafe Right.
- **Right Action Buttons**:
  - **`[ JUMP ]`**: Jump across terrain.
  - **`[ RUN ]`**: Toggle sprint locomotion.
  - **`[ V ]`**: Instant First-Person / Third-Person toggle.
  - **`[ E ]`**: Contextual interaction button (flashes when near an exhibit).

---

## 2. Camera System Architecture

### 2.1 First-Person Perspective (Default)
- **Camera Anchor**: Set to exact eye height ($1.65$ blocks above terrain surface).
- **Pitch Clamping**: Vertical angle constrained between $-82^\circ$ (looking straight down at boots) and $+82^\circ$ (looking up at the voxel sky) to prevent gimbal lock or camera inversion.
- **Occlusion Culling**: Avatar mesh is hidden (`visible = false`) in first-person mode so the player's own geometry never obstructs viewport view.
- **Center Crosshair**: Authentic Minecraft beveled crosshair active during first-person exploration.

### 2.2 Third-Person Perspective
- **Animated Voxel Avatar**: Custom-modeled engineering avatar featuring:
  - Technical graphite jacket with McLaren Papaya orange racing stripes.
  - Chest engineer ID badge #47 and cyan utility tool harness.
  - Two-way radio communications headset with boom microphone.
  - Articulated limbs pivoting at hip and shoulder joints.
- **Procedural Locomotion Animations**:
  - **Idle**: Gentle breathing cycle ($\sin(2.2t) \times 0.025$).
  - **Walking**: Natural sinusoidal arm and leg swings at $9.5$ Hz.
  - **Running**: Faster limb oscillation at $14$ Hz with a dynamic forward torso tilt ($0.18$ rad).
  - **Airborne / Jump**: Tucked legs and balance-extended arms with tilt matching vertical velocity.
- **Spring-Arm Camera Collision**:
  - Raycasts from avatar focus point ($y + 1.7$) backward along the view direction.
  - If a building wall or terrain hill intersects the camera path, the camera smoothly pulls closer to the avatar (minimum safe distance $0.6$ blocks) to prevent clipping through interior walls.

---

## 3. Physical Campus Navigation & Facility Entrances

Every facility is built with hollow interior halls and generous entrance portals:

1. **Race Engineering Garage (`[-12, 0, -8]`)**:
   - Open pit-lane elevation facing south from $x = -17$ to $x = -7$.
   - Houses the Formula 1 single-seater chassis and telemetry pit wall.
2. **Telemetry Tower & Race Control (`[14, 0, -18]`)**:
   - South entrance portal from $x = 12.5$ to $x = 15.5$.
   - Walk inside to inspect the 6-stage telemetry ingestion gantry and telemetry explorer.
3. **Vehicle Simulation Lab (`[22, 0, 8]`)**:
   - West entrance portal from $z = 6.5$ to $z = 9.5$.
   - Houses the quasi-static point-mass lap solver and friction circle displays.
4. **Team Operations HQ (`[-12, 0, 14]`)**:
   - South entrance portal from $x = -13.5$ to $x = -10.5$.
   - Houses the race weekend strategy wall and Unity simulation engine.
5. **AI / Data Intelligence Lab (`[0, 0, 24]`)**:
   - 5-block wide south entrance portal from $x = -2.5$ to $x = 2.5$.
   - Houses the EA FC vector representation server and VyaparPulse nodes.
6. **Engineering HQ & Command Monolith (`[-26, 0, -22]`)**:
   - East entrance portal from $z = -23.5$ to $z = -18.5$.
   - Houses the motorsport engineering trajectory wall and contact terminal.


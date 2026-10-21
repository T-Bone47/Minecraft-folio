# ASISH OLIVER M — 3D Engineering World Portfolio

> **An interactive, Minecraft-inspired 3D motorsport & software systems engineering facility.**

![Voxel Engineering World](https://img.shields.io/badge/Minecraft-Voxel_Architecture-brightgreen)
![Three.js](https://img.shields.io/badge/Three.js-0.180-black)
![Next.js](https://img.shields.io/badge/Next.js-15.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)

---

## 1. Overview & Vision

**ASISH OLIVER M — Engineering World** turns a conventional portfolio into an explorable, first-person 3D voxel campus. The visitor steps onto a 72×72 block island hosting a central motorsport circuit and 6 physical engineering facilities.

The core philosophy:
1. **Unmistakable Minecraft Identity**: Stepped grass terrain, 16×16 NearestFilter pixel textures, oak signs, stone brick towers, cubic clouds, square sun and moon, and an authentic Minecraft-inspired HUD.
2. **Motorsport & Software Engineering Rigor**: Real telemetry streams, numerical vehicle performance simulation, race strategy models, and offline AI/ML architectures.
3. **Strict Content Truth**: 0 fabricated metrics, 0 fake telemetry logs. All synthetic demo sessions are explicitly labeled `ILLUSTRATIVE DEMO SESSION` / `ILLUSTRATIVE DEMO OUTPUT`. Zero academic score metadata.

---

## 2. Campus Facilities & Systems

| Facility | Code | Coordinates `[X, Y, Z]` | System / Canonical Project | Interactive Experience |
|---|---|---|---|---|
| **Telemetry Tower / Race Control** | `FAC-02 / CTL` | `[14, 0, -18]` | **Live F1 Intelligence** | Quad rotating satellite dishes, live canvas telemetry trace (`ILLUSTRATIVE ENGINEERING TRACE`), verified canonical evidence (`1,067,193 canonical events`, `0 malformed`, `~2,650/s`, `~0.10 ms p50`, `99 MB`). |
| **Vehicle Simulation Lab** | `FAC-03 / SIM` | `[22, 0, 8]` | **F1 Lap-Time Simulator** | Spinning wind-tunnel intake turbine, live G-G friction circle point animation, step-by-step numerical solver modal (`ILLUSTRATIVE DEMO OUTPUT`). |
| **Race Engineering Garage** | `FAC-01 / GAR` | `[-12, 0, -8]` | **RaceMind-AI** | Voxel single-seater F1 car, pit gantry, tyre warming racks, strategy board with stint degradation curves, and AI Race Engineer terminal (4 bounded query prompts). |
| **Team Operations HQ** | `FAC-04 / OPS` | `[-12, 0, 14]` | **F1 Race Manager** | Rotating rooftop weather radar dome, war-room display matrices for F1 team management & strategy game simulation. |
| **AI / Data Intelligence Lab** | `FAC-05 / ML` | `[0, 0, 24]` | **EA FC Intelligence** & **VyaparPulse** | Twin-wing AI facility: East Wing houses EA FC player representation vectors; West Wing houses VyaparPulse offline Vosk speech ledger & XGBoost 7-day demand pipeline. |
| **Engineering HQ & Monolith** | `FAC-00 / HQ` | `[-26, 0, -22]` | **About, Experience, Contact** | Multi-story headquarters with 3-panel Career Timeline Wall (Independent Motorsport & IGNICT AI/ML Intern) and Direct Email Communications Terminal. |

---

## 3. Controls & Navigation

### Desktop First-Person Controls
- **`W / A / S / D` or `Arrow Keys`**: Move forward, backward, strafe left/right (with smooth acceleration & deceleration damping).
- **`Mouse Look`**: Click world to engage pointer lock; move mouse to look around (clamped vertical pitch -80° to +80°).
- **`Shift`**: Sprint (boosts speed from 7.5 to 11.5 blocks/sec).
- **`Space`**: Jump (includes 1-block auto-stepping).
- **`E`**: Contextual interaction with targeted station, facility, or vehicle.
- **`1 – 8`**: Hotbar slots:
  - `[1]` Telemetry Tower
  - `[2]` Simulation Lab
  - `[3]` RaceMind Garage
  - `[4]` Team Operations HQ
  - `[5]` Cartographer Map
  - `[6]` Project Inventory Directory
  - `[7]` AI / Data Lab
  - `[8]` Engineering HQ
- **`I`**: Open Project Directory Inventory.
- **`M`**: Open 2D Cartographer Campus Map with instant teleportation.
- **`/` or `K`**: Open Command Palette with categorized autocomplete (`/telemetry`, `/simulation`, `/day`, `/night`, etc.).
- **`F3`**: Toggle real-time WebGL Telemetry & Diagnostics HUD (FPS, draw calls, triangles, geometries, textures, device tier).
- **`AUTO / HIGH / MED / LOW`**: Manual render-quality override in the HUD. `AUTO` follows the detected device tier; an explicit choice is the only way to opt into more expensive settings.
- **`ESC`**: Unlock pointer lock / close overlays.

### Mobile Touch Controls
- Dedicated touch buttons in HUD top bar for `[I] PROJECTS`, `[M] MAP`, `[/] CMD`, and `AUDIO`.
- Touch-friendly 48×48px hotbar slots at the bottom.
- 2D Cartographer Radar with touch-selectable facility pins.

---

## 4. Technical Architecture

- **Next.js 15.2 (App Router)**: Hybrid static prerendering (SSG) with React 19.
- **Single source of truth for world geometry** (`lib/terrainModel.ts`): the terrain generator and the first-person controller sample the *same* pure functions for ground height, circuit flattening, facility pads and collision volumes. Previously each kept a private copy of the hill function, so the player floated above and sank below the visible terrain.
- **Exposure culling**: terrain fills each column down to bedrock, but ~88% of those stone blocks are fully enclosed by their neighbours and can never be seen. Only exposed blocks are emitted — 8,705 → 1,080 stone blocks (**-87.6%**), and 14,118 → 6,493 total blocks (**-54%**).
- **Spatial chunking**: terrain is batched into 16×16 chunks, each with its own `InstancedMesh` and an explicit `computeBoundingSphere()`. Without the bounding sphere Three.js falls back to the shared unit-cube bounds and never culls a chunk. Measured in-engine: **~56k triangles drawn vs ~169k** before.
- **Distance LOD**: footpaths are high-frequency detail that is imperceptible past the profile's LOD distance, so distant chunks drop them and trim their shadow casters.
- **Render quality profiles** (`lib/renderQuality.ts`): the detected device tier now drives real renderer configuration (DPR, shadows, shadow-map resolution, antialiasing, LOD distances, fog range), and the HUD exposes a manual `AUTO / HIGH / MED / LOW` override so visitors on capable hardware are not stuck with a user-agent guess.
- **GPU resource lifecycle** (`components/world/WorldResourceBoundary.tsx`): walks the scene graph and releases cached materials/textures on unmount. It deliberately does *not* call `forceContextLoss()` — that irreversibly invalidates the WebGL context, which breaks the StrictMode remount.
- **Lighting rig**: a hemisphere light separates sky-facing from ground-facing normals. Under a single ambient term a block's top and side faces receive identical light and voxel terrain reads as flat cardboard. The shadow camera is fitted to the island rather than a fixed oversized box.
- **Web Audio API**: Procedural sound synthesis engine with zero external audio assets (synthesized pink-noise wind, 38 Hz engine rumble, 120 Hz server hum, UI clicks, and inspect chimes).
- **State Architecture**:
  - `worldStore.ts`: Global exploration, inspection mode, active target, and a low-frequency player position feed for the HUD.
  - `cameraStore.ts`: Dynamic camera choreography and coordinate transitions.
  - `interactionRegistry.ts`: Decoupled interactive object and station modal registry.
  - `settingsStore.ts`: Atmosphere time profile (`day`, `sunset`, `night`), render quality override, minimap, and live WebGL diagnostics (`gl.info`).
- **Session Continuity**: Player position, yaw, pitch, and active facility are persisted to `sessionStorage` (`asish_world_player_state`) across `/world` and `/work/[slug]` routes.

---

## 5. Development & Build Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript typecheck (zero emit)
npm run typecheck

# Run production build
npm run build

# Start production server
npm start
```

---

## 6. Accessibility & WebGL Fallback

In environments where WebGL is unavailable or disabled, the application automatically mounts **`WorldFallback.tsx`**:
- Interactive SVG Cartographer Radar of the 72×72 island.
- Complete facility dossiers with verified metrics and case study links.
- Full semantic project directory, career timeline, and direct contact uplink.
- Fully compatible with screen readers, keyboard tab navigation, and search engine crawlers.

---

## 7. Contact & Links

- **Engineer**: Asish Oliver M
- **Roles**: Motorsport Software Engineer | AI / ML Engineer
- **Email**: [dreamteamoliver@gmail.com](mailto:dreamteamoliver@gmail.com)
- **GitHub**: [github.com/AsishOliver](https://github.com/AsishOliver)
- **LinkedIn**: [linkedin.com/in/asish-oliver](https://www.linkedin.com/in/asish-oliver)

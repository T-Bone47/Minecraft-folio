# ASISH OLIVER M --- ENGINEERING WORLD

## Architecture & Technical Design Specification

**Status:** Architecture baseline / implementation-ready\
**Target:** Antigravity / Claude Code\
**Route:** `/world`\
**Stack:** Next.js + React + TypeScript + React Three Fiber + Three.js +
Zustand\
**Purpose:** Separate experimental portfolio experience; existing
professional portfolio remains canonical.

------------------------------------------------------------------------

## 1. Executive Decision

Build an original **Minecraft-inspired engineering world** for ASISH
OLIVER M.

This is **not** a Minecraft clone and not a replacement for the existing
portfolio.

The existing portfolio remains the serious recruiter-facing engineering
site. `/world` is an experimental flagship experience that demonstrates:

-   3D engineering visualization
-   motorsport systems thinking
-   telemetry
-   simulation
-   AI/ML
-   interaction design
-   performance engineering
-   accessibility
-   progressive enhancement

The core idea is:

> **The portfolio information architecture becomes a physical
> engineering facility.**

``` text
                         ENGINEERING WORLD
                                |
              +-----------------+-----------------+
              |                 |                 |
           CIRCUIT           TELEMETRY        SIMULATION
              |               TOWER               LAB
              |                 |                 |
          F1 GARAGE       Live F1 Intelligence   Lap Simulator
          /            RaceMind    Race Manager

                         AI / ML LAB
                         /                             EA FC       VyaparPulse

                       ENGINEERING HQ
                    /       |                       Experience  About    Contact
```

------------------------------------------------------------------------

# 2. Research Basis

## Andrew Woan reference

The referenced `andrewwoan/woan-minecraft-folio` is an award-winning
Minecraft-inspired Three.js portfolio. Its repository uses a Vite
application, a `src`/`public` structure and Blender assets. The author
explicitly documents camera refinements, including a rotation buffer and
a camera group for local-axis camera offsets.

**What we adopt:**

-   immersive 3D as the primary experience;
-   deliberate camera choreography;
-   original 3D asset pipeline;
-   world-as-navigation.

**What we do not copy:**

-   source code;
-   artwork;
-   world layout;
-   branding;
-   UI;
-   Minecraft assets.

## Other Minecraft portfolio reference

The second reference demonstrates that a Minecraft-style portfolio can
combine a 3D environment with conventional portfolio information and UI.

**What we adopt:**

-   persistent navigation;
-   terminal/search concepts;
-   direct access to projects;
-   3D + conventional information architecture.

## Rendering research

React Three Fiber recommends reducing draw calls and using instancing
for repeated objects. Three.js `InstancedMesh` exists specifically to
render many objects sharing geometry/materials efficiently.

Therefore:

> Repeated voxel blocks MUST NOT be implemented as thousands of
> independent meshes.

Use instancing, shared geometry/materials and spatial chunking.

Three.js also provides `LOD` for switching between different detail
levels by distance.

Therefore:

``` text
FAR  -> LOW
MID  -> MEDIUM
NEAR -> HIGH
```

Three.js resources such as geometries, materials and textures require
explicit lifecycle/disposal when they are no longer needed.

Therefore:

> Asset ownership and GPU resource cleanup are architectural
> requirements, not final polish.

## Next.js research

Next.js supports statically rendered/hybrid applications. The world
should therefore have a semantic HTML shell and treat WebGL as
progressive enhancement.

The route must remain meaningful if WebGL is unavailable.

------------------------------------------------------------------------

# 3. Product Definition

## Name

**ASISH OLIVER M --- ENGINEERING WORLD**

Internal short name:

**Engineering World**

Do not brand it as "Minecraft Portfolio."

Minecraft is the visual grammar.

The identity is ASISH ENGINEERING WORLD.

## Core statement

> Software is the instrument. Engineering decisions are the objective.

## Experience goals

1.  Immediate visual impact.
2.  Immediate personal identity.
3.  All projects discoverable.
4.  Real engineering facts only.
5.  World itself demonstrates technical skill.
6.  No visitor is forced to play a game to access information.

------------------------------------------------------------------------

# 4. Non-Goals

Do NOT build:

-   Minecraft clone mechanics;
-   survival;
-   crafting;
-   combat;
-   mobs;
-   inventory;
-   multiplayer;
-   procedural infinite terrain;
-   block mining;
-   player accounts;
-   unnecessary game mechanics.

This is a **portfolio experience**, not a game.

------------------------------------------------------------------------

# 5. World Architecture

## 5.1 Circuit

Central navigation spine.

Contains:

-   racing circuit;
-   pit lane;
-   timing gantry;
-   barriers;
-   marshal points;
-   garages;
-   signs;
-   lighting.

## 5.2 F1 Garage

Represents race engineering.

Contains:

-   original voxel single-seater;
-   strategy workstation;
-   telemetry wall;
-   tyre area;
-   pit equipment.

Projects:

-   RaceMind-AI;
-   F1 Race Manager.

## 5.3 Telemetry Tower

Represents Live F1 Intelligence.

Contains:

-   event stream;
-   provider visualization;
-   replay visualization;
-   analysis display;
-   verified metrics.

Verified project metrics may include:

``` text
1,067,193 canonical events
0 malformed records
~2,650 events/s
~0.10 ms p50/event
99 MB peak memory
```

No new metrics may be invented.

## 5.4 Simulation Lab

Represents F1 Lap-Time Simulator.

Contains:

-   vehicle-performance workstation;
-   track/corner model;
-   aero visualization;
-   tyre/grip visualization;
-   performance decomposition;
-   solver/convergence visualization.

The visual model is illustrative and must not be represented as CFD or
physically validated beyond the actual project evidence.

## 5.5 AI / ML Lab

Projects:

-   EA FC Intelligence;
-   Vyaparpulse.

Visual language:

-   data cores;
-   model terminals;
-   feature pipelines;
-   recommendation displays;
-   forecasting displays.

Avoid generic "AI brain" imagery.

## 5.6 Engineering HQ

Contains:

-   Experience;
-   About;
-   Contact;
-   engineering principles;
-   return-to-professional-site portal.

------------------------------------------------------------------------

# 6. User Journeys

## Recruiter

``` text
LAND
 -> IDENTITY
 -> PROJECTS
 -> PROJECT INSPECTION
 -> OPEN CASE STUDY
```

## Explorer

``` text
LAND
 -> WORLD BOOT
 -> CIRCUIT
 -> GARAGE
 -> TELEMETRY
 -> SIMULATION
 -> AI / ML
 -> HQ
```

## Direct search

``` text
LAND
 -> /
 -> SEARCH
 -> PROJECT
 -> INSPECT
 -> OPEN CASE STUDY
```

## Mobile

``` text
LAND
 -> LOCATION MENU
 -> CAMERA TRANSITION
 -> INSPECT
```

Mobile must not force desktop FPS controls.

------------------------------------------------------------------------

# 7. Entry Experience

## Boot

``` text
ASISH / ENGINEERING WORLD

INITIALISING WORLD...

TERRAIN             ██████████
VEHICLE SYSTEMS     ██████████
TELEMETRY           ██████████
SIMULATION          ██████████
AI / ML             ██████████

SYSTEM ONLINE
```

The boot must be skippable.

Do not fake asset-loading percentages. If actual progress is
unavailable, use deterministic system phases.

## Camera reveal

``` text
HIGH ALTITUDE
 -> CIRCUIT
 -> PIT LANE
 -> GARAGE
 -> F1 CAR
 -> SPAWN
```

Then:

``` text
ASISH OLIVER M
MOTORSPORT SOFTWARE ENGINEER
AI / ML ENGINEER

[ ENTER ENGINEERING WORLD ]
```

------------------------------------------------------------------------

# 8. Technical Architecture

``` text
                         NEXT.JS
                            |
             +--------------+--------------+
             |                             |
       Semantic HTML                 Client boundary
                                           |
                                   EngineeringWorld
                                           |
                           +---------------+---------------+
                           |                               |
                          R3F                           Zustand
                           |                               |
                       Three.js                      World State
                           |                               |
             +-------------+-------------+                 |
             |             |             |                 |
          Terrain      Landmarks    Interaction            |
             |             |             |                 |
        Instancing       LOD        Raycasting              |
             +-------------+-------------+-----------------+
                                           |
                                      HTML HUD
                                           |
                                   Canonical project data
                                           |
                                   Existing case studies
```

------------------------------------------------------------------------

# 9. Repository Architecture

``` text
asish-engineering-world/

app/
  layout.tsx
  page.tsx
  world/
    page.tsx

components/
  world/
    EngineeringWorld.tsx
    WorldCanvas.tsx
    WorldBoot.tsx
    WorldHUD.tsx
    WorldMap.tsx
    WorldCommandPalette.tsx
    WorldFallback.tsx

  terrain/
    Terrain.tsx
    TerrainChunk.tsx
    Circuit.tsx
    PitLane.tsx
    Environment.tsx

  garage/
    Garage.tsx
    F1Car.tsx
    StrategyStation.tsx
    TelemetryWall.tsx

  telemetry/
    TelemetryTower.tsx
    EventStream.tsx
    DataDisplay.tsx

  simulation/
    SimulationLab.tsx
    VehicleModel.tsx
    CornerDisplay.tsx
    PerformanceDisplay.tsx

  ai/
    AiLab.tsx
    DataCore.tsx
    ModelTerminal.tsx

  hq/
    EngineeringHQ.tsx
    ExperienceStation.tsx
    ContactTerminal.tsx

  interaction/
    Interactable.tsx
    InteractionPrompt.tsx
    FocusTarget.tsx
    InteractionRegistry.ts

  camera/
    CameraController.tsx
    CameraTargets.ts
    CameraTransitions.ts

data/
  world.ts
  locations.ts
  worldProjects.ts

state/
  worldStore.ts
  cameraStore.ts
  settingsStore.ts

lib/
  assets.ts
  performance.ts
  deviceTier.ts
  accessibility.ts

public/
  models/
  textures/
  audio/
  world/

docs/
  ARCHITECTURE.md
  WORLD_DESIGN.md
  PERFORMANCE.md
  ASSET_PIPELINE.md
```

------------------------------------------------------------------------

# 10. State Architecture

Use Zustand for low-frequency application/world state.

``` ts
type WorldMode =
  | "boot"
  | "explore"
  | "inspect"
  | "map"
  | "command"
  | "fallback";

type DeviceTier = "high" | "medium" | "low";

interface WorldState {
  mode: WorldMode;
  deviceTier: DeviceTier;

  activeLocation: string | null;
  activeProject: string | null;
  selectedTarget: string | null;

  reducedMotion: boolean;
  audioEnabled: boolean;

  setMode: (mode: WorldMode) => void;
  focusLocation: (id: string) => void;
  inspectProject: (slug: string) => void;
}
```

**Rule:** Do not put per-frame camera/animation values into Zustand.

Use refs/local state for high-frequency values.

------------------------------------------------------------------------

# 11. Camera Architecture

Camera quality is a first-class system.

Layers:

``` text
Base camera
  -> local orientation group
  -> smooth rotation buffer
  -> player/view transform
  -> focus target
  -> cinematic transition
```

States:

``` text
FREE
FOCUSING
INSPECTING
CINEMATIC
MAP
```

Requirements:

-   smooth;
-   no jitter;
-   no abrupt snapping;
-   local-axis camera offsets;
-   interruptible;
-   user can regain control immediately.

The Andrew Woan reference specifically documents rotation buffering and
local-axis camera grouping; use those lessons as design inspiration, not
copied implementation.

------------------------------------------------------------------------

# 12. Interaction Architecture

All interactive objects register through one system.

``` ts
interface InteractionTarget {
  id: string;
  type: "project" | "location" | "terminal" | "portal";
  label: string;
  position: [number, number, number];
  action: () => void;
}
```

Flow:

``` text
RAYCAST
 -> TARGET
 -> HIGHLIGHT
 -> [E] INSPECT
 -> HANDLER
 -> WORLD STATE
 -> CAMERA / OVERLAY / NAVIGATION
```

Do not create custom interaction logic for every object.

------------------------------------------------------------------------

# 13. Canonical Project Integration

The world must reference existing project data.

``` ts
interface WorldProject {
  id: string;
  projectSlug: string;
  title: string;
  category: "motorsport" | "ai-ml" | "simulation-game";
  locationId: string;

  preview: {
    tagline: string;
    description: string;
    metrics?: {
      label: string;
      value: string;
    }[];
  };

  cameraTarget: [number, number, number];
}
```

The world is a **projection** of the professional portfolio's canonical
project records.

Do not duplicate entire case studies inside 3D components.

------------------------------------------------------------------------

# 14. Project Inspection Mode

When a project is inspected:

``` text
WORLD MOTION -> REDUCED
CAMERA -> FOCUSED
TARGET -> HIGHLIGHTED
HUD -> EXPANDED
```

Example:

``` text
SYSTEM 01
LIVE F1 INTELLIGENCE

Real-time Formula 1 data +
deterministic race intelligence.

1,067,193 CANONICAL EVENTS

[ OPEN CASE STUDY ]
```

`OPEN CASE STUDY` navigates to the existing professional route.

The world remains the index.

The professional portfolio remains the deep technical case-study system.

------------------------------------------------------------------------

# 15. Rendering Architecture

## Instancing

Use `InstancedMesh` for repeated:

-   voxel blocks;
-   road tiles;
-   kerbs;
-   barriers;
-   lamps;
-   vegetation;
-   architectural modules.

Do not render thousands of independent meshes.

## Chunks

Use spatial chunks:

``` text
World
 |- Chunk 0,0
 |- Chunk 0,1
 |- Chunk 1,0
 |- Chunk 1,1
```

Only nearby chunks need full interactive detail.

## LOD

Use:

``` text
FAR  -> LOW
MID  -> MEDIUM
NEAR -> HIGH
```

Hero assets may use separate high-quality meshes.

------------------------------------------------------------------------

# 16. Asset Pipeline

Preferred authoring:

**Blender**

Preferred runtime:

**GLB / glTF**

Pipeline:

``` text
Blender
 -> GLB
 -> optimization/compression
 -> public/models
 -> R3F loader
```

Use original assets.

Do not use:

-   Minecraft characters;
-   Minecraft branding;
-   Mojang logos;
-   copied Minecraft textures;
-   copied world layouts;
-   copyrighted third-party assets without permission.

------------------------------------------------------------------------

# 17. Voxel Rendering Strategy

The world should look voxel-based without requiring huge texture
budgets.

Prefer:

-   small tileable textures;
-   texture atlases where useful;
-   vertex colors for simple blocks;
-   shared materials;
-   repeated geometry through instancing.

Avoid:

-   4K textures for ordinary blocks;
-   unique textures for every prop;
-   unnecessary transparency;
-   heavy normal maps everywhere.

------------------------------------------------------------------------

# 18. Lighting

Target:

**stylized engineering realism**

Use:

-   one main directional light;
-   restrained environment/ambient light;
-   localized emissive accents;
-   selective shadows.

Avoid:

-   heavy bloom;
-   dozens of dynamic lights;
-   expensive global illumination;
-   volumetric effects everywhere.

Landmark lighting should guide navigation.

------------------------------------------------------------------------

# 19. Performance Architecture

Targets:

-   60 FPS on capable desktop hardware;
-   stable frame pacing during normal exploration;
-   no major performance collapse when entering a landmark.

Profile:

``` text
FPS
draw calls
triangles
geometry memory
texture memory
CPU usage
GPU usage where available
bundle size
initial load
```

Do not optimize against invented thresholds before profiling.

Optimize measured bottlenecks.

Use instancing to reduce draw calls. Use LOD and culling for distant
objects.

------------------------------------------------------------------------

# 20. Loading Architecture

Progressive world initialization:

``` text
HTML SHELL
 -> R3F INITIALIZATION
 -> WORLD SHELL
 -> CIRCUIT
 -> LANDMARKS
 -> HERO ASSETS
 -> INTERACTIVE SYSTEMS
```

A failed non-critical asset must not destroy the entire experience.

------------------------------------------------------------------------

# 21. GPU Resource Lifecycle

Establish ownership for:

-   geometries;
-   materials;
-   textures;
-   render targets;
-   post-processing resources;
-   controls.

When a transient resource is no longer needed:

``` text
USE
 -> REMOVE
 -> DISPOSE
```

Do not blindly dispose shared resources.

Track renderer statistics during development:

``` text
renderer.info.memory.geometries
renderer.info.memory.textures
renderer.info.render.calls
renderer.info.render.triangles
```

When leaving `/world`:

-   remove listeners;
-   stop world-owned loops;
-   dispose transient render targets;
-   dispose obsolete resources;
-   release controls;
-   remove subscriptions.

------------------------------------------------------------------------

# 22. HUD Architecture

Use HTML/CSS for HUD and portfolio information.

Top:

``` text
ASISH // ENGINEERING WORLD
● ONLINE
```

Controls:

``` text
[M] MAP
[/] SEARCH
[ESC] CLOSE
```

Context:

``` text
[E] INSPECT TELEMETRY SYSTEM
```

Avoid putting critical readable information into 3D text.

------------------------------------------------------------------------

# 23. Map

The map is a 2D HTML overlay, not a second 3D scene.

``` text
             AI LAB
                ●

 TELEMETRY ●────┼────● SIMULATION
                |
                ●
              GARAGE
                |
             CIRCUIT
```

Selecting a location calls:

``` text
focusLocation(locationId)
```

Then the camera transitions to the location.

------------------------------------------------------------------------

# 24. Command Palette

Press `/`.

Search:

-   projects;
-   locations;
-   experience;
-   about;
-   contact;
-   exit world.

Results must be keyboard accessible.

Example:

``` text
ENGINEERING WORLD

> Search...

Live F1 Intelligence
F1 Lap-Time Simulator
RaceMind-AI
F1 Race Manager
EA FC Intelligence
Vyaparpulse
Experience
About
Contact
Exit World
```

------------------------------------------------------------------------

# 25. Responsive Architecture

## Desktop

Full world.

Controls:

``` text
W A S D
Mouse
E
M
/
ESC
```

## Tablet

Reduced controls plus map and tap interaction.

## Mobile

Do not recreate FPS controls.

Use:

``` text
LOCATION MENU
 -> CAMERA TRANSITION
 -> INSPECT
```

Quick locations:

-   Circuit
-   Garage
-   Telemetry
-   Simulation
-   AI / ML
-   HQ

------------------------------------------------------------------------

# 26. Accessibility

The HTML layer must expose:

-   name;
-   roles;
-   project names;
-   navigation;
-   experience;
-   contact.

Keyboard:

-   Tab;
-   Enter;
-   Escape;
-   arrows in menus;
-   `/` search;
-   `M` map.

Respect:

``` text
prefers-reduced-motion: reduce
```

Reduced motion:

-   static camera;
-   no camera sway;
-   minimal transitions;
-   no pulsing UI;
-   no cinematic movement.

WebGL failure:

``` text
3D EXPERIENCE UNAVAILABLE

THE ENGINEERING PORTFOLIO REMAINS AVAILABLE

[ VIEW PROFESSIONAL PORTFOLIO ]
```

------------------------------------------------------------------------

# 27. Audio

Audio is OFF by default.

Potential layers:

-   circuit ambience;
-   garage ambience;
-   engine;
-   telemetry;
-   UI.

Use a central audio manager.

No aggressive autoplay.

------------------------------------------------------------------------

# 28. SEO / Semantic Fallback

The page must contain meaningful HTML:

``` text
ASISH OLIVER M
Motorsport Software Engineer
AI/ML Engineer

Engineering World

Live F1 Intelligence
F1 Lap-Time Simulator
RaceMind-AI
F1 Race Manager
EA FC Intelligence
Vyaparpulse

Experience
About
Contact
```

The 3D scene enhances the content; it does not replace it.

------------------------------------------------------------------------

# 29. Security

No secrets in:

-   client JavaScript;
-   GLB files;
-   textures;
-   public world data;
-   exposed environment variables.

No API keys.

No runtime executable injection.

Minimize third-party scripts.

------------------------------------------------------------------------

# 30. Failure Modes

### WebGL unavailable

Use the 2D engineering-world fallback.

### GPU weak

Automatically lower quality.

### Asset failure

Show placeholder and continue.

### World initialization failure

Provide professional portfolio navigation.

### Camera failure

Reset to a known target.

Every failure has an exit.

------------------------------------------------------------------------

# 31. Device Tiers

``` ts
type DeviceTier = "high" | "medium" | "low";
```

Consider:

-   viewport;
-   WebGL capability;
-   device memory where available;
-   hardware concurrency;
-   pixel ratio.

Do not rely on user-agent strings alone.

Provide a manual quality control:

``` text
QUALITY
AUTO
HIGH
MEDIUM
LOW
```

------------------------------------------------------------------------

# 32. Analytics

If analytics already exist, preserve them.

Optional high-level events:

``` text
world_enter
world_exit
location_open
project_inspect
case_study_open
map_open
command_search
```

No invasive tracking.

------------------------------------------------------------------------

# 33. Development Diagnostics

Development-only diagnostics:

``` text
FPS
DRAW CALLS
TRIANGLES
GEOMETRIES
TEXTURES
WORLD CHUNKS
DEVICE TIER
```

Toggle with `F3` or a development-only query flag.

Never show diagnostics to normal visitors.

------------------------------------------------------------------------

# 34. Implementation Phases

## Phase 0 --- Audit

Deliver:

-   repository architecture;
-   dependency report;
-   current performance baseline;
-   asset strategy;
-   route plan.

No major implementation.

## Phase 1 --- Shell

Build:

-   `/world`;
-   semantic shell;
-   boot;
-   loading state;
-   fallback.

## Phase 2 --- Rendering foundation

Build:

-   R3F Canvas;
-   camera;
-   lighting;
-   device tier;
-   renderer settings.

## Phase 3 --- Vertical slice

Build ONLY:

-   small circuit;
-   one garage;
-   one F1 car;
-   one RaceMind interaction;
-   inspection overlay;
-   case-study navigation.

This is the first quality gate.

## Phase 4 --- World expansion

Add:

-   telemetry tower;
-   simulation lab;
-   AI/ML lab;
-   HQ.

## Phase 5 --- Navigation

Add:

-   map;
-   command palette;
-   quick travel;
-   interaction registry.

## Phase 6 --- Optimization

Add:

-   instancing;
-   LOD;
-   chunking;
-   asset compression;
-   caching.

## Phase 7 --- Responsive

Desktop, tablet, mobile.

## Phase 8 --- Accessibility

Keyboard, reduced motion, fallback, semantics.

## Phase 9 --- Polish

Camera, lighting, sound, transitions, micro-interactions.

## Phase 10 --- QA

Full test matrix.

## Phase 11 --- Preview deployment

Deploy preview.

Test real browsers/devices.

## Phase 12 --- Production

Only after acceptance gates pass.

------------------------------------------------------------------------

# 35. Quality Gates

### Gate 1 --- Architecture

-   no duplicated project truth;
-   controlled state;
-   reusable world systems.

### Gate 2 --- Vertical slice

Circuit + garage + car + one project must already feel premium.

### Gate 3 --- Performance

No significant regression from world expansion.

### Gate 4 --- Accessibility

Important content works without WebGL.

### Gate 5 --- Mobile

Mobile is intentionally designed.

### Gate 6 --- Production

All tests and browser QA pass.

------------------------------------------------------------------------

# 36. QA Matrix

Test:

``` text
1920x1080
1536x864
1440x900
1280x800
1024x768
768x1024
412x915
390x844
360x800
```

States:

``` text
fresh load
reload
slow network
WebGL unavailable
low quality
reduced motion
audio off
keyboard only
touch
direct project navigation
exit world
return to world
```

Check:

-   no console errors;
-   no hydration warnings;
-   no horizontal overflow;
-   no broken assets;
-   stable camera;
-   stable interaction;
-   stable frame pacing;
-   resource cleanup;
-   all project links;
-   fallback;
-   accessibility.

------------------------------------------------------------------------

# 37. Acceptance Criteria

The world is complete only when:

-   [ ] `/world` works directly;
-   [ ] existing professional portfolio remains intact;
-   [ ] boot is skippable;
-   [ ] circuit exists;
-   [ ] garage exists;
-   [ ] telemetry tower exists;
-   [ ] simulation lab exists;
-   [ ] AI/ML lab exists;
-   [ ] HQ exists;
-   [ ] all six projects are discoverable;
-   [ ] project data references canonical records;
-   [ ] inspection mode works;
-   [ ] case-study navigation works;
-   [ ] map works;
-   [ ] command palette works;
-   [ ] desktop controls work;
-   [ ] mobile mode works;
-   [ ] reduced motion works;
-   [ ] WebGL fallback works;
-   [ ] repeated geometry is instanced;
-   [ ] useful LOD is implemented;
-   [ ] GPU resources have controlled lifecycle;
-   [ ] no copyrighted Minecraft assets are used;
-   [ ] no fake metrics are introduced;
-   [ ] typecheck passes;
-   [ ] lint passes;
-   [ ] build passes;
-   [ ] existing QA passes;
-   [ ] browser QA passes.

------------------------------------------------------------------------

# 38. Architecture Decision Records

## ADR-001 --- Separate `/world`

**Decision:** `/world` is a separate experience.

**Reason:** Protects the serious portfolio while allowing
experimentation.

## ADR-002 --- React Three Fiber

**Decision:** Use R3F + Three.js.

**Reason:** Strong React integration and suitable scene composition.

## ADR-003 --- HTML HUD

**Decision:** Critical UI is HTML/CSS.

**Reason:** Accessibility, responsiveness, typography and
maintainability.

## ADR-004 --- Instancing

**Decision:** Repeated blocks use instancing.

**Reason:** Draw-call reduction and scalable voxel rendering.

## ADR-005 --- Compact world

**Decision:** Small, high-quality world.

**Reason:** Experience quality matters more than map size.

## ADR-006 --- Exploration optional

**Decision:** Projects are reachable through map/search/direct
navigation.

**Reason:** Portfolio information must never be hidden behind gameplay.

## ADR-007 --- Original voxel assets

**Decision:** Create original art.

**Reason:** Unique identity and avoidance of copied Minecraft assets.

## ADR-008 --- Progressive enhancement

**Decision:** WebGL enhances semantic HTML.

**Reason:** Accessibility, SEO and reliability.

## ADR-009 --- Guided mobile mode

**Decision:** Mobile uses guided navigation rather than desktop FPS
controls.

**Reason:** Better touch usability.

## ADR-010 --- Performance instrumentation

**Decision:** Profile real rendering metrics during development.

**Reason:** 3D quality must include engineering-grade performance.

------------------------------------------------------------------------

# 39. What Makes This Different

A typical Minecraft portfolio is:

``` text
3D WORLD
+
MINECRAFT AESTHETIC
+
PORTFOLIO
```

Our target is:

``` text
ENGINEERING INFORMATION ARCHITECTURE
+
VOXEL WORLD
+
MOTORSPORT
+
TELEMETRY
+
SIMULATION
+
AI/ML
+
REAL PROJECT DATA
+
CASE STUDIES
+
PERFORMANCE ENGINEERING
```

The differentiator is not "Minecraft."

The differentiator is:

> **The world is a spatial model of the engineer's actual systems.**

------------------------------------------------------------------------

# 40. Final Experience Model

``` text
                         ASISH OLIVER M
                              |
                              v
                    ENGINEERING WORLD
                              |
                              v
                         MOTORSPORT
                              |
              +---------------+---------------+
              |               |               |
          TELEMETRY       SIMULATION       STRATEGY
              |               |               |
              +---------------+---------------+
                              |
                              v
                           SOFTWARE
                              |
                              v
                           AI / ML
                              |
                              v
                         INTELLIGENCE
                              |
                              v
                    ENGINEERING DECISIONS
```

------------------------------------------------------------------------

# 41. Critical Implementation Rule

**Do not build the whole world in the first pass.**

The first implementation milestone is only:

``` text
WORLD BOOT
   |
SMALL CIRCUIT
   |
ONE F1 GARAGE
   |
ONE F1 CAR
   |
ONE REAL PROJECT
   |
INSPECTION MODE
   |
OPEN CASE STUDY
```

If this vertical slice is not exceptional, stop and improve it before
expanding.

The quality of the first 10% determines the quality of the final world.

------------------------------------------------------------------------

# 42. Antigravity Execution Protocol

When this document is supplied to Antigravity:

1.  Audit the repository before editing.
2.  Produce a concrete implementation plan.
3.  Identify reusable dependencies.
4.  Do not invent project data.
5.  Build the vertical slice first.
6.  Run typecheck/lint/build after each stable phase.
7.  Perform browser QA after every major rendering phase.
8.  Profile draw calls, triangles and memory.
9.  Fix regressions before expanding.
10. Keep all world-specific systems isolated.
11. Preserve the existing professional portfolio.
12. Deploy preview only after the architecture gates pass.
13. Production deploy only after final QA.

**Priority order:**

``` text
CORRECTNESS
>
PERFORMANCE
>
ACCESSIBILITY
>
INFORMATION ARCHITECTURE
>
VISUAL POLISH
>
EXTRA EFFECTS
```

------------------------------------------------------------------------

# 43. Final Principle

> **Do not build a Minecraft portfolio.**
>
> Build an **engineering world** that happens to use voxel visual
> language.

The visitor should leave thinking:

> "This engineer built a world around his engineering systems."

Not:

> "This engineer made a Minecraft website."

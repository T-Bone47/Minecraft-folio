# Architecture Decision Records (ADRs) — ASISH: THE ENGINEERING FRONTIER

**Product**: ASISH: THE ENGINEERING FRONTIER  
**Identity**: Interactive 3D Voxel Engineering Universe  
**Canonical Identity**: Asish Oliver M — Motorsport Software Engineer & AI/ML Engineer  
**Date**: November 2026  
**Auditor**: Principal Software Architect & Lead Three.js Systems Engineer  

---

## ADR-01: Product Identity Boundary — ASISH: THE ENGINEERING FRONTIER vs ASISH OS

### Context
There is an independent portfolio project called **ASISH OS**, which is a desktop-style workspace built around floating windows, window managers, and an operating-system desktop metaphor. 
The user mandates that **Minecraft-folio** must NOT replicate that experience. The two products must have distinct identities, navigation models, UX philosophies, visual languages, and interaction patterns.

### Decision
- **ASISH: THE ENGINEERING FRONTIER** is strictly an **immersive physical engineering universe**.
- Navigation is physical, spatial, and first-person (WASD, mouse look, in-world footpaths, facility doorways).
- Projects are presented as physical campus facilities, machinery, vehicles, and interactive terminals—never as floating desktop window collections.
- Recruiter shortcuts and 2D fallbacks exist as discreet overlays to guarantee accessibility, but the primary experience is in-world discovery.

### Consequences
- Prevents identity drift and ensures visitors have a unique, memorable spatial experience.

---

## ADR-02: Single Source of Truth for World Geometry (`lib/terrainModel.ts`)

### Context
3D voxel worlds can suffer from drift between the terrain mesh generator, physics/collision bounds, cartographer map blips, and camera target positions.

### Decision
All campus positions, facility pads, road coordinates, circuit geometries, and collision boxes are anchored mathematically in [`lib/terrainModel.ts`](file:///c:/Users/dream/Downloads/Minecraft-folio-main/lib/terrainModel.ts) and [`data/facilities.ts`](file:///c:/Users/dream/Downloads/Minecraft-folio-main/data/facilities.ts).
- `getTerrainSurfaceY(x, z)` determines exact feet elevation.
- `resolveSlidingCollision(curr, desired)` prevents tunneling through any facility wall.
- `clampToIsland(x, z)` enforces strict circular island boundaries ($R = 42\text{m}$).

### Consequences
- Guarantees zero clipping or sinking through terrain across all graphics quality tiers.

---

## ADR-03: Reusable Technical Demonstration Architecture

### Context
Part 6 of the Master Prompt requires 5 interactive technical demonstrations (F1 Telemetry Explorer, Lap-Time Simulator, Machine Learning Playground, Data Pipeline Observatory, and Opportunity Matching Explorer). Building ad-hoc separate modal components would fragment state and lead to messy event handling.

### Decision
Implement demonstrations as cohesive, typed sub-engines within [`components/hud/StationModal.tsx`](file:///c:/Users/dream/Downloads/Minecraft-folio-main/components/hud/StationModal.tsx) and the centralized [`state/interactionRegistry.ts`](file:///c:/Users/dream/Downloads/Minecraft-folio-main/state/interactionRegistry.ts).
- Each demonstration has:
  - Clear user inputs (parameters, dropdowns, tabs).
  - Deterministic computational pipeline (zero fabricated LLM outputs).
  - Explicit distinction between real recorded data, deterministic mathematical models, and illustrative educational simulations.
  - Reset state button.

### Consequences
- Clean state boundaries, easily testable in unit tests and Puppeteer browser QA.

---

## ADR-04: Static Routing & Direct Project URL Aliases (`/projects/[slug]`)

### Context
Recruiters and external visitors must be able to share and bookmark direct links to individual project case studies (e.g., `/projects/racemind-ai`, `/projects/live-f1-intelligence`) without being forced to explore the 3D world.

### Decision
Maintain canonical case study blueprints in `app/work/[slug]/page.tsx` and implement static mirror pages in `app/projects/[slug]/page.tsx` using `generateStaticParams()`.

### Consequences
- 100% search-engine discoverable, fully accessible without WebGL, shareable links.

---

## ADR-05: Zero-Fabrication Metric Grounding & Evidence Grading

### Context
Portfolio engineering credibility requires strict adherence to factual evidence.

### Decision
All metrics in `data/projects.ts` declare an explicit `evidence` tier (`VERIFIED_REPO_CODE`, `MEASURED_RUNTIME`, `ACADEMIC_SUBMISSION`, or `SYSTEMS_ARCHITECTURE`).
- Zero fabricated telemetry logs or fake GPA scores.
- Synthetic demonstration data is explicitly labeled `ILLUSTRATIVE DEMO OUTPUT`.

### Consequences
- Absolute technical credibility with engineering hiring managers.

---

## ADR-06: Deterministic Client-Side Simulation Engines

### Context
Demonstrations must run reliably on static hosting (Vercel, Netlify, GitHub Pages) without requiring a paid or fragile live backend microservice.

### Decision
All technical demonstrations (point-mass lap solver, vector cosine similarity, telemetry traces, and data pipeline stage observer) run client-side in pure deterministic TypeScript.

### Consequences
- 100% uptime, zero cold-start latency, deterministic and reliable browser QA verification.

---

## ADR-07: WebGL Lifecycle Management & Graceful 2D Context Interception

### Context
Visitors on low-end hardware, machines with disabled WebGL, or mobile devices may experience WebGL context loss or failure.

### Decision
- [`components/world/EngineeringWorld.tsx`](file:///c:/Users/dream/Downloads/Minecraft-folio-main/components/world/EngineeringWorld.tsx) detects WebGL support during boot.
- If WebGL is unavailable or fails, [`components/world/WorldFallback.tsx`](file:///c:/Users/dream/Downloads/Minecraft-folio-main/components/world/WorldFallback.tsx) renders an accessible 2D Cartographer SVG campus map with full access to project dossiers, career timelines, and resume download.
- [`components/world/WorldResourceBoundary.tsx`](file:///c:/Users/dream/Downloads/Minecraft-folio-main/components/world/WorldResourceBoundary.tsx) disposes Three.js geometries, materials, and textures cleanly upon unmount.

### Consequences
- Robust accessibility and zero browser crashes.


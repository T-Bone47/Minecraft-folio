# Chrome Era browser QA — 8 November 2026

## Capture coverage

`qa-chrome-captures.mjs` captures the real app at 1280×800, medium preset, plus a 390px mobile field-guide view. There are 15 before/after view categories: landing, plaza, garage exterior/interior, hero car, cockpit, circuit, Telemetry Tower, AI Lab, Simulation Lab, HQ, sunset, night, recruiter and mobile. The after set also includes a wider HQ approach and a first-person HQ interior (17 images total). Raw manifests: chrome-before-captures.json and chrome-after-captures.json. Screenshots use `docs/screenshots/chrome-before-*` and `chrome-after-*`. These show corresponding areas, not a controlled pixel-identical camera comparison.

| View | Before | After |
| --- | --- | --- |
| Garage exterior | [Before](screenshots/chrome-before-garage-exterior.png) | [After](screenshots/chrome-after-garage-exterior.png) |
| Garage interior | [Before](screenshots/chrome-before-garage-interior.png) | [After](screenshots/chrome-after-garage-interior.png) |
| Hero car | [Before](screenshots/chrome-before-hero-car.png) | [After](screenshots/chrome-after-hero-car.png) |
| Cockpit | [Before](screenshots/chrome-before-cockpit.png) | [After](screenshots/chrome-after-cockpit.png) |
| Circuit | [Before](screenshots/chrome-before-circuit.png) | [After](screenshots/chrome-after-circuit.png) |
| Campus | [Before](screenshots/chrome-before-plaza.png) | [After](screenshots/chrome-after-plaza.png) |
| Telemetry Tower | [Before](screenshots/chrome-before-telemetry.png) | [After](screenshots/chrome-after-telemetry.png) |
| AI Lab | [Before](screenshots/chrome-before-ai-lab.png) | [After](screenshots/chrome-after-ai-lab.png) |
| Simulation Lab | [Before](screenshots/chrome-before-simulation.png) | [After](screenshots/chrome-after-simulation.png) |
| Engineering HQ | [Before](screenshots/chrome-before-hq.png) | [After](screenshots/chrome-after-hq.png) |
| Sunset | [Before](screenshots/chrome-before-sunset.png) | [After](screenshots/chrome-after-sunset.png) |
| Night | [Before](screenshots/chrome-before-night.png) | [After](screenshots/chrome-after-night.png) |
| Landing | [Before](screenshots/chrome-before-landing.png) | [After](screenshots/chrome-after-landing.png) |
| Recruiter | [Before](screenshots/chrome-before-recruiter.png) | [After](screenshots/chrome-after-recruiter.png) |
| Mobile guide | [Before](screenshots/chrome-before-mobile.png) | [After](screenshots/chrome-after-mobile.png) |

HQ after-only inspection: [Wide approach](screenshots/chrome-after-hq-wide.png) · [Interior career panels](screenshots/chrome-after-hq-interior.png).

Visual inspection found and corrected: an overbroad CSS selector applying red to a selection-colour wrapper, a blank plate covering garage branding, low-contrast sign colour-space handling, legacy orange/gold hand tools, an oversized AI display obstructing the main sightline, and a decorative path lamp in the third-person approach camera line. Ground-floor solid meshes hid the collision-defined entrances in HQ and the other labs. A shared FacilityWalls component now renders those canonical perimeter segments. Windows/signs leave the doorways open; AI wings are research workstations; the tower and simulation displays are visible inside. Floors sit above the terrain to avoid flicker. HQ career/contact stations face its entrance. The football animation is labeled illustrative, with fitted results linked to The Experiment, and its backwards display face is corrected. Legacy landing mock RPM/speed values were replaced with actual descriptions of the local playable systems. The cinematic tour's stale facility targets and unsupported captions were also corrected; a cross-registry test checks its targets.

Capture harness corrections: replace a fixed walking delay with an actual position condition; use the existing N key for time-of-day instead of guessing the displayed label. Final manifests, not interrupted attempts, determine capture completion.

Final regression harness correction: mobile audio bounds were initially asserted before the details toggle committed its layout update. The test now waits for the open panel's actual in-viewport rectangle and records it. Audio and the remaining scripts were rerun successfully after that correction; preceding successful cockpit/station/control/visitor results were retained. See ACCESSIBILITY_REPORT.md.

## Functional verification

TypeScript, lint, all 43 unit tests and the 32-route production build pass. `/world` first-load JS is approximately 429 kB. `qa-chrome-release.mjs` runs the capture and regression scripts sequentially and stops on failure.

Passed on the chrome build:
- Full cockpit journey: garage approach, entry, camera/steering, complete four-gate lap, safe exit, sector/reference review, replay and no runtime exceptions (9 grouped checks).
- Experiment/System: three fitted datasets, held-out metrics/baselines, actual decision stump, seven repairs and wrong-repair negative case, direct routes/resume and disabled WebGL (27 checks).
- Controls: first/third person, trusted pointer lock, map pause, jump, car reset/exit, quality switching, reload, touch walking/driving, actual context-loss fallback (11 checks).
- All five visitor journeys in direct/world modes, three project depths, architecture, guides and mobile field guide (14 grouped checks).
- Actual audio gain/mute and opened mobile control bounds (3 checks).
- Production smoke: route/asset responses, canonical URL, contact targets, security headers and 404.

Final refinements affect sign gamma, display placement, landing copy, decorative lamp placement, the compact grandstand and visible facility shells/station positions, without changing mission or vehicle state. Capture/quality samples, the six-facility Explorer run, keyboard/camera checks and production smoke are refreshed after those refinements. The final walking checks go beyond each doorway into its room; interior evidence is saved as release-facility-*.png. See raw JSON for exact executed outcomes.

## Changed files and preserved boundaries

Palette/materials: data/chromeEra.ts, lib/voxelTextures.ts. Reflection/light: ChromeEnvironment.tsx, VoxelSky.tsx, WorldScene.tsx. Geometry/livery: CarChromeDetails.tsx, VoxelF1Car.tsx, DriveableF1Car.tsx, Cockpit.tsx, ChromeCampusDetails.tsx, FacilityWalls.tsx, Circuit.tsx. Facility material roles: F1Garage, TelemetryTower, AIMLLab, SimulationLab, TeamOperationsHQ, EngineeringHQ. Character/tools: AnimatedVoxelAvatar, VoxelEngineerAvatar, FirstPersonHand, VoxelGadget. UI: chrome-era.css, layout, landing, ProfileSpawn, WorldHUD and DriveProgress. Terrain: widened visual runoff and relocated path fixtures, using the same sampling function for renderer/player. QA/docs/social card updated.

Vehicle integrator, lap validation, telemetry schema, ML fitting, pipeline repair logic, mission reducer, professional URLs and visitor state were preserved. No new copyrighted team artwork or historical photo was introduced. No production deployment occurred.

## Limits / release recommendation

Measured hardware results are in PERFORMANCE_REPORT.md and chrome-performance-results.json: 300 intervals per preset on Intel UHD, with mean frame intervals 12.81 ms low, 31.03 ms medium and 21.67 ms high. The medium sample includes a 2.51-second stall; this is an open P2 investigation, and the run does not rank quality presets or establish a universal frame target. Real mobile GPUs, a full screen-reader/browser matrix and long-session thermal/memory behavior remain unverified. Reflection is a static procedural lighting environment, not realtime scene reflection. Camera avoidance still uses terrain/wall footprints; prop placement reduces observed obstructions but does not implement a mesh-accurate collision sweep. Upper decorative floors remain outside the traversable exhibit scope. The car is explicitly modernised, not a 2008 replica.

Local visual/function candidate passes its executed checks. Public-release recommendation remains UNKNOWN until hosted Vercel verification, owner approval and remaining device/accessibility gates are resolved. Vercel's first deployment requires explicit production approval; no project was repurposed or published.

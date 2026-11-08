# Implementation ledger

Work proceeds in dependency order. Browser and simulation results are recorded in QA_REPORT.md; compilation is not gameplay verification.

0. Audit: baseline checks passed; source findings in ENGINEERING_FRONTIER_AUDIT.md.
1. Exploration: repair input ownership, blocked movement, safe exits, camera distance and avatar updates.
2. Facilities: preserve physical exhibits and safe approaches; unify track topology with simulation.
3. Missions: typed definitions, event reducer, actual completion conditions and explicit reset.
4. Drive: deterministic physics, ordered gates, sectors, bounded telemetry, reference and debrief. Gate later work on tests and browser journey.
5. Experiment: local deterministic datasets, real fitted models, held-out evaluation and baseline.
6. System: deterministic event fixtures, fault diagnosis, repairs and measured simulation outcomes.
7. Evidence: canonical registry adapter, traceable local implementation and honest provenance.
8–9. Polish/discovery: retain voxel architecture and existing guide; add contextual mission signage where useful.
10. QA: unit/integration, typecheck, lint, build, browser journeys, fallback/mobile and measured performance.

## Phases 1–4 verification

Changed: player/avatar controllers, shared input predicate, HUD input ownership, garage interaction, terrain circuit, pure drive and mission modules, stores, telemetry debrief, touch controls, station dialog and focused tests. Preserved the original voxel car mesh and modified HUD content in place.

30 unit tests passed; typecheck passed. Chromium journey passed walking, perspective switching, map pause, physical garage approach, chassis inspection, keyboard-event driving through four gates, automatic safe exit, telemetry/sector comparison, and mission completion with no runtime errors. The first SwiftShader run timed out; a default-renderer run completed. Live reload during the run required reasserting held keys; the final automated script uses a browser-local keyboard-event driver.

At this intermediate checkpoint, production rerun, mobile layout, performance measurement and remaining experiences were pending; these were subsequently completed below. Drive model intentionally excludes tyre/aero/gear physics. Historical QA assertions are not relied upon.

## Phases 5–7 implementation

Changed: pure ML/pipeline modules, station components, mission pause/resume and session result caches, project evidence registry and provenance notices. Existing static project routes and physical facilities retained. Added nearby guide prompts and two original voxel guide exhibits using the existing avatar assets. Map circuit now matches the physical loop; return-to-spawn is explicit.

35 unit tests passed after ML and pipeline changes. Real held-out evaluation covers three tasks; all seven pipeline faults fail before repair and pass output invariants after the correct transformation. Incorrect repairs remain failed. Browser station journeys and final production checks subsequently passed; see the final QA report for results.

## Final phase ledger

| Phase | Main files changed | Delivered and checked |
| --- | --- | --- |
| 0 | ENGINEERING_FRONTIER_AUDIT.md, ENGINEERING_FRONTIER_ARCHITECTURE.md | Baseline classified; 25 baseline tests, lint, types and build passed. |
| 1 | FirstPersonPlayer.tsx, AnimatedVoxelAvatar.tsx, lib/frontier/input.ts, WorldHUD.tsx | Single-owner shortcuts, safe pointer lock, modal pause, live avatar, adjustable follow camera; unit and browser checks. |
| 2 | terrainModel.ts, Circuit.tsx, data/world.ts, F1Garage.tsx, WorldMap.tsx | Collision-aware facility access, a consistent perimeter circuit, map and spawn return. |
| 3 | lib/frontier/missions.ts, state/missionStore.ts | Reusable definitions, ordered events, pause/resume/reset and actual completion predicates; unit tests. |
| 4 | lib/frontier/drive.ts, state/driveStore.ts, DriveableF1Car.tsx, DriveProgress.tsx, DriveDebrief.tsx, F1DrivingHUD.tsx | Full validated lap, telemetry export, reference, sectors, cameras/reset/exit; end-to-end Chromium lap passed before later experiences began. |
| 5 | lib/frontier/ml.ts, ExperimentStation.tsx | Three real local evaluations, synthetic datasets, proper splits and baselines; unit and browser journeys. |
| 6 | lib/frontier/pipeline.ts, PipelineStation.tsx | Seven deterministic incidents, meaningful repair transformations and recovered-output validation; wrong-repair negative checks. |
| 7 | data/projects.ts, data/projectEvidence.ts, types/project.ts, project/inspection views | Real repository links, provenance, unsupported metric badges removed; evidence gaps explicitly retained as gaps. |
| 8–9 | NearbyMission.tsx, FieldGuides.tsx, ProfileSpawn.tsx | Contextual deterministic guide text, two voxel guides, clear independent identity. Existing campus art and guide avatar retained. Optional weather/replay rooms not added. |
| 10 | WorldRenderBudget.tsx, MinecraftAtmosphere.tsx, WorldCanvas.tsx, EngineeringWorld.tsx, TouchControls.tsx, diagnostics, layout.tsx, app/engineering/page.tsx, qa-*.mjs | Light budgets, measured performance, focus/dialog handling, zoom, touch, runtime fallback, public method manual, production checks and honest QA reports. |

All required documentation files now exist. The local implementation and flagship journeys are complete; no deployment was requested or performed. Remaining release verification is listed in DEPLOYMENT_CHECKLIST.md: real devices, sustained performance, assistive technology, owner review of legacy narratives and missing external evidence. See QA_REPORT.md and raw JSON artifacts for final check outcomes.


# Gameplay architecture

Next.js serves both static project routes and the client-only R3F world. `WorldScene` composes existing facilities, terrain and the original voxel car. `FirstPersonPlayer` owns the walking camera, `DriveableF1Car` owns it while driving, and the existing drone controller owns cinematic mode. Starting a drive explicitly ends the drone tour.

`lib/frontier/input.ts` is the shared blocking predicate. Map, projects, profile, achievements, stations and non-exploration modes block simulation input. HUD owns E/M, the walking controller owns V on foot, and the car owns V/C while driving. Keyboard state clears on blur; blocked frames clear held movement. Pointer lock is acquired only by an exploration click and released on blocking UI. Closing UI does not automatically reacquire it.

`lib/frontier/missions.ts` is a pure event reducer; `state/missionStore.ts` is the session controller. Simulation modules never import React. UI and rendering consume results rather than supplying completion by timer.

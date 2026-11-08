# ASISH Race Engineer avatar upgrade

## Audit and architecture

The old player was already connected to live controller refs, but its geometry was duplicated in the decorative preview. A noisy face material covered every head face, eyewear hid the eyes, and the backpack/hoodie silhouette differed from the supplied reference. Some blends used fixed per-frame factors, and locomotion followed input even when a wall prevented travel.

`components/avatar/RaceEngineerAvatar.tsx` is now the canonical articulated model. The old AnimatedVoxelAvatar and VoxelEngineerAvatar files are compatibility adapters for the actual player and independent NPC/preview instances. The model uses genuine cube geometry: front-only pixel eyes, layered brown hair, headset/headband/microphone, silver jacket with red seams and original slash insignia, cargo pockets, shoes, wrist device and utility radio. No team logo or driver likeness is used. New skin/hair/fabric profiles use the shared sRGB texture generator and Chrome Era tokens. Reference images informed geometry; they are not used as billboards or redistributed assets.

## Animation and gameplay

`lib/frontier/avatarMotion.ts` contains mutable pose stepping with exponential delta-time blending. Actual resolved horizontal travel drives walking/running cadence; pushing a wall settles to idle. Jump and fall use distinct poses, landing briefly compresses the body, and station interaction raises the arms. Idle breathing and body bob respect reduced motion. Root transforms follow the controller's live refs; hotbar gadgets remain equipped. No per-frame React state update is needed.

The existing walking cylinder, terrain, spring-arm collision, pointer lock, V key and touch controls remain. Turning uses the shortest angular path and delta-time smoothing. Idle third-person mouse orbit leaves body heading stable; the full body is hidden in first-person, driving and drone modes. Camera collision still uses terrain/perimeter footprints, not a mesh-accurate prop sweep. This upgrade does not solve the previously documented quality-transition performance stalls.

## Inspection and consistency

`/avatar` provides a full-body lit 3D inspection with drag orbit, zoom and keyboard-operable Front/Side/Back buttons. Buttons restore the camera framing after free orbit. The spawn card and dossier link to it. The canonical profile portrait is captured directly from this model into `public/world/avatar/asish-race-engineer.png`; spawn/profile cards share that image through data/profile.ts. HQ and garage preview instances use the same model.

## Verification

See avatar-browser-results.json and screenshots/avatar-*.png for executed browser results. TypeScript, lint, unit tests and production build use the repository scripts. The first visual capture exposed a camera-reset target error that cropped the head; it was corrected before the final portrait. Final test counts, browser outcomes and performance samples are recorded below after QA.

## Limits

This is a stylised voxel approximation of the supplied concept, not its offline ray-traced lighting. Hands and knees use simple articulated block poses rather than IK or motion capture. Walking cadence follows resolved speed but does not guarantee planted feet on every terrain slope. Interaction is a generic station-reading pose, not hand alignment to every terminal. Real-device thermal tests, assistive-technology acceptance and hosted Vercel/rollback checks remain open. No deployment or destructive Git operation is performed.

## Final evidence

TypeScript, lint, all 45 tests and the 33-route production build pass. World first-load JS is 431 kB. The final avatar browser script passes 11 grouped checks; control regression passes 11; cockpit/lap/replay passes 9; the six-room Explorer and keyboard-camera suite passes 11; production smoke passes ten route/asset responses plus headers/metadata/contact assertions. No recorded runtime exceptions in these passing suites. See avatar-browser-results.json, frontier-controls-results.json, cockpit-browser-results.json, release-final-results.json and production-smoke-results.json.

[Front](screenshots/avatar-front.png) · [Side](screenshots/avatar-side.png) · [Back](screenshots/avatar-back.png) · [Walking](screenshots/avatar-walk.png) · [Running](screenshots/avatar-run.png) · [Jump](screenshots/avatar-jump.png) · [Fall](screenshots/avatar-fall.png) · [HQ](screenshots/avatar-hq.png) · [Mobile](screenshots/avatar-mobile.png).

### Desktop first-person world sample

Intel i5-12450H / Intel UHD / Windows / Chrome 158, 1280×800, garage approach, day. A fresh page samples LOW→MED→HIGH, each with 2.2 seconds settling and 300 consecutive rAF intervals. No intervals are dropped. First-person includes the new crew but hides the player body. Raw: avatar-performance-results.json, 2026-11-08T07:45:56.589Z.

| Preset | Mean ms | p95 ms | Maximum ms |
| --- | --- | --- | --- |
| LOW | 8.60 | 14.00 | 20.90 |
| MED | 13.97 | 21.00 | 48.60 |
| HIGH | 15.52 | 27.80 | 48.30 |

This view records 621 calls and 93,380 triangles, 237/430 allocated geometries (low/medium-high), 41/42 textures and estimated 14.85 MiB texture storage. The shared box reduces distinct geometry allocation; individual articulated details add draw calls. These are renderer snapshots, not whole-application peaks. Earlier Chrome Era measurements differ in workload/background activity and do not establish a controlled speed improvement. Real mobile GPUs, sustained heat/memory and other browsers remain unverified. Earlier quality-transition stalls remain an open investigation.

## Changed files

New: components/avatar/RaceEngineerAvatar.tsx and AvatarPreview.tsx; app/avatar/page.tsx and AvatarClient.tsx; lib/frontier/avatarMotion.ts; tests/avatar.test.ts; scripts/qa-avatar.mjs; public/world/avatar/asish-race-engineer.png.

Updated: AnimatedVoxelAvatar.tsx and VoxelEngineerAvatar.tsx adapters; FirstPersonPlayer.tsx heading/live-state integration; ProfileSpawn.tsx and ProfileModal.tsx preview links; data/chromeEra.ts fabric/hair/skin profiles; data/profile.ts portrait source; qa-chrome-performance.mjs optional third-person sampling; README and release reports.

### Actual third-person player sample

Same desktop/method, with V selecting third-person before sampling. This includes the moving-capable player model, equipped gadget and new crew. Raw: avatar-third-person-performance-results.json, 2026-11-08T07:47:00.273Z.

| Preset | Mean ms | p95 ms | Maximum ms |
| --- | --- | --- | --- |
| LOW | 9.18 | 14.00 | 41.60 |
| MED | 14.98 | 21.00 | 34.80 |
| HIGH | 16.02 | 27.80 | 34.90 |

No interval exceeded 50 ms in this short run. This does not establish that earlier transition stalls are fixed, and no real-device frame-rate guarantee is made.

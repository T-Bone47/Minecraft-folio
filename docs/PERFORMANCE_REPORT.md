# Measured performance — latest avatar candidate

Current build: Next.js 15.5.29, 33 production routes, /world first-load JS 431 kB. [Avatar architecture and detailed QA](AVATAR_UPGRADE.md). Windows / Intel i5-12450H / Intel UHD / Chrome 158, 1280×800, day, garage approach. Each fresh-browser run samples LOW→MED→HIGH with 2.2 seconds settling and 300 consecutive rAF intervals per preset; no deliberate throttling or interval removal. Background activity/thermals are uncontrolled.

| Camera | Preset | Mean ms | p95 ms |
| --- | --- | --- | --- |
| First person | LOW | 8.60 | 14.00 |
| First person | MED | 13.97 | 21.00 |
| First person | HIGH | 15.52 | 27.80 |
| Third person | LOW | 9.18 | 14.00 |
| Third person | MED | 14.98 | 21.00 |
| Third person | HIGH | 16.02 | 27.80 |

Raw: avatar-performance-results.json (first person) and avatar-third-person-performance-results.json (actual player visible). No sampled interval exceeded 50 ms in these two short runs. They do not establish a sustained frame-rate budget or that earlier transition stalls are fixed. Shared geometry reduces distinct allocations while detailed articulated parts increase draw calls. Real mobile GPUs, other browsers, long-session memory/thermal acceptance and controlled before/after comparison remain unverified. Texture estimates exclude render targets/driver overhead; JS heap snapshots are not peaks. See the avatar report for costs and snapshots.

## Earlier Chrome Era campus sample — 8 November 2026

Historical source/build before the avatar upgrade: Next.js 15.5.29; 32 production routes; /world first-load JS 429 kB. Raw evidence: [chrome-campus-performance-results.json](chrome-campus-performance-results.json), collected 2026-11-08T07:14:31.473Z by scripts/qa-chrome-performance.mjs.

## Method and hardware

Windows, 12th Gen Intel(R) Core(TM) i5-12450H, 12 logical CPUs, 15.68 GiB RAM; headless Chrome/158.0.8127.18; ANGLE Intel UHD Graphics / Direct3D11; 1280×800. Day lighting at the garage approach [-12, 2.1, 4]. No deliberate throttling; background desktop activity and thermals were uncontrolled.

A fresh browser enters the world, then visits LOW → MED → HIGH in that order. Each preset settles for 2.2 seconds before collecting 300 consecutive requestAnimationFrame-to-requestAnimationFrame intervals. The first callback establishes the timestamp; it is not mixed with performance.now(). All subsequent intervals, including stalls, are retained. p95 uses the nearest-rank value. This is a short stationary sample, not a full drive or sustained-device benchmark.

| Preset | Intervals | Mean ms | 1000 / mean (FPS) | p95 ms | Maximum ms | Intervals >50 ms |
| --- | --- | --- | --- | --- | --- | --- |
| LOW | 300 | 12.81 | 78.1 | 20.90 | 41.60 | 0 |
| MED | 300 | 31.03 | 32.2 | 35.30 | 2511.30 | 4 |
| HIGH | 300 | 21.67 | 46.2 | 34.80 | 62.50 | 2 |

The medium run includes a 2.51-second stall. A prior transition sample also contained a 2.35-second interval. These outliers remain in the reported averages; the cause is not established. Preset order, cache/warmup and uncontrolled activity mean these numbers cannot rank presets or prove an improvement/regression. Successful measurement completion is not acceptance of a frame-rate budget.

## Renderer and memory snapshots

| Preset | Draw calls | Triangles | Allocated geometries | Textures | JS heap snapshot |
| --- | --- | --- | --- | --- | --- |
| LOW | 477 | 91,652 | 338 | 50 | 57.6 MiB |
| MED | 477 | 91,652 | 761 | 51 | 67.7 MiB |
| HIGH | 477 | 91,652 | 761 | 51 | 80.8 MiB |

Estimated texture storage in this run: 14.86 MiB (RGBA+mips). Navigation to visible exploration HUD: 1594 ms. It does not measure shader warmup or a cold production network load. Renderer snapshots are view-specific; the station run at the tower is a separate, less expensive view.

The texture estimate uses RGBA+mipmaps and excludes driver overhead, render targets, environment-map processing and compression. Heap is a snapshot, not peak process/GPU memory. Frame intervals measure browser scheduling, not GPU timer queries. HUD FPS uses a different time window from the sampled averages.

## Change cost and remaining work

Chrome uses shared 16×16 pixel/PBR materials, one size-128 procedural RoomEnvironment bake, instanced garage tiles/barriers and existing 0/3/6 low/medium/high point-light caps. It adds no downloaded HDR, custom pixel shader or realtime mirror probe. Cockpit texture remains 512×256 at 10 Hz, using authoritative simulation state.

[chrome-before-performance.json](chrome-before-performance.json) retains the earlier low-quality 1024×768 tower sample (14.11 ms mean, 27.70 ms p95, 132 calls, 58,526 triangles, estimated 12.20 MiB textures). Different views, dimensions, warmup and workloads make it unsuitable as a controlled before/after comparison. [chrome-performance-transition-sample.json](chrome-performance-transition-sample.json) retains an intermediate transition run with its method correction documented.

Open P2: investigate the observed preset-transition stalls and frame variance, then profile sustained exploration/driving on target devices. Real mobile/tablet GPUs, other browsers, long-session memory/thermal behavior and device acceptance remain unverified. Touch/mobile viewport checks ran on this desktop GPU. No universal FPS claim or performance release approval is made.


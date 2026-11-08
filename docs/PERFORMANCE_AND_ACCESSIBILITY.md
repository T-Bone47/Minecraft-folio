# Performance and accessibility

Current hardware frame samples are in release-performance-results.json; local professional-route FCP/LCP/CLS observations are in non-gameplay-performance-results.json. They are separate workloads. The latter are short controlled-page observations, not field Core Web Vitals, a Lighthouse score or an INP acceptance claim. Browser/GPU/viewport/method and outliers are retained. Full measured values are appended after the release run.

Build payload: /world approximately 431 kB first-load JS; /avatar approximately 114 kB. Shared pixel/PBR materials, one procedural environment bake, instanced terrain/track furniture and bounded point-light budgets remain. Detailed avatar parts add calls while reusing one box geometry. No downloaded HDR or realtime reflection probe is added.

Keyboard focus/Tab/Escape, range controls, trusted pointer-lock release, reduced motion, actual touch input, 390px layouts and both WebGL-unavailable/context-loss fallbacks are tested in executed Chrome paths. 2D content does not require a 3D world. This is not a full manual screen-reader or WCAG conformance audit. Real devices, broader browser support, thermal/long-session memory and complete contrast acceptance remain NOT TESTED.

[Detailed performance history](PERFORMANCE_REPORT.md) · [Accessibility scope](ACCESSIBILITY_REPORT.md). Earlier multi-second preset stalls are not declared fixed merely because a later short sample lacks one.

## Final Node 24 release observations

Chrome/158.0.8127.18, 12th Gen Intel(R) Core(TM) i5-12450H, Intel UHD/ANGLE D3D11, 1280×800, garage approach with actual third-person player, 300 consecutive intervals per preset. Sample: 2026-11-08T12:40:05.159Z.

| Preset | Mean ms | p95 ms | Max ms |
| --- | --- | --- | --- |
| LOW | 6.96 | 7.10 | 14.60 |
| MED | 7.38 | 13.80 | 14.00 |
| HIGH | 8.05 | 13.90 | 20.90 |

No >50 ms interval occurred in this short sample. Historical transition stalls remain an investigation; results do not establish a controlled improvement or universal FPS. See raw renderer/heap/texture snapshots in release-performance-results.json. JavaScript heap is a snapshot, not peak process/GPU memory; frame intervals are browser scheduling, not GPU timer queries. React commit duration was not separately profiled. Navigation-to-HUD was 414 ms, not complete shader warmup.

Professional routes use cache-disabled local loads; an initial shared-cache attempt returned a valid 304 and was replaced with the intended uncached measurement. Mobile contact overflow found by this check was fixed by wrapping its header/badge. All eight final desktop/390px route samples fit horizontally.

| Route | Width | FCP ms | LCP ms | CLS observed |
| --- | --- | --- | --- | --- |
| / | 1280 | 424 | 424 | 0.2451 |
| /recruiter | 1280 | 144 | 144 | 0.2580 |
| /projects | 1280 | 200 | 200 | 0.1438 |
| /contact | 1280 | 124 | 124 | 0.0769 |
| / | 390 | 204 | 204 | 0.1567 |
| /recruiter | 390 | 136 | 136 | 0.0562 |
| /projects | 390 | 164 | 164 | 0.1500 |
| /contact | 390 | 128 | 128 | 0.0768 |

No field percentile, Lighthouse score or INP score is inferred from these local samples.

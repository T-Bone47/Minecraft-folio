> Historical checkpoint. Current five-audience release classification and evidence are maintained in [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) and [VISITOR_JOURNEY_QA.md](VISITOR_JOURNEY_QA.md).

# Visitor experience verification — 7 November 2026

Implemented: four optional journeys over one shared world, short/long route definitions, independent session-only tour store, physical waypoint, safe quick travel, arrival confirmation, pause/resume/cancel, deterministic voxel guides, source-aware architecture and evidence displays, canonical three-depth project exhibits, and the direct `/visit` field guide. Global navigation and WebGL fallback expose the same content. Existing missions remain separate and available.

Validation performed on this extension:
- 40 unit tests pass, including all journey route references, short/long route validity, tour progression/pause/cancel and mission independence.
- TypeScript passed. Production build includes successful lint/type checks and generates 32 routes. World first-load JS: 439 kB; `/visit`: 143 kB.
- `qa-visitors.mjs`: 12 grouped checks pass. All four short tours completed through actual world quick travel and arrival checks; all four direct reading journeys completed; project depth switching across every project; architecture trace and source links; IGNICT limitation; evidence/guide views; 390px mobile with reduced motion; zero runtime exceptions.
- `qa-visitor-access.mjs`: 3 checks pass. Systems guide opens the real pipeline station; keyboard focus remains in dialog and Escape closes; recruiter/contact/projects/resume responses succeed.
- Existing `qa-controls.mjs`: all 10 checks pass again, including perspective, trusted pointer lock, map pause, jump, driving/reset/exit, quality switching, reload, touch movement and runtime WebGL loss fallback.
- Screenshots inspected: `visitor-mobile.png`, `visitor-world.png`; `visitor-guides.png` also captured.

Performance: 90 requestAnimationFrame intervals after the final Explorer tour, low quality, day lighting, headless local Chrome, 1280×900 desktop viewport, reduced-motion preference enabled. Mean 7.15 ms (~139.9 FPS), p95 7.20 ms. This is a short single-view sample, not a sustained whole-world guarantee. No additional dynamic lights or animation loops were introduced. The prior hardware/performance report remains a separate run; no new hardware attribution is inferred from it.

Raw evidence: `visitor-browser-results.json`, `visitor-access-results.json`, `frontier-controls-results.json`. Browser tests use actual input handlers and UI; they are not human usability studies. Long-route definitions are unit-tested; end-to-end browser completion covers short routes. Source backend tests and benchmarks were not rerun. Existing Drive lap and all ML/pipeline cases retain their unit coverage; their full earlier browser suites were not rerun in this extension.

Remaining: IGNICT source is empty, so its architecture cannot be delivered without source material. Live F1 museum covers selected verified code boundaries, not every endpoint. External project narrative depth is owner-reported; gallery measurements remain repository-reported, not independent benchmarks. Real mobile devices, screen readers, extended tours/performance and provenance for professional/award claims require further work. No deployment performed.

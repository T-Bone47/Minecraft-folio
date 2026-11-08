> Historical checkpoint. Current five-audience release classification and evidence are maintained in [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) and [VISITOR_JOURNEY_QA.md](VISITOR_JOURNEY_QA.md).

# Production readiness audit — 8 November 2026

**Release recommendation: NO-GO for production promotion.** The local production candidate is playable and passes the executed automated checks. Mandatory hosted-preview/rollback and target-device/accessibility acceptance evidence is incomplete. No production deployment was performed.

## Requested acceptance checklist

“Verified” applies to the stated local test scope. “Partial” and “Unverified” items must not be represented as completed release gates.

| Requested check | Status | Evidence / limit |
| --- | --- | --- |
| First- and third-person walking | Verified | Browser movement, perspective, jump and pointer-lock checks; animated avatar screenshot. |
| Intended campus navigable | Verified for ground-floor campus | Browser walked through all six facility entrances; long Explorer route completed. Upper tower floors remain decorative. |
| Car entry, exit, driving, reset | Verified | Cockpit and controls browser suites, safe-exit coordinates and reset speed assertions. |
| Cockpit camera, wheel, display | Verified | Original 3D cockpit, visual screenshot inspection, actual steering input, authoritative simulated instruments. |
| Camera switching preserves physics | Verified | Stationary position/speed invariant and moving camera checks; same simulation ref, no reset dependency. |
| Timing, checkpoints, telemetry | Verified | Full four-gate lap, four measured sectors, speed/control traces, JSON export implementation and recorded replay. |
| The Drive end to end | Verified | Physical garage inspection through full lap, automatic exit and debrief review completion. |
| The Experiment valid results | Verified for local synthetic tasks | Held-out classification/regression/forecast metrics and explicit baselines; trained stump case; unit split checks. |
| The System recovery | Verified for local simulation | All seven fault/repair cases and intentionally wrong repair checked in browser and units. |
| Facilities connect to real evidence | Partial | Canonical repository/case-study links; evidence grades retained. IGNICT is empty and SAKSHAM evidence is pending; external project claims not independently reproduced. |
| Visitor journeys/direct projects | Verified | Four short journeys, long Explorer route, three exhibit depths, architecture selection, guide links and direct routes. |
| Resume, GitHub, LinkedIn, email | Partial | PDF loads; GitHub reached; configured contact hrefs verified. LinkedIn automated fetch returned 999; mailto syntax/target checked without sending a message. |
| Accurate/shareable project pages | Partial | Canonical project URLs, metadata and OG asset pass; provenance notices present. Extended owner-supplied narratives and credentials need owner review. |
| Recruiter quick tour and 2D fallback | Verified locally | Recruiter route, short guided route, 390px layout, disabled WebGL and actual context-loss fallback. |
| Keyboard/mobile/touch usability | Partial | Trusted pointer lock, focus/Escape, Tab while driving, touch walking/driving and 390px layout checked. Human usability and real-device ergonomics are pending. |
| Types/lint/tests/build | Verified | TypeScript and lint pass; 42 tests; production build generates 32 routes. |
| Real browser QA | Verified within Chrome scope | Chromium/Chrome 158.0.8127.18, actual rendered app and input handlers; broader browser matrix not tested. |
| Target-device performance | Partial | Actual Intel UHD integrated graphics sample recorded; mobile is desktop emulation. See PERFORMANCE_REPORT.md. |
| Accessibility/reduced motion | Partial | Keyboard dialog focus/Escape, zoom, semantic project routes, reduced-motion CSS and static intro checks. Full screen-reader/manual accessibility acceptance is pending. |
| Runtime/security/assets | Verified within tested scope | No runtime exceptions in passing journeys or failed local asset responses in smoke checks. Final npm audit: zero known vulnerabilities. Limited source scan and headers checked; not a penetration test. |
| Production preview and rollback | Unverified | Local production preview passes. No selected host, hosted preview or prior release available for rollback rehearsal. Runbook is prepared. |

## Executed checks and evidence

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`: pass. Lint deprecation notice is Next 15 tooling guidance, not a lint failure. No lint warnings remain after the reduced-motion effect dependency correction.
- `scripts/qa-cockpit.mjs`: 9 grouped browser checks, no runtime errors. Includes a real input-driven completed lap and replay. See `cockpit-browser-results.json` and `COCKPIT_QA.md`.
- `scripts/qa-controls-release.mjs`: 11 checks pass, including held touch acceleration, camera switching and actual WebGL loss. See `frontier-controls-results.json`.
- `scripts/qa-stations.mjs`: 27 checks pass, including all three task types, all seven incidents, source-access routes, resume, mobile recruiter and WebGL absence. See `frontier-stations-results.json`.
- `scripts/qa-visitors.mjs`: 12 grouped checks pass; `qa-visitor-access.mjs`: 3 checks pass. See visitor JSON artifacts.
- `scripts/qa-production.mjs`: ten route/asset responses plus security header, canonical, contact-target and 404 assertions pass. See `production-smoke-results.json`.
- `scripts/qa-release-final.mjs`: 11 checks pass, zero runtime exceptions. Covers reduced-motion intro, six interiors, long Explorer route, driving keyboard access and camera configuration/moving invariants. Raw evidence: `release-final-results.json` (`passed: true`).

The full cockpit/mission/visitor regression suites ran after dependency remediation. The last source changes were narrowed keyboard prevention and introductory content/reduced-motion fixes; final build and supplemental smoke verification cover those changes. No unchanged major subsystem was rewritten.

## Remediation delivered

Real driver-eye transform, original wheel/seat/column/frame/hands, 10 Hz wheel texture; actual steering and simulated instruments; C/B camera configuration plus V alias; FOV/seat controls; safe touch camera/brake controls; recorded top-down replay and all control traces. Removed unsupported driving gear/RPM and intro RPM values. Corrected inherited home canonical URLs and unsupported recruiter “accredited” label. Updated Next.js within version 15 and patched dependency tree from 11 audit entries (including critical) to zero known findings.

## Release handoff

P0 dependency findings are fixed. P1 gates remain: hosted preview and rollback rehearsal, target real-device/browser and assistive-technology acceptance, owner approval of remaining evidence gaps. See RELEASE_BLOCKERS.md, SECURITY_REVIEW.md and DEPLOYMENT_RUNBOOK.md. Deployment approval should be requested only for a concrete reviewed candidate after these gates are resolved or the owner explicitly accepts a narrowed release scope. No deployment approval is assumed.


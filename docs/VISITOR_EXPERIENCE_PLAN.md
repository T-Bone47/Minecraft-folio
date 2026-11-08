> Historical checkpoint. Current five-audience release classification and evidence are maintained in [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) and [VISITOR_JOURNEY_QA.md](VISITOR_JOURNEY_QA.md).

# Visitor experience audit and implementation plan — 2026-11-07

Code inspection confirms independent player/camera stores, safe facility approaches, ordered mission reducer, fixed-step Drive with lap telemetry, fitted ML models and pipeline repair invariants. Existing recorded browser results cover these systems; those recordings are prior-run evidence, not verification of this extension. Current gaps: no audience journey store, no guided waypoint progression, no reusable three-depth exhibit, no source-aware architecture museum. Recruiter already imports canonical identity, experience and education; WebGL fallback exists.

Dependency order and acceptance:
1. Add typed journey definitions and separate state. Four audiences share facilities; switching never mutates missions. Short/long routes support pause/resume/cancel and explicit arrival checks.
2. Derive reusable exhibit depth from canonical evidence/project data. All projects offer explanation, meaningful interaction and deeper source/limitation links.
3. Add physical route/guide/museum displays and accessible station equivalents. Source-backed Live F1 architecture; IGNICT must retain the empty-source limitation.
4. Expose all experiences through a direct 2D route and world entry. No gameplay gate on resume/contact.
5. Run types, lint, tests, build and browser journeys; document measured performance and remaining limits.

No deployment or destructive Git operations authorized. Existing uncommitted changes are preserved.

## Delivered extension

The dependency sequence above is implemented. Files: `lib/visitor/journeys.ts`, `state/visitorStore.ts`, `data/projectExhibits.ts`, `components/visitor/*`, `app/visit/page.tsx`; integration in world scene/HUD/station modal, global navigation and fallback. Tests and reproducible browser scripts are in `tests/visitor.test.ts`, `scripts/qa-visitors.mjs` and `scripts/qa-visitor-access.mjs`. See VISITOR_EXPERIENCE_QA.md for passed checks and explicit remaining limits. IGNICT architecture remains evidence-blocked, rather than being represented as complete.

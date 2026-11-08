# Five-audience journey QA — 8 November 2026

PASS: Recruiter, Developer, AI/ML Engineer, Motorsport Engineer and Explorer short routes each start, pause/resume, complete and cancel in the direct guide. All five physical short routes reach every canonical waypoint and finish. Switching changes visitor state without changing mission state (unit assertion).

`node scripts/qa-visitors.mjs` passed 14 grouped checks with no runtime exceptions. Includes all project depths, architecture tracing, source links/evidence gaps, guides, 390px layout and reduced-motion preference. Raw result: visitor-browser-results.json. The long Explorer route additionally walks through every one of the six ground-floor entrances and completes in qa-release-final.mjs; raw result: release-final-results.json.

The prior controls and access suites cover resume, direct professional routes, touch walking/driving, dialog focus/Escape and runtime WebGL fallback. The direct recruiter route never requires gameplay. Estimated recruiter duration is a content-design target; no timed human recruiter study was performed. Long routes other than Explorer have valid facility references in unit tests but were not individually completed in browser.

Five audiences use the same facilities, project evidence adapter, station components and world. Existing original ID `enthusiast` is retained for the Motorsport Engineer route; `aiml` adds the AI/ML Engineer route. Session-only route state can be canceled or replaced at any time. No account or analytics service was added.

See VISITOR_EXPERIENCE_ARCHITECTURE.md for the maintained shared-framework design. Earlier four-audience reports are historical checkpoints, not the current route count.

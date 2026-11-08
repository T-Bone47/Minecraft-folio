> Historical 7 November baseline. Current release decision and cockpit verification are in PRODUCTION_READINESS_AUDIT.md and COCKPIT_QA.md. Raw JSON files may have been refreshed by subsequent runs.

# Engineering Frontier QA — 7 November 2026

This report supersedes historical QA scripts that sometimes recorded `true` without asserting an outcome. The current tests assert simulation values, rendered result contents, state transitions or navigation responses.

## Checks

- Baseline: TypeScript, lint, 25 tests and production build passed before implementation.
- Implementation: TypeScript and lint passed; all 37 unit tests passed, including mission entry and large-step collision regressions.
- Production: 31 static routes generated, including the new `/engineering` manual; world first-load JS approximately 426 kB.
- Drive browser journey: physical garage approach, chassis inspection, keyboard-event driving through four ordered gates, safe exit, recorded speed trace, braking marks, four measured sector comparisons, reference and mission completion. No runtime exceptions.
- Experiment browser journey: physical AI lab entry, classification/regression/forecast fitting, held-out metrics and baseline comparison, mission completion, close/reopen retaining results.
- System browser journey: physical Telemetry Tower entry, seven faults, evidence inspection, successful repairs and validation; an intentionally wrong repair remains unrecovered.
- Access: home, recruiter, project index, RaceMind and Live F1 project routes, contact and engineering manual respond successfully. Resume PDF served. Mobile recruiter page fits 390px without horizontal overflow. Disabled WebGL exposes the 2D fallback.
- Final production browser suites: 7 Drive checks, 27 station/access checks and 10 controls checks passed with no runtime exceptions. Mobile hotbar slot bounds and disabled irrelevant decision-tree settings are asserted.
- Rendering: actual measurements and limits are in PERFORMANCE_REPORT.md.

Raw result files: `frontier-browser-results.json`, `frontier-stations-results.json`, `frontier-controls-results.json`. Screenshot artifacts use the `frontier-` prefix under `docs/screenshots`.

## Findings fixed during QA

Duplicate E/M/V handlers; blocked-panel locomotion; stale on-foot car exit position; missing lap capture and gate validation; old circuit crossing facility space; unsafe car boundary; stale avatar updates; fake ML result strings; nonfunctional pipeline fault recovery; unsupported metric badges and GitHub profile placeholders; redundant touch controls; disabled browser zoom; uncapped decorative point lighting; first canvas click opening a facility before acquiring pointer lock; alternate vehicle entry missing mission initialisation.

## Scope and remaining limitations

Browser driving is an automated keyboard-event feedback controller exercising the real input handlers, integrator, gates and UI; it is not a human usability study. The separate controls suite passed trusted-click pointer lock, mouse-look event delivery, map pause/unlock, jump, vehicle camera/reset/exit, quality switching, reload, emulated touch movement and actual WebGL context loss. Facility reachability has both collision-model tests and visual/browser approaches for the flagship interiors, but upper tower floors are decorative rather than a stair traversal experience. Camera spring-arm collision uses 2D wall footprints rather than mesh-accurate swept volumes. No professional vehicle dynamics, production ML accuracy or distributed-network guarantees are claimed.

No external project test suite or benchmark was rerun. Public sources and provenance limits are in PROJECT_EVIDENCE.md; SAKSHAM evidence is pending and IGNICT's public repository was empty. Extended legacy project narratives remain author-reported. Real touch-device ergonomics, long-session performance and complete screen-reader testing remain follow-up work. No deployment was performed.



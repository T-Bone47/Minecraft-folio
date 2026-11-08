# Release implementation plan — 8 November 2026

1. Preserve the verified gameplay/cockpit/ML/pipeline foundation. Acceptance: existing 42 tests and current browser evidence remain valid; rerun changed input/journey paths.
2. Complete audience definitions: Recruiter, Developer, AI/ML Engineer, Motorsport Engineer, Explorer through the same journey state. Acceptance: each short route starts, pauses/resumes, completes and switches without changing missions, in direct and world modes.
3. Add a bounded procedural-audio volume control alongside existing mute. Acceptance: keyboard/touch slider adjusts output level without unmuting unexpectedly.
4. Complete launch presentation: product-branded social image, accurate README screenshot/architecture/setup/licensing sections, environment example and release/LinkedIn/GitHub launch kit. Acceptance: no fake live URL, no posting, no repository setting changes.
5. Enforce feature freeze. Run types/lint/tests/build plus changed browser paths, final desktop/mobile/fallback smoke. Update the acceptance matrix with PASS/FAIL/NOT TESTED/NOT APPLICABLE.
6. Vercel release preparation: CLI identity and project inventory inspected read-only. No matching linked project exists; do not use ASISH OS or unrelated projects. Vercel's documented first-deployment behavior requires production approval before creating a new project's initial deployment. Prepare exact candidate/config/runbook first; do not upload until approval.

Core facilities/missions/vehicle changes already passed their dependency phases. Required document names should link to maintained source documents instead of copying stale technical prose. New ideas go to POST_LAUNCH_BACKLOG.md. Freeze after the small required changes above; focus on bugs and release evidence thereafter.

## Final execution outcome

Steps 1–5 are complete in the local scope: 42 tests, typecheck/lint/build pass; five audiences (14 browser checks), supplemental controls/campus (11), actual audio gain (2) and production smoke pass. Source modifications: lib/visitor/journeys.ts, lib/audio.ts, shared AudioControls, WorldHUD/F1DrivingHUD integration, existing social PNG, README and QA/docs. CLI inventory confirms no matching Vercel project; no external mutation or upload occurred. Step 6 stops at the explicit initial-publication approval gate.

# Accessibility report — 8 November 2026

Scope: actual keyboard and touch input through Chrome automation, rendered screenshot inspection, source review and WebGL failure tests. This is not a complete manual screen-reader audit.

| Check | Result | Evidence |
| --- | --- | --- |
| Keyboard world entry/movement/perspective | PASS | Controls and cockpit browser suites |
| Pointer-lock release and map pause | PASS | Trusted-click test and frozen-position assertion |
| Dialog focus, Tab and Escape | PASS | Station focus checks; driving Tab regression fixed and tested |
| Camera settings with keyboard | PASS | FOV End, seat Home and configured B key assertions |
| Visible focus styling | PASS in inspected controls | 3px visible focus rule and browser focus behavior |
| Mute and bounded volume | PASS | Actual Web Audio gain and keyboard range verified; mute remains effective during volume changes |
| 390px layout and touch walking/driving | PASS in emulation | Actual held touch input, camera switching, hotbar bounds and screenshots |
| Reduced motion | PASS in tested paths | Intro lights remain static; global motion rule; chase camera damping bypass; no cockpit vibration added |
| Non-WebGL and context-loss fallback | PASS | Forced unsupported WebGL and actual WEBGL_lose_context tests |
| Direct professional content without gameplay | PASS | Recruiter/projects/contact/resume routes and semantic field guide |
| Browser zoom | PASS by configuration review | User scaling allowed up to 5; no zoom lock |
| Screen-reader narration/usability | NOT TESTED | No verified assistive-technology session; DOM/focus tests do not establish screen-reader acceptance |
| Real phone/tablet ergonomics | NOT TESTED | Mobile emulation uses desktop hardware |
| Comprehensive contrast and WCAG conformance | NOT TESTED | Manual visual checks cover selected screens only; no conformance claim |

Images have descriptive alt text or an accessible figure label in professional and telemetry views. Professional links remain available outside gameplay. A visitor who cannot use the 3D world can use /visit, /recruiter and /projects. No account or external AI service is required.

Audio test note: the first check used a fixed wall-clock delay before reading a scheduled AudioParam. It failed during context startup. The corrected test waits for the actual gain threshold (within 5 seconds) and passes; it does not infer audio gain solely from the visible slider. The driving Tab test was updated to accept the new native Audio summary as a valid focus target.

Final Chrome Era rerun: the audio harness initially read mobile panel bounds before the details toggle's React layout update completed. It now waits up to five seconds for the opened panel to fit and records its actual rectangle. All three audio checks then pass, including measured mute during volume changes. The interrupted orchestration was resumed from audio; earlier successful scripts were not counted as failures or repeated unnecessarily.

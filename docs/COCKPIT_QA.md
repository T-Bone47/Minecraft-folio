# Cockpit QA — 8 November 2026

Executed against local production Next.js 15.5.29 build. TypeScript, lint and 42 unit tests pass. Build generated 32 routes; `/world` first-load JS 428 kB.

`qa-cockpit.mjs`: 9 checks passed: walking changes position; perspective switching; map freezes movement; physical garage inspection starts Drive; C changes to cockpit without changing stationary x/z/speed; steering responds to input; full keyboard-event-driven lap crosses all gates and exits; four sector comparisons and mission review; replay play/pause and all control traces; no runtime errors. (Some related assertions are grouped under one check; raw JSON is authoritative.)

Screenshots visually inspected: `cockpit-2-stationary.png` (wheel turned with input), `cockpit-2-mobile.png` (390px cockpit display and track visible). In-world display reads the authoritative simulation ref and updates at 10 Hz; HTML snapshot may lag by one sample. Unit tests check recorded steering, yaw and controls against state and reference determinism.

Initial test-harness failure: changing Puppeteer's isMobile flag mid-lap reloaded the page, ending the simulation. That run was interrupted rather than counted as a pass. Corrected cockpit layout test resizes without changing the emulation mode. Fresh-page touch testing is separate.

Limits: no professional simulator accuracy, tyre/aero model, transmission/RPM model, or reflective mirrors. Replay is a recorded top-down visualization, not a 3D camera replay. Screenshot review is not a motion-sickness/human-usability study. Real-device and broader browser results are documented as unknown where not executed.

Final controls regression: 11 checks passed, including fresh-page mobile touch acceleration/cockpit switching and actual WebGL context loss. Station suite: 27 checks passed, including all three fitted datasets, all seven pipeline repairs, wrong-repair negative check, direct access and disabled-WebGL fallback. Raw results remain in `frontier-controls-results.json` and `frontier-stations-results.json`.

Supplemental final suite: all 11 checks passed (`release-final-results.json`, `passed: true`). All six entrances were traversed with walking input and the long Explorer route completed. Keyboard Tab, FOV/seat range adjustment, configured B camera key, and moving-camera state preservation passed. Simulated speed text matched the published state. Decorative intro lights remained static under reduced motion.

Additional harness corrections: exact text matching did not account for the vehicle button suffix or the exit button prefix. Those aborted supplemental attempts recorded failures and were corrected to use the visible button text consistently; the full supplemental suite then passed. These failures were test selectors, with no runtime exceptions recorded. A real keyboard defect found by source review (preventing every key during driving) was corrected before the final browser run.

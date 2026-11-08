# Gameplay QA

Production server built locally with Node 24.22.2; actual Chrome automation uses trusted pointer-lock input, held keyboard/touch input and screenshots. Browser setup is portable through QA_URL and QA_BROWSER_PATH.

| Scope | Evidence |
| --- | --- |
| Movement, perspective, map pause, pointer lock, jump, reload, touch, actual context loss | frontier-controls-results.json |
| Reference-inspired avatar, real walking/running/jump/fall/landing, orbit, HQ and mobile inspector | avatar-browser-results.json |
| Six rooms and long Explorer route, reduced motion, Tab, cockpit FOV/seat/key settings, moving camera invariants | release-final-results.json |
| Complete four-gate visitor-driven lap, steering/display, debrief sectors and replay | cockpit-browser-results.json |
| Storage denied + bounded unmuted driving audio + unsupported avatar WebGL | release-regression-results.json |
| Actual volume/mute and mobile panel bounds | audio-browser-results.json |

Screenshots are in docs/screenshots. Only successful executions and explicit assertions are counted. The new avatar fallback test waits for the actual portrait to finish loading; it does not infer success solely from fallback text. Camera avoidance remains based on terrain/perimeter footprints; mesh-perfect prop/ceiling sweeps and IK are outside the current implementation. Physical upper floors are decorative. [Detailed avatar implementation](AVATAR_UPGRADE.md) and [camera/vehicle methods](COCKPIT_AND_VEHICLE_SIMULATION.md).

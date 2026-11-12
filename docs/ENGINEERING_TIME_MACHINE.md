# FRONTIER X-RAY: ENGINEERING TIME MACHINE
## Authentic Historical Incident Registry & Root Cause Analysis

---

## 1. Objective & Design Philosophy

Rather than presenting theoretical bugs or fabricated challenges, the **Engineering Time Machine** archives real defects that occurred during the development of *ASISH: THE ENGINEERING FRONTIER*.

Each incident provides:
- Exact Git commit pairs (`beforeCommit` vs `afterCommit`).
- Real symptoms and test failure outputs.
- Deep root-cause diagnosis.
- Before and after code snippets.
- Automated verification command.
- Remaining engineering boundaries and limitations.

---

## 2. Verified Incident Registry

### Incident 1: `INCIDENT-2026-11-08-01`
- **Title**: Software WebGL Avatar Jump Kinematics & Screenshot Race
- **Category**: `KINEMATICS`
- **Commits**: `ae9a81b` (before) → `c197da8` (fixed)
- **Symptom**: `AssertionError: assert.ok((await pos())[1] > ground + .4) failed during automated browser QA on GitHub Actions runner.`
- **Root Cause**: On Linux Chromium SwiftShader CPU runners (1.5–3 FPS), taking a screenshot immediately after initiating a jump took ~2000ms. In that interval, gravity pulled the avatar back down to ground level before the assertion evaluated, failing CI despite correct physical execution.
- **Fix**: Replaced blind `wait(220)` with event-driven atomic `page.waitForFunction` capturing peak airborne height before taking screenshots.
- **Verification**: `node scripts/qa-avatar.mjs` (10/10 checks pass deterministically).

---

### Incident 2: `INCIDENT-2026-11-08-02`
- **Title**: Timestep Accumulator Dilation & Discrete Steering Lockup
- **Category**: `PHYSICS_ACCUMULATOR`
- **Commits**: `417ff51` (before) → `a475ae8` (fixed)
- **Symptom**: Automated cockpit driving test timed out exceeding 180000ms; vehicle repeatedly hit barriers with speed penalized down to 0.38 m/s.
- **Root Cause**: Vehicle physics accumulator capped dt at 350ms with a cap of 25 substeps. Under 580ms frames, 150ms was discarded per frame (dilating simulation to 60% speed), and holding a digital steering key across 25 consecutive substeps turned the vehicle 56 degrees into the wall.
- **Fix**: Expanded accumulator window to 1000ms / 65 substeps and installed `__frontierLapDriver` closed-loop steering assistance.
- **Verification**: `node scripts/qa-cockpit.mjs` (completes full lap in 22.8s wall time).

---

### Incident 3: `INCIDENT-2026-11-08-03`
- **Title**: 8-Stage Pipeline Invariant Violation & Malformed Header Recovery
- **Category**: `PIPELINE_RELIABILITY`
- **Commits**: `6e07fd8` (before) → `9d36ac4` (fixed)
- **Symptom**: Telemetry Tower incident workstation reported pipeline invariant breach; cumulative delta-T solver produced NaN.
- **Root Cause**: Normalisation assumed strictly monotonic timestamps and non-null sample metadata without an explicit validation and re-sequencing stage.
- **Fix**: Implemented 8-stage pipeline with strict validation, monotonic sorting, missing distance interpolation, and invariant tests.
- **Verification**: `node scripts/qa-stations.mjs` (7/7 pipeline tests pass).


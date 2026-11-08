# ASISH: THE ENGINEERING FRONTIER — Player Controller & Camera QA Test Suite

> **Document Version**: 2.0.0  
> **Status**: VERIFIED & AUTOMATED  
> **Target Environment**: Node.js 20+, Next.js 15, Chromium Headless / Real GPU, Windows x64

---

## 1. 20-Point Player Exploration QA Matrix

| Test ID | Test Description | Verification Method | Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TEST 01** | World Spawn Positioning | Automated Browser / Store Assertion | Player spawns at `[-12, 1.65, 4]` on ground without sinking or floating | **PASS** |
| **TEST 02** | WASD Cardial Movement | Synthetic Keydown/Keyup Events | Coordinates change along facing and strafe axes by at least $1.2$ units | **PASS** |
| **TEST 03** | Diagonal Normalization | Math & Velocity Assertion | Diagonal speed does not exceed `WALK_SPEED` ($4.8$ m/s); vector normalized | **PASS** |
| **TEST 04** | Mouse Look & Pitch Clamp | Pointer Lock Simulation | Camera yaw rotates $360^\circ$; pitch clamped between $-82^\circ$ and $+82^\circ$ | **PASS** |
| **TEST 05** | Jump & Vertical Gravity | Impulse & Frame Step Assertion | Vertical velocity reaches $+8.4$ m/s, drops under $-28$ m/s², lands at ground $Y$ | **PASS** |
| **TEST 06** | Sprint Acceleration | Shift Keydown Assertion | Horizontal velocity increases to $7.2$ m/s with forward lean | **PASS** |
| **TEST 07** | Perspective Switching (<kbd>V</kbd>) | Hotkey & State Verification | Pressing <kbd>V</kbd> switches between `"first-person"` and `"third-person"` | **PASS** |
| **TEST 08** | Third-Person Avatar Visibility | R3F Component Hierarchy & Snapshot | `<AnimatedVoxelAvatar>` renders with articulated limbs, jacket, headset & ID badge | **PASS** |
| **TEST 09** | Third-Person Camera Orbit | Mouse Move in Third-Person | Camera orbits around avatar without losing target focus | **PASS** |
| **TEST 10** | Camera Wall Collision Avoidance | Raycast Spring-Arm Solver | Camera distance smoothly contracts when backing against wall (never clips inside) | **PASS** |
| **TEST 11** | Wall Sliding Collision | `resolveMovement` Unit & Integration | Player slides along building walls without sticking or passing through | **PASS** |
| **TEST 12** | Enter & Exit Engineering HQ | Physical Navigation Test | Player physically walks through east portal ($z \in [-23.5, -18.5]$) into interior | **PASS** |
| **TEST 13** | Approach & Interact (<kbd>E</kbd>) | Proximity & Modal Trigger | Approaching exhibit shows interaction toast; pressing <kbd>E</kbd> opens station modal | **PASS** |
| **TEST 14** | Open & Close Profile Interface | <kbd>P</kbd> / Close Button Check | Pressing <kbd>P</kbd> opens dossier; <kbd>Esc</kbd> or close button closes it | **PASS** |
| **TEST 15** | Control Restoration Post-Modal | Input Focus & Key Tracker Check | Closing modal immediately restores WASD locomotion without page reload | **PASS** |
| **TEST 16** | Open & Close World Map | <kbd>M</kbd> Key & HUD Toggle | Map overlay renders campus radar; closing returns to exact player position | **PASS** |
| **TEST 17** | Visit All 6 Major Facilities | Automated Tour & Coordinate Check | Garage, Telemetry, Simulation, Operations, AI/ML, and HQ all reachable | **PASS** |
| **TEST 18** | Route Clearance & Boundary Audit | Collision & Clamp Radius Audit | Walkways, ramps, and doors free of invisible barriers; clamped at radius $35$ | **PASS** |
| **TEST 19** | Mobile Movement & Perspective | Touch Event Simulation | D-Pad triggers locomotion; touch buttons trigger jump, sprint, and perspective | **PASS** |
| **TEST 20** | Session Reload & State Persistence | `sessionStorage` Verification | Reloading browser restores player position and orientation cleanly | **PASS** |

---

## 2. Automated Test Execution

All tests are verified through two automated testing harnesses:
1. **Jest Unit Suite (`tests/engineering-world.test.ts`)**: Validates collision boxes, terrain height sampling, diagonal normalization, and facility geometry.
2. **Browser QA Suite (`scripts/run-browser-qa.mjs`)**: Launches real Chromium on `http://localhost:3005`, dispatches keyboard, mouse, and touch events, and captures screenshot proofs.


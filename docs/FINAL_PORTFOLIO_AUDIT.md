# Final portfolio audit — 8 November 2026

Release branch: codex/release-candidate-2026-11-08. Target: T-Bone47/Minecraft-folio. The commit containing this report is the audited release snapshot; see its attached CI result and release-validation-results.json for build identity. Main is reserved for approved production release.

## Baseline

Local master began at bc91ac3 with newer Chrome Era, avatar, driving, mission and visitor work uncommitted. GitHub main was f8a5458 (an older initial snapshot). The histories have separate roots; the release snapshot retains the full current working tree and uses GitHub main as its parent for review. Original local history remains on master. No newer local source was replaced with the public snapshot. Prior stage evidence recorded 45 tests and local browser passes; hosted/device gates were open.

## Remediation in this audit

- Corrected reversed driving-audio arguments and bounded synthesis inputs. Real throttle controls gain; speed controls oscillator pitch, with no invented drivetrain RPM display.
- Guarded optional audio/intro/case-study storage so storage denial permits entry and interaction.
- Added capability detection and a canonical portrait fallback for unsupported avatar WebGL. An initial error-boundary-only attempt was insufficient for asynchronous renderer creation; the final browser check verifies the corrected path.
- Replaced the assumed production domain with validated SITE_ORIGIN configuration. Unconfigured/preview builds are noindex, omit canonical claims and emit no sitemap URLs. Corrected university affiliation schema and canonical route/alias handling.
- Added Node 24 engine declaration, portable browser launch/base URL configuration and pinned read-only GitHub Actions validation.
- Removed generated logs, local project scratch state and an unused provenance-unconfirmed photo from the release index while preserving their local copies.

## Feature classification

| Feature | Classification | Evidence / boundary |
| --- | --- | --- |
| Landing, navigation, recruiter and direct project routes | PASS in local Chrome scope | Production smoke, visitor and route-layout samples |
| First/third person, pointer lock, jump/sprint, map and return visitor | PASS | Controls, avatar and release-final suites |
| Shared articulated engineer / HQ / preview | PASS | Avatar captures and pose tests |
| Six intended ground-floor facilities | PASS | Physical entrance/interior traversal; decorative upper floors excluded |
| Vehicle/cockpit/steering/reset/exit | PASS | Real input and full lap/replay journey |
| Gear/RPM display | NOT APPLICABLE | Not modelled; omitted |
| Lap/checkpoints/telemetry/replay | PASS | Ordered four-gate lap and measured debrief |
| The Experiment | PASS for synthetic local fixtures | Fitted models, held-out splits and baselines |
| The System | PASS for local simulation | Seven faults, actual repairs, output invariants and wrong-repair rejection |
| Five visitor routes and three project depths | PASS | Shared registry and browser journeys |
| Professional narrative / asset licensing | PARTIAL | Owner-supplied claims disclosed; final owner confirmation and licence selection open |
| Keyboard/touch/reduced motion/fallback | PASS in executed paths | Desktop keyboard and mobile emulation; no WCAG conformance claim |
| Real devices / assistive technology / wider browsers | NOT TESTED | No physical device or screen-reader acceptance session |
| Security/dependency review | PASS in audited scope | Zero current advisory findings; focused code/credential scan |
| Canonical configuration | PASS implementation | Invalid-origin tests and default noindex smoke |
| Verified production domain | MISSING | Owner-confirmed hostname/DNS/TLS not supplied |
| Vercel Node compatibility | PASS local build | Node 24.22.2 locked install/checks/build; hosted build not tested |
| Vercel preview and rollback rehearsal | NOT TESTED | No matching project/deployment; initial publication requires explicit approval |
| CI workflow | PARTIAL until attached run completes | Local YAML/helper checks pass; inspect the exact commit's Actions check |

Current decision and every release gate: [FINAL_RELEASE_DECISION.md](FINAL_RELEASE_DECISION.md). Feature freeze is in effect; remaining work is release verification, not new attractions.

Final visual/layout fixes: the 390px contact header now wraps its long badge, and the canonical portrait capture selects the inspector WebGL canvas rather than the global ambient-particle canvas. The corrected pixel export is public/world/avatar/asish-race-engineer-portrait.png (with the older portrait filename retained as an equivalent alias). The affected route/avatar/fallback checks were refreshed after the final build.

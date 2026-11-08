# Security release review — 8 November 2026

Scope: source and Git publication inspection, targeted storage remediation, credential-pattern scanning, existing dependency evidence and WebGL/error-boundary review. This is not a penetration test, hosted-header review or proof that no vulnerability exists. The root release audit owns fresh dependency/build/browser execution.

## Findings addressed

- **P1 — Unbounded driving audio input.** The previous DriveableF1Car caller passed a value of at least 4,000 into the audio manager's throttle argument. That manager used throttle directly to set oscillator gain, so entering a car with audio enabled could produce severe clipping. Root is replacing this with actual bounded throttle and a normalized synthetic pitch input; no fabricated dashboard RPM is required. Verify the final caller and measured Web Audio gain in browser QA.
- **P1 — Optional browser storage could stop world entry.** The audio singleton constructor read localStorage during client-module evaluation without a guard. Audio preference writes, WorldBoot's intro reads/writes, ProfileSpawn's actual Enter handler and the project-link preference write could also throw when browser storage is denied. These are now narrow try/catch preference operations. Audio defaults muted if reading fails; entering the world and opening project links continue if writes fail. Existing player/advancement persistence already guards storage exceptions.
- Added `tests/audio-storage.test.ts`. It simulates a denied localStorage getter and verifies that creating the audio manager, muting/unmuting and changing volume remain usable. `node --import tsx --test tests/audio-storage.test.ts`: **PASS**, one test. Full browser entry with localStorage/sessionStorage denial remains the root QA step.

## Publication and secret hygiene

A limited credential-pattern scan inspected **259 working-tree text files**, including Git-tracked and untracked candidate files, and **205 known-text historical blobs reachable from HEAD**. It found no matching private-key block, GitHub token, AWS access key, OpenAI-style secret key or long literal credential assignment. Values were not printed. This does not inspect binary-file semantics, browser credential stores, every possible token format or private hosting settings.

`git ls-files '*.env*' '*.pem' '*.key' '*credentials*'` returned no tracked matching credential files at review time. The safe environment example contains configuration documentation, not deployment credentials. GitHub/Vercel credentials must remain outside this repository.

`git diff --diff-filter=D --name-only origin/main HEAD` returned no paths: the reviewed local commit history does not delete remote-only files from origin/main. This check does not merge branches or establish the final staged tree; root owns the final candidate comparison and push verification.

The original tree tracked `.freebuff/project-id`, `dev_stdout.txt`, `dev_stderr.txt` and an unused `public/world/spawn-mclaren-garage.jpg`. They are generated/local state or have unresolved asset provenance. Root is removing them from the release index while preserving local copies and adding ignore rules. `.vercelignore` alone only protects the CLI upload workflow and is insufficient as Git-publication hygiene. Verify that the final commit does not re-add these paths. Source, intentional screenshots and reproducible QA JSON may be committed; generated dependency/build/cache directories and real environment files must remain excluded.

## Other reviewed controls and limits

- No App Router API route, database-backed mutation or active mail-sending endpoint was found. The dormant report helper writes local artifacts; it is not an externally callable contact API. No rate-limit or database-permission claim is made for a nonexistent service.
- Existing Next response configuration sets nosniff, DENY framing, strict-origin-when-cross-origin referrer policy and disabled camera/microphone/geolocation. CSP is not configured. A compatible report-only/nonce policy and host-managed TLS/HSTS remain hosting review work; no security control was weakened.
- JSON-LD uses developer-authored typed data. Project/station descriptions are rendered through React text, not raw imported HTML. External source links use noreferrer/noopener patterns in inspected professional/station paths.
- World WebGL unsupported/context-loss handling and the world error boundary expose a 2D fallback. The optional `/avatar` inspector lacks the same explicit fallback boundary (**P2**); a canonical portrait and navigation fallback would improve unsupported-device behavior. Do not claim the new inspector itself was verified without WebGL.
- Resource cleanup exists for world geometry, cached materials/textures, the environment bake and cockpit texture. Pointer-lock/movement handlers have removal paths; station dialogs release pointer lock, trap focus and restore the previous element. This source review does not prove long-session GPU/heap stability. The earlier quality-transition stall remains a performance investigation.
- The existing dependency-audit-after.json records zero known findings for the previously checked tree. A fresh audit must be interpreted from the root release run, not inferred from this historical artifact.
- Owner confirmation remains necessary for professional narrative, repository licensing and existing asset provenance. No copyright license, team affiliation or independent verification of owner-supplied work history is invented.

No destructive Git operation, remote write, hosted deployment, email or other external message was performed by this review task.

# Security and dependency audit

Locked dependency audit at this release: zero known findings (dependency-audit-release.json). Next.js is 15.5.29; no broad framework upgrade was performed. Lockfile installation and source checks are tested on Node 24.22.2. Deprecated tooling messages are recorded separately from security advisories; Next 15's existing lint script remains supported.

Focused review repaired the unbounded driving-audio argument path and denied-storage failures. Synthesis targets reject non-finite/extreme input; browser instrumentation verifies actual scheduled gain during unmuted driving. The initial avatar WebGL error boundary alone did not catch asynchronous setup failure; capability detection now avoids mounting an unsupported renderer and shows a model portrait.

A limited credential-pattern scan found no matches across 259 working text files and 205 historical text blobs at scan time. No real environment/credential files are staged. This is not a penetration-test guarantee. Environment values are never printed. Generated logs/scratch state and the unused provenance-unconfirmed team photo are removed from the release index and ignored; local copies remain. Existing public Git history is not rewritten.

No public contact API, account/auth service or required runtime secret is introduced. Existing nosniff/frame/referrer/permissions headers are smoke-tested. A restrictive CSP has not been validated/deployed; no protection was weakened to bypass WebGL. Hosted policy, TLS/cache and error-log acceptance are pending. See SECURITY_RELEASE_REVIEW.md and SEO_CONFIGURATION.md. No third-party code/asset licence grant is invented.

Final visual/layout fixes: the 390px contact header now wraps its long badge, and the canonical portrait capture selects the inspector WebGL canvas rather than the global ambient-particle canvas. The corrected pixel export is public/world/avatar/asish-race-engineer-portrait.png (with the older portrait filename retained as an equivalent alias). The affected route/avatar/fallback checks were refreshed after the final build.

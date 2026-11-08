# Security review — 8 November 2026

Scope: local source inspection, npm dependency audit, route/config inspection and production response checks. This is not penetration testing.

Initial `npm audit --json` reported 11 affected package entries: 1 critical, 4 high, 6 moderate. Next.js 15.2.0 was affected by multiple advisories. Upgrading within Next 15 and rerunning the audit is part of this release, not a waived risk. Raw initial evidence: dependency-audit-before.json. Final results must be read from dependency-audit-after.json.

Source scan found no matching AWS access key, OpenAI project key or private-key blocks in non-generated source. No .env file was found at repository root. This limited pattern scan cannot establish that no secret exists. No App Router API routes, middleware authentication, user database or externally callable mutation endpoints were found; core gameplay/ML/pipeline input is local and bounded. Rate limiting/API permissions are therefore not implemented for a nonexistent service. If a backend is added, reassess those controls.

`dangerouslySetInnerHTML` is used for static developer-authored JSON-LD. The dormant email report helper writes local files and does not send email or expose an HTTP route. No test messages were sent.

Configured response protections: nosniff, DENY framing, strict-origin-when-cross-origin referrer policy, disabled camera/microphone/geolocation. No CSP/HSTS deployment policy is claimed; a nonce-based CSP compatible with Next and host-managed TLS/HSTS should be tested on the selected host. No runtime error monitoring service is configured. Dependencies, hosting runtime, logs and production deployment remain release review concerns.

## Dependency remediation

Next.js and eslint-config-next are now 15.5.29. Compatible updates were applied; overrides pin Next's PostCSS to 8.5.32 and typescript-estree's minimatch to 11.0.5. `npm audit` on the resulting lockfile reports zero known vulnerabilities (all severities); raw JSON is dependency-audit-after.json. TypeScript, 42 tests and lint passed with this tree. These overrides must be revisited during future framework upgrades. Zero known audit findings is not proof of absence of vulnerabilities.

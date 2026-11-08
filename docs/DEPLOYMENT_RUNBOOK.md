# Deployment runbook

No production deployment is authorized. Current preview is a local production build, not a hosted preview.

## Candidate preparation
1. Resolve P0/P1 findings in RELEASE_BLOCKERS.md. Confirm target host, Node runtime supported by pinned Next.js, origin/domain and owner approval of professional content.
2. Preserve current work; create a reviewed release commit/tag when authorized. Record its SHA, lockfile hash and build ID. Do not use a destructive reset of this dirty checkout.
3. In an isolated clean candidate directory: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
4. Serve with `npm run start -- --port 3005`. Run cockpit, station, control, visitor and access QA scripts sequentially; save JSON/screenshots. Verify 404, resume, OG image, security headers and direct project canonical tags.
5. Publish an access-controlled hosted preview only after authorization and host selection. Verify TLS, correct public origin, asset/cache behavior, fallback, error logs and real-device checks there.

## Deployment and rollback (requires approval)
Retain the previous known-good immutable deployment and its exact source/lockfile/build artifacts. Promote the approved candidate using the host's atomic release/alias mechanism. Smoke-test `/`, `/world`, `/visit`, `/recruiter`, a project page, `/contact`, resume and OG asset. Observe runtime errors and loading failures. Roll back the alias to the prior immutable release on failed smoke checks or critical errors; repeat the smoke suite. Do not rebuild old code with new dependencies as a rollback.

No database migration is involved in the current static-content/session-local application. No required runtime secrets were found for the portfolio. Dormant report helper environment variables are not public APIs. Production log retention/error monitoring and cache/TLS settings remain host-specific.

A rollback rehearsal cannot be verified until a host and previous deployment are supplied. This runbook is prepared, not executed. Local preview success does not prove hosted rollback readiness.

## Vercel target selected — 8 November 2026

Authenticated CLI: Vercel 65.12.1, account t-bone47, available team t-bone47s-projects (Hobby). Read-only project inventory contains ASISH OS and other unrelated projects, with no Minecraft-folio/Engineering Frontier project. No project was created or repurposed, no credentials were printed and no upload occurred.

Proposed isolated project name: `asish-engineering-frontier`. Intended runtime: Node 24.x, framework Next.js, install `npm ci`, build `npm run build`, default Next output. Existing tested local runtime is Node 26.12.1; hosted Node 24 remains a verification gate. No runtime secrets are needed for core functionality. `.vercelignore` excludes generated QA artifacts and an unused legacy team-branded photo while retaining docs required by /engineering.

Important platform rule: [Vercel's first deployment documentation](https://vercel.com/docs/deployments/environments#first-deployment) says a new project's first deployment is production even with `--target=preview`. Therefore an initial deployment requires the owner's explicit production approval. Choosing Vercel alone is not that approval.

After approval, use CLI 65.12.1 to create the isolated project, confirm its runtime/framework in project settings, link this checkout with `vercel link --yes --scope t-bone47s-projects --project asish-engineering-frontier`, then deploy the reviewed candidate. Do not reuse ASISH OS. After the first deployment exists, `vercel deploy --target=preview` follows normal preview rules. Use the generated URL for hosted smoke and browser checks, preserving deployment protection.

Record deployment ID, build logs, dependency lock hash, runtime and final URL. Do not mark hosted QA passed until the URL is exercised. No previous Engineering Frontier deployment exists, so rollback cannot be rehearsed yet. Once two approved immutable releases exist, select the previous healthy deployment and use Vercel's documented rollback procedure only with permission to change production routing; confirm the resulting route/asset checks. [Rollback reference](https://vercel.com/docs/cli/rollback).

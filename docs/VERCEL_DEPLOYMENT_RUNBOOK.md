# Vercel deployment runbook

## Audited candidate

Repository: https://github.com/T-Bone47/Minecraft-folio. Release branch: codex/release-candidate-2026-11-08. Resolve the exact release commit from the branch and its attached validation artifact; release-validation-results.json records the tested source/build fingerprint. Production branch is main and has not been pushed or merged by this task. The original local master history is preserved.

## Configuration

Project root: repository root. Framework: Next.js App Router, default output (no static export). Node: 24.x via package engines; local validation uses 24.22.2. Install npm ci; build npm run build. No custom vercel.json is required. Core gameplay has no runtime secret. SITE_ORIGIN is the only active optional deployment setting: leave unset for noindex preview/local work; set a validated owner-confirmed HTTPS origin for an indexable production build. Host provides VERCEL_URL/VERCEL_ENV/VERCEL_TARGET_ENV. Dormant report helpers also reference EMAIL_SENDER and REPORT_ARTIFACT_DIR, but no advertised route invokes them.

## Current host state and stop condition

Vercel CLI 65.12.1 authenticated as t-bone47. Read-only team inventory contains unrelated projects and no matching Frontier project. No project was repurposed, linked or deployed. Preview URL: none. Hosted checks/logs: NOT TESTED. Confirmed production domain: none. GitHub integration for this candidate: not configured/verified. A branch push is source publication, not proof of a hosted preview.

[Vercel's first-deployment rule](https://vercel.com/docs/deployments/environments#first-deployment) classifies a new project's first deployment as production, including --target=preview. The brief explicitly withholds public production approval, so creating that first deployment is outside the current authorization. Do not bypass this by reusing ASISH OS. Proposed isolated project name remains asish-engineering-frontier.

## After explicit approval

1. Confirm project/team identity, actual production branch and owner-approved domain. Create/link the isolated project only after confirming this is the intended first production publication.
2. Configure root/Node24/Next defaults and appropriate environment scopes. Keep deployment protection; no credentials in Git. Link via vercel link --yes --scope t-bone47s-projects --project asish-engineering-frontier.
3. Record reviewed Git SHA, lockfile hash, deployment ID, build logs, environment and immutable URL. The first deployment uses production rules; subsequent non-production-branch deployments can be Preview.
4. Target the approved URL using QA_URL and the portable QA scripts. Exercise homepage, world, avatar, recruiter, projects, contact, resume/assets, context loss, controls and missions. Review TLS/cache/headers/logs, preview noindex and production canonical routing. Do not mark hosted checks PASS from a local build.
5. Obtain final release approval when every required gate passes. Main push/merge or promotion may deploy production; perform it only under that approval. Smoke-test the actual live URL before declaring a launch.

## Rollback and monitoring

Retain the prior healthy immutable deployment and exact SHA/lockfile/build artifacts. Repoint/promote back to that known-good deployment after critical smoke/runtime failure, then repeat the smoke suite. Do not rebuild old code with new dependencies as a rollback. No database migration is involved. No previous Frontier deployment exists, so rehearsal is NOT TESTED. [Official rollback reference](https://vercel.com/docs/cli/rollback).

Use Vercel deployment/runtime logs and manual route/error checks initially. Web Analytics/Speed Insights or error reporting may be enabled after privacy/owner review; no analytics SDK or visitor tracking was added here. Observe route loads, runtime/asset failures and recruiter/project/resume usability without collecting unnecessary personal data. Alerting/retention/account settings remain a host acceptance item.

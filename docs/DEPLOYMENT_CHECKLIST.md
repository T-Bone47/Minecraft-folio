# Deployment readiness

No deployment, remote push, credentials, external messages or destructive Git operations were performed. Existing uncommitted edits were retained.

## Local reproduction

1. `npm run typecheck`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. `npm run start -- --port 3005`
6. In another terminal: `npm run test:qa`

Browser scripts currently target local port 3005 and `C:/Program Files/Google/Chrome/Application/chrome.exe`. They require this Windows Chrome installation. `qa-stations.mjs` also accepts `QA_URL`. The manual at `/engineering` is statically generated from the checked-in method documents at build time.

## Before public release

- Review the final QA and performance reports; do not reuse historical 60 FPS claims.
- Confirm the intended hosting environment and canonical domain in `data/site.ts`.
- Review author-reported project narratives, profile/employment statements and resume for accuracy.
- Supply implementation evidence for SAKSHAM and IGNICT before adding verified capability claims.
- Exercise actual mobile devices, assistive technology and sustained high-quality rendering.
- Dependency remediation is complete for this candidate (Next 15.5.29; zero known audit findings). Repeat the audit before promotion.
- Obtain deployment authorisation, then deploy through the chosen host and smoke-test the deployed routes.

The local application is buildable and its core journeys are tested. These checks are not a declaration that all real-world deployment and device conditions have been validated.

Current release decision: NO-GO; see PRODUCTION_READINESS_AUDIT.md, RELEASE_BLOCKERS.md and DEPLOYMENT_RUNBOOK.md.

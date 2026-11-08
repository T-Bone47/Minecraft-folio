# Canonical origin and indexing — 8 November 2026

The production domain is **not confirmed**. The application no longer assumes that `asish.engineering` belongs to this release. `data/site.ts` holds shared identity/content only; server metadata reads validated configuration through `lib/siteMetadata.ts`, with a pure resolver in `lib/siteOrigin.ts`.

## Environment contract

| Variable | Purpose | Required | Visibility |
| --- | --- | --- | --- |
| `SITE_ORIGIN` | Confirmed production HTTPS origin, such as the actual configured portfolio domain | Required before an indexable launch; optional/blank for development, CI and preview | Server/build configuration; intended origin appears in public metadata |
| `VERCEL_URL` | Host-provided deployment hostname, used as the preview social-asset base | Optional outside Vercel | Public deployment metadata |
| `VERCEL_ENV` | Host-provided production/preview/development discriminator | Optional outside Vercel | Server/build configuration |
| `VERCEL_TARGET_ENV` | Host-provided target discriminator, including custom environments | Optional | Server/build configuration |
| `NODE_ENV` | Framework mode | Managed by Next.js/build tools | Server/build configuration |

No secret or `NEXT_PUBLIC_` variable is needed for this configuration. `.env.example` contains a blank origin, not an assumed domain. Core gameplay and local engineering demonstrations do not depend on an origin.

`SITE_ORIGIN` accepts an HTTPS origin only. Paths, query strings, fragments, credentials and loopback hosts are rejected with a value-free error. A trailing slash is normalized. This validates configuration shape; it does **not** prove domain ownership, DNS routing or TLS. The owner must confirm those against the approved deployment before setting it.

## Rendered behavior

- Unconfigured build: succeeds, emits `noindex,nofollow`, omits canonical/OG page URLs, emits an empty sitemap and `Disallow: /` robots policy.
- Vercel preview/development or custom target: remains noindex even when a production origin is present. Generated Vercel hostnames are used for preview asset URLs, never automatically treated as a verified production origin.
- Configured production build: emits canonical URLs and permits indexing. The root uses Next's route-relative canonical resolution, so `/contact` and `/recruiter` do not canonicalize to the homepage. Legacy `/work` and `/work/[slug]` aliases point to `/projects` and `/projects/[slug]`; the sitemap lists the canonical project routes.
- Local asset metadata uses `http://localhost:3000` only when no configured or deployment origin exists. This is a development resolution base, not a published canonical claim.

Metadata and robots/sitemap routes are built statically. Change the environment before the build and rebuild/redeploy to update policy. Crawler directives are not access control; use hosting deployment protection for private previews.

## Verification and launch gate

Four resolver tests cover unconfigured builds, configured production, preview/development/custom isolation and invalid origins. `npx tsx --test tests/site-origin.test.ts` passes. Full build and rendered route checks are owned by the final release audit. The intended live production domain, hosted canonical output, DNS/TLS and search-engine acceptance remain NOT TESTED until an approved deployment exists.

Primary references: [Next metadata URL resolution](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [robots metadata route](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [sitemap metadata route](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [Vercel system variables](https://vercel.com/docs/environment-variables/system-environment-variables). The installed Next.js 15.5.29 metadata resolver was also inspected to confirm route-relative `./` behavior.

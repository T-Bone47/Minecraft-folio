import { resolveSiteConfig } from "./siteOrigin";

// Imported only by server-rendered metadata routes/pages, not the shared identity registry.
export const siteConfig = resolveSiteConfig({
  SITE_ORIGIN: process.env.SITE_ORIGIN,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_TARGET_ENV: process.env.VERCEL_TARGET_ENV,
  NODE_ENV: process.env.NODE_ENV,
});

export function canonicalUrl(path: string): string | undefined {
  return siteConfig.indexable ? new URL(path, siteConfig.productionOrigin).toString() : undefined;
}

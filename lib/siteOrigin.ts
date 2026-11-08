export interface SiteEnvironment {
  SITE_ORIGIN?: string;
  VERCEL_URL?: string;
  VERCEL_ENV?: string;
  VERCEL_TARGET_ENV?: string;
  NODE_ENV?: string;
}

function httpsOrigin(value: string, variable: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`${variable} must be an HTTPS origin without a path, query, credentials or fragment.`); }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
      url.hostname === "localhost" || url.hostname.endsWith(".localhost") || url.hostname === "127.0.0.1" || url.hostname === "[::1]") {
    throw new Error(`${variable} must be a public HTTPS origin without a path, query, credentials or fragment.`);
  }
  return url.origin;
}

/** Configuration is explicit: a generated deployment hostname does not verify a production domain. */
export function resolveSiteConfig(env: SiteEnvironment) {
  const configured = env.SITE_ORIGIN?.trim();
  const productionOrigin = configured ? httpsOrigin(configured, "SITE_ORIGIN") : undefined;
  const deploymentHost = env.VERCEL_URL?.trim();
  const deploymentOrigin = deploymentHost ? httpsOrigin(`https://${deploymentHost}`, "VERCEL_URL") : undefined;
  const indexable = !!productionOrigin && env.NODE_ENV === "production" &&
    (!env.VERCEL_ENV || env.VERCEL_ENV === "production") &&
    (!env.VERCEL_TARGET_ENV || env.VERCEL_TARGET_ENV === "production");
  return {
    productionOrigin,
    indexable,
    metadataBase: indexable ? productionOrigin! : deploymentOrigin ?? productionOrigin ?? "http://localhost:3000",
  };
}

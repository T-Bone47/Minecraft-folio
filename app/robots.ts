import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteMetadata";

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.productionOrigin}/sitemap.xml`,
    host: siteConfig.productionOrigin,
  };
}

export const dynamic = "force-static";

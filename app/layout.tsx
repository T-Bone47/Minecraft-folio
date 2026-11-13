import { chromeEra,chromeCssVariables } from "@/data/chromeEra";
import type { Metadata, Viewport } from "next";
import { seo, siteIdentity } from "@/data/site";
import { siteConfig, canonicalUrl } from "@/lib/siteMetadata";
import { MinecraftAtmosphere } from "@/components/ambient/MinecraftAtmosphere";
import { GlobalQuakeTerminal } from "@/components/cli/GlobalQuakeTerminal";
import { education } from "@/data/experience";
// Runs content integrity checks (duplicate slugs, missing status, undeclared
// evidence grades, broken links) and warns in development.
import "@/lib/validateContent";
import "./globals.css";
import "./chrome-era.css";

const TITLE = seo.title;
const DESCRIPTION = seo.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.metadataBase),
  title: {
    default: `${TITLE} | ASISH: THE ENGINEERING FRONTIER`,
    template: `%s — ASISH: THE ENGINEERING FRONTIER`,
  },
  description: DESCRIPTION,
  keywords: seo.keywords,
  authors: [{ name: siteIdentity.name }],
  creator: siteIdentity.name,
  applicationName: "ASISH: THE ENGINEERING FRONTIER",
  alternates: siteConfig.indexable ? { canonical: "./" } : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.indexable ? "./" : undefined,
    siteName: "Asish Engineering World",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Asish Oliver M — Motorsport Software Engineer and AI/ML Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: siteConfig.indexable,
    follow: siteConfig.indexable,
    googleBot: { index: siteConfig.indexable, follow: siteConfig.indexable, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: chromeEra.carbon,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/**
 * Person structured data.
 *
 * Deliberately declares only what is verifiable: identity, roles, location,
 * education, the verified professional links and the portfolio subject areas.
 * Current university affiliation does not imply graduation. No fabricated
 * award or racing-team affiliation data is included.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteIdentity.name,
  url: canonicalUrl("/"),
  email: `mailto:${siteIdentity.social.email}`,
  jobTitle: "Motorsport Software Engineer and AI/ML Engineer",
  description: siteIdentity.supportingStatement,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Trichy",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: education.institution,
  },
  knowsAbout: [
    "Motorsport software engineering",
    "Real-time Formula 1 telemetry",
    "Numerical vehicle simulation",
    "Race strategy modelling",
    "Applied machine learning",
    "Time-series data engineering",
  ],
  sameAs: [siteIdentity.social.github, siteIdentity.social.linkedin],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={chromeCssVariables as React.CSSProperties}>
      <body className="bg-[#0e0e13] text-[#f4f4f5] technical-grid-bg min-h-screen selection:bg-[#ff8000] selection:text-black relative">
        <script
          type="application/ld+json"
          // Escape the script delimiter even when an origin is supplied through deployment configuration.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <MinecraftAtmosphere />
        <GlobalQuakeTerminal />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#ff8000] focus:text-black focus:font-mono focus:text-xs focus:border-2 focus:border-black"
        >
          Skip to main content
        </a>
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}

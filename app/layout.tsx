import type { Metadata, Viewport } from "next";
import { seo, siteIdentity, SITE_URL } from "@/data/site";
import { MinecraftAtmosphere } from "@/components/ambient/MinecraftAtmosphere";
import { education } from "@/data/experience";
// Runs content integrity checks (duplicate slugs, missing status, undeclared
// evidence grades, broken links) and warns in development.
import "@/lib/validateContent";
import "./globals.css";

const TITLE = seo.title;
const DESCRIPTION = seo.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ASISH ENGINEERING WORLD`,
  },
  description: DESCRIPTION,
  keywords: seo.keywords,
  authors: [{ name: siteIdentity.name }],
  creator: siteIdentity.name,
  applicationName: "Asish Engineering World",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
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
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0e0e13",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Person structured data.
 *
 * Deliberately declares only what is verifiable: identity, roles, location,
 * education, the verified professional links and the portfolio subject areas.
 * No `alumniOf` grades, no employer claims beyond the two known roles, and no
 * fabricated award or affiliation data.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteIdentity.name,
  url: SITE_URL,
  email: `mailto:${siteIdentity.social.email}`,
  jobTitle: "Motorsport Software Engineer and AI/ML Engineer",
  description: siteIdentity.supportingStatement,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Trichy",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  alumniOf: {
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
    <html lang="en" className="dark bg-[#0e0e13]">
      <body className="bg-[#0e0e13] text-[#f4f4f5] technical-grid-bg min-h-screen selection:bg-[#ff8000] selection:text-black relative">
        <script
          type="application/ld+json"
          // Static, developer-authored object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MinecraftAtmosphere />
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
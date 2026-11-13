import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { ProofCastPlayer } from "@/components/proofcast/ProofCastPlayer";
import { proofCastStories } from "@/lib/proofcast/storyRegistry";
import type { ProofCastRole } from "@/lib/proofcast/types";
import { canonicalUrl } from "@/lib/siteMetadata";
import { ArrowLeft, Film, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ role: string }>;
}

export function generateStaticParams() {
  return [
    { role: "motorsport" },
    { role: "backend" },
    { role: "aiml" },
    { role: "data" },
    { role: "software" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const story = proofCastStories[role as ProofCastRole];
  if (!story) {
    return { title: "ProofCast Track Not Found" };
  }
  return {
    alternates: canonicalUrl(`/proofcast/${role}`)
      ? { canonical: canonicalUrl(`/proofcast/${role}`) }
      : undefined,
    title: `${story.title} — Frontier ProofCast`,
    description: story.summary,
  };
}

export default async function RoleProofCastPage({ params }: Props) {
  const { role } = await params;
  const validRoles: ProofCastRole[] = ["motorsport", "backend", "aiml", "data", "software"];

  if (!validRoles.includes(role as ProofCastRole)) {
    notFound();
  }

  const castRole = role as ProofCastRole;
  const story = proofCastStories[castRole];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Breadcrumb */}
        <div className="space-y-4">
          <Link
            href="/proofcast"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All ProofCast Tracks</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-red-950/60 border border-red-800/80 rounded font-mono text-xs text-red-400 uppercase tracking-wider mb-2">
                <Film className="w-3 h-3" />
                <span>Specialized Track: {story.roleDisplayName}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-retro tracking-tight text-white uppercase">
                {story.title}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-1 max-w-2xl">
                {story.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Embedded ProofCast Player */}
        <section aria-label={`ProofCast documentary for ${story.roleDisplayName}`}>
          <ProofCastPlayer initialRole={castRole} initialMode="RECRUITER_60S" />
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}


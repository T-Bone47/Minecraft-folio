import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExperienceById, experiences } from "@/lib/frontierDirector/experienceRegistry";
import { getEvidenceRecord } from "@/lib/frontierDirector/evidenceRegistry";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import {
  Play,
  Shield,
  Box,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Cpu,
  Layers,
  BarChart3,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ mode?: string; layer?: string }>;
}

export async function generateStaticParams() {
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceById(slug);
  if (!exp) return { title: "Experience Not Found" };

  return {
    title: `${exp.title} — Asish Oliver M`,
    description: exp.subtitle,
    openGraph: {
      title: `${exp.title} — Engineering Demonstration`,
      description: exp.subtitle,
      type: "website",
      images: [
        {
          url: `/api/og?experience=${exp.slug}`,
          width: 1200,
          height: 630,
          alt: exp.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: exp.title,
      description: exp.subtitle,
    },
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = getExperienceById(slug);

  if (!exp) {
    notFound();
  }

  const record = getEvidenceRecord(exp.evidenceRecordId);

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f4f4f5] font-sans selection:bg-[#D71D35] selection:text-white">
      <PortfolioNav />

      {/* Status Bar */}
      <div className="bg-[#18181c] border-b border-[#252830] px-4 sm:px-6 py-2 font-mono text-[11px] text-zinc-400 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            FRONTIER DIRECTOR 2.0 // {exp.badge}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">2D AUDIT & 3D INTERACTIVE SHOWCASE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/experience"
            className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>ALL EXPERIENCES</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Header Hero */}
        <header className="bg-[#171A20] border border-[#C8CDD2]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#D71D35] text-white">
                {exp.badge}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{exp.estimatedDurationSec}s Guided Experience</span>
              </span>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Facility Anchor: <strong className="text-[#22D3EE] uppercase">{exp.primaryFacilityId}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {exp.title}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-4xl">
              {exp.subtitle}
            </p>
          </div>

          {/* Key Metrics Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {exp.keyMetrics.map((m, idx) => (
              <div key={idx} className="bg-[#121418] border border-zinc-800 rounded-lg p-3 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase truncate">
                  {m.label}
                </div>
                <div className="text-base sm:text-lg font-mono font-bold text-white">
                  {m.value}
                </div>
                <div className="text-[9px] font-mono text-emerald-400 truncate">
                  {m.provenance}
                </div>
              </div>
            ))}
          </div>

          {/* Recruiter Takeaway Callout */}
          <div className="bg-[#13161c] border-l-2 border-[#D71D35] p-3.5 rounded text-xs text-zinc-200 space-y-1">
            <div className="font-mono text-[#D71D35] font-bold text-[10px] uppercase">
              Recruiter 60-Second Evaluation:
            </div>
            <p className="leading-relaxed font-sans">{exp.recruiterTakeaway}</p>
          </div>

          {/* Dual Action Gateways */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            {/* Launch in 3D Campus */}
            <Link
              href={`/?experience=${exp.slug}&mode=showcase`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D71D35] hover:bg-[#b01428] text-white font-mono text-sm font-bold transition-all shadow-lg"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH INTERACTIVE 3D SHOWCASE</span>
            </Link>

            {/* Inspect 6-Layer Proof */}
            <Link
              href={`/experience/${exp.slug}/evidence`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1c2027] hover:bg-[#252b35] text-[#22D3EE] border border-[#22D3EE]/30 font-mono text-sm font-bold transition-colors shadow"
            >
              <Shield className="w-4 h-4" />
              <span>INSPECT 6-LAYER PROOF</span>
            </Link>
          </div>
        </header>

        {/* 4 Presentation Steps Overview */}
        <section aria-labelledby="steps-heading" className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 id="steps-heading" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#22D3EE]" />
              <span>Presentation Sequence & Engineering Breakdown</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">4 STRUCTURED PHASES</span>
          </div>

          <div className="space-y-4">
            {exp.presentationSteps.map((step) => (
              <article
                key={step.id}
                className="bg-[#171A20] border border-[#C8CDD2]/20 rounded-xl p-5 sm:p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D71D35]">
                      STEP {step.index + 1} &bull;
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                      {step.phase}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    Duration: ~{step.durationSec}s
                  </span>
                </div>

                <div className="text-sm font-semibold text-[#22D3EE]">
                  &ldquo;{step.hook}&rdquo;
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {step.narrative}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                  {step.technicalDetails.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="bg-[#121418] border border-zinc-800 p-2.5 rounded text-xs font-mono text-zinc-300 flex items-start gap-1.5"
                    >
                      <span className="text-[#22D3EE]">›</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/experience/${exp.slug}/evidence?layer=${step.associatedEvidenceLayer}`}
                    className="inline-flex items-center gap-1 font-mono text-xs text-[#22D3EE] hover:underline"
                  >
                    <span>View Layer Proof: {step.associatedEvidenceLayer.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Verified Source Files Overview */}
        {record && (
          <section aria-labelledby="source-heading" className="bg-[#171A20] border border-[#C8CDD2]/25 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 id="source-heading" className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#22D3EE]" />
                <span>Audited Source Code & Repositories</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400">100% REPRODUCIBLE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {record.layers.source.verifiedFiles.map((file, idx) => (
                <div key={idx} className="bg-[#121418] border border-zinc-800 p-3.5 rounded-lg space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-white">{file.fileName}</span>
                    <a
                      href={file.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#22D3EE] hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    {file.relativePath} ({file.lines})
                  </div>
                  <p className="text-xs text-zinc-300 pt-0.5">{file.purpose}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <PortfolioFooter />
    </div>
  );
}

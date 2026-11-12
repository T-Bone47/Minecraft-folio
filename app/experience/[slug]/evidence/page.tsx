import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExperienceById, experiences } from "@/lib/frontierDirector/experienceRegistry";
import { getEvidenceRecord } from "@/lib/frontierDirector/evidenceRegistry";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import type { EvidenceLayerId } from "@/lib/frontierDirector/types";
import {
  Shield,
  Layers,
  Cpu,
  BarChart3,
  GitBranch,
  FileCode,
  Info,
  Play,
  Box,
  ChevronRight,
  ExternalLink,
  Terminal,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceById(slug);
  if (!exp) return { title: "Evidence Not Found" };

  return {
    title: `Engineering Proof: ${exp.title} — Asish Oliver M`,
    description: `6-layer technical evidence audit for ${exp.title}: Problem, Architecture, Algorithms, Benchmarks, Trade-offs, and Source code.`,
  };
}

export default async function EvidenceDeepLinkPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = await searchParams;
  const exp = getExperienceById(slug);

  if (!exp) {
    notFound();
  }

  const record = getEvidenceRecord(exp.evidenceRecordId);
  if (!record) {
    notFound();
  }

  const rawLayer = typeof sParams?.layer === "string" ? sParams.layer : undefined;
  const activeLayer: EvidenceLayerId = (rawLayer && ["problem", "architecture", "algorithm", "evidence", "tradeoffs", "source"].includes(rawLayer))
    ? (rawLayer as EvidenceLayerId)
    : "problem";

  const layerTabs: { id: EvidenceLayerId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "problem", label: "1. Problem & Invariants", icon: Info },
    { id: "architecture", label: "2. Architecture & Flow", icon: Layers },
    { id: "algorithm", label: "3. Algorithm & Code", icon: Cpu },
    { id: "evidence", label: "4. Test Proofs & Benchmarks", icon: BarChart3 },
    { id: "tradeoffs", label: "5. Trade-offs & Alternatives", icon: GitBranch },
    { id: "source", label: "6. Verified Source Files", icon: FileCode },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f4f4f5] font-sans selection:bg-[#D71D35] selection:text-white">
      <PortfolioNav />

      {/* Status Bar */}
      <div className="bg-[#18181c] border-b border-[#252830] px-4 sm:px-6 py-2 font-mono text-[11px] text-zinc-400 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            FRONTIER DIRECTOR 2.0 // ENGINEERING PROOF INSPECTOR
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">UNREDACTED 6-LAYER AUDIT</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/experience/${exp.slug}`}
            className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>BACK TO SHOWCASE OVERVIEW</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Header Hero */}
        <header className="bg-[#171A20] border border-[#C8CDD2]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[#22D3EE] uppercase tracking-wider">
                {record.domain}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {record.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/?experience=${exp.slug}&mode=proof&layer=${activeLayer}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D71D35] hover:bg-[#b01428] text-white font-mono text-xs font-bold transition-all shadow"
              >
                <Box className="w-3.5 h-3.5" />
                <span>OPEN IN 3D WORLD</span>
              </Link>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-4xl leading-relaxed">
            Every technical layer below is cross-referenced with genuine source code, mathematical derivations, and automated unit tests running in continuous integration.
          </p>

          {/* Layer Selector Tabs */}
          <nav aria-label="Evidence Layers" className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-zinc-800 scrollbar-thin">
            {layerTabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeLayer === id;
              return (
                <Link
                  key={id}
                  href={`/experience/${exp.slug}/evidence?layer=${id}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-[#D71D35] text-white border-transparent shadow font-semibold"
                      : "bg-[#1c2027] text-zinc-400 border-zinc-800 hover:text-white hover:bg-[#252b36]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Layer Content */}
        <div className="bg-[#171A20] border border-[#C8CDD2]/25 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          {/* Layer 1: Problem */}
          {activeLayer === "problem" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Layer 1 of 6</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {record.layers.problem.title}
                </h2>
              </div>

              <div className="bg-[#121418] border border-zinc-800 p-5 rounded-xl space-y-2">
                <h3 className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider">Objective</h3>
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {record.layers.problem.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#121418] border border-zinc-800 p-5 rounded-xl space-y-3">
                  <h3 className="text-xs font-mono uppercase text-amber-400 tracking-wider">Engineering Constraints</h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                    {record.layers.problem.engineeringConstraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-mono">›</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#121418] border border-zinc-800 p-5 rounded-xl space-y-3">
                  <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">System Invariants</h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                    {record.layers.problem.invariants.map((inv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-mono">✓</span>
                        <span>{inv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Layer 2: Architecture */}
          {activeLayer === "architecture" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Layer 2 of 6</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {record.layers.architecture.title}
                </h2>
              </div>

              <div className="bg-[#0f1115] border border-zinc-800 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                <pre className="text-zinc-300 leading-tight">
                  {record.layers.architecture.asciiDiagram}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.layers.architecture.components.map((c, idx) => (
                  <div key={idx} className="bg-[#121418] border border-zinc-800 p-4 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{c.name}</span>
                      <span className="text-[11px] font-mono text-[#22D3EE]">{c.throughputOrLatency}</span>
                    </div>
                    <p className="text-xs text-zinc-300">{c.role}</p>
                    <div className="text-[10px] font-mono text-zinc-500 pt-1">
                      Module: {c.technology}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layer 3: Algorithm */}
          {activeLayer === "algorithm" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Layer 3 of 6</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {record.layers.algorithm.algorithmName}
                </h2>
                <div className="text-xs font-mono text-zinc-400 mt-1">
                  Time: <strong className="text-emerald-400">{record.layers.algorithm.complexity.time}</strong> | Space: <strong className="text-emerald-400">{record.layers.algorithm.complexity.space}</strong>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider">Formulations</h3>
                <div className="grid grid-cols-1 gap-3">
                  {record.layers.algorithm.mathematicalFormulas.map((f, i) => (
                    <div key={i} className="bg-[#121418] border border-zinc-800 p-4 rounded-lg space-y-1">
                      <div className="text-xs font-semibold text-[#22D3EE]">{f.name}</div>
                      <div className="font-mono text-xs text-white bg-black/40 px-3 py-1.5 rounded border border-zinc-800">
                        {f.latexOrNotation}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Verified Source Excerpts</h3>
                {record.layers.algorithm.codeExcerpts.map((excerpt, idx) => (
                  <div key={idx} className="bg-[#0e1014] border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
                    <div className="px-4 py-2 bg-[#171a21] border-b border-zinc-800 text-zinc-400 flex items-center justify-between">
                      <span className="font-bold text-white">{excerpt.fileName} ({excerpt.filePath})</span>
                      <span className="text-[11px] text-zinc-500">L{excerpt.startLine}-L{excerpt.endLine}</span>
                    </div>
                    <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed">
                      {excerpt.code}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layer 4: Evidence */}
          {activeLayer === "evidence" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Layer 4 of 6</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {record.layers.evidence.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {record.layers.evidence.benchmarks.map((b, idx) => (
                  <div key={idx} className="bg-[#121418] border border-zinc-800 rounded-lg p-4 space-y-1">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">{b.metric}</div>
                    <div className="text-xl font-mono font-bold text-white">{b.observedValue}</div>
                    <div className="text-[10px] font-mono text-emerald-400">Target: {b.targetBudget}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#121418] border border-zinc-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">$ {record.layers.evidence.reproducibleTestCommand}</span>
                  <span className="text-zinc-500">Node.js Test Runner</span>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                  {record.layers.evidence.passingTests.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 px-2 rounded bg-black/40">
                      <span className="text-zinc-300 truncate">✔ {t.testName}</span>
                      <span className="text-zinc-500 shrink-0 ml-2">{t.durationMs.toFixed(1)}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layer 5: Tradeoffs */}
          {activeLayer === "tradeoffs" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Layer 5 of 6</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {record.layers.tradeoffs.title}
                </h2>
              </div>

              <div className="bg-[#121418] border border-zinc-800 p-5 rounded-xl space-y-2">
                <h3 className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider">Chosen Approach</h3>
                <h4 className="text-base font-bold text-white">{record.layers.tradeoffs.chosenApproach.name}</h4>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {record.layers.tradeoffs.chosenApproach.justification}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.layers.tradeoffs.alternativesEvaluated.map((alt, idx) => (
                  <div key={idx} className="bg-[#121418] border border-zinc-800 p-5 rounded-xl space-y-3">
                    <h4 className="text-base font-bold text-white">{alt.name}</h4>
                    <div className="text-xs text-rose-400">
                      <strong>Rejection Reason:</strong> {alt.rejectionReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layer 6: Source */}
          {activeLayer === "source" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Layer 6 of 6</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {record.layers.source.title}
                </h2>
                <div className="text-xs font-mono text-zinc-400 mt-1">
                  Repository: <a href={record.layers.source.repository} target="_blank" rel="noreferrer" className="text-[#22D3EE] hover:underline">{record.layers.source.repository}</a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.layers.source.verifiedFiles.map((file, idx) => (
                  <div key={idx} className="bg-[#121418] border border-zinc-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-white">{file.fileName}</span>
                      <a href={file.repoUrl} target="_blank" rel="noreferrer" className="text-[#22D3EE] hover:underline flex items-center gap-1 text-[11px]">
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500">
                      {file.relativePath} ({file.lines})
                    </div>
                    <p className="text-xs text-zinc-300 font-sans">{file.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}

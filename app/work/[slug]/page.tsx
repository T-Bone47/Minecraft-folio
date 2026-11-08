import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/data/projects";
import { canonicalUrl } from "@/lib/siteMetadata";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import {
  ArrowLeft,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  Cpu,
  ChevronRight,
  ExternalLink,
  Box,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  Zap,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Technical Case Study | Asish Oliver M`,
    description: project.description,
    alternates: canonicalUrl(`/projects/${slug}`) ? { canonical: canonicalUrl(`/projects/${slug}`) } : undefined,
    openGraph: { title: project.title, description: project.description, url: canonicalUrl(`/projects/${slug}`), images: ["/og-image.png"] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Sibling navigation
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />

      {/* Redstone Status Bar */}
      <div className="bg-[#18181c] border-b-2 border-[#101012] px-3 sm:px-4 py-1.5 font-mono text-[10px] text-zinc-400 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 border border-emerald-200 shadow-[0_0_6px_#34d399] shrink-0" />
          <span className="font-pixel text-[9px] text-white mc-text-shadow">
            FACILITY MANUAL: {project.facility.toUpperCase()}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">10-CHAPTER ENGINEERING BLUEPRINT</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/world" className="font-pixel text-[9px] text-yellow-400 hover:text-white mc-text-shadow flex items-center gap-1">
            <span>LOCATE IN 3D WORLD</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Navigation Breadcrumbs & World Return in Minecraft Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <Link
            href="/work"
            className="mc-btn-stone px-3 py-2 text-[10px] flex items-center gap-1.5 text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&lt; ALL CANONICAL SYSTEMS</span>
          </Link>

          <Link
            href="/world"
            className="mc-btn-gold px-3.5 py-2 text-[10px] flex items-center gap-2"
          >
            <Box className="w-3.5 h-3.5" />
            <span>INSPECT FACILITY IN 3D WORLD</span>
          </Link>
        </div>

        {project.evidenceReview && <aside className="border-l-4 border-amber-400 bg-zinc-900 p-4 text-sm text-zinc-300"><strong>{project.evidenceReview.status} · {project.evidenceReview.checkedAt}</strong><p>{project.evidenceReview.summary}</p><p>Detailed legacy narrative below is author-reported. The campus demonstrations are separate, explicitly synthetic teaching examples.</p></aside>}
        {/* Case Study Header as Minecraft GUI Sign Panel */}
        <header className="mc-sign p-6 sm:p-8 space-y-4 shadow-[0_6px_0_#000000]">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-pixel text-yellow-300 mc-text-shadow-gold uppercase">
            <span>FACILITY: {project.facility}</span>
            <span className="text-amber-600">•</span>
            <span className="text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {project.status.toUpperCase()}
            </span>
            <span className="text-amber-600">•</span>
            <span>YEAR: {project.year}</span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white mc-text-shadow uppercase tracking-wide leading-tight">
            {project.title}
          </h1>

          {project.isGame && (
            <div className="text-[10px] font-pixel text-amber-300 bg-amber-950/90 px-3 py-1 border-2 border-amber-600 mc-text-shadow inline-block">
              [GAME — IN DEVELOPMENT] F1 STRATEGY &amp; TEAM MANAGEMENT
            </div>
          )}

          <div className="font-pixel text-xs sm:text-sm text-yellow-300 mc-text-shadow-gold">
            {project.tagline}
          </div>

          <p className="text-xs sm:text-sm text-[#f5eedc] font-mono leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Technology Badges as Minecraft Item Chips */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-800/60">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="mc-item-chip px-2.5 py-1 text-[10px] text-amber-100 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* 10-STEP CANONICAL ENGINEERING NARRATIVE */}
        <div className="space-y-10 font-mono">
          {/* STEP 01: PROBLEM STATEMENT */}
          <section className="mc-gui-box p-6 space-y-3 hover:border-[#ff8000] transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
              <span className="mc-btn-gold px-2 py-0.5 text-[9px]">01</span>
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                PROBLEM STATEMENT &amp; ENGINEERING CONSTRAINTS
              </h2>
            </div>
            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-[#ff8000]">
              {project.problemStatement}
            </div>
          </section>

          {/* STEP 02: SYSTEM SPECIFICATION */}
          <section className="mc-gui-box p-6 space-y-3 hover:border-sky-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
              <span className="mc-btn-stone px-2 py-0.5 text-[9px] text-sky-300">02</span>
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                SYSTEM SPECIFICATION &amp; ARCHITECTURAL SCOPE
              </h2>
            </div>
            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-sky-500">
              {project.systemOverview}
            </div>
          </section>

          {/* STEP 03: DATA ARCHITECTURE & PIPELINE */}
          {project.architecture && (
            <section className="mc-gui-box p-6 space-y-4 hover:border-yellow-500 transition-colors">
              <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
                <span className="mc-btn-gold px-2 py-0.5 text-[9px]">03</span>
                <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                  DATA ARCHITECTURE &amp; REASONING PIPELINE
                </h2>
              </div>
              <div className="space-y-3">
                <p className="mc-slot-box p-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {project.architecture.summary}
                </p>

                {/* Pipeline Flow Stages */}
                {project.architecture.pipeline && (
                  <div className="space-y-2 pt-1">
                    <div className="font-pixel text-[9px] text-yellow-400 mc-text-shadow uppercase">
                      PIPELINE STAGES FLOW:
                    </div>
                    <div className="space-y-2">
                      {project.architecture.pipeline.map((stage, i) => (
                        <div
                          key={i}
                          className="mc-slot-box p-3 space-y-1.5"
                        >
                          <div className="font-pixel text-[10px] text-white mc-text-shadow flex items-center gap-2">
                            <span className="w-2 h-2 bg-sky-400" />
                            <span>STAGE 0{i + 1}: {stage.label.toUpperCase()}</span>
                          </div>
                          {stage.children && stage.children.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pl-4 pt-1">
                              {stage.children.map((child, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="mc-item-chip text-[10px] px-2 py-0.5 text-zinc-300"
                                >
                                  {child}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* STEP 04: ENGINEERING APPROACH */}
          <section className="mc-gui-box p-6 space-y-3 hover:border-emerald-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
              <span className="mc-btn-emerald px-2 py-0.5 text-[9px]">04</span>
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                ENGINEERING APPROACH &amp; FORMULATION
              </h2>
            </div>
            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-emerald-500">
              {project.engineeringApproach}
            </div>
          </section>

          {/* STEP 05: IMPLEMENTATION DETAILS */}
          <section className="mc-gui-box p-6 space-y-4 hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
              <span className="mc-btn-stone px-2 py-0.5 text-[9px] text-purple-300">05</span>
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                IMPLEMENTATION &amp; DECISION RATIONALE
              </h2>
            </div>
            <div className="space-y-3">
              <p className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.implementationDetails}
              </p>

              {/* Engineering Decisions Breakdown */}
              {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="font-pixel text-[9px] text-purple-300 mc-text-shadow uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>RECORDED ARCHITECTURAL GUARANTEES:</span>
                  </div>
                  {project.engineeringDecisions.map((decision, dIdx) => (
                    <div key={dIdx} className="mc-slot-box p-3 space-y-1">
                      <div className="font-pixel text-[10px] text-white mc-text-shadow">
                        {decision.title}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {decision.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* STEP 06: VALIDATION STRATEGY */}
          <section className="mc-gui-box p-6 space-y-3 hover:border-cyan-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
              <span className="mc-btn-cyan px-2 py-0.5 text-[9px]">06</span>
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                VALIDATION &amp; TESTING METHODOLOGY
              </h2>
            </div>
            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-cyan-500">
              {project.validationStrategy}
            </div>
          </section>

          {/* STEP 07: RESULTS / VERIFIED EVIDENCE */}
          <section className="mc-gui-box p-6 space-y-4 hover:border-emerald-400 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
              <span className="mc-btn-emerald px-2 py-0.5 text-[9px]">07</span>
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                RESULTS &amp; VERIFIED NUMERICAL EVIDENCE
              </h2>
            </div>
            <div className="space-y-3">
              <p className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.resultsAndEvidence}
              </p>

              {/* Verified Metrics Strip */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="font-pixel text-[9px] text-emerald-400 mc-text-shadow uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>BENCHMARKED NUMERICAL TELEMETRY:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {project.metrics.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="mc-slot-box p-3 flex flex-col justify-between"
                      >
                        <div className="font-pixel text-sm sm:text-base text-yellow-400 mc-text-shadow">
                          {metric.value}
                        </div>
                        <div className="font-pixel text-[8px] text-zinc-400 uppercase mt-1">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.illustrativeLabel && (
                <div className="mc-slot-box p-2.5 text-[10px] text-amber-300 border-amber-800/60">
                  NOTE: Dynamic traces in client demonstrations are designated as: <strong>{project.illustrativeLabel}</strong>.
                </div>
              )}
            </div>
          </section>

          {/* STEP 08: KNOWN LIMITATIONS */}
          <section className="mc-obsidian-box p-6 space-y-3 border-red-900/60 hover:border-red-600 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#140f1a] pb-2.5">
              <span className="mc-btn-stone px-2 py-0.5 text-[9px] text-red-400 !border-red-700">08</span>
              <h2 className="font-pixel text-xs text-red-300 mc-text-shadow uppercase">
                KNOWN LIMITATIONS &amp; BOUNDARY CONDITIONS
              </h2>
            </div>
            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2.5 border-l-4 border-l-red-500">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{project.limitations}</span>
            </div>
          </section>

          {/* STEP 09: WHAT I LEARNED */}
          <section className="mc-sign p-6 space-y-3 shadow-[0_4px_0_#000000]">
            <div className="flex items-center gap-2 border-b border-amber-800 pb-2.5">
              <span className="mc-btn-gold px-2 py-0.5 text-[9px]">09</span>
              <h2 className="font-pixel text-xs text-yellow-300 mc-text-shadow-gold uppercase">
                WHAT I LEARNED // PROBLEM → FAILURE MODE → ANALYSIS → FIX
              </h2>
            </div>
            <div className="mc-slot-box p-4 text-xs sm:text-sm text-[#f5eedc] leading-relaxed flex items-start gap-2.5 border-l-4 border-l-amber-500">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{project.whatILearned}</span>
            </div>
          </section>

          {/* STEP 10: NEXT ITERATION */}
          <section className="mc-gui-box p-6 space-y-3 hover:border-sky-400 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2.5">
              <span className="mc-btn-stone px-2 py-0.5 text-[9px] text-sky-400">10</span>
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                NEXT ITERATION &amp; ROADMAP
              </h2>
            </div>
            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2.5 border-l-4 border-l-sky-400">
              <Compass className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{project.nextIteration}</span>
            </div>
          </section>
        </div>

        {/* Sibling Navigation & World Transition in Minecraft Buttons */}
        <footer className="mt-16 pt-8 border-t-2 border-[#121214] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/work/${prevProject.slug}`}
              className="mc-btn-stone px-3 py-2 text-[10px] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PREV: {prevProject.shortTitle}</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/world"
            className="mc-btn-gold px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Box className="w-4 h-4" />
            <span>RETURN TO 3D WORLD</span>
          </Link>

          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className="mc-btn-stone px-3 py-2 text-[10px] flex items-center gap-1.5"
            >
              <span>NEXT: {nextProject.shortTitle}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div />
          )}
        </footer>
      </main>

      <PortfolioFooter />
    </div>
  );
}


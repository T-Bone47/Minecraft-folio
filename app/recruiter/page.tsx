import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { siteIdentity } from "@/data/site";
import { projects } from "@/data/projects";
import { experience, education } from "@/data/experience";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  Activity,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  ArrowRight,
  Box,
  Terminal,
  Zap,
  Clock,
  MapPin,
  ShieldCheck,
  Layers,
  ChevronRight,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Recruiter Fast Track (30-Sec Summary) — Asish Oliver M",
  description:
    "A concise, high-impact 30-to-60-second executive engineering dossier for recruiters, engineering managers, and technical interviewers.",
};

export default function RecruiterPage() {
  const topProjects = projects.slice(0, 3); // Top 3: Live F1 Intelligence, F1 Lap-Time Simulator, RaceMind-AI

  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />

      {/* Redstone Status Bar */}
      <RedstoneStatusBar
        status="PROFILE: AUTHOR-VERIFIED"
        location="ESTIMATED READING: 30 TO 60 SECONDS"
        badgeText="WORLD"
        badgeLabel="EXPERIENCE 3D WORLD"
        badgeHref="/world"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Recruiter Emerald Badge */}
        <header className="mc-gui-box p-6 sm:p-8 space-y-4 font-mono !border-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
          <div className="flex items-center justify-between border-b-2 border-[#121214] pb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-300 font-pixel text-[9px] uppercase mc-text-shadow">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>30-SECOND EXECUTIVE DOSSIER</span>
            </div>
            <span className="font-pixel text-[9px] text-emerald-400 mc-text-shadow hidden sm:inline">
              TIER: RECRUITER FAST TRACK
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="font-pixel text-2xl sm:text-4xl text-white mc-text-shadow uppercase tracking-wide">
              {siteIdentity.name}
            </h1>
            <span className="font-pixel text-[10px] text-[#00d2be] mc-text-shadow uppercase">
              TRICHY, TAMIL NADU, INDIA
            </span>
          </div>

          <div className="font-pixel text-xs text-yellow-400 mc-text-shadow uppercase">
            MOTORSPORT SOFTWARE ENGINEER · AI / ML SYSTEMS ENGINEER
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl pt-1">
            {siteIdentity.supportingStatement} Specializing in real-time UDP telemetry pipelines, quasi-steady vehicle lap simulation, predictive pit strategy modeling, and machine learning systems for engineering problems.
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
            <div className="mc-slot-box p-2.5">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">STATUS</span>
              <strong className="font-pixel text-xs text-emerald-400 mc-text-shadow">AVAILABLE</strong>
            </div>
            <div className="mc-slot-box p-2.5">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">EDUCATION</span>
              <strong className="font-pixel text-xs text-white mc-text-shadow">M.Tech CSE</strong>
            </div>
            <div className="mc-slot-box p-2.5">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">FOCUS</span>
              <strong className="font-pixel text-xs text-yellow-400 mc-text-shadow">Motorsport</strong>
            </div>
            <div className="mc-slot-box p-2.5">
              <span className="text-zinc-500 block text-[9px] font-pixel uppercase">FLAGSHIP</span>
              <strong className="font-pixel text-xs text-sky-400 mc-text-shadow">1.06M+ Evts</strong>
            </div>
          </div>

          {/* Recruiter Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#121214]">
            <Link
              href="/dossier"
              className="voxel-btn voxel-btn-gold px-4 py-2 text-xs font-pixel flex items-center gap-2 shadow-[0_0_16px_rgba(234,179,8,0.35)]"
            >
              <FileText className="w-4 h-4 text-black" />
              <span>EXPORT HIRING COMMITTEE DOSSIER (2-PAGE PDF)</span>
            </Link>
            <a
              href="/Asish_Oliver_M_Resume.pdf"
              download="Asish_Oliver_M_Resume.pdf"
              className="mc-btn px-4 py-2 text-xs font-pixel flex items-center gap-2 text-white !bg-sky-700 hover:!bg-sky-600 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
            >
              <FileText className="w-4 h-4 text-sky-200" />
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>
            <a
              href={`mailto:${siteIdentity.social.email}`}
              className="mc-btn-emerald px-4 py-2 text-xs font-pixel flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-200" />
              <span>CONTACT: {siteIdentity.social.email}</span>
            </a>
            <a
              href={siteIdentity.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mc-btn-stone px-3 py-2 text-[10px] font-pixel flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GITHUB</span>
            </a>
            <a
              href={siteIdentity.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mc-btn-stone px-3 py-2 text-[10px] font-pixel flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5 text-sky-400" />
              <span>LINKEDIN</span>
            </a>
          </div>
        </header>

        {/* 2. TOP 3 FLAGSHIP ENGINEERING SYSTEMS */}
        <section className="space-y-4 font-mono">
          <div className="flex items-center justify-between border-b-2 border-[#121214] pb-2">
            <h2 className="font-pixel text-xs sm:text-sm uppercase tracking-wider text-white flex items-center gap-2 mc-text-shadow">
              <Cpu className="w-4 h-4 text-[#ff8000]" />
              <span>TOP 3 CANONICAL ENGINEERING SYSTEMS</span>
            </h2>
            <Link href="/work" className="font-pixel text-[9px] text-yellow-400 hover:text-white mc-text-shadow flex items-center gap-1">
              <span>ALL 6 SYSTEMS</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {topProjects.map((p, idx) => (
              <div
                key={p.id}
                className="mc-gui-box p-5 space-y-3 hover:border-[#ff8000] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[9px] text-[#ff8000] mc-text-shadow">
                      #0{idx + 1}
                    </span>
                    <h3 className="font-pixel text-sm text-white mc-text-shadow">
                      {p.title}
                    </h3>
                  </div>
                  <span className="font-pixel text-[9px] text-emerald-400 mc-text-shadow flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {p.facility.toUpperCase()}
                  </span>
                </div>

                <div className="font-pixel text-[10px] text-[#00d2be] mc-text-shadow">
                  {p.tagline}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {p.description}
                </p>

                {/* Key Metrics / Highlights Inset */}
                {p.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                    {p.metrics.slice(0, 3).map((m, i) => (
                      <div key={i} className="mc-slot-box p-2">
                        <span className="text-zinc-500 block text-[8px] font-pixel uppercase">{m.label}</span>
                        <strong className="font-pixel text-[10px] text-yellow-400 mc-text-shadow">{m.value}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px]">
                  <div className="flex flex-wrap gap-1">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="mc-item-chip px-1.5 py-0.5 text-[9px] text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/work/${p.slug}`}
                    className="mc-btn-gold px-2.5 py-1 text-[9px] flex items-center gap-1"
                  >
                    <span>CASE STUDY</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TECHNICAL ARSENAL INVENTORY */}
        <section className="mc-gui-box p-6 space-y-4 font-mono">
          <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h2 className="font-pixel text-xs sm:text-sm text-white mc-text-shadow uppercase">
              TECHNICAL PROFICIENCY INVENTORY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="mc-slot-box p-3 space-y-2">
              <span className="font-pixel text-[9px] text-yellow-400 mc-text-shadow uppercase block">
                CORE LANGUAGES
              </span>
              <div className="space-y-1 text-zinc-300">
                <div>• Python 3.12 (NumPy, Pandas)</div>
                <div>• TypeScript / JavaScript</div>
                <div>• MATLAB (ODE Solvers)</div>
                <div>• C# (Unity 6 / Simulations)</div>
                <div>• SQL (TimescaleDB / PostgreSQL)</div>
              </div>
            </div>

            <div className="mc-slot-box p-3 space-y-2">
              <span className="font-pixel text-[9px] text-[#00d2be] mc-text-shadow uppercase block">
                SYSTEMS & DATA
              </span>
              <div className="space-y-1 text-zinc-300">
                <div>• FastAPI & WebSockets</div>
                <div>• UDP Telemetry Ingestion</div>
                <div>• TimescaleDB Hyper-tables</div>
                <div>• Docker Containerization</div>
                <div>• Next.js & Three.js</div>
              </div>
            </div>

            <div className="mc-slot-box p-3 space-y-2">
              <span className="font-pixel text-[9px] text-emerald-400 mc-text-shadow uppercase block">
                MOTORSPORT & AI
              </span>
              <div className="space-y-1 text-zinc-300">
                <div>• Quasi-Steady Lap Simulation</div>
                <div>• Tyre Thermal & Degradation Models</div>
                <div>• Scikit-learn & XGBoost</div>
                <div>• Vosk Offline STT Audio</div>
                <div>• Pit Window Delta Solvers</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ACADEMIC CREDENTIALS */}
        <section className="mc-gui-box p-6 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b-2 border-[#121214] pb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <h2 className="font-pixel text-xs text-white mc-text-shadow uppercase">
                ACADEMIC ACCREDITATION
              </h2>
            </div>
            <span className="mc-btn-stone px-2 py-0.5 text-[8px] text-sky-300">
              2022 — 2027
            </span>
          </div>

          <div className="mc-slot-box p-3 space-y-1">
            <h3 className="font-pixel text-xs text-white mc-text-shadow">
              Integrated M.Tech in Computer Science & Engineering
            </h3>
            <div className="text-xs text-sky-400">
              VIT-AP University, Andhra Pradesh, India
            </div>
            <p className="text-xs text-zinc-300 pt-1 leading-relaxed">
              5-year integrated masters degree program. Core focus on distributed systems, real-time concurrency, numerical methods, and machine learning architectures. (No grades or marks cited; evaluated on demonstrable project deliverables).
            </p>
          </div>
        </section>

        {/* 5. DIRECT ACTION CTA & RECRUITER CONTACT */}
        <div className="mc-sign p-6 sm:p-8 space-y-4 shadow-[0_6px_0_#000000]">
          <div className="font-pixel text-[10px] text-yellow-300 mc-text-shadow-gold uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>DIRECT HIRING COMMUNICATION</span>
          </div>

          <div className="text-base text-white font-pixel leading-relaxed mc-text-shadow">
            Ready to discuss engineering roles or schedule a technical discussion?
          </div>

          <p className="text-xs sm:text-sm text-[#f5eedc] font-mono leading-relaxed">
            I respond within 24 hours. Available for motorsport software, telemetry engineering, and AI/ML systems engineering roles.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/Asish_Oliver_M_Resume.pdf"
              download="Asish_Oliver_M_Resume.pdf"
              className="mc-btn px-4 py-2.5 text-xs font-pixel flex items-center gap-2 text-white !bg-sky-700 hover:!bg-sky-600 border-sky-400"
            >
              <FileText className="w-4 h-4 text-sky-200" />
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>

            <a
              href={`mailto:${siteIdentity.social.email}`}
              className="mc-btn-emerald px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>SEND EMAIL: {siteIdentity.social.email}</span>
            </a>

            <a
              href={siteIdentity.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mc-btn-stone px-4 py-2.5 text-xs flex items-center gap-2 text-cyan-200 !border-cyan-700"
            >
              <Linkedin className="w-4 h-4 text-cyan-400" />
              <span>CONNECT ON LINKEDIN</span>
            </a>

            <Link
              href="/world"
              className="mc-btn-gold px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <Box className="w-4 h-4" />
              <span>INSPECT IN 3D WORLD</span>
            </Link>
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}


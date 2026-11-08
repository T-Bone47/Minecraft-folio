import React from "react";
import Link from "next/link";
import { siteIdentity } from "@/data/site";
import { projects } from "@/data/projects";
import { experience, education } from "@/data/experience";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import {
  Terminal,
  Activity,
  Cpu,
  Layers,
  Box,
  ArrowRight,
  Sparkles,
  Gauge,
  Flag,
  CheckCircle2,
  Code2,
  Database,
  Brain,
  Sliders,
  ExternalLink,
  ChevronRight,
  Radio,
  MapPin,
  GraduationCap,
  Briefcase,
  Mail,
  Zap,
  FileText,
} from "lucide-react";

export default function HomePage() {
  const technicalArsenal = [
    {
      category: "LANGUAGES",
      items: ["Python 3.12", "TypeScript", "MATLAB", "C#", "SQL", "HTML5 / CSS"],
    },
    {
      category: "SYSTEMS & BACKEND",
      items: ["FastAPI", "Next.js", "React", "WebSockets", "UDP Sockets", "Docker"],
    },
    {
      category: "DATA & TIME-SERIES",
      items: ["TimescaleDB", "PostgreSQL", "SQLite", "SQLAlchemy", "Pandas", "NumPy", "FastF1", "OpenF1"],
    },
    {
      category: "AI & MACHINE LEARNING",
      items: ["Scikit-learn", "XGBoost", "LLM Integration", "Vosk Offline STT", "PCA Embeddings", "Time-Series"],
    },
    {
      category: "MOTORSPORT & SIMULATION",
      items: ["Vehicle Dynamics", "Quasi-Steady Solver", "Friction Circle", "Telemetry Pipeline", "Tyre Degradation"],
    },
    {
      category: "3D & GRAPHICS",
      items: ["Three.js", "React Three Fiber", "Unity 6", "Voxel Engine Architecture"],
    },
  ];

  const engineeringDomains = [
    { name: "MOTORSPORT SOFTWARE", desc: "Telemetry pipelines, UDP packet acquisition, and live track timing architectures." },
    { name: "TELEMETRY SYSTEMS", desc: "Provider-agnostic event normalisation and sub-millisecond stream processing." },
    { name: "RACE STRATEGY", desc: "Pit window delta solvers, tyre degradation curves, and undercut/overcut modeling." },
    { name: "NUMERICAL SIMULATION", desc: "Quasi-steady-state vehicle lap solvers and energy conservation algorithms." },
    { name: "VEHICLE PERFORMANCE", desc: "Aerodynamic downforce mapping, friction-circle limits, and apex corner velocity." },
    { name: "AI / MACHINE LEARNING", desc: "Applied representation learning, time-series forecasting, and voice intelligence." },
    { name: "DATA ENGINEERING", desc: "High-frequency time-series schemas, TimescaleDB hyper-tables, and data integrity." },
    { name: "BACKEND ARCHITECTURE", desc: "Asynchronous microservices, WebSocket pub/sub engines, and Docker containerization." },
    { name: "REAL-TIME SYSTEMS", desc: "Low-latency packet decoding, zero-allocation event loops, and concurrency." },
    { name: "SOFTWARE DESIGN", desc: "Clean boundary decoupling, canonical event abstractions, and domain modularity." },
    { name: "TESTING & VALIDATION", desc: "Deterministic session replay fixtures, Pytest suites, and benchmark audits." },
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      {/* Global Navigation Styled as Minecraft Hotbar */}
      <PortfolioNav />

      {/* 1. MINECRAFT SYSTEM BOOT / REDSTONE STATUS BAR */}
      <div className="bg-[#18181c] border-b-2 border-[#101012] px-3 sm:px-4 py-1.5 font-mono text-[10px] text-zinc-400 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          {/* Animated Redstone Lamp Pixel */}
          <span className="w-2 h-2 bg-emerald-400 border border-emerald-200 shadow-[0_0_6px_#34d399] shrink-0" />
          <span className="font-pixel text-[9px] text-white mc-text-shadow">SYSTEM BOOT: COMPLETE</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">TRICHY, TAMIL NADU, INDIA [10.7905° N, 78.7047° E]</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>PROJECT EVIDENCE</span>
          <span className="font-pixel text-[9px] text-emerald-400 mc-text-shadow">AVAILABLE TO EXPLORE</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-16 sm:space-y-24">
        {/* 2. HERO SECTION: AUTHENTIC MINECRAFT MOTORSPORT TERMINAL */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Hero Left: Identity & Minecraft Typography (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Minecraft Item Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#ff8000]/20 border-2 border-[#ff8000] shadow-[2px_2px_0_#000] text-[10px] font-pixel text-[#ff8000] mc-text-shadow uppercase">
              <span>🏎️</span>
              <span>MOTORSPORT SOFTWARE & AI SYSTEMS</span>
            </div>

            {/* Giant Minecraft Pixel Title */}
            <div>
              <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white mc-text-shadow tracking-wider uppercase leading-none drop-shadow-[4px_4px_0_#000000]">
                {siteIdentity.name}
              </h1>

              <div className="font-pixel text-xs sm:text-sm text-[#00d2be] mc-text-shadow tracking-wide mt-3 uppercase flex items-center gap-2">
                <span>MOTORSPORT SOFTWARE</span>
                <span className="text-yellow-400">•</span>
                <span>AI / ML SYSTEMS</span>
              </div>
            </div>

            {/* Legible Technical Bio */}
            <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed max-w-xl bg-black/40 p-3 border-l-2 border-[#ff8000]">
              {siteIdentity.supportingStatement} Specializing in real-time telemetry pipelines, physics-based vehicle lap simulation, predictive race strategy, and machine learning models for high-consequence engineering decisions.
            </p>

            {/* Minecraft 3D Beveled Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/world"
                className="mc-btn-gold px-5 py-3 text-xs flex items-center gap-2.5 shadow-[0_0_16px_rgba(255,128,0,0.5)]"
              >
                <Box className="w-4 h-4 text-white shrink-0" />
                <span>ENTER 3D WORLD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/work"
                className="mc-btn-stone px-4 py-3 text-xs flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
                <span>CANONICAL SYSTEMS</span>
              </Link>

              <Link
                href="/recruiter"
                className="mc-btn-emerald px-3.5 py-3 text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span>RECRUITER (30s)</span>
              </Link>

              <a
                href="/Asish_Oliver_M_Resume.pdf"
                download="Asish_Oliver_M_Resume.pdf"
                className="mc-btn px-3.5 py-3 text-xs flex items-center gap-1.5 text-sky-300 hover:text-white !bg-sky-950/70 border-sky-500/80"
                title="Download Asish Oliver M Resume (PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>RESUME</span>
              </a>
            </div>
          </div>

          {/* Hero Right: Minecraft Redstone Instrumentation Telemetry Box (5 cols) */}
          <div className="lg:col-span-5 mc-gui-box p-4 sm:p-5 space-y-3 font-mono">
            {/* Box Header */}
            <div className="flex items-center justify-between border-b-2 border-[#121214] pb-2">
              <span className="font-pixel text-[10px] text-yellow-400 mc-text-shadow flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#ff8000]" />
                <span>PLAYABLE ENGINEERING</span>
              </span>
              <span className="font-pixel text-[8px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 border border-amber-700 mc-text-shadow">
                LOCAL SIMULATIONS
              </span>
            </div>

            {/* Inset Slot: Speed Trap & Engine RPM */}
            <div className="grid grid-cols-2 gap-2">
              <div className="mc-slot-box p-2.5">
                <div className="text-[9px] font-pixel text-zinc-400 uppercase">PHYSICS STEP</div>
                <div className="font-pixel text-base sm:text-lg text-sky-400 mc-text-shadow mt-1">
                  60 HZ
                </div>
              </div>
              <div className="mc-slot-box p-2.5">
                <div className="text-[9px] font-pixel text-zinc-400 uppercase">FLAGSHIP MISSIONS</div>
                <div className="font-pixel text-base sm:text-lg text-white mc-text-shadow mt-1">
                  3 EXPERIENCES
                </div>
              </div>
            </div>

            <div className="mc-slot-box p-3 space-y-3 text-xs font-mono text-zinc-200">
              <p><strong className="text-white">4 ordered checkpoints</strong> · timed lap and recorded replay</p>
              <p><strong className="text-white">7 pipeline faults</strong> · diagnosis, repair and validation</p>
              <p><strong className="text-white">Held-out ML evaluation</strong> · seeded synthetic data and baselines</p>
            </div>

            {/* World Navigation Quick Link */}
            <div className="mc-slot-box p-2 flex items-center justify-between text-[10px]">
              <span className="text-zinc-400">CAMPUS: 6 FACILITIES</span>
              <Link href="/world" className="text-[#ff8000] hover:text-white font-pixel text-[9px] flex items-center gap-1 mc-text-shadow">
                <span>VIEW WORLD MAP</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. ENGINEERING STATEMENT: STYLED AS MINECRAFT OAK SIGN */}
        <section className="mc-sign p-6 sm:p-8 shadow-[0_6px_0_#000000]">
          <div className="font-pixel text-[11px] uppercase tracking-wider text-yellow-300 mc-text-shadow-gold mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>&gt;_ ENGINEERING STATEMENT</span>
          </div>
          <blockquote className="text-sm sm:text-base text-[#f5eedc] font-mono leading-relaxed italic mb-3">
            &ldquo;In competitive motorsport and intelligent systems, advantage is not created by accumulating more data—it is created by establishing mathematical guarantees and extracting decisive actions from noisy streams before the car exits the next apex.&rdquo;
          </blockquote>
          <div className="text-xs text-amber-200/80 font-pixel text-[9px] mc-text-shadow-gold">
            — Asish Oliver M // Motorsport Software & AI Systems Engineer
          </div>
        </section>

        {/* 4. SELECTED SYSTEMS: 6 CANONICAL ADVANCEMENT / QUEST CARDS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-[#121214] pb-3">
            <div>
              <div className="font-pixel text-[10px] uppercase tracking-wider text-[#ff8000] mc-text-shadow flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ff8000]" />
                <span>CANONICAL ENGINEERING SYSTEMS</span>
              </div>
              <h2 className="font-pixel text-xl sm:text-2xl text-white mc-text-shadow mt-1">
                Selected Engineering Work
              </h2>
            </div>
            <Link
              href="/work"
              className="font-pixel text-[10px] text-yellow-400 hover:text-white flex items-center gap-1 mc-text-shadow self-start sm:self-auto"
            >
              <span>EXPLORE ALL {projects.length} SYSTEMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="mc-gui-box p-6 sm:p-7 flex flex-col justify-between hover:border-[#ff8000] transition-all group"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-zinc-800 pb-2">
                    <span className="font-pixel text-[9px] text-[#ff8000] mc-text-shadow">
                      SYS-0{idx + 1} {"//"} {proj.facility}
                    </span>
                    <span className="font-pixel text-[8px] text-emerald-400 mc-text-shadow flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {proj.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Project Title in Minecraft Pixel Typography */}
                  <h3 className="font-pixel text-base sm:text-lg text-white group-hover:text-yellow-300 mc-text-shadow transition-colors">
                    {proj.title}
                  </h3>

                  {proj.isGame && (
                    <div className="text-[8px] font-pixel text-amber-300 bg-amber-950/80 px-2 py-0.5 border border-amber-700 mc-text-shadow inline-block">
                      F1 STRATEGY SIMULATION GAME [GAME — IN DEV]
                    </div>
                  )}

                  <div className="text-xs font-mono text-[#00d2be] font-bold">
                    {proj.tagline}
                  </div>

                  <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Inset Slot Verified Metrics */}
                  {proj.metrics && proj.metrics.length > 0 && (
                    <div className="mc-slot-box p-2.5 grid grid-cols-2 gap-2 font-mono my-2">
                      {proj.metrics.slice(0, 4).map((m, i) => (
                        <div key={i}>
                          <div className="font-pixel text-[11px] text-white mc-text-shadow">
                            {m.value}
                          </div>
                          <div className="text-[9px] text-zinc-400 uppercase mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Badges as Mini Item Slots */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="mc-slot-box px-2 py-0.5 text-[9px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Minecraft 3D Action Button */}
                <Link
                  href={`/work/${proj.slug}`}
                  className="mc-btn-stone mt-5 w-full py-2.5 px-3 flex items-center justify-between text-yellow-300 hover:text-white"
                >
                  <span>INSPECT 10-STEP CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 5. ENGINEERING DOMAINS: MINECRAFT INVENTORY CATEGORIES */}
        <section className="space-y-6">
          <div className="border-b-4 border-[#121214] pb-3">
            <div className="font-pixel text-[10px] uppercase tracking-wider text-[#3b82f6] mc-text-shadow flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#3b82f6]" />
              <span>CAPABILITY SPECIFICATION</span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-white mc-text-shadow mt-1">
              Engineering Disciplines & Domains
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {engineeringDomains.map((dom, i) => (
              <div
                key={i}
                className="mc-gui-box p-4 hover:border-[#3b82f6] transition-colors"
              >
                <div className="font-pixel text-[10px] text-yellow-300 mc-text-shadow mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#3b82f6] border border-white/40" />
                  <span>{dom.name}</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-300 leading-relaxed">
                  {dom.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. AI / MACHINE LEARNING AS AN APPLIED TOOL */}
        <section className="mc-gui-box p-6 sm:p-8 space-y-6">
          <div>
            <div className="font-pixel text-[10px] uppercase text-emerald-400 mc-text-shadow mb-1 flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>AI / ML AS AN APPLIED TOOL</span>
            </div>
            <h2 className="font-pixel text-lg sm:text-xl text-white mc-text-shadow">
              Applied Intelligence vs Buzzwords
            </h2>
            <p className="text-xs text-zinc-300 font-mono mt-2 leading-relaxed max-w-2xl">
              Artificial intelligence is applied strictly where mathematical equations need statistical discovery:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EA FC Intelligence */}
            <div className="mc-slot-box p-4 space-y-2">
              <div className="font-pixel text-[9px] text-[#00d2be] mc-text-shadow uppercase">
                01. SPORTS PLAYER EMBEDDINGS
              </div>
              <h4 className="font-pixel text-xs text-white mc-text-shadow">
                EA FC Intelligence Pipeline
              </h4>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                Cleans and normalises the 16,228-player FC26 dataset, projects 128-dimensional player embeddings, and serves role-similarity recommendations from that space.
              </p>
              <Link
                href="/work/ea-fc-intelligence"
                className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1 font-bold pt-1"
              >
                <span>Read Vector Embedding Architecture</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* VyaparPulse */}
            <div className="mc-slot-box p-4 space-y-2">
              <div className="font-pixel text-[9px] text-amber-400 mc-text-shadow uppercase">
                02. VOICE PARSING & REVENUE FORECASTS
              </div>
              <h4 className="font-pixel text-xs text-white mc-text-shadow">
                VyaparPulse (Smart India Hackathon)
              </h4>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                Processes offline verbal transactions via local Vosk STT, extracts structured entities with duplicate prevention, and forecasts 7-day revenues via XGBoost regressions.
              </p>
              <Link
                href="/work/vyaparpulse"
                className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1 font-bold pt-1"
              >
                <span>Read Speech & Forecasting Architecture</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* 7. EXPERIENCE & EDUCATION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Experience (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="border-b-4 border-[#121214] pb-2 flex items-center justify-between">
              <div>
                <div className="font-pixel text-[9px] uppercase text-emerald-400 mc-text-shadow flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>EXPERIENCE TRAJECTORY</span>
                </div>
                <h2 className="font-pixel text-lg sm:text-xl text-white mc-text-shadow mt-1">
                  Active Professional Roles
                </h2>
              </div>
              <Link
                href="/experience"
                className="font-pixel text-[9px] text-yellow-400 hover:text-white mc-text-shadow"
              >
                TIMELINE →
              </Link>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="mc-gui-box p-5 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-800 pb-2">
                    <div className="font-pixel text-xs text-white mc-text-shadow">
                      {exp.organization}
                    </div>
                    <span className="font-pixel text-[8px] text-amber-300 bg-amber-950/80 px-2 py-0.5 border border-amber-700 mc-text-shadow self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-[#00d2be] font-bold">
                    {exp.role}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.focus.map((f, idx) => (
                      <span
                        key={idx}
                        className="mc-slot-box text-[9px] px-2 py-0.5 font-mono text-zinc-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Credentials (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <div className="border-b-4 border-[#121214] pb-2 mb-3">
                <div className="font-pixel text-[9px] uppercase text-[#ff8000] mc-text-shadow flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>ACADEMIC CREDENTIALS</span>
                </div>
                <h2 className="font-pixel text-base text-white mc-text-shadow mt-1">
                  Education
                </h2>
              </div>

              <div className="mc-gui-box p-4 space-y-2">
                <div className="font-pixel text-xs text-white mc-text-shadow">
                  {education.institution}
                </div>
                <div className="text-xs font-mono text-zinc-300">
                  {education.program}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                  Focus: Numerical methods, distributed systems, algorithms & real-time computing.
                </div>
              </div>
            </div>

            {/* Currently Building */}
            <div className="mc-slot-box p-4 space-y-2">
              <div className="font-pixel text-[9px] uppercase text-[#ff8000] mc-text-shadow flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>CURRENTLY BUILDING</span>
              </div>
              <ul className="text-xs font-mono text-zinc-300 space-y-1.5 pl-4 list-disc marker:text-[#ff8000]">
                <li>Multi-provider F1 live timing WebSocket ingestion</li>
                <li>Quasi-transient vehicle weight transfer corner solver</li>
                <li>Codemasters F1 UDP virtual race engineer</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8. TECHNICAL ARSENAL: MINECRAFT CREATIVE INVENTORY TABS */}
        <section className="space-y-6">
          <div className="border-b-4 border-[#121214] pb-3">
            <div className="font-pixel text-[10px] uppercase text-emerald-400 mc-text-shadow flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>TECHNICAL ARSENAL</span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-white mc-text-shadow mt-1">
              Tools & Systems Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalArsenal.map((stack, idx) => (
              <div
                key={idx}
                className="mc-gui-box p-4 space-y-2.5"
              >
                <div className="font-pixel text-[10px] text-yellow-300 mc-text-shadow pb-1 border-b border-zinc-800 flex items-center justify-between">
                  <span>{stack.category}</span>
                  <span className="font-mono text-[9px] text-zinc-500 font-normal">
                    {stack.items.length} tools
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.items.map((item) => (
                    <span
                      key={item}
                      className="mc-slot-box text-[9px] px-2 py-0.5 font-mono text-zinc-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. CONTACT TERMINAL: STYLED AS MINECRAFT COMMAND BLOCK / ENDER TERMINAL */}
        <section className="mc-gui-box p-6 sm:p-10 text-center sm:text-left shadow-[0_8px_0_#000000]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="font-pixel text-[10px] uppercase text-[#ff8000] mc-text-shadow">
                COMMUNICATION UPLINK
              </div>
              <h2 className="font-pixel text-xl sm:text-3xl text-white mc-text-shadow leading-tight">
                LET&apos;S BUILD SOMETHING USEFUL.
              </h2>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 max-w-xl">
                Open to discussions regarding motorsport software engineering, telemetry architecture, and applied AI/ML systems.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={`mailto:${siteIdentity.social.email}`}
                className="mc-btn-gold px-5 py-3 text-xs flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>EMAIL ASISH</span>
              </a>

              <Link
                href="/contact"
                className="mc-btn-stone px-4 py-3 text-xs"
              >
                CONTACT DOSSIER
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer Styled as Minecraft Bedrock / Stone */}
      <PortfolioFooter />
    </div>
  );
}

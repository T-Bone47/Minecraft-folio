/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Privacy-First Job Description Input & Parser Interface
 */

"use client";

import React from "react";
import { useRoleForgeStore } from "@/state/roleforgeStore";

const SAMPLE_JDS = [
  {
    label: "F1 Real-Time Telemetry Engineer",
    text: `Job Title: Senior Real-Time Telemetry Engineer (Motorsport)
We are seeking an experienced software engineer to build high-throughput telemetry pipelines.
Requirements:
- Strong proficiency in Python 3.12 and asynchronous programming (asyncio).
- Required: Deep expertise in TimescaleDB / PostgreSQL for time-series sensor ingestion.
- Required: Real-time WebSockets and UDP socket data ingestion experience.
- Preferred: Understanding of F1 tyre degradation physics and vehicle kinematics.
- Preferred: Docker containerization and automated pytest suites.
- No Java required for this position.
Nice to have: Experience with 60 Hz sim rig telemetry parsers.`,
  },
  {
    label: "AI / ML Governance & Safety Engineer",
    text: `Role: Senior Applied Machine Learning Engineer
Lead the design of reliable AI systems and continuous evaluation pipelines.
Requirements:
- Must have: Python, PyTorch / XGBoost time-series modeling.
- Required: Rigorous model evaluation methodology to prevent data leakage and lookahead bias.
- Required: Semantic embeddings and vector drift detection algorithms.
- Preferred: AI Governance compliance, including NIST AI RMF frameworks.
- Experience with cryptographic HMAC audit logs is strongly preferred.`,
  },
  {
    label: "Full-Stack Offline-First Engineer",
    text: `Position: Senior Full-Stack Engineer (Offline-First)
We build resilient web applications operating in low-bandwidth or disconnected environments.
Requirements:
- Expert in TypeScript, React 19, and Next.js App Router architecture.
- Required: Offline-first state persistence, SQLite WAL, and durable synchronization queues.
- Required: FastAPI or asynchronous Python microservice design.
- Preferred: Strict WCAG accessibility compliance and web performance budgets.
- Automated end-to-end testing with clean decoupled architecture.`,
  },
];

export const JobDescriptionInput: React.FC = () => {
  const { customJobText, setCustomJobText, parseCustomJob, isParsing } = useRoleForgeStore();

  const wordCount = customJobText.trim()
    ? customJobText.trim().split(/\s+/).length
    : 0;

  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-cyan-400 uppercase">
            Paste Technical Job Description
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            RoleForge parses technical requirements locally on your machine.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          100% Client-Side • Zero Network Egress
        </div>
      </div>

      {/* Sample Quick-Load Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase">Load Sample JD:</span>
        {SAMPLE_JDS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCustomJobText(sample.text)}
            className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={customJobText}
          onChange={(e) => setCustomJobText(e.target.value)}
          placeholder="Paste full job description, hiring brief, or technical specification text here... RoleForge will extract priorities, detect negations ('no Java required'), and map canonical engineering evidence."
          rows={11}
          className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-500 rounded p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1 pt-1">
          <span>Words: {wordCount} | Characters: {customJobText.length}</span>
          <span>Sanitization: Enabled (Scripts & HTML Stripped)</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          disabled={!customJobText.trim() || isParsing}
          onClick={parseCustomJob}
          className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-2"
        >
          {isParsing ? (
            <>
              <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
              PARSING REQUIREMENTS...
            </>
          ) : (
            <>
              COMPILE REQUIREMENTS REVIEW TABLE →
            </>
          )}
        </button>
      </div>
    </div>
  );
};


/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * 2D Web Route: /roleforge/passport
 * Printable Engineering Evidence Passport
 */

import React from "react";
import Link from "next/link";
import { generateEvidencePassport } from "@/lib/roleforge/evidencePassport";
import { EngineeringEvidencePassport } from "@/components/roleforge/EngineeringEvidencePassport";

export const metadata = {
  title: "Engineering Evidence Passport | ASISH: The Engineering Frontier",
  description:
    "Executive, print-ready engineering dossier synthesizing cryptographically verified Git commits, source code permalinks, and honest boundaries.",
};

export default function EvidencePassportPage() {
  const passportData = generateEvidencePassport();

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans print:bg-white">
      {/* Navigation Top Bar (Hidden on print) */}
      <nav className="bg-zinc-900 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/roleforge"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            ← RoleForge
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            EVIDENCE PASSPORT
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <Link
            href="/roleforge/defense"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Defense Arena
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/roleforge/review"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Review Board
          </Link>
        </div>
      </nav>

      {/* Main Passport Component */}
      <main className="flex-1 w-full p-4 sm:p-6 print:p-0">
        <EngineeringEvidencePassport data={passportData} />
      </main>
    </div>
  );
}

import React from "react";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { HiringCommitteeDossierView } from "@/components/dossier/HiringCommitteeDossierView";
import { DossierTrackId } from "@/lib/dossier/types";

export const metadata: Metadata = {
  title: "Hiring Committee 1-Click Executive Dossier — Asish Oliver M",
  description:
    "Authoritative 2-page candidate briefing packet for technical recruiters, engineering directors, and hiring committees. Verified production metrics, commit-level provenance, and mathematical invariants.",
};

export default async function DossierPage(props: {
  searchParams?: Promise<{ track?: string }>;
}) {
  const searchParams = await props.searchParams;
  const track = (searchParams?.track || "motorsport") as DossierTrackId;

  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <div className="print:hidden">
        <PortfolioNav />
        <RedstoneStatusBar
          status="DOSSIER: HIRING COMMITTEE BRIEFING ACTIVE"
          location="EXECUTIVE 2-PAGE PACKET"
          badgeText="PRINT"
          badgeLabel="SAVE TO PDF"
          badgeHref="#print"
        />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 print:p-0 print:m-0 print:max-w-none min-w-0 max-w-full overflow-x-hidden">
        <HiringCommitteeDossierView initialTrack={track} />
      </main>

      <div className="print:hidden">
        <PortfolioFooter />
      </div>
    </div>
  );
}


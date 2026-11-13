import React from "react";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { ChaosStressLab } from "@/components/chaos/ChaosStressLab";

export const metadata: Metadata = {
  title: "Browser Chaos & Stress-Test Lab — Asish Oliver M",
  description:
    "Interactive chaos engineering & systems stress-testing laboratory. Inject 10,000 events/sec telemetry bursts, network jitter, radio packet drops, and CPU stalls to verify bounded memory and invariant preservation.",
};

export default function ChaosPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />
      <RedstoneStatusBar
        status="CHAOS LAB: FAULT INJECTION ACTIVE"
        location="INJECTION: 10,000 EPS • JITTER • PACKET LOSS"
        badgeText="CHAOS"
        badgeLabel="SYSTEMS RELIABILITY"
        badgeHref="#chaos"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <ChaosStressLab />
      </main>

      <PortfolioFooter />
    </div>
  );
}


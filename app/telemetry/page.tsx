import React from "react";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { FastF1Comparator } from "@/components/telemetry/FastF1Comparator";

export const metadata: Metadata = {
  title: "FastF1 Real Telemetry Correlator & Ghost Lap — Asish Oliver M",
  description:
    "Official Formula 1 Grand Prix telemetry overlay engine. Compare 60Hz simulated vehicle dynamics against real FastF1 / OpenF1 GPS speed, throttle, and braking traces from Monza and Silverstone 2024.",
};

export default function TelemetryPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />
      <RedstoneStatusBar
        status="FASTF1 ENGINE: OFFICIAL F1 TELEMETRY OVERLAY ACTIVE"
        location="GPS OVERLAY: MONZA • SILVERSTONE 2024"
        badgeText="FASTF1"
        badgeLabel="REAL F1 CORRELATION"
        badgeHref="#telemetry"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <FastF1Comparator />
      </main>

      <PortfolioFooter />
    </div>
  );
}

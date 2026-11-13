import React from "react";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { VoxelSiliconInspector } from "@/components/silicon/VoxelSiliconInspector";

export const metadata: Metadata = {
  title: "Voxel Silicon & Vehicle Logic Gates — Asish Oliver M",
  description:
    "Interactive computer architecture & Redstone-to-silicon logic gate laboratory. Inspect ABS brake slip interlocks, F1 DRS permissive gates, telemetry ring buffer eviction, and 4-bit ALU operations.",
};

export default function SiliconPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />
      <RedstoneStatusBar
        status="VOXEL SILICON: LOGIC GATE BENCHMARK ACTIVE"
        location="CIRCUITS: ABS • F1 DRS • RING BUFFER • 4-BIT ALU"
        badgeText="SILICON"
        badgeLabel="COMPUTER ARCHITECTURE"
        badgeHref="#circuits"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 min-w-0 max-w-full overflow-x-hidden">
        <VoxelSiliconInspector />
      </main>

      <PortfolioFooter />
    </div>
  );
}


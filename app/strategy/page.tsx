import { Metadata } from "next";
import { RaceStrategySimulator } from "@/components/strategy/RaceStrategySimulator";

export const metadata: Metadata = {
  title: "Race Strategy & Tire Degradation Optimizer — Asish Oliver M — ASISH: THE ENGINEERING FRONTIER",
  description:
    "Interactive Monte Carlo race strategy simulator for Formula 1. Model non-linear tire thermal degradation curves, fuel weight burn-off (0.033s/kg), and Virtual Safety Car pit windows across 53 laps at Monza.",
};

export default function StrategyPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 bg-[#0e0e13]">
      <RaceStrategySimulator />
    </main>
  );
}


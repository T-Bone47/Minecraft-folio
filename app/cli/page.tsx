import { Metadata } from "next";
import { TerminalWindow } from "@/components/cli/TerminalWindow";

export const metadata: Metadata = {
  title: "Engineering Quake CLI — Asish Oliver M — ASISH: THE ENGINEERING FRONTIER",
  description:
    "Interactive UNIX-style terminal and engineering shell for Asish Oliver M. Inspect live FastF1 Grand Prix telemetry, execute vehicle setup simulations, inject chaos bursts, and review 2-page hiring committee dossiers via keyboard.",
};

export default function CLIPage() {
  return (
    <main className="min-h-screen pt-20 pb-12 px-4 bg-[#0e0e13] flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl h-[78vh]">
        <TerminalWindow />
      </div>
    </main>
  );
}

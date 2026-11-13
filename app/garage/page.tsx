import { Metadata } from "next";
import { F1GarageWorkbench } from "@/components/garage/F1GarageWorkbench";

export const metadata: Metadata = {
  title: "F1 Garage & Aerodynamic Setup Workbench — Asish Oliver M — ASISH: THE ENGINEERING FRONTIER",
  description:
    "Interactive Formula 1 vehicle dynamics & setup engineering workbench. Tune front/rear wing attack angles, Venturi underfloor ride heights, suspension heave stiffness, and brake bias to simulate top speed, aero balance, and lap times across Monza, Silverstone, Monaco, and Spa.",
};

export default function GaragePage() {
  return (
    <main className="min-h-screen pt-20 pb-16 bg-[#0e0e13]">
      <F1GarageWorkbench />
    </main>
  );
}

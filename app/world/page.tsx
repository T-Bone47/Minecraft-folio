import { Metadata } from "next";
import { EngineeringWorld } from "@/components/world/EngineeringWorld";

export const metadata: Metadata = {
  title: "ASISH OLIVER M — 3D Engineering World",
  description:
    "Explore motorsport software, F1 telemetry pipelines, lap time simulation, and AI/ML architectures in an interactive voxel world.",
};

export default function WorldPage() {
  return <EngineeringWorld />;
}

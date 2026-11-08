"use client";
import { VoxelEngineerAvatar } from "@/components/profile/VoxelEngineerAvatar";
import { getVoxelSignMaterial } from "@/lib/voxelTextures";
export function FieldGuides() { return <>{([{ p: [3, 0.5, 24], title: "THE EXPERIMENT", text: "Researcher / train, test, compare" }, { p: [16, 0.5, -18], title: "THE SYSTEM", text: "Engineer / diagnose, repair, validate" }] as const).map(g => <group key={g.title} position={[...g.p]}><VoxelEngineerAvatar position={[0, 0, 0]} scale={0.8} idlePose/><mesh position={[0, 2.5, 0]}><boxGeometry args={[3.5, 0.8, 0.2]}/><primitive object={getVoxelSignMaterial(g.title, g.text)} attach="material"/></mesh></group>)}</>; }

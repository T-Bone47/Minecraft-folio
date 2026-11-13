"use client";

import React from "react";

export type VoxelMaterial = "deepslate" | "iron" | "dark-iron" | "chrome" | "copper" | "redstone" | "blueprint" | "glass" | "carbon";

interface VoxelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  material?: VoxelMaterial;
  active?: boolean;
  className?: string;
  themeColor?: string;
}

export const VoxelCard: React.FC<VoxelCardProps> = ({
  children,
  material = "dark-iron",
  active = false,
  className = "",
  themeColor,
  style,
  ...props
}) => {
  const materialClasses: Record<VoxelMaterial, string> = {
    deepslate: "voxel-mat-deepslate",
    iron: "voxel-mat-iron",
    "dark-iron": "bg-[#1b1e24]",
    chrome: "voxel-mat-chrome",
    copper: "voxel-mat-copper",
    redstone: "voxel-mat-redstone",
    blueprint: "voxel-mat-blueprint",
    glass: "voxel-mat-glass",
    carbon: "voxel-mat-carbon",
  };

  return (
    <div
      className={`relative p-5 transition-all ${materialClasses[material]} border-3 ${
        active
          ? "border-amber-400 shadow-[4px_4px_0_#000000,0_0_12px_rgba(245,158,11,0.25)]"
          : "border-[#3f4756] border-t-[#667285] border-l-[#667285] border-b-[#0e1014] border-r-[#0e1014] shadow-[3px_3px_0_#000000] hover:border-zinc-400"
      } ${className}`}
      style={{
        ...style,
        ...(themeColor && active ? { borderColor: themeColor } : {}),
      }}
      {...props}
    >
      {/* 4 Corner Mechanical Rivets */}
      <span className="absolute top-1 left-1 w-1 h-1 bg-white/30 pointer-events-none" />
      <span className="absolute top-1 right-1 w-1 h-1 bg-black/40 pointer-events-none" />
      <span className="absolute bottom-1 left-1 w-1 h-1 bg-white/10 pointer-events-none" />
      <span className="absolute bottom-1 right-1 w-1 h-1 bg-black/60 pointer-events-none" />

      {children}
    </div>
  );
};

"use client";

import React from "react";
import { VoxelStatusLamp } from "./VoxelStatusLamp";

export type VoxelPanelMaterial = "iron" | "dark-iron" | "deepslate" | "blueprint" | "carbon" | "standard" | "redstone" | "gold";

interface VoxelPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VoxelPanelMaterial;
  material?: VoxelPanelMaterial;
  title?: string;
  titleLamp?: "off" | "redstone" | "cyan" | "emerald" | "amber" | "gold";
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const VoxelPanel: React.FC<VoxelPanelProps> = ({
  variant,
  material = "standard",
  title,
  titleLamp,
  icon,
  headerActions,
  children,
  className = "",
  ...props
}) => {
  const chosen = variant || material;
  const materialClass: Record<VoxelPanelMaterial, string> = {
    standard: "voxel-panel",
    iron: "voxel-panel-iron",
    "dark-iron": "voxel-panel",
    deepslate: "voxel-panel-deepslate",
    blueprint: "voxel-panel-blueprint",
    carbon: "voxel-panel voxel-mat-carbon",
    redstone: "voxel-panel voxel-mat-redstone",
    gold: "voxel-panel voxel-mat-iron border-amber-400",
  };

  const lampState = titleLamp === "gold" ? "amber" : titleLamp;

  return (
    <div className={`${materialClass[chosen] || "voxel-panel"} ${className}`} {...props}>
      {title && (
        <div className="voxel-titlebar">
          <div className="flex items-center gap-2">
            {lampState && <VoxelStatusLamp state={lampState} />}
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="font-pixel text-[10px] text-white tracking-wider uppercase mc-text-shadow">{title}</span>
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};

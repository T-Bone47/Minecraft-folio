import React from "react";

export type VoxelLampTone = "redstone" | "emerald" | "cyan" | "amber" | "off";

interface VoxelStatusLampProps {
  tone?: VoxelLampTone;
  state?: VoxelLampTone;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const VoxelStatusLamp: React.FC<VoxelStatusLampProps> = ({
  tone,
  state = "redstone",
  label,
  pulse = false,
  className = "",
}) => {
  const chosen = tone || state;
  const toneClass: Record<VoxelLampTone, string> = {
    redstone: "voxel-lamp-redstone",
    emerald: "voxel-lamp-emerald",
    cyan: "voxel-lamp-cyan",
    amber: "voxel-lamp-amber",
    off: "bg-[#16181e] border-[#383e4a]",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`voxel-lamp ${toneClass} ${pulse ? "animate-pulse" : ""}`} />
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-300">
          {label}
        </span>
      )}
    </div>
  );
};

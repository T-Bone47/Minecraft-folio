import React from "react";

export type VoxelBadgeTone = "neutral" | "emerald" | "cyan" | "gold" | "red" | "redstone" | "purple" | "amber";

interface VoxelBadgeProps {
  children: React.ReactNode;
  tone?: VoxelBadgeTone;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
}

export const VoxelBadge: React.FC<VoxelBadgeProps> = ({
  children,
  tone = "neutral",
  size = "sm",
  icon,
  className = "",
}) => {
  const toneClasses: Record<VoxelBadgeTone, string> = {
    neutral: "bg-[#16181e] text-zinc-300 border-[#383e4a]",
    emerald: "bg-[#0d2818] text-emerald-300 border-[#1b5e20]",
    cyan: "bg-[#082830] text-cyan-300 border-[#0d6070]",
    gold: "bg-[#281c08] text-amber-300 border-[#6b4700]",
    amber: "bg-[#281c08] text-amber-300 border-[#6b4700]",
    red: "bg-[#2b0c10] text-red-300 border-[#6b141e]",
    redstone: "bg-[#2b0c10] text-red-300 border-[#6b141e]",
    purple: "bg-[#220c30] text-purple-300 border-[#531878]",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[8px]",
    md: "px-2.5 py-1 text-[9px]",
    lg: "px-3 py-1.5 text-[10px]",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-mono uppercase tracking-wider ${toneClasses[tone]} ${sizeClasses} ${className}`}
      style={{
        boxShadow: "inset 1px 1px 0px rgba(255,255,255,0.08)",
      }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

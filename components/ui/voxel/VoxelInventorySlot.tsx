"use client";

import React from "react";

interface VoxelInventorySlotProps {
  id?: string;
  label?: string;
  count?: number | string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  rarity?: "common" | "uncommon" | "rare" | "epic";
  onClick?: () => void;
  className?: string;
  title?: string;
}

export const VoxelInventorySlot: React.FC<VoxelInventorySlotProps> = ({
  label,
  count,
  icon,
  active = false,
  disabled = false,
  rarity = "common",
  onClick,
  className = "",
  title,
}) => {
  const rarityBorder = {
    common: "border-b-[#383e4a] border-r-[#383e4a]",
    uncommon: "border-b-emerald-600 border-r-emerald-600",
    rare: "border-b-sky-500 border-r-sky-500",
    epic: "border-b-purple-500 border-r-purple-500",
  }[rarity];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      aria-label={label || title || "Inventory slot"}
      className={`voxel-slot ${rarityBorder} ${active ? "voxel-slot-active" : ""} ${className}`}
    >
      {icon && <div className="flex items-center justify-center pointer-events-none">{icon}</div>}

      {count !== undefined && (
        <span className="absolute bottom-0.5 right-1 font-pixel text-[8px] text-white pointer-events-none mc-text-shadow">
          {count}
        </span>
      )}
    </button>
  );
};


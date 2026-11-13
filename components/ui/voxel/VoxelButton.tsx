"use client";

import React from "react";
import Link from "next/link";

export type VoxelButtonVariant = "stone" | "gold" | "red" | "cyan" | "emerald";
export type VoxelButtonSize = "sm" | "md" | "lg";

interface VoxelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VoxelButtonVariant;
  size?: VoxelButtonSize;
  icon?: React.ReactNode;
  href?: string;
  external?: boolean;
}

export const VoxelButton: React.FC<VoxelButtonProps> = ({
  variant = "stone",
  size = "md",
  icon,
  href,
  external = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const variantClass = {
    stone: "voxel-btn",
    gold: "voxel-btn voxel-btn-gold",
    red: "voxel-btn voxel-btn-red",
    cyan: "voxel-btn voxel-btn-cyan",
    emerald: "voxel-btn voxel-btn-emerald",
  }[variant];

  const sizeClass = {
    sm: "px-2.5 py-1.5 text-[9px]",
    md: "px-3.5 py-2 text-[10px]",
    lg: "px-5 py-2.5 text-[11px]",
  }[size];

  const combinedClasses = `${variantClass} ${sizeClass} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          aria-disabled={disabled}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} aria-disabled={disabled}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

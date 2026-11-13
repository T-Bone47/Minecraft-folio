"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface VoxelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  className?: string;
}

export const VoxelModal: React.FC<VoxelModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  actions,
  maxWidth = "2xl",
  className = "",
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
    >
      <div
        className={`w-full ${maxWidthClass} voxel-panel-iron border-3 border-[#667285] max-h-[90vh] flex flex-col shadow-2xl ${className}`}
      >
        {/* Title Bar */}
        <div className="voxel-titlebar bg-[#222730] border-b-2 border-[#15171d] shrink-0">
          <div className="flex items-center gap-2.5">
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="font-pixel text-xs text-white uppercase tracking-wider">{title}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 hover:bg-[#343b48] border border-transparent hover:border-zinc-500 text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#171a20] space-y-4">{children}</div>

        {/* Footer Actions */}
        {actions && (
          <div className="p-4 bg-[#14161c] border-t-2 border-[#20252e] flex flex-wrap items-center justify-end gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};


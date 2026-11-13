import React from "react";

interface VoxelBlueprintPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  blueprintCode?: string;
  children: React.ReactNode;
  className?: string;
}

export const VoxelBlueprintPanel: React.FC<VoxelBlueprintPanelProps> = ({
  title,
  blueprintCode = "DWG-2026-F1",
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`voxel-panel-blueprint voxel-mat-blueprint relative ${className}`} {...props}>
      {/* Blueprint Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e3857] bg-[#0c1a2b]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#22d3ee] inline-block shadow-[0_0_6px_#22d3ee]" />
            <span className="font-pixel text-[10px] text-[#7dd3fc] tracking-wider uppercase">
              {title}
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#38bdf8] bg-[#082830] px-2 py-0.5 border border-[#0d6070]">
            {blueprintCode}
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5 relative z-10">{children}</div>
    </div>
  );
};


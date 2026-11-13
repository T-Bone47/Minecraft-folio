import React from "react";

interface VoxelWorkbenchProps {
  title: string;
  stageLabel?: string;
  stageNumber?: number;
  totalStages?: number;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const VoxelWorkbench: React.FC<VoxelWorkbenchProps> = ({
  title,
  stageLabel,
  stageNumber,
  totalStages = 5,
  children,
  actions,
  className = "",
}) => {
  return (
    <div className={`voxel-panel-iron voxel-mat-iron ${className}`}>
      {/* Workbench Header */}
      <div className="voxel-titlebar bg-[#222730] border-b-2 border-[#15171d]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#eabf52] border border-[#ffea9f] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#94731a]" />
          <span className="font-pixel text-[11px] text-white tracking-wide uppercase">{title}</span>
        </div>

        {stageNumber !== undefined && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-400 uppercase hidden sm:inline">
              {stageLabel || "STAGE"}
            </span>
            <span className="font-pixel text-[9px] bg-[#121418] text-amber-400 border border-[#3f4756] px-2 py-0.5">
              {stageNumber} / {totalStages}
            </span>
          </div>
        )}
      </div>

      {/* Main Workbench Surface */}
      <div className="p-5 sm:p-6 space-y-5 bg-[#171a20]/95">{children}</div>

      {/* Workbench Action Footer */}
      {actions && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#14161c] border-t-2 border-[#20252e]">
          {actions}
        </div>
      )}
    </div>
  );
};

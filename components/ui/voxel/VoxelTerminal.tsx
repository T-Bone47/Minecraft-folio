import React from "react";

interface VoxelTerminalProps {
  title?: string;
  command?: string;
  logs?: string[];
  children?: React.ReactNode;
  className?: string;
}

export const VoxelTerminal: React.FC<VoxelTerminalProps> = ({
  title = "TERMINAL UPLINK",
  command,
  logs,
  children,
  className = "",
}) => {
  return (
    <div className={`voxel-panel-deepslate border-2 border-[#2b303c] ${className}`}>
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#14171c] border-b border-[#242933]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#d71d35] inline-block" />
          <span className="w-2 h-2 bg-[#eabf52] inline-block" />
          <span className="w-2 h-2 bg-[#34d399] inline-block" />
          <span className="font-pixel text-[9px] text-zinc-300 ml-1">{title}</span>
        </div>
        <span className="font-mono text-[9px] text-zinc-500">60 HZ MON</span>
      </div>

      {/* Terminal Screen Body */}
      <div className="voxel-data-screen p-3 min-h-[120px] space-y-1 text-zinc-200">
        {command && (
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
            <span>&gt;</span>
            <span className="select-all">{command}</span>
          </div>
        )}

        {logs &&
          logs.map((log, idx) => (
            <div key={idx} className="text-zinc-400 text-[11px] leading-relaxed">
              {log}
            </div>
          ))}

        {children}
      </div>
    </div>
  );
};

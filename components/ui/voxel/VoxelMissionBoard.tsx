import React from "react";

export interface VoxelMissionItem {
  id: string;
  title: string;
  category: string;
  durationSec: number;
  status: "available" | "active" | "completed";
  summary: string;
  onClick?: () => void;
}

interface VoxelMissionBoardProps {
  title?: string;
  missions: VoxelMissionItem[];
  selectedId?: string;
  onSelectMission?: (id: string) => void;
  className?: string;
}

export const VoxelMissionBoard: React.FC<VoxelMissionBoardProps> = ({
  title = "CAMPUS MISSION DISPATCH BOARD",
  missions,
  selectedId,
  onSelectMission,
  className = "",
}) => {
  return (
    <div className={`voxel-panel-iron ${className}`}>
      {/* Board Header */}
      <div className="voxel-titlebar bg-[#222730] border-b-2 border-[#15171d]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#34d399] shadow-[0_0_6px_#34d399] inline-block" />
          <span className="font-pixel text-[10px] text-white uppercase">{title}</span>
        </div>
        <span className="font-mono text-[9px] text-zinc-400">
          {missions.length} MISSIONS AVAILABLE
        </span>
      </div>

      {/* Grid of Missions */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#14171d]/90">
        {missions.map((m) => {
          const isSelected = m.id === selectedId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                m.onClick?.();
                onSelectMission?.(m.id);
              }}
              className={`p-4 text-left transition-all border-2 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-[#252c38] border-amber-400 shadow-[3px_3px_0_#000000,0_0_10px_rgba(245,158,11,0.3)]"
                  : "bg-[#1b1f26] border-[#384050] hover:border-zinc-400 shadow-[2px_2px_0_#000000]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[9px] font-mono mb-2">
                  <span className="text-amber-400 font-bold uppercase">{m.category}</span>
                  <span className="text-zinc-500 font-mono">~{m.durationSec}s</span>
                </div>
                <h4 className="font-pixel text-xs text-white leading-snug">{m.title}</h4>
                <p className="font-mono text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {m.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-[#29303d] flex items-center justify-between text-[9px] font-mono">
                <span
                  className={`px-1.5 py-0.2 border ${
                    m.status === "completed"
                      ? "text-emerald-400 border-emerald-800 bg-emerald-950/60"
                      : "text-zinc-400 border-zinc-700 bg-zinc-900"
                  }`}
                >
                  {m.status.toUpperCase()}
                </span>
                <span className="text-amber-400 font-bold">SELECT &gt;</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};


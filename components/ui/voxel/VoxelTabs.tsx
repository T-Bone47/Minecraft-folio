"use client";

import React from "react";

export interface VoxelTabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface VoxelTabsProps<T extends string = string> {
  tabs: VoxelTabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function VoxelTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: VoxelTabsProps<T>) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1.5 bg-[#121418] border-2 border-[#2b303c] ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 font-pixel text-[10px] uppercase transition-all ${
              isActive
                ? "bg-[#383e4a] border-2 border-t-[#667285] border-l-[#667285] border-b-[#14171c] border-r-[#14171c] text-white shadow-inner"
                : "bg-[#1f232b] border-2 border-t-[#424b5a] border-l-[#424b5a] border-b-[#0f1115] border-r-[#0f1115] text-zinc-400 hover:text-white hover:bg-[#282d38]"
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[8px] px-1 py-0.2 rounded ${isActive ? "bg-black/50 text-amber-300" : "bg-black/30 text-zinc-500"}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


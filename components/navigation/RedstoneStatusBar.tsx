import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface RedstoneStatusBarProps {
  status?: string;
  location?: string;
  badgeText?: string;
  badgeLabel?: string;
  badgeHref?: string;
}

export const RedstoneStatusBar: React.FC<RedstoneStatusBarProps> = ({
  status = "SYSTEM BOOT: OK",
  location = "TRICHY, INDIA [10.7905° N, 78.7047° E]",
  badgeText = "ENGINEERING PROOF",
  badgeLabel = "VERIFIED & LIVE",
  badgeHref,
}) => {
  return (
    <div className="bg-[#18181c] border-b-2 border-[#101012] px-4 sm:px-6 py-2 font-mono text-xs text-zinc-300 flex items-center justify-between gap-3 shadow-inner overflow-hidden">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Animated Redstone Lamp Pixel */}
        <span className="w-2.5 h-2.5 bg-emerald-400 border border-emerald-200 shadow-[0_0_6px_#34d399] shrink-0 animate-pulse" />
        <span className="font-pixel text-[11px] text-white mc-text-shadow shrink-0">{status}</span>
        <span className="text-zinc-500 shrink-0">|</span>
        <span className="text-zinc-200 truncate">
          {location.includes("[") ? (
            <>
              {location.split("[")[0].trim()}{" "}
              <span className="hidden md:inline text-zinc-400">[{location.split("[")[1]}</span>
            </>
          ) : (
            location
          )}
        </span>
      </div>

      <div className="shrink-0 flex items-center gap-2 text-xs">
        {badgeHref ? (
          <Link
            href={badgeHref}
            className="flex items-center gap-1.5 text-yellow-400 hover:text-white font-pixel text-[11px] mc-text-shadow transition-colors"
          >
            <span className="hidden sm:inline text-zinc-300 font-mono text-xs">{badgeText}</span>
            <span className="text-yellow-400">{badgeLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <>
            <span className="hidden sm:inline text-zinc-300">{badgeText}</span>
            <span className="font-pixel text-[11px] text-emerald-400 mc-text-shadow whitespace-nowrap">
              {badgeLabel}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { Terminal, X } from "lucide-react";
import { TerminalWindow } from "./TerminalWindow";

export function GlobalQuakeTerminal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Toggle on backtick/tilde when not typing inside an input or textarea
      if (e.key === "`" || e.key === "~") {
        const target = e.target as HTMLElement;
        const isInputField =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;

        if (!isInputField) {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating HUD Trigger Pill (Bottom-Right) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="mc-button px-3 py-1.5 flex items-center gap-2 font-pixel text-[10px] bg-zinc-900/90 border-2 border-emerald-500/80 text-emerald-300 shadow-[0_4px_12px_rgba(0,0,0,0.8)] hover:bg-emerald-950 transition-all hover:scale-105 active:scale-95"
          title="Toggle Quake Engineering Shell (` or ~)"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{isOpen ? "CLOSE SHELL [~]" : "CLI SHELL [~]"}</span>
        </button>
      </div>

      {/* Quake Dropdown Modal / Slide-down Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-down Terminal Container */}
          <div className="relative z-10 w-full h-[70vh] sm:h-[65vh] max-w-5xl mx-auto shadow-2xl p-2 sm:p-4">
            <TerminalWindow isOverlay onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}


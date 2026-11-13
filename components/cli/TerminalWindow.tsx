"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Send, Trash2, ArrowUpRight, Sparkles, HelpCircle } from "lucide-react";
import { executeCLICommand, CLI_COMMANDS } from "@/lib/cli/commandRegistry";
import { CLITerminalLine } from "@/lib/cli/types";

interface TerminalWindowProps {
  initialCommand?: string;
  isOverlay?: boolean;
  onClose?: () => void;
}

export function TerminalWindow({ initialCommand, isOverlay, onClose }: TerminalWindowProps) {
  const router = useRouter();
  const [lines, setLines] = useState<CLITerminalLine[]>([
    {
      id: "welcome-1",
      type: "system",
      content: "ASISH: THE ENGINEERING FRONTIER — QUAKE CLI v2.4 [CONNECTED TO CANONICAL RUNTIME]",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "welcome-2",
      type: "system",
      content: "Type 'help' to inspect commands. Try 'telemetry', 'garage', 'chaos', or 'dossier'. Press Tab for autocomplete.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputVal, setInputVal] = useState(initialCommand || "");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleExecute = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to input history
    setHistory((prev) => [trimmed, ...prev.slice(0, 50)]);
    setHistoryIndex(-1);

    // Append user input line
    const userLine: CLITerminalLine = {
      id: `input-${Date.now()}`,
      type: "input",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLines((prev) => [...prev, userLine]);
    setInputVal("");

    const result = await executeCLICommand(trimmed, (path) => {
      router.push(path);
      if (onClose && isOverlay) {
        setTimeout(onClose, 800);
      }
    });

    if (result.systemAction?.type === "clear") {
      setLines([]);
      return;
    }

    const outputLine: CLITerminalLine = {
      id: `output-${Date.now()}`,
      type: result.status === "error" ? "error" : "output",
      content: typeof result.output === "string" ? result.output : JSON.stringify(result.output, null, 2),
      timestamp: new Date().toLocaleTimeString(),
    };

    setLines((prev) => [...prev, outputLine]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExecute(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex + 1 < history.length) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;

      const matches = Object.keys(CLI_COMMANDS).filter((cmd) => cmd.startsWith(current));
      if (matches.length === 1) {
        setInputVal(matches[0] + " ");
      } else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          {
            id: `tab-${Date.now()}`,
            type: "system",
            content: `Possible matches: ${matches.join(", ")}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } else if (e.key === "Escape" && onClose) {
      onClose();
    }
  };

  const quickCommands = ["help", "telemetry", "garage", "chaos", "dossier", "whoami", "sysinfo", "clear"];

  return (
    <div className="w-full h-full flex flex-col mc-panel bg-black/95 border-2 border-emerald-600/70 font-mono text-xs shadow-2xl relative overflow-hidden select-text">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-emerald-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-pixel text-[10px] text-emerald-300 tracking-wider">
            ASISH@FRONTIER: ~ (UNIX & VOXEL SHELL)
          </span>
          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-600/60 hidden sm:inline">
            60Hz RK4 ONLINE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLines([])}
            className="text-zinc-400 hover:text-white p-1"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-0.5 font-pixel text-[10px] bg-rose-950 text-rose-300 border border-rose-600 hover:bg-rose-900"
              title="Close Terminal (ESC or `)"
            >
              ESC / CLOSE
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Command Chips */}
      <div className="px-4 py-1.5 bg-zinc-950 border-b border-zinc-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
        <span className="text-[9px] font-pixel text-zinc-500 uppercase tracking-widest shrink-0">
          CHIPS:
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleExecute(cmd)}
            className="px-2 py-0.5 bg-zinc-900 hover:bg-emerald-950 text-zinc-300 hover:text-emerald-300 border border-zinc-800 hover:border-emerald-600 font-mono text-[10px] shrink-0 transition-colors"
          >
            ${cmd}
          </button>
        ))}
      </div>

      {/* Scrollable Output Viewport */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono leading-relaxed text-zinc-200">
        {lines.map((line) => (
          <div key={line.id} className="space-y-1">
            {line.type === "input" ? (
              <div className="flex items-center gap-2 text-amber-300">
                <span className="text-emerald-400 font-pixel text-[9px]">asish@frontier:~$</span>
                <span className="font-bold">{line.content}</span>
                <span className="text-[9px] text-zinc-600 ml-auto">{line.timestamp}</span>
              </div>
            ) : line.type === "system" ? (
              <div className="text-zinc-500 text-[11px] border-l-2 border-emerald-600 pl-2">
                {line.content}
              </div>
            ) : line.type === "error" ? (
              <div className="text-rose-400 bg-rose-950/30 border border-rose-900/60 p-2 whitespace-pre-wrap font-mono">
                {line.content}
              </div>
            ) : (
              <div className="text-emerald-400/90 whitespace-pre-wrap font-mono text-[11px] bg-black/40 p-2 border-l border-emerald-900/50">
                {line.content}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Command Prompt Line */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2 shrink-0">
        <span className="text-emerald-400 font-pixel text-[10px] shrink-0">
          asish@frontier:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command... (e.g. telemetry, garage, chaos, dossier, help)"
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-xs caret-emerald-400 placeholder:text-zinc-600"
          autoFocus
        />
        <button
          onClick={() => handleExecute(inputVal)}
          disabled={!inputVal.trim()}
          className="px-2.5 py-1 mc-button text-xs font-mono text-zinc-300 hover:text-emerald-300 disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


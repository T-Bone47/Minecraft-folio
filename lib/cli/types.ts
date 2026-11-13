export interface CLICommandContext {
  args: string[];
  flags: Record<string, string | boolean>;
  rawInput: string;
  navigate?: (path: string) => void;
}

export interface CLICommandResult {
  output: string | React.ReactNode;
  status: "success" | "error" | "info";
  systemAction?: {
    type: "navigate" | "clear" | "apply_setup";
    payload?: string;
  };
}

export interface CLICommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  examples: string[];
  category: "motorsport" | "systems" | "dossier" | "general" | "navigation";
  execute: (context: CLICommandContext) => CLICommandResult | Promise<CLICommandResult>;
}

export interface CLITerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system";
  content: string;
  timestamp: string;
}

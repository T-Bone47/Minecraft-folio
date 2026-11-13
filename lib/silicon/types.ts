export type LogicGateType =
  | "AND"
  | "OR"
  | "NOT"
  | "NAND"
  | "NOR"
  | "XOR"
  | "COMPARATOR"
  | "LATCH"
  | "FULL_ADDER";

export interface CircuitPin {
  id: string;
  name: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

export interface TruthTableRow {
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
  conditionLabel?: string;
}

export interface RedstoneBlockNode {
  id: string;
  name: string;
  type: "dust" | "torch" | "repeater" | "comparator" | "lever" | "lamp";
  label: string;
  redstoneEquivalent: string;
  siliconGate: LogicGateType | "WIRE" | "INPUT" | "OUTPUT";
  signalStrength: number; // 0 to 15
  isPowered: boolean;
  role: string;
}

export interface SiliconCircuit {
  id: string;
  name: string;
  subtitle: string;
  domain: "MOTORSPORT" | "TELEMETRY" | "COMP_ARCH" | "SAFETY_CRITICAL";
  description: string;
  inputs: CircuitPin[];
  outputs: CircuitPin[];
  evaluate: (inputs: Record<string, boolean>) => {
    outputs: Record<string, boolean>;
    internalSignals: Record<string, boolean>;
  };
  truthTable: TruthTableRow[];
  redstoneComponents: RedstoneBlockNode[];
  booleanFormula: string;
  ecuFirmwareCpp: string;
  physicalEquation: string;
  latencyBudgetMicroseconds: number;
}


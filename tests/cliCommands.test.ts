import test from "node:test";
import assert from "node:assert/strict";
import { parseCLIInput, executeCLICommand, CLI_COMMANDS } from "../lib/cli/commandRegistry";

test("CLI: parseCLIInput correctly extracts command, args, and flags", () => {
  const result1 = parseCLIInput("telemetry --circuit monza --compare");
  assert.strictEqual(result1.commandName, "telemetry");
  assert.strictEqual(result1.flags.circuit, "monza");
  assert.strictEqual(result1.flags.compare, true);

  const result2 = parseCLIInput("garage --preset=monza_vmax");
  assert.strictEqual(result2.commandName, "garage");
  assert.strictEqual(result2.flags.preset, "monza_vmax");

  const result3 = parseCLIInput("goto /world");
  assert.strictEqual(result3.commandName, "goto");
  assert.strictEqual(result3.args[0], "/world");
});

test("CLI: help command lists all registered engineering commands", async () => {
  const result = await executeCLICommand("help");
  assert.strictEqual(result.status, "success");
  assert.ok(typeof result.output === "string" && result.output.includes("MOTORSPORT"));
  assert.ok(typeof result.output === "string" && result.output.includes("telemetry"));
  assert.ok(typeof result.output === "string" && result.output.includes("chaos"));
  assert.ok(typeof result.output === "string" && result.output.includes("garage"));
});

test("CLI: telemetry command outputs Pearson correlation and apex speeds", async () => {
  const result = await executeCLICommand("telemetry --circuit monza");
  assert.strictEqual(result.status, "success");
  assert.ok(typeof result.output === "string" && result.output.includes("PEARSON r"));
  assert.ok(typeof result.output === "string" && result.output.includes("R-SQUARED"));
  assert.ok(typeof result.output === "string" && result.output.includes("Variante del Rettifilo"));
});

test("CLI: garage command computes top speed and downforce", async () => {
  const result = await executeCLICommand("garage --circuit monza --preset monza_vmax");
  assert.strictEqual(result.status, "success");
  assert.ok(typeof result.output === "string" && result.output.includes("TOP SPEED (V-MAX)"));
  assert.ok(typeof result.output === "string" && result.output.includes("TOTAL DOWNFORCE@250"));
});

test("CLI: chaos command evaluates 10k eps burst and memory invariant", async () => {
  const result = await executeCLICommand("chaos --scenario silverstone-surge");
  assert.strictEqual(result.status, "success");
  assert.ok(typeof result.output === "string" && result.output.includes("10000 events/sec"));
  assert.ok(typeof result.output === "string" && result.output.includes("HEAP CONSUMPTION"));
  assert.ok(typeof result.output === "string" && result.output.includes("PASS"));
});

test("CLI: dossier command returns verified candidate evidence", async () => {
  const result = await executeCLICommand("dossier --track motorsport");
  assert.strictEqual(result.status, "success");
  assert.ok(typeof result.output === "string" && result.output.includes("HIRING COMMITTEE"));
  assert.ok(typeof result.output === "string" && result.output.includes("VERIFIED PRODUCTION BENCHMARKS"));
});

test("CLI: unknown command produces clear error suggestion", async () => {
  const result = await executeCLICommand("invalid_random_cmd_123");
  assert.strictEqual(result.status, "error");
  assert.ok(typeof result.output === "string" && result.output.includes("Unknown command"));
});

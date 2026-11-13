import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

describe("Frontier Voxel Design System Primitives", () => {
  it("defines all 8 original pixel materials in styles/voxel-materials.css", () => {
    const css = fs.readFileSync("styles/voxel-materials.css", "utf-8");
    const materials = [
      "voxel-mat-deepslate",
      "voxel-mat-iron",
      "voxel-mat-chrome",
      "voxel-mat-copper",
      "voxel-mat-redstone",
      "voxel-mat-blueprint",
      "voxel-mat-glass",
      "voxel-mat-carbon",
    ];

    for (const mat of materials) {
      assert.ok(css.includes(`.${mat}`), `Material class .${mat} must be defined`);
      assert.ok(css.includes("data:image/svg+xml"), "Material must use SVG data URI pixel textures");
      assert.ok(css.includes("image-rendering: pixelated"), "Material must enforce pixelated rendering");
    }
  });

  it("defines core material and engineering signal tokens in styles/voxel-tokens.css", () => {
    const css = fs.readFileSync("styles/voxel-tokens.css", "utf-8");
    const requiredTokens = [
      "--vx-deepslate",
      "--vx-carbon",
      "--vx-dark-iron",
      "--vx-machine-steel",
      "--vx-chrome-silver",
      "--vx-bright-iron",
      "--vx-racing-red",
      "--vx-redstone",
      "--vx-telemetry-cyan",
      "--vx-engineering-green",
      "--vx-golden-circuit",
      "--vx-font-pixel",
    ];

    for (const token of requiredTokens) {
      assert.ok(css.includes(token), `Design token ${token} must be defined in :root`);
    }
  });

  it("globals.css imports all three voxel design stylesheets", () => {
    const globals = fs.readFileSync("app/globals.css", "utf-8");
    assert.ok(globals.includes("voxel-tokens.css"));
    assert.ok(globals.includes("voxel-materials.css"));
    assert.ok(globals.includes("voxel-components.css"));
  });

  it("exports all 14 primitive components and voxel icons from index.ts", () => {
    const barrel = fs.readFileSync("components/ui/voxel/index.ts", "utf-8");
    const primitives = [
      "VoxelPanel",
      "VoxelButton",
      "VoxelCard",
      "VoxelInventorySlot",
      "VoxelStatusLamp",
      "VoxelDataScreen",
      "VoxelTabs",
      "VoxelBadge",
      "VoxelTerminal",
      "VoxelBlueprintPanel",
      "VoxelWorkbench",
      "VoxelMissionBoard",
      "VoxelModal",
      "VoxelIcons",
    ];

    for (const primitive of primitives) {
      assert.ok(barrel.includes(primitive), `Primitive ${primitive} must be exported from barrel`);
    }
  });

  it("voxel-components.css defines button physical active depression and lamp keyframes", () => {
    const css = fs.readFileSync("styles/voxel-components.css", "utf-8");
    assert.ok(css.includes("translate(2px, 2px)"), "Mechanical button active depression must be defined");
    assert.ok(css.includes("@keyframes voxel-lamp-glow"), "Voxel lamp pulse keyframe animation must be defined");
    assert.ok(css.includes(".voxel-data-screen"), "Voxel data screen high-contrast readout surface must be defined");
  });
});

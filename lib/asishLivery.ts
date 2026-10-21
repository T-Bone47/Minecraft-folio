// Voxel Motorsport Park — branded orange/grey palette.
// Replaces the McLaren/Illuminati papaya barrel so the engineering world reads
// as Asish's own campus rather than a real team's livery.

import { createPixelCanvas, pseudoNoise } from "./textureHelpers";

// The canvas context type is explicit here so TypeScript does not infer `any`.
function drawPalette(ctx: CanvasRenderingContext2D, swatches: string[], seed: number, size: number) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = Math.floor(pseudoNoise(x, y, seed) * swatches.length);
      ctx.fillStyle = swatches[idx]!;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

export const voxelPalettes = {
  asish_orange: {
    swatches: ["#ff8000", "#ff8a1a", "#e67000", "#ff9433", "#cc6600"],
    seed: 2024,
  },
  carbon_grey: {
    swatches: ["#2b2d31", "#1f2124", "#35383d", "#232528", "#3c3f44"],
    seed: 707,
  },
  concrete: {
    swatches: ["#6b6f76", "#5a5e64", "#787c84", "#4d5157", "#83878e"],
    seed: 505,
  },
  asish_cyan: {
    swatches: ["#0aa6c4", "#16c0e0", "#078a9f", "#22d3f0", "#04728c"],
    seed: 654,
  },
};

export function createAsishLiveryTexture(
  variant: keyof typeof voxelPalettes,
  size = 16
) {
  const palette = voxelPalettes[variant];
  return createPixelCanvas((ctx) => drawPalette(ctx, palette.swatches, palette.seed, size), size);
}

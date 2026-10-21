import * as THREE from "three";

export function createPixelCanvas(
  drawFn: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 16
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  drawFn(ctx, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function pseudoNoise(x: number, y: number, seed = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Generates the Open Graph card as a real PNG.
 *
 * Why not `next/og`? Its bundled font loader resolves paths through
 * `fileURLToPath`, which throws on this workspace path because it contains a
 * space. Rather than fight that or add a font dependency, this renders the
 * card directly: a hand-rolled PNG encoder plus a 5x7 bitmap font.
 *
 * No dependencies, fully deterministic (no Math.random), ~4 KB of output,
 * and it cannot break the production build.
 *
 *   node scripts/generate-og.mjs
 */

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WIDTH = 1200;
const HEIGHT = 630;

// Palette — graphite, carbon, technical orange, cyan, warm white.
const BG = [0x0e, 0x0e, 0x13];
const GRID = [0x1c, 0x1c, 0x24];
const ORANGE = [0xff, 0x80, 0x00];
const CYAN = [0x00, 0xd2, 0xbe];
const YELLOW = [0xfa, 0xcc, 0x15];
const GREEN = [0x34, 0xd3, 0x99];
const WHITE = [0xf4, 0xf4, 0xf5];
const MUTED = [0xa1, 0xa1, 0xaa];
const FAINT = [0x5a, 0x5a, 0x66];

/** 5x7 bitmap font. Each glyph is 7 rows of 5 cells; '#' is lit. */
const FONT = {
  A: ".###.|#...#|#...#|#####|#...#|#...#|#...#",
  B: "####.|#...#|#...#|####.|#...#|#...#|####.",
  C: ".###.|#...#|#....|#....|#....|#...#|.###.",
  D: "####.|#...#|#...#|#...#|#...#|#...#|####.",
  E: "#####|#....|#....|####.|#....|#....|#####",
  F: "#####|#....|#....|####.|#....|#....|#....",
  G: ".###.|#...#|#....|#.###|#...#|#...#|.###.",
  H: "#...#|#...#|#...#|#####|#...#|#...#|#...#",
  I: "#####|..#..|..#..|..#..|..#..|..#..|#####",
  J: "...##|....#|....#|....#|#...#|#...#|.###.",
  K: "#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#",
  L: "#....|#....|#....|#....|#....|#....|#####",
  M: "#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#",
  N: "#...#|##..#|#.#.#|#.#.#|#..##|#...#|#...#",
  O: ".###.|#...#|#...#|#...#|#...#|#...#|.###.",
  P: "####.|#...#|#...#|####.|#....|#....|#....",
  Q: ".###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#",
  R: "####.|#...#|#...#|####.|#.#..|#..#.|#...#",
  S: ".####|#....|#....|.###.|....#|....#|####.",
  T: "#####|..#..|..#..|..#..|..#..|..#..|..#..",
  U: "#...#|#...#|#...#|#...#|#...#|#...#|.###.",
  V: "#...#|#...#|#...#|#...#|#...#|.#.#.|..#..",
  W: "#...#|#...#|#...#|#.#.#|#.#.#|##.##|#...#",
  X: "#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#",
  Y: "#...#|#...#|.#.#.|..#..|..#..|..#..|..#..",
  Z: "#####|....#|...#.|..#..|.#...|#....|#####",
  0: ".###.|#...#|#..##|#.#.#|##..#|#...#|.###.",
  1: "..#..|.##..|..#..|..#..|..#..|..#..|.###.",
  2: ".###.|#...#|....#|...#.|..#..|.#...|#####",
  3: "####.|....#|....#|.###.|....#|....#|####.",
  4: "...#.|..##.|.#.#.|#..#.|#####|...#.|...#.",
  5: "#####|#....|####.|....#|....#|#...#|.###.",
  6: ".###.|#...#|#....|####.|#...#|#...#|.###.",
  7: "#####|....#|...#.|..#..|.#...|.#...|.#...",
  8: ".###.|#...#|#...#|.###.|#...#|#...#|.###.",
  9: ".###.|#...#|#...#|.####|....#|#...#|.###.",
  " ": ".....|.....|.....|.....|.....|.....|.....",
  "/": "....#|....#|...#.|..#..|.#...|#....|#....",
  ".": ".....|.....|.....|.....|.....|.##..|.##..",
  "-": ".....|.....|.....|#####|.....|.....|.....",
  ",": ".....|.....|.....|.....|.##..|.##..|.#...",
  ":": ".....|.##..|.##..|.....|.##..|.##..|.....",
  "&": ".##..|#..#.|#.#..|.#...|#.#.#|#..#.|.##.#",
  "+": ".....|..#..|..#..|#####|..#..|..#..|.....",
  "!": "..#..|..#..|..#..|..#..|..#..|.....|..#..",
  "'": "..#..|..#..|.....|.....|.....|.....|.....",
  "*": ".....|#.#.#|.###.|#####|.###.|#.#.#|.....",
};

/** Parse the font table into per-glyph row bitmasks. */
const GLYPHS = new Map();
for (const [char, spec] of Object.entries(FONT)) {
  const rows = spec.split("|");
  GLYPHS.set(char, rows.map((row) => {
    let bits = 0;
    for (let x = 0; x < 5; x++) if (row[x] === "#") bits |= 1 << x;
    return bits;
  }));
}

// --- Raster canvas ----------------------------------------------------------

const pixels = new Uint8Array(WIDTH * HEIGHT * 3);
for (let i = 0; i < WIDTH * HEIGHT; i++) {
  pixels[i * 3] = BG[0];
  pixels[i * 3 + 1] = BG[1];
  pixels[i * 3 + 2] = BG[2];
}

function setPixel(x, y, [r, g, b], alpha = 1) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
  const i = (y * WIDTH + x) * 3;
  pixels[i] = Math.round(pixels[i] * (1 - alpha) + r * alpha);
  pixels[i + 1] = Math.round(pixels[i + 1] * (1 - alpha) + g * alpha);
  pixels[i + 2] = Math.round(pixels[i + 2] * (1 - alpha) + b * alpha);
}

function fillRect(x, y, w, h, color, alpha = 1) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) setPixel(x + dx, y + dy, color, alpha);
  }
}

/** Draw text at a given pixel scale. Returns the advance width. */
function drawText(text, x, y, scale, color, alpha = 1) {
  let cursor = x;
  for (const raw of text) {
    const char = raw.toUpperCase();
    const glyph = GLYPHS.get(char) ?? GLYPHS.get(" ");
    for (let row = 0; row < 7; row++) {
      const bits = glyph[row];
      for (let col = 0; col < 5; col++) {
        if (bits & (1 << col)) {
          fillRect(cursor + col * scale, y + row * scale, scale, scale, color, alpha);
        }
      }
    }
    cursor += 6 * scale;
  }
  return cursor - x;
}

function textWidth(text, scale) {
  return text.length * 6 * scale;
}

// --- Composition ------------------------------------------------------------

// Engineering grid backdrop.
for (let x = 0; x < WIDTH; x += 48) fillRect(x, 0, 1, HEIGHT, GRID, 0.85);
for (let y = 0; y < HEIGHT; y += 48) fillRect(0, y, WIDTH, 1, GRID, 0.85);

// Deterministic voxel skyline along the bottom edge.
let seed = 20240607;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
let sx = 0;
while (sx < WIDTH) {
  const w = 24 + Math.round(rand() * 52);
  // Capped so the skyline never rises into the capability row.
  const h = 12 + Math.round(rand() * 48);
  fillRect(sx, HEIGHT - h, w, h, ORANGE, 0.10 + rand() * 0.14);
  sx += w + 6;
}

// Status chip + wordmark.
fillRect(56, 56, 12, 12, GREEN);
drawText("ASISH ENGINEERING WORLD", 80, 55, 3, ORANGE);

// Identity.
drawText("ASISH OLIVER M", 56, 150, 11, WHITE);

drawText("MOTORSPORT SOFTWARE", 56, 262, 4, CYAN);
fillRect(56 + textWidth("MOTORSPORT SOFTWARE", 4) + 14, 278, 16, 3, FAINT);
drawText("AI / ML ENGINEER", 56 + textWidth("MOTORSPORT SOFTWARE", 4) + 44, 262, 4, YELLOW);

// Supporting statement, wrapped.
const statement = [
  "BUILDING SOFTWARE, SIMULATION, TELEMETRY AND",
  "INTELLIGENT SYSTEMS FOR ENGINEERING PROBLEMS.",
];
statement.forEach((line, i) => drawText(line, 56, 312 + i * 30, 2, MUTED));

// Telemetry trace across the lower third.
const traceTop = 396;
const traceHeight = 78;
const points = [];
for (let i = 0; i <= 1088; i += 4) {
  const t = i / 1088;
  const value =
    0.32 +
    Math.sin(t * Math.PI * 2.1) * 0.2 +
    Math.sin(t * Math.PI * 6.4) * 0.06 +
    t * 0.3;
  points.push([56 + i, traceTop + traceHeight - value * traceHeight * 1.55]);
}
for (const [x, y] of points) fillRect(x, Math.round(y), 4, 3, CYAN);
for (let i = 1; i < points.length; i++) {
  const [x0, y0] = points[i - 1];
  const [x1, y1] = points[i];
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let s = 0; s <= steps; s++) {
    fillRect(
      Math.round(x0 + ((x1 - x0) * s) / steps),
      Math.round(y0 + ((y1 - y0) * s) / steps),
      4,
      3,
      CYAN
    );
  }
}

// Capability row.
const caps = ["REAL-TIME TELEMETRY", "NUMERICAL SIMULATION", "APPLIED AI / ML"];
let capX = 56;
for (const cap of caps) {
  fillRect(capX, 556, 10, 10, GREEN);
  drawText(cap, capX + 20, 553, 2, FAINT);
  capX += 20 + textWidth(cap, 2) + 34;
}

// --- PNG encoding -----------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, crc]);
}

// Raw scanlines, each prefixed with filter type 0 (None).
const raw = Buffer.alloc((WIDTH * 3 + 1) * HEIGHT);
for (let y = 0; y < HEIGHT; y++) {
  const rowStart = y * (WIDTH * 3 + 1);
  raw[rowStart] = 0;
  Buffer.from(pixels.buffer, y * WIDTH * 3, WIDTH * 3).copy(raw, rowStart + 1);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // colour type: truecolour
ihdr[10] = 0; // deflate
ihdr[11] = 0; // adaptive filtering
ihdr[12] = 0; // no interlace

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "../public/og-image.png");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, png);

console.log(`Wrote ${outPath} (${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB)`);
/**
 * Generates Minecraft-inspired engineering favicon and app icons.
 * Zero external dependencies. Uses Node.js built-in zlib and fs.
 */

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

function createPng(width, height, pixelFn) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pixelStart = rowStart + 1 + x * 4;
      raw[pixelStart] = r;
      raw[pixelStart + 1] = g;
      raw[pixelStart + 2] = b;
      raw[pixelStart + 3] = a !== undefined ? a : 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // no interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// 32x32 Minecraft Voxel Block Icon
function getVoxelIconPixel(x, y, width, height) {
  // Border (2px)
  const isBorder = x < 2 || x >= width - 2 || y < 2 || y >= height - 2;
  const isInnerBorder = x === 2 || x === width - 3 || y === 2 || y === height - 3;

  if (isBorder) {
    return [0x18, 0x18, 0x1c, 255]; // Deep dark stone
  }
  if (isInnerBorder) {
    if (x === 2 || y === 2) return [0x52, 0x52, 0x5b, 255]; // Highlight
    return [0x27, 0x27, 0x2a, 255]; // Shadow
  }

  // Engineering Core: Papaya / Orange Voxel Center with Cyan telemetry pixel
  const cx = width / 2;
  const cy = height / 2;
  const dist = Math.hypot(x - cx, y - cy);

  if (dist < 4) {
    // Center cyan LED
    return [0x00, 0xd2, 0xbe, 255];
  } else if (dist < 5.5) {
    return [0x04, 0x72, 0x8c, 255];
  } else if ((x + y) % 3 === 0) {
    return [0xff, 0x8a, 0x1a, 255]; // Asish Orange highlight
  } else if ((x + y) % 3 === 1) {
    return [0xff, 0x80, 0x00, 255]; // Asish Orange primary
  } else {
    return [0xcc, 0x66, 0x00, 255]; // Asish Orange shadow
  }
}

// Generate PNG for 32x32 and 180x180
const png32 = createPng(32, 32, getVoxelIconPixel);
const png180 = createPng(180, 180, getVoxelIconPixel);

// Wrap 32x32 PNG in standard ICO container
function createIco(pngBuffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(1, 4); // Number of images

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // Width
  entry.writeUInt8(32, 1); // Height
  entry.writeUInt8(0, 2);  // Color count (0 = >=8bpp)
  entry.writeUInt8(0, 3);  // Reserved
  entry.writeUInt16LE(1, 4); // Planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // Image data size
  entry.writeUInt32LE(22, 12); // Offset to image data (6 + 16 = 22)

  return Buffer.concat([header, entry, pngBuffer]);
}

const ico = createIco(png32);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(resolve(root, "public/favicon.ico"), ico);
writeFileSync(resolve(root, "public/icon.png"), png32);
writeFileSync(resolve(root, "public/apple-touch-icon.png"), png180);
writeFileSync(resolve(root, "app/icon.png"), png32);
writeFileSync(resolve(root, "app/favicon.ico"), ico);

console.log("Successfully generated public/favicon.ico, app/icon.png, and public/apple-touch-icon.png!");


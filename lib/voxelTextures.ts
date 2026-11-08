import { chromeEra, chromeSurfaces } from "@/data/chromeEra";
import * as THREE from "three";

// Cache generated canvas textures so they are created only once
const textureCache = new Map<string, THREE.CanvasTexture>();

function createPixelCanvas(
  drawFn: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 16
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    // SSR fallback dummy
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

// Pseudo-random deterministic noise based on coordinates
function pseudoNoise(x: number, y: number, seed = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

export function getVoxelTexture(name: string): THREE.CanvasTexture {
  if (textureCache.has(name)) {
    return textureCache.get(name)!;
  }

  let tex: THREE.CanvasTexture;

  const surface = chromeSurfaces[name];
  if (surface) {
    const tex = createPixelCanvas((ctx,size)=>{
      ctx.fillStyle=surface.base;ctx.fillRect(0,0,size,size);
      for(let y=0;y<size;y++)for(let x=0;x<size;x++){
        const grain=pseudoNoise(x,y,43);ctx.fillStyle=grain>.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.06)';ctx.fillRect(x,y,1,1);
        if(surface.pattern==='carbon'){ctx.fillStyle=(Math.floor(x/2)+Math.floor(y/2))%2?'#1D2229':'#11151B';ctx.fillRect(x,y,1,1);}
      }
      if(surface.pattern==='metal'){ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(1,1,size-2,1);ctx.fillRect(1,6,size-2,1);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(0,size-1,size,1);ctx.fillRect(size-1,0,1,size);}
      if(surface.pattern==='floor'){ctx.fillStyle='#434A52';ctx.fillRect(0,0,size,1);ctx.fillRect(0,0,1,size);ctx.fillStyle='#A6ADB3';ctx.fillRect(2,2,1,1);ctx.fillRect(size-3,size-3,1,1);}
      if(surface.pattern==='light'){ctx.fillStyle=chromeEra.white;ctx.fillRect(1,1,size-2,size-2);}
      if(surface.pattern==='glass'){ctx.fillStyle='#87939D';ctx.fillRect(0,0,size,1);ctx.fillRect(0,0,1,size);}
    });
    tex.colorSpace=THREE.SRGBColorSpace;textureCache.set(name,tex);return tex;
  }

  switch (name) {
    case "grass_top":
      tex = createPixelCanvas((ctx, size) => {
        const greens = ["#4a8528", "#559c2f", "#3f7322", "#5fa835", "#447b25", "#508f2d"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 101) * greens.length);
            ctx.fillStyle = greens[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "grass_side":
      tex = createPixelCanvas((ctx, size) => {
        const dirtColors = ["#866043", "#724e35", "#5c3e29", "#946a4a", "#6b472e"];
        const grassColors = ["#4a8528", "#559c2f", "#3f7322", "#5fa835"];

        // Fill background dirt
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const dIdx = Math.floor(pseudoNoise(x, y, 202) * dirtColors.length);
            ctx.fillStyle = dirtColors[dIdx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }

        // Dripping grass top edge
        for (let x = 0; x < size; x++) {
          const depth = 2 + Math.floor(pseudoNoise(x, 0, 303) * 3); // 2 to 4 pixels deep
          for (let y = 0; y < depth; y++) {
            const gIdx = Math.floor(pseudoNoise(x, y, 404) * grassColors.length);
            ctx.fillStyle = grassColors[gIdx]!;
            ctx.fillRect(x, y, 1, 1);
          }
          // Occasional dangling blade
          if (pseudoNoise(x, 1, 505) > 0.6 && depth < size - 2) {
            ctx.fillStyle = grassColors[0]!;
            ctx.fillRect(x, depth, 1, 1);
          }
        }
      });
      break;

    case "dirt":
      tex = createPixelCanvas((ctx, size) => {
        const dirtColors = ["#866043", "#724e35", "#5c3e29", "#946a4a", "#6b472e", "#7b543a"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 606) * dirtColors.length);
            ctx.fillStyle = dirtColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "stone":
      tex = createPixelCanvas((ctx, size) => {
        const stoneColors = ["#7a7a7a", "#6e6e6e", "#888888", "#5e5e5e", "#737373", "#828282"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 707) * stoneColors.length);
            ctx.fillStyle = stoneColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "stone_bricks":
      tex = createPixelCanvas((ctx, size) => {
        ctx.fillStyle = "#737373";
        ctx.fillRect(0, 0, size, size);

        // Brick mortar lines
        ctx.fillStyle = "#4a4a4a";
        ctx.fillRect(0, 3, size, 1);
        ctx.fillRect(0, 7, size, 1);
        ctx.fillRect(0, 11, size, 1);
        ctx.fillRect(0, 15, size, 1);

        // Vertical joints
        ctx.fillRect(7, 0, 1, 3);
        ctx.fillRect(15, 0, 1, 3);
        ctx.fillRect(3, 4, 1, 3);
        ctx.fillRect(11, 4, 1, 3);
        ctx.fillRect(7, 8, 1, 3);
        ctx.fillRect(15, 8, 1, 3);
        ctx.fillRect(3, 12, 1, 3);
        ctx.fillRect(11, 12, 1, 3);

        // Subtle noise over bricks
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            if (ctx.fillStyle !== "#4a4a4a" && pseudoNoise(x, y, 808) > 0.65) {
              ctx.fillStyle = pseudoNoise(x, y, 809) > 0.5 ? "#828282" : "#656565";
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      });
      break;

    case "oak_planks":
      tex = createPixelCanvas((ctx, size) => {
        const plankColors = ["#a57547", "#b2804f", "#96683d", "#bc8a57", "#8d6037"];
        for (let y = 0; y < size; y++) {
          const plankRow = Math.floor(y / 4);
          for (let x = 0; x < size; x++) {
            const idx = Math.floor(pseudoNoise(x, plankRow, 909) * plankColors.length);
            ctx.fillStyle = plankColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Dark horizontal board seams
        ctx.fillStyle = "#5c3d20";
        ctx.fillRect(0, 3, size, 1);
        ctx.fillRect(0, 7, size, 1);
        ctx.fillRect(0, 11, size, 1);
        ctx.fillRect(0, 15, size, 1);

        // Subtle vertical nail accents
        ctx.fillStyle = "#472e16";
        ctx.fillRect(1, 1, 1, 1);
        ctx.fillRect(14, 1, 1, 1);
        ctx.fillRect(1, 5, 1, 1);
        ctx.fillRect(14, 5, 1, 1);
      });
      break;

    case "oak_log_side":
      tex = createPixelCanvas((ctx, size) => {
        const barkColors = ["#6b5233", "#5c4327", "#7a5e3c", "#4d361d", "#826541"];
        for (let x = 0; x < size; x++) {
          const colIdx = Math.floor(pseudoNoise(x, 0, 111) * barkColors.length);
          for (let y = 0; y < size; y++) {
            const noise = pseudoNoise(x, y, 222);
            ctx.fillStyle = noise > 0.7 ? "#432f18" : barkColors[colIdx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "oak_log_top":
      tex = createPixelCanvas((ctx, size) => {
        // Outer bark ring
        ctx.fillStyle = "#5c4327";
        ctx.fillRect(0, 0, size, size);

        // Wood ring inside
        ctx.fillStyle = "#a57547";
        ctx.fillRect(1, 1, size - 2, size - 2);

        // Concentric tree growth rings
        ctx.fillStyle = "#8a6138";
        ctx.fillRect(3, 3, size - 6, size - 6);
        ctx.fillStyle = "#a57547";
        ctx.fillRect(4, 4, size - 8, size - 8);
        ctx.fillStyle = "#6e4a27";
        ctx.fillRect(6, 6, size - 12, size - 12);
        ctx.fillStyle = "#96683d";
        ctx.fillRect(7, 7, 2, 2);
      });
      break;

    case "oak_leaves":
      tex = createPixelCanvas((ctx, size) => {
        const leafColors = ["#387320", "#458c27", "#2f611a", "#4ea32a", "#295416"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const noise = pseudoNoise(x, y, 333);
            if (noise < 0.18) {
              // Semi-transparent / cutout pixel for lush 3D leaves look
              ctx.clearRect(x, y, 1, 1);
            } else {
              const idx = Math.floor(pseudoNoise(x, y, 444) * leafColors.length);
              ctx.fillStyle = leafColors[idx]!;
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      });
      break;

    case "water":
      tex = createPixelCanvas((ctx, size) => {
        const waterColors = ["#2d68c4", "#3878dd", "#2355a3", "#4388ed", "#3170ce"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 555) * waterColors.length);
            ctx.fillStyle = waterColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Subtle soft wave ripples
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillRect(2, 4, 3, 1);
        ctx.fillRect(9, 11, 4, 1);
      });
      break;

    case "asphalt":
      tex = createPixelCanvas((ctx, size) => {
        const asphaltColors = ["#2a2b30", "#222327", "#32333a", "#1b1c20", "#2e2f36"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 666) * asphaltColors.length);
            ctx.fillStyle = asphaltColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "curb_red":
      tex = createPixelCanvas((ctx, size) => {
        const redColors = ["#d92626", "#e83535", "#c21f1f", "#f04343", "#ad1818"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 777) * redColors.length);
            ctx.fillStyle = redColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Subtle 3D top bevel
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(0, 0, size, 1);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, size - 1, size, 1);
      });
      break;

    case "curb_white":
      tex = createPixelCanvas((ctx, size) => {
        const whiteColors = ["#e9ecef", "#f8f9fa", "#dee2e6", "#f1f3f5", "#d8dce0"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 888) * whiteColors.length);
            ctx.fillStyle = whiteColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Subtle 3D bevel
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, 1);
        ctx.fillStyle = "#adb5bd";
        ctx.fillRect(0, size - 1, size, 1);
      });
      break;

    case "tire_black":
      tex = createPixelCanvas((ctx, size) => {
        const tireColors = ["#1a1a1e", "#141417", "#222228", "#111113"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 999) * tireColors.length);
            ctx.fillStyle = tireColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Tread grooves
        ctx.fillStyle = "#0a0a0c";
        ctx.fillRect(3, 0, 1, size);
        ctx.fillRect(7, 0, 1, size);
        ctx.fillRect(11, 0, 1, size);
      });
      break;

    case "glass":
      tex = createPixelCanvas((ctx, size) => {
        ctx.fillStyle = "rgba(180, 220, 255, 0.25)";
        ctx.fillRect(0, 0, size, size);

        // Frosted border
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillRect(0, 0, size, 1);
        ctx.fillRect(0, 0, 1, size);
        ctx.fillRect(size - 1, 0, 1, size);
        ctx.fillRect(0, size - 1, size, 1);

        // Diagonal glass reflection glint
        ctx.fillRect(2, 2, 2, 1);
        ctx.fillRect(4, 3, 2, 1);
        ctx.fillRect(6, 4, 2, 1);
        ctx.fillRect(8, 5, 2, 1);
      });
      break;

    case "glowstone":
      tex = createPixelCanvas((ctx, size) => {
        const glowColors = ["#fcc419", "#fab005", "#ffe066", "#ffd43b", "#f59f00", "#fff3bf"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 123) * glowColors.length);
            ctx.fillStyle = glowColors[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Dark iron border
        ctx.fillStyle = "#343a40";
        ctx.fillRect(0, 0, size, 1);
        ctx.fillRect(0, 0, 1, size);
        ctx.fillRect(size - 1, 0, 1, size);
        ctx.fillRect(0, size - 1, size, 1);
      });
      break;

    case "carbon_f1":
      tex = createPixelCanvas((ctx, size) => {
        // Carbon weave pattern
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const isAlt = (Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0;
            ctx.fillStyle = isAlt ? "#1c1c21" : "#121215";
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "asish_orange":
      tex = createPixelCanvas((ctx, size) => {
        // ASISH engineering park livery orange with subtle surface shading.
        const oranges = ["#ff8000", "#ff8a1a", "#ea6f00", "#ff8e1a", "#e06500", "#ff7300"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 2026) * oranges.length);
            ctx.fillStyle = oranges[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "asish_cyan":
      tex = createPixelCanvas((ctx, size) => {
        // ASISH aero cyan accent line, compatible with the existing palette.
        const cyans = ["#00d2be", "#22e0cd", "#00bfae", "#38bdf8", "#0ea5b8"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 2026) * cyans.length);
            ctx.fillStyle = cyans[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "monitor_screen":
      tex = createPixelCanvas((ctx, size) => {
        ctx.fillStyle = "#071224";
        ctx.fillRect(0, 0, size, size);

        // Green/cyan telemetry wave / code lines
        ctx.fillStyle = "#10b981";
        ctx.fillRect(2, 3, 7, 1);
        ctx.fillRect(2, 5, 11, 1);
        ctx.fillRect(2, 7, 5, 1);
        ctx.fillRect(2, 9, 12, 1);

        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(2, 11, 8, 1);
        ctx.fillRect(2, 13, 6, 1);

        // Outer dark monitor frame
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, size, 1);
        ctx.fillRect(0, 0, 1, size);
        ctx.fillRect(size - 1, 0, 1, size);
        ctx.fillRect(0, size - 1, size, 1);
      });
      break;

    case "pitch_grass_light":
      tex = createPixelCanvas((ctx, size) => {
        const greens = ["#4ca936", "#58ba41", "#429b30", "#63c64c", "#47a335"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 111) * greens.length);
            ctx.fillStyle = greens[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "pitch_grass_dark":
      tex = createPixelCanvas((ctx, size) => {
        const greens = ["#2d7a22", "#348928", "#26691d", "#3d9b2f", "#297220"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 222) * greens.length);
            ctx.fillStyle = greens[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "pitch_line":
      tex = createPixelCanvas((ctx, size) => {
        const whites = ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 333) * whites.length);
            ctx.fillStyle = whites[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "football_leather":
      tex = createPixelCanvas((ctx, size) => {
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(6, 6, 4, 4);
        ctx.fillRect(7, 5, 2, 6);
        ctx.fillRect(5, 7, 6, 2);
        ctx.fillRect(0, 0, 3, 2);
        ctx.fillRect(13, 0, 3, 2);
        ctx.fillRect(0, 14, 3, 2);
        ctx.fillRect(13, 14, 3, 2);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(3, 3, 3, 1);
        ctx.fillRect(10, 3, 3, 1);
        ctx.fillRect(3, 12, 3, 1);
        ctx.fillRect(10, 12, 3, 1);
      });
      break;

    case "avatar_graphite":
      tex = createPixelCanvas((ctx, size) => {
        const graphite = ["#2b2d31", "#1f2124", "#35383d", "#232528", "#3c3f44"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1010) * graphite.length);
            ctx.fillStyle = graphite[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "avatar_graphite_light":
      tex = createPixelCanvas((ctx, size) => {
        const light = ["#42454a", "#36393d", "#4c4f54", "#2e3135", "#54575c"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1020) * light.length);
            ctx.fillStyle = light[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "avatar_orange":
      tex = createPixelCanvas((ctx, size) => {
        const oranges = ["#ff7a00", "#ff8a1a", "#e67000", "#ff9433", "#cc6600"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1030) * oranges.length);
            ctx.fillStyle = oranges[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "avatar_cyan":
      tex = createPixelCanvas((ctx, size) => {
        const cyans = ["#0aa6c4", "#16c0e0", "#078a9f", "#22d3f0", "#04728c"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1040) * cyans.length);
            ctx.fillStyle = cyans[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      break;

    case "avatar_trousers":
      tex = createPixelCanvas((ctx, size) => {
        const trouser = ["#1b1d20", "#232529", "#16181b", "#2a2c30", "#111315"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1050) * trouser.length);
            ctx.fillStyle = trouser[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Subtle seam lines
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(3, 0, 1, size);
        ctx.fillRect(11, 0, 1, size);
      });
      break;

    case "avatar_boots":
      tex = createPixelCanvas((ctx, size) => {
        const boot = ["#1c1a17", "#2a2723", "#15130f", "#35312b", "#0f0e0c"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1060) * boot.length);
            ctx.fillStyle = boot[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Sole edge
        ctx.fillStyle = "#0a0907";
        ctx.fillRect(0, size - 2, size, 2);
      });
      break;

    case "avatar_skin":
      tex = createPixelCanvas((ctx, size) => {
        const skin = ["#e7b894", "#dba987", "#f0c2a3", "#d49a78", "#e0b08c"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1070) * skin.length);
            ctx.fillStyle = skin[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Subtle nose/mouth shadow pixel
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(6, 9, 4, 2);
      });
      break;

    case "avatar_headset":
      tex = createPixelCanvas((ctx, size) => {
        const headset = ["#0f1114", "#1a1d21", "#23272c", "#0a0c0f", "#30343a"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1080) * headset.length);
            ctx.fillStyle = headset[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Cyan mic indicator dot
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(12, 10, 2, 2);
      });
      break;

    case "avatar_tablet":
      tex = createPixelCanvas((ctx, size) => {
        const tablet = ["#1c1f24", "#282c32", "#14171b", "#30343b", "#0d1014"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1090) * tablet.length);
            ctx.fillStyle = tablet[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Screen border bezel
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, size, 1);
        ctx.fillRect(0, 0, 1, size);
        ctx.fillRect(size - 1, 0, 1, size);
        ctx.fillRect(0, size - 1, size, 1);
      });
      break;

    case "avatar_badge":
      tex = createPixelCanvas((ctx, size) => {
        // Dark engineering badge plate with subtle orange core
        ctx.fillStyle = "#22262b";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#474b51";
        ctx.fillRect(2, 2, size - 4, size - 4);
        ctx.fillStyle = "#ff7a00";
        ctx.fillRect(5, 5, size - 10, size - 10);
        // Small cyan tick
        ctx.fillStyle = "#12c2d6";
        ctx.fillRect(6, 6, 2, size - 12);
      });
      break;

    case "avatar_hair_dark":
      tex = createPixelCanvas((ctx, size) => {
        const hair = ["#17161c", "#211f27", "#2b2933", "#131217", "#32303c", "#1c1a21"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1085) * hair.length);
            ctx.fillStyle = hair[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Subtle highlight sweep across top
        ctx.fillStyle = "rgba(100, 105, 125, 0.22)";
        ctx.fillRect(2, 2, size - 4, 2);
      });
      break;

    case "avatar_dev_face":
      tex = createPixelCanvas((ctx, size) => {
        const skin = ["#e7b894", "#dba987", "#f0c2a3", "#d49a78", "#e0b08c"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1070) * skin.length);
            ctx.fillStyle = skin[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Confident Eyebrows
        ctx.fillStyle = "#1e1d24";
        ctx.fillRect(3, 4, 4, 1);
        ctx.fillRect(9, 4, 4, 1);
        // Eyes: White sclera
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(3, 6, 4, 3);
        ctx.fillRect(9, 6, 4, 3);
        // Irises & Pupils
        ctx.fillStyle = "#1a1612";
        ctx.fillRect(5, 6, 2, 3);
        ctx.fillRect(9, 6, 2, 3);
        // Papaya orange iris reflex
        ctx.fillStyle = "#ff7a00";
        ctx.fillRect(6, 8, 1, 1);
        ctx.fillRect(10, 8, 1, 1);
        // Pupil catchlight
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(5, 6, 1, 1);
        ctx.fillRect(9, 6, 1, 1);
        // Nose shadow
        ctx.fillStyle = "rgba(180, 110, 80, 0.45)";
        ctx.fillRect(7, 9, 2, 2);
        // Mouth smirk
        ctx.fillStyle = "#8a5840";
        ctx.fillRect(6, 12, 4, 1);
        ctx.fillRect(9, 11, 1, 1);
      });
      break;

    case "avatar_glasses":
      tex = createPixelCanvas((ctx, size) => {
        ctx.clearRect(0, 0, size, size);
        // Black acetate frames
        ctx.fillStyle = "#0c0d10";
        // Left rim
        ctx.fillRect(2, 4, 5, 1);
        ctx.fillRect(2, 8, 5, 1);
        ctx.fillRect(2, 4, 1, 5);
        ctx.fillRect(6, 4, 1, 5);
        // Right rim
        ctx.fillRect(9, 4, 5, 1);
        ctx.fillRect(9, 8, 5, 1);
        ctx.fillRect(9, 4, 1, 5);
        ctx.fillRect(13, 4, 1, 5);
        // Bridge
        ctx.fillRect(6, 5, 3, 1);
        // Anti-reflective blue/cyan lens tint
        ctx.fillStyle = "rgba(6, 182, 212, 0.4)";
        ctx.fillRect(3, 5, 3, 3);
        ctx.fillRect(10, 5, 3, 3);
        // Glare highlight diagonal
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fillRect(4, 5, 1, 1);
        ctx.fillRect(11, 5, 1, 1);
      });
      break;

    case "avatar_hoodie_dark":
      tex = createPixelCanvas((ctx, size) => {
        const hoodie = ["#18191d", "#22242a", "#141518", "#2a2d34", "#1d1f25"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1092) * hoodie.length);
            ctx.fillStyle = hoodie[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Subtle seams
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(0, size - 2, size, 2);
      });
      break;

    case "avatar_hoodie_back_print":
      tex = createPixelCanvas((ctx, size) => {
        // Base hoodie fabric
        const hoodie = ["#16171b", "#1f2126", "#121316", "#262830"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1095) * hoodie.length);
            ctx.fillStyle = hoodie[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Terminal window header bar
        ctx.fillStyle = "#2c2f37";
        ctx.fillRect(2, 2, size - 4, 2);
        ctx.fillStyle = "#ff5555";
        ctx.fillRect(3, 2, 1, 1);
        ctx.fillStyle = "#C8CDD2";
        ctx.fillRect(5, 2, 1, 1);
        ctx.fillStyle = "#50fa7b";
        ctx.fillRect(7, 2, 1, 1);

        // Terminal prompt ">_" in glowing cyan
        ctx.fillStyle = "#D71D35";
        ctx.fillRect(3, 6, 1, 3);
        ctx.fillRect(4, 7, 1, 1);
        ctx.fillRect(6, 8, 3, 1); // cursor underscore

        // "{ 47 }" developer logo in papaya orange
        ctx.fillStyle = "#ff7a00";
        // Left curly brace {
        ctx.fillRect(3, 11, 2, 1);
        ctx.fillRect(3, 12, 1, 1);
        ctx.fillRect(2, 13, 1, 1);
        ctx.fillRect(3, 14, 1, 1);
        ctx.fillRect(3, 15, 2, 1);
        // "47"
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(6, 11, 1, 3);
        ctx.fillRect(7, 13, 2, 1);
        ctx.fillRect(8, 11, 1, 5); // 4
        ctx.fillRect(10, 11, 3, 1);
        ctx.fillRect(12, 12, 1, 2);
        ctx.fillRect(11, 14, 1, 2); // 7
        // Right curly brace }
        ctx.fillStyle = "#ff7a00";
        ctx.fillRect(14, 11, 2, 1);
        ctx.fillRect(14, 12, 1, 1);
        ctx.fillRect(15, 13, 1, 1);
        ctx.fillRect(14, 14, 1, 1);
        ctx.fillRect(14, 15, 2, 1);
      });
      break;

    case "avatar_backpack":
      tex = createPixelCanvas((ctx, size) => {
        // Carbon-weave tech fabric
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const isWeave = (x + y) % 2 === 0;
            ctx.fillStyle = isWeave ? "#1e2126" : "#131518";
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Vertical utility webbing straps
        ctx.fillStyle = "#0c0d10";
        ctx.fillRect(3, 0, 2, size);
        ctx.fillRect(11, 0, 2, size);
        // Papaya carabiner clip
        ctx.fillStyle = "#ff7a00";
        ctx.fillRect(3, 10, 2, 2);
      });
      break;

    case "avatar_backpack_glow":
      tex = createPixelCanvas((ctx, size) => {
        // Status LED bar background
        ctx.fillStyle = "#081b26";
        ctx.fillRect(0, 0, size, size);
        // Active glowing cyan LED segments
        ctx.fillStyle = "#D71D35";
        ctx.fillRect(1, 2, 3, size - 4);
        ctx.fillRect(5, 2, 3, size - 4);
        ctx.fillRect(9, 2, 3, size - 4);
        // Last segment dim
        ctx.fillStyle = "#0369a1";
        ctx.fillRect(13, 2, 2, size - 4);
      });
      break;

    case "avatar_smartwatch":
      tex = createPixelCanvas((ctx, size) => {
        // Matte black chassis
        ctx.fillStyle = "#0a0c0f";
        ctx.fillRect(0, 0, size, size);
        // AMOLED bezel
        ctx.fillStyle = "#11141a";
        ctx.fillRect(2, 2, size - 4, size - 4);
        // Cyan telemetry waveform & digital clock
        ctx.fillStyle = "#D71D35";
        ctx.fillRect(3, 4, 3, 1);
        ctx.fillRect(7, 4, 3, 1);
        // Pulse line
        ctx.fillRect(3, 8, 2, 1);
        ctx.fillRect(5, 7, 1, 3);
        ctx.fillRect(6, 6, 1, 4);
        ctx.fillRect(7, 8, 2, 1);
        ctx.fillRect(9, 9, 1, 2);
        ctx.fillRect(10, 8, 3, 1);
      });
      break;

    case "avatar_sneaker_sole":
      tex = createPixelCanvas((ctx, size) => {
        // Clean white chunky runner midsole
        const white = ["#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1105) * white.length);
            ctx.fillStyle = white[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Papaya orange air cushion pod in heel
        ctx.fillStyle = "#ff7a00";
        ctx.fillRect(1, 4, 5, 6);
        ctx.fillStyle = "#ffa94d";
        ctx.fillRect(2, 5, 3, 4);
        // Bottom rubber grip tread
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, size - 3, size, 3);
      });
      break;

    case "avatar_sneaker_upper":
      tex = createPixelCanvas((ctx, size) => {
        // Dark breathable tech mesh
        const mesh = ["#181a1f", "#21242c", "#121417", "#2a2e38"];
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const idx = Math.floor(pseudoNoise(x, y, 1110) * mesh.length);
            ctx.fillStyle = mesh[idx]!;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        // Racing dynamic diagonal stripes
        ctx.fillStyle = "#ff7a00";
        ctx.fillRect(4, 2, 2, 4);
        ctx.fillRect(5, 5, 2, 4);
        // Cyan lace loops
        ctx.fillStyle = "#D71D35";
        ctx.fillRect(8, 2, 2, 1);
        ctx.fillRect(8, 5, 2, 1);
        ctx.fillRect(8, 8, 2, 1);
      });
      break;

    default:
      tex = createPixelCanvas((ctx, size) => {
        ctx.fillStyle = "#7a7a7a";
        ctx.fillRect(0, 0, size, size);
      });
      break;
  }

  textureCache.set(name, tex);
  return tex;
}

// Helper to construct standard voxel materials with NearestFilter textures
const materialCache = new Map<string, THREE.MeshStandardMaterial>();

export function getVoxelMaterial(name: string, extraProps: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  const key = `${name}_${JSON.stringify(extraProps)}`;
  if (materialCache.has(key)) {
    return materialCache.get(key)!;
  }

  const texture = getVoxelTexture(name);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: chromeSurfaces[name]?.roughness ?? 0.9,
    metalness: chromeSurfaces[name]?.metalness ?? 0.1,
    ...(name === "chrome_light" ? {emissive:new THREE.Color(chromeEra.white),emissiveIntensity:0.8}:{}),
    ...(name === "chrome_glass" ? {transparent:true,opacity:0.4}:{}),
    ...extraProps,
  });

  materialCache.set(key, mat);
  return mat;
}

// Multi-material for classic Minecraft grass block (Y+ = grass_top, Y- = dirt, sides = grass_side)
let grassBlockMaterials: THREE.MeshStandardMaterial[] | null = null;

export function getGrassBlockMaterials(): THREE.MeshStandardMaterial[] {
  if (grassBlockMaterials) return grassBlockMaterials;

  const top = getVoxelMaterial("grass_top");
  const side = getVoxelMaterial("grass_side");
  const bottom = getVoxelMaterial("dirt");

  // BoxGeometry material order: 0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z, 5: -Z
  grassBlockMaterials = [side, side, top, bottom, side, side];
  return grassBlockMaterials;
}

// Multi-material for oak log block (Y+, Y- = log_top, sides = log_side)
let oakLogMaterials: THREE.MeshStandardMaterial[] | null = null;

export function getOakLogMaterials(): THREE.MeshStandardMaterial[] {
  if (oakLogMaterials) return oakLogMaterials;

  const top = getVoxelMaterial("oak_log_top");
  const side = getVoxelMaterial("oak_log_side");

  oakLogMaterials = [side, side, top, top, side, side];
  return oakLogMaterials;
}

/**
 * Creates or retrieves a cached Minecraft-style wooden sign texture with crisp pixel typography.
 */
export function createVoxelSignTexture(title: string, subtitle: string): THREE.CanvasTexture {
  const cacheKey = `sign_${title}_${subtitle}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle=chromeEra.carbon;ctx.fillRect(0,0,512,128);
  ctx.fillStyle=chromeEra.metal;ctx.fillRect(3,3,506,122);
  ctx.fillStyle=chromeEra.graphite;ctx.fillRect(6,6,500,116);
  ctx.fillStyle=chromeEra.red;ctx.fillRect(8,8,7,112);
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=chromeEra.white;ctx.font='bold 25px monospace';ctx.fillText(title,264,44,470);
  ctx.fillStyle=chromeEra.silver;ctx.font='bold 16px monospace';ctx.fillText(subtitle,264,84,470);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  textureCache.set(cacheKey, texture);
  return texture;
}

export function getVoxelSignMaterial(title: string, subtitle: string): THREE.MeshStandardMaterial {
  const key = `sign:${title}:${subtitle}`;
  const cached = materialCache.get(key);
  if(cached) return cached;
  const tex = createVoxelSignTexture(title, subtitle);
  const material = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.9,
    metalness: 0.05,
  });
  materialCache.set(key, material);
  return material;
}


/**
 * Creates or retrieves a cached EA FC Ultimate Team style gold card texture.
 */
export function createEAFCCardTexture(): THREE.CanvasTexture {
  const cacheKey = "eafc_gold_card";
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;

  // 1. Dark gold metallic background with shield contour
  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, "#eab308"); // Vibrant gold
  grad.addColorStop(0.3, "#ca8a04");
  grad.addColorStop(0.7, "#713f12");
  grad.addColorStop(1, "#1c1917");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Border frame
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, 480, 736);

  // Subtle inner geometric diamond pattern
  ctx.strokeStyle = "rgba(254, 240, 138, 0.15)";
  ctx.lineWidth = 2;
  for (let y = 40; y < 700; y += 40) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(482, y);
    ctx.stroke();
  }

  // 2. Rating & Position
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 96px sans-serif";
  ctx.fillText("91", 45, 140);
  ctx.font = "bold 44px sans-serif";
  ctx.fillStyle = "#fef08a";
  ctx.fillText("ST", 45, 195);

  // Nation & Club badge voxel marks
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(45, 220, 48, 16);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(45, 236, 48, 16);

  // 3. Player Vector Archetype Silhouette
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(330, 190, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(220, 360);
  ctx.lineTo(330, 260);
  ctx.lineTo(440, 360);
  ctx.closePath();
  ctx.fill();

  // 4. Name Banner
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(30, 370, 452, 64);
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 370, 452, 64);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText("A. OLIVER", 256, 416);

  // 5. Attributes Grid (2 Columns)
  ctx.textAlign = "left";
  const statYStart = 485;
  const col1X = 65;
  const col2X = 290;

  const stats = [
    { num: "89", label: "PAC", col: 1, row: 0 },
    { num: "92", label: "DRI", col: 2, row: 0 },
    { num: "94", label: "SHO", col: 1, row: 1 },
    { num: "48", label: "DEF", col: 2, row: 1 },
    { num: "88", label: "PAS", col: 1, row: 2 },
    { num: "86", label: "PHY", col: 2, row: 2 },
  ];

  ctx.font = "bold 34px sans-serif";
  stats.forEach((s) => {
    const x = s.col === 1 ? col1X : col2X;
    const y = statYStart + s.row * 50;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(s.num, x, y);
    ctx.fillStyle = "#fef08a";
    ctx.fillText(s.label, x + 58, y);
  });

  // 6. Vector Radar Footprint (6-axis polygon)
  const radarCx = 256;
  const radarCy = 650;
  const radarR = 55;
  ctx.strokeStyle = "rgba(254, 240, 138, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const rx = radarCx + Math.cos(angle) * radarR;
    const ry = radarCy + Math.sin(angle) * radarR;
    if (i === 0) ctx.moveTo(rx, ry);
    else ctx.lineTo(rx, ry);
  }
  ctx.closePath();
  ctx.stroke();

  // Radar fill (128D embedding vector projection)
  ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
  ctx.beginPath();
  const values = [0.89, 0.92, 0.48, 0.86, 0.88, 0.94];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const dist = radarR * values[i]!;
    const rx = radarCx + Math.cos(angle) * dist;
    const ry = radarCy + Math.sin(angle) * dist;
    if (i === 0) ctx.moveTo(rx, ry);
    else ctx.lineTo(rx, ry);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Bottom EA SPORTS FC Bar
  ctx.fillStyle = "#09090b";
  ctx.fillRect(30, 715, 452, 30);
  ctx.fillStyle = "#10b981";
  ctx.textAlign = "center";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("EA SPORTS FC // VECTOR INTELLIGENCE", 256, 735);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  textureCache.set(cacheKey, texture);
  return texture;
}

export function getEAFCCardMaterial(): THREE.MeshStandardMaterial {
  const tex = createEAFCCardTexture();
  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.25,
    metalness: 0.65,
    emissive: new THREE.Color("#ca8a04"),
    emissiveIntensity: 0.35,
  });
}

/**
 * Creates or retrieves a stadium perimeter pitch-side LED ribbon texture.
 */
export function createEAFCLedTexture(): THREE.CanvasTexture {
  const cacheKey = "eafc_led_ribbon";
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, 512, 64);

  // Top and bottom glowing neon lines
  ctx.fillStyle = "#10b981";
  ctx.fillRect(0, 0, 512, 4);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(0, 60, 512, 4);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 20px monospace";
  ctx.fillText("EA SPORTS FC ◆ VECTOR SCOUTING ENGINE ◆ 128D EMBEDDINGS", 256, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  textureCache.set(cacheKey, texture);
  return texture;
}

export function getEAFCLedMaterial(): THREE.MeshStandardMaterial {
  const tex = createEAFCLedTexture();
  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.2,
    metalness: 0.1,
    emissive: new THREE.Color("#10b981"),
    emissiveIntensity: 0.6,
  });
}

/**
 * Explicit GPU Resource Lifecycle cleanup.
 * Disposes all cached CanvasTextures and MeshStandardMaterials.
 */
export function disposeAllVoxelResources(): void {
  // Dispose all cached materials
  materialCache.forEach((material) => {
    material.dispose();
  });
  materialCache.clear();

  // Dispose all cached textures
  textureCache.forEach((texture) => {
    texture.dispose();
  });
  textureCache.clear();

  grassBlockMaterials = null;
  oakLogMaterials = null;
}


# FRONTIER VOXEL DESIGN SYSTEM: ORIGINAL TEXTURE LIBRARY
**Standard:** 100% Vector SVG Embedded Pixel Art (Zero External Dependencies)  
**Stylesheet:** `styles/voxel-materials.css`  
**License:** Original MIT Engineering Assets (No Mojang AB Copyright Infringement)  

---

## 1. Architectural Strategy

Modern web applications that attempt "Minecraft" or "retro" themes often commit one of three critical errors:
1. Copying proprietary Mojang texture PNGs (legal / licensing hazard).
2. Using heavy bitmap images that blur on high-DPI displays or create multiple HTTP roundtrips.
3. Using generic flat CSS gradients that look like SaaS web products.

The Frontier Voxel Design System eliminates all three hazards by engineering **8 original procedural pixel materials** written directly as base64/URL-encoded SVGs with `shape-rendering="crispEdges"` and `image-rendering: pixelated`.

---

## 2. The 8 Original Pixel Materials

### 2.1 Deepslate Matrix (`.voxel-mat-deepslate`)
- **Visual Description:** Dense, dark carbon bedrock (`#101115` base) with micro-fracture noise (`#15171e`, `#0d0e12`, `#1c202a`).
- **Resolution:** 16x16 pixel repeat pattern.
- **Primary Use:** Terminal backgrounds, page canvas, telemetry graph backdrops.

### 2.2 Industrial Dark Iron (`.voxel-mat-iron`)
- **Visual Description:** Machined cast iron plates (`#262A31`) with high-contrast corner studs and chamfered edges (`#414750` / `#16181D`).
- **Resolution:** 16x16 pixel repeat pattern.
- **Primary Use:** Primary cards, interactive consoles, project dossiers.

### 2.3 Polished Chrome (`.voxel-mat-chrome`)
- **Visual Description:** High-reflectance metallic plating (`#8A9199`) with diagonal specular reflection streaks (`#C8CDD2`, `#E8EBED`).
- **Resolution:** 16x16 pixel repeat pattern.
- **Primary Use:** Verification badges, selected tab indicator, high-grade achievement frames.

### 2.4 Dark Copper Conduit (`.voxel-mat-copper`)
- **Visual Description:** Warm oxidised industrial copper (`#3d261e`) with burnished highlights (`#6e3d2c`, `#8f533a`).
- **Resolution:** 16x16 pixel repeat pattern.
- **Primary Use:** Electrical engineering conduits, pipeline nodes, hardware bus diagrams.

### 2.5 Redstone Circuit Board (`.voxel-mat-redstone`)
- **Visual Description:** Dark insulated PCB substrate (`#1a0d0d`) with illuminated redstone trace conduits (`#9e1b1b`, `#e02424`, `#ff4d4d`).
- **Resolution:** 16x16 pixel repeat pattern.
- **Primary Use:** Systems Forge graph canvas, fault injector panels, live execution tracing.

### 2.6 Technical Blueprint (`.voxel-mat-blueprint`)
- **Visual Description:** Deep cobalt cyan engineering schematic (`#09182b`) with 16px technical grid intersections (`#143257`, `#1f4f8a`).
- **Resolution:** 16x16 pixel repeat pattern.
- **Primary Use:** Mathematical formulations, architecture DAG views, case study blueprints.

### 2.7 Reinforced Glass (`.voxel-mat-glass`)
- **Visual Description:** Industrial laminated visor with subtle specular reflections (`rgba(255,255,255,0.06)`) and dark framing.
- **Resolution:** 16x16 pixel repeat pattern.
- **Primary Use:** Transparent modal overlays, telemetry sensor visors.

### 2.8 Voxel Carbon Composite (`.voxel-mat-carbon`)
- **Visual Description:** High-strength woven carbon-fiber chassis pattern (`#191B20`) with alternating micro-squares (`#22262E`, `#13151A`).
- **Resolution:** 8x8 pixel repeat pattern.
- **Primary Use:** Motorsport chassis views, F1 lap analysis panels, command decks.


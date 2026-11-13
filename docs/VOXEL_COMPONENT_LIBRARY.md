# FRONTIER VOXEL DESIGN SYSTEM: COMPONENT LIBRARY
**Standard:** 14 Reusable React Primitives for Industrial Voxel UI  
**Directory:** `components/ui/voxel/`  
**Barrel Export:** `components/ui/voxel/index.ts`  

---

## 1. Component Suite Overview

The primitive suite provides a complete, accessible, typed, and performant design foundation:

```
components/ui/voxel/
├── VoxelPanel.tsx          # Multi-material beveled industrial panel
├── VoxelButton.tsx         # Tactile mechanical button with 2px depression physics
├── VoxelCard.tsx           # Corner-accented pixel-framed content container
├── VoxelInventorySlot.tsx  # Grid-based item/skill socket with rarity bevels
├── VoxelWorkbench.tsx      # Multi-stage interactive workbench surface
├── VoxelMissionBoard.tsx   # Mission selector with category headers
├── VoxelBlueprintPanel.tsx # Technical schematic with cyan coordinate grid
├── VoxelStatusLamp.tsx     # Redstone / cyan / emerald illuminated LED
├── VoxelTabs.tsx           # Mechanical tab switcher with physical depression
├── VoxelTerminal.tsx       # Terminal emulator with CRT scanline filter
├── VoxelDataScreen.tsx     # High-contrast numerical telemetry display
├── VoxelBadge.tsx          # Hard-edged pixel badge supporting 5 semantic colorways
├── VoxelModal.tsx          # Focus-trapped accessible dialog with Minecraft frame
└── icons/VoxelIcons.tsx    # 9 bespoke SVG pixel-art engineering icons
```

---

## 2. Component Specifications

### 2.1 `VoxelPanel`
- **Props:**
  - `material`: `"deepslate" | "iron" | "chrome" | "copper" | "redstone" | "blueprint" | "glass" | "carbon"` (default: `"iron"`)
  - `title?`: string
  - `titleLamp?`: `"off" | "redstone" | "cyan" | "emerald" | "amber"`
  - `actions?`: ReactNode
  - `beveled?`: boolean (default: `true`)
- **Key Behavior:** Renders an industrial top titlebar with corner fasteners and status lamp, wrapping content in an isolated contrast layer.

### 2.2 `VoxelButton`
- **Props:**
  - `variant`: `"stone" | "gold" | "emerald" | "cyan" | "redstone"`
  - `size`: `"sm" | "md" | "lg"`
  - `fullWidth?`: boolean
- **Key Behavior:** Implements authentic physical depression on `:active` (`transform: translate(2px, 2px)`), swapping top highlight and bottom shadow borders instantaneously without triggering layout recalculations.

### 2.3 `VoxelCard`
- **Props:**
  - `material`: material token string
  - `cornerAccents?`: boolean (renders pixel corner brackets)
- **Key Behavior:** Self-contained item or dossier card with subtle border inset.

### 2.4 `VoxelInventorySlot`
- **Props:**
  - `domain`: `"motorsport" | "ai-ml" | "systems" | "simulation" | "data" | "game"`
  - `rarity`: `"common" | "uncommon" | "rare" | "epic"`
  - `count?`: number
  - `active?`: boolean
- **Key Behavior:** Renders an inset Minecraft inventory square (40x40px base) with item count badge at bottom right and domain rarity frame.

### 2.5 `VoxelStatusLamp`
- **Props:**
  - `state`: `"off" | "redstone" | "cyan" | "emerald" | "amber"`
  - `pulse?`: boolean
- **Key Behavior:** Hardware status LED with glowing CSS box-shadow and optional harmonic pulse animation.

### 2.6 `VoxelDataScreen`
- **Props:**
  - `variant`: `"telemetry" | "terminal" | "amber"`
- **Key Behavior:** Flat black or dark slate inset display with subtle CRT scanline gradient overlay, preserving maximum font legibility for high-frequency numerical data.

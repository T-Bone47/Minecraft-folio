# FRONTIER VOXEL DESIGN SYSTEM: BASELINE AUDIT
**Branch:** `feat/frontier-voxel-design-system`  
**Base Commit:** `f7bc950`  
**Date:** 2026-11-13  
**Auditor:** Frontier Engineering & Voxel Art Direction Team  

---

## 1. Executive Summary

This audit establishes the baseline visual state of **ASISH: THE ENGINEERING FRONTIER** prior to the complete Voxel Design System transformation. 

While the portfolio possesses authentic Minecraft 3D elements in the WebGL world, a voxel navigation bar, and foundational utilities (`.mc-gui-box`, `.mc-btn-stone`, `.font-pixel`), multiple core 2D routes have drifted into standard SaaS web design conventions (rounded cards, pill badges, generic dark dashboards). 

The goal of the **FRONTIER VOXEL DESIGN SYSTEM** is to achieve:
**ONE WORLD. ONE DESIGN LANGUAGE. ONE ENGINEERING UNIVERSE.**
Every page, terminal, modal, card, and button must feel like an authentic industrial voxel engineering workstation belonging to the same Minecraft-inspired universe.

---

## 2. Existing Visual Assets & Classes

### 2.1 CSS Utility Classes in `app/globals.css`
| Class | Category | Current Appearance | Assessment |
|---|---|---|---|
| `.font-pixel` | Typography | `Press Start 2P`, -0.05em tracking | High authenticity, best for headers/labels |
| `.font-silkscreen` | Typography | `Silkscreen`, monospace | High readability for intermediate tags |
| `.technical-grid-bg` | Background | SVG Deepslate pixel tile + ambient glow | Strong foundation, needs material expansion |
| `.mc-dirt-bg` | Background | 16x16 pixel dirt tile with dark vignette | Authentic title/pause wallpaper |
| `.mc-stonebrick-bg` | Background | 16x16 pixel stonebrick tile | Classic industrial stone |
| `.mc-gui-box` | Container | 3px beveled gray border with dark fill | Foundational voxel frame, needs material tokens |
| `.mc-slot-box` | Container | Inset black slot container | Effective for inventory-style data |
| `.mc-btn-stone` | Button | Stone beveled 3D button with inset shadows | Tactile mechanical feel |
| `.mc-btn-gold` | Button | Golden/orange beveled action button | Strong primary CTA |
| `.mc-btn-emerald` | Button | Emerald green beveled button | Recruiter/success CTA |
| `.mc-btn-cyan` | Button | Cyan beveled telemetry button | Systems CTA |
| `.mc-text-shadow` | Typography | `2px 2px 0px #000000` | Classic voxel shadow |

### 2.2 Inconsistencies & Visual Drift Identified Across Pages

#### 1. Frontier Multiverse (`/multiverse`)
- **Current Issue:** Uses large conventional rounded cards (`rounded-2xl`, `rounded-xl`, `bg-slate-900/60`, `border-slate-800`), generic pill tags (`rounded-full`), and standard SaaS layouts.
- **Voxel Target:** Transform into **The Multiverse Engineering Portal Archive** — hard-edged pixel-framed terminal consoles with domain emblems, status lamps, mechanical bezels, and inventory technology chips.

#### 2. Frontier RoleForge (`/roleforge`)
- **Current Issue:** Resembles an enterprise dark-mode web application (`rounded-full` pills, `rounded-xl` cards, generic tab bars).
- **Voxel Target:** Transform into **The Engineering Skill Forge** — interactive engineering workbench with blueprint cards, technical terminal input panels, inventory-inspired skill slots, and mechanical mission compiler.

#### 3. Engineering Experiences (`/experience`)
- **Current Issue:** Conventional web card layout (`rounded-2xl` headers, `rounded-xl` showcase cards).
- **Voxel Target:** Transform into **The Engineering Mission Board** — illuminated mission panels, pixel category emblems, duration badges, and blueprint-framed Engineering Proof Inspector.

#### 4. Engineering Systems Archive (`/work`)
- **Current Issue:** While utilizing `mc-gui-box`, filter buttons and table sections need higher fidelity material framing (Dark Iron, Machine Steel, Blueprint grids).

#### 5. Homepage (`/`)
- **Current Issue:** Hero and navigation have strong voxel branding, but sections below drift into standard web containers.

---

## 3. The New Voxel Design System Roadmap

1. **Foundations (`styles/`):**
   - `styles/voxel-tokens.css`: Core material colors (Deepslate, Carbon Stone, Dark Iron, Machine Steel, Chrome, Bright Iron, Racing Red, Redstone Signal, Telemetry Cyan, Engineering Green, Gold Circuit).
   - `styles/voxel-materials.css`: 8 original pixel materials (Deepslate, Industrial Iron, Polished Chrome, Dark Copper, Redstone Circuit Board, Technical Blueprint, Reinforced Glass, Voxel Carbon).
   - `styles/voxel-components.css`: Mechanical button bevels, inventory slot insets, panel framing, status lamps, data screens.

2. **Primitive Component Suite (`components/ui/voxel/`):**
   - `VoxelPanel`: Multi-material beveled panel with industrial titlebar.
   - `VoxelButton`: Tactile mechanical button with physical 2px depression.
   - `VoxelCard`: Pixel-framed content container with corner highlights.
   - `VoxelInventorySlot`: Grid-based item/skill slot with rarity/domain borders.
   - `VoxelWorkbench`: Multi-stage interactive workbench surface.
   - `VoxelMissionBoard`: Interactive mission selector with status indicators.
   - `VoxelBlueprintPanel`: Engineering schematic surface with technical grids.
   - `VoxelStatusLamp`: Redstone/emerald/cyan illuminated status indicator.
   - `VoxelTabs`: Mechanical tab switcher.
   - `VoxelTerminal`: Command-line/log viewer with CRT scanline effect.
   - `VoxelDataScreen`: Telemetry and numerical readout panel.
   - `VoxelIcons`: Coherent original SVG pixel-art engineering icons.

3. **Page Redesigns:**
   - Multiverse Hub (`/multiverse`) & Portals
   - RoleForge Compiler (`/roleforge`) & Defense Arena
   - Engineering Experiences (`/experience`) & Proof Inspector
   - Homepage (`/`) & Canonical Work Archive (`/work`)
   - Systems Forge (`/forge`), ProofCast (`/proofcast`), Live Pulse (`/observatory`)
   - 3D In-World HUD alignment


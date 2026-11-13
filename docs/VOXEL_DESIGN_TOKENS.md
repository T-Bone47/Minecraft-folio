# FRONTIER VOXEL DESIGN SYSTEM: DESIGN TOKENS SPECIFICATION
**Standard:** Industrial Minecraft Engineering Tokens  
**Stylesheet:** `styles/voxel-tokens.css`  
**Root Scope:** `:root` & `[data-theme="voxel"]`  

---

## 1. Material Tokens

The material tokens define the core industrial structural surfaces across the portfolio:

| CSS Variable | Value | Description |
|---|---|---|
| `--vx-mat-deepslate` | `#101115` | Deep carbon substratum; bedrock for terminals & charts |
| `--vx-mat-carbon` | `#191B20` | High-strength carbon composite; primary panel surface |
| `--vx-mat-dark-iron` | `#262A31` | Cast iron chassis; card borders & section dividers |
| `--vx-mat-steel` | `#414750` | Machine steel; mid-tone borders & inactive slots |
| `--vx-mat-chrome` | `#C8CDD2` | High-reflectance chrome; highlights and badge text |
| `--vx-mat-bright-iron` | `#E8EBED` | Surface specular highlight on top-left borders |

---

## 2. Engineering Signal Tokens

Signal tokens convey operational state, telemetry frequency, and verification status:

| CSS Variable | Value | Description | Semantic Role |
|---|---|---|---|
| `--vx-signal-racing-red` | `#E10600` | F1 Motorsport Red | High-priority telemetry, active circuit lap |
| `--vx-signal-redstone` | `#FF2400` | Redstone Signal | Logic gate active, fault injection, compile clock |
| `--vx-signal-cyan` | `#00D2BE` | Telemetry Cyan | 60 Hz physics loop, telemetry stream active |
| `--vx-signal-green` | `#00D26A` | Emerald Verification | Formally verified metrics, zero-fault audit |
| `--vx-signal-gold` | `#FFAA00` | Golden Circuit | Primary CTA, advancements, key milestones |

---

## 3. Physical Border & Bevel Tokens

Authentic Minecraft mechanical surfaces use directional light reflection (top/left bright, bottom/right shadowed):

| CSS Variable | Value | Physical Effect |
|---|---|---|
| `--vx-bevel-panel` | `inset 2px 2px 0px rgba(255,255,255,0.15), inset -2px -2px 0px rgba(0,0,0,0.6)` | Raised extruded panel |
| `--vx-bevel-slot` | `inset 2px 2px 0px rgba(0,0,0,0.8), inset -1px -1px 0px rgba(255,255,255,0.08)` | Inset recessed socket |
| `--vx-bevel-button` | `inset 2px 2px 0px rgba(255,255,255,0.25), inset -2px -2px 0px rgba(0,0,0,0.5)` | Tactile extruded button |
| `--vx-bevel-button-active` | `inset 2px 2px 0px rgba(0,0,0,0.7), inset -1px -1px 0px rgba(255,255,255,0.1)` | Physically depressed button |

---

## 4. Typography & Spatial Grid Tokens

| CSS Variable | Value | Usage |
|---|---|---|
| `--vx-font-pixel` | `'Press Start 2P', monospace` | Headers, section labels, hardware status |
| `--vx-font-mono` | `'JetBrains Mono', 'Fira Code', monospace` | Technical descriptions, formulas, telemetry readouts |
| `--vx-font-silkscreen` | `'Silkscreen', monospace` | Compact tags, coordinate numbers, pinouts |
| `--vx-grid-base` | `4px` | Fundamental micro-grid unit |
| `--vx-grid-slot` | `40px` | Standard inventory socket dimension (36px + 4px border) |

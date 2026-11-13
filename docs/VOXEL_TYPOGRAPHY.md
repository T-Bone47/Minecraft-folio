# FRONTIER VOXEL DESIGN SYSTEM: TYPOGRAPHY SPECIFICATION
**Standard:** Dual-Layer Hierarchical Pixel & Monospace Typography  
**Stylesheet:** `styles/voxel-tokens.css` & `app/globals.css`  

---

## 1. Typographic Strategy

Authentic Minecraft aesthetic relies on bold pixel headers (`Press Start 2P`), but rendering long-form engineering text, mathematical proofs, or technical dossiers in `Press Start 2P` induces severe ocular fatigue and degrades readability.

The Frontier Voxel Design System enforces a **strict dual-layer typographic hierarchy**:
1. **Layer 1: Structural & Hardware Typography (`Press Start 2P`)**:
   - Page headers, facility titles, advancement names, mechanical button labels, status lamp indicators.
   - Character tracking: `-0.05em`.
   - Visual styling: `mc-text-shadow` (`2px 2px 0px #000000`).
2. **Layer 2: Monospace Engineering Typography (`JetBrains Mono`, `Silkscreen`, `Fira Code`)**:
   - Technical descriptions, mathematical derivations, telemetry data streams, architecture pipelines, source file paths.
   - High legibility, crisp character distinction (`0` vs `O`, `1` vs `l`).
   - Line height: `1.6` for long-form engineering explanations.

---

## 2. Type Scale & Utility Classes

| Class | Font Family | Size | Tracking | Drop Shadow | Intended Role |
|---|---|---|---|---|---|
| `.font-pixel` | `Press Start 2P` | 8px - 32px | `-0.05em` | `2px 2px 0 #000` | Major titles, section headings, mechanical buttons |
| `.font-silkscreen` | `Silkscreen` | 10px - 14px | `0` | None | Intermediate tags, coordinate readouts, badges |
| `font-mono` | `JetBrains Mono` | 10px - 14px | `0` | None | Code snippets, telemetry fields, case study prose |
| `.mc-text-shadow` | Any | — | — | `2px 2px 0 #000` | Default high-contrast dark drop-shadow |
| `.mc-text-shadow-gold` | Any | — | — | `2px 2px 0 #4a2800`| Warm drop shadow for advancements & achievements |

---

## 3. High-Density Text Insets

When long paragraphs must be displayed within heavily textured panels, the text is never rendered directly over raw procedural pixel backgrounds. Instead, it is housed within a **contrast isolation container**:
- `.mc-slot-box`: Recessed black / slate inset with 1px dark border and 3px padding.
- `.voxel-data-screen`: Flat CRT-style display surface with 100% background opacity.
- `.voxel-panel-inset`: Deepslate inner surface with subtle dark inner shadow.

This guarantees **WCAG 2.2 AA compliance (>= 4.5:1 contrast)** at all viewport sizes.

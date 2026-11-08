# Chrome Era visual audit and transformation checklist

Before: existing palette combines papaya/cyan car paint, stone-brick industrial shells, wooden workstation surfaces, amber lanterns and multicolour emissive accents. Original cockpit, five audience routes, fitted ML, repaired pipeline and vehicle lap are functional; material work must not alter their inputs, transforms, collision footprints or mission state.

Capture script: `scripts/qa-chrome-captures.mjs`, stage `before`/`after`, 1280×800, medium preset. Original source/candidate images are recorded under `docs/screenshots/chrome-before-*`; earlier release screenshots provide additional functional context.

| Visual system | Implemented role-specific transformation | Preserved |
| --- | --- | --- |
| Vehicle exterior | Polished silver body, red highlights, carbon equipment, original insignia | Fixed-step state, wheel positions, entry/exit and gates |
| Cockpit | Graphite, metallic controls, restrained red and warm-white display | True camera, steering animation and authoritative channels |
| Garage | Silver shell, graphite fixtures, rectangular white work lights, red fascia/cables/cabinets | Existing walls/entrance bounds, workstation interactions |
| Plaza/circuit | Silver landmark, red wayfinding, asphalt/white-red kerbs, original pit signage | Track radius and lap logic, walkable routes |
| Tower/labs/HQ | Shared metal surfaces with distinct functional interiors | Live station results and project associations |
| Avatar/NPC | White/silver engineering uniform, red trim, black trousers | Original identity, proportions and animations |
| Terrain/sky | Retain natural grass, trees and water; neutral lighting on metal | Terrain/collision agreement and quality profiles |
| UI/professional routes | Graphite panels, bright text, silver borders, red brand accents | Status colours, semantic links, focus and fallback |

No historical photo, sponsor logo or driver likeness is introduced. Playable car is a clearly labeled modernised Chrome Era variant, not an exact 2008 replica. Existing unused team-branded photo remains excluded from CLI uploads.

Completed: shared metal/grain/carbon/floor/glass library; silver/red original car and cockpit; garage lights, tiled floor, cabinets, cables and branding; plaza canopy; grid, barriers, marshal post and compact grandstand; six facility shells; uniforms/tools; professional UI and social preview. Day, sunset and night are captured in the browser. HQ's visible ground-floor walls now derive from its canonical collision bounds, exposing the existing east doorway and placing the timeline and contact terminal along that route. No vehicle or mission state changes were needed.

Actual screenshots led to corrections for colour balance, sign gamma, an occluded garage sign, a blocking AI display and path lamp, stale cinematic waypoints and solid lab/HQ meshes hiding the canonical entrances. All lab/HQ ground floors now share FacilityWalls and keep glass/signs clear of doorways. Final walking checks proceed into each room rather than stopping at its threshold. See CHROME_ERA_BROWSER_QA.md for the gallery, regression results and remaining limits.

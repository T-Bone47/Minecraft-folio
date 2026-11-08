# Voxel materials and lighting

`data/chromeEra.ts` is the shared palette and surface-role registry. Its CSS variable map is rendered on the root HTML element; `app/chrome-era.css` consumes it. Industrial assets request explicit `chrome_polished`, `chrome_brushed`, `chrome_graphite`, `chrome_red`, `chrome_carbon`, `chrome_floor`, `chrome_light` and `chrome_glass` roles. Natural terrain, skin/hair, sport pitch colours and meaningful data/status channels remain independent.

Textures are original deterministic 16×16 CanvasTextures with nearest filtering: metal has stepped grain/highlight edges, carbon has a small weave, flooring has seams/bolts, and painted red has restrained pixel variation. Standard PBR materials use roughness 0.24–0.68 and metalness appropriate to each role. No custom per-pixel shader, dynamic reflection probe or external HDR is used.

`ChromeEnvironment` bakes an original neutral soft-box RoomEnvironment once at size 128. PMREM, room and target resources have explicit cleanup. Night lowers environment intensity; day has neutral bounce so silver does not inherit the former green under-roof tint. Existing sun/hemisphere lighting, day/sunset/night, quality overrides and realtime point-light limits (0 low/mobile, 3 medium, 6 high) remain.

Garage floor tiles are instanced in one draw call; outer barriers are instanced in one draw call. Existing circuit surfaces stay instanced. The flat terrain band widens to provide visual runoff; renderer and player still sample the same terrain function, and the vehicle radius/checkpoint rules are unchanged. Garage floor and static car/equipment are lifted together to meet the actual walking surface rather than leaving grass over the old floor.

FacilityWalls renders the labs' and HQ's ground-floor canonical collision rectangles, leaving their existing doorways open. The metal floors sit 0.03 blocks above the terrain to avoid coplanar flicker. Doorway glass/signs are split or lifted clear of walking sightlines; the AI wings are physical workstations. HQ career panels and its terminal face the east entry; decorative upper floors remain outside the traversal scope. The compact circuit grandstand adds static shared-metal geometry without another light or reflective probe.

Transparent technical glass, emissive white work panels and restrained red trim provide the workshop identity. No bloom or realtime mirror reflections were introduced. Mirrors are simple material surfaces, not physically accurate reflected views. See the Chrome Era QA report for measured post-change costs and limits.

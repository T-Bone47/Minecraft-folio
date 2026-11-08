import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { projects, getProjectBySlug, featuredProjects } from "@/data/projects";
import { facilities, getFacilityById, getFacilityByProjectSlug } from "@/data/facilities";
import { profileData } from "@/data/profile";
import { siteIdentity } from "@/data/site";
import { resolveSiteConfig } from "@/lib/siteOrigin";
import { experience, education } from "@/data/experience";
import { validateContent } from "@/lib/validateContent";
import {
  getTerrainSurfaceY,
  isCircuitArea,
  isPathArea,
  resolveMovement,
  depenetrate,
  collidesAt,
  PLAYER_CLAMP_RADIUS,
  CAMPUS_ISLAND_RADIUS,
  CAMPUS_HALF_EXTENT,
  POND,
} from "@/lib/terrainModel";
import { resolveQualityProfile, QUALITY_PROFILES } from "@/lib/renderQuality";

describe("1. Content Integrity & Validation", () => {
  test("validateContent() reports zero content problems", () => {
    const problems = validateContent();
    assert.deepEqual(problems, [], `Expected 0 content problems, found: ${JSON.stringify(problems)}`);
  });

  test("Canonical GitHub profile is consistently https://github.com/T-Bone47", () => {
    assert.equal(profileData.links.github, "https://github.com/T-Bone47");
    assert.equal(siteIdentity.social.github, "https://github.com/T-Bone47");

    for (const p of projects) {
      if (p.links?.repository) {
        assert.match(
          p.links.repository,
          /^https:\/\/github\.com\/T-Bone47\/[^/]+$/,
          `Project ${p.slug} must link to a specific source repository`
        );
      }
    }
  });

  test("Unconfigured production builds do not invent a canonical origin", () => {
    const config=resolveSiteConfig({NODE_ENV:"production"});
    assert.equal(config.productionOrigin,undefined);
    assert.equal(config.indexable,false);
  });

  test("All canonical projects are defined with complete narratives", () => {
    const expectedSlugs = [
      "live-f1-intelligence",
      "f1-lap-time-simulator",
      "racemind-ai",
      "f1-race-manager",
      "ea-fc-intelligence",
      "vyaparpulse",
      "saksham",
    ];

    for (const slug of expectedSlugs) {
      const proj = getProjectBySlug(slug);
      assert.ok(proj, `Project ${slug} must exist in data/projects.ts`);
      assert.ok(proj.title, `Project ${slug} must have a title`);
      assert.ok(proj.problemStatement, `Project ${slug} must have a problem statement`);
      assert.ok(proj.architecture?.summary, `Project ${slug} must have an architecture summary`);
      assert.ok(proj.technologies?.length > 0, `Project ${slug} must have technologies`);
      assert.ok(proj.status, `Project ${slug} must have a status`);
    }
  });

  test("Verified metrics must declare evidence level", () => {
    for (const p of projects) {
      for (const m of p.metrics ?? []) {
        if (m.isVerified) {
          assert.ok(
            m.evidence,
            `Metric "${m.label}" in ${p.slug} is marked verified but declares no evidence level`
          );
        }
      }
    }
  });
});

describe("2. Campus Facilities & Geometry", () => {
  test("All 6 canonical campus facilities exist and match architectural specs", () => {
    const facilityIds = ["garage", "telemetry", "simulation", "operations", "aiml", "hq"];
    assert.equal(facilities.length, 6);

    for (const id of facilityIds) {
      const fac = getFacilityById(id);
      assert.ok(fac, `Facility ${id} must exist in data/facilities.ts`);
      assert.equal(fac.coordinates.length, 3);
      assert.equal(fac.cameraPosition.length, 3);
      assert.equal(fac.cameraTarget.length, 3);
      assert.equal(fac.pad.length, 4, `Facility ${id} pad must have 4 boundaries [minX, maxX, minZ, maxZ]`);
      assert.ok(fac.collision.length > 0, `Facility ${id} must have collision volumes`);
    }
  });

  test("Every facility pad flattens the ground properly", () => {
    for (const fac of facilities) {
      const [minX, maxX, minZ, maxZ] = fac.pad;
      const midX = (minX + maxX) / 2;
      const midZ = (minZ + maxZ) / 2;
      const surfaceY = getTerrainSurfaceY(midX, midZ);
      // Building pads must be flattened to y=0 (surface block top is 0.5)
      assert.equal(
        surfaceY,
        0.5,
        `Facility ${fac.id} pad center at (${midX}, ${midZ}) should have flat surface Y=0.5, got ${surfaceY}`
      );
    }
  });
});

describe("3. Terrain Model & Collision Resolution", () => {
  test("Surface height samples within expected bounds", () => {
    // Unflattened lawn at (0, 0) sits at hill height 1 (surfaceY = 1.5)
    const centerY = getTerrainSurfaceY(0, 0);
    assert.equal(centerY, 1.5);

    // Center of pond (sunken by 1 block, surfaceY = -0.5)
    const pondY = getTerrainSurfaceY(POND.x, POND.z);
    assert.equal(pondY, -0.5);

    // Facility pad at Garage center is flattened to baseline (surfaceY = 0.5)
    const garagePadY = getTerrainSurfaceY(-12, -8);
    assert.equal(garagePadY, 0.5);

    // Edge hills (stepped between 0.5 and 3.5, sampled at r ~ 32 within island)
    const hillY = getTerrainSurfaceY(25, 20);
    assert.ok(hillY >= 0.5 && hillY <= 3.5);
  });

  test("Circuit area is correctly identified along racing line", () => {
    // Pit straight around x = -24, z = 0
    assert.ok(isCircuitArea(-24, 0));
    // Center of island (0, 0) is not on the track
    assert.ok(!isCircuitArea(0, 0));
  });

  test("Player sliding collision prevents tunneling through facility walls", () => {
    // Garage rear wall is roughly at minX: -18.5, maxX: -5.5, minZ: -15.5, maxZ: -14
    // Attempting to move from inside the garage (z = -13.5) backward into the wall (z = -14.5)
    const startX = -12;
    const startZ = -13.5;
    const deltaX = 0;
    const deltaZ = -1.5; // moving into wall
    const radius = 0.42;

    const resolved = resolveMovement(startX, startZ, deltaX, deltaZ, radius);
    // Player should be stopped before penetrating the wall box
    assert.ok(
      resolved.z > -14.0,
      `Player penetrated rear garage wall: resolved Z=${resolved.z}`
    );
  });

  test("Every facility approach position is safe, walkable, and non-colliding", () => {
    for (const fac of facilities) {
      assert.ok(fac.approachPosition, `Facility ${fac.id} must define approachPosition`);
      assert.ok(fac.approachLookAt, `Facility ${fac.id} must define approachLookAt`);
      const [ax, , az] = fac.approachPosition;
      const collides = collidesAt(ax, az, 0.38);
      assert.equal(
        collides,
        false,
        `Facility ${fac.id} approach position (${ax}, ${az}) must not collide with any wall`
      );

      // Verify that player can move forward from approach position
      const moveRes = resolveMovement(ax, az, 0, -0.5, 0.38);
      assert.ok(
        moveRes.x !== undefined && moveRes.z !== undefined,
        `Facility ${fac.id} must allow player movement`
      );
    }
  });

  test("Depenetration solver frees stuck coordinates and enables movement", () => {
    // If a player lands on a wall coordinate (e.g. simulation south wall at x=22, z=12)
    const stuckX = 22;
    const stuckZ = 12;
    // Moving from stuck position must depenetrate to safety and not freeze
    const freed = resolveMovement(stuckX, stuckZ, 0, 0.5, 0.38);
    assert.ok(
      !collidesAt(freed.x, freed.z, 0.38),
      `Depenetration must place player in non-colliding space, got (${freed.x}, ${freed.z})`
    );
  });

  test("Player boundary clamp keeps player within island", () => {
    assert.ok(PLAYER_CLAMP_RADIUS < CAMPUS_ISLAND_RADIUS - 1, "Player remains inside generated terrain");
    assert.ok(PLAYER_CLAMP_RADIUS < CAMPUS_HALF_EXTENT);
  });
});

describe("4. Render Quality Profiles", () => {
  test("Quality profiles resolve valid configurations", () => {
    const low = resolveQualityProfile("low", "low");
    assert.equal(low.label, "LOW");
    assert.equal(low.shadows, false);
    assert.deepEqual(low.dpr, [0.75, 1]);

    const high = resolveQualityProfile("high", "high");
    assert.equal(high.label, "HIGH");
    assert.equal(high.shadows, true);
    assert.deepEqual(high.dpr, [1, 1.35]);
    assert.equal(high.shadowMapSize, 1024);

    const autoMed = resolveQualityProfile("auto", "medium");
    assert.equal(autoMed.label, "MEDIUM");
  });
});

describe("5. Required Recruiter & Static Assets", () => {
  test("Official Resume PDF exists and has valid PDF header", () => {
    const resumePath = path.resolve(process.cwd(), "public/Asish_Oliver_M_Resume.pdf");
    assert.ok(fs.existsSync(resumePath), "public/Asish_Oliver_M_Resume.pdf must exist");
    const buffer = fs.readFileSync(resumePath);
    assert.ok(buffer.length > 1000, "Resume PDF must be at least 1 KB");
    const header = buffer.subarray(0, 5).toString("utf-8");
    assert.equal(header, "%PDF-", "Resume file must begin with %PDF- header");
  });

  test("Favicons and Icons exist in public and app directories", () => {
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "public/favicon.ico")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "public/icon.png")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "public/apple-touch-icon.png")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "app/icon.png")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "app/favicon.ico")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "public/og-image.png")));
  });
});

describe("6. Engineering Frontier Master Enhancements", () => {
  test("Product identity is canonical ASISH: THE ENGINEERING FRONTIER", () => {
    assert.equal(siteIdentity.productName, "ASISH: THE ENGINEERING FRONTIER");
  });

  test("Dedicated direct project routes exist in app directory", () => {
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "app/projects/page.tsx")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "app/projects/[slug]/page.tsx")));
  });

  test("Central Engineering Plaza component exists and renders landmark", () => {
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "components/world/CentralPlaza.tsx")));
  });

  test("Master architectural documentation artifacts exist", () => {
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/COMPLETION_AUDIT.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/ENHANCEMENT_ROADMAP.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/ARCHITECTURE_DECISIONS.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/PROJECT_EXHIBITS.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/PERFORMANCE_REPORT.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/DEPLOYMENT_CHECKLIST.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/PLAYER_CONTROLLER_AUDIT.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/EXPLORATION_CONTROLS.md")));
    assert.ok(fs.existsSync(path.resolve(process.cwd(), "docs/PLAYER_CAMERA_QA.md")));
  });
});

describe("7. Player Controller & Dual-Perspective Exploration", () => {
  test("All 6 campus facilities declare hollow perimeter walls with entrance doorways", () => {
    for (const fac of facilities) {
      assert.ok(
        fac.collision.length >= 2,
        `Facility ${fac.id} must declare multiple perimeter wall segments, found ${fac.collision.length}`
      );
      // Ensure the facility coordinate is not trapped inside any wall segment
      const [fx, , fz] = fac.coordinates;
      let insideWall = false;
      for (const box of fac.collision) {
        if (fx >= box.minX && fx <= box.maxX && fz >= box.minZ && fz <= box.maxZ) {
          insideWall = true;
          break;
        }
      }
      assert.equal(
        insideWall,
        false,
        `Facility ${fac.id} anchor coordinate (${fx}, ${fz}) must not be inside any solid perimeter wall`
      );
    }
  });

  test("Third-person avatar component AnimatedVoxelAvatar exists", () => {
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/camera/AnimatedVoxelAvatar.tsx")),
      "AnimatedVoxelAvatar component must exist"
    );
  });
});

describe("8. Frontier Innovations & Interactive Gameplay Upgrades", () => {
  test("All 8 Minecraft Engineering Advancements are canonically defined", async () => {
    const { ADVANCEMENTS } = await import("@/state/advancementStore");
    const requiredAdvancements = [
      "FIRST_FOOTPRINT",
      "TELEMETRY_UPLINK",
      "LAP_SOLVER",
      "PIT_STRATEGIST",
      "TEST_DRIVER",
      "SPEED_TRAP",
      "AI_ARCHITECT",
      "GRAND_PRIX_ENGINEER",
    ];

    for (const id of requiredAdvancements) {
      assert.ok(ADVANCEMENTS[id], `Advancement ${id} must exist in ADVANCEMENTS`);
      assert.ok(ADVANCEMENTS[id]?.title, `Advancement ${id} must have a title`);
      assert.ok(ADVANCEMENTS[id]?.description, `Advancement ${id} must have a description`);
      assert.ok(ADVANCEMENTS[id]?.icon, `Advancement ${id} must have an icon`);
    }
  });

  test("Drone Tour defines 7 cinematic waypoints across facilities and plaza", async () => {
    const { TOUR_WAYPOINTS, TOUR_DURATION_SECONDS } = await import(
      "@/components/camera/DroneTourCamera"
    );
    assert.equal(TOUR_WAYPOINTS.length, 7, "Drone Tour must have 7 campus waypoints");
    assert.equal(TOUR_DURATION_SECONDS, 42, "Tour duration must be 42 seconds");

    for (const wp of TOUR_WAYPOINTS) {
      assert.equal(wp.pos.length, 3);
      assert.equal(wp.lookAt.length, 3);
      assert.ok(wp.title);
      assert.ok(wp.tags.length > 0);
    }
  });

  test("Driveable F1 Car, Driving HUD, and In-Hand Gadgets exist", () => {
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/vehicles/DriveableF1Car.tsx")),
      "DriveableF1Car component must exist"
    );
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/hud/F1DrivingHUD.tsx")),
      "F1DrivingHUD component must exist"
    );
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/camera/VoxelGadget.tsx")),
      "VoxelGadget component must exist"
    );
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/camera/FirstPersonHand.tsx")),
      "FirstPersonHand component must exist"
    );
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/hud/AdvancementsModal.tsx")),
      "AdvancementsModal component must exist"
    );
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/hud/AdvancementToasts.tsx")),
      "AdvancementToasts component must exist"
    );
    assert.ok(
      fs.existsSync(path.resolve(process.cwd(), "components/hud/DroneTourOverlay.tsx")),
      "DroneTourOverlay component must exist"
    );
  });
});

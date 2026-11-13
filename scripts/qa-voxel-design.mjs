/**
 * QA VOXEL DESIGN SYSTEM
 * Automated visual regression, layout verification, and multi-device screenshot capture.
 */

import { launchBrowser, qaBaseURL } from './qa-browser.mjs';
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || qaBaseURL || "http://localhost:3005";
const SCREENSHOT_DIR = path.resolve(process.cwd(), "docs/screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 375, height: 667 },
];

const ROUTES = [
  { path: "/", name: "homepage" },
  { path: "/work", name: "work-archive" },
  { path: "/multiverse", name: "multiverse-portal" },
  { path: "/roleforge", name: "roleforge-workbench" },
  { path: "/experience", name: "experience-board" },
  { path: "/forge", name: "systems-forge" },
  { path: "/proofcast", name: "proofcast-player" },
  { path: "/observatory", name: "live-pulse" },
];

async function runVoxelQA() {
  console.log(`Starting Voxel Design System QA on ${BASE_URL}...`);
  const browser = await launchBrowser({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--mute-audio"],
  });

  const page = await browser.newPage();
  const results = {
    timestamp: new Date().toISOString(),
    routesChecked: 0,
    screenshotsCaptured: 0,
    errors: [],
  };

  try {
    for (const route of ROUTES) {
      console.log(`Checking route: ${route.path} (${route.name})...`);
      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(`${BASE_URL}${route.path}`, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });

        // Verify key accessibility / voxel elements exist
        const hasVoxelElements = await page.evaluate(() => {
          const panels = document.querySelectorAll(".voxel-panel, .mc-gui-box, .mc-slot-box, .voxel-card");
          return panels.length > 0;
        });

        if (!hasVoxelElements) {
          results.errors.push(`Route ${route.path} missing voxel elements on ${vp.name}`);
        }

        // Capture screenshot for desktop and mobile
        if (vp.name === "desktop" || vp.name === "mobile") {
          const filename = `voxel-${route.name}-${vp.name}.png`;
          const filepath = path.join(SCREENSHOT_DIR, filename);
          await page.screenshot({ path: filepath, fullPage: false });
          results.screenshotsCaptured++;
          console.log(`  Saved screenshot: ${filename}`);
        }
      }
      results.routesChecked++;
    }

    console.log("Voxel QA completed successfully!");
    console.log(`Routes checked: ${results.routesChecked}`);
    console.log(`Screenshots captured: ${results.screenshotsCaptured}`);
    console.log(`Errors encountered: ${results.errors.length}`);

    fs.writeFileSync(
      path.resolve(process.cwd(), "docs/voxel-qa-report.json"),
      JSON.stringify(results, null, 2)
    );
  } catch (err) {
    console.error("Voxel QA failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runVoxelQA();

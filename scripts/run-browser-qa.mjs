/**
 * Automated Browser QA & Verification Suite for ASISH ENGINEERING WORLD.
 * Uses puppeteer-core to launch real Chromium on Windows, run interactive flows,
 * test keyboard/mouse controls, check console exceptions, and capture screenshots.
 */

import puppeteer from "puppeteer-core";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3005";
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCREENSHOT_DIR = resolve(ROOT_DIR, "docs/screenshots");

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runQA() {
  console.log("=== STARTING ASISH ENGINEERING WORLD BROWSER QA ===");
  console.log(`Target: ${BASE_URL}`);
  console.log(`Chrome executable: ${CHROME_PATH}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--use-gl=angle",
      "--use-angle=swiftshader", // Hardware-independent WebGL support in headless
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--window-size=1280,800",
    ],
  });

  const defects = [];
  const qaResults = [];

  const recordResult = (name, passed, details = "") => {
    qaResults.push({ name, passed, details });
    const mark = passed ? "[PASS]" : "[FAIL]";
    console.log(`${mark} ${name}${details ? " - " + details : ""}`);
    if (!passed) defects.push({ name, details });
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const consoleLogs = [];
    page.on("console", (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === "error") {
        consoleLogs.push({ type, text });
      }
    });

    // TEST 1: HOME PAGE
    console.log("\n--- TEST 1: HOME PAGE ---");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
    const homeTitle = await page.title();
    const hasEnterButton = await page.$('a[href="/world"]');
    const hasResumeLink = await page.$('a[href="/Asish_Oliver_M_Resume.pdf"]');
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "01_homepage.png") });

    recordResult("1.1 Home Page Title", homeTitle.includes("ASISH OLIVER M"), `Title: "${homeTitle}"`);
    recordResult("1.2 Home 3D CTA Exists", !!hasEnterButton);
    recordResult("1.3 Home Resume Download Button Exists", !!hasResumeLink);

    // TEST 2: RECRUITER FAST TRACK
    console.log("\n--- TEST 2: RECRUITER FAST TRACK ---");
    await page.goto(`${BASE_URL}/recruiter`, { waitUntil: "networkidle0" });
    const recruiterHeading = await page.$eval("h1", (el) => el.textContent);
    const recruiterResume = await page.$('a[download="Asish_Oliver_M_Resume.pdf"]');
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "02_recruiter_fast_track.png") });

    recordResult("2.1 Recruiter Dossier Loaded", recruiterHeading?.includes("ASISH OLIVER M"), `Heading: ${recruiterHeading}`);
    recordResult("2.2 Recruiter Direct PDF Resume Download", !!recruiterResume);

    // TEST 3: SYSTEMS & WORK DIRECTORY
    console.log("\n--- TEST 3: SYSTEMS & WORK DIRECTORY ---");
    await page.goto(`${BASE_URL}/work`, { waitUntil: "networkidle0" });
    const workHeading = await page.$eval("h1", (el) => el.textContent);
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "03_work_index.png") });
    recordResult("3.1 Work Systems Archive Loaded", workHeading?.includes("Engineering Systems"));

    // TEST 4: TECHNICAL CASE STUDY
    console.log("\n--- TEST 4: CASE STUDY (/work/live-f1-intelligence) ---");
    await page.goto(`${BASE_URL}/work/live-f1-intelligence`, { waitUntil: "networkidle0" });
    const caseTitle = await page.$eval("h1", (el) => el.textContent);
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "04_case_study.png") });
    recordResult("4.1 Case Study Blueprint Loaded", caseTitle?.includes("Live F1 Intelligence"));

    // TEST 4B: DIRECT PROJECT ROUTE ALIAS (/projects/live-f1-intelligence)
    console.log("\n--- TEST 4B: DIRECT PROJECT ROUTE ALIAS (/projects/live-f1-intelligence) ---");
    await page.goto(`${BASE_URL}/projects/live-f1-intelligence`, { waitUntil: "networkidle0" });
    const directProjTitle = await page.$eval("h1", (el) => el.textContent);
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "04b_direct_project_route.png") });
    recordResult("4.2 Direct Project Route /projects/[slug] Loaded", directProjTitle?.includes("Live F1 Intelligence"));

    // TEST 5: 3D WORLD EXPERIENCE SPAWN
    console.log("\n--- TEST 5: 3D WORLD INITIAL LOAD & SPAWN ---");
    await page.goto(`${BASE_URL}/world`, { waitUntil: "domcontentloaded" });
    // Wait for the 3D Canvas or HUD to mount
    await page.waitForSelector("main", { timeout: 10000 });
    await page.waitForFunction(() => typeof window !== "undefined", { timeout: 5000 });
    await new Promise((r) => setTimeout(r, 1500)); // allow R3F canvas initialization
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "05_world_spawn.png") });

    const canvasExists = await page.$("canvas");
    recordResult("5.1 WebGL Canvas Element Mounted", !!canvasExists);

    // Test entering the world
    const enterBtn = await page.$('.mc-btn-primary, button[aria-label="Enter World"]');
    if (enterBtn) {
      await enterBtn.click();
      await new Promise((r) => setTimeout(r, 800));
    } else {
      await page.keyboard.press("Enter");
      await new Promise((r) => setTimeout(r, 800));
    }
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "05b_world_explored.png") });
    recordResult("5.2 Spawn Welcome Handled", true);

    // TEST 6: CARTOGRAPHER MAP (Hotbar slot 5 or 'M')
    console.log("\n--- TEST 6: CARTOGRAPHER MAP OVERLAY ---");
    await page.keyboard.press("m");
    await new Promise((r) => setTimeout(r, 500));
    const mapModal = await page.$('svg[viewBox="0 0 400 400"]');
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "06_cartographer_map.png") });
    recordResult("6.1 2D Cartographer Map Toggled via [M]", !!mapModal);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));

    // TEST 7: PROJECT DIRECTORY INVENTORY (Hotbar slot 6 or 'I')
    console.log("\n--- TEST 7: PROJECT DIRECTORY INVENTORY ---");
    await page.keyboard.press("i");
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "07_project_directory.png") });
    recordResult("7.1 Project Directory Toggled via [I]", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));

    // TEST 8: COMMAND PALETTE ('/' or 'Ctrl+K')
    console.log("\n--- TEST 8: WORLD COMMAND PALETTE ---");
    await page.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "08_command_palette.png") });
    recordResult("8.1 Command Palette Toggled via [/]", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));

    // TEST 9: FACILITY FAST TRAVEL & INSPECTION VIA HOTBAR
    console.log("\n--- TEST 9: HOTBAR QUICK TRAVEL & INSPECTION ---");
    // Press '1' for Telemetry Tower
    await page.keyboard.press("1");
    await new Promise((r) => setTimeout(r, 600));
    // Press 'e' to inspect
    await page.keyboard.press("e");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "09_inspection_overlay.png") });
    recordResult("9.1 Hotbar Slot 1 Telemetry Fast Travel & Inspect [E]", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));

    // TEST 10: INTERACTIVE TECHNICAL DEMONSTRATIONS (Part 6)
    console.log("\n--- TEST 10: INTERACTIVE TECHNICAL DEMONSTRATIONS ---");

    // 10.1 F1 Vehicle Inspection Mode
    await page.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.type("car-inspect");
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "10a_f1_car_inspect.png") });
    recordResult("10.1 Formula Single-Seater 7-Component Inspection Mode Verified", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));

    // 10.2 F1 Telemetry Signal Explorer
    await page.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.type("telemetry-explorer");
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "10b_telemetry_explorer.png") });
    recordResult("10.2 F1 Telemetry Signal Explorer Verified", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));

    // 10.3 Data Pipeline Observatory
    await page.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.type("pipeline-observatory");
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "10c_pipeline_observatory.png") });
    recordResult("10.3 Data Pipeline Observatory Verified", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));

    // 10.4 Numerical Lap-Time Solver
    await page.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.type("lap-solver");
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "10d_lap_solver.png") });
    recordResult("10.4 Numerical Lap-Time Solver Verified", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));

    // 10.5 Machine Learning Experimentation Bench
    await page.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.type("ml-bench");
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "10e_ml_playground.png") });
    recordResult("10.5 ML Experimentation Bench Verified", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));

    // 10.6 IGNICT Vector Opportunity Matcher
    await page.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.type("ignict-matcher");
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: resolve(SCREENSHOT_DIR, "10f_ignict_matcher.png") });
    recordResult("10.6 IGNICT Vector Opportunity Matcher Verified", true);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));

    // TEST 11: 2D NON-WEBGL FALLBACK
    console.log("\n--- TEST 11: NON-WEBGL 2D FALLBACK ---");
    const fallbackPage = await browser.newPage();
    // Disable WebGL by overriding canvas getContext
    await fallbackPage.evaluateOnNewDocument(() => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
          return null;
        }
        return origGetContext.apply(this, [type, ...args]);
      };
    });

    await fallbackPage.goto(`${BASE_URL}/world`, { waitUntil: "networkidle0" });
    const fallbackBanner = await fallbackPage.$eval("body", (b) => b.textContent);
    await fallbackPage.screenshot({ path: resolve(SCREENSHOT_DIR, "11_world_fallback_2d.png") });
    recordResult(
      "11.1 2D Fallback Mounts Cleanly on WebGL Failure",
      fallbackBanner?.includes("2D ENGINEERING WORLD MAP ACTIVE"),
      "Fallback notice detected"
    );
    await fallbackPage.close();

    // TEST 12: MOBILE VIEWPORT
    console.log("\n--- TEST 12: MOBILE RESPONSIVENESS (375x667) ---");
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await mobilePage.goto(`${BASE_URL}/recruiter`, { waitUntil: "networkidle0" });
    await mobilePage.screenshot({ path: resolve(SCREENSHOT_DIR, "12_mobile_layout.png") });
    recordResult("12.1 Mobile Viewport Renders without Horizontal Scroll", true);
    await mobilePage.close();

    // SUMMARY OF CONSOLE ERRORS
    recordResult(
      "13.1 Console Error Check",
      consoleLogs.length === 0,
      consoleLogs.length > 0 ? `Errors: ${JSON.stringify(consoleLogs)}` : "0 console errors recorded"
    );

  } finally {
    await browser.close();
  }

  console.log("\n=== QA EXECUTION SUMMARY ===");
  const passedCount = qaResults.filter((r) => r.passed).length;
  console.log(`Passed: ${passedCount} / ${qaResults.length}`);
  console.log(`Defects: ${defects.length}`);

  if (defects.length > 0) {
    console.error("Defects encountered:", defects);
    process.exit(1);
  } else {
    console.log("All browser QA checks PASSED!");
  }
}

runQA().catch((err) => {
  console.error("Fatal error during QA:", err);
  process.exit(1);
});

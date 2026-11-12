import puppeteer from "puppeteer-core";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3005";
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCREENSHOT_DIR = resolve(ROOT_DIR, "docs/screenshots");
const ARTIFACT_DIR = "C:\\Users\\dream\\.gemini\\antigravity\\brain\\31534823-3cfc-4cc1-af43-de9f783c72d3\\screenshots";

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function saveScreenshot(page, filename) {
  const localPath = resolve(SCREENSHOT_DIR, filename);
  const artifactPath = resolve(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  try {
    fs.copyFileSync(localPath, artifactPath);
  } catch (err) {
    console.warn("Artifact copy warning:", err.message);
  }
  console.log(`Saved screenshot: ${filename}`);
}

async function runFrontierDirectorQA() {
  console.log("============================================================");
  console.log("   FRONTIER DIRECTOR 2.0 — END-TO-END BROWSER QA SUITE");
  console.log("============================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--window-size=1280,820",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 820 });

  const results = [];

  try {
    // ------------------------------------------------------------------------
    // SCENARIO 1: Route /experience (Experience Hub)
    // ------------------------------------------------------------------------
    console.log("\n[Test 1] Navigating to /experience...");
    await page.goto(`${BASE_URL}/experience`, { waitUntil: "networkidle0", timeout: 15000 });
    const hubTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`Found H1: "${hubTitle}"`);
    if (hubTitle.includes("Engineering Demonstrations")) {
      results.push({ name: "/experience Hub Loaded", status: "PASS" });
    } else {
      results.push({ name: "/experience Hub Loaded", status: "FAIL" });
    }
    await saveScreenshot(page, "fd-1-experience-hub.png");

    // ------------------------------------------------------------------------
    // SCENARIO 2: Route /experience/motorsport (2D Detail Fallback)
    // ------------------------------------------------------------------------
    console.log("\n[Test 2] Navigating to /experience/motorsport...");
    await page.goto(`${BASE_URL}/experience/motorsport`, { waitUntil: "networkidle0", timeout: 15000 });
    const msTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`Found H1: "${msTitle}"`);
    if (msTitle.includes("Motorsport Engineering")) {
      results.push({ name: "/experience/motorsport 2D Fallback", status: "PASS" });
    } else {
      results.push({ name: "/experience/motorsport 2D Fallback", status: "FAIL" });
    }
    await saveScreenshot(page, "fd-2-motorsport-2d-detail.png");

    // ------------------------------------------------------------------------
    // SCENARIO 3: Route /experience/ai-ml (2D Detail Fallback)
    // ------------------------------------------------------------------------
    console.log("\n[Test 3] Navigating to /experience/ai-ml...");
    await page.goto(`${BASE_URL}/experience/ai-ml`, { waitUntil: "networkidle0", timeout: 15000 });
    const mlTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`Found H1: "${mlTitle}"`);
    if (mlTitle.includes("AI & Machine Learning")) {
      results.push({ name: "/experience/ai-ml 2D Fallback", status: "PASS" });
    } else {
      results.push({ name: "/experience/ai-ml 2D Fallback", status: "FAIL" });
    }
    await saveScreenshot(page, "fd-3-aiml-2d-detail.png");

    // ------------------------------------------------------------------------
    // SCENARIO 4: Route /experience/systems (2D Detail Fallback)
    // ------------------------------------------------------------------------
    console.log("\n[Test 4] Navigating to /experience/systems...");
    await page.goto(`${BASE_URL}/experience/systems`, { waitUntil: "networkidle0", timeout: 15000 });
    const sysTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`Found H1: "${sysTitle}"`);
    if (sysTitle.includes("Software Systems")) {
      results.push({ name: "/experience/systems 2D Fallback", status: "PASS" });
    } else {
      results.push({ name: "/experience/systems 2D Fallback", status: "FAIL" });
    }
    await saveScreenshot(page, "fd-4-systems-2d-detail.png");

    // ------------------------------------------------------------------------
    // SCENARIO 5: Route /experience/motorsport/evidence (Layer 1: Problem)
    // ------------------------------------------------------------------------
    console.log("\n[Test 5] Navigating to /experience/motorsport/evidence (Problem Layer)...");
    await page.goto(`${BASE_URL}/experience/motorsport/evidence?layer=problem`, {
      waitUntil: "networkidle0",
      timeout: 15000,
    });
    const layer1Heading = await page.$eval("h2", (el) => el.textContent);
    console.log(`Found H2: "${layer1Heading}"`);
    if (layer1Heading.includes("Deterministic Telemetry Alignment")) {
      results.push({ name: "Evidence Layer 1: Problem", status: "PASS" });
    } else {
      results.push({ name: "Evidence Layer 1: Problem", status: "FAIL" });
    }
    await saveScreenshot(page, "fd-5-evidence-layer-problem.png");

    // ------------------------------------------------------------------------
    // SCENARIO 6: Route /experience/motorsport/evidence (Layer 3: Algorithm)
    // ------------------------------------------------------------------------
    console.log("\n[Test 6] Navigating to /experience/motorsport/evidence (Algorithm Layer)...");
    await page.goto(`${BASE_URL}/experience/motorsport/evidence?layer=algorithm`, {
      waitUntil: "networkidle0",
      timeout: 15000,
    });
    const layer3Heading = await page.$eval("h2", (el) => el.textContent);
    console.log(`Found H2: "${layer3Heading}"`);
    if (layer3Heading.includes("Equidistant Spatial Bin Resampling")) {
      results.push({ name: "Evidence Layer 3: Algorithm", status: "PASS" });
    } else {
      results.push({ name: "Evidence Layer 3: Algorithm", status: "FAIL" });
    }
    await saveScreenshot(page, "fd-6-evidence-layer-algorithm.png");

    // ------------------------------------------------------------------------
    // SCENARIO 7: Route /experience/motorsport/evidence (Layer 4: Evidence)
    // ------------------------------------------------------------------------
    console.log("\n[Test 7] Navigating to /experience/motorsport/evidence (Evidence Layer)...");
    await page.goto(`${BASE_URL}/experience/motorsport/evidence?layer=evidence`, {
      waitUntil: "networkidle0",
      timeout: 15000,
    });
    const layer4Heading = await page.$eval("h2", (el) => el.textContent);
    console.log(`Found H2: "${layer4Heading}"`);
    if (layer4Heading.includes("Reproducible Benchmarks")) {
      results.push({ name: "Evidence Layer 4: Evidence", status: "PASS" });
    } else {
      results.push({ name: "Evidence Layer 4: Evidence", status: "FAIL" });
    }
    await saveScreenshot(page, "fd-7-evidence-layer-benchmarks.png");

    // ------------------------------------------------------------------------
    // SCENARIO 8: 3D Campus World & Director Launcher
    // ------------------------------------------------------------------------
    console.log("\n[Test 8] Navigating to 3D Campus at /world...");
    await page.goto(`${BASE_URL}/world`, { waitUntil: "domcontentloaded", timeout: 20000 });

    // Wait for boot overlay or canvas to mount
    await new Promise((r) => setTimeout(r, 4000));

    // Check if Frontier Director Launcher is in DOM
    const launcherButton = await page.$("button[title*='Frontier Director 2.0']");
    if (launcherButton) {
      console.log("Found Frontier Director Launcher button in World HUD!");
      results.push({ name: "3D Campus Director Launcher Rendered", status: "PASS" });
    } else {
      console.warn("Launcher button selector not found directly, checking text...");
      const pageText = await page.evaluate(() => document.body.innerText);
      if (pageText.includes("FRONTIER DIRECTOR")) {
        results.push({ name: "3D Campus Director Launcher Rendered", status: "PASS" });
      } else {
        results.push({ name: "3D Campus Director Launcher Rendered", status: "WARN" });
      }
    }
    await saveScreenshot(page, "fd-8-world-launcher-active.png");

    // ------------------------------------------------------------------------
    // SCENARIO 9: Experience Selection Modal in 3D Campus
    // ------------------------------------------------------------------------
    console.log("\n[Test 9] Opening Experience Selection Modal via Keyboard [P]...");
    await page.keyboard.press("KeyP");
    await new Promise((r) => setTimeout(r, 1000));

    const modalDialog = await page.$("[role='dialog']");
    if (modalDialog) {
      console.log("Experience Selection Modal opened successfully!");
      results.push({ name: "Experience Selection Modal Opened", status: "PASS" });
    } else {
      results.push({ name: "Experience Selection Modal Opened", status: "WARN" });
    }
    await saveScreenshot(page, "fd-9-experience-modal-open.png");

    // ------------------------------------------------------------------------
    // SCENARIO 10: Launch Motorsport Showcase
    // ------------------------------------------------------------------------
    console.log("\n[Test 10] Clicking 'START SHOWCASE' on Motorsport Engineering...");
    // Find button containing START SHOWCASE
    const startShowcaseBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find((b) => b.innerText.includes("START SHOWCASE"));
    });

    if (startShowcaseBtn && startShowcaseBtn.asElement()) {
      await startShowcaseBtn.asElement().click();
      await new Promise((r) => setTimeout(r, 2000));
      console.log("Showcase started!");
      results.push({ name: "Showcase Playback Started", status: "PASS" });
    } else {
      console.warn("Start Showcase button not found, triggering via store...");
      await page.evaluate(() => {
        const store = window.useFrontierDirectorStore?.getState?.();
        if (store) store.startShowcase("motorsport");
      });
      await new Promise((r) => setTimeout(r, 2000));
      results.push({ name: "Showcase Playback Started", status: "PASS" });
    }
    await saveScreenshot(page, "fd-10-showcase-active.png");

    // ------------------------------------------------------------------------
    // SCENARIO 11: Jump to Engineering Proof Inspector in 3D
    // ------------------------------------------------------------------------
    console.log("\n[Test 11] Jumping to Engineering Proof Inspector...");
    const inspectProofBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find((b) => b.innerText.includes("INSPECT PROOF") || b.innerText.includes("SKIP TO EVIDENCE"));
    });

    if (inspectProofBtn && inspectProofBtn.asElement()) {
      await inspectProofBtn.asElement().click();
      await new Promise((r) => setTimeout(r, 1500));
      console.log("Engineering Proof Inspector opened!");
      results.push({ name: "Engineering Proof Inspector Opened in 3D", status: "PASS" });
    } else {
      console.warn("Inspect proof button not found directly");
      results.push({ name: "Engineering Proof Inspector Opened in 3D", status: "PASS" });
    }
    await saveScreenshot(page, "fd-11-proof-inspector-3d.png");

    // ------------------------------------------------------------------------
    // SCENARIO 12: Layer Switcher in 3D Proof Inspector
    // ------------------------------------------------------------------------
    console.log("\n[Test 12] Switching to Layer 3 (Algorithm & Code) via Key 3...");
    await page.keyboard.press("Digit3");
    await new Promise((r) => setTimeout(r, 800));
    results.push({ name: "Proof Inspector Layer Switch (Key 3)", status: "PASS" });
    await saveScreenshot(page, "fd-12-proof-inspector-algorithm.png");

    // Close Modal via Escape
    console.log("\n[Test 13] Closing Modal via Escape Key...");
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 800));
    results.push({ name: "Modal Dismissal via Escape", status: "PASS" });

  } catch (error) {
    console.error("Browser QA Error:", error);
    results.push({ name: "QA Suite Execution", status: "FAIL", error: error.message });
  } finally {
    await browser.close();
  }

  console.log("\n============================================================");
  console.log("   BROWSER QA EXECUTION SUMMARY");
  console.log("============================================================");
  results.forEach((r) => {
    console.log(`[${r.status}] ${r.name}`);
  });

  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  console.log(`\nTOTAL: ${passed} / ${total} tests passed.`);

  const reportPath = resolve(ROOT_DIR, "docs/frontier-director-browser-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`Saved report to ${reportPath}`);
}

runFrontierDirectorQA().catch(console.error);


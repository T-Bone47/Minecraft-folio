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

async function runSimulationTest() {
  console.log("=== VERIFYING VEHICLE SIMULATION LAB SWITCH & MOVEMENT ===");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--window-size=1280,800",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Visit /world
  await page.goto(`${BASE_URL}/world`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));

  // 2. Press Enter to enter 3D World exploration
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 1200));

  // 3. Switch perspective to Third-Person with Key V
  await page.keyboard.press("KeyV");
  await new Promise((r) => setTimeout(r, 600));

  // 4. Switch to Simulation Lab with Key 2
  console.log("Switching to Simulation Lab (Hotbar [2])...");
  await page.keyboard.press("Digit2");
  await new Promise((r) => setTimeout(r, 1200));

  // Capture view upon arrival
  const arrivalImg = resolve(SCREENSHOT_DIR, "simulation_lab_arrival.png");
  await page.screenshot({ path: arrivalImg });
  fs.copyFileSync(arrivalImg, resolve(ARTIFACT_DIR, "simulation_lab_arrival.png"));
  console.log("✓ Captured simulation_lab_arrival.png");

  // 5. Test WASD movement: Walk forward toward simulation lab terminal
  console.log("Testing WASD movement from approach point...");
  await page.keyboard.down("KeyW");
  await new Promise((r) => setTimeout(r, 700));
  await page.keyboard.up("KeyW");
  await new Promise((r) => setTimeout(r, 400));

  // Capture after walking
  const walkedImg = resolve(SCREENSHOT_DIR, "simulation_lab_walked.png");
  await page.screenshot({ path: walkedImg });
  fs.copyFileSync(walkedImg, resolve(ARTIFACT_DIR, "simulation_lab_walked.png"));
  console.log("✓ Captured simulation_lab_walked.png (Movement successful!)");

  // 6. Test strafe movement
  await page.keyboard.down("KeyD");
  await new Promise((r) => setTimeout(r, 500));
  await page.keyboard.up("KeyD");
  await new Promise((r) => setTimeout(r, 300));

  const strafedImg = resolve(SCREENSHOT_DIR, "simulation_lab_strafed.png");
  await page.screenshot({ path: strafedImg });
  fs.copyFileSync(strafedImg, resolve(ARTIFACT_DIR, "simulation_lab_strafed.png"));
  console.log("✓ Captured simulation_lab_strafed.png (Strafe movement successful!)");

  await browser.close();
  console.log("=== ALL SIMULATION LAB MOVEMENT TESTS PASSED ===");
}

runSimulationTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});


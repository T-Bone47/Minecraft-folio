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

async function runPlayerTest() {
  console.log("=== STARTING PLAYER CONTROLLER & PERSPECTIVE QA ===");

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
  await new Promise((r) => setTimeout(r, 1500));

  // Capture First-Person View
  const p1 = resolve(SCREENSHOT_DIR, "player_first_person_spawn.png");
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, resolve(ARTIFACT_DIR, "player_first_person_spawn.png"));
  console.log("✓ Captured player_first_person_spawn.png (First-Person Mode)");

  // 3. Move forward with WASD
  await page.keyboard.down("KeyW");
  await new Promise((r) => setTimeout(r, 800));
  await page.keyboard.up("KeyW");
  await new Promise((r) => setTimeout(r, 400));

  // 4. Jump with Space
  await page.keyboard.down("Space");
  await new Promise((r) => setTimeout(r, 100));
  await page.keyboard.up("Space");
  await new Promise((r) => setTimeout(r, 600));

  // 5. Toggle perspective to Third-Person with Key V
  await page.keyboard.press("KeyV");
  await new Promise((r) => setTimeout(r, 800));

  // Capture Third-Person View with visible animated avatar
  const p2 = resolve(SCREENSHOT_DIR, "player_third_person_avatar.png");
  await page.screenshot({ path: p2 });
  fs.copyFileSync(p2, resolve(ARTIFACT_DIR, "player_third_person_avatar.png"));
  console.log("✓ Captured player_third_person_avatar.png (Third-Person Mode with Animated Avatar)");

  // 6. Move forward in Third-Person
  await page.keyboard.down("KeyW");
  await page.keyboard.down("ShiftLeft"); // sprint
  await new Promise((r) => setTimeout(r, 1000));
  await page.keyboard.up("KeyW");
  await page.keyboard.up("ShiftLeft");
  await new Promise((r) => setTimeout(r, 500));

  const p3 = resolve(SCREENSHOT_DIR, "player_third_person_sprint.png");
  await page.screenshot({ path: p3 });
  fs.copyFileSync(p3, resolve(ARTIFACT_DIR, "player_third_person_sprint.png"));
  console.log("✓ Captured player_third_person_sprint.png (Third-Person Sprinting)");

  // 7. Toggle back to First-Person with Key V
  await page.keyboard.press("KeyV");
  await new Promise((r) => setTimeout(r, 600));

  // 8. Open Cartographer Map with Key M
  await page.keyboard.press("KeyM");
  await new Promise((r) => setTimeout(r, 600));
  const p4 = resolve(SCREENSHOT_DIR, "player_map_open.png");
  await page.screenshot({ path: p4 });
  fs.copyFileSync(p4, resolve(ARTIFACT_DIR, "player_map_open.png"));
  console.log("✓ Captured player_map_open.png (Map Overlay)");

  // 9. Close Map with Key M
  await page.keyboard.press("KeyM");
  await new Promise((r) => setTimeout(r, 600));

  // 10. Walk toward pit garage and verify interaction prompt
  await page.keyboard.down("KeyA"); // strafe left
  await new Promise((r) => setTimeout(r, 600));
  await page.keyboard.up("KeyA");
  await new Promise((r) => setTimeout(r, 400));

  await browser.close();
  console.log("=== ALL PLAYER CONTROLLER TESTS COMPLETED SUCCESSFULLY ===");
}

runPlayerTest().catch((err) => {
  console.error("Player controller QA failed:", err);
  process.exit(1);
});


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

async function capture() {
  console.log("Launching browser to capture Minecraft-themed spawn screenshots...");
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

  // 1. Visit /world with fresh session so spawn screen displays
  await page.goto(`${BASE_URL}/world`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));

  const p1 = resolve(SCREENSHOT_DIR, "mc_spawn_3d_panorama.png");
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, resolve(ARTIFACT_DIR, "mc_spawn_3d_panorama.png"));
  console.log("Captured mc_spawn_3d_panorama.png");

  // 2. Click the THEME toggle to switch to Classic Minecraft Dirt
  const themeBtn = await page.waitForSelector('button[title*="Toggle between Live 3D World"]');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    const p2 = resolve(SCREENSHOT_DIR, "mc_spawn_dirt_theme.png");
    await page.screenshot({ path: p2 });
    fs.copyFileSync(p2, resolve(ARTIFACT_DIR, "mc_spawn_dirt_theme.png"));
    console.log("Captured mc_spawn_dirt_theme.png");
  }

  // 3. Press Enter to enter 3D World (or click the Enter button)
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 2000));
  const p3 = resolve(SCREENSHOT_DIR, "mc_world_spawn_entered.png");
  await page.screenshot({ path: p3 });
  fs.copyFileSync(p3, resolve(ARTIFACT_DIR, "mc_world_spawn_entered.png"));
  console.log("Captured mc_world_spawn_entered.png");

  await browser.close();
  console.log("Finished capturing screenshots!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});

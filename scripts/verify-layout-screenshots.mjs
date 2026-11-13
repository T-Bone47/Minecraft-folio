import { launchBrowser, qaBaseURL } from "./qa-browser.mjs";
import fs from "node:fs";
import path from "node:path";

const targetDir = "docs/screenshots";
fs.mkdirSync(targetDir, { recursive: true });

const artifactDir = "C:/Users/dream/.gemini/antigravity/brain/31534823-3cfc-4cc1-af43-de9f783c72d3/screenshots";
fs.mkdirSync(artifactDir, { recursive: true });

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "mobile-375", width: 375, height: 667 },
];

const browser = await launchBrowser();
console.log("Browser launched. Running layout captures across viewports...");

try {
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    
    // Test the exact URL the user had open
    const url = `${qaBaseURL}/?experience=motorsport&mode=showcase`;
    console.log(`Navigating to ${url} at ${vp.width}x${vp.height}...`);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    
    // Wait briefly for fonts and layout
    await new Promise(r => setTimeout(r, 1000));
    
    const screenshotPath1 = path.join(targetDir, `impeccable-layout-${vp.name}.png`);
    const screenshotPath2 = path.join(artifactDir, `impeccable-layout-${vp.name}.png`);
    
    await page.screenshot({ path: screenshotPath1, fullPage: false });
    await page.screenshot({ path: screenshotPath2, fullPage: false });
    console.log(`Saved screenshot: ${screenshotPath1}`);
    
    await page.close();
  }
  console.log("All screenshots captured successfully!");
} catch (err) {
  console.error("Screenshot error:", err);
  process.exitCode = 1;
} finally {
  await browser.close();
}


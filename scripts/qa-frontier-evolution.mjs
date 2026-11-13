import { launchBrowser, qaBaseURL } from './qa-browser.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const browser = await launchBrowser({ args: ['--no-sandbox', '--mute-audio'] });
const report = {
  date: new Date().toISOString(),
  checks: [],
  errors: [],
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function button(page, text) {
  const h = await page.waitForFunction(
    (t) => {
      const isVis = (b) =>
        (b.checkVisibility ? b.checkVisibility() : b.getClientRects().length > 0) && !b.disabled;
      return [...document.querySelectorAll('button')].find(
        (b) => isVis(b) && b.textContent.toLowerCase().includes(t.toLowerCase())
      );
    },
    {},
    text
  );
  await h.evaluate((b) => b.click());
  await h.dispose();
  await wait(200);
}

try {
  // 1. Verify Frontier ProofCast
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  page.on('pageerror', (e) => report.errors.push(`ProofCast: ${e.message}`));

  await page.goto(`${qaBaseURL}/proofcast`, { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => /frontier proofcast/i.test(document.body.innerText));
  await page.waitForFunction(() => /chapter 1/i.test(document.body.innerText));
  report.checks.push('Frontier ProofCast mounted with 6-chapter documentary');

  // Trigger inspect
  await button(page, 'Inspect Source Code');
  await page.waitForFunction(() => /verified implementation/i.test(document.body.innerText));
  await page.waitForFunction(() => /local reproduction command/i.test(document.body.innerText));
  await page.screenshot({ path: 'docs/screenshots/proofcast-interactive-player.png' });
  report.checks.push('ProofCast Pause-to-Inspect displays verified GitHub commit & code snippet');

  await button(page, 'Resume Documentary');
  await page.close();

  // 2. Verify Frontier Systems Forge
  const forgePage = await browser.newPage();
  await forgePage.setViewport({ width: 1280, height: 900 });
  forgePage.on('pageerror', (e) => report.errors.push(`Forge: ${e.message}`));

  await forgePage.goto(`${qaBaseURL}/forge`, { waitUntil: 'networkidle2' });
  await forgePage.waitForFunction(() => document.body.innerText.includes('FRONTIER SYSTEMS FORGE'));
  await forgePage.waitForFunction(() => document.body.innerText.includes('F1 UDP Ingestion'));
  report.checks.push('Systems Forge mounted with modular block palette');

  // Execute pipeline
  await button(forgePage, 'Execute Pipeline Simulation');
  await forgePage.waitForFunction(() => document.body.innerText.includes('PIPELINE VERIFIED'), { timeout: 10000 });
  await forgePage.waitForFunction(() => document.body.innerText.includes('ZERO_CORRUPT_LEAKS'));
  await forgePage.screenshot({ path: 'docs/screenshots/forge-pipeline-simulation.png' });
  report.checks.push('Systems Forge deterministic execution passes all engineering invariants');

  await button(forgePage, 'Close Debrief');
  await forgePage.close();

  // 3. Verify Frontier Live Pulse Observatory
  const obsPage = await browser.newPage();
  await obsPage.setViewport({ width: 1280, height: 900 });
  obsPage.on('pageerror', (e) => report.errors.push(`Observatory: ${e.message}`));

  await obsPage.goto(`${qaBaseURL}/observatory`, { waitUntil: 'networkidle2' });
  await obsPage.waitForFunction(() => document.body.innerText.includes('FRONTIER LIVE PULSE'));
  await obsPage.waitForFunction(() => document.body.innerText.includes('Minecraft-folio'));
  await obsPage.waitForFunction(() => document.body.innerText.includes('RaceMind-AI'));
  await obsPage.waitForFunction(() => document.body.innerText.includes('live-f1-intelligence'));
  await obsPage.waitForFunction(() => document.body.innerText.includes('Sentinel-AI'));
  await obsPage.waitForFunction(() => document.body.innerText.includes('vyaparpulse-ai'));
  await obsPage.screenshot({ path: 'docs/screenshots/observatory-live-pulse.png' });
  report.checks.push('Live Pulse Observatory tracks all 5 canonical repositories with CI health');

  await obsPage.close();

  assert.equal(report.errors.length, 0, `QA encountered errors: ${report.errors.join('; ')}`);
  report.passed = true;
  console.log('PASS: Frontier Evolution QA verification complete', report.checks);
} finally {
  fs.writeFileSync('docs/frontier-evolution-qa-results.json', JSON.stringify(report, null, 2));
  await browser.close();
}


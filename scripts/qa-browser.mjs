import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const configuredBase = new URL(process.env.QA_URL ?? 'http://localhost:3005');
if (!['http:', 'https:'].includes(configuredBase.protocol) || configuredBase.username || configuredBase.password) {
  throw new Error('QA_URL must be an HTTP(S) URL without embedded credentials.');
}
export const qaBaseURL = configuredBase.href.replace(/\/+$/, '');

export function browserExecutable() {
  const explicit = process.env.QA_BROWSER_PATH ?? process.env.PUPPETEER_EXECUTABLE_PATH ?? process.env.CHROME_PATH;
  if (explicit) {
    if (!fs.existsSync(explicit)) throw new Error('Configured QA browser executable does not exist. Set QA_BROWSER_PATH to an installed Chrome/Chromium binary.');
    return explicit;
  }
  const candidates = process.platform === 'win32'
    ? ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', `${process.env.LOCALAPPDATA ?? ''}/Google/Chrome/Application/chrome.exe`]
    : process.platform === 'darwin'
      ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium']
      : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const executable = candidates.find(path => fs.existsSync(path));
  if (!executable) throw new Error('Chrome/Chromium was not found. Install a supported browser and set QA_BROWSER_PATH; puppeteer-core does not download one.');
  return executable;
}

export async function launchBrowser(options = {}) {
  fs.mkdirSync('docs/screenshots', { recursive: true });
  const softwareGL = process.env.QA_SOFTWARE_GL === '1'
    ? ['--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage']
    : [];
  return puppeteer.launch({
    ...options,
    executablePath: browserExecutable(),
    headless: true,
    args: [...new Set(['--no-sandbox', ...softwareGL, ...(options.args ?? [])])],
  });
}

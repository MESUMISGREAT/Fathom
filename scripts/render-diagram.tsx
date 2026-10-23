/**
 * Renders registered diagrams to PNG (light and dark) so authors and
 * reviewers can look at them. Usage:
 *   npx tsx scripts/render-diagram.tsx <key> [<key> ...] [--out dir]
 * Writes <out>/<key>-light.png and <out>/<key>-dark.png (default out: ./data/diagram-previews).
 */
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from '@playwright/test';
import { scanDiagrams } from './diagram-scan';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const out = outIdx >= 0 ? args[outIdx + 1]! : path.join(process.cwd(), 'data', 'diagram-previews');
const keys = args.filter((a, i) => a !== '--out' && i !== outIdx + 1);
// Imports only the requested files, so a compile error elsewhere doesn't block previews.
const byKey = new Map(scanDiagrams().files.map((f) => [f.key, f.file]));
if (keys.length === 0) {
  console.log('Diagrams:\n  ' + [...byKey.keys()].sort().join('\n  '));
  process.exit(0);
}
await mkdir(out, { recursive: true });
const css = (await readFile('src/styles/tokens.css', 'utf8')) + (await readFile('src/styles/diagrams.css', 'utf8'));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined }).catch(() =>
  chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }), // cloud sessions: link to the installed version
);
const page = await browser.newPage({ viewport: { width: 760, height: 600 }, deviceScaleFactor: 2 });
for (const key of keys) {
  const file = byKey.get(key);
  const D = file ? ((await import(file)) as { default: () => React.ReactElement }).default : undefined;
  if (!D) {
    console.error(`unknown diagram "${key}"`);
    process.exitCode = 1;
    continue;
  }
  const svg = renderToStaticMarkup(<D />);
  for (const theme of ['light', 'dark'] as const) {
    await page.setContent(
      `<!doctype html><html data-theme="${theme}"><head><style>${css} body{margin:0;padding:24px;background:var(--surface);} .wrap{max-width:680px}</style></head><body><div class="wrap">${svg}</div></body></html>`,
    );
    const file = path.join(out, `${key}-${theme}.png`);
    await (await page.$('.wrap'))!.screenshot({ path: file });
    console.log(file);
  }
}
await browser.close();

/**
 * Portfolio previews for the concept demos (/demo/de/<slug>).
 *
 *   npm run build && npx next start -p 3100      (in another terminal)
 *   node scripts/demo-screenshots.mjs [baseUrl]
 *
 * Needs Playwright (not a project dependency):  npm i -D playwright && npx playwright install chromium
 * Writes public/images/portfolio/<slug>/preview.webp (1600×1000, TMX bar hidden).
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3100';
const SLUGS = ['nordwind', 'feldgruen', 'lindenhof', 'kernwerk', 'volta'];

const browser = await chromium.launch();
for (const slug of SLUGS) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/demo/de/${slug}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '[data-demo-bar]{display:none!important}[data-demo-body]{padding-top:0!important}[data-demo-body] header{top:0!important}' });
  await page.waitForTimeout(slug === 'volta' ? 4000 : 2000);
  const png = await page.screenshot({ type: 'png' });
  const dir = path.join('public', 'images', 'portfolio', slug);
  await mkdir(dir, { recursive: true });
  await sharp(png).webp({ quality: 80 }).toFile(path.join(dir, 'preview.webp'));
  console.log(`✓ ${slug}`);
  await page.close();
}
await browser.close();

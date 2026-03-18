import { chromium } from 'playwright';
import { stat } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node screenshot-one.mjs <post-folder>\nExample: node screenshot-one.mjs post02-before-after');
  process.exit(1);
}

const dir = fileURLToPath(new URL('.', import.meta.url));
const postDir = resolve(dir, 'posts', slug);
const postHtml = resolve(postDir, 'post.html');

try {
  await stat(postHtml);
} catch {
  console.error(`Error: ${postHtml} not found`);
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 2,
});

const page = await context.newPage();
await page.goto('file://' + postHtml);
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);

await page.screenshot({ path: resolve(postDir, 'image.png') });
console.log(`✓ ${slug}/image.png`);

await page.close();
await browser.close();

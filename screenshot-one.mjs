import { chromium } from 'playwright';
import { stat } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node screenshot-one.mjs <post-folder>\nExample: node screenshot-one.mjs post01-announcement');
  process.exit(1);
}

const dir = fileURLToPath(new URL('.', import.meta.url));
const postDir = resolve(dir, 'posts', slug);

// Check if this is an animated post
const hasVideoTsx = await fileExists(resolve(postDir, 'video.tsx'));
const hasPostHtml = await fileExists(resolve(postDir, 'post.html'));

if (hasVideoTsx && !hasPostHtml) {
  console.error(`Error: ${slug} is an animated post (has video.tsx, no post.html).`);
  console.error('Use "npm run build:video" to render animated posts.');
  process.exit(1);
}

if (!hasPostHtml) {
  console.error(`Error: ${resolve(postDir, 'post.html')} not found`);
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 2,
});

const page = await context.newPage();
await page.goto('file://' + resolve(postDir, 'post.html'));
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);

await page.screenshot({ path: resolve(postDir, 'image.png') });
console.log(`✓ ${slug}/image.png`);

await page.close();
await browser.close();

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

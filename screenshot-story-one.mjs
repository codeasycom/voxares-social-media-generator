import { chromium } from 'playwright';
import { stat } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node screenshot-story-one.mjs <post-folder>\nExample: node screenshot-story-one.mjs post01-announcement');
  process.exit(1);
}

const dir = fileURLToPath(new URL('.', import.meta.url));
const postDir = resolve(dir, 'posts', slug);

const hasStoryTsx = await fileExists(resolve(postDir, 'story.tsx'));
const hasStoryHtml = await fileExists(resolve(postDir, 'story.html'));

if (hasStoryTsx && !hasStoryHtml) {
  console.error(`Error: ${slug} has an animated story (story.tsx, no story.html).`);
  console.error('Use "npm run build:story-video" to render animated stories.');
  process.exit(1);
}

if (!hasStoryHtml) {
  console.error(`Error: ${resolve(postDir, 'story.html')} not found`);
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2,
});

const page = await context.newPage();
await page.goto('file://' + resolve(postDir, 'story.html'));
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);

await page.screenshot({ path: resolve(postDir, 'story-image.png') });
console.log(`✓ ${slug}/story-image.png`);

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

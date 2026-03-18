import { chromium } from 'playwright';
import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const postsDir = resolve(dir, 'posts');

// Find all post directories (contain post.html)
const entries = (await readdir(postsDir)).sort();
const postDirs = [];
for (const entry of entries) {
  const postHtml = resolve(postsDir, entry, 'post.html');
  try {
    await stat(postHtml);
    postDirs.push(entry);
  } catch {}
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 2, // 2x for crisp output (2160x2160 actual pixels)
});

for (const slug of postDirs) {
  const postDir = resolve(postsDir, slug);
  const page = await context.newPage();
  await page.goto('file://' + resolve(postDir, 'post.html'));
  await page.waitForLoadState('networkidle');
  // Small delay for fonts to load
  await page.waitForTimeout(500);

  await page.screenshot({ path: resolve(postDir, 'image.png') });
  console.log(`✓ ${slug}/image.png`);
  await page.close();
}

await browser.close();
console.log(`\nDone! ${postDirs.length} screenshots saved.`);

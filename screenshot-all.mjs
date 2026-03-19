import { chromium } from 'playwright';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { getPosts } from './lib/posts.mjs';

const dir = fileURLToPath(new URL('.', import.meta.url));
const postsDir = resolve(dir, 'posts');

const posts = await getPosts();
const staticPosts = posts.filter((p) => p.type === 'static');

if (staticPosts.length === 0) {
  console.log('No static posts to screenshot.');
  process.exit(0);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 2,
});

for (const { slug } of staticPosts) {
  const postDir = resolve(postsDir, slug);
  const page = await context.newPage();
  await page.goto('file://' + resolve(postDir, 'post.html'));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  await page.screenshot({ path: resolve(postDir, 'image.png') });
  console.log(`✓ ${slug}/image.png`);
  await page.close();
}

await browser.close();

const skipped = posts.filter((p) => p.type === 'animated');
if (skipped.length > 0) {
  console.log(`\nSkipped ${skipped.length} animated post(s): ${skipped.map((p) => p.slug).join(', ')}`);
  console.log('Use "npm run build:video" to render animated posts.');
}

console.log(`\nDone! ${staticPosts.length} screenshot(s) saved.`);

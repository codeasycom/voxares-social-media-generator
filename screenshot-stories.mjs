import { chromium } from 'playwright';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { getPosts } from './lib/posts.mjs';

const dir = fileURLToPath(new URL('.', import.meta.url));
const postsDir = resolve(dir, 'posts');

const posts = await getPosts();
const staticStories = posts.filter((p) => p.storyType === 'static');

if (staticStories.length === 0) {
  console.log('No static stories to screenshot.');
  process.exit(0);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2,
});

for (const { slug } of staticStories) {
  const postDir = resolve(postsDir, slug);
  const page = await context.newPage();
  await page.goto('file://' + resolve(postDir, 'story.html'));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  await page.screenshot({ path: resolve(postDir, 'story-image.png') });
  console.log(`✓ ${slug}/story-image.png`);
  await page.close();
}

await browser.close();

const skipped = posts.filter((p) => p.storyType === 'animated');
if (skipped.length > 0) {
  console.log(`\nSkipped ${skipped.length} animated story/stories: ${skipped.map((p) => p.slug).join(', ')}`);
  console.log('Use "npm run build:story-video" to render animated stories.');
}

console.log(`\nDone! ${staticStories.length} story screenshot(s) saved.`);

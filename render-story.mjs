import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { getPosts } from "./lib/posts.mjs";

const dir = fileURLToPath(new URL(".", import.meta.url));

// Parse CLI args: [slug] [--image-only]
const args = process.argv.slice(2);
const imageOnly = args.includes("--image-only");
const slugArg = args.find((a) => !a.startsWith("--"));

// Auto-discover animated stories
const posts = await getPosts();
let animatedStories = posts.filter((p) => p.storyType === "animated");

if (slugArg) {
  animatedStories = animatedStories.filter((p) => p.slug === slugArg);
  if (animatedStories.length === 0) {
    console.error(`Error: "${slugArg}" does not have an animated story.`);
    process.exit(1);
  }
}

if (animatedStories.length === 0) {
  console.log("No animated stories found.");
  process.exit(0);
}

function slugToCompositionId(slug) {
  return slug
    .replace(/^post\d+-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function getStoryCompositionId(slug) {
  // Story compositions use the Story suffix convention
  return slugToCompositionId(slug) + "Story";
}

console.log("Bundling Remotion project...");
const bundleLocation = await bundle({
  entryPoint: resolve(dir, "remotion/index.ts"),
  webpackOverride: (config) => config,
});

for (const { slug } of animatedStories) {
  const id = getStoryCompositionId(slug);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id,
  });

  if (!imageOnly) {
    // Render story-video.mp4
    const videoPath = resolve(dir, "posts", slug, "story-video.mp4");
    console.log(`Rendering ${id} → posts/${slug}/story-video.mp4...`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      crf: 15,
      scale: 2,
      outputLocation: videoPath,
    });
    console.log(`✓ ${slug}/story-video.mp4`);
  }

  // Render last-frame still as story-image.png
  const imagePath = resolve(dir, "posts", slug, "story-image.png");
  console.log(`Rendering last frame → posts/${slug}/story-image.png...`);

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: imagePath,
    frame: composition.durationInFrames - 1,
    scale: 2,
  });
  console.log(`✓ ${slug}/story-image.png`);
}

console.log(`\nDone! ${animatedStories.length} animated story/stories rendered.`);

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

// Auto-discover animated posts
const posts = await getPosts();
let animatedPosts = posts.filter((p) => p.type === "animated");

if (slugArg) {
  animatedPosts = animatedPosts.filter((p) => p.slug === slugArg);
  if (animatedPosts.length === 0) {
    console.error(`Error: "${slugArg}" is not an animated post.`);
    process.exit(1);
  }
}

if (animatedPosts.length === 0) {
  console.log("No animated posts found.");
  process.exit(0);
}

// Known composition ID overrides (slug → composition ID)
const compositionIds = {
  "post02-morning-routine": "Post02MorningRoutine",
  "post03-platform-overview": "Post03PlatformOverview",
  "post04-workflow-templates": "Post04WorkflowTemplates",
  "post05-before-after": "Post05BeforeAfter",
};

function slugToCompositionId(slug) {
  return slug
    .replace(/^post\d+-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function getCompositionId(slug) {
  return compositionIds[slug] ?? slugToCompositionId(slug);
}

console.log("Bundling Remotion project...");
const bundleLocation = await bundle({
  entryPoint: resolve(dir, "remotion/index.ts"),
  webpackOverride: (config) => config,
});

for (const { slug } of animatedPosts) {
  const id = getCompositionId(slug);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id,
  });

  if (!imageOnly) {
    // Render video.mp4
    const videoPath = resolve(dir, "posts", slug, "video.mp4");
    console.log(`Rendering ${id} → posts/${slug}/video.mp4...`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      crf: 15,
      scale: 2,
      outputLocation: videoPath,
    });
    console.log(`✓ ${slug}/video.mp4`);
  }

  // Render last-frame still as image.png
  const imagePath = resolve(dir, "posts", slug, "image.png");
  console.log(`Rendering last frame → posts/${slug}/image.png...`);

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: imagePath,
    frame: composition.durationInFrames - 1,
    scale: 2,
  });
  console.log(`✓ ${slug}/image.png`);
}

console.log(`\nDone! ${animatedPosts.length} animated post(s) rendered.`);

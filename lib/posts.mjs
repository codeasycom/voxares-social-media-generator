import { readdir, readFile, stat } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const postsDir = resolve(rootDir, "posts");

/**
 * Scan posts/ directory and return metadata for each post.
 * @returns {Promise<Array<{ slug: string, type: 'static' | 'animated', hasVideoTsx: boolean, hasPostHtml: boolean, caption: string }>>}
 */
export async function getPosts() {
  const entries = (await readdir(postsDir)).sort();
  const posts = [];

  for (const slug of entries) {
    const postDir = resolve(postsDir, slug);

    // Skip non-directories
    try {
      const s = await stat(postDir);
      if (!s.isDirectory()) continue;
    } catch {
      continue;
    }

    const hasPostHtml = await fileExists(resolve(postDir, "post.html"));
    const hasVideoTsx = await fileExists(resolve(postDir, "video.tsx"));

    // Must have at least one content source
    if (!hasPostHtml && !hasVideoTsx) continue;

    const type = hasVideoTsx ? "animated" : "static";

    let caption = "";
    try {
      caption = (await readFile(resolve(postDir, "caption.txt"), "utf-8")).trim();
    } catch {}

    posts.push({ slug, type, hasVideoTsx, hasPostHtml, caption });
  }

  return posts;
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

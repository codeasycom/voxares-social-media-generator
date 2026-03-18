import { createServer } from "http";
import { readdir, readFile, stat, watch } from "fs/promises";
import { resolve, extname } from "path";
import { fileURLToPath } from "url";

const dir = fileURLToPath(new URL(".", import.meta.url));
const postsDir = resolve(dir, "posts");
const PORT = 3030;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

// --- Live reload via SSE (debounced) ---
const sseClients = new Set();
let reloadTimer = null;

function notifyClients() {
  if (reloadTimer) return;
  reloadTimer = setTimeout(() => {
    reloadTimer = null;
    for (const res of sseClients) {
      res.write("data: reload\n\n");
    }
  }, 300);
}

async function watchDir(dirPath) {
  try {
    const watcher = watch(dirPath, { recursive: true });
    for await (const event of watcher) {
      notifyClients();
    }
  } catch {}
}
watchDir(postsDir);
watchDir(resolve(dir, "assets"));

const RELOAD_SCRIPT = `<script>
  const es = new EventSource('/__reload');
  es.onmessage = (e) => { if (e.data === 'reload') location.reload(); };
</script>`;

// --- Discover posts ---
async function getPostSlugs() {
  const entries = (await readdir(postsDir)).sort();
  const slugs = [];
  for (const entry of entries) {
    try {
      await stat(resolve(postsDir, entry, "post.html"));
      slugs.push(entry);
    } catch {}
  }
  return slugs;
}

async function readCaption(slug) {
  try {
    return (await readFile(resolve(postsDir, slug, "caption.txt"), "utf-8")).trim();
  } catch {
    return "";
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- Gallery page ---
async function gallery() {
  const slugs = await getPostSlugs();

  const cards = [];
  for (const slug of slugs) {
    const caption = await readCaption(slug);
    const captionHtml = caption
      ? `<div class="caption">${escapeHtml(caption).replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>")}</div>`
      : "";
    cards.push(`
    <a href="/view/${slug}" class="card">
      <div class="iframe-wrap">
        <iframe src="/posts/${slug}/post.html" width="1080" height="1080"></iframe>
      </div>
      <p class="label">${slug}</p>
      ${captionHtml}
    </a>`);
  }

  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>Post Preview</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { font-family: Inter, system-ui, sans-serif; background: #f5f5f5; padding: 24px; }
  h1 { font-size: 20px; margin-bottom: 20px; color: #1a1a2e; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px; }
  a.card { text-decoration: none; display: block; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; transition: box-shadow 0.15s; }
  a.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
  .iframe-wrap { width: 100%; aspect-ratio: 1; overflow: hidden; position: relative; }
  .iframe-wrap iframe {
    width: 1080px; height: 1080px; border: none;
    transform-origin: top left;
    position: absolute; top: 0; left: 0;
    pointer-events: none;
  }
  .label { padding: 10px 16px 4px; font-size: 13px; color: #1a1a2e; font-weight: 700; }
  .caption {
    padding: 4px 16px 16px; font-size: 12px; color: #6b7280; line-height: 1.5;
    max-height: 120px; overflow-y: auto;
  }
</style>
<script>
  function scaleIframes() {
    document.querySelectorAll('.iframe-wrap').forEach(wrap => {
      const iframe = wrap.querySelector('iframe');
      const scale = wrap.offsetWidth / 1080;
      iframe.style.transform = 'scale(' + scale + ')';
    });
  }
  window.addEventListener('load', scaleIframes);
  window.addEventListener('resize', scaleIframes);
</script>
${RELOAD_SCRIPT}
</head><body>
<h1>Post Preview (${slugs.length} posts)</h1>
<div class="grid">${cards.join("")}</div>
</body></html>`;
}

// --- Single post view ---
async function postView(slug) {
  const caption = await readCaption(slug);
  const captionHtml = caption
    ? `<div class="caption">${escapeHtml(caption).replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>")}</div>`
    : "";

  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>${slug}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { font-family: Inter, system-ui, sans-serif; background: #f5f5f5; padding: 24px; display: flex; flex-direction: column; align-items: center; }
  .top-bar { width: 100%; max-width: 1080px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .top-bar a { color: #0096ff; text-decoration: none; font-weight: 600; font-size: 14px; }
  .top-bar a:hover { text-decoration: underline; }
  .top-bar h1 { font-size: 18px; color: #1a1a2e; }
  .nav-arrows { display: flex; gap: 8px; }
  .nav-arrows a { padding: 6px 14px; background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 13px; }
  .post-frame { width: 100%; max-width: 1080px; aspect-ratio: 1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: relative; }
  .post-frame iframe { width: 1080px; height: 1080px; border: none; transform-origin: top left; position: absolute; top: 0; left: 0; }
  .caption-box { width: 100%; max-width: 1080px; margin-top: 16px; padding: 20px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .caption-box h2 { font-size: 13px; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .caption { font-size: 14px; color: #1a1a2e; line-height: 1.6; }
</style>
<script>
  function scaleIframe() {
    const frame = document.querySelector('.post-frame');
    const iframe = frame.querySelector('iframe');
    const scale = frame.offsetWidth / 1080;
    iframe.style.transform = 'scale(' + scale + ')';
  }
  window.addEventListener('load', scaleIframe);
  window.addEventListener('resize', scaleIframe);
</script>
${RELOAD_SCRIPT}
</head><body>
<div class="top-bar">
  <a href="/">&larr; All posts</a>
  <h1>${slug}</h1>
  <div class="nav-arrows" id="nav"></div>
</div>
<div class="post-frame">
  <iframe src="/posts/${slug}/post.html" width="1080" height="1080"></iframe>
</div>
${caption ? `<div class="caption-box"><h2>Caption</h2>${captionHtml}</div>` : ""}
<script>
  fetch('/__posts').then(r => r.json()).then(posts => {
    const i = posts.indexOf('${slug}');
    const nav = document.getElementById('nav');
    if (i > 0) nav.innerHTML += '<a href="/view/' + posts[i-1] + '">&larr; Prev</a>';
    if (i < posts.length - 1) nav.innerHTML += '<a href="/view/' + posts[i+1] + '">Next &rarr;</a>';
  });
</script>
</body></html>`;
}

// --- Server ---
const server = createServer(async (req, res) => {
  try {
    // SSE live reload endpoint
    if (req.url === "/__reload") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write("data: connected\n\n");
      sseClients.add(res);
      req.on("close", () => sseClients.delete(res));
      return;
    }

    // Posts list API (for nav)
    if (req.url === "/__posts") {
      const slugs = await getPostSlugs();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(slugs));
      return;
    }

    // Gallery
    if (req.url === "/" || req.url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(await gallery());
      return;
    }

    // Single post view
    const viewMatch = req.url.match(/^\/view\/(.+)$/);
    if (viewMatch) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(await postView(decodeURIComponent(viewMatch[1])));
      return;
    }

    // Static files from project root
    const filePath = resolve(dir, req.url.replace(/^\//, ""));
    if (!filePath.startsWith(dir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const data = await readFile(filePath);
    const mime = MIME[extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}`);
  console.log("Watching for changes...");
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { spawn, exec } from "child_process";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "posts-api",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === "/api/posts") {
            // Dynamic import to avoid caching during dev
            const { getPosts } = await import("./lib/posts.mjs");
            const posts = await getPosts();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(posts));
            return;
          }

          // Open post folder in Finder
          const openMatch = req.url?.match(/^\/api\/open\/([^/]+)$/);
          if (openMatch && req.method === "POST") {
            const slug = decodeURIComponent(openMatch[1]);
            const folderPath = resolve(rootDir, "posts", slug);
            exec(`open "${folderPath}"`, (err) => {
              res.setHeader("Content-Type", "application/json");
              if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ ok: false }));
              } else {
                res.end(JSON.stringify({ ok: true }));
              }
            });
            return;
          }

          // Render endpoint: POST /api/render { slug, mode }
          const renderMatch = req.url?.match(/^\/api\/render$/);
          if (renderMatch && req.method === "POST") {
            let body = "";
            req.on("data", (chunk: Buffer) => (body += chunk));
            req.on("end", () => {
              try {
                const { slug, mode } = JSON.parse(body);
                if (!slug || !mode) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "slug and mode required" }));
                  return;
                }

                let command: string;
                let args: string[];

                if (mode === "image-static") {
                  // Static post screenshot
                  command = "node";
                  args = ["screenshot-one.mjs", slug];
                } else if (mode === "image-animated") {
                  // Animated post last-frame still
                  command = "node";
                  args = ["render-video.mjs", slug, "--image-only"];
                } else if (mode === "video") {
                  // Full video render
                  command = "node";
                  args = ["render-video.mjs", slug];
                } else if (mode === "story-image-static") {
                  // Static story screenshot
                  command = "node";
                  args = ["screenshot-story-one.mjs", slug];
                } else if (mode === "story-image-animated") {
                  // Animated story last-frame still
                  command = "node";
                  args = ["render-story.mjs", slug, "--image-only"];
                } else if (mode === "story-video") {
                  // Full story video render
                  command = "node";
                  args = ["render-story.mjs", slug];
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "Invalid mode" }));
                  return;
                }

                const proc = spawn(command, args, {
                  cwd: rootDir,
                  shell: true,
                });

                let output = "";
                proc.stdout?.on("data", (d: Buffer) => (output += d));
                proc.stderr?.on("data", (d: Buffer) => (output += d));

                proc.on("close", (code: number) => {
                  res.setHeader("Content-Type", "application/json");
                  if (code === 0) {
                    res.end(JSON.stringify({ ok: true, output }));
                  } else {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ ok: false, output }));
                  }
                });
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid JSON" }));
              }
            });
            return;
          }

          // Serve caption.txt files
          const captionMatch = req.url?.match(
            /^\/posts\/([^/]+)\/caption\.txt$/
          );
          if (captionMatch) {
            try {
              const caption = await readFile(
                resolve(rootDir, "posts", captionMatch[1], "caption.txt"),
                "utf-8"
              );
              res.setHeader("Content-Type", "text/plain");
              res.end(caption);
            } catch {
              res.statusCode = 404;
              res.end("Not found");
            }
            return;
          }

          next();
        });
      },
    },
  ],
  server: {
    port: 3030,
  },
});

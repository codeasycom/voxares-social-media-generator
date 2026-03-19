import React, { useState, useEffect, useRef, useCallback } from "react";
import { Player } from "@remotion/player";

interface PostMeta {
  slug: string;
  type: "static" | "animated";
  hasVideoTsx: boolean;
  hasPostHtml: boolean;
  caption: string;
}

// Auto-discover all video.tsx modules
const videoModules = import.meta.glob<{
  default: React.FC;
  compositionConfig: {
    fps: number;
    durationInFrames: number;
    width: number;
    height: number;
  };
}>("../../posts/*/video.tsx", { eager: true });

function getVideoModule(slug: string) {
  const key = `../../posts/${slug}/video.tsx`;
  return videoModules[key] ?? null;
}

type RenderStatus = "idle" | "rendering" | "done" | "error";

export const PostView: React.FC<{ slug: string }> = ({ slug }) => {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [imageStatus, setImageStatus] = useState<RenderStatus>("idle");
  const [videoStatus, setVideoStatus] = useState<RenderStatus>("idle");
  const [renderOutput, setRenderOutput] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  // Reset status on slug change
  useEffect(() => {
    setImageStatus("idle");
    setVideoStatus("idle");
    setRenderOutput("");
  }, [slug]);

  const current = posts.find((p) => p.slug === slug);
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevSlug = currentIndex > 0 ? posts[currentIndex - 1].slug : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < posts.length - 1
      ? posts[currentIndex + 1].slug
      : null;

  const videoMod = getVideoModule(slug);
  const isAnimated = !!videoMod;

  // Scale iframe for static posts
  useEffect(() => {
    if (isAnimated) return;
    const scale = () => {
      if (frameRef.current && iframeRef.current) {
        const s = frameRef.current.offsetWidth / 1080;
        iframeRef.current.style.transform = `scale(${s})`;
      }
    };
    scale();
    window.addEventListener("resize", scale);
    return () => window.removeEventListener("resize", scale);
  }, [isAnimated, slug]);

  const caption = current?.caption ?? "";

  const handleRender = useCallback(
    async (mode: "image-static" | "image-animated" | "video") => {
      const isImage = mode !== "video";
      const setStatus = isImage ? setImageStatus : setVideoStatus;
      setStatus("rendering");
      setRenderOutput("");

      try {
        const res = await fetch("/api/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, mode }),
        });
        const data = await res.json();
        setRenderOutput(data.output || "");
        setStatus(data.ok ? "done" : "error");
      } catch {
        setStatus("error");
        setRenderOutput("Network error");
      }
    },
    [slug]
  );

  const imageMode = isAnimated ? "image-animated" : "image-static";

  return (
    <div className="detail">
      <div className="top-bar">
        <a href="#/">&larr; All posts</a>
        <h1>{slug}</h1>
        <div className="nav-arrows">
          {prevSlug && <a href={`#/view/${prevSlug}`}>&larr; Prev</a>}
          {nextSlug && <a href={`#/view/${nextSlug}`}>Next &rarr;</a>}
        </div>
      </div>

      {isAnimated && videoMod ? (
        <>
          <div className="player-frame">
            <Player
              component={videoMod.default}
              compositionWidth={videoMod.compositionConfig.width}
              compositionHeight={videoMod.compositionConfig.height}
              durationInFrames={videoMod.compositionConfig.durationInFrames}
              fps={videoMod.compositionConfig.fps}
              controls
              loop
              style={{ width: "100%" }}
            />
          </div>
          <div className="studio-link">
            <a
              href={`http://localhost:3031`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Remotion Studio &rarr;
            </a>
          </div>
        </>
      ) : (
        <div className="post-frame" ref={frameRef}>
          <iframe
            ref={iframeRef}
            src={`/posts/${slug}/post.html`}
            width={1080}
            height={1080}
          />
        </div>
      )}

      {/* Render buttons */}
      <div className="render-actions">
        <button
          className={`render-btn ${imageStatus}`}
          disabled={imageStatus === "rendering"}
          onClick={() => handleRender(imageMode)}
        >
          {imageStatus === "rendering"
            ? "Rendering..."
            : imageStatus === "done"
              ? "image.png saved"
              : imageStatus === "error"
                ? "Error — retry?"
                : "Render Image"}
        </button>

        {isAnimated && (
          <button
            className={`render-btn ${videoStatus}`}
            disabled={videoStatus === "rendering"}
            onClick={() => handleRender("video")}
          >
            {videoStatus === "rendering"
              ? "Rendering..."
              : videoStatus === "done"
                ? "video.mp4 saved"
                : videoStatus === "error"
                  ? "Error — retry?"
                  : "Render Video"}
          </button>
        )}
      </div>

      {renderOutput && (
        <pre className="render-output">{renderOutput}</pre>
      )}

      {caption && (
        <div className="caption-box">
          <h2>Caption</h2>
          <div className="caption-text">{caption}</div>
        </div>
      )}
    </div>
  );
};

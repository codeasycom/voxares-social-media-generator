import React, { useState, useEffect, useRef, useCallback } from "react";
import { Player } from "@remotion/player";
import { Thumbnail } from "@remotion/player";

interface PostMeta {
  slug: string;
  type: "static" | "animated" | null;
  hasVideoTsx: boolean;
  hasPostHtml: boolean;
  hasStoryHtml: boolean;
  hasStoryTsx: boolean;
  storyType: "static" | "animated" | null;
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

// Auto-discover all story.tsx modules
const storyModules = import.meta.glob<{
  default: React.FC;
  compositionConfig: {
    fps: number;
    durationInFrames: number;
    width: number;
    height: number;
  };
}>("../../posts/*/story.tsx", { eager: true });

function getVideoModule(slug: string) {
  const key = `../../posts/${slug}/video.tsx`;
  return videoModules[key] ?? null;
}

function getStoryModule(slug: string) {
  const key = `../../posts/${slug}/story.tsx`;
  return storyModules[key] ?? null;
}

type RenderStatus = "idle" | "rendering" | "done" | "error";
type ViewMode = "feed" | "story";

export const PostView: React.FC<{ slug: string }> = ({ slug }) => {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const storyFrameRef = useRef<HTMLDivElement>(null);
  const storyIframeRef = useRef<HTMLIFrameElement>(null);
  const [imageStatus, setImageStatus] = useState<RenderStatus>("idle");
  const [videoStatus, setVideoStatus] = useState<RenderStatus>("idle");
  const [renderOutput, setRenderOutput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("feed");

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
    setViewMode("feed");
  }, [slug]);

  const current = posts.find((p) => p.slug === slug);
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevSlug = currentIndex > 0 ? posts[currentIndex - 1].slug : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < posts.length - 1
      ? posts[currentIndex + 1].slug
      : null;

  const videoMod = getVideoModule(slug);
  const storyMod = getStoryModule(slug);
  const isAnimated = !!videoMod;
  const hasStory = !!(storyMod || current?.hasStoryHtml);
  const isStoryAnimated = !!storyMod;

  // If no feed content, default to story view
  useEffect(() => {
    if (current && !current.hasPostHtml && !current.hasVideoTsx && hasStory) {
      setViewMode("story");
    }
  }, [current, hasStory]);

  // Scale iframe for static posts (feed)
  useEffect(() => {
    if (viewMode !== "feed" || isAnimated) return;
    const scale = () => {
      if (frameRef.current && iframeRef.current) {
        const s = frameRef.current.offsetWidth / 1080;
        iframeRef.current.style.transform = `scale(${s})`;
      }
    };
    scale();
    window.addEventListener("resize", scale);
    return () => window.removeEventListener("resize", scale);
  }, [isAnimated, slug, viewMode]);

  // Scale iframe for static stories
  useEffect(() => {
    if (viewMode !== "story" || isStoryAnimated) return;
    const scale = () => {
      if (storyFrameRef.current && storyIframeRef.current) {
        const s = storyFrameRef.current.offsetWidth / 1080;
        storyIframeRef.current.style.transform = `scale(${s})`;
      }
    };
    scale();
    window.addEventListener("resize", scale);
    return () => window.removeEventListener("resize", scale);
  }, [isStoryAnimated, slug, viewMode]);

  const caption = current?.caption ?? "";

  const handleRender = useCallback(
    async (mode: string) => {
      const isImage = mode !== "video" && mode !== "story-video";
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

  // Determine render modes based on view
  const feedImageMode = isAnimated ? "image-animated" : "image-static";
  const storyImageMode = isStoryAnimated ? "story-image-animated" : "story-image-static";

  const hasFeed = !!(current?.hasPostHtml || current?.hasVideoTsx);
  const showTabs = hasFeed && hasStory;

  return (
    <div className={`detail${isAnimated && viewMode === "feed" ? " detail-wide" : ""}`}>
      <div className="top-bar">
        <a href="#/">&larr; All posts</a>
        <h1>{slug}</h1>
        <div className="nav-arrows">
          {prevSlug && <a href={`#/view/${prevSlug}`}>&larr; Prev</a>}
          {nextSlug && <a href={`#/view/${nextSlug}`}>Next &rarr;</a>}
        </div>
      </div>

      {showTabs && (
        <div className="view-tabs">
          <button
            className={`view-tab${viewMode === "feed" ? " active" : ""}`}
            onClick={() => setViewMode("feed")}
          >
            Feed (1080x1080)
          </button>
          <button
            className={`view-tab${viewMode === "story" ? " active" : ""}`}
            onClick={() => setViewMode("story")}
          >
            Story (1080x1920)
          </button>
        </div>
      )}

      {viewMode === "feed" ? (
        <>
          {isAnimated && videoMod ? (
            <>
              <div className="animated-side-by-side">
                <div className="side-by-side-pane">
                  <div className="pane-label">Video</div>
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
                </div>
                <div className="side-by-side-pane">
                  <div className="pane-label">Last Frame</div>
                  <div className="player-frame">
                    <Thumbnail
                      component={videoMod.default}
                      compositionWidth={videoMod.compositionConfig.width}
                      compositionHeight={videoMod.compositionConfig.height}
                      durationInFrames={videoMod.compositionConfig.durationInFrames}
                      fps={videoMod.compositionConfig.fps}
                      frameToDisplay={videoMod.compositionConfig.durationInFrames - 1}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
              <div className="post-links">
                <a
                  href={`http://localhost:3031`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Remotion Studio &rarr;
                </a>
                <button
                  className="link-btn"
                  onClick={() => fetch(`/api/open/${slug}`, { method: "POST" })}
                >
                  Open Folder
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="post-frame" ref={frameRef}>
                <iframe
                  ref={iframeRef}
                  src={`/posts/${slug}/post.html`}
                  width={1080}
                  height={1080}
                />
              </div>
              <div className="post-links">
                <button
                  className="link-btn"
                  onClick={() => fetch(`/api/open/${slug}`, { method: "POST" })}
                >
                  Open Folder
                </button>
              </div>
            </>
          )}
          <div className="render-actions">
            <button
              className={`render-btn ${imageStatus}`}
              disabled={imageStatus === "rendering"}
              onClick={() => handleRender(feedImageMode)}
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
        </>
      ) : (
        <>
          {isStoryAnimated && storyMod ? (
            <>
              <div className="player-frame" style={{ maxWidth: 360 }}>
                <Player
                  component={storyMod.default}
                  compositionWidth={storyMod.compositionConfig.width}
                  compositionHeight={storyMod.compositionConfig.height}
                  durationInFrames={storyMod.compositionConfig.durationInFrames}
                  fps={storyMod.compositionConfig.fps}
                  controls
                  loop
                  style={{ width: "100%" }}
                />
              </div>
              <div className="post-links">
                <a
                  href={`http://localhost:3031`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Remotion Studio &rarr;
                </a>
                <button
                  className="link-btn"
                  onClick={() => fetch(`/api/open/${slug}`, { method: "POST" })}
                >
                  Open Folder
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="story-frame" ref={storyFrameRef}>
                <iframe
                  ref={storyIframeRef}
                  src={`/posts/${slug}/story.html`}
                  width={1080}
                  height={1920}
                />
              </div>
              <div className="post-links">
                <button
                  className="link-btn"
                  onClick={() => fetch(`/api/open/${slug}`, { method: "POST" })}
                >
                  Open Folder
                </button>
              </div>
            </>
          )}
          <div className="render-actions">
            <button
              className={`render-btn ${imageStatus}`}
              disabled={imageStatus === "rendering"}
              onClick={() => handleRender(storyImageMode)}
            >
              {imageStatus === "rendering"
                ? "Rendering..."
                : imageStatus === "done"
                  ? "story-image.png saved"
                  : imageStatus === "error"
                    ? "Error — retry?"
                    : "Render Story Image"}
            </button>

            {isStoryAnimated && (
              <button
                className={`render-btn ${videoStatus}`}
                disabled={videoStatus === "rendering"}
                onClick={() => handleRender("story-video")}
              >
                {videoStatus === "rendering"
                  ? "Rendering..."
                  : videoStatus === "done"
                    ? "story-video.mp4 saved"
                    : videoStatus === "error"
                      ? "Error — retry?"
                      : "Render Story Video"}
              </button>
            )}
          </div>
        </>
      )}

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

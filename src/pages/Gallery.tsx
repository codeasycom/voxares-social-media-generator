import React, { useState, useEffect } from "react";
import { StaticCard } from "../components/StaticCard";
import { AnimatedCard } from "../components/AnimatedCard";

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

// Auto-discover all video.tsx modules in posts/
const videoModules = import.meta.glob<{
  default: React.FC;
  compositionConfig: {
    fps: number;
    durationInFrames: number;
    width: number;
    height: number;
  };
}>("../../posts/*/video.tsx", { eager: true });

// Auto-discover all story.tsx modules in posts/
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

function hasStoryModule(slug: string) {
  const key = `../../posts/${slug}/story.tsx`;
  return !!storyModules[key];
}

export const Gallery: React.FC = () => {
  const [posts, setPosts] = useState<PostMeta[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  return (
    <>
      <h1>Post Preview ({posts.length} posts)</h1>
      <div className="grid">
        {posts.map((post) => {
          const hasStory = post.hasStoryHtml || post.hasStoryTsx || hasStoryModule(post.slug);

          if (post.type === "animated") {
            const mod = getVideoModule(post.slug);
            if (mod) {
              return (
                <AnimatedCard
                  key={post.slug}
                  slug={post.slug}
                  caption={post.caption}
                  compositionModule={mod}
                  hasStory={hasStory}
                />
              );
            }
          }
          // Static post (or animated without loadable module — fallback to iframe)
          if (post.hasPostHtml) {
            return (
              <StaticCard
                key={post.slug}
                slug={post.slug}
                caption={post.caption}
                hasStory={hasStory}
              />
            );
          }
          // Story-only post (no feed content) — show as static card if story.html exists
          if (hasStory && post.hasStoryHtml) {
            return (
              <StaticCard
                key={post.slug}
                slug={post.slug}
                caption={post.caption}
                hasStory={hasStory}
                storyOnly
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

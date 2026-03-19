import React, { useState, useEffect } from "react";
import { StaticCard } from "../components/StaticCard";
import { AnimatedCard } from "../components/AnimatedCard";

interface PostMeta {
  slug: string;
  type: "static" | "animated";
  hasVideoTsx: boolean;
  hasPostHtml: boolean;
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

function getVideoModule(slug: string) {
  const key = `../../posts/${slug}/video.tsx`;
  return videoModules[key] ?? null;
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
          if (post.type === "animated") {
            const mod = getVideoModule(post.slug);
            if (mod) {
              return (
                <AnimatedCard
                  key={post.slug}
                  slug={post.slug}
                  caption={post.caption}
                  compositionModule={mod}
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
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

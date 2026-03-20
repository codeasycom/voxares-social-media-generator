import React, { useRef, useEffect } from "react";

interface Props {
  slug: string;
  caption: string;
  hasStory?: boolean;
  storyOnly?: boolean;
}

export const StaticCard: React.FC<Props> = ({ slug, caption, hasStory, storyOnly }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const scale = () => {
      if (wrapRef.current && iframeRef.current) {
        const s = wrapRef.current.offsetWidth / 1080;
        iframeRef.current.style.transform = `scale(${s})`;
      }
    };
    scale();
    window.addEventListener("resize", scale);
    return () => window.removeEventListener("resize", scale);
  }, []);

  return (
    <a href={`#/view/${slug}`} className="card">
      <div className="card-preview" ref={wrapRef}>
        <iframe
          ref={iframeRef}
          src={`/posts/${slug}/${storyOnly ? "story.html" : "post.html"}`}
          width={1080}
          height={storyOnly ? 1920 : 1080}
        />
        {hasStory && <span className="story-badge">STORY</span>}
      </div>
      <p className="label">{slug}</p>
      {caption && <div className="caption-preview">{caption}</div>}
    </a>
  );
};

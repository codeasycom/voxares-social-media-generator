import React, { useRef, useEffect } from "react";

interface Props {
  slug: string;
  caption: string;
}

export const StaticCard: React.FC<Props> = ({ slug, caption }) => {
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
          src={`/posts/${slug}/post.html`}
          width={1080}
          height={1080}
        />
      </div>
      <p className="label">{slug}</p>
      {caption && <div className="caption-preview">{caption}</div>}
    </a>
  );
};

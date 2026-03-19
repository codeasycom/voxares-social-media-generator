import React, { Suspense } from "react";
import { Thumbnail } from "@remotion/player";

interface Props {
  slug: string;
  caption: string;
  compositionModule: {
    default: React.FC;
    compositionConfig: {
      fps: number;
      durationInFrames: number;
      width: number;
      height: number;
    };
  };
}

export const AnimatedCard: React.FC<Props> = ({
  slug,
  caption,
  compositionModule,
}) => {
  const { compositionConfig } = compositionModule;
  const Component = compositionModule.default;

  return (
    <a href={`#/view/${slug}`} className="card">
      <div className="card-preview">
        <div className="animated-thumbnail">
          <Suspense fallback={<div style={{ background: "#f5f5f5", width: "100%", height: "100%" }} />}>
            <Thumbnail
              component={Component}
              compositionWidth={compositionConfig.width}
              compositionHeight={compositionConfig.height}
              durationInFrames={compositionConfig.durationInFrames}
              fps={compositionConfig.fps}
              frameToDisplay={compositionConfig.durationInFrames - 1}
              style={{ width: "100%", height: "100%" }}
            />
          </Suspense>
        </div>
        <span className="video-badge">VIDEO</span>
      </div>
      <p className="label">{slug}</p>
      {caption && <div className="caption-preview">{caption}</div>}
    </a>
  );
};

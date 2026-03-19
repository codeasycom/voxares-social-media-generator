import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { DIVIDER_LINE, TEXT_MUTED } from "../lib/colors";
import { interFamily } from "../lib/fonts";

export const VsDivider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line grows vertically
  const lineHeight = interpolate(frame - delay, [0, 20], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label fades in after line starts
  const labelProgress = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });

  return (
    <div
      style={{
        width: 3,
        position: "relative",
        overflow: "visible",
        flexShrink: 0,
        zIndex: 2,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: DIVIDER_LINE,
          clipPath: `inset(${(100 - lineHeight) / 2}% 0)`,
        }}
      />
      {/* VS label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
          background: DIVIDER_LINE,
          color: TEXT_MUTED,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: interFamily,
          padding: "8px 4px",
          borderRadius: 4,
          writingMode: "vertical-lr",
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: labelProgress,
          willChange: "opacity",
        }}
      >
        VS
      </div>
    </div>
  );
};

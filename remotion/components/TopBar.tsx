import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const TopBar: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();

  const clipProgress = interpolate(frame - delay, [0, 15], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: "linear-gradient(90deg, #ef4444, #0096ff)",
        zIndex: 10,
        clipPath: `inset(0 ${100 - clipProgress}% 0 0)`,
      }}
    />
  );
};

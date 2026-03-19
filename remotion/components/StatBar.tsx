import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { BLUE_PRIMARY, BLUE_DARK } from "../lib/colors";
import { interFamily } from "../lib/fonts";

export const StatBar: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const translateY = interpolate(progress, [0, 1], [60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 24,
        background: `linear-gradient(135deg, ${BLUE_PRIMARY}, ${BLUE_DARK})`,
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: 600,
          fontFamily: interFamily,
        }}
      >
        Manje ručnog posla. Više vremena za ono što je važno.
      </span>
    </div>
  );
};

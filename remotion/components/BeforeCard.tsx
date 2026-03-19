import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { RED_BORDER, TEXT_BEFORE_TITLE, TEXT_MUTED, RED_LIGHT, RED_DARK } from "../lib/colors";
import { interFamily } from "../lib/fonts";

interface BeforeCardProps {
  delay: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const BeforeCard: React.FC<BeforeCardProps> = ({
  delay,
  icon,
  title,
  desc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-40, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: 22,
        borderRadius: 14,
        background: "white",
        border: `1px solid ${RED_BORDER}`,
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: `linear-gradient(135deg, ${RED_LIGHT}, ${RED_DARK})`,
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: TEXT_BEFORE_TITLE,
            fontFamily: interFamily,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.4,
            color: TEXT_MUTED,
            fontFamily: interFamily,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

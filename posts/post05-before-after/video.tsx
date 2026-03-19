import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { TopBar } from "../../remotion/components/TopBar";
import { VoxaresLogo } from "../../remotion/components/VoxaresLogo";
import { BeforeCard } from "../../remotion/components/BeforeCard";
import { AfterCard } from "../../remotion/components/AfterCard";
import { VsDivider } from "../../remotion/components/VsDivider";
import { StatBar } from "../../remotion/components/StatBar";
import {
  BG_NEUTRAL,
  BG_LIGHT_BLUE,
  RED_DARK,
  BLUE_PRIMARY,
  TEXT_BEFORE_TITLE,
  TEXT_DARK,
  THEME_BLUE,
  THEME_GREEN,
  THEME_AMBER,
  THEME_PURPLE,
} from "../../remotion/lib/colors";
import { interFamily, jakartaFamily } from "../../remotion/lib/fonts";

// SVG icons as React elements (white stroke, matching post.html)
const iconStyle = { width: 20, height: 20 };

const IconMessage = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconXCircle = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconFile = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconUserX = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="18" y1="8" x2="23" y2="13" />
    <line x1="23" y1="8" x2="18" y2="13" />
  </svg>
);

const IconBell = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconTarget = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// Animated side panel background
const SidePanel: React.FC<{
  side: "before" | "after";
  delay: number;
  children: React.ReactNode;
}> = ({ side, delay, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px 44px 130px",
        background: side === "before" ? BG_NEUTRAL : BG_LIGHT_BLUE,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

// Animated side label + title
const SideHeader: React.FC<{
  side: "before" | "after";
  label: string;
  title: string;
  delay: number;
}> = ({ side, label, title, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const titleProgress = spring({
    frame: frame - delay - 6,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const labelY = interpolate(labelProgress, [0, 1], [20, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  return (
    <>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 3,
          marginBottom: 14,
          marginTop: 20,
          color: side === "before" ? RED_DARK : BLUE_PRIMARY,
          fontFamily: interFamily,
          transform: `translateY(${labelY}px)`,
          opacity: interpolate(labelProgress, [0, 1], [0, 1]),
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: jakartaFamily,
          fontSize: 34,
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: 16,
          color: side === "before" ? TEXT_BEFORE_TITLE : TEXT_DARK,
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>
    </>
  );
};

// Composition metadata (used by preview app and render scripts)
export const compositionConfig = {
  fps: 30,
  durationInFrames: 300,
  width: 1080,
  height: 1080,
};

// Frame timing (30fps)
const FRAMES = {
  topBar: 0, // 0.0s
  logo: 9, // 0.3s
  beforePanel: 15, // 0.5s
  beforeLabel: 15, // 0.5s
  beforeTitle: 30, // 1.0s
  beforeCards: [45, 60, 75, 90], // 1.5s, staggered ~0.5s
  vsDivider: 120, // 4.0s
  afterPanel: 135, // 4.5s
  afterLabel: 135, // 4.5s
  afterTitle: 150, // 5.0s — slightly earlier so title visible with cards
  afterCards: [165, 180, 195, 210], // 5.5s, staggered ~0.5s
  statBar: 240, // 8.0s
};

const Post05BeforeAfter: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        fontFamily: interFamily,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top gradient bar */}
      <TopBar delay={FRAMES.topBar} />

      {/* Logo pill */}
      <VoxaresLogo delay={FRAMES.logo} />

      {/* Split layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          paddingTop: 6,
        }}
      >
        {/* Before side */}
        <SidePanel side="before" delay={FRAMES.beforePanel}>
          <SideHeader
            side="before"
            label="Prije Voxaresa"
            title="Puno ručnog posla"
            delay={FRAMES.beforeLabel}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <BeforeCard
              delay={FRAMES.beforeCards[0]}
              icon={IconMessage}
              title="Svaka poruka ispočetka"
              desc="Iste poruke svim klijentima"
            />
            <BeforeCard
              delay={FRAMES.beforeCards[1]}
              icon={IconXCircle}
              title="Prazni termini"
              desc="Klijenti zaborave i ne pojave se"
            />
            <BeforeCard
              delay={FRAMES.beforeCards[2]}
              icon={IconFile}
              title="Papiri i ručni unos"
              desc="Administracija koja oduzima vrijeme"
            />
            <BeforeCard
              delay={FRAMES.beforeCards[3]}
              icon={IconUserX}
              title="Izgubljeni klijenti"
              desc="Tko prestane dolaziti ostane zaboravljen"
            />
          </div>
        </SidePanel>

        {/* VS divider */}
        <VsDivider delay={FRAMES.vsDivider} />

        {/* After side */}
        <SidePanel side="after" delay={FRAMES.afterPanel}>
          <SideHeader
            side="after"
            label="Poslije"
            title="Voxares radi umjesto vas"
            delay={FRAMES.afterLabel}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <AfterCard
              delay={FRAMES.afterCards[0]}
              icon={IconMessage}
              title="Personalizirana komunikacija"
              desc="Prava poruka u pravo vrijeme"
              gradient={THEME_BLUE}
            />
            <AfterCard
              delay={FRAMES.afterCards[1]}
              icon={IconBell}
              title="Automatski podsjetnici"
              desc="Uvijek znate tko dolazi a tko ne"
              gradient={THEME_GREEN}
            />
            <AfterCard
              delay={FRAMES.afterCards[2]}
              icon={IconFile}
              title="Digitalni obrasci"
              desc="Klijenti sve ispune prije dolaska"
              gradient={THEME_AMBER}
            />
            <AfterCard
              delay={FRAMES.afterCards[3]}
              icon={IconTarget}
              title="Ciljane kampanje"
              desc="Vratite klijente pravom porukom"
              gradient={THEME_PURPLE}
            />
          </div>
        </SidePanel>
      </div>

      {/* Stat bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5 }}>
        <StatBar delay={FRAMES.statBar} />
      </div>
    </AbsoluteFill>
  );
};

export { Post05BeforeAfter };
export default Post05BeforeAfter;

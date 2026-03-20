import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import {
  BLUE_PRIMARY,
  BLUE_DARK,
  TEXT_DARK,
  TEXT_MUTED,
  THEME_GREEN,
  THEME_BLUE,
  THEME_AMBER,
} from "../../remotion/lib/colors";
import { interFamily, jakartaFamily } from "../../remotion/lib/fonts";

// Story composition metadata (9:16)
export const compositionConfig = {
  fps: 30,
  durationInFrames: 300,
  width: 1080,
  height: 1920,
};

// Benefit card data
const cards: {
  icon: "check" | "form" | "calendar";
  title: string;
  detail: string;
  color: { from: string; to: string };
}[] = [
  {
    icon: "check",
    title: "Klijenti su potvrdili dolazak",
    detail: "4 potvrde primljene, niste morali nikoga kontaktirati.",
    color: THEME_GREEN,
  },
  {
    icon: "form",
    title: "Obrasci su ispunjeni prije dolaska",
    detail: "Klijenti su ispunili obrasce od kuće, sve je spremno.",
    color: THEME_AMBER,
  },
  {
    icon: "calendar",
    title: "Raspored za danas je spreman",
    detail: "Svi termini i potvrde su na jednom mjestu.",
    color: THEME_BLUE,
  },
];

// Frame timing
const FRAMES = {
  accentBar: 0,
  title: 8,
  cards: [40, 70, 100],
  cup: 140,
  subtitle: 155,
  logo: 175,
};

// Accent bar at top
const AccentBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - FRAMES.accentBar, [0, 15], [0, 100], {
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
        background: `linear-gradient(90deg, ${BLUE_PRIMARY}, ${BLUE_DARK})`,
        clipPath: `inset(0 ${100 - progress}% 0 0)`,
        zIndex: 10,
      }}
    />
  );
};

// Title
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - FRAMES.title,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const y = interpolate(progress, [0, 1], [30, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: jakartaFamily,
        fontSize: 52,
        fontWeight: 800,
        lineHeight: 1.2,
        color: TEXT_DARK,
        textAlign: "center",
        padding: "0 80px",
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      Kako izgleda jutro s Voxaresom
    </div>
  );
};

// Blue cappuccino cup SVG
const CoffeeCup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - FRAMES.cup,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
  });

  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 280 220"
        fill="none"
        style={{ width: 320, height: 250 }}
      >
        <defs>
          <linearGradient
            id="cup_body"
            x1="140"
            y1="70"
            x2="140"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#edf2f7" />
          </linearGradient>
          <linearGradient
            id="cup_foam"
            x1="140"
            y1="65"
            x2="140"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#faf5ef" />
            <stop offset="1" stopColor="#ede4d8" />
          </linearGradient>
          <linearGradient
            id="cup_saucer"
            x1="140"
            y1="170"
            x2="140"
            y2="200"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e4ecf4" />
            <stop offset="1" stopColor="#d0dcea" />
          </linearGradient>
        </defs>

        {/* Shadow under saucer */}
        <ellipse
          cx="140"
          cy="198"
          rx="100"
          ry="12"
          fill="#d0dcea"
          opacity="0.4"
        />

        {/* Saucer */}
        <ellipse cx="140" cy="185" rx="110" ry="18" fill="url(#cup_saucer)" />
        <ellipse cx="140" cy="182" rx="96" ry="13" fill="#eaf0f7" />

        {/* Cup body */}
        <path
          d="M60 80 L68 170 C68 176 100 184 140 184 C180 184 212 176 212 170 L220 80 Z"
          fill="url(#cup_body)"
        />
        <ellipse cx="140" cy="174" rx="72" ry="12" fill="#edf2f7" />

        {/* Handle */}
        <path
          d="M220 95 C248 95 258 115 258 132 C258 149 248 164 220 164"
          stroke="url(#cup_body)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M220 95 C248 95 258 115 258 132 C258 149 248 164 220 164"
          stroke="url(#cup_body)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cup rim */}
        <ellipse cx="140" cy="80" rx="82" ry="18" fill="white" />
        <ellipse cx="140" cy="80" rx="76" ry="14" fill="#f8f4f0" />

        {/* Foam surface */}
        <ellipse cx="140" cy="82" rx="70" ry="11" fill="url(#cup_foam)" />

        {/* Latte art — Voxares bird in blue */}
        <g transform="translate(114, 110) scale(0.22)" opacity="0.22">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M124.674 50.7719C132.352 -4.85867 186.107 -2.36275 199.501 2.10196C208.828 5.21142 228.027 22.4676 239.96 34.0941C241.407 35.504 239.929 38.6282 237.939 38.9789C221.05 41.956 200.329 65.5677 206.001 75.602C226.147 111.245 211.043 146 199.501 163.602C186.689 183.14 149.656 219.881 101.001 216.694C99.0806 216.568 98.6299 214.037 100.284 213.054C197.366 155.341 164.45 76.6977 125.613 52.7709C124.934 52.3529 124.565 51.5614 124.674 50.7719Z"
            fill="#0096ff"
          />
          <path
            d="M150.489 134.235C151.569 133.068 153.387 133.589 153.296 135.176C152.112 155.594 111.785 204.326 74.3757 214.4C74.1257 214.467 73.8629 214.482 73.6062 214.448C55.8624 212.099 48.2225 210.13 37.74 199.768C36.8343 198.873 37.0236 197.368 38.114 196.71C60.0892 183.454 69.615 182.599 90.5007 173.999C115.296 163.789 121.655 165.399 150.489 134.235Z"
            fill="#0096ff"
          />
          <path
            d="M22.5095 128.7C21.9966 127.271 23.298 125.932 24.782 126.251C60.1523 133.871 108.831 129.388 137.567 129.023C139.102 129.003 140.023 130.634 139.115 131.872C132.007 141.563 111.999 159.197 71.0007 160.999C38.1197 160.999 26.167 138.887 22.5095 128.7Z"
            fill="#0096ff"
          />
          <path
            d="M3.46751 72.4076C3.14567 70.5548 5.29606 68.7498 6.98313 69.5805C45.601 88.608 95.9286 91.7024 146.344 97.3695C147.059 97.4498 147.682 97.9078 147.935 98.5805C150.099 104.34 148.896 107.939 147.812 113.35C147.622 114.301 146.785 114.999 145.815 115C96.1347 115.053 57.8952 117.415 48.5007 114.999C2.42683 103.152 5.81481 85.9129 3.46751 72.4076Z"
            fill="#0096ff"
          />
          <path
            d="M0.0456338 9.77676C0.0886391 8.42212 1.4571 7.50078 2.70579 8.02774C20.7782 15.6545 47.7893 32.7004 66.6755 39.4994C90.1538 47.9517 134.357 70.5157 140.48 81.9281C141.038 82.9674 140.168 83.9858 138.992 83.8988C124.801 82.8482 71.2156 73.8816 58.6755 71.9994C47.0024 70.2474 -1.6974 64.6855 0.0456338 9.77676Z"
            fill="#0096ff"
          />
        </g>

        {/* Steam lines */}
        <path
          d="M120 58 C120 50 126 44 120 36"
          stroke={BLUE_PRIMARY}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
        <path
          d="M140 54 C140 46 146 40 140 32"
          stroke={BLUE_PRIMARY}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.12"
        />
        <path
          d="M160 58 C160 50 154 44 160 36"
          stroke={BLUE_PRIMARY}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
      </svg>
    </div>
  );
};

// Card icon SVGs
const CardIcon: React.FC<{
  type: "check" | "form" | "calendar";
  size?: number;
}> = ({ type, size = 22 }) => {
  const style = { width: size, height: size, flexShrink: 0 } as const;

  if (type === "check") {
    return (
      <svg viewBox="0 0 24 24" fill="none" style={style}>
        <path
          d="M20 6L9 17l-5-5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "form") {
    return (
      <svg viewBox="0 0 24 24" fill="none" style={style}>
        <rect
          x="5"
          y="2"
          width="14"
          height="20"
          rx="2.5"
          stroke="white"
          strokeWidth="1.8"
        />
        <path
          d="M9 8h6"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9 12h6"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9 16h4"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" style={style}>
      <rect
        x="3"
        y="6"
        width="18"
        height="15"
        rx="2.5"
        stroke="white"
        strokeWidth="1.8"
      />
      <path d="M3 11h18" stroke="white" strokeWidth="1.8" />
      <path d="M8 3v5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M16 3v5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="7" y="14" width="3" height="2.5" rx="0.5" fill="white" />
      <rect x="12" y="14" width="3" height="2.5" rx="0.5" fill="white" />
    </svg>
  );
};

// Full-width benefit card (stacked vertically for story format)
const BenefitCard: React.FC<{
  card: (typeof cards)[number];
  delay: number;
  index: number;
}> = ({ card, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const slideY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        transform: `translateY(${slideY}px)`,
        opacity,
        width: "100%",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          borderLeft: `5px solid ${card.color.from}`,
          padding: "28px 32px",
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${card.color.from}, ${card.color.to})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CardIcon type={card.icon} size={24} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: interFamily,
              fontSize: 24,
              fontWeight: 700,
              color: TEXT_DARK,
              lineHeight: 1.3,
              marginBottom: 6,
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              fontFamily: interFamily,
              fontSize: 19,
              fontWeight: 400,
              color: TEXT_MUTED,
              lineHeight: 1.45,
            }}
          >
            {card.detail}
          </div>
        </div>
      </div>
    </div>
  );
};

// Subtitle text
const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - FRAMES.subtitle,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [15, 0]);

  return (
    <div
      style={{
        fontFamily: jakartaFamily,
        fontSize: 34,
        fontWeight: 700,
        color: BLUE_PRIMARY,
        textAlign: "center",
        padding: "0 80px",
        lineHeight: 1.4,
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      Sve je spremno dok popijete prvu kavu.
    </div>
  );
};

// Voxares wordmark
const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - FRAMES.logo,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity,
      }}
    >
      <svg
        viewBox="0 0 241 217"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 32, height: 28 }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M124.674 50.7719C132.352 -4.85867 186.107 -2.36275 199.501 2.10196C208.828 5.21142 228.027 22.4676 239.96 34.0941C241.407 35.504 239.929 38.6282 237.939 38.9789C221.05 41.956 200.329 65.5677 206.001 75.602C226.147 111.245 211.043 146 199.501 163.602C186.689 183.14 149.656 219.881 101.001 216.694C99.0806 216.568 98.6299 214.037 100.284 213.054C197.366 155.341 164.45 76.6977 125.613 52.7709C124.934 52.3529 124.565 51.5614 124.674 50.7719ZM189.001 12.9994C183.478 12.9994 179.001 17.4767 179.001 22.9994C179.001 28.5223 183.478 32.9994 189.001 32.9994C194.523 32.9993 199.001 28.5222 199.001 22.9994C199.001 17.4768 194.523 12.9996 189.001 12.9994Z"
          fill="url(#g1_wm_s)"
        />
        <path
          d="M150.489 134.235C151.569 133.068 153.387 133.589 153.296 135.176C152.112 155.594 111.785 204.326 74.3757 214.4C74.1257 214.467 73.8629 214.482 73.6062 214.448C55.8624 212.099 48.2225 210.13 37.74 199.768C36.8343 198.873 37.0236 197.368 38.114 196.71C60.0892 183.454 69.615 182.599 90.5007 173.999C115.296 163.789 121.655 165.399 150.489 134.235Z"
          fill="url(#g1_wm_s)"
        />
        <path
          d="M22.5095 128.7C21.9966 127.271 23.298 125.932 24.782 126.251C60.1523 133.871 108.831 129.388 137.567 129.023C139.102 129.003 140.023 130.634 139.115 131.872C132.007 141.563 111.999 159.197 71.0007 160.999C38.1197 160.999 26.167 138.887 22.5095 128.7Z"
          fill="url(#g1_wm_s)"
        />
        <path
          d="M3.46751 72.4076C3.14567 70.5548 5.29606 68.7498 6.98313 69.5805C45.601 88.608 95.9286 91.7024 146.344 97.3695C147.059 97.4498 147.682 97.9078 147.935 98.5805C150.099 104.34 148.896 107.939 147.812 113.35C147.622 114.301 146.785 114.999 145.815 115C96.1347 115.053 57.8952 117.415 48.5007 114.999C2.42683 103.152 5.81481 85.9129 3.46751 72.4076Z"
          fill="url(#g1_wm_s)"
        />
        <path
          d="M0.0456338 9.77676C0.0886391 8.42212 1.4571 7.50078 2.70579 8.02774C20.7782 15.6545 47.7893 32.7004 66.6755 39.4994C90.1538 47.9517 134.357 70.5157 140.48 81.9281C141.038 82.9674 140.168 83.9858 138.992 83.8988C124.801 82.8482 71.2156 73.8816 58.6755 71.9994C47.0024 70.2474 -1.6974 64.6855 0.0456338 9.77676Z"
          fill="url(#g1_wm_s)"
        />
        <defs>
          <linearGradient
            id="g1_wm_s"
            x1="120"
            y1="0"
            x2="120"
            y2="217"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0096FF" />
            <stop offset="1" stopColor="#0084E1" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          fontSize: 19,
          fontWeight: 700,
          color: BLUE_PRIMARY,
          fontFamily: interFamily,
        }}
      >
        Voxares
      </span>
    </div>
  );
};

const Post02MorningRoutineStory: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#f2f8fd",
        fontFamily: interFamily,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <AccentBar />

      {/* Title section */}
      <div
        style={{
          paddingTop: 220,
          paddingBottom: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <Title />
      </div>

      {/* Stacked benefit cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          padding: "0 56px",
          zIndex: 5,
        }}
      >
        {cards.map((card, i) => (
          <BenefitCard key={i} card={card} delay={FRAMES.cards[i]} index={i} />
        ))}
      </div>

      {/* Cup + Subtitle */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          zIndex: 2,
        }}
      >
        <CoffeeCup />
        <Subtitle />
      </div>

      {/* Wordmark centered at bottom */}
      <div
        style={{
          paddingBottom: 80,
          display: "flex",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <Wordmark />
      </div>
    </AbsoluteFill>
  );
};

export { Post02MorningRoutineStory };
export default Post02MorningRoutineStory;

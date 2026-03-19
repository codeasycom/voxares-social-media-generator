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
  THEME_AMBER,
  THEME_BLUE,
  THEME_PURPLE,
} from "../../remotion/lib/colors";
import { interFamily, jakartaFamily } from "../../remotion/lib/fonts";

// Composition metadata
export const compositionConfig = {
  fps: 30,
  durationInFrames: 300,
  width: 1080,
  height: 1080,
};

// Template variable icon (inbox icon matching the app)
const VarIcon: React.FC = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    style={{
      width: 13,
      height: 13,
      flexShrink: 0,
      marginRight: 3,
    }}
  >
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.3" fill="none" />
    <path d="M2 9.5h3.5L7 11h2l1.5-1.5H14" stroke="white" strokeWidth="1.3" fill="none" />
  </svg>
);

// Message part types
type MessagePart =
  | { type: "text"; value: string }
  | { type: "var"; value: string };

// Feature data
const features: {
  label: string;
  subtitle: string;
  color: { from: string; to: string };
  messageParts: MessagePart[];
  time: string;
}[] = [
  {
    label: "Podsjetnici",
    subtitle: "SMS podsjetnici za termine",
    color: THEME_GREEN,
    messageParts: [
      { type: "text", value: "Pozdrav " },
      { type: "var", value: "Ana" },
      { type: "text", value: ", vaš termin je " },
      { type: "var", value: "15.03. 14:00" },
      { type: "text", value: ". Potvrdite dolazak putem linka: " },
      { type: "var", value: "Potvrda dolaska" },
    ],
    time: "09:15",
  },
  {
    label: "Digitalni obrasci",
    subtitle: "Klijenti ispune prije dolaska",
    color: THEME_AMBER,
    messageParts: [
      { type: "text", value: "Pozdrav " },
      { type: "var", value: "Marko" },
      { type: "text", value: ", molimo ispunite obrazac prije posjeta: " },
      { type: "var", value: "Obrazac" },
    ],
    time: "09:30",
  },
  {
    label: "Personalizirane poruke",
    subtitle: "Zahvale, praćenje, obavijesti",
    color: THEME_BLUE,
    messageParts: [
      { type: "text", value: "Hvala na posjetu, " },
      { type: "var", value: "Ana" },
      { type: "text", value: ". Javite nam se ako imate pitanja." },
    ],
    time: "15:00",
  },
  {
    label: "Kampanje",
    subtitle: "Reaktivacija i ciljane ponude",
    color: THEME_PURPLE,
    messageParts: [
      { type: "var", value: "Ivana" },
      { type: "text", value: ", dugo vas nismo vidjeli. Imamo ponudu za vas: " },
      { type: "var", value: "Ponuda" },
    ],
    time: "10:00",
  },
];

// Frame timing
const FRAMES = {
  accentBar: 0,
  title: 8,
  subtitle: 18,
  cards: [40, 70, 100, 130],
  bubbles: [50, 80, 110, 140],
  logo: 185,
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
        fontSize: 42,
        fontWeight: 800,
        lineHeight: 1.2,
        color: TEXT_DARK,
        textAlign: "center",
        padding: "0 80px",
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      Evo kako Voxares komunicira s vašim klijentima
    </div>
  );
};

// Subtitle
const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - FRAMES.subtitle,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: interFamily,
        fontSize: 20,
        fontWeight: 400,
        color: TEXT_MUTED,
        textAlign: "center",
        marginTop: 14,
        opacity,
      }}
    >
      Svaka vrsta poruke na jednom mjestu
    </div>
  );
};

// App-style message bubble with template variable pills
const MessageBubble: React.FC<{
  parts: MessagePart[];
  time: string;
  delay: number;
}> = ({ parts, time, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [15, 0]);

  return (
    <div
      style={{
        transform: `translateY(${y}px) scale(${scale})`,
        opacity,
        transformOrigin: "right bottom",
      }}
    >
      {/* Blue bubble */}
      <div
        style={{
          background: BLUE_PRIMARY,
          borderRadius: "18px 18px 8px 18px",
          padding: "12px 16px",
          color: "white",
          fontFamily: interFamily,
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 2,
        }}
      >
        {parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <span key={i}>{part.value}</span>
            );
          }
          // Template variable pill
          return (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 20,
                padding: "2px 10px 2px 6px",
                margin: "0 2px",
                border: "1px solid rgba(255,255,255,0.3)",
                verticalAlign: "middle",
                lineHeight: 1.4,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <VarIcon />
              {part.value}
            </span>
          );
        })}
      </div>
      {/* Timestamp */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 4,
          marginTop: 4,
          paddingRight: 4,
        }}
      >
        <span
          style={{
            fontFamily: interFamily,
            fontSize: 11,
            fontWeight: 400,
            color: TEXT_MUTED,
          }}
        >
          {time}
        </span>
      </div>
    </div>
  );
};

// Feature card
const FeatureCard: React.FC<{
  feature: (typeof features)[number];
  cardDelay: number;
  bubbleDelay: number;
}> = ({ feature, cardDelay, bubbleDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - cardDelay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        flex: 1,
        background: "white",
        borderRadius: 20,
        border: `2px solid ${feature.color.from}40`,
        padding: "18px 20px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: "center center",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div>
        {/* Dot + label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${feature.color.from}, ${feature.color.to})`,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: interFamily,
              fontSize: 17,
              fontWeight: 700,
              color: TEXT_DARK,
            }}
          >
            {feature.label}
          </div>
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontFamily: interFamily,
            fontSize: 14,
            fontWeight: 400,
            color: TEXT_MUTED,
            paddingLeft: 22,
          }}
        >
          {feature.subtitle}
        </div>
      </div>

      {/* Message bubble — pushed to bottom */}
      <div style={{ marginTop: "auto" }}>
        <MessageBubble
          parts={feature.messageParts}
          time={feature.time}
          delay={bubbleDelay}
        />
      </div>
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
        position: "absolute",
        bottom: 36,
        right: 44,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
      }}
    >
      <svg
        viewBox="0 0 241 217"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 28, height: 25 }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M124.674 50.7719C132.352 -4.85867 186.107 -2.36275 199.501 2.10196C208.828 5.21142 228.027 22.4676 239.96 34.0941C241.407 35.504 239.929 38.6282 237.939 38.9789C221.05 41.956 200.329 65.5677 206.001 75.602C226.147 111.245 211.043 146 199.501 163.602C186.689 183.14 149.656 219.881 101.001 216.694C99.0806 216.568 98.6299 214.037 100.284 213.054C197.366 155.341 164.45 76.6977 125.613 52.7709C124.934 52.3529 124.565 51.5614 124.674 50.7719ZM189.001 12.9994C183.478 12.9994 179.001 17.4767 179.001 22.9994C179.001 28.5223 183.478 32.9994 189.001 32.9994C194.523 32.9993 199.001 28.5222 199.001 22.9994C199.001 17.4768 194.523 12.9996 189.001 12.9994Z"
          fill="url(#g1_wm)"
        />
        <path
          d="M150.489 134.235C151.569 133.068 153.387 133.589 153.296 135.176C152.112 155.594 111.785 204.326 74.3757 214.4C74.1257 214.467 73.8629 214.482 73.6062 214.448C55.8624 212.099 48.2225 210.13 37.74 199.768C36.8343 198.873 37.0236 197.368 38.114 196.71C60.0892 183.454 69.615 182.599 90.5007 173.999C115.296 163.789 121.655 165.399 150.489 134.235Z"
          fill="url(#g1_wm)"
        />
        <path
          d="M22.5095 128.7C21.9966 127.271 23.298 125.932 24.782 126.251C60.1523 133.871 108.831 129.388 137.567 129.023C139.102 129.003 140.023 130.634 139.115 131.872C132.007 141.563 111.999 159.197 71.0007 160.999C38.1197 160.999 26.167 138.887 22.5095 128.7Z"
          fill="url(#g1_wm)"
        />
        <path
          d="M3.46751 72.4076C3.14567 70.5548 5.29606 68.7498 6.98313 69.5805C45.601 88.608 95.9286 91.7024 146.344 97.3695C147.059 97.4498 147.682 97.9078 147.935 98.5805C150.099 104.34 148.896 107.939 147.812 113.35C147.622 114.301 146.785 114.999 145.815 115C96.1347 115.053 57.8952 117.415 48.5007 114.999C2.42683 103.152 5.81481 85.9129 3.46751 72.4076Z"
          fill="url(#g1_wm)"
        />
        <path
          d="M0.0456338 9.77676C0.0886391 8.42212 1.4571 7.50078 2.70579 8.02774C20.7782 15.6545 47.7893 32.7004 66.6755 39.4994C90.1538 47.9517 134.357 70.5157 140.48 81.9281C141.038 82.9674 140.168 83.9858 138.992 83.8988C124.801 82.8482 71.2156 73.8816 58.6755 71.9994C47.0024 70.2474 -1.6974 64.6855 0.0456338 9.77676Z"
          fill="url(#g1_wm)"
        />
        <defs>
          <linearGradient
            id="g1_wm"
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
          fontSize: 17,
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

const Post03PlatformOverview: React.FC = () => {
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

      {/* Header */}
      <div
        style={{
          paddingTop: 80,
          paddingBottom: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Title />
        <Subtitle />
      </div>

      {/* 2x2 card grid */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 52px 76px",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", gap: 20 }}>
          <FeatureCard
            feature={features[0]}
            cardDelay={FRAMES.cards[0]}
            bubbleDelay={FRAMES.bubbles[0]}
          />
          <FeatureCard
            feature={features[1]}
            cardDelay={FRAMES.cards[1]}
            bubbleDelay={FRAMES.bubbles[1]}
          />
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <FeatureCard
            feature={features[2]}
            cardDelay={FRAMES.cards[2]}
            bubbleDelay={FRAMES.bubbles[2]}
          />
          <FeatureCard
            feature={features[3]}
            cardDelay={FRAMES.cards[3]}
            bubbleDelay={FRAMES.bubbles[3]}
          />
        </div>
      </div>

      <Wordmark />
    </AbsoluteFill>
  );
};

export { Post03PlatformOverview };
export default Post03PlatformOverview;

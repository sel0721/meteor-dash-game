import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { pixelEN, pixelKR } from "../fonts";

const stars: { x: number; y: number; size: number; color: string }[] = [
  { x: 80, y: 120, size: 4, color: "#ffffff" },
  { x: 220, y: 260, size: 6, color: "#ffd23f" },
  { x: 940, y: 160, size: 4, color: "#ffffff" },
  { x: 1000, y: 340, size: 6, color: "#2ce8dc" },
  { x: 140, y: 520, size: 4, color: "#ffffff" },
  { x: 960, y: 620, size: 4, color: "#ffffff" },
  { x: 60, y: 780, size: 6, color: "#ff9ff3" },
  { x: 1010, y: 860, size: 4, color: "#ffffff" },
  { x: 500, y: 90, size: 4, color: "#ffffff" },
  { x: 300, y: 1020, size: 4, color: "#ffffff" },
  { x: 780, y: 1040, size: 6, color: "#ffd23f" },
  { x: 900, y: 1180, size: 4, color: "#ffffff" },
  { x: 120, y: 1300, size: 4, color: "#ffffff" },
  { x: 1000, y: 1420, size: 4, color: "#ffffff" },
];

export const Scene2Features: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Scene 2 - Features"
      style={{
        background:
          "linear-gradient(180deg, #10062b 0%, #3a1668 45%, #6a1e5e 75%, #ff6f3c 130%)",
      }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            opacity: 0.8,
          }}
        />
      ))}

      <Interactive.Div
        name="Section heading"
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: pixelKR,
          fontWeight: 700,
          fontSize: 78,
          color: "#f4f1ff",
          textShadow: "5px 5px 0 #0a0418",
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        핵심 기능
      </Interactive.Div>

      <Interactive.Div
        name="Feature card - Shoot"
        style={{
          position: "absolute",
          top: 340,
          left: 80,
          width: 880,
          padding: "36px 44px",
          display: "flex",
          alignItems: "center",
          gap: 32,
          backgroundColor: "#1c0f3d",
          border: "5px solid #ffd23f",
          clipPath:
            "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
          boxShadow: "10px 10px 0 rgba(0,0,0,0.45)",
          opacity: interpolate(frame, [8, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [8, 26], ["-140px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
          }),
        }}
      >
        <div style={{ fontSize: 80 }}>🔫</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: pixelKR,
            fontWeight: 700,
            fontSize: 42,
            color: "#ffd23f",
            textShadow: "3px 3px 0 #0a0418",
          }}
        >
          사격으로 운석을 파괴하라
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Feature card - Combo"
        style={{
          position: "absolute",
          top: 560,
          left: 80,
          width: 880,
          padding: "36px 44px",
          display: "flex",
          alignItems: "center",
          gap: 32,
          backgroundColor: "#1c0f3d",
          border: "5px solid #ff9ff3",
          clipPath:
            "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
          boxShadow: "10px 10px 0 rgba(0,0,0,0.45)",
          opacity: interpolate(frame, [24, 38], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [24, 42], ["140px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
          }),
        }}
      >
        <div style={{ fontSize: 80 }}>⚡</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: pixelKR,
            fontWeight: 700,
            fontSize: 42,
            color: "#ff9ff3",
            textShadow: "3px 3px 0 #0a0418",
          }}
        >
          연속 격파로 콤보 배율 최대 x3
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Feature card - Boss"
        style={{
          position: "absolute",
          top: 780,
          left: 80,
          width: 880,
          padding: "36px 44px",
          display: "flex",
          alignItems: "center",
          gap: 32,
          backgroundColor: "#1c0f3d",
          border: "5px solid #ff3864",
          clipPath:
            "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
          boxShadow: "10px 10px 0 rgba(0,0,0,0.45)",
          opacity: interpolate(frame, [40, 54], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [40, 58], ["-140px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
          }),
        }}
      >
        <div style={{ fontSize: 80 }}>👹</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: pixelKR,
            fontWeight: 700,
            fontSize: 42,
            color: "#ff3864",
            textShadow: "3px 3px 0 #0a0418",
          }}
        >
          거대한 보스 운석이 등장한다
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Feature card - Powerups"
        style={{
          position: "absolute",
          top: 1000,
          left: 80,
          width: 880,
          padding: "36px 44px",
          display: "flex",
          alignItems: "center",
          gap: 32,
          backgroundColor: "#1c0f3d",
          border: "5px solid #2ce8dc",
          clipPath:
            "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
          boxShadow: "10px 10px 0 rgba(0,0,0,0.45)",
          opacity: interpolate(frame, [56, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [56, 74], ["140px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
          }),
        }}
      >
        <div style={{ fontSize: 80 }}>🎁</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: pixelKR,
            fontWeight: 700,
            fontSize: 42,
            color: "#2ce8dc",
            textShadow: "3px 3px 0 #0a0418",
          }}
        >
          보호막·자석·스프레드샷·폭탄
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Eyebrow small"
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: pixelEN,
          fontSize: 22,
          letterSpacing: 4,
          color: "#b9aee0",
          opacity: interpolate(frame, [70, 84], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        PIXEL-ART SURVIVAL ARCADE
      </Interactive.Div>
    </AbsoluteFill>
  );
};

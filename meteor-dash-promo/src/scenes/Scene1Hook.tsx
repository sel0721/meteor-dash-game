import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { pixelKR } from "../fonts";

const stars: { x: number; y: number; size: number; color: string }[] = [
  { x: 90, y: 100, size: 4, color: "#ffffff" },
  { x: 960, y: 140, size: 6, color: "#ffd23f" },
  { x: 60, y: 300, size: 4, color: "#ffffff" },
  { x: 1000, y: 380, size: 4, color: "#2ce8dc" },
  { x: 120, y: 1420, size: 4, color: "#ffffff" },
  { x: 950, y: 1480, size: 6, color: "#ff9ff3" },
  { x: 70, y: 1650, size: 4, color: "#ffffff" },
  { x: 1010, y: 1720, size: 4, color: "#ffffff" },
];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Scene 1 - Hook"
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
        name="Thumbnail frame"
        style={{
          position: "absolute",
          top: 220,
          left: "50%",
          width: 720,
          height: 720,
          marginLeft: -360,
          border: "8px solid #2ce8dc",
          clipPath:
            "polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)",
          boxShadow: "0 0 0 6px #0a0418, 16px 16px 0 rgba(0,0,0,0.45)",
          overflow: "hidden",
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 18], [0.82, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <CanvasImage
          name="Thumbnail art"
          src={staticFile("thumbnail.png")}
          style={{ width: 720, height: 720, objectFit: "cover" }}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Tagline"
        style={{
          position: "absolute",
          top: 1030,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: pixelKR,
          fontWeight: 700,
          fontSize: 54,
          color: "#f4f1ff",
          textShadow: "4px 4px 0 #0a0418",
          opacity: interpolate(frame, [22, 36], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [22, 36], ["0px 20px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        운석을 피하라, 아니면 부숴라
      </Interactive.Div>
    </AbsoluteFill>
  );
};

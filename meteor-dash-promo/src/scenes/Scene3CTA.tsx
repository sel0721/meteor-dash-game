import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { pixelEN, pixelKR } from "../fonts";

export const Scene3CTA: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Scene 3 - CTA"
      style={{
        background:
          "linear-gradient(180deg, #10062b 0%, #3a1668 45%, #6a1e5e 75%, #ff6f3c 130%)",
      }}
    >
      <Interactive.Div
        name="Thumbnail frame"
        style={{
          position: "absolute",
          top: 260,
          left: "50%",
          width: 620,
          height: 620,
          marginLeft: -310,
          border: "8px solid #ffd23f",
          clipPath:
            "polygon(28px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0 calc(100% - 28px), 0 28px)",
          boxShadow: "0 0 0 6px #0a0418, 14px 14px 0 rgba(0,0,0,0.45)",
          overflow: "hidden",
          scale: interpolate(frame, [0, 16], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <CanvasImage
          name="Thumbnail icon"
          src={staticFile("thumbnail.png")}
          style={{ width: 620, height: 620, objectFit: "cover" }}
        />
      </Interactive.Div>

      <Interactive.Div
        name="CTA title"
        style={{
          position: "absolute",
          top: 940,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: pixelKR,
          fontWeight: 700,
          fontSize: 84,
          color: "#f4f1ff",
          textShadow: "5px 5px 0 #0a0418",
          opacity: interpolate(frame, [14, 28], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [14, 28], ["0px 24px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        지금 바로 플레이하세요
      </Interactive.Div>

      <Interactive.Div
        name="Play button"
        style={{
          position: "absolute",
          top: 1090,
          left: "50%",
          width: 420,
          marginLeft: -210,
          textAlign: "center",
          padding: "26px 0",
          fontFamily: pixelKR,
          fontWeight: 700,
          fontSize: 56,
          color: "#0a0418",
          backgroundColor: "#ffd23f",
          border: "5px solid #0a0418",
          clipPath:
            "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
          boxShadow: "8px 8px 0 rgba(0,0,0,0.45)",
          opacity: interpolate(frame, [26, 38], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(
            frame,
            [26, 40, 55, 70],
            [0.9, 1, 1, 1.05],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.ease),
              output: "perceptual-scale",
            },
          ),
        }}
      >
        ▶ PLAY
      </Interactive.Div>

      <Interactive.Div
        name="Footnote"
        style={{
          position: "absolute",
          top: 1200,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: pixelEN,
          fontSize: 22,
          letterSpacing: 2,
          color: "#b9aee0",
          opacity: interpolate(frame, [40, 54], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        NO INSTALL · PLAYS IN BROWSER
      </Interactive.Div>
    </AbsoluteFill>
  );
};

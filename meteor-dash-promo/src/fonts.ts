import { loadFont as loadPressStart2P } from "@remotion/google-fonts/PressStart2P";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const { fontFamily: pixelEN } = loadPressStart2P("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const pixelKR = "PixelKR";

await loadLocalFont({
  family: pixelKR,
  url: staticFile("Galmuri11-Bold.woff2"),
  weight: "700",
});

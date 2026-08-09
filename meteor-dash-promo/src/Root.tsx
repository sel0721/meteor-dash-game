import "./index.css";
import "./fonts";
import { Composition, Folder } from "remotion";
import { PromoVideo } from "./PromoVideo";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Features } from "./scenes/Scene2Features";
import { Scene3CTA } from "./scenes/Scene3CTA";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Promo-Scenes">
        <Composition
          id="Scene1Hook"
          component={Scene1Hook}
          durationInFrames={95}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Scene2Features"
          component={Scene2Features}
          durationInFrames={110}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Scene3CTA"
          component={Scene3CTA}
          durationInFrames={100}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Composition
        id="MeteorDashPromo"
        component={PromoVideo}
        durationInFrames={275}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

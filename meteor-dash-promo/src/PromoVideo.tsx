import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { staticFile } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Features } from "./scenes/Scene2Features";
import { Scene3CTA } from "./scenes/Scene3CTA";

export const PromoVideo: React.FC = () => {
  return (
    <>
      <Audio name="Chiptune BGM" src={staticFile("chiptune.wav")} volume={0.9} />
      <TransitionSeries name="Promo timeline">
        <TransitionSeries.Sequence durationInFrames={95} name="Hook">
          <Scene1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={110} name="Features">
          <Scene2Features />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={100} name="CTA">
          <Scene3CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};

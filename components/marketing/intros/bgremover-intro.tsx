"use server";

import { Intro } from "./intro";
import { title } from "@/components/primitives";
import { Dictionary } from "@/components/dictionary-provider";

interface BgRemoverIntroProps {
  size: "sm" | "lg";
  isExampleFront?: boolean;
}
// Keep one page only one h1 tag for SEO
const titleNode = (dictionary: Dictionary) => (
  <>
    <p className={title({ size: "lg" })}>Effortlessly </p>
    <div>
      <h1 className={title({ color: "green", size: "lg" })}>
        Remove Backgrounds&nbsp;
      </h1>
    </div>
  </>
);

export const BgRemoverIntro = ({
  size,
  isExampleFront,
  dictionary,
}: BgRemoverIntroProps & { dictionary: Dictionary }) => {
  return (
    <Intro
      size={size}
      introTitle={titleNode(dictionary)}
      leftImage="landing/pexels-sunsetoned-9888301.jpg"
      rightImage="landing/no_bg_pexels-sunsetoned-9888301.jpg"
      navi="/ai-remove-image-background" // pathname has a SEO impact, so it need to be easily readable
      color="success"
      subTitleText={dictionary.imageTools.bgRemover.subTitle}
      isExampleFront={isExampleFront}
    />
  );
};

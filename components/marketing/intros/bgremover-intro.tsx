"use client";
import { Intro } from "./intro";
import { title } from "@/components/primitives";
import { useDictionary } from "@/components/dictionary-provider";
import { FC } from "react";
interface BgRemoverIntroProps {
  size: "sm" | "lg";
  isExampleFront?: boolean;
}
// Keep one page only one h1 tag for SEO
const TitleNode: FC = () => {
  const dictionary = useDictionary();
  return (
    <>
      <p className={title({ size: "lg" })}>
        {dictionary.imageTools.bgRemover.titlePrefix}
      </p>
      <div>
        <h1 className={title({ color: "green", size: "lg" })}>
          {dictionary.imageTools.bgRemover.titleEmphasis}&nbsp;
        </h1>
      </div>
    </>
  );
};

export const BgRemoverIntro: FC<any> = ({
  size,
  isExampleFront,
}: BgRemoverIntroProps) => {
  const dictionary = useDictionary();
  return (
    <Intro
      size={size}
      introTitle={<TitleNode />}
      leftImage="/landing/pexels-sunsetoned-9888301.jpg"
      rightImage="/landing/no_bg_pexels-sunsetoned-9888301.jpg"
      navi="/ai-remove-image-background" // pathname has a SEO impact, so it need to be easily readable
      color="success"
      subTitleText={dictionary.imageTools.bgRemover.subTitle}
      isExampleFront={isExampleFront}
    />
  );
};

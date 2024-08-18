"use client";
import { Intro } from "./intro";
import { title } from "@/components/primitives";
import { useDictionary } from "@/components/dictionary-provider";
import { FC } from "react";
interface UpscalerIntroProps {
  size: "sm" | "lg";
}

const TitleNode: FC = () => {
  const dictionary = useDictionary();
  return (
    <>
      <h1 className={title({ size: "lg" })}>
        {dictionary.imageTools.upscaler.titlePrefix}
      </h1>
      <div>
        <h1 className={title({ color: "blue", size: "lg" })}>
          {dictionary.imageTools.upscaler.titleEmphasis}&nbsp;
        </h1>
      </div>
    </>
  );
};

export const UpscalerIntro: FC<UpscalerIntroProps> = ({
  size,
}: UpscalerIntroProps) => {
  const dictionary = useDictionary();
  return (
    <Intro
      size={size}
      introTitle={<TitleNode />}
      leftImage="https://images.pexels.com/photos/15804651/pexels-photo-15804651/free-photo-of-people-together-on-motorcycle-on-road-in-mountains.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
      rightImage="https://images.pexels.com/photos/15804651/pexels-photo-15804651/free-photo-of-people-together-on-motorcycle-on-road-in-mountains.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
      navi="/upscaler"
      color="primary"
      subTitleText={dictionary.imageTools.upscaler.subTitle}
    />
  );
};

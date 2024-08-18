"use client";
import { Card } from "@nextui-org/card";
import ReactCompareImage from "react-compare-image";
import { cn } from "@nextui-org/theme";
import { useState } from "react";

interface IntroExampleProps {
  width: number;
  leftImage: string;
  rightImage: string;
  leftAlt?: string;
  rightAlt?: string;
}

const IntroExample = ({
  width,
  leftImage,
  rightImage,
  leftAlt = "old image",
  rightAlt = "new image",
}: IntroExampleProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <Card
      className={cn("aspect-[4/3]", {
        "w-[512px]": width === 512,
        "w-[768px]": width === 768,
      })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactCompareImage
        leftImage={leftImage}
        rightImage={rightImage}
        leftImageLabel={isHovered ? "before" : ""}
        rightImageLabel={isHovered ? "after" : ""}
        leftImageAlt={leftAlt}
        rightImageAlt={rightAlt}
      />
    </Card>
  );
};

export default IntroExample;

import { Intro } from "./intro";
import { title } from "@/components/primitives";

interface ColorizerIntroProps {
  size: "sm" | "lg";
  isExampleFront?: boolean;
}

const titleNode = (
  <>
    <div>
      <span className={title({ size: "lg" })}>Bring</span>
      <h1 className={title({ color: "yellow", size: "lg" })}> Vibrant Color</h1>
    </div>
    <p className={title({ size: "lg" })}>to Life</p>
  </>
);

export const ColorizerIntro = ({
  size,
  isExampleFront,
}: ColorizerIntroProps) => (
  <Intro
    size={size}
    introTitle={titleNode}
    leftImage="/landing/black-and-white-675004_1280.jpg"
    rightImage="/landing/colorized_black-and-white-675004_1280.jpg"
    navi="/colorizer"
    color="warning"
    subTitleText="Transform your black-and-white photos into vibrant, full-color images with ease using our advanced AI colorization tool."
    isExampleFront={isExampleFront}
  />
);

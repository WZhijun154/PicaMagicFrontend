import { Intro } from "./intro";
import { title } from "@/components/primitives";

interface DeblurerIntroProps {
  size: "sm" | "lg";
  isExampleFront?: boolean;
}

const titleNode = (
  <>
    <h1 className={title({ size: "lg" })}>Sharpen Your</h1>
    <div>
      <h1 className={title({ color: "violet", size: "lg" })}>Blurry Photos</h1>
    </div>
  </>
);

export const DeblurerIntro = ({ size, isExampleFront }: DeblurerIntroProps) => (
  <Intro
    size={size}
    introTitle={titleNode}
    leftImage="landing/blurred_sincerely-media-Ef6R6tELrq4-unsplash.jpg"
    rightImage="landing/deblurred_blurred_sincerely-media-Ef6R6tELrq4-unsplash.jpg"
    navi="/deblurer"
    color="secondary"
    subTitleText="Restore clarity to your blurred images with our advanced AI unblurring tool, bringing out the details and making your photos look sharp and clear."
    isExampleFront={isExampleFront}
  />
);

import { Intro } from "./intro";
import { title } from "@/components/primitives";

interface DenoiserIntroProps {
  size: "sm" | "lg";
  isExampleFront?: boolean;
}

const titleNode = (
  <>
    <div>
      <h1 className={title({ color: "pink", size: "lg" })}>Eliminate Noise</h1>
    </div>
    <h1 className={title({ size: "lg" })}>for Clearer Photos</h1>
  </>
);

export const DenoiserIntro = ({ size, isExampleFront }: DenoiserIntroProps) => (
  <Intro
    size={size}
    introTitle={titleNode}
    leftImage="/landing/noisy_pexels-markb-105805.jpg"
    rightImage="/landing/resized_image.jpg"
    navi="/denoiser"
    color="pink"
    subTitleText="Improve your images by eliminating unwanted noise and grain, ensuring crisp and clean results with our advanced AI denoising tool."
    isExampleFront={isExampleFront}
  />
);

// className =
//   "max-w-fit bg-pink-100 text-pink-500 dark:bg-pink-900 dark:text-pink-300";

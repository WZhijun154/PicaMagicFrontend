import { Intro } from "./intro";
import { title } from "@/components/primitives";

interface BgRemoverIntroProps {
  size: "sm" | "lg";
  isExampleFront?: boolean;
}

const titleNode = (
  <>
    <h1 className={title({ size: "lg" })}>Effortlessly </h1>
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
}: BgRemoverIntroProps) => (
  <Intro
    size={size}
    introTitle={titleNode}
    leftImage="landing/pexels-sunsetoned-9888301.jpg"
    rightImage="landing/no_bg_pexels-sunsetoned-9888301.jpg"
    navi="/bg-remover"
    color="success"
    subTitleText="Our AI-powered tool allows you to seamlessly remove backgrounds from your images with just a few clicks, enhancing your photo editing experience."
    isExampleFront={isExampleFront}
  />
);

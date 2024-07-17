import { sub } from "date-fns";
import { Intro } from "./intro";
import { title } from "@/components/primitives";

interface UpscalerIntroProps {
  size: "sm" | "lg";
}

const titleNode = (
  <>
    <h1 className={title({ size: "lg" })}>Enhance Photos with</h1>
    <div>
      <h1 className={title({ color: "blue", size: "lg" })}>
        Super Resolution&nbsp;
      </h1>
    </div>
  </>
);

export const UpscalerIntro = ({ size }: UpscalerIntroProps) => (
  <Intro
    size={size}
    introTitle={titleNode}
    leftImage="https://images.pexels.com/photos/15804651/pexels-photo-15804651/free-photo-of-people-together-on-motorcycle-on-road-in-mountains.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
    rightImage="https://images.pexels.com/photos/15804651/pexels-photo-15804651/free-photo-of-people-together-on-motorcycle-on-road-in-mountains.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
    navi="/upscaler"
    color="primary"
    subTitleText="Our Super Resolution tool uses advanced AI to increase the resolution of your photos, enhancing detail and sharpness without losing any information."
  />
);

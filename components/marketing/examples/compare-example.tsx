import { Card } from "@nextui-org/card";
import ReactCompareImage from "react-compare-image";

interface IntroExampleProps {
  width: number;
  leftImage: string;
  rightImage: string;
}

const IntroExample = ({ width, leftImage, rightImage }: IntroExampleProps) => {
  return (
    <Card className={`w-[${width}px] max-h-[512px]`}>
      <ReactCompareImage
        leftImage={leftImage}
        rightImage={rightImage}
        // leftImageLabel="before"
        // rightImageLabel="after"
      />
    </Card>
  );
};
export default IntroExample;

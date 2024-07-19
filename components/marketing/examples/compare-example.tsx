import { Card } from "@nextui-org/card";
import ReactCompareImage from "react-compare-image";
import { cn } from "@nextui-org/theme";

interface IntroExampleProps {
  width: number;
  leftImage: string;
  rightImage: string;
}

const IntroExample = ({ width, leftImage, rightImage }: IntroExampleProps) => {
  return (
    // <Card className={`w-[${width}px] max-h-[512px]`}>
    <Card
      className={cn("max-h-[512px] ", {
        "w-[512px]": width === 512,
        "w-[768px]": width === 768,
      })}
    >
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

import { useThemeBackground } from "@/hooks/use-theme-background";
import { Image } from "@nextui-org/image";

export const Background = () => {
  const background = useThemeBackground();
  return (
    <div
      aria-hidden="true"
      className="z-0 fixed w-[120%] h-[120%] -left-[10%] -top-20"
    >
      <Image src={background} removeWrapper />
    </div>
  );
};
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const path2color: Record<string, string> = {
  "/": "secondary",
  "/upscaler": "primary",
  "/en/bgremover": "success",
  "/colorizer": "warning",
  "/denoiser": "danger",
  "/deblur": "secondary",
};

interface CurrentColorThemeProps {
  intensity?: number;
}

export function useCurrentThemeColor({ intensity }: CurrentColorThemeProps) {
  const pathname = usePathname();
  const currentColor = useMemo(() => {
    return path2color[pathname] || "secondary";
  }, [pathname]);

  return currentColor + (intensity ? `-${intensity}` : "");
}

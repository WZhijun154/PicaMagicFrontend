import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


const path2color: Record<string, string> = {
    "/": "secondary",
    "/upscaler": "primary",
    "/bg-remover": "success",
    "/colorizer": "warning",
    "/denoiser": "danger",
    "/deblur": "secondary",
}


interface CurrentColorThemeProps {
    intensity?: number;
}

export function useCurrentThemeColor({intensity}: CurrentColorThemeProps) {
    const pathname = usePathname();
    const [currentColor, setCurrentColor] = useState("secondary");

    useEffect(() => {
        const color = path2color[pathname] ?? "secondary";
        setCurrentColor(color);
    }, [pathname]);

    return currentColor + (intensity ? `-${intensity}` : "");
} 



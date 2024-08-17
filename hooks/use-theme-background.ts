import { useCurrentThemeColor } from "./use-current-theme-color";

const color2background: Record<string, string> = {
  primary: "/gradients/image_tool_full_bg_primary.svg",
  warning: "/gradients/image_tool_full_bg_warning.svg",
  success: "/gradients/image_tool_full_bg_success.svg",
  secondary: "/gradients/image_tool_full_bg_secondary.svg",
  danger: "/gradients/image_tool_full_bg_danger.svg",
};

export function useThemeBackground() {
  const currentColor = useCurrentThemeColor({});
  const background = color2background[currentColor];
  return background;
}

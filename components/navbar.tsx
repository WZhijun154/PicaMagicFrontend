"use client";

import { useRef, useState, FC, ReactNode, Key } from "react";
import {
  link,
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Link,
  Button,
  Kbd,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Badge,
  Avatar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Chip,
  Image,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { dataFocusVisibleClasses } from "@nextui-org/theme";
import { ChevronDownIcon, LinkIcon } from "@nextui-org/shared-icons";
import { isAppleDevice } from "@react-aria/utils";
import { clsx } from "@nextui-org/shared-utils";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { includes } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { usePress } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";

import { siteConfig } from "@/config/site";
import { Route } from "@/libs/docs/page";
import { LargeLogo, SmallLogo, ThemeSwitch } from "@/components";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  SearchLinearIcon,
} from "@/components/icons";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { DocsSidebar } from "@/components/docs/sidebar";
import { useCmdkStore } from "@/components/cmdk";
import { trackEvent } from "@/utils/va";
import { FbFeedbackButton } from "./featurebase/fb-feedback-button";
import { useUser } from "@/hooks/use-user";
import { NotificationCard } from "./auth-state/notification-card";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { title } from "./primitives";
import { useDictionary } from "./dictionary-provider";

export interface NavbarProps {
  routes: Route[];
  mobileRoutes?: Route[];
  tag?: string;
  slug?: string;
  children?: ReactNode;
  authState?: ReactNode;
}

export const Navbar: FC<NavbarProps> = ({
  children,
  routes,
  mobileRoutes = [],
  slug,
  tag,
  authState,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  const dictionary = useDictionary();
  const ref = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const isMounted = useIsMounted();

  const { focusProps, isFocusVisible } = useFocusRing();

  const currentThemeColor = useCurrentThemeColor({});
  const nextLinkColor = "data-[active=true]:text-" + currentThemeColor;

  const handlePressNavbarItem = (name: string, url: string) => {
    trackEvent("NavbarItem", {
      name,
      action: "press",
      category: "navbar",
      data: url,
    });
  };

  return (
    <NextUINavbar
      ref={ref}
      className={clsx({
        "z-[100001]": isMenuOpen,
      })}
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            aria-label="Home"
            className="flex justify-start items-center gap-2 tap-highlight-transparent transition-opacity active:opacity-50"
            href="/"
            onClick={() => handlePressNavbarItem("Home", "/")}
          >
            {/* <motion.div
              initial={{ scale: 0.9, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <Image
                src="/logo.png"
                alt="PictaMagic Logo"
                width={50}
                height={50}
                className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </motion.div> */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.p
                className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 animate-gradient"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                {dictionary.brandName}
              </motion.p>
            </motion.div>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start items-center">
          <NavbarItem>
            <NextLink
              className={nextLinkColor}
              color="foreground"
              href="/upscaler"
              data-active={pathname === "/upscaler"}
              onClick={() => handlePressNavbarItem("upscaler", "/upscaler")}
            >
              {dictionary.navbar.superResolution}
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={nextLinkColor}
              color="foreground"
              data-active={pathname === "/bgremover"}
              href="/bgremover"
              onClick={() => handlePressNavbarItem("bg-remover", "/bg-remover")}
            >
              {dictionary.navbar.removeBackgrounds}
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={nextLinkColor}
              color="foreground"
              data-active={pathname === "/colorizer"}
              href="/colorizer"
              onClick={() => handlePressNavbarItem("colorizer", "/colorizer")}
            >
              Colorize
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={nextLinkColor}
              color="foreground"
              data-active={pathname === "/denoiser"}
              href="/denoiser"
              onClick={() => handlePressNavbarItem("denoiser", "/denoiser")}
            >
              {dictionary.navbar.denoise}
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={nextLinkColor}
              color="foreground"
              data-active={includes(pathname, "deblurer")}
              href="/deblurer"
              onClick={() => handlePressNavbarItem("deblurer", "/deblurer")}
            >
              {dictionary.navbar.deblur}
            </NextLink>
          </NavbarItem>
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {authState}
      </NavbarContent>
    </NextUINavbar>
  );
};

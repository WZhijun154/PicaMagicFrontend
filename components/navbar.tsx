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
// import { FbRoadmapLink } from "@/components/featurebase/fb-roadmap-link";
import { trackEvent } from "@/utils/va";
import { FbFeedbackButton } from "./featurebase/fb-feedback-button";
import { useUser } from "@/hooks/use-user";
// import { FbChangelogButton } from "./featurebase/fb-changelog-button";
import { NotificationCard } from "./notification-card";
import { useTransition } from "react";
import { signOut } from "@/plugins/supabase/auth";
import { useRouter } from "next/navigation";

export interface NavbarProps {
  routes: Route[];
  mobileRoutes?: Route[];
  tag?: string;
  slug?: string;
  children?: ReactNode;
}

export const Navbar: FC<NavbarProps> = ({
  children,
  routes,
  mobileRoutes = [],
  slug,
  tag,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  // const [commandKey, setCommandKey] = useState<"ctrl" | "command">("command");

  const ref = useRef<HTMLElement>(null);
  // const isMounted = useIsMounted();

  const pathname = usePathname();
  const isMounted = useIsMounted();
  // const cmdkStore = useCmdkStore();

  // useEffect(() => {
  //   if (isMenuOpen) {
  //     setIsMenuOpen(false);
  //   }
  // }, [pathname]);

  // useEffect(() => {
  //   setCommandKey(isAppleDevice() ? "command" : "ctrl");
  // }, []);

  // const handleOpenCmdk = () => {
  //   cmdkStore.onOpen();
  //   trackEvent("Navbar - Search", {
  //     name: "navbar - search",
  //     action: "press",
  //     category: "cmdk",
  //   });
  // };

  // const { pressProps } = usePress({
  //   onPress: handleOpenCmdk,
  // });
  const { focusProps, isFocusVisible } = useFocusRing();

  const currentThemeColor = useCurrentThemeColor({});
  // console.log("currentThemeColor: ", currentThemeColor);
  // use currentThemeColor
  const nextLinkColor = "data-[active=true]:text-" + currentThemeColor;
  // const docsPaths = [
  //   "/docs/guide/introduction",
  //   "/docs/guide/installation",
  //   "/docs/guide/upgrade-to-v2",
  // ];
  // console.log("Navbar rendered");
  const { user, userSignIn, userSignOut } = useUser();
  const isAuthed = user?.aud === "authenticated" || false;

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const submitSignOut = () => {
    startTransition(async () => {
      const error = await signOut();
      if (error) {
        return;
      }
      userSignOut();
      router.push("/");
    });
  };

  // console.log(user);
  // const isAuthed
  // const searchButton = (
  //   <Button
  //     aria-label="Quick search"
  //     className="text-sm font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20"
  //     endContent={
  //       <Kbd className="hidden py-0.5 px-2 lg:inline-block" keys={commandKey}>
  //         K
  //       </Kbd>
  //     }
  //     startContent={
  //       <SearchLinearIcon
  //         className="text-base text-default-400 pointer-events-none flex-shrink-0"
  //         size={18}
  //         strokeWidth={2}
  //       />
  //     }
  //     onPress={handleOpenCmdk}
  //   >
  //     Quick Search...
  //   </Button>
  // );

  // if (pathname.includes("/examples")) {
  //   return null;
  // }

  // const navLinkClasses = clsx(
  //   link({ color: "foreground" }),
  //   "data-[active=true]:text-secondary"
  // );

  // const navLinkClasses = (color: string) => {
  //   return clsx(
  //     link({ color: "foreground" }),
  //     `data-[active=true]:text-${color}`
  //   );
  // };

  // const handleVersionChange = (key: Key) => {
  //   if (key === "v1") {
  //     const newWindow = window.open(
  //       "https://v1.nextui.org",
  //       "_blank",
  //       "noopener,noreferrer"
  //     );

  //     if (newWindow) newWindow.opener = null;
  //   }
  // };

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
      // classNames={{
      //   item: [
      //     "flex",
      //     "relative",
      //     "h-full",
      //     "items-center",
      //     "data-[active=true]:after:content-['']",
      //     "data-[active=true]:after:absolute",
      //     "data-[active=true]:after:bottom-0",
      //     "data-[active=true]:after:left-0",
      //     "data-[active=true]:after:right-0",
      //     "data-[active=true]:after:h-[2px]",
      //     "data-[active=true]:after:rounded-[2px]",
      //     "data-[active=true]:after:bg-primary",
      //   ],
      // }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            aria-label="Home"
            className="flex justify-start items-center gap-2 tap-highlight-transparent transition-opacity active:opacity-50"
            href="/"
            onClick={() => handlePressNavbarItem("Home", "/")}
          >
            <SmallLogo className="w-6 h-6 md:hidden" />
            <LargeLogo className="h-5 md:h-6" />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start items-center">
          {/* <NavbarItem>
            <NextLink
              className={navLinkClasses}
              color="foreground"
              data-active={includes(docsPaths, pathname)}
              href="/docs/guide/introduction"
              onClick={() =>
                handlePressNavbarItem("Docs", "/docs/guide/introduction")
              }
            >
              Docs
            </NextLink>
          </NavbarItem> */}
          <NavbarItem>
            <NextLink
              className={nextLinkColor}
              color="foreground"
              href="/upscaler"
              data-active={pathname === "/upscaler"}
              onClick={() => handlePressNavbarItem("upscaler", "/upscaler")}
            >
              Super Resolution
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={nextLinkColor}
              color="foreground"
              data-active={pathname === "/bg-remover"}
              href="/bg-remover"
              onClick={() => handlePressNavbarItem("bg-remover", "/bg-remover")}
            >
              Remove Backgrounds
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
              Denosie
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
              Deblur
            </NextLink>
          </NavbarItem>
          {/* <NavbarItem>
            <NextLink
              className={navLinkClasses}
              color="foreground"
              data-active={includes(pathname, "figma")}
              href="/figma"
              onClick={() => handlePressNavbarItem("Figma", "/figma")}
            >
              Figma
            </NextLink>
          </NavbarItem> */}
          {/* hide feedback and changelog at this moment */}
          {/* <NavbarItem>
            <NextLink className={navLinkClasses} color="foreground" href="#">
              <FbChangelogButton key="changelog" userName="" />
            </NextLink>
          </NavbarItem> */}
          {/* <NavbarItem>
            <NextLink className={navLinkClasses} color="foreground" href="#">
              <FbFeedbackButton key="feedback" />
            </NextLink>
          </NavbarItem> */}
          {/* <NavbarItem>
            <FbRoadmapLink className={navLinkClasses} />
          </NavbarItem> */}
          {/* <NavbarItem>
            <Chip
              as={NextLink}
              className="hover:bg-default-100 border-default-200/80 dark:border-default-100/80 transition-colors cursor-pointer"
              color="secondary"
              href="/blog/v2.2.0"
              variant="dot"
              onClick={() => handlePressNavbarItem("Introducing v2.2.0", "/blog/v2.2.0")}
            >
              Introducing v2.2.0&nbsp;
              <span aria-label="rocket emoji" role="img">
                🚀
              </span>
            </Chip>
          </NavbarItem> */}
        </ul>
      </NavbarContent>

      {/* <NavbarContent className="flex w-full gap-2 sm:hidden" justify="end">
        <NavbarItem className="flex h-full items-center">
          <Link
            isExternal
            aria-label="Github"
            className="p-1"
            href="https://github.com/nextui-org/nextui"
            onClick={() =>
              handlePressNavbarItem(
                "Github",
                "https://github.com/nextui-org/nextui"
              )
            }
          >
            <GithubIcon className="text-default-600 dark:text-default-500" />
          </Link>
        </NavbarItem>
        <NavbarItem className="flex h-full items-center">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="flex h-full items-center">
          <button
            className={clsx(
              "transition-opacity p-1 hover:opacity-80 rounded-full cursor-pointer outline-none",
              // focus ring
              ...dataFocusVisibleClasses
            )}
            data-focus-visible={isFocusVisible}
            {...focusProps}
            // {...pressProps}
          >
            <SearchLinearIcon
              className="mt-px text-default-600 dark:text-default-500"
              size={20}
            />
          </button>
        </NavbarItem>
        <NavbarItem className="w-10 h-full">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="w-full h-full pt-1"
          />
        </NavbarItem>
      </NavbarContent> */}

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* <NavbarItem className="hidden sm:flex">
          <Chip
            as={NextLink}
            className="bg-default-100/50 hover:bg-default-100 border-default-200/80 dark:border-default-100/80 transition-colors cursor-pointer"
            color="default"
            href="/blog/v2.4.0"
            variant="dot"
            onClick={() =>
              handlePressNavbarItem("New version v2.4.0", "/blog/v2.4.0")
            }
          >
            New version v2.4.0&nbsp;
            <span aria-label="emoji" role="img">
              🚀
            </span>
          </Chip>
        </NavbarItem> */}
        {/* <NavbarItem className="hidden sm:flex"> */}
        {/* <Link
            isExternal
            aria-label="Twitter"
            className="p-1"
            href={siteConfig.links.twitter}
            onPress={() =>
              handlePressNavbarItem("Twitter", siteConfig.links.twitter)
            }
          >
            <TwitterIcon className="text-default-600 dark:text-default-500" />
          </Link> */}
        {/* <Link
            isExternal
            aria-label="Discord"
            className="p-1"
            href={siteConfig.links.discord}
            onPress={() =>
              handlePressNavbarItem("Discord", siteConfig.links.discord)
            }
          >
            <DiscordIcon className="text-default-600 dark:text-default-500" />
          </Link> */}
        {/* <Link
            isExternal
            aria-label="Github"
            className="p-1"
            href={siteConfig.links.github}
            onPress={() =>
              handlePressNavbarItem("Github", siteConfig.links.github)
            }
          >
            <GithubIcon className="text-default-600 dark:text-default-500" />
          </Link> */}
        {/* <ThemeSwitch /> */}
        {/* </NavbarItem> */}
        {/* <NavbarItem className="hidden lg:flex">{searchButton}</NavbarItem> */}
        {/* <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="group text-sm font-normal text-default-600 bg-default-400/20 dark:bg-default-500/20"
            href={siteConfig.links.sponsor}
            startContent={
              <HeartFilledIcon className="text-danger group-data-[hover=true]:animate-heartbeat" />
            }
            variant="flat"
            onPress={() => handlePressNavbarItem("Sponsor", siteConfig.links.sponsor)}
          >
            Sponsor
          </Button>
        </NavbarItem> */}
        {isAuthed ? (
          <>
            {/* Settings */}
            <NavbarItem className="hidden lg:flex">
              <Button isIconOnly radius="full" variant="light">
                <Icon
                  className="text-default-500"
                  icon="solar:settings-linear"
                  width={24}
                />
              </Button>
            </NavbarItem>
            {/* Notifications */}
            <NavbarItem className="flex">
              <Popover offset={12} placement="bottom-end">
                <PopoverTrigger>
                  <Button
                    disableRipple
                    isIconOnly
                    className="overflow-visible"
                    radius="full"
                    variant="light"
                  >
                    <Badge
                      color={currentThemeColor as any}
                      content="5"
                      showOutline={false}
                      size="md"
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:bell-linear"
                        width={22}
                      />
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
                  <NotificationCard className="w-full shadow-none" />
                </PopoverContent>
              </Popover>
            </NavbarItem>
            {/* User Menu */}
            <NavbarItem className="px-2">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="mt-1 h-8 w-8 transition-transform">
                    <Badge
                      color={currentThemeColor as any}
                      content=""
                      placement="bottom-right"
                      shape="circle"
                    >
                      <Avatar
                        size="sm"
                        src="https://i.pravatar.cc/150?u=a04258114e29526708c"
                      />
                    </Badge>
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
                  {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
                  {/* <DropdownItem key="system">System</DropdownItem> */}
                  {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color={currentThemeColor as any}
                    onClick={submitSignOut}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        ) : (
          <ul className="hidden lg:flex gap-4 justify-start items-center">
            <NavbarItem>
              <Button
                radius="full"
                variant="light"
                color={currentThemeColor as any}
                isDisabled={pathname === "/signin"}
              >
                <Link href="signin" color={currentThemeColor as any}>
                  Sign in
                </Link>
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                radius="full"
                variant="flat"
                color={currentThemeColor as any}
                isDisabled={pathname === "/signup"}
              >
                <Link href="signup" color={currentThemeColor as any}>
                  Sign Up
                </Link>
              </Button>
            </NavbarItem>
          </ul>
        )}
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="hidden sm:flex lg:hidden ml-4"
        /> */}
      </NavbarContent>

      {/* <NavbarMenu>
        <DocsSidebar
          className="mt-4 pt-8"
          routes={[...mobileRoutes, ...routes]}
          slug={slug}
          tag={tag}
        />
        {children}
      </NavbarMenu> */}
    </NextUINavbar>
  );
};

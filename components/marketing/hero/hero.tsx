"use client";

import NextLink from "next/link";
import { Button, Link, Chip, Snippet } from "@nextui-org/react";
import { ArrowRightIcon } from "@nextui-org/shared-icons";
import dynamic from "next/dynamic";

import { FloatingComponents } from "./floating-components";

import { GithubIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { trackEvent } from "@/utils/va";

import { useLang } from "@/components/dictionary-provider";

const BgLooper = dynamic(
  () => import("./bg-looper").then((mod) => mod.BgLooper),
  {
    ssr: false,
  }
);

const Header = () => {
  const lang = useLang();
  if (lang === "en") {
    return (
      <>
        <div className="text-center leading-8 md:leading-10 md:text-left transition-all">
          <h1 className={title()}>
            <span className="inline-block">Create&nbsp;</span>
            <span className={title({ color: "violet" })}>Stunning&nbsp;</span>
            <span>Photos Effortlessly with</span>
            <p>AI-Powered Editing.</p>
          </h1>
        </div>
        <h2
          className={subtitle({
            fullWidth: true,
            class: "text-center md:text-left",
          })}
        >
          Powerful, intuitive, and seamless AI photo editing tools.
        </h2>
      </>
    );
  } else if (lang === "ja") {
    return (
      <>
        <div className="text-center leading-8 md:leading-10 md:text-left transition-all">
          <h1 className={title()}>
            <p className="py-2">AIによる編集で</p>
            <p className={`${title({ color: "violet" })} py-2`}>美しき</p>
            <p>写真を撮る。</p>
          </h1>
        </div>
        <h2
          className={subtitle({
            fullWidth: true,
            class: "text-center md:text-left",
          })}
        >
          強力で直感的、そしてシームレスなAIによる写真編集ツール。
        </h2>
      </>
    );
  } else {
    return (
      <>
        <div className="text-center leading-8 md:leading-10 md:text-left transition-all">
          <h1 className={title()}>
            <span className="inline-block">Create&nbsp;</span>
            <span className={title({ color: "violet" })}>Stunning&nbsp;</span>
            <span>Photos Effortlessly with</span>
            <p>AI-Powered Editing.</p>
          </h1>
        </div>
        <h2
          className={subtitle({
            fullWidth: true,
            class: "text-center md:text-left",
          })}
        >
          Powerful, intuitive, and seamless AI photo editing tools.
        </h2>
      </>
    );
  }
};

export const Hero = () => {
  const handlePressAnnouncement = (name: string, url: string) => {
    trackEvent("NavbarItem", {
      name,
      action: "press",
      category: "home - gero",
      data: url,
    });
  };

  return (
    <section className="flex relative overflow-hidden lg:overflow-visible w-full flex-nowrap justify-between items-center h-[calc(100vh_-_64px)] 2xl:h-[calc(84vh_-_64px)]">
      <div className="flex relative z-20 flex-col gap-6 w-full lg:w-1/2 xl:mt-10 transition-all">
        {/* <div className="w-full flex justify-center md:hidden">
          <Chip
            as={NextLink}
            className="bg-default-100/50 hover:bg-default-100 border-default-200/80 dark:border-default-100/80 transition-colors cursor-pointer"
            color="default"
            href="/blog/v2.3.0"
            variant="dot"
            onClick={() =>
              handlePressAnnouncement("New version v2.4.0", "/blog/v2.4.0")
            }
          >
            New version v2.4.0&nbsp;
            <span aria-label="emoji" role="img">
              🚀
            </span>
          </Chip>
        </div> */}
        {/* <div className="text-center leading-8 md:leading-10 md:text-left transition-all">
          <h1 className={title()}>
            <span className="inline-block">Create&nbsp;</span>
            <span className={title({ color: "violet" })}>Stunning&nbsp;</span>
            <span>Photos Effortlessly with</span>
            <p>AI-Powered Editing.</p>
          </h1>
        </div>
        <h2
          className={subtitle({
            fullWidth: true,
            class: "text-center md:text-left",
          })}
        >
          Powerful, intuitive, and seamless AI photo editing tools.
        </h2> */}
        <Header />
        {/* <div className="flex flex-col md:flex-row items-center gap-4">
          <Button
            as={NextLink}
            className="w-full md:h-11 md:w-auto"
            color="primary"
            endContent={
              <ArrowRightIcon
                className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform"
                strokeWidth={2}
              />
            }
            href="/docs/guide/introduction"
            radius="full"
            size="lg"
            onPress={() => {
              trackEvent("Hero - Get Started", {
                name: "Get Started",
                action: "click",
                category: "landing-page",
                data: "/docs/guide/introduction",
              });
            }}
          >
            Get Started
          </Button>
          <Snippet
            className="w-full rounded-full hidden md:flex sm:w-auto"
            copyButtonProps={{
              radius: "full",
            }}
            onCopy={() => {
              trackEvent("Hero - Copy Install Command", {
                name: "Copy",
                action: "click",
                category: "landing-page",
                data: "npx nextui-cli@latest init",
              });
            }}
          >
            npx nextui-cli@latest init
          </Snippet>
          <Button
            fullWidth
            isExternal
            as={Link}
            className="w-full md:hidden"
            href="https://github.com/nextui-org/nextui"
            radius="full"
            size="lg"
            startContent={<GithubIcon />}
            variant="bordered"
            onPress={() => {
              trackEvent("Hero - Github", {
                name: "Github",
                action: "click",
                category: "landing-page",
                data: "https://github.com/nextui-org/nextui",
              });
            }}
          >
            Github
          </Button>
        </div> */}
      </div>

      {/* <FloatingComponents /> */}

      <BgLooper />
    </section>
  );
};

"use client";

/* eslint-disable react/display-name */
import {useMemo, useState} from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Image,
  Button,
  RadioGroup,
  Radio,
  Spacer,
} from "@nextui-org/react";
import get from "lodash/get";
import NextLink from "next/link";
import NextImage from "next/image";

import {ArrowRightIcon} from "@nextui-org/shared-icons";
import {shopCartStyles} from "./styles";

import {title, subtitle, titleWrapper, sectionWrapper} from "@/components/primitives";
import {PaletteIcon, MagicIcon, GamingConsoleIcon, StarIcon} from "@/components/icons";
import {NextUILogo, CodeWindow} from "@/components";
import landingContent from "@/content/landing";
import {useIsMobile} from "@/hooks/use-media-query";
import ReactCompareImage from "react-compare-image";

const IntroTitle = () => {
  return (
    <div className="flex flex-col gap-8 w-[768px]">
      <div className={titleWrapper()}>
        <h1 className={title({size: "lg"})}>Enhance Photos with</h1>
        <div>
          <h1 className={title({color: "blue", size: "lg"})}>Super Resolution&nbsp;</h1>
          {/* <h1 className={title({size: "lg"})}>decisions.</h1> */}
        </div>
      </div>
      <p className={subtitle({fullWidth: true})}>
        Our Super Resolution tool uses advanced AI to increase the resolution of your photos,
        enhancing detail and sharpness without losing any information.
      </p>
      <div className="h-full dark:md:block absolute hidden -z-10">
        <Image
          removeWrapper
          alt="custom themes background"
          className="h-full"
          src="/gradients/blue-purple-1.svg"
        />
      </div>
      <Button
        aria-label="Access Upscaler"
        as={NextLink}
        className="max-w-fit"
        color="primary"
        href="/docs/customization/customize-theme" // TODO
        radius="full"
        size="lg"
        variant="solid"
        endContent={
          <ArrowRightIcon
            className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform"
            strokeWidth={2}
          />
        }
      >
        Get started
      </Button>
    </div>
  );
};

const IntroExample = () => {
  return (
    <Card className="w-[768px]">
      <ReactCompareImage
        leftImage="https://images.pexels.com/photos/15804651/pexels-photo-15804651/free-photo-of-people-together-on-motorcycle-on-road-in-mountains.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        rightImage="https://images.pexels.com/photos/15804651/pexels-photo-15804651/free-photo-of-people-together-on-motorcycle-on-road-in-mountains.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
      />
    </Card>
  );
};

export const UpscalerIntro = () => {
  const isMobile = useIsMobile();

  return (
    <section className={sectionWrapper({class: "mt-24 lg:mt-56"})}>
      <div className="flex flex-row justify-start items-center">
        <IntroTitle />
        <Spacer x={12} />
        <IntroExample />
      </div>
    </section>
  );
};

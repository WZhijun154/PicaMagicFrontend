"use client";

/* eslint-disable react/display-name */
import { Image, Button, Spacer, button } from "@nextui-org/react";
import NextLink from "next/link";
import IntroExample from "../examples/compare-example";

import { ArrowRightIcon } from "@nextui-org/shared-icons";

import {
  subtitle,
  titleWrapper,
  sectionWrapper,
} from "@/components/primitives";

import { useIsMobile } from "@/hooks/use-media-query";

interface IntroTitleProps {
  size?: "sm" | "lg";
  children: React.ReactNode;
  navi: string;
  color: "primary" | "warning" | "success" | "secondary" | "pink";
  subtitleText: string;
}

const IntroTitle = ({
  size,
  children,
  navi,
  color,
  subtitleText,
}: IntroTitleProps) => {
  const hasButton = size === "lg";
  const isPink = color === "pink";
  let buttonClassName = isPink
    ? "bg-pink-100 text-pink-500 dark:bg-pink-900 dark:text-pink-300"
    : "";

  buttonClassName += " max-w-fit";

  return (
    <div className="flex flex-col gap-8 w-[768px]">
      <div className={titleWrapper()}>{children}</div>
      <p className={subtitle({ fullWidth: true })}>{subtitleText}</p>
      {/* <div className="h-full dark:md:block absolute hidden -z-10">
        <Image
          removeWrapper
          alt="custom themes background"
          className="h-full"
          src="/gradients/blue-purple-1.svg"
        />
      </div> */}
      {hasButton && (
        <Button
          aria-label="Access Upscaler"
          as={NextLink}
          className={buttonClassName}
          color={isPink ? "default" : color}
          href={navi}
          radius="full"
          size="lg"
          variant="flat"
          endContent={
            <ArrowRightIcon
              className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform"
              strokeWidth={2}
            />
          }
        >
          Get started
        </Button>
      )}
    </div>
  );
};

interface IntroProps {
  size: "sm" | "lg";
  introTitle: React.ReactNode | JSX.Element;
  leftImage: string;
  rightImage: string;
  navi: string;
  color: "primary" | "warning" | "success" | "secondary" | "pink";
  subTitleText: string;
  isExampleFront?: boolean;
}

export const Intro = ({
  size,
  introTitle,
  leftImage,
  rightImage,
  navi,
  color,
  subTitleText,
  isExampleFront = false,
}: IntroProps) => {
  const isMobile = useIsMobile();

  const exampleWidth = size === "lg" ? 768 : 512;
  const sectionWrapperClass = size === "lg" ? "mt-24 lg:mt-56" : "mt-12";
  const spacerSize = size === "lg" ? 12 : 6;

  const introTitleNode = (
    <IntroTitle
      size={size}
      navi={navi}
      color={color}
      subtitleText={subTitleText}
    >
      {introTitle}
    </IntroTitle>
  );

  const introExampleNode = (
    <IntroExample
      width={exampleWidth}
      leftImage={leftImage}
      rightImage={rightImage}
    />
  );

  return (
    <section className={sectionWrapper({ class: sectionWrapperClass })}>
      <div className="flex flex-row items-center justify-start">
        {isExampleFront ? introExampleNode : introTitleNode}
        <Spacer x={spacerSize} />
        {isExampleFront ? introTitleNode : introExampleNode}
      </div>
    </section>
  );
};

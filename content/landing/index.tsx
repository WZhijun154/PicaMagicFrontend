"use server";
import React from "react";
import { Code } from "@nextui-org/code";
// import { Icon } from "@iconify/react";
import { Dictionary } from "@/components/dictionary-provider";

import {
  MoonIcon,
  MagicIcon,
  FlashIcon,
  DevicesIcon,
  ServerLinearIcon,
  TagUserLinearIcon,
  MouseCircleLinearIcon,
  CodeDocumentLinearIcon,
  HtmlLogoLinearIcon,
  CubesLinearIcon,
} from "@/components/icons";
import { PhLightningBoldIcon } from "@/components/icons/lightning";
import { LockIcon } from "@/components/icons/lock";
import { DiamondIcon } from "@/components/icons/diamond";

export async function getFeatures(dictionary: Dictionary) {
  const features = {
    topFeatures: [
      {
        title: dictionary.features.topFeatures.fast.title,
        description: dictionary.features.topFeatures.fast.description,
        // icon: <FlashIcon className="text-pink-500" />,
        icon: <PhLightningBoldIcon className="text-pink-500" />,
      },
      {
        title: dictionary.features.topFeatures.privacy.title,
        description: dictionary.features.topFeatures.privacy.description,
        icon: <LockIcon className="text-pink-500" />,
      },
      {
        title: dictionary.features.topFeatures.simple.title,
        description: dictionary.features.topFeatures.simple.description,
        icon: <MagicIcon className="text-pink-500" />,
      },
      {
        title: dictionary.features.topFeatures.highQuality.title,
        description: dictionary.features.topFeatures.highQuality.description,
        icon: <DiamondIcon />,
      },
    ],
    fullFeatures: [
      {
        title: "React server components",
        description: (
          <>
            All NextUI components already include the{" "}
            <Code>&quot;use client&quot;</Code> directive, which means you can
            import and use them directly in your RSC.
          </>
        ),
        icon: <ServerLinearIcon className="text-pink-500" />,
      },
      {
        title: "Accessible components",
        description:
          "NextUI components follow the WAI-ARIA guidelines, provide keyboard support and sensible focus management.",
        icon: <TagUserLinearIcon className="text-pink-500" />,
      },
      {
        title: "Focus interactions",
        description:
          "Focus ring will appear only when user navigates with keyboard or screen reader.",
        icon: <MouseCircleLinearIcon className="text-pink-500" />,
      },
      {
        title: "Multiple packages",
        description:
          "NextUI is divided into multiple packages, so you can install only the components you need.",
        icon: <CubesLinearIcon className="text-pink-500" />,
      },
      {
        title: "TypeScript based",
        description:
          "Build type safe applications, NextUI has a fully-typed API to minimize the learning curve, and help you build applications.",
        icon: <CodeDocumentLinearIcon className="text-pink-500" />,
      },
      {
        title: "Override components tags",
        description:
          "A polymorphic `as` prop is included in all NextUI components.",
        icon: <HtmlLogoLinearIcon className="text-pink-500" />,
      },
      {
        title: "No runtime styles",
        description:
          "NextUI is based on Tailwind CSS, it means that there are no runtime styles, and no unnecessary classes in your bundle.",
        icon: <FlashIcon className="text-pink-500" />,
      },
      {
        title: "Beautifully designed",
        description:
          "NextUI components are unique and are not tied to any visual trend or design rule, which makes us unique and of course your projects as well.",
        icon: <MagicIcon className="text-pink-500" />,
      },
    ],
  };
  return features;
}

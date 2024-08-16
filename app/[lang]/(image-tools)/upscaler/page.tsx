"use client";
import BasicImageTaskApp from "@/components/image-tools/basic-image-task-app";
import { filesAtomForUpscaler } from "@/utils/file";

import { UpscalerIntro } from "@/components/marketing/intros/upscaler-intro";
import { useDictionary } from "@/components/dictionary-provider";

export default function Upscaler() {
  const dictionary = useDictionary();
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForUpscaler}
      actionButtonText={dictionary.imageTools.upscale}
      backendMethod="upscale_img"
      hero={<UpscalerIntro size="sm" />}
    />
  );
}

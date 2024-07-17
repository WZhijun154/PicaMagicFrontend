"use client";
import BasicImageTaskApp from "@/components/image-tools/basic-image-task-app";
import { filesAtomForUpscaler } from "@/utils/file";

import { UpscalerIntro } from "@/components/marketing/intros/upscaler-intro";

export default function Upscaler() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForUpscaler}
      actionButtonText="Upscale"
      backendMethod="upscale_img"
      hero={<UpscalerIntro size="sm" />}
    />
  );
}

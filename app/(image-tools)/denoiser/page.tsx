"use client";
import BasicImageTaskApp from "@/components/image-tools/basic-image-task-app";
import { filesAtomForDenoiser } from "@/utils/file";
import { DenoiserIntro } from "@/components/marketing/intros/denoiser-intro";

export default function Denoiser() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForDenoiser}
      hero={<DenoiserIntro size="sm" />}
      actionButtonText="Denoise"
      backendMethod="denoise_img"
      color="danger"
    />
  );
}

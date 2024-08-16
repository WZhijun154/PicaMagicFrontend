"use client";
import BasicImageTaskApp from "@/components/image-tools/basic-image-task-app";
import { filesAtomForDeblurer } from "@/utils/file";
import { DeblurerIntro } from "@/components/marketing/intros/deblurer-intro";

export default function Deblurer() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForDeblurer}
      hero={<DeblurerIntro size="sm" />}
      actionButtonText="Deblur"
      backendMethod="deblur_img"
      color="secondary"
    />
  );
}

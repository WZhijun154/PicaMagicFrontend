"use client";
import BasicImageTaskApp from "@/components/image-tools/basic-image-task-app";
import { filesAtomForBgRemover } from "@/utils/file";
import { BgRemoverIntro } from "@/components/marketing/intros/bgremover-intro";

export default function BgRemover() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForBgRemover}
      hero={<BgRemoverIntro size="sm" />}
      actionButtonText="Remove"
      backendMethod="remove_bg"
      color="success"
    />
  );
}

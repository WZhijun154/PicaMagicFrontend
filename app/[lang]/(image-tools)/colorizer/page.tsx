"use client";
import BasicImageTaskApp from "@/components/image-tools/basic-image-task-app";
import { filesAtomForColorizer } from "@/utils/file";

import { ColorizerIntro } from "@/components/marketing/intros/colorizer-intro";

export default function Colorizer() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForColorizer}
      actionButtonText="Colorize"
      backendMethod="colorize_img"
      hero={<ColorizerIntro size="sm" />}
      color="warning"
    />
  );
}

"use client";
import BasicImageTaskApp from "@/components/image-tools/basic-image-task-app";
import { filesAtomForBgRemover } from "@/utils/file";
import { BgRemoverIntro } from "@/components/marketing/intros/bgremover-intro";
import { useDictionary } from "@/components/dictionary-provider";

export default function BgRemover() {
  const dictionary = useDictionary();

  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForBgRemover}
      hero={<BgRemoverIntro size="sm" dictionary={dictionary} />}
      actionButtonText={dictionary.imageTools.remove}
      backendMethod="remove_bg"
      color="success"
    />
    // <div>Hello World</div>
  );
}

"use client";
import { Card } from "@nextui-org/card";
import { Icon } from "@iconify/react";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { clsx } from "@nextui-org/shared-utils";
import { useDictionary } from "../dictionary-provider";
export function FileDropCard() {
  const borderColor = useCurrentThemeColor({ intensity: 200 });
  const shadowColor = useCurrentThemeColor({ intensity: 300 });
  const dictionary = useDictionary();
  const cardClass = clsx(
    "w-[896px]",
    "h-[256px]",
    "flex",
    "flex-col",
    "justify-center",
    "items-center",
    "bg-default-100/40",
    "shadow-inner",
    `shadow-${shadowColor}`,
    "border-1",
    `border-${borderColor}`
  );

  return (
    <Card
      className={cardClass}
      // style={{
      //   boxShadow: "inset 0 2px 2px hsla(0, 0%, 0%, 0.7)",
      // }}
    >
      <div className="flex flex-col justify-center items-center hover:scale-110 transition-all">
        <Icon icon="bytesize:upload" className="text-[48px]" />
        <p className="text-[30px] text-default-600">{dictionary.addOrDrop}</p>
        <p className="text-[16px] text-default-400">
          {dictionary.supportImage}
        </p>
      </div>
    </Card>
  );
}

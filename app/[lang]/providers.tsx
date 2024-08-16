"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useRouter } from "next/navigation";
import { Provider as JotaiProvider } from "jotai";
import DictionaryProvider from "@/components/dictionary-provider";
import { Dictionary } from "@/components/dictionary-provider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  dictionary: Dictionary;
}

export function Providers({
  children,
  themeProps,
  dictionary,
}: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <DictionaryProvider dictionary={dictionary}>
          <JotaiProvider>{children}</JotaiProvider>
        </DictionaryProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

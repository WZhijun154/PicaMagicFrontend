"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useRouter } from "next/navigation";
import { Provider as JotaiProvider } from "jotai";
import DictionaryProvider from "@/components/dictionary-provider";
import { Dictionary } from "@/components/dictionary-provider";
import { LangProvider } from "@/components/dictionary-provider";
import { Locale } from "@/i18n-config";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  dictionary: Dictionary;
  lang: Locale;
}

export function Providers({
  children,
  themeProps,
  dictionary,
  lang,
}: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <DictionaryProvider dictionary={dictionary}>
          <LangProvider lang={lang}>
            <JotaiProvider>{children}</JotaiProvider>
          </LangProvider>
        </DictionaryProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

"use client";
import { getDictionary } from "@/get-dictionary";
import { useContext, createContext, ReactNode } from "react";
import { Locale } from "@/i18n-config";

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const DictionaryContext = createContext<Dictionary | null>(null);

export default function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);
  if (dictionary === null) {
    throw new Error(
      "useDictionary hook must be used within DictionaryProvider"
    );
  }

  return dictionary;
}

const LangContenx = createContext<Locale>("en");

export const LangProvider = ({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Locale;
}) => {
  return <LangContenx.Provider value={lang}>{children}</LangContenx.Provider>;
};

export function useLang() {
  const lang = useContext(LangContenx);
  if (lang === null) {
    throw new Error("useLang hook must be used within LangProvider");
  }

  return lang;
}

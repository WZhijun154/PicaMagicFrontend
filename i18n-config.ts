export const i18n = {
  defaultLocale: "en",
  // locales: ["en", "ja", "zh"],
  locales: ["en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
export const i18n = {
  defaultLocale: "ja",
  locales: ["ja"],
  // locales: ["en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const DEFAULT_LOCALE = "en" as const
export const SUPPORTED_LOCALES = ["en", "th"] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE
  const lang = navigator.language.split("-")[0].toLowerCase()
  return (SUPPORTED_LOCALES as readonly string[]).includes(lang)
    ? (lang as Locale)
    : DEFAULT_LOCALE
}

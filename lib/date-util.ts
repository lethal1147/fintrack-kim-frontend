import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import buddhistEra from "dayjs/plugin/buddhistEra"
import "dayjs/locale/th"
import type { Locale } from "@/lib/i18n-config"

dayjs.extend(relativeTime)
dayjs.extend(buddhistEra)

const TODAY = dayjs("2026-03-11") // fixed mock date — replace with dayjs() in production

const DATE_TEMPLATE: Record<Locale, string> = {
  en: "MMM D, YYYY",
  th: "D MMM BBBB",
}
const SHORT_DATE_TEMPLATE: Record<Locale, string> = {
  en: "MMM D",
  th: "D MMM",
}
const MONTH_TEMPLATE: Record<Locale, string> = {
  en: "MMMM YYYY",
  th: "MMMM BBBB",
}
const SHORT_MONTH_TEMPLATE: Record<Locale, string> = {
  en: "MMM",
  th: "MMM",
}

export const dateUtil = {
  /** "Mar 11, 2026" / "11 มี.ค. 2569" */
  format(date: string | Date, template?: string, locale: Locale = "en"): string {
    return dayjs(date)
      .locale(locale)
      .format(template ?? DATE_TEMPLATE[locale])
  },

  /** "March 2026" / "มีนาคม 2569" */
  formatMonth(monthIdx: number, year: number, locale: Locale = "en"): string {
    return dayjs().month(monthIdx).year(year).locale(locale).format(MONTH_TEMPLATE[locale])
  },

  /** Short month label for charts: "Mar" / "มี.ค." */
  formatShortMonth(date: string | Date, locale: Locale = "en"): string {
    return dayjs(date).locale(locale).format(SHORT_MONTH_TEMPLATE[locale])
  },

  /** "Mar 11" / "11 มี.ค." */
  formatShort(date: string | Date, locale: Locale = "en"): string {
    return dayjs(date).locale(locale).format(SHORT_DATE_TEMPLATE[locale])
  },

  /** Days from TODAY to the given ISO date string (negative = past) */
  daysUntil(isoDate: string): number {
    return dayjs(isoDate).diff(TODAY, "day")
  },

  /** Whole months from TODAY to the given ISO date string (0 minimum) */
  monthsUntil(isoDate: string): number {
    const diff = dayjs(isoDate).diff(TODAY, "month")
    return Math.max(0, diff)
  },

  /** "2 hours ago", "3 days ago", etc. */
  fromNow(date: string | Date, locale: Locale = "en"): string {
    return dayjs(date).locale(locale).fromNow()
  },
}

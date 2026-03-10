import dayjs from "dayjs"

const TODAY = dayjs("2026-03-11") // fixed mock date — replace with dayjs() in production

export const dateUtil = {
  /** "Mar 11, 2026" */
  format(date: string | Date, template = "MMM D, YYYY"): string {
    return dayjs(date).format(template)
  },

  /** "March 2026" */
  formatMonth(monthIdx: number, year: number): string {
    return dayjs().month(monthIdx).year(year).format("MMMM YYYY")
  },

  /** Short month label for charts: "Mar" */
  formatShortMonth(date: string | Date): string {
    return dayjs(date).format("MMM")
  },

  /** "Mar 11" */
  formatShort(date: string | Date): string {
    return dayjs(date).format("MMM D")
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
}

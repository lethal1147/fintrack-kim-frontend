import numeral from "numeral"

export const stringUtil = {
  /** "฿1,235" — rounded, no cents */
  formatMoney(value: number): string {
    return "฿" + numeral(value).format("0,0")
  },

  /** "฿1,234.56" — full precision */
  formatMoneyFull(value: number): string {
    return "฿" + numeral(value).format("0,0.00")
  },

  /** "1,234" — plain number with thousands separator */
  formatNumber(value: number): string {
    return numeral(value).format("0,0")
  },

  /** "JD" from "John Doe" */
  initials(name: string): string {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  },
}

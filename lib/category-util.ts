"use client"

import { useTranslations } from "next-intl"
import { INCOME_CATEGORIES } from "@/lib/categories"

/**
 * Returns a `getLabel(category)` function that translates a stored category key
 * (e.g. "Food & Dining") to the active locale's display string.
 * The stored value/key is always the English name — only the label changes.
 */
export function useCategoryLabel() {
  // next-intl types are strict; `as never` lets us pass any valid category string
  // without duplicating the key union — safe because the keys match CATEGORIES exactly.
  const tIncome = useTranslations("categories.income")
  const tExpense = useTranslations("categories.expense")

  return function getLabel(category: string): string {
    if ((INCOME_CATEGORIES as readonly string[]).includes(category)) {
      return tIncome(category as never)
    }
    return tExpense(category as never)
  }
}

# FinTrack — Claude Project Context

## Tech Stack

| Layer           | Library / Tool                       |
| --------------- | ------------------------------------ |
| Framework       | Next.js 16, App Router               |
| Styling         | Tailwind CSS v4, OKLCH color tokens  |
| UI Components   | shadcn/ui (`radix-nova` style)       |
| Icons           | `@tabler/icons-react` (Tabler Icons) |
| Charts          | shadcn `chart` (Recharts wrapper)    |
| State           | Zustand (`store/` directory)         |
| Date formatting | dayjs via `lib/date-util.ts`         |
| Number/currency | numeral via `lib/string-util.ts`     |
| Design research | Refero MCP                           |

## File Naming

- All files: **kebab-case** — `my-file-name.ts`, `add-goal-dialog.tsx`
- Component exports: PascalCase — `export function MyComponent`
- Zustand stores: `store/[name]-store.ts`
- Utility modules: `lib/[name]-util.ts`

## Constants

Every fixed value (tab labels, group names, option lists, route paths, magic strings/numbers)
must be extracted to an **UPPER_SNAKE_CASE constant** at the top of the file or in a
dedicated `constants.ts` file alongside the component.

```ts
// ✅ correct
const BUDGET_GROUPS = ["Fixed", "Flexible", "Non-Monthly"] as const
const PAGE_SIZE = 8

// ❌ wrong — magic value inline
items.slice(0, 8)
```

## File Size Limit

**Hard limit: 250 lines per file.**
If a file exceeds this, split it into:

- `components/app/[page]/` — sub-components
- `components/app/[page]/constants.ts` — constants and local types
- `lib/[name]-util.ts` — shared utilities

## Date Formatting

Always use `lib/date-util.ts` (powered by dayjs). Never use `new Date().toLocaleDateString()`
or manual date arithmetic inline.

```ts
import { dateUtil } from "@/lib/date-util"

dateUtil.format(date, "MMM D, YYYY") // "Mar 11, 2026"
dateUtil.formatMonth(date) // "March 2026"
dateUtil.daysUntil(isoString) // number (negative = past)
dateUtil.monthsUntil(isoString) // number
```

## Currency / String Formatting

Always use `lib/string-util.ts` (powered by numeral). Never write inline
`Intl.NumberFormat` or manual string helpers.

```ts
import { stringUtil } from "@/lib/string-util"

stringUtil.formatMoney(1234.5) // "$1,235"
stringUtil.formatMoneyFull(1234.56) // "$1,234.56"
stringUtil.initials("John Doe") // "JD"
```

## State Management

Use Zustand stores in `store/`. Store files are named `[domain]-store.ts`.

```ts
import { useTransactionsStore } from "@/store/transactions-store"

const { transactions, addTransaction } = useTransactionsStore()
```

**Rule:** Never use local `useState` for _app data_ (transactions, accounts, budget,
goals, recurring items). Local `useState` is fine for _UI state_ (dialog open/closed,
form field values, active tab, current page number).

## shadcn Components

Always install via CLI — never create manually:

```bash
npx shadcn add <component-name>
```

Installed so far: `button`, `card`, `input`, `label`, `chart`, `progress`, `badge`,
`separator`, `dialog`, `select`, `switch`, `tabs`

## Route Groups

- `app/(auth)/` — unauthenticated (login, register)
- `app/(app)/` — authenticated shell with sidebar

## Mock Data

All static data lives in `lib/mock-data.ts`. No backend yet.

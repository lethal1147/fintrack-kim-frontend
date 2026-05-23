## Overview

FinTrack's design language reads like a precision instrument calibrated for clarity. The application lives on a clean white canvas in light mode and a deep near-black in dark mode, with a single violet brand ramp threading through every interactive element — primary buttons, active sidebar items, chart fills, progress arcs. There is no illustration, no decorative texture, no mascot; just clean type, restrained surfaces, and data-forward layouts where numbers are always the star.

The palette is deliberately narrow. A five-step violet ramp (`{colors.violet-faint}` through `{colors.violet-deep}`) anchors both interactive UI and data visualization, ensuring brand color and data ink remain coherent — when a chart bar turns violet and a primary button turns violet, they feel like the same system, not an accident. The neutral scale carries a faint warm-purple undertone (hue ~286 in OKLCH) that keeps grays from reading cold or clinical. Financial products demand trust; sterile cool-grays undermine it.

Typography uses two families with a clear contract: **DM Sans** handles every UI text role — labels, body, headings, buttons — while **Geist Mono** is reserved exclusively for numeric values in data contexts (monetary amounts, percentages, counts). This split is functional, not decorative: Geist Mono's tabular figures keep currency amounts column-aligned in tables and stat cards without CSS hacks.

The app has exactly one canvas polarity — no marketing/dark alternation. Light mode is the primary authoring surface; dark mode inverts the neutral scale while preserving the violet brand. No surface ever blends the two modes on a single page. Every component is designed data-first: KPI cards surface a single number clearly, charts use the violet ramp from faint to deep to encode magnitude, progress bars stay on-brand with violet fills.

**Key Characteristics:**
- Single-page-application dashboard shell: persistent sidebar, scrollable main content area, no full-page navigations.
- Violet-ramp brand palette that doubles as the data visualization scale — brand and data ink are the same ink.
- Numeric values always in `{typography.mono}` (Geist Mono) for tabular-figure alignment; labels and copy always in `{typography.sans}` (DM Sans).
- Cards carry no drop shadow on the light canvas — `{colors.border}` hairlines separate surface from surface. Elevation is reserved for modals and popovers.
- Income is semantic green (`{colors.success}`), expense is semantic red (`{colors.destructive}`) — these are the only uses of non-violet accent; chart series never use them.
- `{rounded.lg}` (10px) on cards and dialogs; `{rounded.md}` (8px) on inputs and buttons; `{rounded.full}` on avatars and progress bars.

---

## Colors

> **Source:** `app/globals.css` — all tokens are OKLCH. Hex approximations are provided for reference only; always use CSS custom properties in code.

### Brand — Violet Ramp

The violet ramp is the single brand accent family. It serves two roles simultaneously: interactive UI state (buttons, focus rings, active nav) and data encoding (chart fills, progress fills). The ramp runs light-to-deep; lighter values signal less emphasis or lower data magnitude, deeper values signal primary actions or higher data magnitude.

- **Violet Faint** (`{colors.violet-faint}` — `var(--chart-1)` ≈ `#C4A8EF`): Lightest chart fill. Hover states on ghost interactive elements. Background tint on active sidebar items.
- **Violet Light** (`{colors.violet-light}` — `var(--chart-2)` ≈ `#9555E2`): Secondary chart series. Sidebar primary highlight in light mode.
- **Violet Mid** (`{colors.violet-mid}` — `var(--chart-3)` ≈ `#7C3AED`): Tertiary chart series.
- **Violet** (`{colors.violet}` — `var(--primary)` ≈ `#6D28D9`): Primary action color in light mode. Filled button background. Active tab indicator.
- **Violet Deep** (`{colors.violet-deep}` — `var(--chart-5)` ≈ `#5B21B6`): Deepest chart fill. Primary action in dark mode.

### Surface — Light Mode

- **Background** (`{colors.background}` — `oklch(1 0 0)` = `#FFFFFF`): Page-level canvas and main content area.
- **Card** (`{colors.card}` — `oklch(1 0 0)` = `#FFFFFF`): Card and panel surface. Identical to background — cards are separated by border, not by fill contrast.
- **Muted** (`{colors.muted}` — `oklch(0.967 0.001 286.375)` ≈ `#F5F4F8`): Input fill, secondary button fill, skeleton loader fill, table row hover.
- **Sidebar** (`{colors.sidebar}` — `oklch(0.985 0 0)` ≈ `#FAFAFA`): Sidebar panel. Slightly off-white to visually separate from the main canvas.
- **Popover** (`{colors.popover}` — `oklch(1 0 0)` = `#FFFFFF`): Dropdown menus, tooltips, command palette.

### Surface — Dark Mode

- **Background Dark** (`{colors.background-dark}` — `oklch(0.141 0.005 285.823)` ≈ `#18161F`): Page-level canvas in dark mode.
- **Card Dark** (`{colors.card-dark}` — `oklch(0.21 0.006 285.885)` ≈ `#2A2733`): Card and panel surface in dark mode.
- **Muted Dark** (`{colors.muted-dark}` — `oklch(0.274 0.006 286.033)` ≈ `#3A3745`): Input fill, secondary button fill, skeleton fill in dark mode.
- **Sidebar Dark** (`{colors.sidebar-dark}` — `oklch(0.21 0.006 285.885)` ≈ `#2A2733`): Sidebar panel in dark mode.

### Text

- **Foreground** (`{colors.foreground}` — `oklch(0.141 0.005 285.823)` ≈ `#18161F`): Body text, heading text, icon fills on light canvas.
- **Foreground Dark** (`{colors.foreground-dark}` — `oklch(0.985 0 0)` ≈ `#FAFAFA`): Body text on dark canvas.
- **Muted Foreground** (`{colors.muted-foreground}` — light: `oklch(0.552 0.016 285.938)` ≈ `#7E7A8E` / dark: `oklch(0.705 0.015 286.067)` ≈ `#ABA7B8`): Secondary labels, captions, placeholder text, icon fills on inactive items.
- **Primary Foreground** (`{colors.primary-foreground}` — `oklch(0.977 0.014 308.299)` ≈ `#F5F0FF`): Text on filled violet buttons and active sidebar items.

### Semantic

- **Border** (`{colors.border}` — light: `oklch(0.92 0.004 286.32)` ≈ `#E8E6EE` / dark: `oklch(1 0 0 / 10%)`): Card borders, input borders, table dividers, hairline separators.
- **Input** (`{colors.input}` — light: same as `{colors.border}` / dark: `oklch(1 0 0 / 15%)`): Input field border. Slightly more prominent than `{colors.border}` on dark surfaces.
- **Ring** (`{colors.ring}` — light: `oklch(0.705 0.015 286.067)` / dark: `oklch(0.552 0.016 285.938)`): Focus ring around interactive elements. 2px solid, offset 2px.
- **Destructive** (`{colors.destructive}` — light: `oklch(0.577 0.245 27.325)` ≈ `#DC2626` / dark: `oklch(0.704 0.191 22.216)` ≈ `#EF4444`): Error states, delete actions, expense-type badges. **Reserved for semantics only** — never used as a chart series.
- **Success** (no CSS variable — use Tailwind `green-600` / `green-500`): Income-type badges, positive delta indicators, budget-under markers. Suggested: `#16A34A` light / `#22C55E` dark.
- **Warning** (no CSS variable — use Tailwind `amber-500` / `amber-400`): Budget-overrun indicators, near-limit progress bars. Suggested: `#F59E0B` light / `#FBBF24` dark.

### Chart Palette

Used in order for multi-series charts. Never assign red (`{colors.destructive}`) or green (`{colors.success}`) to a chart series — those are semantic only.

| Series | Token | Approx Hex |
|---|---|---|
| 1 (lightest) | `var(--chart-1)` | `#C4A8EF` |
| 2 | `var(--chart-2)` | `#9555E2` |
| 3 | `var(--chart-3)` | `#7C3AED` |
| 4 | `var(--chart-4)` | `#6D28D9` |
| 5 (deepest) | `var(--chart-5)` | `#5B21B6` |

---

## Typography

### Font Families

**DM Sans** (`{typography.sans}` — `var(--font-sans)`) is the exclusive UI font. It handles every role except numeric data display. DM Sans reads cleanly at small sizes with geometric, optically-balanced letterforms — appropriate for a data-dense dashboard where labels must be legible at 12px.

**Geist Mono** (`{typography.mono}` — `var(--font-geist-mono)`) is reserved for all numeric values in data contexts: currency amounts in stat cards and tables, percentages, transaction totals, goal progress. Its tabular figures (all glyphs same width) keep decimal points column-aligned without CSS alignment hacks.

### Hierarchy

| Token | Family | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `{typography.page-title}` | DM Sans | 24px / 1.5rem | 700 | 1.2 | 0 | Page-level `<h1>` in page headers |
| `{typography.section-heading}` | DM Sans | 18px / 1.125rem | 600 | 1.25 | 0 | Section headings inside pages, dialog titles |
| `{typography.card-title}` | DM Sans | 14px / 0.875rem | 600 | 1.25 | 0 | Card header labels, widget titles |
| `{typography.body-md}` | DM Sans | 14px / 0.875rem | 400 | 1.5 | 0 | Default UI body, table cells, descriptions |
| `{typography.body-sm}` | DM Sans | 12px / 0.75rem | 400 | 1.5 | 0 | Captions, helper text, timestamps |
| `{typography.label}` | DM Sans | 12px / 0.75rem | 500 | 1.4 | 0.01em | Form labels, column headers |
| `{typography.button}` | DM Sans | 14px / 0.875rem | 500 | 1 | 0 | Button labels (sentence case) |
| `{typography.badge}` | DM Sans | 11px / 0.6875rem | 500 | 1.4 | 0.02em | Badge text, pill labels |
| `{typography.stat-value}` | Geist Mono | 28px / 1.75rem | 700 | 1 | -0.02em | KPI stat card primary number |
| `{typography.stat-value-sm}` | Geist Mono | 20px / 1.25rem | 600 | 1 | -0.01em | Smaller stat number, chart center label |
| `{typography.amount}` | Geist Mono | 14px / 0.875rem | 500 | 1.5 | 0 | Transaction amounts in table rows |
| `{typography.amount-lg}` | Geist Mono | 16px / 1rem | 600 | 1.5 | 0 | Subtotals, dialog totals |
| `{typography.code}` | Geist Mono | 13px / 0.8125rem | 400 | 1.5 | 0 | Code snippets, API keys, OTP inputs |

### Principles

- **DM Sans for copy, Geist Mono for numbers.** The split is absolute. Never render a currency amount in DM Sans; never render a nav label in Geist Mono.
- **Sentence case everywhere.** Buttons, nav items, headings, form labels — all sentence case. No ALL CAPS in the app shell (the auth surface is the only exception if needed for legal copy).
- **Weight carries hierarchy, not size alone.** Card titles and body text share 14px — the 600 vs 400 weight difference is the only visual signal needed. Avoid introducing intermediate sizes (15px, 13px) outside the scale.
- **Mono tracking is negative on large stat values.** Apply `letter-spacing: -0.02em` to `{typography.stat-value}` to counteract Geist Mono's open default tracking at display sizes.

---

## Layout

### Spacing System

- **Base unit**: 4px
- **Tokens**: `{spacing.1}` 4px · `{spacing.2}` 8px · `{spacing.3}` 12px · `{spacing.4}` 16px · `{spacing.5}` 20px · `{spacing.6}` 24px · `{spacing.8}` 32px · `{spacing.10}` 40px · `{spacing.12}` 48px · `{spacing.16}` 64px

| Role | Token | Value |
|---|---|---|
| Card internal padding | `{spacing.6}` | 24px |
| Page padding (desktop) | `{spacing.6}` – `{spacing.8}` | 24px – 32px |
| Page padding (mobile) | `{spacing.4}` | 16px |
| Grid gap (card grid) | `{spacing.6}` | 24px |
| Form field gap | `{spacing.4}` | 16px |
| Button padding (default) | `{spacing.3}` / `{spacing.4}` | 12px / 16px |
| Sidebar width | fixed | 256px (w-64) |
| Stat card inner gap | `{spacing.3}` | 12px |
| Table row height | min `{spacing.10}` | 40px |

### Grid

The app shell uses a fixed sidebar + fluid main content model — not a CSS grid at the page level. Within the main content area, card grids use CSS grid with `gap-6` and `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for KPI rows.

| Region | Pattern |
|---|---|
| KPI stat row (dashboard) | 4-up at lg, 2-up at sm, 1-up at base |
| Chart row | 2-up at lg (60/40 or 50/50 split), 1-up at base |
| Budget / goal list | single-column, full-width cards |
| Settings tabs | single-column form within max-w container |
| Dialogs | max-w-lg, centered in viewport |

### Whitespace Philosophy

Whitespace in FinTrack is dense by default — this is a scanning surface, not a reading surface. `{spacing.6}` (24px) between cards is the floor for breathing room; go tighter only for items in a list within a card (8px gap is correct for transaction rows). Page-level outer padding never collapses below `{spacing.4}` (16px) on any viewport. Tables are the densest surface in the system — row height is 40px and cell padding is `{spacing.3}` vertical, `{spacing.4}` horizontal.

---

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | No shadow, `{colors.border}` hairline | Cards, inputs, sidebar — all flat on canvas |
| 1 | `box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Not used in the current app shell |
| 2 | `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)` | Dropdown menus, command palette, select popover |
| 3 | `box-shadow: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)` | Modal dialogs and sheets |

FinTrack's depth model is almost entirely **flat**. Cards do not elevate above canvas — they are distinguished by the `{colors.border}` hairline only. This is intentional: on a dashboard where 8–12 cards are visible simultaneously, any drop shadow creates visual noise that competes with data. Elevation appears only where an element is genuinely floating above the page (dropdowns, modals).

---

## Shapes

### Border Radius Scale

All radii derive from `--radius: 0.625rem` (10px) in `globals.css`.

| Token | Value | Use |
|---|---|---|
| `{rounded.sm}` | 6px (`calc(--radius * 0.6)`) | Tags inside cells, micro-badges |
| `{rounded.md}` | 8px (`calc(--radius * 0.8)`) | Buttons, form inputs, select triggers, code blocks |
| `{rounded.lg}` | 10px (`--radius`) | Cards, panels, dialogs, dropdowns |
| `{rounded.xl}` | 14px (`calc(--radius * 1.4)`) | Large modals, full-panel containers |
| `{rounded.2xl}` | 18px (`calc(--radius * 1.8)`) | Avatar containers, onboarding panels |
| `{rounded.full}` | 9999px | Avatars, progress bar fills, status dot indicators |

The `{rounded.lg}` (10px) radius on cards is deliberately generous — slightly rounder than shadcn's default (8px) to give FinTrack a warmer, less corporate edge. Never increase this; the friendliness comes from the round corner plus the restrained palette, not from either alone.

---

## Components

> Each entry describes Default state only. Interaction states (hover, focus, pressed, disabled) follow the shadcn/radix-nova baseline unless noted.

### Buttons

**`button-primary`** — the main CTA.
- Background `{colors.violet}`, text `{colors.primary-foreground}`, type `{typography.button}`, padding `{spacing.3}` / `{spacing.4}` (12px 16px), height 36px, rounded `{rounded.md}`.
- Hover: background lightens ~5% lightness in OKLCH. Focus: `{colors.ring}` 2px solid, offset 2px. Disabled: opacity 50%.

**`button-secondary`** — neutral secondary action (e.g., "Cancel", filter toggles).
- Background `{colors.muted}`, text `{colors.foreground}`, same shape as primary.

**`button-outline`** — de-emphasized action alongside a primary CTA.
- Background transparent, border 1px `{colors.border}`, text `{colors.foreground}`.

**`button-ghost`** — inline icon-buttons, sidebar actions, row actions.
- Background transparent, no border, text `{colors.muted-foreground}`. Hover: background `{colors.muted}`.

**`button-destructive`** — delete / remove actions inside dialogs.
- Background `{colors.destructive}`, text white. Only appears inside a confirmation dialog, never as an ambient page action.

### Stat Cards (KPI)

The primary data surface on the dashboard. Each card surfaces one metric.

- Container: `{colors.card}` fill, 1px `{colors.border}` border, `{rounded.lg}` corner, `{spacing.6}` padding.
- Header row: small icon (Tabler, 20px, `{colors.muted-foreground}`) + label in `{typography.card-title}` + optional period badge.
- Stat value: `{typography.stat-value}` (Geist Mono 28px/700). Always the visual anchor of the card.
- Delta row: period-over-period change — arrow icon + percentage in `{typography.body-sm}`. Green (`{colors.success}`) for positive, red (`{colors.destructive}`) for negative. Secondary text in `{colors.muted-foreground}`.

### Data Cards (Chart, List, Table)

- Same container as stat cards.
- Header: `{typography.section-heading}` title on the left, optional `button-ghost` or `button-outline` controls on the right.
- Content area: no inner padding override — charts run edge-to-edge within the card's `{spacing.6}` padding; tables use their own row padding.

### Transaction Table / List Rows

- Row height: min 40px, vertically centered content.
- Merchant: `{typography.body-md}` in `{colors.foreground}`.
- Category: badge (see Badges).
- Date: `{typography.body-sm}` in `{colors.muted-foreground}`.
- Amount: `{typography.amount}` (Geist Mono). Income: `{colors.success}` prefixed with `+`. Expense: `{colors.destructive}` or `{colors.foreground}` (uncolored) — consistent per page context.
- Row divider: 1px `{colors.border}`. No zebra striping.
- Hover: background `{colors.muted}`.

### Budget Progress Rows

- Category name in `{typography.body-md}`.
- Spent / budgeted fraction in `{typography.amount}` (Geist Mono), right-aligned.
- Progress bar: `{rounded.full}`, `{colors.muted}` track, violet fill by default. When spent > budgeted, fill switches to `{colors.destructive}`. Height: 6px.
- Percentage label in `{typography.body-sm}`, `{colors.muted-foreground}`.

### Goal Progress Cards

- Goal name in `{typography.card-title}` with emoji prefix.
- Target amount and current amount in `{typography.amount}` (Geist Mono).
- Progress arc or bar in `{colors.violet}` fill on `{colors.muted}` track.
- "X months to go" label in `{typography.body-sm}`, `{colors.muted-foreground}`.

### Badges and Pills

**`badge-income`** — transaction type indicator.
- Background `green-100` (light) / `green-900/40` (dark), text `green-700` (light) / `green-400` (dark), `{rounded.sm}`, `{spacing.1}` / `{spacing.2}` padding.

**`badge-expense`**
- Background `red-100` / `red-900/40`, text `red-700` / `red-400`. Same shape.

**`badge-category`** — transaction category chip (Food, Transport, etc.).
- Background `{colors.muted}`, text `{colors.muted-foreground}`, `{rounded.sm}`. Neutral — never colored by category.

**`badge-status`** — recurring item status (active / paused).
- Active: `{colors.violet-faint}` background, `{colors.violet}` text.
- Paused: `{colors.muted}` background, `{colors.muted-foreground}` text.

### Sidebar Navigation

- Panel: `{colors.sidebar}` fill, 1px `{colors.sidebar-border}` right border, fixed width 256px.
- Logo: top of sidebar, `{spacing.6}` padding.
- Nav item: `{typography.body-md}`, 20px Tabler icon + label, `{rounded.md}`, `{spacing.2}` / `{spacing.3}` padding.
  - Default: text `{colors.sidebar-foreground}`.
  - Active: background `{colors.sidebar-accent}`, text `{colors.sidebar-primary}`, icon `{colors.sidebar-primary}`.
  - Hover (inactive): background `{colors.sidebar-accent}`.
- User row: avatar + name/email, anchored to sidebar bottom.

### Forms and Inputs

**`text-input`** — standard form field.
- Background `{colors.background}` (transparent inside a white card), border 1px `{colors.input}`, rounded `{rounded.md}`, height 36px, padding `{spacing.2}` / `{spacing.3}`.
- Focus: ring `{colors.ring}` 2px, offset 2px.
- Placeholder: `{colors.muted-foreground}`.

**`select`** — dropdown select trigger — same shape as `text-input`. Popover uses `{rounded.lg}`, elevation level 2.

**`label`** — form field label above input.
- Type `{typography.label}`, color `{colors.foreground}`, `{spacing.1}` gap above input.

### Dialogs and Sheets

- Container: `{colors.card}` fill, `{rounded.xl}`, elevation level 3, max-w-lg.
- Overlay: `rgba(0,0,0,0.5)` backdrop.
- Header: `{typography.section-heading}` title + optional description in `{typography.body-md}` `{colors.muted-foreground}`.
- Footer: right-aligned button row — destructive / cancel / confirm from left to right.
- Padding: `{spacing.6}` on all sides.

---

## Do's and Don'ts

### Do
- Always render currency amounts and numeric stats in Geist Mono — the tabular figures are the reason the font is in the stack.
- Use the five-step violet ramp exclusively for chart series and data fills. Respect the order (chart-1 → chart-5 = faint → deep).
- Reserve `{colors.destructive}` for error states, delete actions, and expense-type semantic coloring — never for a chart series or decorative accent.
- Reserve `{colors.success}` (green) for income-type indicators and positive deltas only.
- Keep all cards flat (no drop shadow) — use the `{colors.border}` hairline as the only card separator.
- Use `{rounded.lg}` (10px) for cards and dialogs. Do not mix in tighter radii (4px, 6px) on containers — they read as foreign.
- Write button labels in sentence case — "Add transaction", not "ADD TRANSACTION" or "Add Transaction".
- Use `{colors.muted}` as the progress bar track and `{colors.violet}` as the fill. Switch fill to `{colors.destructive}` only when the metric is over limit.

### Don't
- Don't introduce teal, orange, pink, or any non-violet, non-semantic color. The violet ramp is the only data ink.
- Don't apply drop shadows to cards — on a 12-card dashboard layout they create visual noise that competes with data.
- Don't use green or red for chart series. Income/expense color encoding belongs only on badges and delta indicators, not on chart bars or pie slices.
- Don't use DM Sans for currency values in tables or stat cards — the proportional figures break column alignment.
- Don't use ALL CAPS for any UI copy in the app shell. Sentence case is the system standard.
- Don't create intermediate type sizes (15px, 13px, 11px outside of badges). The scale is the scale.
- Don't put a primary button inside every card — use ghost or outline within cards; primary belongs in page headers and dialogs only.
- Don't color-code categories with per-category hues (red for Food, blue for Transport). Category chips are neutral `{colors.muted}` — color carries semantic meaning only.

---

## Responsive Behavior

### Breakpoints

FinTrack uses Tailwind's default breakpoints:

| Name | Min Width | Key Changes |
|---|---|---|
| `sm` | 640px | 2-column KPI grid; single-column at base |
| `md` | 768px | Sidebar always visible; mobile: sidebar hidden, top nav |
| `lg` | 1024px | 4-column KPI grid; 2-column chart row |
| `xl` | 1280px | Wider page padding `{spacing.8}` replaces `{spacing.6}` |
| `2xl` | 1536px | Max content width 1280px centered |

### Touch Targets
- All interactive elements (buttons, nav items, table row actions) minimum 36px height × 36px width on desktop.
- On mobile (< md): minimum 44px height to meet WCAG touch-target guidelines.
- Table row action icons use `button-ghost` with `p-2` to ensure 36px hit area despite 20px icon.

### Collapsing Strategy

- **Sidebar**: Visible and fixed at `md` and above. Hidden at `sm` and below (slide-in drawer or top navigation bar pattern).
- **KPI card grid**: 4-up at `lg` → 2-up at `sm` → 1-up at base. Never render KPI cards in a horizontal scroll — stack them.
- **Chart row**: 2-column (60/40 split) at `lg` → 1-column (full-width) at base. Charts never shrink below 280px height.
- **Tables**: At `sm` and below, switch transaction tables to a card-list layout (each row becomes a stacked card). Do not use horizontal scroll on transaction data.
- **Dialogs**: Full-screen sheet at `sm` and below; centered modal at `md` and above.
- **Sidebar stats** (user name/email): Truncate to single line with `text-ellipsis` at all viewport sizes — never wrap.

---

## Iteration Guide

1. Focus on **one component at a time**. Don't patch the whole system — extend it.
2. Reference tokens directly (`{colors.violet}`, `{typography.stat-value}`, `{rounded.lg}`) — do not hardcode hex or pixel values in component CSS.
3. New chart series colors must come from the violet ramp in order. Never add an ad hoc color to a chart.
4. When adding a new status badge, follow the existing `badge-income` / `badge-expense` pattern: use Tailwind's semantic color scale (green/red/amber/violet) with `/10` or `/40` bg opacity and full-opacity text — do not invent new hex tints.
5. Any new numeric data field — regardless of size — must use `{typography.mono}` (Geist Mono). Mark the decision in a comment if the reviewer might question it.
6. Run `npm run build` and `npm run lint` after any globals.css or component change. OKLCH tokens are not validated by TypeScript — a typo in a CSS variable is invisible until build or browser.
7. When introducing a new interactive state, test both light and dark mode. The OKLCH neutral scale (hue ~286) means color-mixing functions like `color-mix(in oklch, ...)` will stay on-brand automatically — prefer them over hardcoded dark-mode overrides.

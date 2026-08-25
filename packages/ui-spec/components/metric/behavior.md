# Metric — behavior

## Renders the value

- **Given** `value`, `unit`
  **Then** the value is the highest-hierarchy element (`text-2xl font-semibold`)
  with the unit beside it at a smaller muted size — both share one baseline row.

## Stats row layout

- **Given** any combination of `icon`, `value`, `unit`, `badge`, `tooltip`, `caption`
  **Then** the left side of the stats row holds icon badge → value → unit → badge
  → tooltip affordance (in that order); the right side holds the optional caption.
  The row is `justify-between`, so left and right sit at the ends.

## Composes a trend

- **Given** `trend="up"` (or `"down"` or `"stable"`)
  **Then** a `TrendIndicator` renders on its own row below the stats row.
  Direction and sentiment are derived automatically: `up` → positive,
  `down` → negative, `stable` → neutral. Pair with `trendValue` for the change
  text. Metric never computes or interprets the values.

## Value is caller-formatted

- **Given** `value="$72K"` (or `value={82}`, or a ReactNode)
  **Then** it renders verbatim — the kit never formats currency, units, or
  decimals, and never decides whether the value is good or bad.

## Icon badge is always info-tinted

- **Given** an `icon`
  **Then** it renders in a fixed `size-9` rounded badge using the info status
  tint (`--ui-background-status-info` fill, `--ui-glyph-on-surface-neutral-dark`
  icon color) unconditionally — the badge is a contextual slot, not a status
  signal.

## Loading

- **Given** `loading`
  **Then** a `Skeleton` renders in place of the value, preserving its space.
- No data: the consumer passes `value="—"` — never `0`, which is a real value.

## Tooltip

- **Given** a `tooltip`, **then** an info affordance (`CircleInfoIcon`, 16 px,
  named by `tooltipLabel`) appears next to the value and reveals the hint on
  hover/focus; it is keyboard-reachable via Base UI `Tooltip`.

## Body

- **Given** `children` (a chart, a `Separator`, an insight line)
  **Then** they render below the stats strip. No card chrome wraps them — Metric
  is a plain `<div>`.

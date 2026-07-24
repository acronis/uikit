# Metric — behavior

## Renders the value hierarchy

- **Given** `label`, `value`, `unit`
  **Then** the value is the highest-hierarchy element with the unit beside it at a
  smaller muted size, and the label sits above as an uppercase note heading.

## Card + body

- Metric renders as a Card. **Given** `children` (a chart, a Separator, an
  insight line), **then** they render as the card body below the header.

## Composes a trend

- **Given** a `trend` (typically a `TrendIndicator`)
  **Then** it renders on the right of the value row; Metric never computes or
  interprets it.

## Value is caller-formatted

- **Given** `value="$72K"` (or `value={82}`, or a ReactNode)
  **Then** it renders verbatim — the kit never formats currency, units, or
  decimals, and never decides whether the value is good or bad.

## Status is subtle

- `status` is one of `neutral | info | success | warning | danger | critical`.
- **Given** a non-neutral `status` (e.g. `danger`)
  **Then** the icon badge is tinted with that status family — its
  `--ui-background-status-<status>-pressed` fill + `--ui-text-on-status-<status>`
  icon color — never a full color fill of the whole metric.

## Loading and no-data

- **Given** `loading`
  **Then** a skeleton renders in place of the value, preserving its space.
- No data: the consumer passes `value="—"` — never `0`, which is a real value.

## Caption and tooltip

- **Given** a `caption` (e.g. a timeframe Tag), **then** it renders top-right,
  aligned with the label.
- **Given** a `tooltip`, **then** an info affordance (named by `tooltipLabel`)
  appears next to the label and reveals the hint on hover/focus; it is
  keyboard-reachable.

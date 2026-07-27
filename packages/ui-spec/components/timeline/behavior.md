# Timeline — behavior

## Renders a semantic event list

- **Given** `Timeline.Item`s
  **Then** they render as `<li>`s inside an `<ol>`, top to bottom, joined by a
  connector line; the last item's connector is hidden.

## Item content

- **Given** `timestamp`, `title`, `description`
  **Then** the timestamp sits above the title, with the description below.
- **Given** `metadata` / `actions` / `children`
  **Then** they render under the description, in that order.

## Status tints the marker only

- `status` is `neutral | info | success | warning | danger | critical`.
- **Given** a non-neutral `status`
  **Then** only the marker is tinted (a dot in the status color, or an icon in a
  `-pressed` badge) — never large blocks of text.

## Icon vs dot

- **Given** an `icon`, **then** the marker is a status-tinted badge holding it;
  otherwise the marker is a plain status-colored dot.

## Current / disabled

- **Given** `current`, **then** the marker renders as a ring (for process-style
  "current step" usage).
- **Given** `disabled`, **then** the item is dimmed, marked `aria-disabled` for
  assistive tech, and its slotted controls stop taking pointer input
  (`pointer-events-none`).

## What it does not do

- It never sorts, groups, fetches, or de-duplicates events, and never decides an
  event's status or icon — the caller passes ordered items with resolved
  `status` / `icon` / formatted `timestamp`.
- It is not a temporal chart — use a Line / Area / Composed chart for trends.

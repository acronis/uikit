# Card — accessibility

Card is a presentational grouping container. It carries **no implicit ARIA
semantics** — the parts render as plain `<div>`s by default. Accessibility is a
function of how the card is composed and what the author opts into.

## Roles & semantics

- The root is a generic `<div>` with no role by default. If the card represents a
  meaningful standalone region, render it as a landmark/section via the `render`
  prop (e.g. `render={<section aria-labelledby="…" />}`) so assistive tech can
  navigate to it.
- `CardTitle` renders as a `<div>` by default, which has **no heading
  semantics**. When the title is the heading of a content region, render it as a
  real heading — `<CardTitle render={<h2 />}>` — at the level appropriate to the
  surrounding document outline. Do not skip heading levels.
- Associate the region with its title when using a landmark:
  `<Card render={<section aria-labelledby="card-title" />}>` +
  `<CardTitle id="card-title" render={<h2 />}>`.

## Keyboard

- Card itself is not interactive and is not in the tab order.
- Interactive children (buttons, links, inputs placed in the content or footer)
  retain their own keyboard behavior and focus order — Card does not trap,
  reorder, or intercept focus.

## Screen reader

- With no role, the card's children are announced inline in reading order. Use a
  landmark + `aria-labelledby` (above) when the grouping itself should be
  announced and navigable.

## Contrast

- Text on the card surface uses `--ui-text-on-surface-primary` (title/body) and
  `--ui-text-on-surface-secondary` (description) against
  `--ui-background-surface-primary`; these token pairings meet WCAG AA in both
  light and dark themes. The 1px border uses `--ui-border-on-surface-border`.
- This is a design-pending v1 on semantic tokens — re-verify contrast against the
  final palette once a `--ui-card-*` tier and Figma reference exist.

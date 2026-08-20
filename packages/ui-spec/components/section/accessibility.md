# Section — accessibility

Section is a presentational grouping container plus a header that composes a
real interactive control (the switch). Accessibility is partly a function of
how the section is composed and partly built into `SectionHeader`'s own
controls.

## Roles & semantics

- The root is a generic `<div>` with no role by default. If the section
  represents a meaningful standalone region, render it as a landmark via the
  `render` prop (e.g. `render={<section aria-labelledby="…" />}`) so
  assistive tech can navigate to it.
- `SectionHeader`'s title renders as a `<p>` by default, which has **no
  heading semantics**. When the title is the heading of the region, wrap the
  section in a landmark and label it via `aria-labelledby` pointing at an
  external heading, or render the root with an appropriate `aria-label`.
- The header's `icon` (when provided) is decorative — it carries no
  independent accessible name and relies on the title text next to it to
  convey meaning.

## Keyboard

- Section itself is not interactive and is not in the tab order.
- The header switch (`isSwitchable`) is a real Base UI `Switch` — reachable
  by Tab and toggled with Space, per its own component contract.
- The collapse trigger (`isCollapsible`, composed with `AccordionContainer`)
  is a real Base UI `Collapsible.Trigger` — reachable by Tab and activated
  with Enter/Space; ARIA `aria-expanded`/`aria-controls` wiring is owned by
  `AccordionContainer`, not Section.
- Interactive children placed in `content` retain their own keyboard
  behavior and focus order — Section does not trap, reorder, or intercept
  focus.

## Screen reader

- The switch and collapse trigger each require an accessible name:
  `switchLabel` (default `"Toggle section"`) and `collapseLabel` (default
  `"Collapse section"`) — override both with copy specific to what the
  section represents (e.g. `"Enable backup policy"`, `"Collapse backup
policy"`) so they read distinctly when more than one section appears on
  the same page.
- With no landmark role on the root, the section's children are announced
  inline in reading order.

## Contrast

- The title uses `--ui-text-on-surface-primary`; the description and icon
  slot use `--ui-text-on-surface-secondary`. Both pairings meet WCAG AA in
  light and dark themes.
- The bottom divider (`hasBottomBorder`) uses
  `--ui-border-on-surface-divider` — border contrast is decorative, not a
  text-contrast requirement.

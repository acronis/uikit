# Card — accessibility

Card is a presentational grouping container plus a header that composes real
interactive controls (switch, rename button). Accessibility is partly a
function of how the card is composed and partly built into `CardHeader`'s
own controls.

## Roles & semantics

- The root is a generic `<div>` with no role by default. If the card
  represents a meaningful standalone region, render it as a landmark/section
  via the `render` prop (e.g. `render={<section aria-labelledby="…" />}`) so
  assistive tech can navigate to it.
- `CardHeader`'s title renders as a `<p>` by default, which has **no heading
  semantics**. When the title is the heading of a content region, wrap the
  card in a landmark and label it via `aria-labelledby` pointing at an
  external heading, or render the root itself with an appropriate
  `aria-label`.
- The drag handle icon is decorative artwork with an accessible name (via the
  icon's `title` prop, driven by `dragHandleLabel`) — it is not itself
  operable; drag-and-drop keyboard/pointer behavior is the consumer's
  responsibility (e.g. wiring `dnd-kit`/`@dnd-kit/sortable`'s listeners onto
  the header or handle).

## Keyboard

- Card itself is not interactive and is not in the tab order.
- The header switch (`isSwitchable`) is a real Base UI `Switch` — reachable by
  Tab and toggled with Space, per its own component contract.
- The rename button (`hasRename`) is a real `ButtonIconInput` — reachable by
  Tab and activated with Enter/Space.
- The collapse trigger (`isCollapsible`, composed with `AccordionContainer`)
  is a real Base UI `Collapsible.Trigger` — reachable by Tab and activated
  with Enter/Space; ARIA `aria-expanded`/`aria-controls` wiring is owned by
  `AccordionContainer`, not Card.
- Interactive children placed in `content` or `footer` retain their own
  keyboard behavior and focus order — Card does not trap, reorder, or
  intercept focus.

## Screen reader

- The switch, rename button, and collapse trigger each require an accessible
  name: `switchLabel` (default `"Toggle card"`), `renameLabel` (default
  `"Rename"`), and `collapseLabel` (default `"Toggle card"`) — override all
  three with copy specific to what the card represents (e.g. `"Enable
policy"`, `"Rename policy"`, `"Toggle backup policy"`) so they read
  distinctly when more than one appears in the same header.
- The default avatar (`hasAvatar`) renders initials as visible text
  (`avatarLabel`); provide a full-word label via a wrapping `aria-label` if
  the initials alone aren't a sufficient description.
- With no landmark role on the root, the card's children are announced inline
  in reading order.

## Contrast

- Title and body text use `--ui-text-on-surface-primary`; the description
  uses `--ui-text-on-surface-secondary` — both against
  `--ui-background-surface-primary`. These token pairings meet WCAG AA in
  both light and dark themes.
- The 1px border uses `--ui-border-on-surface-border` (or
  `--ui-border-on-surface-border-error` when `hasError` is set) — border
  contrast is decorative, not a text-contrast requirement.

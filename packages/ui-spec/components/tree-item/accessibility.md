# TreeItem — accessibility

- **No `role="treeitem"` is forced, on purpose.** A tree item is only valid
  inside a `role="tree"` (or `role="group"`) owner, and to be announced usefully
  it needs `aria-expanded`, `aria-level`, `aria-selected`, and a roving
  `tabindex` — none of which a standalone row can know. Stamping the role on an
  orphan row would produce an **invalid** tree, not an accessible one. The row is
  a plain `<div>`, and `render` is how the consumer supplies the real semantics:

  ```tsx
  <ul role="tree" aria-label="Workloads">
    <TreeItem render={<li role="treeitem" aria-expanded={open} aria-level={1} />} … />
  </ul>
  ```

  This is the same boundary `Breadcrumb` draws — it ships `nav`/`ol`/`li` and the
  current-page part, not the trail — and `StepperItem`, which documents that
  sequence semantics belong to the container.

- **Not in the tab order by default.** The row sets no `tabIndex`, so it never
  becomes a silent tab stop inside a tree that manages focus itself. Pass
  `tabIndex` (or compose a focusable element) when your tree wants the row
  focusable; a roving `tabindex` — exactly one focusable row — is the pattern the
  ARIA tree view calls for.

- **Keyboard focus is visible.** The row carries the library's standard 3px
  `--ui-focus-primary` `focus-visible` ring, the same one `Button` and
  `BreadcrumbLink` use, so a focusable row is never focused invisibly.

- **The chevron is `aria-hidden` decoration.** It is a visual affordance only:
  the row implements no expand/collapse, so there is no state for it to announce.
  Announce expansion with `aria-expanded` on the element you compose — that is
  where the state actually lives. Do **not** give the chevron its own button
  role; a row that only _looks_ expandable would then promise an action nothing
  handles.

- **Keep `expanded` and `aria-expanded` in step.** `expanded` rotates the chevron
  but publishes nothing to assistive technology; `aria-expanded` on your `render`
  element publishes the state but paints nothing. They are two renderings of the
  one boolean you own, so drive both from it (`aria-expanded={open}` +
  `expanded={open}`). Setting only one leaves the sighted affordance and the
  announced state disagreeing — which is the bug `expanded` exists to close.

- **The checkbox is always named.** Composed without a visible label, it would
  otherwise be an unnamed control, so its `aria-label` defaults to `title`.
  Override it through `checkboxProps` when the row title is not the right name
  for the box (e.g. `aria-label="Select all workloads"`).

- **Selection is announced by the consumer.** `selected` is a _visual_ fill.
  Colour alone is not a status, so put `aria-selected` on the element you compose
  via `render` (and `aria-current` if the row marks a location rather than a
  selection). The row also exposes `data-selected` for styling and testing.

- **One localizable string.** `title` is the only text the component renders on
  its own, and the literal `'Title'` appears only as that prop's default —
  callers pass a localized value. Everything else (`children`, `icon`,
  `checkboxProps['aria-label']`) is consumer-supplied.

- **RTL**: the slot order, gap, and padding are logical, so the row mirrors under
  `dir="rtl"` on its own. The collapsed chevron is direction-sensitive
  **artwork**, which logical properties cannot mirror, so it carries an explicit
  `rtl:rotate-180`. The `expanded` chevron points down in both directions —
  "open" has no inline direction to mirror.

## Contrast

The title uses `--ui-text-on-surface-primary` and the glyphs
`--ui-glyph-on-surface-primary`, both over the row's transparent, hover, or
`selected` background (`--ui-background-surface-hover` /
`--ui-background-surface-active`). All are semantic-tier tokens defined per brand
and light/dark mode via `light-dark()`. Re-check the title and glyph contrast
against the **selected** fill specifically when a brand overrides either — the
idle case sits on the page surface, the selected case does not. Should a
dedicated `--ui-tree-item-*` tier land (see `tokens.yaml`), re-check all pairs.

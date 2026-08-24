# Section — accessibility

## Roles and semantics

- The root renders a real `<section>` element. A `<section>` only becomes a
  `region` landmark once it has an accessible name, so give it one whenever the
  band is genuinely navigable content:

  ```tsx
  <Section aria-labelledby="protection-heading">…</Section>
  ```

  Do not name every section — an unnamed `<section>` is a generic grouping and
  stays out of the landmark list, which is the right default for decorative
  bands.

- The header title is a `<p>`, not a heading. A section's place in the document
  outline depends on the page around it, so guessing a level (`h2`? `h3`?)
  would produce a broken hierarchy in most compositions. When the band really
  is a document section, supply your own heading through the header's `render`
  prop or its `children`, and point the root's `aria-labelledby` at it.

- The `description` is ordinary text, not a description role. If it should name
  or describe the region for assistive technology, wire it up explicitly with
  `aria-describedby`.

## Keyboard

- The section itself is not focusable and imposes no keyboard behavior.
- Focus order follows DOM order: the header switch, then anything focusable in
  `extras`, then `actions`, then the collapse trigger, then the content.
  Nothing is trapped or re-ordered.
- The collapse trigger is a real `<button>` supplied by `AccordionContainer`
  (Base UI Collapsible): `Tab` reaches it and `Enter` / `Space` toggle the
  panel. Its `aria-expanded` and `aria-controls` are managed by the primitive.
- Collapsed content is hidden from the accessibility tree, so it is skipped by
  both `Tab` and virtual-cursor navigation.

## Screen reader

- Icon-only controls in `actions` must supply their own accessible name; the
  section adds none.
- The collapse trigger has no visible label, so it relies on `collapseLabel`
  (default `'Collapse section'`). Override it with something specific when a
  page stacks several collapsible sections — "Collapse section" three times in
  a row is not navigable.
- The header switch likewise relies on `switchLabel` (default
  `'Toggle section'`); override it per section for the same reason.
- The title may be visually truncated. Truncation is visual only — the full
  string stays in the accessible text — but keep it short enough to be
  meaningful.

## Contrast

- The title uses `--ui-text-on-surface-primary` and the description
  `--ui-text-on-surface-secondary`, both against the page surface. Both meet
  WCAG AA in every shipped brand and in both light and dark themes.
- The `hasBottomBorder` divider uses `--ui-border-on-surface-divider`. It is a
  decorative separator, not a meaningful boundary, so it is exempt from the 3:1
  non-text contrast requirement — the grouping is also conveyed by the header
  and the spacing.

## Localization

- Every string the component renders on its own — `switchLabel` and
  `collapseLabel` — is a prop whose literal exists only as that prop's default.
  `title`, `description`, `extras`, `actions`, and the content are all
  consumer-supplied.
- Layout uses logical spacing and a logical grid only, so the band mirrors
  correctly under `dir="rtl"`: the switch and title sit at the inline start,
  actions and the collapse trigger at the inline end, and the 70/30 split
  reverses. The trigger's chevron flips through `AccordionContainer`'s own
  `rtl:` variant.

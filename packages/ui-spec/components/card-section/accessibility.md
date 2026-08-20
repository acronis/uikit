# CardSection — accessibility

## Roles and semantics

- The root is a plain `<div>` with no implicit role — the section is a visual
  grouping inside a card, not a landmark. Nothing is announced for the wrapper
  itself.
- To expose the grouping to assistive technology, render it as a real region:

  ```tsx
  <CardSection render={<section aria-label="Network details" />} … />
  ```

  Prefer this only when the grouping is genuinely navigable content; a decorative
  band of key-value rows does not need a landmark, and over-using regions makes
  the landmark list noisy.

- The header title is a `<p>`, not a heading. A section inside a card sits below
  the card's own title in the document outline, and guessing at a heading level
  (`h3`? `h4`?) would produce a broken hierarchy in most compositions. When the
  section really is a document section, pair `render` with your own heading:

  ```tsx
  <CardSection render={<section aria-labelledby="net-heading" />} … />
  ```

- The `card-primary` / `card-secondary` variants nest a full `Card`. Its parts
  carry their own semantics; see the `Card` spec.

## Keyboard

- The section itself is not focusable and has no keyboard behavior.
- Focusable content is whatever the consumer places in `extras`, `actions`, or
  the body slots. Those follow DOM order: title/extras first, then actions, then
  the body. Nothing is trapped or re-ordered.

## Screen reader

- The `title` is read as ordinary text when the user reaches it. Because it may
  be visually truncated, keep it short enough to be meaningful — truncation is
  visual only, the full string stays in the accessible name/text.
- Icon-only controls placed in `actions` must supply their own accessible name
  (`aria-label` on the button); the section adds none.
- The default tag row for `variant="tag"` is placeholder example content. Ship
  real, localized tags via `contentTag` — the defaults are English literals and
  are not meant for production copy.

## Contrast

- The title uses `--ui-text-on-surface-primary` against the enclosing card
  surface, which meets WCAG AA in every shipped brand and in both light and dark
  themes.
- The `hasBottomBorder` divider uses `--ui-border-on-surface-divider`. It is a
  decorative separator, not a meaningful boundary, so it is exempt from the 3:1
  non-text contrast requirement — the grouping is also conveyed by the header
  and spacing.

## Localization

- Every string the component can render on its own — the `title` and the default
  tag labels — is a prop, or a prop's default. The component ships no inlined
  literals.
- Layout uses logical spacing only, so the section mirrors correctly under
  `dir="rtl"`: the title/extras group starts at the inline start and `actions`
  sit at the inline end.

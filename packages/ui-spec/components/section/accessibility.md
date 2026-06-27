# Section — accessibility

- Renders a native `<section>`; give it an accessible name when there are several
  on a page — the `SectionTitle` (`<h2>`) provides a heading, or set
  `aria-labelledby` / `aria-label` on the section.
- The heading level is fixed at `<h2>`; ensure it fits the surrounding document
  outline (override with `className`/composition if a different level is needed).

## Contrast

The title inherits the foreground; the description uses
`--ui-text-on-surface-secondary`, which meets contrast in light and dark.

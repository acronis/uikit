# Skeleton — accessibility

- A Skeleton is decorative — it conveys "loading" visually. It has no inherent
  ARIA semantics; announce loading at the region level instead (e.g. an
  `aria-busy="true"` container, or a visually-hidden "Loading…" message), so
  screen-reader users are told content is pending rather than reading empty boxes.
- Don't put meaningful text inside a Skeleton.

## Contrast

Skeleton is a non-informational placeholder, so it's exempt from text-contrast
requirements; the fill (`--ui-background-surface-active`) is a visible-but-subtle
gray against the page in both themes.

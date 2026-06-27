# Pagination — accessibility

- The root is a `<nav>` landmark labelled "pagination"; the items are a real
  `<ul>` / `<li>` list of links.
- The current page link carries `aria-current="page"`; previous / next links have
  explicit labels ("Go to previous page" / "Go to next page").
- The ellipsis is `aria-hidden` with an `sr-only` "More pages" so it isn't read as
  an interactive control.
- Render the page controls as real links (`href`) or buttons so they're keyboard
  operable; don't rely on color alone for the current page (the `aria-current`
  state conveys it).

## Contrast

Page links use the foreground over the page surface; the active page uses
`--ui-background-surface-active` and hover uses `--ui-background-surface-hover` —
both meet contrast in light and dark. The focus ring uses `--ui-focus-primary`.

# PageHeader — accessibility

- The region is a `banner` landmark and the title is an `<h1>` — one page title per
  page; ensure it fits the document outline.
- The breadcrumb is a `<nav>` labelled "Breadcrumb"; render real links inside it.
- Don't rely on placement alone for actions — give icon-only action buttons labels.

## Contrast

Title inherits the foreground; breadcrumb/description use
`--ui-text-on-surface-secondary`, which meets contrast in light and dark.

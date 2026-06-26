# Spinner — accessibility

- The root is `role="status"` with `aria-label="Loading"` and an `sr-only`
  "Loading…" label, so assistive tech announces the loading state when the
  spinner appears.
- `role="status"` is a polite live region — placing the spinner into the DOM
  announces it without stealing focus. For a specific context, override the label
  (e.g. `aria-label="Loading workloads"`).
- The spinner is decorative motion; pair it with text when the wait is long.

## Contrast

The ring defaults to `--ui-background-brand-secondary` (brand blue), which meets
non-text contrast against the page surface in light and dark. Override with a
`text-*` class where the context needs it.

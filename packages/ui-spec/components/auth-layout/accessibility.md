# AuthLayout — accessibility

- AuthLayout is presentational chrome; the auth **form** inside carries the
  semantics — use a `Field`/`Form` with a labelled heading (an `<h1>` in the logo
  slot or above the fields) so the screen has an accessible name and the inputs are
  labelled.
- Keep the footer links real `<a>`/buttons; don't rely on color alone.

## Contrast

The card surface (`--ui-background-surface-primary`) + border
(`--ui-border-on-surface-border`) and the muted footer
(`--ui-text-on-surface-secondary`) meet contrast in light and dark.

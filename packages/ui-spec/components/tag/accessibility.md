# Tag — accessibility

## Semantics

- A Tag is a presentational inline `<span>` — non-interactive, with no role. It
  is read as its text content.
- **Don't rely on color alone.** The variant color signals status, but the
  label text must carry the meaning (e.g. "Critical", "Beta") so it's clear to
  colorblind users and screen-reader users alike.
- If the icon is the only thing conveying meaning (rare — the label should), give
  it an accessible name; otherwise it is decorative and may stay `aria-hidden`.

## Keyboard & focus

- Not focusable and not in the tab order — there is nothing to activate.
- If a future use needs an interactive/removable tag, that affordance (e.g. a
  remove button) must be a real focusable control with its own accessible name;
  the Tag itself stays presentational.

## Contrast

- Each variant's text-on-background pair resolves from the `--ui-*-status-*`
  tokens, which meet contrast in both light and dark themes; the border further
  separates the pill from the surface.

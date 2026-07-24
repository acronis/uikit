# Loading — accessibility

- The root is `role="status"` (a polite live region) — mounting it announces
  the loading state without stealing focus.
- The `Spinner` icon is rendered `aria-hidden="true"`: it is purely decorative
  motion here, since the root already owns the accessible name/announcement.
  This also prevents assistive tech from double-announcing `Spinner`'s own
  built-in "Loading" label alongside Loading's own label.
- When `hasLabel` is true (default), the visible label's text content is the
  live region's announcement — no separate `aria-label` is needed or set.
- When `hasLabel` is false, the root carries `aria-label={label}` so the
  loading state is still announced even though nothing is shown on screen.
- Pair with real content once the operation completes; Loading has no
  "complete" state of its own — remove it from the DOM (or swap it for the
  loaded content) when the operation finishes.

## Contrast

Each variant wires its own icon/label color tokens
(`--ui-loading-<variant>-icon-color` / `-label-color`), so contrast against the
variant's own container background is guaranteed independent of the ambient
page background — this is why `onScreen` exists as a distinct, higher-contrast
variant for busy/photo/video surfaces rather than reusing `onSurfacePrimary`.

# ProgressCircle — accessibility

- The root is `role="progressbar"` (Base UI Progress.Root) with
  `aria-valuenow`/`aria-valuemin`/`aria-valuemax`. The SVG is `aria-hidden`; the
  value semantics come from the root.
- Give it an accessible name via `aria-label`/`aria-labelledby` (e.g. "Compliance")
  so assistive tech announces what is progressing.
- Status is conveyed by the arc color **and** the value/icon — never color alone.
  Keep the meaningful value visible (`showValue`) or labelled when color encodes
  status.

## Contrast

The arc uses `--ui-text-on-status-*` over the `--ui-border-on-surface-border`
track, and the center label uses `--ui-text-on-surface-primary` — all meeting the
relevant contrast in light and dark.

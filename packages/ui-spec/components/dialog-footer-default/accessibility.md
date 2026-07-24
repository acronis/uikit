# DialogFooterDefault — accessibility

- DialogFooterDefault is a plain layout container — no landmark role of its
  own. If a DialogFooterDefault's actions form the primary controls for an
  enclosing dialog/sheet, that ancestor (e.g. `Dialog`, `Sheet`) owns the
  relevant ARIA (e.g. `role="dialog"`, focus trapping); DialogFooterDefault
  does not duplicate it.
- All interactive semantics (focus order, keyboard activation, accessible
  names) come from the composed `Button`/`Link` children — DialogFooterDefault
  does not wrap or override them.
- The `description` text is plain, truncated text — `title`/`aria-label` is
  the caller's responsibility if the full (untruncated) text should also be
  available to assistive tech or as a hover tooltip.

## Contrast

`description` uses the shared `text-foreground` token
(`--ui-text-on-surface-primary`), guaranteed to meet contrast against
DialogFooterDefault's own `--ui-footer-default-color` background in both
light and dark (both come from the same semantic surface/text pairing).

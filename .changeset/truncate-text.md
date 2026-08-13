---
'@acronis-platform/ui-react': minor
---

feat(truncate-text): add `TruncateText` component

`TruncateText` displays a string with an ellipsis and shows the full value in a
tooltip **only when it is actually clipped** — no tooltip appears when the text
fits, so short cells do not get a pointless hover target.

Two truncation modes:

- **`'end'`** (default) — CSS `text-overflow: ellipsis` / `-webkit-line-clamp`
  for multi-line. Truncation is detected by comparing `scrollWidth`/`scrollHeight`
  to `clientWidth`/`clientHeight` and re-checked on resize via `ResizeObserver`.
- **`'middle'`** — canvas `measureText` binary-search that preserves both ends of
  the string, ideal for URLs, paths, and hashes where the tail is the
  distinguishing part. Re-measures on resize via `ResizeObserver`. Applies
  `flex-1` so it fills a flex parent without locking its shrunken width in.

**Exports**

- **`TruncateText`** — the main component (`React.forwardRef<HTMLSpanElement, TruncateTextProps>`).
- **`TruncateTextProps`** — props interface (`children`, `mode`, `side`, `lines`,
  `defaultOpen`, `portalContainer`, `className`).
- **`middleTruncate`** — pure binary-search helper; exported for unit testing without a DOM.
- **`MiddleTruncateOptions`** — options interface for `middleTruncate`.
- **`measureTextWidth`** — canvas-backed text-width measurer; falls back to a
  per-character estimate in environments without `canvas` 2D (jsdom).

All additions are backwards-compatible.

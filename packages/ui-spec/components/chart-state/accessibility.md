# ChartState — accessibility

- The root is a **live region** so a screen reader announces the state change
  when a chart swaps its content in:
  - `loading` / `empty` → `role="status"` with `aria-live="polite"`.
  - `error` → `role="alert"` with `aria-live="assertive"`.
- `loading` additionally sets `aria-busy` on the root; the shared `Spinner` is
  rendered `aria-hidden` so the root's own live region (with the label) announces
  once, rather than the Spinner's `role="status"` + sr-only "Loading…" nesting
  inside it and double-announcing.
- The live-region attributes (`role` / `aria-live` / `aria-busy`) are applied
  after the prop spread, so the state's a11y contract is not clobbered by a
  consumer-passed attribute.
- The label text is a real `<p>`, so the state message is always in the
  accessible tree — the glyph is decorative and does not need its own label.
- **Do not rely on the glyph color alone** to convey the state — the label
  carries the meaning. Icon colors (`--ui-glyph-on-status-info` /
  `--ui-glyph-on-status-warning`) and the label (`--ui-text-on-surface-primary`)
  resolve to semantic tokens that meet contrast in both themes.
- If the error state offers a retry, pass an actual interactive control as
  `action` (a `Button`) so it is focusable and keyboard-operable.

## Contrast

Label and glyph colors resolve to semantic `--ui-*` tokens that meet contrast on
the surface in both light and dark themes.

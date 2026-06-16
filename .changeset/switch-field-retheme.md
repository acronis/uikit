---
'@acronis-platform/ui-react': minor
---

Re-theme `Switch` against the next-gen tokens and add an optional `label`.

- Fixed dead token refs: the track and thumb fills referenced
  `--ui-switch-{off,on}-box-{state}` / `--ui-switch-global-tick-{state}`, which
  were renamed to `*-box-color-{state}` / `*-tick-color-{state}` — so the track
  and thumb silently fell back to inherited colors. Now wired to the current
  `--ui-switch-*` tokens.
- Added an optional `label` prop. When provided, the toggle and its label
  compose a clickable `<label>` row (wired via aria-labelledby) using
  `--ui-switch-global-{container-gap,label-color}`. With no label, the bare
  toggle renders as before — name it with `aria-label`.
- Corrected Code Connect to the real Figma props (variant/state/label).

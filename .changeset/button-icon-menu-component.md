---
'@acronis-platform/ui-react': minor
---

Add `ButtonIconMenu`: the kebab ("more options") menu trigger from Figma — a 32×32 bordered icon-only button with a fixed 16px ellipsis glyph, across idle, hover, open, disabled, and focus states. It composes `ButtonIcon variant="secondary"` (the design draws it from the same `--ui-button-icon-*` token tier), adds menu-trigger semantics (`aria-haspopup="menu"`, `aria-expanded` from the `open` prop), and takes its accessible name from `ariaLabel`.

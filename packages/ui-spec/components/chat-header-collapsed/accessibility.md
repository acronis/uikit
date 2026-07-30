# ChatHeaderCollapsed — accessibility

## Semantics

- The root is a native `<header>`. When it is a **top-level landmark** in the
  document (not nested inside `<article>`/`<aside>`/`<main>`/`<nav>`/
  `<section>`), it is exposed with the implicit `banner` role.
- The composed `TagIcon` is presentational (a plain `<span>`, no role) — the
  glyph carries no unique meaning of its own here (it is a static branding
  mark), so no `aria-label`/`role="img"` is added by this component.
- There is no interactive content: no buttons, no links, no focusable
  elements. The whole component is a passive visual landmark at the top of
  the collapsed rail.

## Keyboard & focus

None — the component receives no focus and defines no key handling.

## Contrast

- The composed `TagIcon` resolves its own contrast pair
  (`--ui-avatar-color-violet` / `--ui-avatar-label-color-violet`) from the
  `--ui-avatar-*` tier, which carries light/dark values.
- The header band itself has no fill of its own (transparent, sitting on the
  chat container's background) — only the 1px bottom seam
  (`--ui-chat-global-border-color`) is drawn.

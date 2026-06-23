# Avatar — Accessibility

## Role & semantics

- The avatar root renders a `<span>` and is **presentational** — it conveys no
  interactive semantics on its own.
- When an `AvatarImage` is shown, provide a meaningful `alt` describing the
  person/entity (e.g. `alt="Sam Nguyen"`). If the avatar is purely decorative
  beside an already-labeled name, use `alt=""`.
- The `AvatarFallback` initials are text and are read as-is. Initials alone are a
  weak label — prefer an adjacent visible name, or set `alt` on the image, so the
  entity is identifiable by more than two letters.

## Keyboard & focus

- Avatar is not focusable or interactive by default. If you make an avatar
  actionable (e.g. wrap it in a button or link, or pass `render`), the wrapping
  control owns the role, focus ring, and keyboard behavior — give it an
  accessible name.

## Groups

- An `AvatarGroup` is a layout container; it adds no semantics. If it represents
  a meaningful set (e.g. "people on this ticket"), label the surrounding context
  in text. A common pattern is a trailing `+N` count and a visible label next to
  the group.

## Contrast

- Initials use the per-scheme `--ui-avatar-label-color-<scheme>` on the matching
  `--ui-avatar-color-<scheme>` background; these pairs are defined in the design
  tokens to meet contrast for short text. Do not override one without the other.

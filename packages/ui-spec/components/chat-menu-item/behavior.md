# ChatMenuItem — behavior

## Rendering

**Given** a ChatMenuItem
**When** it renders
**Then** it is a real `<button type="button">`, 40px tall
(`--ui-chat-menu-item-height`), at least 224px wide
(`--ui-chat-menu-item-expanded-min-width`) and filling its container,
horizontally padded by `--ui-chat-menu-item-padding-x`
**And** it draws a 1px seam on its **inline-start** edge
(`--ui-chat-global-border-width` / `-color`), continuing the chat rail's
border.

## Icon

**Given** an `icon`
**When** it renders
**Then** the glyph shows at 16px, vertically centred, and a mono icon takes
its colour from `--ui-chat-menu-item-icon-color` via `currentColor`.

**Given** no `icon`
**Then** the slot renders nothing — only the label (and, if present, extras)
show.

## Label

**Given** `label`
**When** it renders
**Then** it shows as the row's visible text, coloured by
`--ui-chat-menu-item-label-color`, truncating rather than wrapping, and takes
the remaining row width so any trailing extras stay flush to the end.

## Extras

**Given** `hasExtras` and an `extras` element
**When** the row renders
**Then** `extras` renders at the row's trailing end, unmodified — its content
(a `ChatMenuItemExtras` element) is fully configured by the consumer.

**Given** `hasExtras` is false (the default)
**Then** `extras` does not render even if provided.

## State

**Given** `state` of `idle` (or omitted)
**When** it renders
**Then** the fill resolves from `--ui-chat-menu-item-color-idle`, and pointer
hover switches it to `--ui-chat-menu-item-color-hover`.

**Given** `state="active"` — the currently-open chat
**When** it renders
**Then** the fill resolves from `--ui-chat-menu-item-color-active` (a
persistent tint, not a mouse-press effect) and the root gets
`aria-current="page"`, matching the sidebar components' current-route
convention.

**Given** the row receives keyboard focus (either state)
**Then** a 3px inset `--ui-focus-primary` ring is drawn inside its edges (no
ring on pointer focus — it is `:focus-visible`).

Each interaction state references its own token, so a brand that gives them
distinct values is honoured without a code change.

## Activation

**Given** an enabled row
**When** the user clicks it, or focuses it and presses Enter or Space
**Then** `click` fires once.

**Given** the row carries the native `disabled` attribute
**When** the user clicks it
**Then** nothing fires. (The design defines no disabled appearance and the
`--ui-chat-*` tier ships no disabled fill, so the row's colours do not
change.)

## Bidirectional layout

**Given** an ancestor sets `dir="rtl"`
**When** it renders
**Then** the seam moves to the row's right edge and the icon/label/extras
order visually mirrors (start → end stays semantically the same) — all
positioning is logical.

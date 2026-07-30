# ChatMenuItemCollapsed — behavior

## Rendering

**Given** a ChatMenuItemCollapsed
**When** it renders
**Then** it is a real `<button type="button">` sized to the collapsed rail — 48px
wide (`--ui-chat-menu-item-collapsed-max-width`) by 40px tall
(`--ui-chat-menu-item-height`), horizontally padded by
`--ui-chat-menu-item-padding-x`
**And** it draws a 1px seam on its **inline-start** edge
(`--ui-chat-global-border-width` / `-color`), continuing the chat rail's border.

## Icon

**Given** an `icon`
**When** it renders
**Then** the glyph shows at 16px, vertically centred, and a mono icon takes its
colour from `--ui-chat-menu-item-icon-color` via `currentColor`.

**Given** no `icon`
**Then** the slot renders empty — the row keeps its full 40px height and remains
activatable (the collapsed rail must not collapse further).

## Alert

**Given** `hasAlert`
**When** it renders
**Then** the shipped `DotRed` icon appears over the glyph's top-end corner
**And** it is `aria-hidden`, so it changes nothing about the accessible name.

**Given** `hasAlert` is false (the default)
**Then** no dot renders.

## Variant

**Given** `variant` of `idle` (or omitted)
**When** it renders
**Then** the fill resolves from `--ui-chat-menu-item-color-idle`.

There is no other `variant` value: the Figma component set's `hover`, `active`,
and `focused` siblings are interaction states, covered below.

## Interaction states

**Given** the pointer moves over the row
**Then** the fill switches to `--ui-chat-menu-item-color-hover`.

**Given** the row is pressed
**Then** the fill switches to `--ui-chat-menu-item-color-active`.

**Given** the row receives keyboard focus
**Then** a 3px inset `--ui-focus-primary` ring is drawn inside its edges (no ring
on pointer focus — it is `:focus-visible`).

Each state references its own token, so a brand that gives them distinct values
is honoured without a code change.

## Activation

**Given** an enabled row
**When** the user clicks it, or focuses it and presses Enter or Space
**Then** `click` fires once.

**Given** the row carries the native `disabled` attribute
**When** the user clicks it
**Then** nothing fires. (The design defines no disabled appearance and the
`--ui-chat-*` tier ships no disabled fill, so the row's colours do not change.)

## Bidirectional layout

**Given** an ancestor sets `dir="rtl"`
**When** it renders
**Then** the seam moves to the row's right edge and the alert dot moves to the
glyph's top-left corner — both are positioned logically, so the whole row
mirrors.

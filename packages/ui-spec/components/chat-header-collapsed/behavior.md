# ChatHeaderCollapsed — behavior

## Rendering

**Given** a ChatHeaderCollapsed
**When** it renders
**Then** it is a `<header>`, 48px wide
(`--ui-chat-container-collapsed-width`) by 64px tall
(`--ui-chat-header-height`), horizontally padded by
`--ui-chat-header-padding-x`
**And** it draws a 1px seam on its **bottom** edge
(`--ui-chat-global-border-width` / `-style` / `-color`), continuing the
collapsed rail's border.

## Icon

**Given** an `icon`
**When** it renders
**Then** it shows centered inside a composed `TagIcon` (a 32px violet chip) —
TagIcon is used as-is, not rebuilt.

**Given** no `icon`
**Then** `TagIcon` still renders, empty.

## Composition

**Given** this component is used inside the collapsed chat rail
**When** it renders
**Then** it sits above the stack of `ChatMenuItemCollapsed` rows, sharing
their 48px width and the same `--ui-chat-global-border-*` seam tokens.

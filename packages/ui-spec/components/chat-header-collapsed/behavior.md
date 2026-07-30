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

## hasHistory

**Given** `hasHistory` (either value)
**When** it renders
**Then** nothing about the output changes — the property is accepted but has
no wired behavior today.

This is not an oversight: the one Figma instance available at build time has
`hasHistory` set to `false` with no visible difference documented anywhere in
the node. Rather than invent an unconfirmed visual (e.g. guessing it shows a
history icon, which is `ChatHeaderExpanded`'s pattern but not confirmed here),
the prop is plumbed through the API so a future design update can wire real
behavior to it as an additive change.

## Composition

**Given** this component is used inside the collapsed chat rail
**When** it renders
**Then** it sits above the stack of `ChatMenuItemCollapsed` rows, sharing
their 48px width and the same `--ui-chat-global-border-*` seam tokens.

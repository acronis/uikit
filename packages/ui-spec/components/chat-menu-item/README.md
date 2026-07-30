# ChatMenuItem

One row of the chat rail while the rail is expanded: a 16px icon, a visible
label, and an optional trailing `ChatMenuItemExtras` cluster.

## When to use

- Inside the expanded chat rail's list of chats/destinations.
- When the currently-open chat needs a persistent highlight — set
  `state="active"`.
- When a row needs a trailing tag or keyboard shortcut — set `hasExtras` and
  pass a `ChatMenuItemExtras` element through `extras`.

## When not to use

- For the **collapsed** rail (48px, icon-only) — use
  `ChatMenuItemCollapsed` instead.
- To configure the trailing cluster's own content — set `labelTag` /
  `labelShortcut` / `variant` directly on the `ChatMenuItemExtras` element you
  pass in, not on `ChatMenuItem`.

## State

`state` has two real values: `idle` (default) and `active` — the currently-open
chat, a persistent selection indicator (not a mouse-press effect). The Figma
component set's `hover` and `focused` siblings are interaction states, painted
with `:hover` / `:focus-visible` against their own
`--ui-chat-menu-item-color-*` tokens rather than exposed as prop values.

## Accessible name

The visible `label` is the button's accessible name — no `aria-label` needed.
`state="active"` also sets `aria-current="page"`.

## Examples

```tsx
import { ChatMenuItem, ChatMenuItemExtras } from '@acronis-platform/ui-react';
import { MessageTextIcon } from '@acronis-platform/icons-react/stroke-mono';

<div className="flex w-64 flex-col">
  <ChatMenuItem
    label="Assistant"
    icon={<MessageTextIcon />}
    hasExtras
    extras={<ChatMenuItemExtras labelTag="Beta" />}
  />
  <ChatMenuItem label="Q3 roadmap" icon={<MessageTextIcon />} state="active" />
</div>;
```

## Parts

| Part     | Element  | Purpose                                                         |
| -------- | -------- | --------------------------------------------------------------- |
| root     | `button` | The full-width row: fill, 16px inline padding, seam.            |
| `icon`   | `span`   | Optional 16px glyph slot.                                       |
| `label`  | `span`   | The chat's title (also the accessible name).                    |
| `extras` | `span`   | Optional trailing `ChatMenuItemExtras`, composed by the caller. |

## Tokens

Everything comes from the `--ui-chat-*` tier (`menu-item-height`,
`menu-item-expanded-min-width`, `menu-item-padding-x`,
`menu-item-expanded-gap`, `global-border-width` / `-color`,
`menu-item-color-{idle,hover,active}`, `menu-item-icon-color`,
`menu-item-label-color`) plus the shared `--ui-focus-primary`. Nothing is
re-pointed to the SidebarSecondary tier — these are the design node's own
references.

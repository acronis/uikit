# ChatMenuItemCollapsed

One row of the chat rail while the rail is collapsed to its 48px width: an
icon-only control with an optional red alert dot.

## When to use

- Inside the collapsed chat rail, one row per destination (New chat, Chats,
  Notes, …).
- When a row needs to signal "something new here" without a count — that is the
  `hasAlert` dot.

## When not to use

- For the **expanded** rail, where the label, hint, and trailing affordances are
  visible — that is a different Figma component (and `ChatMenuItemExtras` covers
  the trailing cluster).
- As a general icon button. Use **ButtonIcon**, which has its own token tier,
  variants, and a square 32px box.
- To show a count or a status word. Use a **Tag** in the expanded row instead —
  the collapsed row has no room for text.

## Variants

`variant` has one value, `idle` — the state this node was signed off with. The
Figma component set also carries `hover`, `active`, and `focused` siblings, but
those are **interaction states**, painted with `:hover` / `:active` /
`:focus-visible` against their own `--ui-chat-menu-item-color-*` tokens rather
than exposed as prop values. A second real variant would be a purely additive
change.

## Accessible name is required

The row renders no text, so pass `aria-label` (or `aria-labelledby`). When
`hasAlert` is set, say so in that label — the dot itself is `aria-hidden`.

## Examples

```tsx
import { ChatMenuItemCollapsed } from '@acronis-platform/ui-react';
import {
  ClipboardTextIcon,
  MessageTextIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

<div className="flex w-12 flex-col">
  <ChatMenuItemCollapsed aria-label="New chat" icon={<PlusIcon />} />
  <ChatMenuItemCollapsed
    aria-label="Chats, unread messages"
    icon={<MessageTextIcon />}
    hasAlert
  />
  <ChatMenuItemCollapsed aria-label="Notes" icon={<ClipboardTextIcon />} />
</div>;
```

## Parts

| Part    | Element  | Purpose                                                           |
| ------- | -------- | ----------------------------------------------------------------- |
| root    | `button` | The 48×40 row: fill, 16px inline padding, inline-start rail seam. |
| `icon`  | `span`   | 16px glyph slot; also the positioning context for the alert dot.  |
| `alert` | `svg`    | Optional `DotRed` dot on the glyph's top-end corner (decorative). |

## Tokens

Everything comes from the `--ui-chat-*` tier (`menu-item-height`,
`menu-item-collapsed-max-width`, `menu-item-padding-x`,
`menu-item-expanded-gap`, `global-border-width` / `-color`,
`menu-item-color-{idle,hover,active}`, `menu-item-icon-color`) plus the shared
`--ui-focus-primary`. Nothing is re-pointed to the SidebarSecondary tier — those
are the design node's own references.

# ChatMenuItemExtras

The trailing affordance on a chat menu item — a small status **Tag** or a
**keyboard-shortcut** label, right-aligned at the end of the row.

## When to use

- To mark a chat menu item with a short status/category (`variant="tag"`).
- To surface the keyboard shortcut that activates the item
  (`variant="shortcut"`).

## When not to use

- As a standalone badge outside a menu row — use **Tag** directly.
- For an action — the cluster is presentational. The enclosing menu item is the
  control.
- For the primary sidebar's menu items — use `SidebarPrimaryMenuItemExtras`,
  which is the sibling affordance for that surface (and additionally offers
  `externalLink` / `tag-externalLink`).

## Variants

`tag` · `shortcut`. `variant` is a **discriminant, not a style axis**: the
cluster's own layout is identical for both values and only the single child
changes, so the React implementation uses no `cva`.

## Examples

```tsx
import { ChatMenuItemExtras } from '@acronis-platform/ui-react';

<ChatMenuItemExtras variant="tag" labelTag="Beta" />
<ChatMenuItemExtras variant="shortcut" labelShortcut="⌘H" />
```

## Parts

| Part       | Element                           | Purpose                                             |
| ---------- | --------------------------------- | --------------------------------------------------- |
| root       | `span`                            | The cluster: end-aligned inline flex row, 24px min. |
| `tag`      | `Tag` (`variant=info`, `size=sm`) | The status pill (`labelTag`).                       |
| `shortcut` | text                              | The keyboard-shortcut label (`labelShortcut`).      |

## Open questions for design

Two things on the Figma node (`7329-52341`) were **not** resolved into code and
should be confirmed with the design team:

1. **Token ownership.** The node binds this cluster to the
   `components/SidebarSecondary/MenuItemExtras/_global/*` variable group, not to
   the `components/Chat/*` group. The implementation follows the design's own
   references (so a brand override still flows through), which is why the token
   names in `tokens.yaml` say `sidebar-secondary` for a Chat component. If these
   are meant to be Chat-owned, design should add
   `components/Chat/MenuItemExtras/_global/{container/gap,shortcut/color}` — note
   `--ui-chat-menu-item-hint-color` and `--ui-chat-menu-item-expanded-gap`
   already exist with the same values, so the duplication is real today.
2. **The `externalLink` variant.** The Figma component set offers a third option,
   `externalLink` (a 16px `SquareArrowUpRight` glyph). It is **out of scope** for
   this component and is deliberately unmapped in Code Connect. Its Figma
   variable `components/Icon/_global/sm/stroke` also has **no** counterpart in
   `tokens-pd` (there is no `components/Icon` tier at all), so bringing that
   variant in needs a design-tokens decision first — in code, icon stroke width
   is baked into `@acronis-platform/icons-react`'s generated `size` prop, so the
   Figma variable may simply be redundant.

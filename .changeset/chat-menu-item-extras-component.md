---
'@acronis-platform/ui-react': minor
---

Add `ChatMenuItemExtras`: the trailing affordance cluster on a chat menu item —
either a small status `Tag` or a keyboard-shortcut label, end-aligned in the row.
Ported from the Figma `ChatMenuItemExtras` component set (node `7329-52341`).

`variant` (`tag` | `shortcut`) is a discriminant that selects which single child
renders, not a style axis — the cluster's own layout is identical for both, so
there is no `cva`. `labelTag` renders through the shipped `Tag` (pinned by the
design to `variant="info" size="sm"`, not reimplemented); `labelShortcut` renders
the shortcut text. Presentational: plain `<span>`, no role, no tab stop — the
enclosing menu item owns interaction and the accessible name.

The cluster's gap and shortcut color come from the
`--ui-sidebar-secondary-menu-item-extras-global-*` tokens, because that is the
variable group the Figma node itself binds — even though this is a Chat part.
Raised with design: `--ui-chat-menu-item-hint-color` and
`--ui-chat-menu-item-expanded-gap` already carry the same values, so either the
node should be rebound or a `components/Chat/MenuItemExtras/*` group added.

The Figma set's third option, `externalLink`, is intentionally out of scope and
unmapped in Code Connect; its `components/Icon/_global/sm/stroke` variable has no
counterpart in `@acronis-platform/tokens-pd` at all.

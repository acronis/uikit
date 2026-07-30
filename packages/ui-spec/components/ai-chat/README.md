# AiChat

The root AI-chat shell: switches between three structurally distinct layouts —
a 48px icon-only rail (`collapsed`), a 384–512px tabbed panel (`expanded`), and
a full-width two-pane chat-list-sidebar + conversation-body layout
(`full-width`). Composed entirely from already-shipped parts:
`ChatHeaderCollapsed`, `ChatHeaderExpanded`, `ChatMenuItem`,
`ChatMenuItemCollapsed`, and `ChatMenuItemExtras`.

Figma: [`AI-Chat` node 7329-24933](https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24933)
(variant instances: [collapsed](https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24930),
[expanded](https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24931),
[full-width](https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24932))

> ### ⚠ `status: draft` — see "Open questions" below
>
> This component's visual composition is complete and tested, but three real
> product decisions are unresolved. Ship it as a static shell; do not build
> consumer-facing variant-switching or content-configuration on top of it
> until these are answered.

## When to use

- As the root container for an AI-chat panel that needs to present as a
  collapsed rail, a docked panel, or a full-width workspace.

## When not to use

- **For a drag-resizable chat panel** — use the existing, unrelated
  `AppShellChat`, which implements continuous drag-resize instead of this
  component's discrete `variant` values. Do not merge the two: they encode
  different, currently-unconfirmed interaction models (see below).
- **When you need a configurable chat-history list, tab set, or
  per-conversation title** — none of those are exposed yet. See "Open
  questions."

## Parts

| Part                                 | Composed from                            | Notes                                                                             |
| ------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------- |
| `header` (collapsed)                 | `ChatHeaderCollapsed`                    | Branding glyph (`AcronisAiMultiIcon`).                                            |
| `nav-chat` / `nav-tasks` (collapsed) | `ChatMenuItemCollapsed`                  | Icon-only equivalents of the expanded header's tabs.                              |
| `header-tabs` (expanded)             | `ChatHeaderExpanded` + placeholder tabs  | Fixed "Acronis AI" / "Tasks" tabs — see that component's own placeholder warning. |
| `feed` / `body-feed`                 | the `Feed` SLOT                          | The **only** consumer-supplied content — via `children`.                          |
| `footer` / `sidebar-footer`          | `ChatMenuItem` / `ChatMenuItemCollapsed` | Variant-switch actions. Inert — see "Open questions."                             |
| `sidebar-header` / `body-header`     | plain text                               | Fixed "Acronis AI" / "Chat name".                                                 |
| `sidebar-list`                       | `ChatMenuItem`                           | One fixed "New chat" item.                                                        |

## Examples

### Default (full-width)

```tsx
<AiChat>
  <ConversationFeed messages={messages} />
</AiChat>
```

### Collapsed rail

```tsx
<AiChat variant="collapsed" />
```

### Expanded panel with feed content

```tsx
<AiChat variant="expanded">
  <ConversationFeed messages={messages} />
</AiChat>
```

### Swapping the root element

```tsx
<AiChat render={<div />}>{/* … */}</AiChat>
```

## Open questions

These are unresolved product/design decisions raised while building this
component — not implementation gaps to guess at. Each changes `AiChat`'s
actual behavior, not just its look, so none are answered here:

1. **How does a consumer move between the three variants?** Figma shows
   discrete footer/menu toggle actions with keyboard-shortcut hints (`⌘H` /
   `⌘C` / `⌘N`) — a different interaction model from the existing, unrelated
   `AppShellChat`'s continuous drag-resize. This component ships those
   actions as **inert buttons** (no `onClick`, no `onVariantChange` prop)
   until the intended model is confirmed. Once it is, this likely needs
   either an `onVariantChange` callback or fully uncontrolled internal state
   with real keyboard-shortcut wiring.
2. **What should `hasHistory` actually reveal on each header variant?**
   `ChatHeaderCollapsed.hasHistory` is a documented no-op and
   `ChatHeaderExpanded.hasHistory` adds a button with no visible difference in
   the captured instance (both default `false` here). `AiChat` doesn't expose
   `hasHistory` itself — it would need a resolved answer before doing so.
3. **Are the shortcut label `?` suffixes (`⌘H?`, `⌘C?`, `⌘N?`) in Figma
   placeholders or intentional?** This implementation renders them **without**
   the `?` (`⌘H`, `⌘C`, `⌘N`), on the assumption it's a Figma placeholder
   artifact — a literal `?` in a shipped shortcut hint would read as broken.
   Confirm before this ships broadly.

A fourth, related gap surfaced during implementation: **Figma's own property
list for `AiChat` is only `variant` and the `Feed` slot** (verified via
Code Connect metadata) — the header tab set, the chat-history list (today
just one fixed "New chat" item), and the per-conversation title ("Chat name")
are not bound to a component property in the design either. This confirms
they're intentionally fixed content for now rather than a missed prop, but a
real product needs a real chat-history list and a real conversation title —
that needs a content-slot API decision (additional named slots? a
compound-component pattern?) once product defines what varies per app.

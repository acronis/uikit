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
> This component's visual composition is complete and tested, and variant
> switching + resize now have real behavior (see below). Two smaller product
> decisions are still unresolved, and the content-slot gap (a real
> chat-history list, per-conversation title, tab set) is unchanged — do not
> build consumer-facing content-configuration on top of it until that's
> answered.

## When to use

- As the root container for an AI-chat panel that needs to present as a
  collapsed rail, a docked panel, or a full-width workspace.
- As the resizable chat panel beside `AppShellChat`'s `AppShellChatContent` —
  pass `resizable` and compose it directly as a sibling (not inside
  `AppShellChatChat`, which would double up header/footer/border chrome).
  See `app-shell-chat.stories.tsx` in `packages/ui-react` for the composition.

## When not to use

- **When you need a configurable chat-history list, tab set, or
  per-conversation title** — none of those are exposed yet. See "Open
  questions."

## Variant switching + resize

`variant` is controllable (`variant`/`onVariantChange`) or uncontrolled
(`defaultVariant`, default `'full-width'`). Every footer/rail button now
actually switches variants — see `behavior.md`'s "Variant switching + resize"
for the full Maximize/Minimize/Collapse chat mapping. `resizable` additionally
adds a draggable edge on the panel's start border: dragging within
`expanded`'s 384-512px range resizes it live, and dragging past the 192px
floor snaps to `collapsed` instead of clamping — the same collapse-on-drag
idiom `SidebarSecondary` uses, just applied across three variants instead of
two. No edge renders for `full-width`.

This answers the previous "how does a consumer move between variants?"
question by combining both interaction models Figma implied (discrete
`⌘H`/`⌘C`/`⌘N` actions and a continuous drag) instead of picking one
exclusively — and supersedes the old guidance to keep this component and
`AppShellChat`'s drag-resize apart. `AppShellChat`'s `AppShellChatChat` still
exists for consumers who want its generic header/body slots without AiChat's
fixed content, but the actual AI-chat integration is `AiChat` composed
directly (see "When to use" above).

## Parts

| Part                                 | Composed from                            | Notes                                                                                                                  |
| ------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `header` (collapsed)                 | `ChatHeaderCollapsed`                    | Branding glyph (`AcronisAiMultiIcon`).                                                                                 |
| `nav-chat` / `nav-tasks` (collapsed) | `ChatMenuItemCollapsed`                  | Icon-only equivalents of the expanded header's tabs.                                                                   |
| `header-tabs` (expanded)             | `ChatHeaderExpanded` + placeholder tabs  | Fixed "Acronis AI" / "Tasks" tabs (labels localizable, see that component's own placeholder warning).                  |
| `feed` / `body-feed`                 | the `Feed` SLOT                          | The **only** consumer-supplied content — via `children`.                                                               |
| `footer` / `sidebar-footer`          | `ChatMenuItem` / `ChatMenuItemCollapsed` | Variant-switch actions — wired, see "Variant switching + resize."                                                      |
| `resize-edge`                        | —                                        | `resizable` only. Draggable start-border handle; collapsed/expanded only.                                              |
| `sidebar-header` / `body-header`     | plain text                               | Fixed "Acronis AI" / "Chat name" (localizable via `acronisAiLabel`/`conversationTitle`); level-1/level-2 heading pair. |
| `sidebar-list`                       | `ChatMenuItem`                           | One fixed "New chat" item.                                                                                             |

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

### Resizable, composed beside AppShellChat's Content

```tsx
<AiChat variant={variant} onVariantChange={setVariant} resizable>
  <ConversationFeed messages={messages} />
</AiChat>
```

### Localized labels

Every accessible name/label/shortcut `AiChat` renders on its own is only a
prop default — override it to localize. See `accessibility.md` for the full
list.

```tsx
<AiChat
  variant="expanded"
  acronisAiLabel="Acronis AI"
  tasksTabLabel="Aufgaben"
  maximizeChatLabel="Chat maximieren"
  collapseChatLabel="Chat einklappen"
>
  <ConversationFeed messages={messages} />
</AiChat>
```

## Open questions

These are unresolved product/design decisions raised while building this
component — not implementation gaps to guess at. Each changes `AiChat`'s
actual behavior, not just its look, so none are answered here:

~~1. How does a consumer move between the three variants?~~ **Resolved** — see
"Variant switching + resize" above: footer/rail buttons are wired, and
`resizable` adds a drag + collapse-snap edge, combining Figma's discrete
actions with a continuous drag rather than picking one exclusively.

1. **What should `hasHistory` actually reveal on the expanded header?**
   `ChatHeaderExpanded.hasHistory` adds a button with no visible difference in
   the captured instance (defaults `false`). `AiChat` doesn't expose
   `hasHistory` itself — it would need a resolved answer before doing so.
   (`ChatHeaderCollapsed`'s own `hasHistory` was removed — it was accepted
   but never wired to anything, dead weight rather than a real open question.)
2. **Are the shortcut label `?` suffixes (`⌘H?`, `⌘C?`, `⌘N?`) in Figma
   placeholders or intentional?** This implementation renders them **without**
   the `?` (`⌘H`, `⌘C`, `⌘N`), on the assumption it's a Figma placeholder
   artifact — a literal `?` in a shipped shortcut hint would read as broken.
   Confirm before this ships broadly.

A third, related gap surfaced during implementation: **Figma's own property
list for `AiChat` is only `variant` and the `Feed` slot** (verified via
Code Connect metadata) — the header tab set, the chat-history list (today
just one fixed "New chat" item), and the per-conversation title ("Chat name")
are not bound to a component property in the design either. This confirms
they're intentionally fixed content for now rather than a missed prop, but a
real product needs a real chat-history list and a real conversation title —
that needs a content-slot API decision (additional named slots? a
compound-component pattern?) once product defines what varies per app.

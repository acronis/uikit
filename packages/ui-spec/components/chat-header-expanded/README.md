# ChatHeaderExpanded

The header bar of the **expanded** AI-chat panel: a pill tab group on the
inline-start side, icon actions on the inline-end side, on a 64px band with a
bottom hairline.

Figma: [`ChatHeaderExpanded` node 7329-24759](https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24759)

> ### ⚠ The pill tabs are a placeholder
>
> `ChatHeaderExpandedTabs` and `ChatHeaderExpandedTab` are a deliberately local
> stand-in for the standalone **`SegmentControl`** component, which is still in
> progress in Figma. They are styled from the real, shipped
> `--ui-segment-control-*` token tier, so they look correct — but the component
> boundary is temporary. When SegmentControl ships, these two parts are deleted
> and this component composes `SegmentControl` instead. Do not build new features
> on them, and do not copy them into another component.
>
> They intentionally lack: roving-tabindex arrow-key navigation,
> `aria-controls`→tabpanel wiring, real overflow scrolling, and a disabled item
> state.

## When to use

- As the top bar of the expanded AI-chat side panel, when the panel switches
  between a chat view and a task list.
- When the header needs a count badge on one of its views (e.g. pending tasks).

## When not to use

- **For the collapsed chat rail** — that's a different Figma node with different
  geometry.
- **As a generic page header** — use `PageHeader`. This component is themed by
  the `--ui-chat-*` tier and is specific to the chat panel.
- **As a general-purpose segmented control** — wait for `SegmentControl`. The
  tabs here are a placeholder, not a reusable primitive.
- **When you need tab panels with full ARIA wiring** — use `Tabs`.

## Parts

| Part                     | Element                  | Notes                                                                         |
| ------------------------ | ------------------------ | ----------------------------------------------------------------------------- |
| `ChatHeaderExpanded`     | `<header>`               | The band. Accepts `hasHistory`, `newChatLabel`, `historyLabel`, `render`.     |
| `ChatHeaderExpandedTabs` | `<div>` + `role=tablist` | **Placeholder.** The pill group. Accepts `hasScroll` + the two scroll labels. |
| `ChatHeaderExpandedTab`  | `<button role=tab>`      | **Placeholder.** One pill. Accepts `active`, `counter`.                       |

The two action buttons (`action-new-chat`, always present; `action-history`,
gated on `hasHistory`) are rendered internally from the shared `ButtonIcon`
component and the `PlusIcon` / `ArrowRotationTimeIcon` icons — they are not
separate exports.

## Examples

### Default (chat view selected)

```tsx
<ChatHeaderExpanded>
  <ChatHeaderExpandedTabs>
    <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
    <ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>
  </ChatHeaderExpandedTabs>
</ChatHeaderExpanded>
```

### With the history action

```tsx
<ChatHeaderExpanded hasHistory>
  <ChatHeaderExpandedTabs>
    <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
    <ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>
  </ChatHeaderExpandedTabs>
</ChatHeaderExpanded>
```

### Controlled selection

Selection lives with the consumer — the component keeps no internal state.

```tsx
const [view, setView] = useState<'chat' | 'tasks'>('chat');

<ChatHeaderExpanded hasHistory>
  <ChatHeaderExpandedTabs>
    <ChatHeaderExpandedTab
      active={view === 'chat'}
      onClick={() => setView('chat')}
    >
      Acronis AI
    </ChatHeaderExpandedTab>
    <ChatHeaderExpandedTab
      active={view === 'tasks'}
      counter={pendingTasks.length}
      onClick={() => setView('tasks')}
    >
      Tasks
    </ChatHeaderExpandedTab>
  </ChatHeaderExpandedTabs>
</ChatHeaderExpanded>;
```

### Localized action labels

The English strings are only prop defaults — override them to localize.

```tsx
<ChatHeaderExpanded
  hasHistory
  newChatLabel="Neuer Chat"
  historyLabel="Chatverlauf"
>
  {/* … */}
</ChatHeaderExpanded>
```

### Overflow affordance

```tsx
<ChatHeaderExpanded>
  <ChatHeaderExpandedTabs hasScroll className="max-w-[214px]">
    <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
    <ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>
    <ChatHeaderExpandedTab>Automations</ChatHeaderExpandedTab>
  </ChatHeaderExpandedTabs>
</ChatHeaderExpanded>
```

### Avoiding a duplicate `banner` landmark

```tsx
<ChatHeaderExpanded render={<div />}>{/* … */}</ChatHeaderExpanded>
```

## Open questions

- **The action buttons have no click handlers.** The prop surface is scoped to
  the Figma node's own properties, so `action-new-chat` / `action-history` render
  but cannot be wired. A follow-up should decide between an `onNewChat` /
  `onHistory` pair and an `actions` slot.
- **The Figma `variant=tasks` trailing action** is a `BarsFilter` glyph rather
  than `Plus`. Only the `chat` variant's `Plus` is implemented.

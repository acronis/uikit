# ChatHeaderCollapsed

Header bar of the collapsed AI-chat rail: a static 48px band centering one
branding glyph, composed through the shared `TagIcon`.

## When to use

- At the top of the collapsed (48px) chat rail, above the stack of
  `ChatMenuItemCollapsed` rows.

## When not to use

- For the **expanded** rail's header — that is `ChatHeaderExpanded`, which
  additionally composes tabs and icon actions.
- As a generic icon badge — use `TagIcon` directly.

## Examples

```tsx
import { ChatHeaderCollapsed } from '@acronis-platform/ui-react';
import { MessageTextIcon } from '@acronis-platform/icons-react/stroke-mono';

<div className="flex w-12 flex-col">
  <ChatHeaderCollapsed icon={<MessageTextIcon />} />
</div>;
```

## Parts

| Part   | Element  | Purpose                                                     |
| ------ | -------- | ----------------------------------------------------------- |
| root   | `header` | The 48×64 band: bottom seam, horizontal padding, centering. |
| `icon` | `span`   | The branding glyph, composed through `TagIcon`.             |

## Tokens

Geometry comes from the `--ui-chat-*` tier
(`header-height`, `container-collapsed-width`, `header-padding-x`,
`global-border-{width,style,color}`). The composed `TagIcon` brings its own
`--ui-avatar-*` tokens — not re-listed here, since they belong to that
component's spec.

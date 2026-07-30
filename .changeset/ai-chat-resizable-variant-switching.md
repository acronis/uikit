---
'@acronis-platform/ui-react': minor
---

`AiChat`'s variant-switch actions (Maximize/Minimize/Collapse chat, the collapsed rail's footer icons, "Show full-width chat") are now wired instead of inert, and `variant` is controllable/uncontrollable via a new `variant`/`defaultVariant`/`onVariantChange` trio (mirroring the existing `useControllableBoolean` idiom elsewhere in this package).

A new `resizable` prop adds a draggable resize edge on the panel's start border: dragging within `expanded`'s 384-512px range resizes it live (`width`/`onWidthChange`), and dragging — or arrow-keying — past the floor snaps to `variant="collapsed"` instead of clamping, mirroring `SidebarSecondary`'s collapse-on-drag. Dragging back out past the same threshold while collapsed re-expands it. No resize edge renders for `full-width`.

This resolves the open question in `packages/ui-spec/components/ai-chat/README.md` about how a consumer moves between variants, and supersedes the prior guidance to keep `AiChat` and `AppShellChat`'s drag-resize apart — `AiChat` is now the intended way to compose a resizable AI-chat panel beside `AppShellChat`'s `AppShellChatContent` (see the updated `app-shell-chat.stories.tsx`).

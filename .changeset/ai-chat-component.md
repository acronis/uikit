---
'@acronis-platform/ui-react': minor
---

Add `AiChat`: the root AI-chat shell (Figma "AI-Chat" component set, node `7329-24933`), assembled from the already-shipped `ChatHeaderCollapsed`, `ChatHeaderExpanded`, `ChatMenuItem`, and `ChatMenuItemCollapsed`. Switches between three layouts via `variant` — `collapsed` (a 48px icon-only rail), `expanded` (a 384-512px tabbed panel), and `full-width` (a two-pane chat-list-sidebar + conversation-body layout) — with `children` wired to the Figma `Feed` slot for `expanded`/`full-width`.

The root's prop surface mirrors Figma's own component property list exactly (`variant` + the `Feed` slot only, verified via Code Connect). See the companion `ai-chat-resizable-variant-switching` changeset in this same release for how the variant-switch actions (Maximize/Minimize/Collapse chat, New chat) are wired.

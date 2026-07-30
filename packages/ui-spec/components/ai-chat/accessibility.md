# AiChat — accessibility

## Roles and structure

| Element                              | Role / semantics                                                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| root                                 | `<aside>` → `complementary` landmark; swap via `render`                                                          |
| `header` (collapsed)                 | `<header>` nested in the root landmark → `generic` per HTML-AAM, not `banner`                                    |
| `nav-chat` / `nav-tasks` (collapsed) | `<button>` with `aria-label` (`ChatMenuItemCollapsed`)                                                           |
| `header-tabs` (expanded)             | `<header>` nested in the root landmark → `generic` per HTML-AAM, not `banner`                                    |
| `footer` / `sidebar-footer`          | `<footer>`, containing `<button>` rows                                                                           |
| sidebar `<aside>` (full-width)       | `<aside>` → `complementary`, `aria-labelledby` → `sidebar-header` so it's distinguishable from the root landmark |
| `sidebar-header`                     | plain text, `role="heading"` `aria-level="1"` — the panel's own outline root                                     |
| `body-header`                        | plain text, `role="heading"` `aria-level="2"` — a subsection of `sidebar-header`                                 |
| `sidebar-list` item ("New chat")     | `<button>` (`ChatMenuItem`)                                                                                      |

## Accessible names

Every accessible name `AiChat` renders on its own has a matching prop,
defaulted to the English copy below — see `api.yaml` for the full list
(`chatNavLabel`, `tasksNavLabel`, `maximizeChatLabel`, `maximizeChatShortcut`,
`showFullWidthChatLabel`, `collapseChatLabel`, `collapseChatShortcut`,
`newChatLabel`, `newChatShortcut`, `minimizeChatLabel`, `acronisAiLabel`,
`tasksTabLabel`, `conversationTitle`, `resizeTooltip`):

| Control                      | Accessible name                              |
| ---------------------------- | -------------------------------------------- |
| collapsed "Chat" nav item    | `"Chat"`                                     |
| collapsed "Tasks" nav item   | `"Tasks (new activity)"`                     |
| collapsed footer: maximize   | `"Maximize chat"`                            |
| collapsed footer: full-width | `"Show full-width chat"`                     |
| expanded footer: maximize    | `"Maximize chat ⌘H"` (label + shortcut text) |
| expanded footer: collapse    | `"Collapse chat ⌘C"`                         |
| full-width sidebar: new chat | `"New chat ⌘N"`                              |
| full-width footer: minimize  | `"Minimize chat ⌘H"`                         |
| full-width footer: collapse  | `"Collapse chat ⌘C"`                         |

The `⌘H`/`⌘C`/`⌘N` shortcut text comes from a `ChatMenuItemExtras` sibling
`<span>` inside the same button, so it is part of the button's computed
accessible name (concatenated with the label) — query by a regex/substring
match (`/Maximize chat/`), not an exact string, when testing these.
`maximizeChatLabel`/`maximizeChatShortcut` are shared by both the collapsed
rail's icon button (`collapsed` → `expanded`) and the expanded footer's
button (`expanded` → `full-width`); `collapseChatLabel`/`collapseChatShortcut`
are shared by the expanded and full-width footers (both transition to
`collapsed`); `acronisAiLabel` is shared by the expanded header's first tab
and the full-width sidebar's heading.

## Keyboard

| Key               | Result                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Tab`             | Moves through the nav items, then the footer actions (or, in `full-width`, the sidebar list then the sidebar footer) |
| `Enter` / `Space` | Activates the focused button, switching `variant` (see behavior.md's "Variant switching + resize")                   |

**Known gap.** The `⌘H`/`⌘C`/`⌘N` shortcuts shown as text are not bound as
actual keyboard shortcuts (`useEffect` + `keydown`, or similar) — this is
part of the unresolved interaction-model question in README.md. Shipping a
real keyboard shortcut without a confirmed interaction model would risk
conflicting with a consumer app's own bindings.

## Screen reader

- The `feed`/`body-feed` region has no `aria-live` region wired — if the
  conversation content passed via `children` streams in dynamically, the
  consumer's own feed component is responsible for its own live-region
  behavior (this component only provides the container).
- The collapsed rail's two nav items and the expanded header's two tabs
  represent the same two views (chat / tasks) in different chrome — a screen
  reader user moving between `collapsed` and `expanded` (if a consumer
  toggles `variant` themselves) will hear different phrasing ("Tasks (new
  activity)" vs. a tab named "Tasks") for the same underlying view. Flagged
  as a candidate for reconciliation once the tab/nav content model is
  resolved (README.md).

## Contrast

All colors resolve to `--ui-*` tokens (see tokens.yaml) or a composed child's
own token tier, all maintained by the design team against WCAG AA.

## RTL

The root's own layout uses logical utilities (`border-s-`, `border-e-`)
throughout, and every composed child mirrors per its own spec — see
behavior.md's "Direction" scenario.

# AppShellChat

A 3-section, horizontally resizable application scaffold: a sidebar rail beside a
Content page column and a Chat panel. Content and Chat resize against each other;
Chat is resize-only — drag it down to an icon-only rail or up to full width. The
Chat slot is optional, so the same scaffold also serves an ordinary two-column
console screen.

## When to Use

- A product screen that pairs the main page content with a persistent,
  resizable chat / assistant panel (e.g. "Acronis AI").
- When the chat must be freely resizable — including down to an icon-only rail
  or up to full width — without disturbing the navigation sidebars.

## When NOT to Use

- A transient chat overlay — use a Sheet or Popover.
- Content that should resize proportionally in percentages — use **Resizable**
  (this component deliberately uses fixed pixel sizing so sidebar changes never
  resize the chat).

## Parts

| Part                        | Element   | Role                                                              |
| --------------------------- | --------- | ----------------------------------------------------------------- |
| `AppShellChat`              | `<div>`   | Root                                                              |
| `AppShellChatSidebar`       | `<aside>` | Rail slot for SidebarPrimary (+ SidebarSecondary)                 |
| `AppShellChatContent`       | `<div>`   | Page column (`flex-1`); can shrink to 0, never unmounts           |
| `AppShellChatContentHeader` | `<div>`   | Page header row (bottom divider)                                  |
| `AppShellChatContentBody`   | `<div>`   | Scrolling page body                                               |
| `AppShellChatChat`          | `<aside>` | Resizable chat panel                                              |
| `AppShellChatChatHeader`    | `<div>`   | Chat header (title + actions, or icon-only rail at the min width) |
| `AppShellChatChatBody`      | `<div>`   | Scrolling chat body (hidden at the min width)                     |

The resize edge is rendered automatically inside `AppShellChatChat` and is not a
public part.

## Quick Example

### React

```tsx
import {
  AppShellChat,
  AppShellChatSidebar,
  AppShellChatContent,
  AppShellChatContentHeader,
  AppShellChatContentBody,
  AppShellChatChat,
  AppShellChatChatHeader,
  AppShellChatChatBody,
  useAppShellChatInitialLayout,
  SidebarPrimary,
  SidebarSecondary,
} from '@acronis-platform/ui-react';

function Screen() {
  // Resolves ONCE at mount from the viewport width — see "Responsive
  // layout" below. AppShellChatSidebar is a plain slot (not a fixed
  // SidebarPrimary+SidebarSecondary pairing it owns), so wiring the result
  // into each sidebar's `defaultExpanded` is the consumer's job.
  const initialLayout = useAppShellChatInitialLayout();

  return (
    <AppShellChat className="h-screen">
      <AppShellChatSidebar>
        <SidebarPrimary defaultExpanded={initialLayout.primaryExpanded}>
          {/* … */}
        </SidebarPrimary>
        <SidebarSecondary defaultExpanded={initialLayout.secondaryExpanded}>
          {/* … */}
        </SidebarSecondary>
      </AppShellChatSidebar>
      <AppShellChatContent>
        <AppShellChatContentHeader>Page header</AppShellChatContentHeader>
        <AppShellChatContentBody>{/* page */}</AppShellChatContentBody>
      </AppShellChatContent>
      <AppShellChatChat>
        <AppShellChatChatHeader label="Acronis AI" />
        <AppShellChatChatBody>{/* chat */}</AppShellChatChatBody>
      </AppShellChatChat>
    </AppShellChat>
  );
}
```

## Sizing model

Content is `flex-1 min-w-0`; Chat has an explicit pixel width (responsive by
default, or an inline override once the user drags/keyboard-resizes it — see
**Responsive layout** below). Because Chat never uses percentages and the
sidebars sit outside any resizable group, expanding / collapsing / resizing a
sidebar only reflows Content — Chat keeps its width. Chat's own resize range
runs from a 48px floor (icon-only rail) up to the row's actual available
width, so dragging it far enough shrinks Content to 0 and Chat alone fills
the row — there is no separate full-width toggle.

## Responsive layout

Chat's width and the sidebars' initial expanded state both key off the same
breakpoints (`src/lib/breakpoints.ts` — 1280px / 1680px), but with
deliberately different lifetimes:

- **Chat's width is LIVE** — plain responsive CSS, no wiring required. It
  reflows on every browser resize (512px at 1680px+, 448px from
  1280-1679px, the 48px icon-rail floor below 1280px) until the user drags
  or keyboard-resizes it, at which point that explicit choice wins until
  double-click/Home resets it.
- **The sidebars' initial layout is frozen at mount** — resolved once from
  `useAppShellChatInitialLayout()` (exported alongside `AppShellChat`) and
  wired into `SidebarPrimary`/`SidebarSecondary`'s `defaultExpanded` prop
  (see the Quick Example above). At 1680px+ both sidebars start expanded;
  below that, `SidebarPrimary` starts collapsed while `SidebarSecondary`
  stays expanded. A later viewport resize, or the user manually toggling a
  sidebar, never re-derives this — sidebars own real collapse/expand
  controls, so their state shouldn't fight a live viewport change the way
  Chat's plain width safely can.

See `behavior.md`'s **Responsive layout** section for the full Given/When/Then
scenarios.

## Spec Files

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link              |
| `anatomy.yaml`     | Root, parts, layout, states                                       |
| `api.yaml`         | Framework-agnostic contract + framework adapters                  |
| `tokens.yaml`      | Shared `--ui-*` token references (no component-specific tokens)   |
| `behavior.md`      | Given/When/Then behavior scenarios                                |
| `accessibility.md` | ARIA roles, keyboard map, screen-reader and contrast requirements |

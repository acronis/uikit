# AiChat — behavior

Given/When/Then scenarios for the root AI-chat shell.

> Figma's own component property list for `AiChat` is only `variant` and a
> `Feed` SLOT (verified via `get_context_for_code_connect`) — no other content
> shown in the design is bound to a component property either. Scenarios below
> that describe fixed content ("Acronis AI", "New chat", the tab set, the
> variant-switch actions) reflect that: they are not configurable in Figma, so
> they are not configurable here.

## Rendering

**Scenario: the default variant is full-width**

- **Given** an `AiChat` with no `variant` prop
- **When** it renders
- **Then** it lays out as the two-pane `full-width` layout.

**Scenario: collapsed renders the icon-only rail**

- **Given** `variant="collapsed"`
- **When** it renders
- **Then** a 48px-wide column appears with a branding header
  (`ChatHeaderCollapsed`), two icon-only nav items ("Chat", "Tasks"), a
  decorative spacer, and a footer with two icon-only variant-switch actions
- **And** `children` is not rendered anywhere — there is no room for it.

**Scenario: expanded renders the tabbed panel**

- **Given** `variant="expanded"`
- **When** it renders
- **Then** a 384–512px-wide column appears with a tabbed header
  (`ChatHeaderExpanded` composing "Acronis AI" / "Tasks" placeholder tabs), a
  feed region containing `children`, and a footer with two labeled
  variant-switch actions ("Maximize chat" `⌘H`, "Collapse chat" `⌘C`).

**Scenario: full-width renders the two-pane layout**

- **Given** `variant="full-width"`
- **When** it renders
- **Then** a fixed-width sidebar (branding title "Acronis AI", a "New chat"
  item with `⌘N`, and a footer with "Minimize chat" `⌘H` / "Collapse chat"
  `⌘C`) appears beside a flexible body (title "Chat name", a feed region
  containing `children`).

## Content

**Scenario: children only reaches the Feed slot**

- **Given** `children` is passed
- **When** `variant` is `expanded` or `full-width`
- **Then** it renders inside that variant's feed region.

- **Given** `children` is passed
- **When** `variant` is `collapsed`
- **Then** it is not rendered — the rail shows a decorative spacer instead.

**Scenario: everything else is fixed, not configurable**

- **Given** a consumer wants a different sidebar title, tab set, chat-history
  list, or variant-switch label
- **When** they look for a prop to set it
- **Then** none exists — `variant` and `children` are the entire prop surface,
  matching Figma's own property list for this component exactly. See
  README.md's "Open questions" for what would need to be resolved before this
  can change.

## Variant-switch actions

**Scenario: the actions render but do nothing**

- **Given** any variant's footer/nav actions (Maximize/Minimize/Collapse chat,
  the collapsed rail's footer icons, "New chat")
- **When** one is activated
- **Then** nothing happens — no `onClick` is wired. The interaction model for
  moving between variants (discrete actions with keyboard shortcuts, as shown
  here, vs. the unrelated `AppShellChat`'s continuous drag-resize) is an open
  product question (README.md), not an oversight.

## Composition

**Scenario: the root element can be swapped**

- **Given** `render={<div />}`
- **Then** the shell renders as a `<div>` while keeping all of its classes.

## Direction

**Scenario: the shell mirrors under `dir="rtl"`**

- **Given** an ancestor sets `dir="rtl"`
- **Then** the root's leading border moves to the (now right) inline-start
  edge, the `full-width` sidebar's trailing border moves to the (now left)
  inline-end edge, and every composed child (`ChatHeaderCollapsed`,
  `ChatHeaderExpanded`, `ChatMenuItem`, `ChatMenuItemCollapsed`) mirrors per
  its own spec.

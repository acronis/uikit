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

## Variant switching + resize

`variant` follows the controlled/uncontrolled idiom: pass `variant` +
`onVariantChange` to own the value, or `defaultVariant` (default `'full-width'`)
to let `AiChat` manage it internally. Every scenario below applies in both
modes — "changes to X" means "the uncontrolled value becomes X, or
`onVariantChange(X)` fires if controlled."

**Scenario: collapsed's footer actions**

- **Given** `variant="collapsed"`
- **When** "Maximize chat" is activated
- **Then** the variant changes to `expanded`.
- **When** "Show full-width chat" is activated instead
- **Then** the variant changes to `full-width`.

**Scenario: expanded's footer actions**

- **Given** `variant="expanded"`
- **When** "Maximize chat" (`⌘H`) is activated
- **Then** the variant changes to `full-width`.
- **When** "Collapse chat" (`⌘C`) is activated instead
- **Then** the variant changes to `collapsed`.

**Scenario: full-width's sidebar-footer actions**

- **Given** `variant="full-width"`
- **When** "Minimize chat" (`⌘H`) is activated
- **Then** the variant changes to `expanded`.
- **When** "Collapse chat" (`⌘C`) is activated instead
- **Then** the variant changes to `collapsed`.
- **And** "New chat" (`⌘N`) remains inert regardless — it starts a new
  conversation, not a variant transition, and there is no chat-session model
  yet to wire it to (README.md's "Open questions").

**Scenario: resizable drag-resize within expanded**

- **Given** `resizable` and `variant="expanded"`
- **When** the start-border edge is dragged toward the row's start (growing
  the panel) or away from it (shrinking)
- **Then** the width tracks the pointer, clamped to [384px, 512px] — the same
  bounds as the static `expanded` width.

**Scenario: dragging past the floor snaps to collapsed, not clamps**

- **Given** `resizable` and `variant="expanded"`
- **When** the edge is dragged narrower than the 192px collapse threshold
  (half of `expanded`'s 384px floor — mirrors `SidebarSecondary`'s
  `collapseThreshold`)
- **Then** the variant changes to `collapsed` instead of stopping at 384px.

**Scenario: dragging back out re-expands from collapsed**

- **Given** `resizable` and `variant="collapsed"`
- **When** the edge is dragged past the same 192px threshold
- **Then** the variant changes to `expanded`.

**Scenario: no resize edge on full-width**

- **Given** `resizable` and `variant="full-width"`
- **Then** no resize edge renders — full-width is a takeover layout with no
  meaningful boundary to drag (see the "When not to use" note in README.md
  about composing this beside another `flex-1` region).

**Scenario: keyboard resize mirrors the drag thresholds**

- **Given** `resizable`, the resize edge focused, and `variant="expanded"`
- **When** the shrink-direction arrow key is pressed enough times to go below
  384px
- **Then** the variant changes to `collapsed` (matching the drag behavior)
  instead of clamping at 384px.
- **Given** `variant="collapsed"` instead
- **When** the grow-direction arrow key is pressed
- **Then** the variant changes to `expanded`.
- **Given** any resizable state
- **When** `Home` is pressed
- **Then** the width resets to 512px, expanding first if `collapsed`.

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

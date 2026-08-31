# SidebarSecondary — Behavior Scenarios

## Structure

### Renders a navigation landmark

**Given** a SidebarSecondary wrapping a header, content, and footer
**When** the component renders
**Then** the root is a `<nav>` with a distinguishing `aria-label`
**And** the header renders an `<h2>` heading
**And** each menu is a `<ul>` of `<li>` rows

### Sections divide the menu

**Given** more than one SidebarSecondarySection
**When** the panel renders
**Then** the first section has no top divider
**And** every following section carries a top border
**And** a SidebarSecondarySectionLabel renders above its menu when provided

---

## Selection

### Marks the current route

**Given** a SidebarSecondaryMenuItem (or sub-trigger / sub-item) with `selected`
**When** the panel renders
**Then** the row applies the `selected` **container** token
**And** it carries `aria-current="page"`
**And** its icon and label use the shared global state tokens (same as unselected)

---

## Expand / collapse (panel width)

### Defaults to expanded

**Given** a SidebarSecondary with no `expanded` / `defaultExpanded`
**When** it renders
**Then** the root has `data-state="expanded"` (256px width)
**And** the section list (content) is shown; the collapsed-breadcrumb is hidden

### Collapses to a breadcrumb rail

**Given** `expanded={false}`
**When** it renders
**Then** the root has `data-state="collapsed"` (48px width)
**And** the header is hidden
**And** the content section list is hidden
**And** the collapsed-breadcrumb is shown: parent → separator → current page
**And** the breadcrumb labels render vertically (`writing-mode: vertical-rl`)
**And** menu-item labels (when any rows remain) are kept in the DOM as `sr-only`

> The content and the collapsed-breadcrumb are both authored and present in the
> DOM; visibility is toggled purely by `data-[state]` selectors (SSR-safe, no JS
> branch).

### `collapsible={false}` blocks every user collapse/expand path

**Given** a SidebarSecondary with `collapsible={false}`
**When** the user clicks the resize edge, double-clicks it while collapsed,
drags it past the collapse threshold, presses the shrink Arrow at the minimum
width, presses the grow Arrow while collapsed, presses Enter/Space on the resize
edge, presses Home while collapsed, or activates the footer
`SidebarSecondaryCollapseTrigger`
**Then** `expanded` never changes and `data-state` stays as it was
**And** the footer collapse trigger renders natively `disabled`

> **The width reset is not inert while collapsed.** Blocking the expand does not
> block the width reset: on the resize edge of a `collapsible={false}`, collapsed
> panel, **`Home` and a double-click** both still reset the stored width to
> `defaultWidth` and fire `onWidthChange` (`handleDoubleClick` writes the width
> unconditionally — only its `toggleExpanded()` call is gated on `collapsible`).
> Nothing changes visually at that moment (the rail stays collapsed), but a
> controlled consumer observes the new width, and it takes effect the moment the
> panel is expanded by other means (a controlled `expanded` prop). Every _other_
> expand-triggering gesture — a single click, a drag, the grow Arrow, Enter/Space
> — is genuinely inert in that state.

### A disabled collapse trigger looks inert

**Given** a SidebarSecondary with `collapsible={false}` (or an explicitly
`disabled` `SidebarSecondaryCollapseTrigger`)
**When** the footer collapse trigger renders
**Then** it shows a `not-allowed` cursor instead of the pointer cursor
**And** its label and icon use the disabled on-surface foreground token
**And** hovering or pressing it produces no highlight — the hover and active
fills stay pinned to the row's idle container color
**And** this is in addition to the native `disabled` attribute above, so the
row reads as visually inert exactly where it is functionally inert

### Resizing stays live and clamps at the minimum

**Given** an expanded, `resizable` SidebarSecondary with `collapsible={false}`
**When** the user drags the resize edge below the collapse threshold, or presses
the shrink Arrow so the next step would fall under `minWidth`
**Then** the width clamps to `minWidth` (the expanded-width token's shipped
default, 256px) instead of collapsing
**And** drag/Arrow resizing between `minWidth` and `maxWidth` behaves exactly as
it does when `collapsible` is `true`

### A permanently collapsed rail is a valid combination

**Given** `collapsible={false}` together with `defaultExpanded={false}`
**When** the panel renders
**Then** it renders as the collapsed breadcrumb rail (`data-state="collapsed"`)
**And** no user interaction can expand it — only a controlled `expanded` prop can
**And** the resize edge stays focusable and keeps its accessible name, but is
inert: dragging it, clicking it, and the grow/shrink Arrow keys produce no
observable change
**And** the one exception is the width reset — `Home` **and** a double-click on
the edge both still write `defaultWidth` and fire `onWidthChange` while the rail
stays visually unchanged (see the width-reset note above)

> `collapsible` never forces `expanded` to a value; it only gates the
> user-initiated transitions. A controlled `expanded` prop keeps full authority
> either way.

### The expanded default tooltip drops the click gesture

**Given** `collapsible={false}`, an **expanded** panel, and no
`resizeTooltipExpanded` override
**When** the user hovers the resize edge
**Then** the tooltip reads "**Resize:** Drag" and "**Reset size:** Double click"
— the "**Collapse:** Click" line the `collapsible={true}` default carries is
omitted, because clicking the edge can no longer collapse the panel
**And** an explicit `resizeTooltipExpanded` value still wins, including `null`
to suppress the tooltip

### A permanently collapsed rail's tooltip advertises only the double-click

**Given** `collapsible={false}`, a **collapsed** panel, and no
`resizeTooltipCollapsed` override
**When** the user hovers the resize edge
**Then** the tooltip reads "**Reset size:** Double click" — and nothing else
**And** the other two lines the `collapsible={true}` collapsed default carries
are dropped, because neither gesture is live: clicking the edge bails in
`handleClick`, and the collapsed drag branch only ever calls `toggleExpanded()`
(itself gated off) and never writes a width, so both "**Resize:** Drag" and
"**Expand:** Click" would be false claims
**And** the double-click line _is_ honest: `handleDoubleClick` writes
`defaultWidth` unconditionally, so it stays a live pointer gesture — the pointer
counterpart of `Home`
**And** an explicit `resizeTooltipCollapsed` value still wins, including `null`
to suppress the tooltip entirely

---

## Disclosure (expandable sections)

### Toggles a section's menu

**Given** a `SidebarSecondarySection` with `expandable`
**When** the user activates the section-label header
**Then** `aria-expanded` flips and the section's menu collapses/expands
**And** the header chevron rotates

### Opens initially / is controllable

**Given** an expandable section with `defaultOpen`
**When** it renders
**Then** the disclosure is open initially
**And** `open` / `onOpenChange` allow controlled use (Base UI Collapsible)
**And** each expandable section has independent open state

---

## Extras

### Shortcut / external link

**Given** a SidebarSecondaryMenuItemExtras with `variant="shortcut"` / `"externalLink"`
**When** the item renders expanded
**Then** the shortcut text / external-link icon appears trailing the label

### Hidden when collapsed

**Given** any extras inside a menu item
**When** the panel is collapsed
**Then** the extras cluster is hidden

## Expandable section

### Toggle a section

**Given** a `SidebarSecondarySection` with `expandable`
**When** the user activates its section-label header
**Then** the section's menu collapses/expands and the header chevron rotates
(`aria-expanded` flips); an uncontrolled section starts open

### Header actions stay operable

**Given** an expandable section-label with an `actions` slot (e.g. a ButtonIcon)
**When** the user activates the action
**Then** the action fires and the section does **not** toggle (the action is a
sibling of the toggle, never nested in it)

### Unread rollup while collapsed

**Given** an expandable section-label with an `unreadRollup` badge
**When** the section is collapsed
**Then** the rollup badge shows in the header; it hides again when expanded

### Items inside expandable sections are indented

**Given** a `SidebarSecondaryMenuItem` inside an expandable section
**When** the section is open
**Then** items are left-indented so their label aligns with the section header text

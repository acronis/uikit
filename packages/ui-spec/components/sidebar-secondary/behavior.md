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
**And** the content section list is hidden
**And** the collapsed-breadcrumb is shown: parent → separator → current page
**And** menu-item labels (when any rows remain) are kept in the DOM as `sr-only`

> The content and the collapsed-breadcrumb are both authored and present in the
> DOM; visibility is toggled purely by `data-[state]` selectors (SSR-safe, no JS
> branch).

---

## Disclosure (expandable Level-1 rows)

### Toggles a child list

**Given** a SidebarSecondaryMenuSub with a trigger and content
**When** the panel renders
**Then** the trigger (a `<button>`) has `aria-expanded="false"` and `aria-controls`
**When** the user clicks (or presses Enter/Space on) the trigger
**Then** `aria-expanded` becomes `true` and the Level-2 child list is shown
**And** the trailing chevron rotates

### Opens initially / is controllable

**Given** a SidebarSecondaryMenuSub with `defaultOpen`
**When** it renders
**Then** the disclosure is open initially
**And** `open` / `onOpenChange` allow controlled use (Base UI Collapsible)
**And** each expandable row has independent open state

---

## Level-2 sub-items

### Indented child rows

**Given** a SidebarSecondaryMenuSubItem inside a sub-content panel
**When** it renders
**Then** it is left-indented by the level-2 padding token
**And** it has no leading icon

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

# SidebarPrimary — Behavior Scenarios

## Structure

### Renders a navigation landmark

**Given** a SidebarPrimary wrapping a header, content, and footer
**When** the component renders
**Then** the root is a `<nav>` with a distinguishing `aria-label` (default `"Primary"`)
**And** each menu is a `<ul>` of `<li>` rows
**And** menu items are links (`<a>`) by default

### Sections divide the menu

**Given** more than one SidebarPrimarySection in the content
**When** the rail renders
**Then** the first section has no top divider
**And** every following section carries a top border

---

## Selection

### Marks the current route

**Given** a SidebarPrimaryMenuItem with `selected`
**When** the rail renders
**Then** the item applies the `selected` container/icon/label tokens
**And** it carries `aria-current="page"`

### Unselected items

**Given** a SidebarPrimaryMenuItem without `selected`
**When** the rail renders
**Then** the item applies the `unselected` tokens (transparent container at idle)
**And** it does not carry `aria-current`

---

## Expand / collapse (rail width)

### Defaults to expanded

**Given** a SidebarPrimary with no `expanded` / `defaultExpanded`
**When** it renders
**Then** the root has `data-state="expanded"` (256px width)

### Collapses to an icon rail

**Given** `expanded={false}` (or a consumer toggles it via `onExpandedChange`)
**When** it renders
**Then** the root has `data-state="collapsed"` (48px width)
**And** the header padding shrinks and the logo height drops
**And** menu-item labels are visually hidden but kept in the DOM as `sr-only`
**And** trailing extras are hidden

---

## Menu items

### Composes with a router link

**Given** a SidebarPrimaryMenuItem with `render={<Link to="/assets" />}`
**When** it renders
**Then** the router `Link` is the rendered element
**And** the menu-item classes and props are merged onto it
**And** no extra `<a>` wrapper is produced

### Leads with an icon

**Given** a SidebarPrimaryMenuItem with an `icon`
**When** it renders
**Then** the icon sits before the label, optically top-aligned (`icon-margin-t`)

---

## Extras

### Shortcut

**Given** a SidebarPrimaryMenuItemExtras `variant="shortcut" shortcut="⌘K"`
**When** the item renders expanded
**Then** the shortcut text appears trailing the label

### External link

**Given** a SidebarPrimaryMenuItemExtras `variant="externalLink"`
**When** the item renders expanded
**Then** a 16px external-link icon appears trailing the label

### Hidden when collapsed

**Given** any extras inside a menu item
**When** the rail is collapsed
**Then** the extras cluster is hidden

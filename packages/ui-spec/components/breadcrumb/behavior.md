# Breadcrumb — Behavior Scenarios

## Structure

### Renders a navigation landmark

**Given** a Breadcrumb wrapping a list of items
**When** the component renders
**Then** the root is a `<nav>` with `aria-label="breadcrumb"`
**And** the trail is an `<ol>` of `<li>` items

### Renders the default chevron separator

**Given** a BreadcrumbSeparator with no children
**When** it renders
**Then** a 16px chevron-right icon appears
**And** the separator is `aria-hidden`

### Renders a custom separator

**Given** a BreadcrumbSeparator with children (e.g. `"/"`)
**When** it renders
**Then** the children replace the default chevron
**And** no icon is rendered

---

## Current Page

### Marks the current page

**Given** the last item is a BreadcrumbPage
**When** the trail renders
**Then** that element has `aria-current="page"` and `aria-disabled="true"`
**And** it exposes `role="link"` but carries no `href` (a disabled current-page link)
**And** no separator follows it

### Non-final items are interactive links

**Given** a BreadcrumbItem containing a BreadcrumbLink
**When** the trail renders
**Then** the item is an interactive link
**And** it does not carry `aria-current`

---

## Links

### Underlines on hover

**Given** a BreadcrumbLink
**When** the pointer hovers it
**Then** the link text is underlined
**And** the underline is removed again while the link is pressed (`:active`)

### Shows a focus-ring on keyboard focus

**Given** a BreadcrumbLink
**When** it receives keyboard focus
**Then** it shows a 3px focus-ring (`--ui-focus-primary`) flush to the label
**And** the link text is not underlined

### Composes with a router link

**Given** a BreadcrumbLink with `render={<Link to="/" />}`
**When** it renders
**Then** the router `Link` is the rendered element
**And** the breadcrumb link classes and props are merged onto it
**And** no extra `<a>` wrapper is produced

---

## Truncation (ellipsis)

### Stands in for collapsed items

**Given** a long trail where middle items are collapsed
**When** a BreadcrumbEllipsis is placed between the first and last items
**Then** an ellipsis icon is shown
**And** it carries an `sr-only` "More" label for assistive tech

> Truncation is author-driven in this composable API: the consumer decides
> which items to collapse and renders a BreadcrumbEllipsis (optionally wrapping
> it in a dropdown/menu) in their place. The component does not auto-collapse.

---

## Edge Cases

### Single item

**Given** a Breadcrumb with only a current page
**When** it renders
**Then** the page is shown with `aria-current="page"`
**And** no separator is rendered

### Icon inside a link

**Given** a BreadcrumbLink containing an icon and text
**When** it renders
**Then** the icon and text sit inline within the link

# SidebarPrimary

The app-level navigation rail — the persistent left-hand shell that lists the
product's top-level destinations. Built as composable parts so the rail's
structure stays explicit in markup, with an expanded (full-width) and a
collapsed (icon-only) state.

## When to Use

- The primary, app-wide navigation between top-level areas.
- A persistent rail that can collapse to icons to reclaim horizontal space.
- Grouped destinations (sections) with a pinned footer (help, collapse, …).

## When NOT to Use

- **Contextual, second-level navigation** within a section — use
  SidebarSecondary.
- **In-page section links** — use an anchor/table-of-contents.
- **A popover menu of actions** — use a Menu/Dropdown.
- **Breadcrumb-style location** — use Breadcrumb.

## Parts

| Part                            | Element                              | Role                                              |
| ------------------------------- | ------------------------------------ | ------------------------------------------------- |
| `SidebarPrimary`                | `<nav>`                              | Navigation landmark; owns the expanded state      |
| `SidebarPrimaryHeader`          | `<div>`                              | Consumer logo slot; sizes on expanded/collapsed   |
| `SidebarPrimaryContent`         | `<div>`                              | Scrollable region of sections                     |
| `SidebarPrimaryFooter`          | `<div>`                              | Pinned footer menu with a top divider             |
| `SidebarPrimarySection`         | `<div>`                              | A group of menu items (divider between groups)    |
| `SidebarPrimaryMenu`            | `<ul>`                               | List that owns the inter-item gap                 |
| `SidebarPrimaryMenuItem`        | `<li><a>` (polymorphic via `render`) | A nav row: icon + label + optional extras         |
| `SidebarPrimaryMenuItemExtras`  | `<span>`                             | Trailing shortcut / external-link / tag           |
| `SidebarPrimaryCollapseTrigger` | `<li><button>`                       | Footer "Collapse menu" button; toggles `expanded` |

## Quick Examples

### React

```tsx
import {
  SidebarPrimary,
  SidebarPrimaryHeader,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimarySection,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
} from '@acronis-platform/ui-react';
import {
  BoxIcon,
  UsersIcon,
  CircleHelpIcon,
} from '@acronis-platform/icons-react/stroke-mono';

function AppRail() {
  const [expanded, setExpanded] = useState(true);
  return (
    <SidebarPrimary expanded={expanded} onExpandedChange={setExpanded}>
      <SidebarPrimaryHeader>
        <ProductLogo />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="/assets" icon={<BoxIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="/clients" icon={<UsersIcon />}>
              Clients
              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimarySection>
      </SidebarPrimaryContent>
      <SidebarPrimaryFooter>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="/help" icon={<CircleHelpIcon />}>
            Help
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimaryFooter>
    </SidebarPrimary>
  );
}
```

Render a menu item as a router link via the `render` prop:

```tsx
<SidebarPrimaryMenuItem render={<Link to="/assets" />} icon={<BoxIcon />}>
  Assets
</SidebarPrimaryMenuItem>
```

## Logo

The product logo is a **consumer-provided child** of the header — the component
does not ship a Logo part. The header just sizes whatever `img`/`svg` you slot
in (32px collapsed, 48px expanded) and tints it via the logo-color token.

## Spec Files

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link              |
| `anatomy.yaml`     | Root, parts, layout, states                                       |
| `api.yaml`         | Framework-agnostic contract + framework adapters                  |
| `tokens.yaml`      | `--ui-sidebar-primary-*` token references                         |
| `behavior.md`      | Given/When/Then behavior scenarios                                |
| `accessibility.md` | ARIA roles, keyboard map, screen-reader and contrast requirements |

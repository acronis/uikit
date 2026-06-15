# SidebarSecondary

The contextual, second-level navigation panel that sits beside the primary rail
(SidebarPrimary). It lists the destinations within the currently selected
top-level area, supports an expandable disclosure level, and collapses to a
breadcrumb rail.

## When to Use

- Second-level navigation within a top-level area selected in SidebarPrimary.
- Grouped, labelled sections of links, some with a Level-2 child list.
- A panel that collapses to a compact location breadcrumb to reclaim space.

## When NOT to Use

- **App-wide, top-level navigation** — use SidebarPrimary.
- **A popover menu of actions** — use a Menu/Dropdown.
- **In-page section links / table of contents** — use anchors.
- **Deep (3+ level) trees** — this component models one disclosure level only.

## Parts

| Part                                  | Element                              | Role                                              |
| ------------------------------------- | ------------------------------------ | ------------------------------------------------- |
| `SidebarSecondary`                    | `<nav>`                              | Navigation landmark; owns the expanded state      |
| `SidebarSecondaryHeader`              | `<div><h2>`                          | Section title row                                 |
| `SidebarSecondaryContent`             | `<div>`                              | Scrollable section list (expanded only)           |
| `SidebarSecondaryCollapsedBreadcrumb` | `<div>`                              | Rail-mode location indicator (collapsed only)     |
| `SidebarSecondaryFooter`              | `<div>`                              | Footer menu with a top divider                    |
| `SidebarSecondarySection`             | `<div>`                              | A group of rows (divider between groups)          |
| `SidebarSecondarySectionLabel`        | `<div>`                              | Optional section caption                          |
| `SidebarSecondaryMenu`                | `<ul>`                               | List that owns the inter-item gap                 |
| `SidebarSecondaryMenuItem`            | `<li><a>` (polymorphic via `render`) | Level-1 leaf row                                  |
| `SidebarSecondaryMenuSub`             | `Collapsible.Root` `<li>`            | Expandable Level-1 row                            |
| `SidebarSecondaryMenuSubTrigger`      | `Collapsible.Trigger` `<button>`     | Disclosure parent row (rotating chevron)          |
| `SidebarSecondaryMenuSubContent`      | `Collapsible.Panel` `<div><ul>`      | Level-2 child list                                |
| `SidebarSecondaryMenuSubItem`         | `<li><a>`                            | Level-2 indented leaf                             |
| `SidebarSecondaryMenuItemExtras`      | `<span>`                             | Trailing shortcut / external-link / tag           |
| `SidebarSecondaryCollapseTrigger`     | `<li><button>`                       | Footer "Collapse menu" button; toggles `expanded` |

## Quick Examples

### React

```tsx
import {
  SidebarSecondary,
  SidebarSecondaryHeader,
  SidebarSecondaryContent,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
} from '@acronis-platform/ui-react';
import {
  LayoutGridIcon,
  BoxIcon,
} from '@acronis-platform/icons-react/stroke-mono';

function ProtectionNav() {
  const [expanded, setExpanded] = useState(true);
  return (
    <SidebarSecondary expanded={expanded} onExpandedChange={setExpanded}>
      <SidebarSecondaryHeader label="Protection" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem
              href="/dashboard"
              icon={<LayoutGridIcon />}
              selected
            >
              Dashboard
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuSub defaultOpen>
              <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />}>
                Policies
              </SidebarSecondaryMenuSubTrigger>
              <SidebarSecondaryMenuSubContent>
                <SidebarSecondaryMenuSubItem href="/policies/backup" selected>
                  Backup
                </SidebarSecondaryMenuSubItem>
                <SidebarSecondaryMenuSubItem href="/policies/av">
                  Antivirus
                </SidebarSecondaryMenuSubItem>
              </SidebarSecondaryMenuSubContent>
            </SidebarSecondaryMenuSub>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb
        parentLabel="Protection"
        currentLabel="Dashboard"
      />
    </SidebarSecondary>
  );
}
```

Render a row as a router link via the `render` prop:

```tsx
<SidebarSecondaryMenuItem render={<Link to="/dashboard" />}>
  Dashboard
</SidebarSecondaryMenuItem>
```

## Collapsed mode

Author both the `SidebarSecondaryContent` (section list) and the
`SidebarSecondaryCollapsedBreadcrumb`. Visibility is toggled by the panel's
`expanded` state via CSS — both stay in the DOM, so the breadcrumb is
SSR-present and no JS branch is needed.

## Spec Files

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link              |
| `anatomy.yaml`     | Root, parts, layout, states                                       |
| `api.yaml`         | Framework-agnostic contract + framework adapters                  |
| `tokens.yaml`      | `--ui-sidebar-secondary-*` token references                       |
| `behavior.md`      | Given/When/Then behavior scenarios                                |
| `accessibility.md` | ARIA roles, keyboard map, screen-reader and contrast requirements |

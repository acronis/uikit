# Breadcrumb

Displays a hierarchical navigation path showing the user's current location and
offering quick navigation back through the page hierarchy. Built as a set of
composable parts so the trail's structure stays explicit in markup.

## When to Use

- Show the user's position in a multi-level navigation hierarchy.
- Provide quick navigation back to parent pages.
- Orient users who arrive via deep links or search results.

## When NOT to Use

- **Flat navigation** with no hierarchy — breadcrumbs add no value.
- **Single-level pages** with no parent to navigate to.
- **Step-by-step wizards** — use a Stepper.
- **Sibling/tab navigation** — breadcrumbs express hierarchy, not siblings.

## Parts

| Part                  | Element                                | Role                                       |
| --------------------- | -------------------------------------- | ------------------------------------------ |
| `Breadcrumb`          | `<nav aria-label="breadcrumb">`        | Navigation landmark wrapping the trail     |
| `BreadcrumbList`      | `<ol>`                                 | Horizontal, wrapping list of items         |
| `BreadcrumbItem`      | `<li>`                                 | A single entry                             |
| `BreadcrumbLink`      | `<a>` (polymorphic via `render`)       | Interactive link to a parent page          |
| `BreadcrumbPage`      | `<span aria-current="page">`           | The current page (non-link, always last)   |
| `BreadcrumbSeparator` | `<li aria-hidden>`                     | Divider between items (chevron by default) |
| `BreadcrumbEllipsis`  | `<span aria-hidden>` + `sr-only` label | Stands in for collapsed middle items       |

## Quick Examples

### React

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@acronis-platform/ui-react';

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

Render a breadcrumb link as a router link via the `render` prop:

```tsx
<BreadcrumbLink render={<Link to="/products" />}>Products</BreadcrumbLink>
```

## Truncation

Truncation is author-driven: collapse the middle items yourself and drop a
`BreadcrumbEllipsis` (optionally wrapped in a dropdown/menu) in their place. The
first and last items should stay visible.

## Spec Files

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link              |
| `anatomy.yaml`     | Root, parts, layout, pseudo-states                                |
| `api.yaml`         | Framework-agnostic contract + framework adapters                  |
| `tokens.yaml`      | `--ui-breadcrumb-*` token references                              |
| `behavior.md`      | Given/When/Then behavior scenarios                                |
| `accessibility.md` | ARIA roles, keyboard map, screen-reader and contrast requirements |

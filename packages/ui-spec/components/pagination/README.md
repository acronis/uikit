# Pagination

Navigation for paged content — previous / next controls, numbered page links with
a current-page marker, and an ellipsis for skipped ranges. Markup-only; you wire
the navigation and decide the active page.

> Design-pending v1, ported from the legacy shadcn-uikit `pagination`.

## When to use

- Splitting a long list/table across pages with direct page access.

## When not to use

- Inside a `DataTable` — use its built-in `DataTablePagination`.
- Continuous loading — use infinite scroll / a "Load more" button.

## Parts

| Export               | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `Pagination`         | The `<nav>` landmark.                            |
| `PaginationContent`  | The `<ul>` row of items.                         |
| `PaginationItem`     | An `<li>` wrapper.                               |
| `PaginationLink`     | A page link (`isActive` marks the current page). |
| `PaginationPrevious` | Previous-page control (chevron).                 |
| `PaginationNext`     | Next-page control (chevron).                     |
| `PaginationEllipsis` | A skipped-range indicator.                       |

## Example

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@acronis-platform/ui-react';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>;
```

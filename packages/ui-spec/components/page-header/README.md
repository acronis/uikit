# PageHeader

The page header region — an optional breadcrumb, a title row (title left, actions
right), and an optional description. Mapped to the shadcn-uikit Figma (node
`2850-701`).

## When to use

- The top of a page's content area, under the App Shell header.

## When not to use

- The app-wide top bar — that's `AppShellHeader` (global search + account).

## Parts

| Export                  | Element | Purpose                         |
| ----------------------- | ------- | ------------------------------- |
| `PageHeader`            | `div`   | The banner region.              |
| `PageHeaderBreadcrumb`  | `nav`   | Optional breadcrumb (muted).    |
| `PageHeaderRow`         | `div`   | Title + actions row.            |
| `PageHeaderTitle`       | `h1`    | The page title.                 |
| `PageHeaderDescription` | `p`     | Optional muted supporting text. |
| `PageHeaderActions`     | `div`   | Trailing action buttons.        |

## Example

```tsx
<PageHeader>
  <PageHeaderBreadcrumb>Home / Reports</PageHeaderBreadcrumb>
  <PageHeaderRow>
    <PageHeaderTitle>Reports</PageHeaderTitle>
    <PageHeaderActions>
      <Button>New report</Button>
    </PageHeaderActions>
  </PageHeaderRow>
  <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
</PageHeader>
```

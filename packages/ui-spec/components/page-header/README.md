# PageHeader

The page header region — a title row (title left, an optional edit icon-button,
a tags slot, an actions slot) and an optional description row, capped at
512px. Mapped to the ui-react Figma "PageHeader" master component (node
`2905-7678`).

## When to use

- The top of a page's content area, under the App Shell header.

## When not to use

- The app-wide top bar — that's `AppShellChatContentHeader` (global search +
  account).
- A breadcrumb trail — that's a separate `Breadcrumb` rendered as a sibling
  above PageHeader, not one of its parts.

## Parts

| Export                     | Element | Purpose                                                                                                                                                         |
| -------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PageHeader`               | `div`   | The banner region.                                                                                                                                              |
| `PageHeaderRow`            | `div`   | Title row: title, optional edit button, tags, actions.                                                                                                          |
| `PageHeaderTitle`          | `h1`    | The page title.                                                                                                                                                 |
| `PageHeaderTags`           | `div`   | Optional tags slot (e.g. `Tag` chips). Collapses to the first tag + a "+#" tag (hover tooltip lists the hidden labels) when the full set doesn't fit.           |
| `PageHeaderActions`        | `div`   | Trailing action buttons. Secondary-variant buttons collapse under a "More" `ButtonIcon` dropdown when the full set doesn't fit; primary buttons never collapse. |
| `PageHeaderDescriptionRow` | `div`   | Optional description row (max 512px).                                                                                                                           |
| `PageHeaderDescription`    | `p`     | Muted supporting text.                                                                                                                                          |

## Example

```tsx
<PageHeader>
  <PageHeaderRow>
    <PageHeaderTitle>Reports</PageHeaderTitle>
    <PageHeaderTags>
      <Tag variant="info">Customer</Tag>
    </PageHeaderTags>
    <PageHeaderActions>
      <Button>New report</Button>
    </PageHeaderActions>
  </PageHeaderRow>
  <PageHeaderDescriptionRow>
    <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
  </PageHeaderDescriptionRow>
</PageHeader>
```

### Editable title/description (full-page wizards)

```tsx
<PageHeaderRow>
  <PageHeaderTitle>Untitled dashboard</PageHeaderTitle>
  <ButtonIcon variant="secondary" aria-label="Edit title">
    <PencilIcon size={16} />
  </ButtonIcon>
</PageHeaderRow>
```

### With a breadcrumb

```tsx
<div className="flex flex-col gap-2">
  <Breadcrumb>{/* ... */}</Breadcrumb>
  <PageHeader>{/* ... */}</PageHeader>
</div>
```

# CardSection

A band of content stacked inside a `Card`'s body, below `CardHeader`. Where
`Card` owns the surface and the card-level header/footer, `CardSection` divides
the body into labelled bands — a tag row here, a key-value list there, a flush
table below — each with an optional 14px mini-header and an optional divider.

## When to use

- A card body that holds **several distinct groupings** that each deserve their
  own small label (e.g. "Network details", "Labels", "Subnets").
- A card that needs a **table running edge-to-edge** inside it — the
  `table-actions` variant drops the horizontal inset for exactly this.
- A card that **nests another card**, on either the primary or the secondary
  surface (`card-primary` / `card-secondary`).

## When not to use

- A card with a single, undifferentiated body. Put the content straight in
  `CardContent` — a lone section adds a wrapper and no meaning.
- As a page-level section. This is card chrome; use `Section` for page
  structure.
- As a standalone surface. `CardSection` paints no background of its own and
  relies on the enclosing card's surface and inset rhythm.

## Parts

| Part            | Element | Notes                                                                                 |
| --------------- | ------- | ------------------------------------------------------------------------------------- |
| `root`          | `div`   | Flex column, 12px gap. Inset (`px-4 pt-4`) for every variant except `table-actions`.  |
| `header`        | `div`   | Optional, shown by `hasHeader`. Re-applies the inset under `table-actions`.           |
| `title`         | `p`     | 14px medium, truncating. Required whenever `hasHeader` is set.                        |
| `extras`        | slot    | Inline after the title.                                                               |
| `actions`       | slot    | End of the header row.                                                                |
| `content`       | `div`   | Body of `variant="slot"` — arbitrary passthrough.                                     |
| `content-tag`   | `div`   | Body of `variant="tag"` — wrapping tag row; no built-in default.                      |
| `content-list`  | `div`   | Body of `variant="list"` — title/description rows; no built-in default.               |
| `content-table` | `div`   | Body of `variant="table-actions"` — flush table with row actions.                     |
| `nested-card`   | `div`   | Body of `card-primary` / `card-secondary` — a nested `Card` composed from `children`. |

## Examples

Stacked sections in one card body — every section but the last draws a divider:

```tsx
<Card>
  <CardHeader title="Workload" />
  <CardContent className="p-0 pb-4">
    <CardSection
      variant="list"
      hasHeader
      title="Network details"
      hasBottomBorder
      contentList={rows}
    />
    <CardSection variant="tag" hasHeader title="Labels" contentTag={tags} />
  </CardContent>
</Card>
```

A flush table with header actions:

```tsx
<CardSection
  variant="table-actions"
  hasHeader
  title="Subnets"
  actions={
    <ButtonIcon variant="ghost" aria-label="More">
      <EllipsisIcon size={16} />
    </ButtonIcon>
  }
  contentTable={<SubnetsTable />}
/>
```

A nested card on the secondary surface — compose the nested card from `Card`'s
own parts:

```tsx
<CardSection variant="card-secondary" hasHeader title="Retention">
  <CardHeader title="Policy" />
  <CardContent>Keep daily backups for 30 days.</CardContent>
</CardSection>
```

## Notes

- **`hasHeader` requires `title`.** The two props are a discriminated union in
  React, so turning the header on without a title (or passing a title with no
  header) fails to compile rather than rendering a blank row.
- **`card-primary` vs. `card-secondary`** differ in exactly one thing: the
  nested card's surface token. Pick by how much the nested card should recede
  from the parent surface.
- **The `list` variant has no default rows.** Figma's `ListItem` fallback
  references `--ui-card-body-section-item-*` variables that do not exist in
  `@acronis-platform/design-tokens`; rather than hardcode those values, the
  variant ships empty and the consumer supplies `contentList`. Once the design
  team lands that token tier, a default row rendering can follow.
- **The default tag row is example content.** Replace it with real, localized
  tags via `contentTag` before shipping.

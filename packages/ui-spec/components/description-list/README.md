# DescriptionList

A key/value data list — rows of `label → value`, where the value can be plain
text, a status (icon + value + muted description), or action links.

> Built from the Cyber-Compliance "Service status" design
> ([node 3001-20448](https://www.figma.com/design/hc8FRfvlHBqZwNYUsD0DaX/Cyber-Compliance?node-id=3001-20448)).
> Composes the shared semantic tokens — no `--ui-description-list-*` tier.

## When to use

- Showing the properties / status of an entity (in a Sheet detail panel, a card,
  a dashboard widget).
- Replacing an ad-hoc `<dl>` grid — e.g. the `SheetDetails` / `sheet-detail-panel`
  property list.

## When not to use

- Tabular data with many rows/columns — use `Table` / `DataTable`.
- A single stat — use `CardFilter` or plain text.

## Parts

| Part                              | Element | Purpose                                    |
| --------------------------------- | ------- | ------------------------------------------ |
| `DescriptionList`                 | dl      | The list container.                        |
| `DescriptionListItem`             | div     | A row (label + value), full-bleed divider. |
| `DescriptionListLabel`            | dt      | The key (left column).                     |
| `DescriptionListValue`            | dd      | The value (right column); icon + content.  |
| `DescriptionListValueDescription` | p       | Muted secondary line under the value.      |
| `DescriptionListActions`          | div     | A row of action links within a value.      |

## Example

```tsx
<DescriptionList>
  <DescriptionListItem>
    <DescriptionListLabel>Backup</DescriptionListLabel>
    <DescriptionListValue>
      <CircleCheckIcon className="text-[var(--ui-text-on-status-success)]" />
      <div>
        Success
        <DescriptionListValueDescription>
          150GB of data backed up successfully
        </DescriptionListValueDescription>
      </div>
    </DescriptionListValue>
  </DescriptionListItem>
</DescriptionList>
```

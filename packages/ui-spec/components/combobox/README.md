# Combobox

A searchable select: a typeable input that filters a list of items in a dropdown.
Built on Base UI's Combobox primitive and themed with the `--ui-input-select-*`
tokens, so it matches `InputSelect` (the non-searchable sibling).

> **Design-pending v1.** The legacy shadcn-uikit `combobox` was only a hardcoded
> Popover + cmdk demo; this is a real, reusable component built on Base UI. There
> is no `--ui-combobox-*` tier yet — it borrows InputSelect's.

## When to use

- Choosing one (or more) options from a list long enough to need filtering.

## When not to use

- A short, fixed option set with no need to search — use `InputSelect`.
- Free-text entry with optional suggestions — use an autocomplete (future).

## Parts

| Export               | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `Combobox`           | Root — holds `items` + value; filters by the input.              |
| `ComboboxInput`      | The field box — typeable input + clear (✕) + chevron trigger.    |
| `ComboboxContent`    | The portaled dropdown surface.                                   |
| `ComboboxList`       | The list; children may be a function mapped over filtered items. |
| `ComboboxItem`       | One option (trailing check when selected).                       |
| `ComboboxEmpty`      | The "no results" message.                                        |
| `ComboboxGroup`      | An optional group of items.                                      |
| `ComboboxGroupLabel` | A group heading.                                                 |

## Example

```tsx
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from '@acronis-platform/ui-react';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'astro', label: 'Astro' },
];

<Combobox items={frameworks}>
  <ComboboxInput placeholder="Search framework…" clearable />
  <ComboboxContent>
    <ComboboxEmpty>No framework found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item.value} value={item}>
          {item.label}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>;
```

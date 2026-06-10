# Search

A search field — a text input with a leading magnifier and a clear (×) button
that appears once there's a value. Use it to find or filter content (e.g.
filtering a table, or global search).

## When to Use

- Filter or find within a dataset, list, or table.
- A global search entry point.

## When NOT to Use

- **A general single-value text field** — use Input.
- **Choosing from a fixed set** — use a select / combobox.

## Parts

| Part  | Element                              | Role                                           |
| ----- | ------------------------------------ | ---------------------------------------------- |
| (box) | `<div>`                              | Bordered container; owns the focus-within ring |
| icon  | leading magnifier (`SearchIcon`)     | Decorative affordance                          |
| input | `<input type="search">`              | The query field (role `searchbox`)             |
| clear | `<button aria-label="Clear search">` | Empties the field; shown when there's a value  |

## States

| State    | How           | Visual                                         |
| -------- | ------------- | ---------------------------------------------- |
| Idle     | default       | Idle border, magnifier + placeholder           |
| Hover    | pointer hover | `--ui-form-border-hover`                       |
| Focus    | input focus   | Active border + 3px `--ui-focus-primary` ring  |
| Filled   | has a value   | Value text + clear (×) button                  |
| Disabled | `disabled`    | Faint tokens; no clear button; not interactive |

## Quick Example

### React

```tsx
import { Search } from '@acronis-platform/ui-react';

function TableFilter() {
  const [query, setQuery] = useState('');
  return (
    <Search
      placeholder="Search table"
      aria-label="Search table"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onClear={() => setQuery('')}
    />
  );
}
```

## Spec Files

| File               | Contents                                                    |
| ------------------ | ----------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link        |
| `anatomy.yaml`     | Root, icon / input / clear parts, states                    |
| `api.yaml`         | Framework-agnostic contract + framework adapters            |
| `tokens.yaml`      | `--ui-form-*` + focus-ring token references                 |
| `behavior.md`      | Given/When/Then behavior scenarios                          |
| `accessibility.md` | ARIA, keyboard map, screen-reader and contrast requirements |

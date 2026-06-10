# Select

A form control that shows the current selection and reveals a list of
predefined options when activated. Single or multiple selection.

## When to use

- Choosing from a list of predefined options when screen space is limited.
- Single selection (default) or multiple selection (`multiple`).

## When not to use

- A small number of options that should stay visible — use radio buttons
  (single) or checkboxes (multiple) instead.
- Free-text entry or filtering a large/remote dataset — use an input or a
  combobox/autocomplete pattern.

## Anatomy

A composable set of parts:

| Part               | Element    | Role       | Purpose                             |
| ------------------ | ---------- | ---------- | ----------------------------------- |
| `Select`           | — (no DOM) | —          | Owns open + selection state.        |
| `SelectTrigger`    | `button`   | `combobox` | The control; opens the popup.       |
| `SelectValue`      | `span`     | —          | Selected label or placeholder.      |
| `SelectContent`    | `div`      | `listbox`  | Floating options panel (portaled).  |
| `SelectItem`       | `div`      | `option`   | A single option (+ selected check). |
| `SelectGroup`      | `div`      | `group`    | Optional labelled section.          |
| `SelectGroupLabel` | `div`      | —          | Heading for a group.                |

## Examples

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@acronis-platform/ui-react';

// Pass `items` so the trigger can show the selected option's label while closed.
<Select items={{ apple: 'Apple', banana: 'Banana' }} defaultValue="apple">
  <SelectTrigger aria-label="Fruit">
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>;
```

Controlled:

```tsx
<Select value={fruit} onValueChange={setFruit} items={items}>
  …
</Select>
```

Grouped options use `SelectGroup` + `SelectGroupLabel`. Label, description, and
error messaging are composed by the consumer (a Field component is future work).

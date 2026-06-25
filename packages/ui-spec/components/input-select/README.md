# InputSelect

The next-gen select **field**: a label (with an optional required marker), a trigger
box showing the value / placeholder and a chevron, an optional description or error,
and a floating dropdown with an in-dropdown search, sections, single- or
multiple-selectable items, and loading / empty / error status. It composes Base UI
`Select` and the `--ui-input-select-*` token tier.

> `Select` is an alias of this family (re-pointed off the deleted `--ui-form-*` tier).
> Prefer importing `InputSelect*` directly in new code.

## When to use

- Choosing one (or several, with `multiple`) options from a list, with full field
  furniture (label / description / error) and optional in-dropdown search / grouping /
  status.

## When not to use

- For a free-text field — use `InputText`; for a search box — use `Search` /
  `InputSearch`.
- For a small fixed set shown inline — consider `Radio` (single) or `Checkbox` group.
- The nested **tenant-tree** picker (Recent/Browse, collapsible tenant items) is a
  separate follow-up component.

## Examples

```tsx
import {
  InputSelect,
  InputSelectField,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
  InputSelectContent,
  InputSelectSearch,
  InputSelectSection,
  InputSelectSectionLabel,
  InputSelectItem,
  InputSelectDescription,
  InputSelectError,
  InputSelectStatus,
} from '@acronis-platform/ui-react';

<InputSelect
  items={{ apple: 'Apple', banana: 'Banana' }}
  value={fruit}
  onValueChange={setFruit}
>
  <InputSelectField>
    <InputSelectLabel required>Fruit</InputSelectLabel>
    <InputSelectTrigger>
      <InputSelectValue placeholder="Select an option" />
    </InputSelectTrigger>
    <InputSelectDescription>Pick your favourite</InputSelectDescription>
  </InputSelectField>
  <InputSelectContent>
    <InputSelectSection>
      <InputSelectSectionLabel>Fruits</InputSelectSectionLabel>
      <InputSelectItem value="apple">Apple</InputSelectItem>
      <InputSelectItem value="banana">Banana</InputSelectItem>
    </InputSelectSection>
  </InputSelectContent>
</InputSelect>;

// Multiple selection
<InputSelect multiple value={tags} onValueChange={setTags}>
  …
</InputSelect>;

// Empty status instead of items
<InputSelectContent>
  <InputSelectStatus variant="empty">No data found</InputSelectStatus>
</InputSelectContent>;
```

## Parts

| Part                      | Element    | Description                                                       |
| ------------------------- | ---------- | ----------------------------------------------------------------- |
| `InputSelectField`        | `<div>`    | Vertical field stack (label / trigger / description-error).       |
| `InputSelectLabel`        | `<label>`  | Field label (auto-associated); `required` adds `*`.               |
| `InputSelectTrigger`      | `<button>` | The combobox box; `aria-invalid` switches to the error look.      |
| `InputSelectValue`        | `<span>`   | Selected label or placeholder.                                    |
| `InputSelectContent`      | `<div>`    | The floating listbox popup.                                       |
| `InputSelectSearch`       | `<div>`    | In-dropdown filter row (presentational).                          |
| `InputSelectSection`      | `<div>`    | A labelled group of items.                                        |
| `InputSelectSectionLabel` | `<div>`    | The group heading.                                                |
| `InputSelectItem`         | `<div>`    | An option; trailing check (single) / leading checkbox (multiple). |
| `InputSelectDescription`  | `<p>`      | Helper text (normal state).                                       |
| `InputSelectError`        | `<p>`      | Error message; replaces the description.                          |
| `InputSelectStatus`       | `<div>`    | Loading / empty / error row shown instead of items.               |

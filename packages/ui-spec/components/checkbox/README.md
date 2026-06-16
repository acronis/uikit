# Checkbox

A control that lets users select or deselect an option. Use it for a single
binary choice (on/off) or in a group where users may select any number of
options — including none. Supports an **indeterminate** state for a parent that
summarizes a partially-selected group.

## When to Use

- A single on/off choice (e.g. "I accept the terms").
- A list of non-exclusive options where any combination may be selected.
- A "select all" parent that reflects a partial selection (indeterminate).

## When NOT to Use

- **Mutually exclusive** choices — use a radio group.
- **On/off that applies immediately** (a setting toggle) — use a Switch.
- **A single action** — use a Button.

## Quick Examples

### React

```tsx
import { Checkbox } from '@acronis-platform/ui-react';

function Terms() {
  const [accepted, setAccepted] = useState(false);
  return (
    <Checkbox
      label="I accept the terms"
      description="You agree to the privacy policy."
      checked={accepted}
      onCheckedChange={setAccepted}
    />
  );
}
```

Pass `label` (and optional `description`) to compose the full field — the whole
row becomes clickable and the box is wired to the text for accessibility. Omit
them for a bare box, and name it with `aria-label`:

```tsx
<Checkbox aria-label="Select all" indeterminate />
```

## States

| State         | How                           | Visual                             |
| ------------- | ----------------------------- | ---------------------------------- |
| Unchecked     | default                       | Idle border, no glyph              |
| Checked       | `checked` / `default-checked` | Active fill + check glyph          |
| Indeterminate | `indeterminate`               | Active fill + minus glyph, `mixed` |
| Disabled      | `disabled`                    | Disabled tokens; not interactive   |

## Spec Files

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link              |
| `anatomy.yaml`     | Root, container/content/label/description/indicator parts, states |
| `api.yaml`         | Framework-agnostic contract + framework adapters                  |
| `tokens.yaml`      | `--ui-checkbox-*` token references                                |
| `behavior.md`      | Given/When/Then behavior scenarios                                |
| `accessibility.md` | ARIA roles, keyboard map, screen-reader and contrast requirements |

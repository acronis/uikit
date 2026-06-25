# InputTextArea

A multiline text field for entering and editing longer free-text — notes,
comments, descriptions, and other multi-line content. It grows with vertical
resize. Pair it with a clear label and, when validation fails, an associated
error message.

## When to Use

- Collect a longer, multi-line value (notes, comments, descriptions, …).
- Any free-text where line breaks are expected.

## When NOT to Use

- **Single short value** (name, email, URL) — use an Input.
- **Choosing from a fixed set** — use a select / combobox / radio group.
- **Binary on/off** — use a checkbox or switch.

## States

| State    | How                      | Visual                                                              |
| -------- | ------------------------ | ------------------------------------------------------------------- |
| Idle     | default                  | Idle border, idle fill                                              |
| Hover    | pointer hover            | `border-color-hover` + `box-color-hover`                            |
| Focus    | focus                    | `border-color-focus` + 3px `--ui-focus-primary` ring                |
| Error    | `error` / `aria-invalid` | Red `error-msg-box-border-color-*` border + `--ui-focus-error` ring |
| Disabled | `disabled`               | Faint fill/border, muted text, not interactive                      |

## Quick Examples

### React

```tsx
import { InputTextArea } from '@acronis-platform/ui-react';

function BioField() {
  const [bio, setBio] = useState('');
  return (
    <InputTextArea
      label="Bio"
      description="Shown on your profile"
      placeholder="Tell us about yourself"
      value={bio}
      onChange={(e) => setBio(e.target.value)}
    />
  );
}
```

Error state — `error` switches the field to the error treatment (red border +
red message replacing the description):

```tsx
<InputTextArea
  label="Comment"
  value={value}
  error="Comment must be at least 20 characters."
  onChange={onChange}
/>
```

## Spec Files

| File               | Contents                                                    |
| ------------------ | ----------------------------------------------------------- |
| `index.yaml`       | Identity, status, category                                  |
| `anatomy.yaml`     | Root element/role, pseudo + prop states                     |
| `api.yaml`         | Framework-agnostic contract + framework adapters            |
| `tokens.yaml`      | `--ui-input-text-area-*` + focus-ring token references      |
| `behavior.md`      | Given/When/Then behavior scenarios                          |
| `accessibility.md` | ARIA, keyboard map, screen-reader and contrast requirements |

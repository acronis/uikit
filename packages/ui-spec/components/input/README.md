# Input

A single-line text field for entering and editing one value — names, email
addresses, search terms, and other short free-text. Pair it with a clear label
and, when validation fails, an associated error message.

## When to Use

- Collect a single short value (name, email, URL, number, …).
- Inline search or filter fields.

## When NOT to Use

- **Multi-line text** — use a textarea.
- **Choosing from a fixed set** — use a select / combobox / radio group.
- **Binary on/off** — use a checkbox or switch.

## States

| State    | How            | Visual                                          |
| -------- | -------------- | ----------------------------------------------- |
| Idle     | default        | Idle border, white fill                         |
| Hover    | pointer hover  | `--ui-form-border-hover`                        |
| Focus    | focus          | Active border + 3px `--ui-focus-primary` ring   |
| Error    | `aria-invalid` | Error border + `--ui-focus-error` ring on focus |
| Disabled | `disabled`     | Faint fill/border, muted text, not interactive  |

## Quick Examples

### React

```tsx
import { Input } from '@acronis-platform/ui-react';

function EmailField() {
  const [email, setEmail] = useState('');
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="email">Email</label>
      <Input
        id="email"
        type="email"
        placeholder="name@acronis.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
}
```

Error state:

```tsx
<Input id="pwd" type="password" aria-invalid aria-describedby="pwd-error" />
<p id="pwd-error">Password is too short.</p>
```

> Label, description, and error message are composed by the consumer today; a
> `Field` component that wires them together (label, `aria-describedby`,
> required marker) is planned.

## Spec Files

| File               | Contents                                                    |
| ------------------ | ----------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, Figma link                      |
| `anatomy.yaml`     | Root element/role, pseudo + prop states                     |
| `api.yaml`         | Framework-agnostic contract + framework adapters            |
| `tokens.yaml`      | `--ui-form-*` + focus-ring token references                 |
| `behavior.md`      | Given/When/Then behavior scenarios                          |
| `accessibility.md` | ARIA, keyboard map, screen-reader and contrast requirements |

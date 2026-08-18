# Chip

A compact, interactive label — a removable token, a selectable toggle, or an
operational action.

## When to use

- **Removable:** represent a dismissible selection — applied filters, recipients,
  uploaded files, entered tags. The × lets the user drop one.
- **Selectable:** offer a small, toggleable choice — filter/quick-pick chips,
  multi-select option pills.
- **Operational:** offer a small inline action that sits in a row of chips —
  "Add filter", "Clear all", "Show 3 more". Its strong-link label marks it as
  the actionable one among neighbouring chips.

## When not to use

- For a **static**, non-interactive status/category label, use
  [`Tag`](../tag/README.md) instead — Chip implies an action (remove or toggle).
- For a primary action, use `Button`. For a binary setting, use `Switch` or
  `Checkbox`.

## Parts

| Part     | Element  | Notes                                                                                  |
| -------- | -------- | -------------------------------------------------------------------------------------- |
| `root`   | `div`    | The pill. `selectable` becomes a `role="button"` toggle, `operational` a plain button. |
| `icon`   | `svg`    | Optional leading icon (16px), tinted by the icon token.                                |
| `label`  | text     | Children; truncates with an ellipsis. Semibold + blue for `operational`.               |
| `remove` | `button` | Trailing × (`removable` only); emits `remove` / `onRemove`.                            |

## Examples

```tsx
import { Chip } from '@acronis-platform/ui-react';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

// Removable filter token
<Chip onRemove={() => removeFilter(id)}>Status: Active</Chip>

// Selectable (controlled) toggle
<Chip variant="selectable" selected={on} onClick={() => setOn(!on)}>
  Only my devices
</Chip>

// With a leading icon
<Chip variant="selectable" icon={<CircleInfoIcon />}>Info</Chip>

// Operational — an inline action among the chips
<Chip variant="operational" onClick={addFilter}>Add filter</Chip>
```

## Notes

- Selection and removal are **controlled** — Chip renders the visual state and
  emits intent; the consumer owns the data.
- Theming is driven entirely by the `--ui-chip-*` token tier; the focus ring
  reuses `--ui-focus-primary`.

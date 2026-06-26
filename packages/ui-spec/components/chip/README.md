# Chip

A compact, interactive label — a removable token or a selectable toggle.

## When to use

- **Removable:** represent a dismissible selection — applied filters, recipients,
  uploaded files, entered tags. The × lets the user drop one.
- **Selectable:** offer a small, toggleable choice — filter/quick-pick chips,
  multi-select option pills.

## When not to use

- For a **static**, non-interactive status/category label, use
  [`Tag`](../tag/README.md) instead — Chip implies an action (remove or toggle).
- For a primary action, use `Button`. For a binary setting, use `Switch` or
  `Checkbox`.

## Parts

| Part     | Element  | Notes                                                       |
| -------- | -------- | ----------------------------------------------------------- |
| `root`   | `div`    | The pill. `selectable` becomes a `role="button"` toggle.    |
| `icon`   | `svg`    | Optional leading icon (16px), tinted by the icon token.     |
| `label`  | text     | Children; truncates with an ellipsis.                       |
| `remove` | `button` | Trailing × (`removable` only); emits `remove` / `onRemove`. |

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
```

## Notes

- Selection and removal are **controlled** — Chip renders the visual state and
  emits intent; the consumer owns the data.
- Theming is driven entirely by the `--ui-chips-*` token tier; the focus ring
  reuses `--ui-focus-primary`.

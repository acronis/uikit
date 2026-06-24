# ButtonMenu

A button that opens a dropdown menu: a label followed by a chevron that points up
while the menu is open. Two visual styles — `primary` (solid) and `secondary`
(bordered) — across idle, hover, open, and disabled states.

## When to use

- A control whose primary job is to **open a menu** of actions or options, where
  the current selection isn't shown on the button itself.

## When not to use

- A plain action with no menu — use **Button**.
- A form control for picking one option from a list (showing the chosen value) —
  use **Select**.
- An icon-only trigger with no label — use **ButtonIcon**.

## Example (React — implemented)

```tsx
import { ButtonMenu } from '@acronis-platform/ui-react';

const [open, setOpen] = useState(false);

<ButtonMenu open={open} onClick={() => setOpen((v) => !v)}>
  Actions
</ButtonMenu>;

// Bordered treatment
<ButtonMenu variant="secondary">Actions</ButtonMenu>;
```

Keep `open` in sync with the menu the button controls so the chevron and
`aria-expanded` reflect the real state. Use the `render` prop to compose it as a
Base UI menu trigger. Vue and Web Component implementations are planned against
the same contract.

## Parts

| Part    | Element  | Notes                                                  |
| ------- | -------- | ------------------------------------------------------ |
| `root`  | `button` | The button surface; reflects `aria-expanded` when open |
| `label` | `span`   | Text content, rendered before the chevron              |
| `icon`  | `svg`    | Trailing chevron — down when closed, up when open      |

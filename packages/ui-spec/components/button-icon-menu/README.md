# ButtonIconMenu

The kebab ("more options") trigger: a 32×32 bordered icon-only button holding a
fixed 16px ellipsis glyph, across idle, hover, open, disabled, and focus states.

It is the same surface as **ButtonIcon**'s `secondary` variant — the design draws
it from the same `--ui-button-icon-*` tokens — with the ellipsis glyph pinned and
menu-trigger semantics added.

## When to use

- A row, card, or toolbar needs a **menu of secondary actions** and there is no
  room for a label.

## When not to use

- The trigger can carry a label — use **ButtonMenu**, which shows the label and a
  chevron.
- The action is a single command, not a menu — use **ButtonIcon**.
- The glyph must be something other than the ellipsis — use **ButtonIcon** (this
  component pins the glyph on purpose, so every kebab in the product looks the
  same).
- Picking one option from a list, showing the chosen value — use **Select**.

## Example (React — implemented)

```tsx
import { ButtonIconMenu } from '@acronis-platform/ui-react';

const [open, setOpen] = useState(false);

<ButtonIconMenu
  ariaLabel="Row actions"
  open={open}
  onClick={() => setOpen((v) => !v)}
/>;
```

Composed as a real Base UI menu trigger:

```tsx
import { DropdownMenu, ButtonIconMenu } from '@acronis-platform/ui-react';

<DropdownMenu>
  <DropdownMenuTrigger render={<ButtonIconMenu ariaLabel="Row actions" />} />
  <DropdownMenuContent>{/* items */}</DropdownMenuContent>
</DropdownMenu>;
```

Keep `open` in sync with the menu the button controls so the active treatment and
`aria-expanded` reflect the real state. Vue and Web Component implementations are
planned against the same contract.

## Parts

| Part   | Element  | Notes                                                                   |
| ------ | -------- | ----------------------------------------------------------------------- |
| `root` | `button` | The surface; `aria-haspopup="menu"`, reflects `aria-expanded` when open |
| `icon` | `svg`    | Fixed 16px ellipsis glyph, centered — not swappable                     |

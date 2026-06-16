# ButtonIcon

An icon-only button: 32×32 with a single 16px glyph and
idle/hover/active/disabled states. Two variants share the same fill and icon
colors — `ghost` (borderless, the default) and `secondary` (a 1px container
border).

## When to use

- A compact action represented by an icon alone (e.g. a toolbar action) where a
  text label would be redundant or there's no room for one.

## When not to use

- An action that needs a text label — use **Button** (it also sizes a leading
  icon).
- A toggle — use a toggle/switch control.

## Example (React — implemented)

```tsx
import { ButtonIcon } from '@acronis-platform/ui-react';
import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';

<ButtonIcon aria-label="Add">
  <PlusIcon />
</ButtonIcon>;

// Bordered treatment
<ButtonIcon variant="secondary" aria-label="Add">
  <PlusIcon />
</ButtonIcon>;
```

Always provide an `aria-label` — the control has no text. Vue and Web Component
implementations are planned against the same contract.

# ButtonIconInput

A smaller icon-only button (20×20, 16px glyph) meant to live inside an input's
box — e.g. `InputPassword`'s show/hide toggle. `variant` (`normal` / `error`)
mirrors the tone of the field it's embedded in.

## When to use

- An affordance embedded inside a text field's box (reveal/hide password,
  clear, etc.) that needs to visually match the field's current tone.

## When not to use

- A standalone icon-only action outside an input — use **ButtonIcon** (32×32).
- An action that needs a text label — use **Button**.

## Example (React — implemented)

```tsx
import { ButtonIconInput } from '@acronis-platform/ui-react';
import { EyeIcon } from '@acronis-platform/icons-react/stroke-mono';

<ButtonIconInput aria-label="Show password">
  <EyeIcon />
</ButtonIconInput>;

// Error tone, matching a field in its error state
<ButtonIconInput variant="error" aria-label="Show password">
  <EyeIcon />
</ButtonIconInput>;
```

Always provide an `aria-label` — the control has no text. Vue and Web Component
implementations are planned against the same contract.

## Parts

| Part   | Element    | Description                                    |
| ------ | ---------- | ---------------------------------------------- |
| `root` | `<button>` | The 20×20 button surface (background, radius). |
| `icon` | `<svg>`    | The single glyph, sized to 16px.               |

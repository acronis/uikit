# Button

Triggers an action or event. Five styles — `default` (Primary), `secondary`,
`ghost`, `destructive`, `ai` — in a single 32px-tall size.

## When to use

- A user-initiated action: submit, save, cancel, open a dialog, run a command.

## When not to use

- Navigation to another page that should be a real link — compose with the
  `render` prop so it renders an `<a>` (keeps link semantics), or use a link.
- An icon-only control — use **ButtonIcon**.

## Example (React — implemented)

```tsx
import { Button } from '@acronis-platform/ui-react';

<Button variant="default" onClick={onSave}>Save changes</Button>
<Button variant="destructive" disabled>Delete</Button>
```

Vue and Web Component implementations are planned and will target the same
contract — see `api.yaml` `adapters`.

## AI variant

`variant="ai"` is special:

- The icon is **optional** (hidden by default). Pass an icon explicitly when
  needed:

  ```tsx
  <Button variant="ai">Ask AI</Button>
  <Button variant="ai"><SparklesIcon /> Ask AI</Button>
  ```

- Its background is the `--ui-button-ai-container-color-*` gradient, which runs
  **top-to-bottom** and covers the full button (including the transparent 1px
  border box).

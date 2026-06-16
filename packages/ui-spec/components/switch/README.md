# Switch

A binary on/off toggle whose change takes effect immediately.

## When to use

- Toggling a single setting that applies instantly (e.g. "Enable notifications").

## When not to use

- A choice that only applies after submitting a form — use a checkbox.
- Selecting one of several options — use radios or a segmented control.

## Example (React — implemented)

```tsx
import { Switch } from '@acronis-platform/ui-react';

const [enabled, setEnabled] = useState(false);

{
  /* Bare toggle — name it with aria-label */
}
<Switch aria-label="Wireless" checked={enabled} onCheckedChange={setEnabled} />;

{
  /* With a label — the whole row toggles */
}
<Switch
  label="Enable notifications"
  checked={enabled}
  onCheckedChange={setEnabled}
/>;
```

Pass `label` to compose the full field (the row becomes clickable and the toggle
is named via aria-labelledby); omit it for a bare toggle named with `aria-label`.
Vue and Web Component implementations are planned against the same contract.

## Parts

| Part        | Element  | Notes                                                   |
| ----------- | -------- | ------------------------------------------------------- |
| `root`      | `button` | The track (role `switch`); fill per off/on state        |
| `thumb`     | `span`   | The sliding knob                                        |
| `container` | `label`  | Wraps toggle + label, forwards clicks (only with label) |
| `label`     | `span`   | Label text, names the control                           |

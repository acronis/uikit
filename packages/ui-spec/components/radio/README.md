# Radio

A group of mutually exclusive options where the user selects exactly one.
Selecting an option deselects the previous one. Built from a `RadioGroup`
container (owns the selected value) and `Radio` items.

## When to Use

- Choose exactly one option from a small, visible set (2–7 options).
- The options are mutually exclusive.

## When NOT to Use

- **Multiple selections** (or none) — use checkboxes.
- **Many options** / long lists — use a select / combobox.
- **On/off for a single setting** — use a switch.

## Parts

| Part         | Element                      | Role                                      |
| ------------ | ---------------------------- | ----------------------------------------- |
| `RadioGroup` | `<div role="radiogroup">`    | Owns the selected value; groups the items |
| `Radio`      | `<span role="radio">` (16px) | One option; takes a `value`               |
| (indicator)  | 8px inner dot                | Shown on the selected item                |

## States

| State      | How                          | Visual                                       |
| ---------- | ---------------------------- | -------------------------------------------- |
| Unselected | default                      | Idle border, white fill, no dot              |
| Hover      | pointer hover                | `--ui-form-border-hover`                     |
| Focus      | focus                        | 3px `--ui-focus-primary` ring                |
| Selected   | group `value` === item value | Active fill + border + dot                   |
| Disabled   | `disabled` (group or item)   | Faint fill/border, muted dot, not selectable |

## Quick Example

### React

```tsx
import { RadioGroup, Radio } from '@acronis-platform/ui-react';

function PlanPicker() {
  const [plan, setPlan] = useState('standard');
  return (
    <RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
      <label className="inline-flex items-center gap-2">
        <Radio value="free" /> Free
      </label>
      <label className="inline-flex items-center gap-2">
        <Radio value="standard" /> Standard
      </label>
      <label className="inline-flex items-center gap-2">
        <Radio value="premium" /> Premium
      </label>
    </RadioGroup>
  );
}
```

> Each `Radio` is composed with its label by the consumer today; a `Field`
> component that wires label/description is planned.

## Spec Files

| File               | Contents                                                    |
| ------------------ | ----------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, Figma link                      |
| `anatomy.yaml`     | Root, item + indicator parts, internal value state, states  |
| `api.yaml`         | Framework-agnostic contract + framework adapters            |
| `tokens.yaml`      | `--ui-form-*` + focus-ring token references                 |
| `behavior.md`      | Given/When/Then behavior scenarios                          |
| `accessibility.md` | ARIA, keyboard map, screen-reader and contrast requirements |

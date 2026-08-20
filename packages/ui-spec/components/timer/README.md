# Timer

An elapsed-time readout paired with a hairline-separated cluster of icon-only
actions, in a single bordered 32px box. The readout displays a value the caller
formats; the actions are ButtonGroup items the caller supplies.

## When to use

- A **time-tracking control** in a toolbar, table row, or card header: show the
  elapsed time on a task and offer the two or three actions that operate on it
  (pause, rename, add an entry).
- A **stopwatch or session counter** the user can act on — pause, resume, stop —
  where the count and its controls should read as one compact unit.
- A **read-only duration** that belongs in the same visual family as the
  interactive ones. Omit the actions and the box becomes just the readout.

## When not to use

- **A duration inside prose or a data table cell.** A bordered 32px box next to
  plain text is chrome for nothing; render the formatted string directly.
- **A countdown that must announce itself.** `role="timer"` is deliberately
  silent (`aria-live="off"`) so it doesn't flood a screen reader once a second.
  If a threshold matters, announce that event from a separate status region.
- **Actions unrelated to the time shown.** The shared box claims the readout and
  the actions are one control; unrelated actions belong outside it.
- **Labelled actions.** The cluster is icon-only by design. For text actions
  next to a duration, compose a `Toolbar` with plain `Button`s.
- **As a clock.** The component holds no timer of its own (see Notes).

## Example (React — implemented)

```tsx
import { Timer, ButtonGroupItem } from '@acronis-platform/ui-react';
import {
  CirclePauseIcon,
  PencilIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

<Timer value={formatDuration(elapsed)} actionsLabel="Time tracking">
  <ButtonGroupItem aria-label="Pause" onClick={pause}>
    <CirclePauseIcon size={16} />
  </ButtonGroupItem>
  <ButtonGroupItem aria-label="Rename" onClick={rename}>
    <PencilIcon size={16} />
  </ButtonGroupItem>
  <ButtonGroupItem aria-label="Add entry" onClick={addEntry}>
    <PlusIcon size={16} />
  </ButtonGroupItem>
</Timer>;
```

Read-only — no actions, so no toolbar and no divider:

```tsx
<Timer value="00:12:30" />
```

Vue and Web Component implementations are planned and will target the same
contract — see `api.yaml` `adapters`.

## Parts

| Part      | Element    | Notes                                                                                               |
| --------- | ---------- | --------------------------------------------------------------------------------------------------- |
| container | `div`      | The bordered box. No role — it owns the border, radius, background, height, and the clipping.       |
| `readout` | `div`      | `role="timer"`. The formatted value, in tabular figures.                                            |
| `divider` | _(border)_ | The readout's inline-end border, dropped when there are no actions. Not an element, so not in a11y. |
| `actions` | `div`      | `role="toolbar"` — a `ButtonGroup` in its `inlined` style, holding the caller's `ButtonGroupItem`s. |

## Notes

- **It does not tick.** The component holds no clock and starts no interval: it
  renders whatever `value` it is handed. The caller owns the interval, the
  format, and the state the actions mutate — which is what lets the same
  component serve a stopwatch, a countdown, and a static duration.
- **Formatting is yours too**, including whether hours appear and how the locale
  renders the separators. The readout only guarantees that whatever you pass
  keeps its width as digits change, via tabular figures.
- **Actions are ButtonGroup items**, imported from `ButtonGroup` rather than
  re-exported under a Timer name. The Timer renders the group itself so it can
  always pick the `inlined` style — its own box already draws the border and
  radius an `outlined` group would duplicate — but everything about an item
  (separators, one Tab stop, arrow-key roving, hover/active/focus/disabled) is
  ButtonGroup's contract, unchanged.
- **Name the actions.** Each icon-only item needs its own `aria-label`, and a
  play/pause control's name must track its current function rather than its
  icon. The toolbar's own name comes from `actionsLabel`, whose default is an
  untranslated English string. See `accessibility.md`.
- **The box hugs its content.** Figma's 224px frame is the measured width of the
  sample value plus three actions, not a fixed size — a longer value simply
  makes the box wider.
- **RTL-safe.** The divider is an inline-end border, so the whole layout mirrors
  under `dir="rtl"` with no extra work.
- **No variants, no states.** Figma models this as a single component, not a
  component set: there is no size or style axis, and every interaction state
  lives on the individual actions.

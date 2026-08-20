# ButtonGroup

A compact cluster of related icon-only actions sharing a single box, separated
by hairlines. Two container styles — `outlined` (bordered, 4px radius) and
`inlined` (no chrome of its own) — around a variadic list of 32px-tall items.

## When to use

- Two to about five **related** icon actions that belong together and read as
  one control: a view switcher (list / grid / table), zoom in / zoom out,
  text alignment, a map's pan / fit / reset cluster.
- A dense surface — a table header, a chart toolbar, a card's corner — where
  separate buttons would waste space and read as unrelated.
- Use `inlined` when the group sits inside something that already draws a
  border, so you don't double up on chrome.

## When not to use

- **Persistent selection** — a group where one option stays visibly chosen
  (a segmented control). This component's `active` fill is transient
  activation feedback and releases; use a toggle group, whose items expose
  `aria-pressed`.
- **Unrelated actions** placed side by side. The shared box and separators
  claim the actions are one unit; separate `ButtonIcon`s say they aren't.
- **Labelled actions.** The design is icon-only (32px tall, 12px inline
  padding). For text actions in a row, use `Toolbar` or plain `Button`s.
- **A single action** — use `ButtonIcon`.
- **A long or overflowing list** of actions. This group neither scrolls nor
  collapses; `Toolbar`'s action list handles overflow into a "More" menu.

## Example (React — implemented)

```tsx
import { ButtonGroup, ButtonGroupItem } from '@acronis-platform/ui-react';

<ButtonGroup aria-label="View mode">
  <ButtonGroupItem aria-label="List view" onClick={showList}>
    <ListIcon size={16} />
  </ButtonGroupItem>
  <ButtonGroupItem aria-label="Grid view" onClick={showGrid}>
    <GridIcon size={16} />
  </ButtonGroupItem>
  <ButtonGroupItem aria-label="Table view" disabled>
    <TableIcon size={16} />
  </ButtonGroupItem>
</ButtonGroup>;
```

Vue and Web Component implementations are planned and will target the same
contract — see `api.yaml` `adapters`.

## Parts

| Part        | Element    | Notes                                                                                             |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------- |
| container   | `div`      | `role="toolbar"`. Owns the border/radius (`outlined` only) and clips its children to that radius. |
| `item`      | `button`   | One action. Icon-only; needs its own `aria-label`. Polymorphic via `render`.                      |
| `icon`      | `svg`      | The item's glyph — sized to 16px, tinted through `currentColor`.                                  |
| `separator` | _(border)_ | The item's inline-end border, dropped on the last item. Not an element, so not in the a11y tree.  |

## Notes

- **Accessible names are on you.** The container takes no default `aria-label`
  (a generic one would be unlocalizable noise), and icon-only items have no text
  to name them. Label both. See `accessibility.md`.
- **Position is normally not a prop.** Figma models item position as an `order`
  variant (first / middle / last), but it only selects whether the trailing
  separator is drawn — derived here from `:last-child`, so the group stays
  variadic and you never restate the DOM order. `order` exists as an **optional
  escape hatch** for the one case that derivation cannot survive: wrapping each
  item in another element makes every button a `:last-child` and erases every
  separator. Pass it there, and nowhere else.
- **One Tab stop.** The group follows the WAI-ARIA toolbar pattern: Tab enters
  and leaves, the arrow keys move between items. Home/End are unsupported (a
  Base UI limitation).
- **RTL-safe.** The separator is an inline-end border, so it mirrors under
  `dir="rtl"` with no extra work.
- **No disabled design.** Figma defines no disabled state for this component,
  so a disabled item dims its glyph to the shared
  `--ui-glyph-on-surface-disabled` semantic token. Worth revisiting if design
  ships a dedicated token.
- **Disabled items stay focusable**, unlike elsewhere in this library — the arrow
  keys land on them and they are marked `aria-disabled` rather than natively
  disabled. That is required, not preference: a natively disabled _first_ item
  would take the whole group out of the tab order. See `accessibility.md`.
- **Not a segmented control.** The `active` fill is transient activation
  feedback, not selection, and Figma defines no selected state. For one option
  that stays visibly chosen, use a toggle group.

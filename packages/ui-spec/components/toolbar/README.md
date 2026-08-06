# Toolbar

A horizontal action row — list actions, an optional overflow control, and an
optional trailing area — typically shown above/below a list or table when
rows are selected or bulk actions are available.

## When to Use

- A bulk-action bar that appears when one or more rows in a table/list are
  selected (e.g. "6 items selected: Deselect").
- A row of always-available actions with an overflow "More actions" menu for
  actions that don't fit.
- A status row (e.g. "25 of 1250 items loaded") alongside action buttons.

## When NOT to Use

- **Search/filtering above a table** — use `FilterSearch` or
  `DataTableToolbar`. Toolbar has no search field, filter popover, or
  applied-filter chips.
- **Navigation bars** — use a dedicated nav component.

## Related Components

- **FilterSearch** / **DataTableToolbar** — search-and-filter toolbars, not
  bulk-action bars. Compose both above the same table if you need filtering
  and a selection action bar (e.g. `FilterSearch` always visible,
  `Toolbar` shown only while rows are selected).
- **Button**, **ButtonMenu** — the action controls Toolbar arranges. Toolbar
  itself renders no button; every action is a consumer-supplied instance.

## Parts

| Part                | Element / component | Role                                                       |
| ------------------- | ------------------- | ---------------------------------------------------------- |
| `Toolbar`           | `<fieldset>`        | Root flex container (16px gap, disabled cascade)           |
| `ToolbarActionList` | `<div>`             | Figma's `ListActions` — self-collapsing action row (below) |
| `ToolbarActions`    | `<div>`             | Right-aligned trailing area (8px gap)                      |

## Behavior at a glance

- Children render in source order; `ToolbarActions`, if present, is pushed to
  the trailing edge via `grow shrink-0` (not `flex-1`, which also shrinks —
  the actions area must never shrink below its own content's natural width).
- `disabled` cascades to every nested Button/ButtonMenu via the native
  `<fieldset disabled>` behavior — no prop-drilling required.
- No dedicated token tier: every action brings its own tokens, and the
  16px/8px gaps are un-tokenized Tailwind utilities (same precedent as
  `FilterSearch`).
- **`ToolbarActionList` auto-collapses.** The Figma breakpoints spec (node
  `6262:28276`) requires that actions which don't fit the available width
  move into a "More actions" menu. `ToolbarActionList` measures its own row
  against a `ResizeObserver` on its parent `Toolbar` and moves trailing
  actions into a `ButtonMenu` + `DropdownMenu` once they no longer fit — no
  manual breakpoint wiring needed. Use plain `Button`/`ButtonMenu` children
  directly on `Toolbar` instead when the action list is short and fixed and
  auto-collapse isn't needed.

## Quick Examples

### React — auto-collapsing action list

```tsx
import {
  Toolbar,
  ToolbarActionList,
  ToolbarActions,
  Button,
} from '@acronis-platform/ui-react';

function SelectionToolbar({
  selectedCount,
  onDeselect,
}: {
  selectedCount: number;
  onDeselect: () => void;
}) {
  return (
    <Toolbar>
      <ToolbarActionList
        actions={[
          { key: 'first', label: 'First action', onSelect: () => {} },
          { key: 'second', label: 'Second action', onSelect: () => {} },
          { key: 'third', label: 'Third action', onSelect: () => {} },
        ]}
      />
      <ToolbarActions>
        <span>{selectedCount} items selected:</span>
        <Button variant="ghost" onClick={onDeselect}>
          Deselect
        </Button>
      </ToolbarActions>
    </Toolbar>
  );
}
```

### React — fixed, manually composed actions

```tsx
import {
  Toolbar,
  ToolbarActions,
  Button,
  ButtonMenu,
} from '@acronis-platform/ui-react';

<Toolbar>
  <Button variant="ghost">First action</Button>
  <Button variant="ghost">Second action</Button>
  <ButtonMenu>More actions</ButtonMenu>
  <ToolbarActions>
    <span>25 of 1250 items loaded</span>
  </ToolbarActions>
</Toolbar>;
```

### Disabled

```tsx
<Toolbar disabled>
  <ToolbarActionList actions={[{ key: 'first', label: 'First action' }]} />
</Toolbar>
```

## Spec Files

| File               | Contents                                                 |
| ------------------ | -------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link     |
| `anatomy.yaml`     | Root, parts, layout, prop states                         |
| `api.yaml`         | Framework-agnostic contract + framework adapters         |
| `tokens.yaml`      | No dedicated tier — see note in the file                 |
| `behavior.md`      | Given/When/Then behavior scenarios                       |
| `accessibility.md` | ARIA guidance (delegated to child components + fieldset) |

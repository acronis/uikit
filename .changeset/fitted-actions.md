---
'@acronis-platform/ui-react': minor
---

feat(fitted-actions): add `FittedActions` component

`FittedActions` is a responsive action row with automatic overflow: actions
render inline in priority order, and trailing items collapse into a "More"
dropdown menu when the container is too narrow to show them all. The visible
count is recomputed on every resize via `ResizeObserver`.

**How it works**

An off-screen tracing layer renders every action as a ghost-button span plus the
overflow trigger; the `ResizeObserver` callback reads their `offsetWidth` values
and calls `computeFittedVisibleCount` — pure math, no DOM — to decide the split.
All state updates happen inside the callback (never synchronously in the effect),
so before the first measurement every action is shown.

**Exports**

- **`FittedActions`** (`React.forwardRef<HTMLDivElement, FittedActionsProps>`) —
  the main component.
- **`computeFittedVisibleCount`** — pure helper; exported for unit testing without
  a DOM.
- **`FittedAction`** — action descriptor interface (`id`, `label`, `icon`,
  `isDisplayed`, `divided`, `disabled`, `onSelect`).
- **`FittedActionsProps`** — component props interface.

**Props**

| Prop            | Default  | Description                                           |
| --------------- | -------- | ----------------------------------------------------- |
| `actions`       | `[]`     | Ordered actions; trailing items overflow first        |
| `showDropdown`  | `true`   | Collapse overflow into the "More" menu                |
| `moreLabel`     | `"More"` | Label for the overflow trigger                        |
| `gap`           | `8`      | Inter-item gap in px (reserved when measuring too)    |
| `onAction`      | —        | Fired for any chosen action, after its own `onSelect` |
| `renderAction`  | —        | Custom inline action renderer                         |
| `renderTrigger` | —        | Custom overflow trigger renderer                      |

All additions are backwards-compatible.

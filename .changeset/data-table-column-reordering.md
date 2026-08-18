---
'@acronis-platform/ui-react': minor
---

`DataTable`: built-in column drag-to-reorder (`enableColumnReordering`), promoted from a story-only recipe.

Every non-pinned header cell becomes draggable; dropping it on another header moves that column into the target's position (native HTML5 drag-and-drop over TanStack's `columnOrder` — no new dependency). Pinned columns are excluded, since they're anchored to a table edge by definition, and the resize handle is explicitly non-draggable so both features can be enabled together. The order can be left internal or controlled via `columnOrder` + `onColumnOrderChange` (e.g. to persist the user's order); both are no-ops with an external `table` instance, like `enableColumnResizing`. The reorder helper `reorderColumn(order, from, to)` is exported for callers driving their own order state.

The grab/grabbing cursors come from new `--ui-draggable-cursor` / `--ui-draggable-cursor-active` custom properties, mirroring how the resize handle uses the generated `--ui-resizable-cursor`. They're hand-authored in `src/styles/index.css` (like `--ui-breakpoint-*`) because the design system has no Figma variable for a grab cursor yet — no component hardcodes `cursor-grab`.

Resizing a column also sets a `data-ui-column-resizing` attribute on `<html>` for the duration of the drag; a new global rule (`html[data-ui-column-resizing] * { cursor: var(--ui-resizable-cursor) !important; }`) keeps the resize cursor stable over every element the pointer crosses, instead of flickering back to a neighboring header's own `cursor-pointer`.

The gesture is pointer-only; there is no keyboard equivalent yet (the resize handle's Arrow-key path has no analogue here).

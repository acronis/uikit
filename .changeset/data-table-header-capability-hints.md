---
'@acronis-platform/ui-react': minor
---

`DataTable`: header cells now explain their own gestures, and the resize handle highlights while it is grabbed.

- Hovering (or focusing) a header cell opens a tooltip listing one line per capability that column actually has — `Sort column: Click`, `Reorder column: Drag`, `Resize column: Drag border`. A column with none of the three (e.g. a pinned, non-sortable, non-resizable select column) shows no tooltip.
- `headerHints` localizes the copy per capability, e.g. `headerHints={{ sort: { label: 'Spalte sortieren', action: 'Klick' } }}`.
- The column-resize handle now switches from the plain row-border color to `--ui-resizable-border-color-hover` on hover/focus and `--ui-resizable-border-color-active` while resizing, instead of only fading in.
- While a resize or a column drag is in progress, the capability tooltip is suppressed for the column being interacted with, and a header's own sort hover/press tint no longer fires — the two gestures no longer visually fight each other.

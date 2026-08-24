---
'@acronis-platform/ui-react': patch
---

Fix `DataTable`'s `id: 'select'` selection column: it now always renders at a
fixed 48px width and is never resizable, regardless of `enableColumnResizing`
or a caller-supplied `size`. Also replaces the drag-reorder cursor's
hand-authored `--ui-draggable-cursor[-active]` custom properties (now removed
from `styles/index.css`) with literal `cursor-grab`/`cursor-grabbing`
Tailwind utilities.

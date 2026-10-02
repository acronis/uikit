---
'@acronis-platform/ui-react': patch
---

- fix(data-table): keep the column-resize cursor working inside a Shadow DOM host. `DataTable` no longer sets a `data-ui-column-resizing` attribute on `<html>` during a resize, and the global `html[data-ui-column-resizing] *` cursor rule is removed from the stylesheet. That selector could not match elements inside a shadow root. The resize handle now calls `setPointerCapture` on `pointerdown`, so the handle stays the pointer target and keeps its own `--ui-resizable-cursor` (`ew-resize`) for the whole drag. Capture is released automatically on `pointerup`/`pointercancel`.
- fix(data-table): the header being dragged for column reordering is no longer dimmed (the `opacity-50` is removed). The browser's native drag image is the feedback. A header cell the drag passes over now gets a `data-reorder-target` attribute, which is removed from every header on drop or `dragend`. No style is attached to it yet.

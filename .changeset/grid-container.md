---
'@acronis-platform/ui-react': minor
---

feat(grid): add container-query mode

Grid gains a `container` prop — columns respond to the grid's own width (container
queries via a `@container/grid` wrapper) instead of the viewport. Ideal for widget
grids inside variable-width areas like App Shell main. (DashboardLayout was dropped
as redundant with Stack + Grid; "dashboard" is now an App Shell + container-Grid
pattern.)

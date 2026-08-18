---
'@acronis-platform/ui-react': minor
---

Fix `FilterSearchFilters`'s popover clipping inside a constrained `PortalContainerProvider` (MFE/Shadow DOM) container — `PopoverContent` now defaults to `fixed` positioning whenever a custom portal container is resolved, so the popup escapes a plain overflow-clipping ancestor instead of being clipped at the container's edge, and exposes `portalContainer`, `collisionBoundary`, and `positionMethod` overrides. `FilterSearchFilters` forwards `portalContainer`, `collisionBoundary`, `positionMethod`, `side`, `align`, `sideOffset`, and `contentClassName` for consumers who need to configure the popover directly.

Also fix the hardcoded "Reset filters" / "Cancel" / "Apply" / "Remove `<key>` filter" action labels on `FilterSearchFilters` and `FilterSearchAppliedFilters` — they're now overridable via `resetFiltersLabel`, `cancelLabel`, `applyLabel`, and `getRemoveFilterLabel` props (English defaults unchanged) so consumers can localize them.

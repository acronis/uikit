---
'@acronis-platform/ui-react': major
---

Remove Toast/Toaster component from @acronis-platform/ui-react.

**Breaking change:** `Toast`, `Toaster`, `toast()`, and all toast-related exports
are no longer available from this package. Consumers should migrate to the
Sonner-based Toaster from `@acronis-platform/shadcn-uikit` (ui-legacy) or use
`sonner` directly.

This removal also deletes the toast component spec from `@acronis-platform/ui-spec`,
the docs page, and the shadow-DOM integration reference for Toaster.

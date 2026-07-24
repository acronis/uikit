---
'@acronis-platform/ui-react': major
---

Add `Loading` and `DialogFooterDefault`; **`Spinner` is no longer exported** from the package's public entry point.

`Loading` is the new app-facing, composite loading indicator (spinner + optional label) with four placement-context variants (`inline`, `onSurfacePrimary`, `onSurfaceSecondary`, `onScreen`), themed by the new `--ui-loading-*` tier. `DialogFooterDefault` is a bottom action bar (panel/dialog/sheet footer) with end-aligned actions and an optional start slot (a truncated description, or a `Link`), themed by the new `--ui-footer-*` tier.

**Breaking change:** `Spinner` becomes an internal-only primitive (mirroring the existing `InputBox`/`SearchBox` pattern) — it's no longer re-exported from `@acronis-platform/ui-react`, though it still exists internally as `Loading`'s icon and `Toast`'s small inline icon. `SheetDetails`'s loading content state now renders `Loading` instead of a bare `Spinner`.

Migrate direct `Spinner` usage to `Loading`:

```diff
- import { Spinner } from '@acronis-platform/ui-react';
- <Spinner size="lg" />
+ import { Loading } from '@acronis-platform/ui-react';
+ <Loading variant="onSurfacePrimary" />
```

`Loading`'s three larger icon sizes (16 / 32 / 48px) line up with `Spinner`'s `sm` / `lg` / `xl`; pass `hasLabel={false}` to drop the visible label while keeping it announced via `aria-label`.

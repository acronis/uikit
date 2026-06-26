---
'@acronis-platform/ui-react': minor
---

Add `Separator` and `Spinner` (initial versions ported from ui-legacy).

- `Separator` — a 1px divider (`horizontal` / `vertical`) on the Base UI Separator primitive, using the shared `bg-border` token (replacing the legacy `bg-primary/10` hack).
- `Spinner` — a CSS loading ring (`role="status"`) in four sizes (`sm`/`md`/`lg`/`xl`), defaulting to the brand blue via `currentColor` and overridable with a `text-*` class.

Both are design-pending until dedicated token tiers exist.

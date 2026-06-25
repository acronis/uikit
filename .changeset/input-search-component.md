---
'@acronis-platform/ui-react': minor
---

Add `InputSearch`: a full search field that composes the bare `Search` box and adds an optional label (with an optional required marker) above it. The label is associated via `htmlFor`/`id` and clears `Search`'s default `aria-label` so it doesn't shadow the visible label; all other props (`placeholder`, `value`, `disabled`, `onClear`, …) pass through to `Search`. Themed by the `--ui-input-search-*` token tier.

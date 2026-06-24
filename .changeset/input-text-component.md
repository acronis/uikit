---
'@acronis-platform/ui-react': minor
---

Add `InputText`: a full single-line text field built around the bare `Input`
primitive — an optional `label` (with an optional `required` marker), the input
box, an optional clear (✕) button (`clearable` + `onClear`), and an optional
`description` or `error` message. Passing `error` switches the field to its error
treatment (red box border via `aria-invalid` + red message). Label/description/error
are wired with `htmlFor`/`aria-describedby`/`aria-required` for accessibility, and
all colors come from the `--ui-input-text-*` token tier.

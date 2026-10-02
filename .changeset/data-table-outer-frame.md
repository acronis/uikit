---
'@acronis-platform/ui-react': patch
---

**DataTable** — align outer wrapper with Figma (CI-43740): remove `rounded-md`
(border radius) and the all-sides `border` from the wrapper div. Figma design
shows no outer frame at all; per-row bottom borders from the Table primitives
provide the visual row separators.

A `data-slot="data-table"` attribute is added to the wrapper as a stable selector
hook. Consumers who previously targeted `.rounded-md` (e.g. email-security's
`.app-table-scroll > .rounded-md` and `.app-table-in-card > .rounded-md`) should
migrate to `[data-slot="data-table"]`.

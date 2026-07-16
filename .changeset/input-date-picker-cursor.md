---
'@acronis-platform/ui-react': patch
---

Fix `InputDatePicker` trigger cursor: show `cursor: pointer` on hover when
enabled (Tailwind v4's Preflight does not set a pointer cursor on `<button>`),
while keeping `cursor: not-allowed` when disabled.

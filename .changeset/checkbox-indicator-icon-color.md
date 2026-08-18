---
'@acronis-platform/ui-react': patch
---

`Checkbox`: fix the checkmark/dash disappearing when a checked box is nested inside an ancestor that sets its own SVG color — e.g. `TableViewOptions`' menu rows, which now put a `Checkbox` inside a `DropdownMenuItem` whose `[&_svg]:text-…` styling was out-specifying the indicator's `text-current`. The indicator icon now forces `text-current` with `!important` so it always tracks the checkbox's own state color regardless of ancestor SVG color rules.

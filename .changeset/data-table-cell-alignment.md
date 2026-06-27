---
'@acronis-platform/ui-react': patch
---

fix(data-table,table): align header padding + center checkbox/cell contents

- `DataTableColumnHeader`: the sort button used the legacy `-ml-3`, which (with
  ui-react's 0-padding ghost button) pulled the header label 12px left of the
  body cells. Now `-ml-2 px-2`, so the label sits flush at the same horizontal
  padding as the cells below it.
- `Table`: cells gave checkboxes the default `baseline` vertical alignment, so
  they sat high relative to the centered text/tags. Header and body cells now
  apply `align-middle` to any `[role=checkbox]`, vertically centering checkboxes
  with the rest of the row content.

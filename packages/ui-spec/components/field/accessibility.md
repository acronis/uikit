# Field — accessibility

Field's purpose is accessibility: it removes the manual wiring that's easy to get
wrong.

- **Label association** is automatic — `FieldLabel` (Base UI `Field.Label`) links
  to the control rendered through `FieldControl`, so no `htmlFor`/`id` plumbing.
- **Description** is exposed via `aria-describedby` on the control automatically.
- **Error / invalid:** an invalid field sets `data-invalid` and the control's
  `aria-invalid`; `FieldError` carries `role="alert"` semantics so the message is
  announced. Don't rely on color alone — the message text states the problem.
- **Grouping:** `FieldSet` is a native `<fieldset>` and `FieldLegend` a
  `<legend>`, so a group of related fields (e.g. a set of checkboxes or radios)
  is named for assistive tech. The field root carries `role="group"`.
- Pair Field with the **bare** controls. `Checkbox` / `Switch` already self-label
  (their own `label` prop) — let them name themselves inside a `FieldSet`; don't
  double-label them with a `FieldLabel`.

## Contrast

Error/invalid text uses `--ui-text-on-status-danger` (a readable red on the page
surface in both themes) — not the bridged `text-destructive`, which resolves to
the pale danger _surface_. Description text uses the muted
`--ui-text-on-surface-secondary`; both meet contrast in light and dark.

# InputSelect — Accessibility

- **Roles:** the trigger is a `role="combobox"` button; the popup is a
  `role="listbox"`; each item is a `role="option"` (provided by Base UI `Select`).
- **Label association:** `InputSelectLabel` (Base UI `Select.Label`) is automatically
  associated with the trigger via the select context — clicking the label focuses the
  trigger and screen readers announce the field name. No manual `htmlFor`/`id` needed.
- **Required:** `required` appends a visual `*` marker (`aria-hidden`); set the root
  `required` so the form-level constraint is conveyed via the hidden input.
- **Error:** set `aria-invalid` on the trigger; pair with `InputSelectError`. Associate
  the message via `aria-describedby` on the trigger when wiring a controlled error.
- **Keyboard:** Space / Enter / ArrowDown open the popup; arrows move the highlight;
  Enter selects; Escape closes and returns focus to the trigger; type-ahead matches
  items. In `multiple` mode the popup stays open so several items can be toggled.
- **Search box keyboard:** when the in-dropdown search row has focus, printable
  keys are stopped from reaching Base UI's own typeahead (so they type into the
  box instead of jumping the highlighted item); `Arrow*`/`Home`/`End`/`Enter`/
  `Escape` still bubble, so the user can move from the search box into the
  filtered list and select with the keyboard without leaving it first.
- **Expander:** `InputSelectExpander` is a plain button with `aria-expanded`
  reflecting its toggle state; it is not a `role="option"` and does not
  register with Base UI's composite list (unlike `SelectPrimitive.Item`), so
  Arrow-key roaming inside the listbox skips it entirely — it cannot be
  reached with the keyboard once the popup is open, only by pointer. It
  remains a normal native tab stop outside that roving focus order.
- **Selection indicator:** single-select shows a trailing check on the selected item;
  multiple-select shows a leading checkbox per item (not focusable — the row is the
  control).
- **Focus visible:** keyboard focus paints a 3px ring flush to the trigger —
  `--ui-focus-primary` normally, `--ui-focus-error` while `aria-invalid`.
- **Disabled:** native `disabled` removes the trigger from the tab order and blocks
  opening; state is not conveyed by color alone (the control is also inert).
- **Status:** the loading / empty / error row is informational; provide a real message
  and, for errors, a focusable retry control.
- **Contrast:** label / value / placeholder / border / item pairs come from the design
  tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.1, 2.1.1, 2.4.7, 1.4.3 / 1.4.11, 3.3.1 / 3.3.2, 4.1.2.

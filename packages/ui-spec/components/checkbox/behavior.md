# Checkbox — Behavior Scenarios

## Rendering

### Renders unchecked by default

**Given** a Checkbox with no `checked` / `default-checked`
**When** it renders
**Then** it exposes `role="checkbox"` with `aria-checked="false"`
**And** no glyph is shown

### Reflects a controlled checked prop

**Given** a Checkbox with `checked`
**When** it renders
**Then** `aria-checked="true"` and the check glyph is shown

### Renders the indeterminate state

**Given** a Checkbox with `indeterminate`
**When** it renders
**Then** `aria-checked="mixed"` and the minus glyph is shown

---

## Interaction

### Toggles on click (uncontrolled)

**Given** an uncontrolled Checkbox
**When** the user clicks it (or presses Space while focused)
**Then** the checked state flips
**And** `checked-change` fires with the new value

### Controlled mode defers to the consumer

**Given** a Checkbox with a controlled `checked` value
**When** the user clicks it
**Then** `checked-change` fires with the requested value
**And** the visual state changes only when the consumer updates `checked`

### Disabled blocks interaction

**Given** a Checkbox with `disabled`
**When** the user clicks it
**Then** the state does not change
**And** `checked-change` does not fire
**And** the disabled form tokens are applied

---

## States

### Hover

**Given** an enabled Checkbox
**When** the pointer hovers it
**Then** the border uses `--ui-checkbox-unchecked-box-border-color-hover`

### Focus

**Given** a Checkbox
**When** it receives keyboard focus
**Then** a 3px focus ring (`--ui-focus-primary`) is shown

### Checked / indeterminate fill

**Given** a checked or indeterminate Checkbox
**When** it renders
**Then** the box fills with `--ui-checkbox-checked-box-color-idle` and the border with
`--ui-checkbox-checked-box-border-color-idle`

---

## Edge Cases

### Indeterminate is independent of checked

**Given** a Checkbox with both `indeterminate` and `checked`
**When** it renders
**Then** `aria-checked="mixed"` wins (the minus glyph is shown)

### Form submission

**Given** a Checkbox with `name` and `value` inside a form
**When** the form is submitted while checked
**Then** the field is included with its value

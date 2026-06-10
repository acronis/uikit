# Input — Behavior Scenarios

## Rendering

### Renders an empty text field

**Given** an Input with no value
**When** it renders
**Then** it exposes `role="textbox"` with `type="text"` by default
**And** the placeholder (if set) is shown in `--ui-form-text-placeholder`

### Honors a custom type

**Given** an Input with `type="email"`
**When** it renders
**Then** the native input type is `email`

---

## Interaction

### Accepts typed input

**Given** an enabled Input
**When** the user types
**Then** the value updates
**And** the change event fires with the new value

### Disabled blocks input

**Given** an Input with `disabled`
**When** the user attempts to type
**Then** the value does not change
**And** the disabled form tokens (faint fill/border, muted text) apply

---

## States

### Hover

**Given** an enabled, valid Input
**When** the pointer hovers it
**Then** the border uses `--ui-form-border-hover`

### Focus

**Given** an Input
**When** it receives focus
**Then** the border uses `--ui-form-border-active`
**And** a 3px `--ui-focus-primary` ring is shown

### Error (aria-invalid)

**Given** an Input with `aria-invalid`
**When** it renders
**Then** the border uses `--ui-form-border-error`
**And** on focus the ring uses `--ui-focus-error` (not the primary ring)
**And** the error styling overrides the hover/focus border

---

## Edge Cases

### Placeholder is not a label

**Given** an Input that relies on a placeholder for its name
**When** reviewed for accessibility
**Then** it still needs an associated `<label>` / `aria-label` — the
placeholder is guidance, not a label.

### Controlled vs uncontrolled

**Given** an Input with `value` and a change handler
**When** the user types
**Then** the displayed value changes only when the consumer updates `value`
(uncontrolled inputs update themselves via `default-value`).

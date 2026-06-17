# InputTextArea — Behavior Scenarios

## Rendering

### Renders an empty multiline field

**Given** an InputTextArea with no value
**When** it renders
**Then** it exposes `role="textbox"` on a native `<textarea>`
**And** the placeholder (if set) is shown in `--ui-input-text-area-placeholder-color-idle`
**And** its height is at least `--ui-input-text-area-box-height-min`

### Grows with vertical resize

**Given** a rendered InputTextArea
**When** the user drags the resize handle down
**Then** the field grows taller (vertical resize only)
**And** it never shrinks below `--ui-input-text-area-box-height-min`

---

## Interaction

### Accepts typed input

**Given** an enabled InputTextArea
**When** the user types (including line breaks)
**Then** the value updates
**And** the change event fires with the new value

### Disabled blocks input

**Given** an InputTextArea with `disabled`
**When** the user attempts to type
**Then** the value does not change
**And** the disabled form tokens (faint fill/border, muted text) apply

---

## States

### Hover

**Given** an enabled InputTextArea
**When** the pointer hovers it
**Then** the border uses `--ui-input-text-area-border-color-hover`
**And** the fill uses `--ui-input-text-area-box-color-hover`

### Focus

**Given** an InputTextArea
**When** it receives focus
**Then** the border uses `--ui-input-text-area-border-color-focus`
**And** a 3px `--ui-focus-primary` ring is shown

### Error (aria-invalid)

**Given** an InputTextArea with `aria-invalid`
**When** it renders
**Then** the border stays at its idle/hover/focus color — this tier has no
error-specific border token
**And** on focus the ring uses `--ui-focus-error` (not the primary ring)

---

## Edge Cases

### Placeholder is not a label

**Given** an InputTextArea that relies on a placeholder for its name
**When** reviewed for accessibility
**Then** it still needs an associated `<label>` / `aria-label` — the
placeholder is guidance, not a label.

### Controlled vs uncontrolled

**Given** an InputTextArea with `value` and a change handler
**When** the user types
**Then** the displayed value changes only when the consumer updates `value`
(uncontrolled fields update themselves via `default-value`).

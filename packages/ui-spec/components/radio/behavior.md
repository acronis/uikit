# Radio — Behavior Scenarios

## Rendering

### Renders a radio group

**Given** a RadioGroup with several Radio items
**When** it renders
**Then** the container exposes `role="radiogroup"`
**And** each item exposes `role="radio"` with `aria-checked` reflecting selection

### Reflects the selected value

**Given** a RadioGroup with `default-value` matching one item
**When** it renders
**Then** that item has `aria-checked="true"` and shows the inner dot
**And** all other items have `aria-checked="false"`

---

## Interaction

### Selecting deselects the previous option

**Given** a RadioGroup with item A selected
**When** the user clicks item B
**Then** B becomes selected (`aria-checked="true"`)
**And** A is deselected
**And** `value-change` fires with B's value

### Keyboard navigation

**Given** focus is inside the group
**When** the user presses Arrow keys
**Then** focus moves to the adjacent item and selects it (roving tab index)

### Disabled item is not selectable

**Given** a Radio item with `disabled` (or a disabled group)
**When** the user clicks it
**Then** the selection does not change
**And** `value-change` does not fire
**And** the disabled form tokens apply

---

## States

### Hover

**Given** an enabled, unselected item
**When** the pointer hovers it
**Then** the border uses `--ui-form-border-hover`

### Focus

**Given** an item
**When** it receives keyboard focus
**Then** a 3px `--ui-focus-primary` ring is shown

### Selected fill

**Given** a selected item
**When** it renders
**Then** the circle fills with `--ui-form-background-active`
**And** the dot uses `--ui-form-circle-active`

---

## Edge Cases

### Controlled vs uncontrolled

**Given** a controlled RadioGroup (`value` + change handler)
**When** the user clicks an item
**Then** the selection changes only when the consumer updates `value`.

### Single selection invariant

**Given** any RadioGroup
**When** rendered
**Then** at most one item is selected at a time.

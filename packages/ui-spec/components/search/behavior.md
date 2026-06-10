# Search — Behavior Scenarios

## Rendering

### Renders a search field with a magnifier

**Given** a Search
**When** it renders
**Then** the input exposes `role="searchbox"` (native `type="search"`)
**And** a leading magnifier icon is shown
**And** the placeholder (if set) uses `--ui-form-text-placeholder`

---

## Interaction

### Typing updates the value and reveals the clear button

**Given** an empty Search
**When** the user types
**Then** the value updates and the change event fires
**And** a clear (×) button appears

### Clearing empties the field

**Given** a Search with a value
**When** the user presses the clear (×) button
**Then** the value is emptied (a change event fires with an empty value)
**And** the clear event fires
**And** focus returns to the input
**And** the clear button disappears

### Disabled blocks input

**Given** a Search with `disabled`
**When** the user attempts to interact
**Then** the value does not change
**And** no clear button is shown
**And** the disabled form tokens apply

---

## States

### Hover

**Given** an enabled Search
**When** the pointer hovers the box
**Then** the border uses `--ui-form-border-hover`

### Focus

**Given** a Search
**When** the input is focused
**Then** the box (`:focus-within`) shows the active border + a 3px
`--ui-focus-primary` ring

---

## Edge Cases

### Clear button hidden when empty

**Given** a Search with no value
**When** it renders
**Then** no clear button is shown

### Controlled value

**Given** a controlled Search (`value` + change handler)
**When** the user types or clears
**Then** the displayed value changes only when the consumer updates `value`,
and the clear button visibility tracks that value.

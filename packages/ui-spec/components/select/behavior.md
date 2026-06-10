# Select — behavior

## Opening

- **Given** an enabled, closed select
  **When** the user presses the trigger (click, Space, Enter, or ArrowDown)
  **Then** the popup opens (`open-change(true)`), the chevron rotates 180°, and
  keyboard focus moves into the list.

- **Given** a disabled select
  **When** the user presses the trigger
  **Then** nothing happens — the popup does not open.

## Selecting

- **Given** an open select
  **When** the user clicks an option (or highlights it and presses Enter)
  **Then** that option becomes the value, `value-change` fires with the new
  value, the trigger shows the option's label, and — for a single select — the
  popup closes.

- **Given** `multiple` is set
  **When** the user activates options
  **Then** each toggles in/out of the selection and the popup stays open.

- **Given** a selection exists
  **When** the popup is open
  **Then** the selected option shows its check indicator and is the initially
  highlighted item.

## Closing

- **Given** an open select
  **When** the user presses Escape, clicks outside, or makes a single selection
  **Then** the popup closes (`open-change(false)`) and focus returns to the
  trigger.

## Value display

- **Given** a value is selected but the popup is closed
  **When** an `items` map is provided on the root
  **Then** the trigger renders the selected option's **label** (not the raw
  value). Without `items`, the raw value is shown.

## Controlled vs uncontrolled

- **Given** `value` (or `open`) is controlled
  **When** the user makes a selection (or toggles open)
  **Then** internal state does **not** change on its own; the component emits the
  change event and the consumer must update the prop to reflect it.
- **Given** only `default-value` / `default-open` is provided
  **Then** the component manages the state itself.

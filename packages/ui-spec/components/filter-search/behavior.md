# FilterSearch — Behavior Scenarios

## Structure

### Renders a horizontal toolbar

**Given** a FilterSearch wrapping child components
**When** the component renders
**Then** the root is a `<div>` with a horizontal flex layout and 16px gap
**And** children are vertically centered

### Renders with search only

**Given** a FilterSearch containing only a Search component
**When** it renders
**Then** only the search field is shown in the toolbar

### Renders with tenant switcher and filters

**Given** a FilterSearch containing a Select, Search, and ButtonMenu
**When** it renders
**Then** all three appear in order: select, search, filters button

---

## Actions Area

### Pushes action buttons to the trailing edge

**Given** a FilterSearch with a FilterSearchActions containing buttons
**When** it renders
**Then** the actions area takes remaining space (`flex-1`)
**And** its content is right-aligned

### Renders without actions

**Given** a FilterSearch with no FilterSearchActions
**When** it renders
**Then** children are laid out from the leading edge with no trailing spacer

---

## Composition

### Supports arbitrary children

**Given** a FilterSearch with custom children (not just Search/Select/ButtonMenu)
**When** it renders
**Then** all children appear in source order within the flex container

### Merges custom className

**Given** a FilterSearch with a custom className
**When** it renders
**Then** the custom class is merged onto the root element

---

## FilterSearchFilters (the filter popover)

### Opens the popover from the trigger

**Given** a FilterSearchFilters whose popover is closed
**When** the filter trigger is clicked
**Then** the popover opens showing the field children and the footer (Reset filters / Cancel / Apply)
**And** the trigger is visually highlighted while open

### Applies the drafted filters on Apply

**Given** the popover is open and a field child has set a draft value (e.g. `status: "active"`)
**When** Apply is pressed
**Then** `onValueChange` fires with the committed filters (`{ status: "active" }`)
**And** `onApply` fires with the same applied filters
**And** the popover closes

### Reverts the draft on Cancel without applying

**Given** the popover is open and a field child has changed the draft
**When** Cancel is pressed
**Then** `onValueChange` does **not** fire
**And** the popover closes
**And** reopening the popover shows a reverted (last-applied) draft

> Dismissing the popover by outside-press or Escape reverts the draft the same
> way Cancel does — an un-applied edit never leaks out.

### Reset filters clears the draft (disabled when empty)

**Given** the popover is open with applied filters present
**When** the footer's "Reset filters" is pressed
**Then** the draft is cleared to empty

**Given** the popover is open with no filters set
**When** it renders
**Then** the footer's "Reset filters" is disabled

### Apply is disabled until the draft actually changes

**Given** the popover is opened fresh (no edits made)
**When** it renders
**Then** "Apply" is disabled, since the draft equals the last-applied `value`

**Given** a field child changes the draft to a value different from `value`
**When** it renders
**Then** "Apply" becomes enabled

### Fields scroll once they exceed the popover's max height

**Given** more filter field children than fit in the popover's height
**When** the popover is open
**Then** the fields region scrolls internally (`max-h-80 overflow-y-auto`)
**And** the footer stays pinned below it

---

## FilterSearchAppliedFilters (the applied-filter chip row)

### Renders nothing when there are no applied filters

**Given** a FilterSearchAppliedFilters with an empty `filters` object
**When** it renders
**Then** nothing is rendered

### Renders one removable chip per applied filter plus a Reset filters action

**Given** a FilterSearchAppliedFilters with applied filters (e.g. `status: "active"`, `type: "server"`)
**When** it renders
**Then** one removable chip is shown per applied filter (`"status: active"`, `"type: server"`)
**And** a "Reset filters" action is shown alongside the chips

> Chip labels default to `"<key>: <value>"`; a `getFilterChipLabel(key, value)`
> callback overrides the label.

### Removes a single filter when its chip is removed

**Given** a FilterSearchAppliedFilters with applied filters
**When** a chip's remove control is clicked (e.g. "Remove status filter")
**Then** `onValueChange` fires with that key dropped

### Clears all filters when Reset filters is pressed

**Given** a FilterSearchAppliedFilters with one or more applied filters
**When** its "Reset filters" action is pressed
**Then** `onValueChange` fires with an empty filters object — immediately, with no popover involved

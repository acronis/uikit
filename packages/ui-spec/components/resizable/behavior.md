# Resizable — behavior

Given/When/Then scenarios for the panel group, its panels, and the drag handle.

## Dragging a handle resizes its neighbours

- **Given** a horizontal panel group with two panels split 50/50 and a handle between them,
- **When** the user drags the handle to the right,
- **Then** the left panel grows and the right panel shrinks by the same amount,
  staying within each panel's `minSize` / `maxSize`.

## Sizes are clamped to min/max

- **Given** a panel with `minSize={20}`,
- **When** the user drags the handle past the point where that panel would fall below 20%,
- **Then** the panel stops at 20% and the handle does not move further in that direction.

## Keyboard resizing

- **Given** keyboard focus on a handle,
- **When** the user presses the Arrow keys along the resize axis (Left/Right for a
  horizontal group, Up/Down for a vertical group),
- **Then** the adjacent panels resize by a step, and **Home** / **End** jump to the
  handle's min / max extent.

## The grip is an affordance, not a control

- **Given** a handle rendered `withHandle`,
- **When** the group is displayed,
- **Then** the grab-bar pill is always visible to signal the handle is draggable;
  it does not change the resize behaviour.

## Orientation flips the axis

- **Given** a group with `orientation="vertical"`,
- **When** it renders,
- **Then** the panels stack in a column, the handle becomes a horizontal divider
  (`aria-orientation="horizontal"`), and the cursor over it is `ns-resize`.

## Disabled handles don't resize

- **Given** a handle (or its panels) is `disabled`,
- **When** the user drags or arrow-keys it,
- **Then** the panels do not resize through that handle.

## Collapsible panels

- **Given** a `collapsible` panel with a `minSize`,
- **When** the user drags below that `minSize`,
- **Then** the panel collapses to its collapsed size, and dragging back out (or
  calling the panel's `expand()` method) restores it.

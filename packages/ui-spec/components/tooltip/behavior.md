# Tooltip — behavior

## Opening

- **Given** an enabled tooltip
  **When** the user hovers the trigger or moves keyboard focus to it (after the
  open delay)
  **Then** the popup appears next to the trigger (`open-change(true)`).

- **Given** a `disabled` tooltip
  **When** the user hovers or focuses the trigger
  **Then** nothing happens — the popup never opens.

## Closing

- **Given** an open tooltip
  **When** the pointer leaves the trigger (and popup), focus moves away, or the
  user presses Escape
  **Then** the popup hides (`open-change(false)`).

## Delay

- **Given** a `TooltipProvider` wrapping several tooltips
  **When** one opens after its delay
  **Then** sibling tooltips can open without re-waiting the full delay (shared
  delay), per the provider configuration.

## Controlled vs uncontrolled

- **Given** `open` is controlled
  **When** the user hovers/focuses
  **Then** internal state does not change on its own; the component emits
  `open-change` and the consumer updates the `open` prop.
- **Given** only `default-open`
  **Then** the tooltip manages its own open state.

## Placement

- **Given** a `side` on the content
  **When** the popup opens
  **Then** it is placed on that side of the trigger, flipping to stay in view
  when there isn't room.

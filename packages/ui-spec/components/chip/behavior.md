# Chip — Behavior

## Removable

- **Given** a `removable` chip
  **When** it renders
  **Then** it shows the label and a trailing × button.

- **Given** a `removable` chip
  **When** the user activates the × button (click, Enter, or Space)
  **Then** the `remove` event fires (React: `onRemove`). The chip does **not**
  remove itself — the consumer owns the list and decides what to drop.

- **Given** a `removable` chip
  **When** the user hovers or presses the chip
  **Then** the container shows the hover / active fill + border.

## Selectable

- **Given** a `selectable` chip
  **When** it renders
  **Then** it is exposed as a toggle button (`role="button"`,
  `aria-pressed` reflecting `selected`) with an optional leading icon and no ×.

- **Given** a `selectable` chip
  **When** the user activates it (click, Enter, or Space)
  **Then** its `onClick` fires. Selection is **controlled**: the consumer flips
  `selected`, which applies the active fill + border.

- **Given** a `selectable` chip with `selected`
  **When** it renders
  **Then** the container uses the active fill + border and `aria-pressed="true"`.

## Content

- **Given** a label longer than the chip's width
  **When** it renders
  **Then** the label truncates with an ellipsis; the chip keeps its min-width.

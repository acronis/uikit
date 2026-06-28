# ScrollArea — Behavior

Given/When/Then scenarios for the scroll area.

## Overlay scrollbar — no reserved gutter

- **Given** content taller than the scroll area
  **When** it renders
  **Then** the content fills the full width of the viewport (the scrollbar
  floats over it and reserves **no** layout space), so edge-to-edge content is
  not cropped by a scrollbar gutter.

## Reveal on hover / scroll

- **Given** a scrollable area at rest
  **Then** the scrollbar is hidden (opacity 0).
- **When** the pointer hovers the area, or the viewport is scrolled
  **Then** the scrollbar fades in (driven by the primitive's `data-hovering` /
  `data-scrolling` state), and fades back out when the interaction ends.

## Orientation

- **Given** `orientation="vertical"` (default)
  **Then** only a vertical scrollbar is rendered.
- **Given** `orientation="horizontal"`
  **Then** only a horizontal scrollbar is rendered.
- **Given** `orientation="both"`
  **Then** both scrollbars are rendered plus the corner that fills the gap where
  they meet.

## Dragging the thumb

- **When** the user presses and drags the thumb
  **Then** the viewport scrolls proportionally; the thumb darkens
  (`--ui-border-on-surface-border-active`) on hover.

## Keyboard

- **Given** the viewport is focused
  **When** the user presses arrow keys / Page Up / Page Down / Home / End
  **Then** the viewport scrolls accordingly (native scrolling on the focusable
  viewport).

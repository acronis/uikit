# CardWidgetCarousel — Behavior

## Scroll — Next button

**Given** a `CardWidgetCarousel` whose track overflows (more cards than visible area)
**When** the user activates the Next button (pointer click or Enter/Space via keyboard focus)
**Then** the scroll track advances by one card width + gap (304 px) towards the trailing edge
with a smooth scroll animation.

**Given** the carousel is in an RTL context (`dir="rtl"` on an ancestor)
**When** the user activates the Next button
**Then** the track scrolls 304 px towards the logical start (i.e. visually to the left in RTL)
so that the next card slides into view from the start edge.

## Scroll — Previous button

**Given** a `CardWidgetCarousel` whose track has been scrolled past the start
**When** the user activates the Previous button (pointer click or Enter/Space via keyboard focus)
**Then** the scroll track moves back by one card width + gap (304 px) towards the leading edge
with a smooth scroll animation.

**Given** the carousel is in an RTL context (`dir="rtl"` on an ancestor)
**When** the user activates the Previous button
**Then** the track scrolls 304 px towards the logical end (i.e. visually to the right in RTL)
so that the previous card slides into view from the end edge.

## Button visibility

Both navigation buttons are always present in the DOM to preserve keyboard
focus. At scroll boundaries they are `aria-disabled="true"` and visually
hidden (`opacity-0`, `pointer-events-none`).

**Given** the track is at the start (scroll position = 0)
**When** the carousel renders
**Then** the Next button is enabled; the Previous button is disabled and invisible.

**Given** the track is scrolled partway through
**When** the carousel renders
**Then** both the Previous and Next buttons are enabled and visible.

**Given** the track is scrolled to the end (scroll position + client width >= scroll width)
**When** the carousel renders
**Then** the Previous button is enabled; the Next button is disabled and invisible.

## Dynamic children

**Given** a `CardWidgetCarousel` whose children change at runtime (e.g. async data load)
**When** children are added or removed from the track
**Then** the button disabled/visible state updates automatically via a
`MutationObserver` watching the track's `childList`.

## Overflow behavior

**Given** a `CardWidgetCarousel` with fewer or equal cards than the visible area can show
**When** a navigation button is clicked
**Then** `scrollBy` is still called; the browser clamps the position at the scroll boundary
with no visual jank.

## Pointer interaction behind the overlay

**Given** a card is partially obscured by a 180 px overlay panel (start or end)
**When** the user clicks on the visible portion of the card
**Then** the click reaches the card (the overlay panel has `pointer-events: none`;
only the navigation buttons have `pointer-events: auto`).

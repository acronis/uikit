# ScrollArea — Accessibility

## Roles & semantics

- The parts are plain `<div>`s; the component adds no landmark role. The
  scrollable **viewport** is focusable so the region is reachable and operable
  by keyboard.
- Content semantics are entirely the caller's — `ScrollArea` is a transparent
  scroll container around arbitrary children.

## Keyboard

| Key                          | Action                     |
| ---------------------------- | -------------------------- |
| `Tab`                        | Move focus to the viewport |
| `Arrow Up` / `Arrow Down`    | Scroll vertically          |
| `Arrow Left` / `Arrow Right` | Scroll horizontally        |
| `Page Up` / `Page Down`      | Scroll by a page           |
| `Home` / `End`               | Scroll to start / end      |

## Focus

- The viewport shows a visible focus ring (`--ui-focus-brand`) on
  `:focus-visible`, so keyboard users can see when the scroll region holds focus.

## Screen readers

- No content is hidden from assistive tech: the scrollbar and corner are
  decorative overlays; the scrolled children remain in the normal reading order.

## Pointer / motion

- The scrollbar reveal is an opacity transition only (no layout shift, no
  parallax). The thumb remains operable by mouse drag and by the native
  scroll gestures (wheel, trackpad, touch).

## Contrast

- The thumb uses the shared border token at rest and a darker active token on
  hover, both of which meet non-text contrast against the page surfaces in the
  shipped themes.

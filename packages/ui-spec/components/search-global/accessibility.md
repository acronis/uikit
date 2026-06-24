# SearchGlobal — accessibility

## Roles

- The accessible control is the inner **`<input type="search">`** (role
  `searchbox`). The pill box is a presentational wrapper.
- The **magnifier** is decorative and the **shortcut** hint is `aria-hidden` — both
  are visual affordances, not operable controls, so the input is the single thing
  in the tab order.

## Labeling

- The input has no visible label, so it carries an accessible name via
  `aria-label` (default `"Search"`). Override it per context (e.g.
  `"Search the platform"`). The placeholder is **not** a substitute for the label.

## Keyboard

| Key       | Action                                         |
| --------- | ---------------------------------------------- |
| `Tab`     | Move focus to / from the input.                |
| text keys | Edit the query.                                |
| `Esc`     | Native search-input clear (browser-dependent). |

The `⌘K` hint advertises a shortcut but the component does not bind it — the
consumer wires it (commonly: focus this field, or open a command palette) and
should keep the hint in sync with whatever it binds.

## Focus

- Focusing the input shows a 3px `--ui-focus-primary` ring around the box
  (`:focus-within`), distinct from the hover/active border gradients.

## Contrast

- The magnifier and placeholder use the AI-purple `--ui-search-global-icon-color`
  / `-placeholoder-color`; the shortcut uses `--ui-search-global-shortcut-color`.
  All resolve per brand/theme and must stay legible against the
  `--ui-search-global-box-color` fill in light and dark. Because the placeholder
  is purely a hint, the real query text uses the higher-contrast foreground.

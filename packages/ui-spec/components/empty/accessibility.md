# Empty — accessibility

Empty is presentational; accessibility is mostly about the heading and the icon.

## Roles & semantics

- `EmptyTitle` renders an `<h3>`. Make sure that level fits the surrounding
  document outline — if the empty state replaces a section whose heading was a
  different level, set the heading appropriately (override via `className`/markup
  as needed). Don't skip levels.
- `EmptyDescription` is a `<p>` associated with the title by proximity.
- The `EmptyIcon` is decorative — mark its SVG `aria-hidden="true"` so it isn't
  announced (the title carries the meaning).
- When the empty state appears **in response to an async action** (e.g. a search
  returned nothing, or data finished loading empty), wrap it (or a status region)
  with `role="status"` / `aria-live="polite"` so screen-reader users are told the
  result. Empty itself does not impose a role.

## Keyboard

- Empty has no interactive behavior. Any controls placed in `EmptyActions` /
  `EmptyLinks` (Buttons, Links) keep their own focus and keyboard behavior.

## Contrast

- The title uses `--ui-text-on-surface-primary`; the description and icon use
  `--ui-text-on-surface-secondary` — both meet WCAG AA against the page surface in
  light and dark. Re-verify against the final palette once a `--ui-empty-*` tier
  and Figma reference exist.

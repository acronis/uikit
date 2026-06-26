# Separator — accessibility

- Renders `role="separator"` (Base UI), with `aria-orientation` reflecting the
  `orientation` prop — so assistive tech announces a divider.
- Use a separator to convey a _meaningful_ break between groups. For a purely
  decorative line that should be ignored by assistive tech, hide it
  (`aria-hidden`) instead.
- It is non-interactive and not in the tab order.

## Contrast

The line uses `--ui-border-on-surface-border`, which meets non-text contrast
against the page surface in light and dark themes.

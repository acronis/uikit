# Sheet — accessibility

- The panel is a Base UI `Dialog.Popup`: `role="dialog"` + `aria-modal`, labelled
  by `SheetTitle` (`aria-labelledby`) and described by `SheetDescription`
  (`aria-describedby`). Always include a `SheetTitle` so the panel has an
  accessible name.
- Focus is trapped within the open panel and returns to the trigger on close;
  background scroll is locked while open (Base UI). `Esc` and an outside press
  dismiss an uncontrolled sheet.
- The close button is a real button labelled "Close" (sr-only text) and shows a
  visible focus ring (`--ui-focus-primary`).
- A side panel is still a modal dialog — keep it for focused tasks/detail views;
  don't trap the user in one for primary navigation.

## Contrast

Title uses `--ui-text-on-surface-primary` and description/close use
`--ui-text-on-surface-secondary` over the `--ui-background-surface-secondary`
panel; the header/footer bars use `--ui-background-surface-primary` divided by
`--ui-border-on-surface-border`. All meet text/non-text contrast in light and
dark.

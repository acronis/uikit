// The caption typography for a form control, consumed by `Field`'s label part.
// Text color is inherited (`text-foreground` from context), so no
// `--ui-label-*` tier is needed. `peer-disabled:*` dims the label when an
// associated `peer`-marked control is disabled.
export const labelClassName =
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

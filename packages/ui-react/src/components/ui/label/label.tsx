import * as React from 'react';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `label`
// (packages/ui-legacy/src/components/ui/label.tsx). A caption for a form
// control — a plain `<label>`, no Base UI primitive. The text color is
// inherited (`text-foreground` from context), so no `--ui-label-*` tier is
// needed. `peer-disabled:*` dims the label when an associated `peer`-marked
// control is disabled, mirroring the legacy behavior.
const labelClassName =
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

export type LabelProps = React.ComponentPropsWithoutRef<'label'>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn(labelClassName, className)} {...props} />
  )
);
Label.displayName = 'Label';

export { Label, labelClassName };

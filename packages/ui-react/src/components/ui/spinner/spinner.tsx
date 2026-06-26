import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `spinner`
// (packages/ui-legacy/src/components/ui/spinner.tsx). A CSS loading spinner — no
// Base UI primitive. No `--ui-spinner-*` tier; the ring color defaults to the
// brand action blue via `text-secondary` (--ui-background-brand-secondary, used
// through `border-current`), replacing the legacy `--spinner-color` var.
// Override the color with a `text-*` class. `size` mirrors the legacy scale.
const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent text-secondary',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-6',
        lg: 'size-8',
        xl: 'size-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <span className="sr-only">Loading…</span>
    </div>
  )
);
Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };

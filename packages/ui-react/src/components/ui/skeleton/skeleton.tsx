import * as React from 'react';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `skeleton`
// (packages/ui-legacy/src/components/ui/skeleton.tsx). A pulsing placeholder box
// for loading states — no Base UI primitive, just a styled `<div>`. The legacy
// `bg-muted` (--ui-background-surface-secondary) is near-white and nearly
// invisible on a white surface, so the fill uses the more visible
// `--ui-background-surface-active` gray (still subtle in dark). Shape and size
// come from the caller's className.
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-md bg-[var(--ui-background-surface-active)]',
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };

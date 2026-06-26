'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from '@base-ui/react';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `progress`
// (packages/ui-legacy/src/components/ui/progress.tsx). Wraps Base UI's Progress
// primitive (Root → Track → Indicator). No `--ui-progress-*` tier yet: the
// track uses the shared border token via `bg-input`, and the filled indicator
// uses the brand action blue via `bg-secondary` (--ui-background-brand-secondary,
// the same remap Spinner uses — ui-react's `primary` is the dark navy, not the
// action color legacy's `bg-primary` meant). When `value` is `null` the bar is
// indeterminate: Base UI sets `data-indeterminate`, which swaps the determinate
// width transition for the sliding `indeterminate-progress` keyframe (registered
// in src/styles/index.css).
// Base UI types `value` as required; we make it optional so `<Progress />`
// renders an indeterminate bar (the `value ?? null` below normalizes it).
export type ProgressProps = Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'value'
> & {
  value?: number | null;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      value={value ?? null}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Track className="relative h-full w-full overflow-hidden bg-input">
        <ProgressPrimitive.Indicator
          className="h-full bg-secondary transition-all data-[indeterminate]:animate-indeterminate-progress data-[indeterminate]:transition-none"
          style={value == null ? { width: '33%' } : undefined}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = 'Progress';

export { Progress };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';

// A composite loading indicator (spinner + optional label) for four placement
// contexts, themed by the `--ui-loading-*` tier. Distinct from the bare `Spinner`
// primitive (which this component reuses for its icon and which stays an
// internal-only primitive, not re-exported — see spinner.tsx): `Spinner` is a
// leaf atom with no label/container of its own, still used as-is by `Toast`'s
// small inline icon. `inline` sits flush in text flow; `onSurfacePrimary`/
// `onSurfaceSecondary` are card-like chips for placing over a primary/secondary
// app surface; `onScreen` is the higher-contrast dark chip for placing over
// busy/photo/video surfaces. The icon is `aria-hidden` and the root carries
// `role="status"` so the (visible or, when `hasLabel` is false, only
// `aria-label`'d) text is the single accessible announcement — avoids double
// announcement against `Spinner`'s own built-in status role.
const loadingVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      inline: 'gap-[var(--ui-loading-inline-container-gap)]',
      onSurfacePrimary:
        'flex-col justify-center gap-[var(--ui-loading-element-container-gap)] rounded-lg bg-[var(--ui-loading-element-container-color-primary)] px-[var(--ui-loading-element-container-padding-x)] py-[var(--ui-loading-element-container-padding-y)]',
      onSurfaceSecondary:
        'flex-col justify-center gap-[var(--ui-loading-element-container-gap)] rounded-lg bg-[var(--ui-loading-element-container-color-secondary)] px-[var(--ui-loading-element-container-padding-x)] py-[var(--ui-loading-element-container-padding-y)]',
      onScreen:
        'flex-col justify-center gap-[var(--ui-loading-screen-container-gap)] rounded-lg bg-[var(--ui-loading-screen-container-color)] px-[var(--ui-loading-screen-container-padding-x)] py-[var(--ui-loading-screen-container-padding-y)]',
    },
  },
  defaultVariants: {
    variant: 'inline',
  },
});

const spinnerSizeByVariant = {
  inline: 'sm',
  onSurfacePrimary: 'lg',
  onSurfaceSecondary: 'lg',
  onScreen: 'xl',
} as const;

const iconColorClassByVariant: Record<string, string> = {
  inline: 'text-[var(--ui-loading-inline-icon-color)]',
  onSurfacePrimary: 'text-[var(--ui-loading-element-icon-color)]',
  onSurfaceSecondary: 'text-[var(--ui-loading-element-icon-color)]',
  onScreen: 'text-[var(--ui-loading-screen-icon-color)]',
};

const labelClassByVariant: Record<string, string> = {
  inline: 'text-[var(--ui-loading-inline-label-color)]',
  onSurfacePrimary: 'text-[var(--ui-loading-element-label-color)]',
  onSurfaceSecondary: 'text-[var(--ui-loading-element-label-color)]',
  onScreen: 'text-[var(--ui-loading-screen-label-color)]',
};

export interface LoadingProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  /** Whether the label is rendered. When `false`, `label` is still exposed to assistive tech via `aria-label`. */
  hasLabel?: boolean;
  /** The loading message. */
  label?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      variant = 'inline',
      hasLabel = true,
      label = 'Data is loading…',
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant ?? 'inline';
    return (
      <div
        ref={ref}
        role="status"
        aria-label={hasLabel ? undefined : label}
        className={cn(loadingVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        <Spinner
          aria-hidden="true"
          size={spinnerSizeByVariant[resolvedVariant]}
          className={cn('shrink-0', iconColorClassByVariant[resolvedVariant])}
        />
        {hasLabel && (
          <span
            className={cn(
              'whitespace-nowrap text-sm font-normal leading-6',
              labelClassByVariant[resolvedVariant]
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);
Loading.displayName = 'Loading';

export { Loading, loadingVariants };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A responsive CSS-grid layout primitive. By default columns step down at viewport
// breakpoints. With `container`, the grid is wrapped in a `@container/grid` and its
// columns respond to the grid's own available width (its column/content area)
// rather than the viewport — the right behavior for widget grids inside App Shell,
// whose width shrinks as the sidebar expands.
const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
  },
});

// Container-query column classes (named container `grid`), mirroring the viewport
// scale above but keyed to the grid's own width.
const containerColsClass: Record<NonNullable<GridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 @md/grid:grid-cols-2',
  3: 'grid-cols-1 @md/grid:grid-cols-2 @4xl/grid:grid-cols-3',
  4: 'grid-cols-1 @md/grid:grid-cols-2 @4xl/grid:grid-cols-4',
  6: 'grid-cols-2 @lg/grid:grid-cols-3 @4xl/grid:grid-cols-6',
  12: 'grid-cols-4 @lg/grid:grid-cols-6 @4xl/grid:grid-cols-12',
};
const gapClass: Record<NonNullable<GridProps['gap']>, string> = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  /**
   * Size columns by the grid's own width (container queries) instead of the
   * viewport. Wraps the grid in a `@container/grid`.
   */
  container?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = 'md', container, ...props }, ref) => {
    if (container) {
      return (
        <div className="@container/grid">
          <div
            ref={ref}
            data-slot="grid"
            className={cn(
              'grid',
              gapClass[gap ?? 'md'],
              containerColsClass[cols ?? 3],
              className
            )}
            {...props}
          />
        </div>
      );
    }
    return (
      <div
        ref={ref}
        data-slot="grid"
        className={cn(gridVariants({ cols, gap }), className)}
        {...props}
      />
    );
  }
);
Grid.displayName = 'Grid';

export { Grid, gridVariants };

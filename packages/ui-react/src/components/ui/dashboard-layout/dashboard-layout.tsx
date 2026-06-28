import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Ported 1:1 from `@acronis-platform`'s `dashboard-layout`. A layout for dashboard
// pages — a vertically spaced `DashboardLayout` region holding one or more
// `DashboardGrid` widget grids (responsive column counts). Layout-only (no color).
const DashboardLayout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="dashboard-layout"
    className={cn('space-y-6', className)}
    {...props}
  />
));
DashboardLayout.displayName = 'DashboardLayout';

const dashboardGridVariants = cva('grid gap-4', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
  },
  defaultVariants: {
    cols: 3,
  },
});

export interface DashboardGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardGridVariants> {}

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  ({ className, cols, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dashboard-grid"
      className={cn(dashboardGridVariants({ cols }), className)}
      {...props}
    />
  )
);
DashboardGrid.displayName = 'DashboardGrid';

export { DashboardLayout, DashboardGrid, dashboardGridVariants };

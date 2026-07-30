import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `GridProps` extends
// `React.HTMLAttributes<HTMLDivElement>`, which expands to a large, noisy table
// that buries the CVA variants; this companion documents only the props callers
// set directly. (The runtime type lives in grid.tsx; this file is never bundled.)

/** Props for `Grid` — a responsive CSS-grid layout primitive. */
export interface GridProps {
  /** Column count at the widest step; steps down at smaller widths. Default `3`. */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Gap between cells: `none` · `sm` · `md` (default) · `lg` · `xl`. */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Size columns by the grid's own width (container queries) instead of the
   * viewport. Wraps the grid in a `@container/grid` element.
   */
  container?: boolean;
  /** Extra classes merged onto the grid. */
  className?: string;
  /** The grid cells. */
  children?: React.ReactNode;
}

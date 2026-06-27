import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `ProgressCircleProps`
// extends `React.HTMLAttributes<HTMLDivElement>`, which expands to a large, noisy
// table; this companion documents only the props callers set directly. (The
// runtime type lives in progress-circle.tsx; this file is never bundled.)

/** Props for `ProgressCircle`. */
export interface ProgressCircleProps {
  /** Current progress, clamped to `[0, max]`. */
  value?: number;
  /** Value representing full completion (default `100`). */
  max?: number;
  /** Ring diameter + stroke: `tiny` · `sm` (default) · `md` · `lg`. */
  size?: 'tiny' | 'sm' | 'md' | 'lg';
  /**
   * Arc color level. Omit to derive from `value`/`max` by thresholds
   * (≈ <40% danger, <60% critical, <80% warning, else success).
   */
  status?: 'brand' | 'danger' | 'critical' | 'warning' | 'success';
  /** Show the rounded percentage in the center. */
  showValue?: boolean;
  /** Show a status icon in the center (priority over `showValue`). */
  showIcon?: boolean;
  /** Custom center content (priority over icon / value). */
  children?: React.ReactNode;
}

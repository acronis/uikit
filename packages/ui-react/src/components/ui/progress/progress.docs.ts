import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `ProgressProps` in
// progress.tsx extends Base UI's `Progress.Root` props, which expand to a large,
// noisy table. This companion documents only the props callers set directly.
// (The runtime type lives in progress.tsx; this file is never bundled.)

/** Props for `Progress` — a determinate or indeterminate progress bar. */
export interface ProgressProps {
  /**
   * Completion between `min` and `max`. `null` (the default) renders an
   * indeterminate sliding bar.
   */
  value?: number | null;
  /** The value representing full completion (default `100`). */
  max?: number;
  /** The value representing no completion (default `0`). */
  min?: number;
  /** Extra classes merged onto the root. */
  className?: string;
  children?: React.ReactNode;
}

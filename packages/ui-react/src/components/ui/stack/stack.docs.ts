import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `StackProps` extends
// `React.HTMLAttributes<HTMLDivElement>`, which expands to a large, noisy table
// that buries the CVA variants; this companion documents only the props callers
// set directly. (The runtime type lives in stack.tsx; this file is never bundled.)

/** Props for `Stack` — a flexbox layout primitive. */
export interface StackProps {
  /** Main axis: `vertical` (default) or `horizontal`. */
  direction?: 'vertical' | 'horizontal';
  /** Gap between children: `none` · `xs` · `sm` · `md` (default) · `lg` · `xl`. */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Cross-axis alignment: `start` · `center` · `end` · `stretch` (default). */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Main-axis distribution: `start` (default) · `center` · `end` · `between`. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Let children wrap onto multiple lines. Default `false`. */
  wrap?: boolean;
  /** Extra classes merged onto the stack. */
  className?: string;
  /** The stacked children. */
  children?: React.ReactNode;
}

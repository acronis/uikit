import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `LabelProps` in label.tsx
// is `React.ComponentPropsWithoutRef<'label'>`, which expands to every `<label>`
// DOM attribute — a large, noisy table. This companion documents only the props
// callers set directly. (The runtime type lives in label.tsx; never bundled.)

/** Props for `Label` — a caption for a form control. */
export interface LabelProps {
  /** The `id` of the control this label captions; clicking focuses it. */
  htmlFor?: string;
  /** Extra classes merged onto the label. */
  className?: string;
  /** The label text. */
  children?: React.ReactNode;
}

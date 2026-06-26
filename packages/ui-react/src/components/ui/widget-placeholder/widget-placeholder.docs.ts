import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `WidgetPlaceholderProps`
// extends `React.HTMLAttributes<HTMLDivElement>`, which expands to every div DOM
// attribute — a large, noisy table. This companion documents only the props
// callers set directly. (The runtime type lives in widget-placeholder.tsx; this
// file is never bundled.) The sub-parts take plain HTML div attributes.

/** Props for `WidgetPlaceholder` — the root widget card. */
export interface WidgetPlaceholderProps {
  /**
   * Make the whole widget focusable (`tabindex=0`) and clickable — adds
   * hover/active surface tints and a focus ring. Wire the behavior with
   * `onClick`.
   */
  interactive?: boolean;
  /** Extra classes merged onto the root. */
  className?: string;
  /** The composed parts (header / content / footer). */
  children?: React.ReactNode;
}

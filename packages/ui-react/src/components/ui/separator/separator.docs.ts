import type { useRender } from '@base-ui/react/use-render';

// Curated prop surface for the docs `<AutoTypeTable>`. `Separator` forwards Base
// UI's Separator props without declaring a local interface; this companion lists
// the props consumers set. (Runtime types come from Base UI; this file is never
// bundled.)

/** Props for `Separator`. */
export interface SeparatorProps {
  /**
   * Divider axis — also sets `aria-orientation` and swaps which dimension is
   * 1px. Defaults to `horizontal`.
   */
  orientation?: 'horizontal' | 'vertical';
  /** Additional classes merged onto the rendered `<div>`. */
  className?: string;
  /** Replace the rendered `<div>` with another element (Base UI composition). */
  render?: useRender.RenderProp;
}

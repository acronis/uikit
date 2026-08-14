import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. TruncateText is a
// forwardRef component — this companion trims the raw React intrinsics.
// (The runtime type lives in truncate-text.tsx; this file is never bundled.)

/** Props for `TruncateText`. */
export interface TruncateTextProps {
  /** The text to display. Also used verbatim as the tooltip body when truncated. */
  children: string;
  /**
   * Where the ellipsis goes.
   * - `'end'` (default) — CSS `text-overflow: ellipsis` for single-line; `-webkit-line-clamp` when `lines > 1`.
   * - `'middle'` — canvas binary-search preserving both ends; ideal for URLs, paths, and hashes.
   */
  mode?: 'end' | 'middle';
  /** Which side the tooltip opens on. Defaults to `'top'`. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Max lines before truncating (`'end'` mode only).
   * `1` (default) = single-line ellipsis; `>1` = multi-line `-webkit-line-clamp`.
   * Ignored in `'middle'` mode, which is inherently single-line.
   */
  lines?: number;
  /**
   * Force the tooltip open on mount — only has effect when the text is truncated.
   * Useful for stories and visual review; normal usage reveals the tooltip on hover/focus.
   */
  defaultOpen?: boolean;
  /**
   * Container the tooltip popup portals into. Pass a shadow-root mount (e.g. a
   * micro-frontend mount point) so the popup inherits the kit's styles.
   * Defaults to `document.body`.
   */
  portalContainer?: HTMLElement | ShadowRoot | null;
  /** Extra classes merged onto the rendered `<span>`. */
  className?: string;
  /** Forwarded to the underlying `<span>`. */
  ref?: React.Ref<HTMLSpanElement>;
}

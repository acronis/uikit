import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `Collapsible` and
// `CollapsibleTrigger` are direct re-exports of Base UI's Collapsible parts, so
// there is no local props interface to document; this companion lists the props
// consumers set directly. (Runtime types come from Base UI; this file is never
// bundled.)

/** Props for `Collapsible` (the root). */
export interface CollapsibleProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initially open (uncontrolled). Defaults to `false`. */
  defaultOpen?: boolean;
  /** Fired with the next open state. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
  /** Ignore all user interaction. */
  disabled?: boolean;
  /**
   * Let the browser's built-in page search find and expand the panel by
   * rendering it with `hidden="until-found"` instead of unmounting it.
   */
  hiddenUntilFound?: boolean;
  /** Keep the panel mounted in the DOM while closed. */
  keepMounted?: boolean;
  /** A `CollapsibleTrigger` and a `CollapsibleContent`. */
  children?: React.ReactNode;
}

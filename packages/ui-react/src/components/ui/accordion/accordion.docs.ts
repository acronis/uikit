import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The Accordion parts wrap
// Base UI's Accordion primitive and declare no local props interface, and the
// primitive's generated types are too noisy for a readable table; this
// companion documents the props consumers set directly. (Runtime types come
// from Base UI; this file is never bundled.)

/** Props for `Accordion` (the root). */
export interface AccordionProps {
  /** Controlled set of open item values. Pair with `onValueChange`. */
  value?: Array<string | number>;
  /** Initially open item values (uncontrolled). */
  defaultValue?: Array<string | number>;
  /** Fired with the next set of open item values. */
  onValueChange?: (
    value: Array<string | number>,
    eventDetails: unknown
  ) => void;
  /** Allow more than one section open at a time. Defaults to `false`. */
  multiple?: boolean;
  /** Ignore all user interaction across the whole accordion. */
  disabled?: boolean;
  /** Arrow-key navigation axis. Defaults to `vertical`. */
  orientation?: 'horizontal' | 'vertical';
  /** Keep closed panels mounted in the DOM. Defaults to `false`. */
  keepMounted?: boolean;
  /** One or more `AccordionItem` sections. */
  children?: React.ReactNode;
}

/** Props for `AccordionItem` — one section. */
export interface AccordionItemProps {
  /**
   * Identifies the section in the root's open-value set. Generated
   * automatically when omitted, so set it whenever you drive `value` /
   * `defaultValue` yourself.
   */
  value?: string | number;
  /** Disable just this section. */
  disabled?: boolean;
  /** An `AccordionTrigger` followed by an `AccordionContent`. */
  children?: React.ReactNode;
}

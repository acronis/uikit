import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The Tabs parts wrap Base
// UI's Tabs primitive (no local props interface), whose generated types are too
// noisy for a clean table; this companion documents the props consumers set
// directly. (Runtime types come from Base UI via dialog.tsx-style re-exports;
// this file is never bundled.)

/** Props for `Tabs` (the root). */
export interface TabsProps {
  /** Controlled selected-tab value. Pair with `onValueChange`. */
  value?: string | number;
  /** Initially selected tab value (uncontrolled). */
  defaultValue?: string | number;
  /** Fired with the newly selected tab value. */
  onValueChange?: (value: string | number, eventDetails: unknown) => void;
  /** Layout and arrow-key navigation orientation. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** A `TabsList` of `TabsTrigger`s plus matching `TabsContent` panels. */
  children?: React.ReactNode;
}

/** Props shared by `TabsTrigger` and `TabsContent`. */
export interface TabsPartProps {
  /**
   * Identifies the tab: a `TabsTrigger` and the `TabsContent` it controls share
   * the same `value`.
   */
  value: string | number;
  /** On `TabsTrigger` — disables selecting that tab. */
  disabled?: boolean;
  children?: React.ReactNode;
}

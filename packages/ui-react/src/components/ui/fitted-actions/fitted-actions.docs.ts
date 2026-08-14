import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. FittedAction is a
// plain object interface — documented here so the docs table stays concise.

/** A single action in the `FittedActions` bar. */
export interface FittedAction {
  /** Stable identity — used as React key. */
  id: string;
  /** Visible label (also the overflow menu-item label). */
  label: React.ReactNode;
  /** Optional leading 16px icon rendered before the label. */
  icon?: React.ReactNode;
  /** Set `false` to omit the action entirely without removing it from the array. */
  isDisplayed?: boolean;
  /** Render a divider above this item when it appears in the overflow menu. */
  divided?: boolean;
  /** Disables the action (inline button and overflow menu item both become inert). */
  disabled?: boolean;
  /** Invoked when this action is chosen — inline click or overflow menu select. */
  onSelect?: () => void;
}

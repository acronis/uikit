import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. FittedAction is a
// plain object interface — documented here so the docs table stays concise.

/**
 * Props for `FittedActions` — the responsive action row.
 * Extends `div` props (excluding `onSelect`).
 */
export interface FittedActionsProps {
  /** Ordered actions; trailing items overflow into the menu first. Defaults to `[]`. */
  actions?: FittedAction[];
  /** Collapse overflow into a "More" menu. Default `true`. */
  showDropdown?: boolean;
  /** Label for the overflow trigger. Default `"More"`. */
  moreLabel?: React.ReactNode;
  /** Inter-item gap in px (also reserved when measuring). Default `8`. */
  gap?: number;
  /** Fired for any chosen action, after its own `onSelect`. */
  onAction?: (action: FittedAction) => void;
  /** Customize the inline action element. Default: a ghost `Button`. */
  renderAction?: (
    action: FittedAction,
    api: { onSelect: () => void; disabled?: boolean }
  ) => React.ReactNode;
  /** Customize the overflow trigger (used as the menu trigger's `render`). Default: a ghost `Button`. */
  renderTrigger?: (api: { label: React.ReactNode }) => React.ReactElement;
  /** Extra classes merged onto the root `<div>`. */
  className?: string;
}

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

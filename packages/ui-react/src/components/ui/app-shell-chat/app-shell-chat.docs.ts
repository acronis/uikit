import type * as React from 'react';

// Curated prop surfaces for the docs `<AutoTypeTable>`. The real interfaces in
// app-shell-chat.tsx extend `React.ComponentPropsWithoutRef<'aside' | 'div'>`,
// so the generated tables bury the four props that matter under every DOM
// attribute. `AppShellChatInitialLayout` needs no companion — it is documented
// straight from the source. (The runtime types live in app-shell-chat.tsx; this
// file is never bundled.)

/** Props for `AppShellChatChat` — the resizable chat panel. */
export interface AppShellChatChatProps {
  /**
   * Controlled width in px. Uncontrolled, the width is breakpoint-responsive
   * (512px at 1680px+, 448px from 1280px, 48px below) and stays live until the
   * user drags or keyboard-resizes it.
   */
  width?: number;
  /** Fires when a drag or keyboard resize changes the width. */
  onWidthChange?: (width: number) => void;
  /**
   * Accessible label for the resize edge (`role="separator"`). Defaults to
   * `'Resize chat'` — localize it.
   */
  resizeAriaLabel?: string;
  /**
   * Tooltip content shown on the resize edge. Pass `null` to hide the tooltip
   * entirely.
   */
  resizeTooltip?: React.ReactNode;
  /** Extra classes merged onto the panel. */
  className?: string;
  /** The panel's header and body. */
  children?: React.ReactNode;
}

/** Props for `AppShellChatChatHeader` — the chat panel's header row. */
export interface AppShellChatChatHeaderProps {
  /** Header title. Doubles as the icon-only rail's tooltip when compact. */
  label?: React.ReactNode;
  /** Trailing header actions. Hidden while the panel is at its floor width. */
  actions?: React.ReactNode;
  /** Extra classes merged onto the header. */
  className?: string;
  /** Alternative to `label` for rich title content. */
  children?: React.ReactNode;
}

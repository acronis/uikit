import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ChatMenuItem — one row of the chat rail while the rail is expanded (Figma
// "ChatMenuItem", node 6516:2333). Unlike the collapsed rail
// (ChatMenuItemCollapsed), there is room for a label and a trailing
// ChatMenuItemExtras cluster.
//
// Tokens come from the `--ui-chat-*` tier (already imported in
// src/styles/index.css by ChatMenuItemCollapsed). Nothing is reimplemented
// from SidebarSecondary — the Figma node binds the `components/Chat/*`
// variable group and that is what is referenced here.
//
// Geometry:
//   height       -> --ui-chat-menu-item-height              (40px)
//   min-width    -> --ui-chat-menu-item-expanded-min-width  (224px)
//   padding-x    -> --ui-chat-menu-item-padding-x           (16px)
//   gap          -> --ui-chat-menu-item-expanded-gap        (8px)
//   start border -> --ui-chat-global-border-width/-color
//   icon color   -> --ui-chat-menu-item-icon-color
//   label        -> --ui-chat-menu-item-label-color + the generated
//                    .ui-chat-menu-item-label-text-style utility class
// The 256px width drawn on the Figma frame is the demo sidebar canvas, not a
// component-level token (there is no "expanded width" variable bound to this
// node) — the row fills its container instead, floored at the expanded
// min-width.
//
// `state` re-checks live as `idle | hover | active | focused` — a superset of
// what our original read captured (`idle` only). `hover` and `focused` stay
// pure INTERACTION states wired via `hover:` / `focus-visible:`, same as
// ChatMenuItemCollapsed. `active` is different here: tokens-pd carries a
// dedicated `--ui-chat-menu-item-color-active` distinct from `-color-hover`,
// and the live node's screenshot shows `active` as a persistent tint (not a
// transient mouse-press), which reads as "this is the currently-open chat" —
// so it is kept as a real `state` prop value, mirroring how
// sidebar-primary/-secondary mark their current route (`aria-current="page"`).
//
// The live node exposes no secondary hint-text slot alongside the label
// (only one "Menu item" text descendant) — `--ui-chat-menu-item-hint-color`
// exists in tokens-pd but is unused by this component; flagging for design
// same as chat-menu-item-extras' README already does for its own token gap.
const chatMenuItemVariants = cva(
  'relative flex h-[var(--ui-chat-menu-item-height)] w-full min-w-[var(--ui-chat-menu-item-expanded-min-width)] shrink-0 cursor-pointer items-center gap-[var(--ui-chat-menu-item-expanded-gap)] border-solid [border-inline-start-color:var(--ui-chat-global-border-color)] [border-inline-start-width:var(--ui-chat-global-border-width)] px-[var(--ui-chat-menu-item-padding-x)] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--ui-focus-primary)]',
  {
    variants: {
      state: {
        idle: 'bg-[var(--ui-chat-menu-item-color-idle)] hover:bg-[var(--ui-chat-menu-item-color-hover)]',
        active: 'bg-[var(--ui-chat-menu-item-color-active)]',
      },
    },
    defaultVariants: {
      state: 'idle',
    },
  }
);

export interface ChatMenuItemProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof chatMenuItemVariants> {
  /**
   * The 16px glyph identifying the chat. Mono icons inherit
   * `--ui-chat-menu-item-icon-color` via `currentColor`.
   */
  icon?: React.ReactNode;
  /** The chat's title, rendered as the row's visible label. */
  label: string;
  /**
   * Show the trailing affordance cluster (see `extras`). Defaults to
   * `false`, matching the Figma component's own default.
   */
  hasExtras?: boolean;
  /**
   * The trailing affordance cluster, composed by the consumer as a
   * `ChatMenuItemExtras` element. Only rendered when `hasExtras` is set —
   * its inner `labelTag`/`labelShortcut`/`variant` props are configured on
   * that element directly, not flattened onto `ChatMenuItem`.
   */
  extras?: React.ReactNode;
}

/**
 * One expanded chat rail row: icon, label, and an optional trailing
 * `ChatMenuItemExtras` cluster. Set `state="active"` for the currently-open
 * chat — it also marks `aria-current="page"`, matching the sidebar
 * components' current-route convention.
 */
const ChatMenuItem = React.forwardRef<HTMLButtonElement, ChatMenuItemProps>(
  (
    {
      className,
      state,
      icon,
      label,
      hasExtras = false,
      extras,
      type,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-current={state === 'active' ? 'page' : undefined}
      className={cn(chatMenuItemVariants({ state }), className)}
      {...props}
    >
      {icon && (
        <span className="relative flex size-4 shrink-0 items-center justify-center text-[var(--ui-chat-menu-item-icon-color)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          {icon}
        </span>
      )}
      <span className="ui-chat-menu-item-label-text-style min-w-0 flex-1 truncate text-start text-[var(--ui-chat-menu-item-label-color)]">
        {label}
      </span>
      {hasExtras && extras}
    </button>
  )
);
ChatMenuItem.displayName = 'ChatMenuItem';

export { ChatMenuItem, chatMenuItemVariants };

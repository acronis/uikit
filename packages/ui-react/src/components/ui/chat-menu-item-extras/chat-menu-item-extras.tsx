import * as React from 'react';

import { cn } from '@/lib/utils';
import { Tag } from '@/components/ui/tag';

// ChatMenuItemExtras — the trailing affordance cluster on a chat menu item
// (Figma "ChatMenuItemExtras", node 7329:52341).
//
// `variant` is a discriminant that selects WHICH child renders, not a style
// axis: the root cluster is identical for every variant, so there is no `cva`
// here (a cva whose variant keys all carry an empty class string would be pure
// indirection). The two label props are per-variant content slots — only the
// one matching the active variant is read.
//
// Tokens: the Figma node binds this cluster to the
// `components/SidebarSecondary/MenuItemExtras/_global/*` variable group
// (container gap, shortcut color + its generated body/default text style), so
// those are the `--ui-sidebar-secondary-menu-item-extras-global-*` tokens
// referenced below — the design's own references, not a re-pointing to the
// `--ui-chat-*` tier. This component only consumes those tokens; it reuses the
// shipped `Tag` and does not reimplement anything from SidebarSecondary.
//
// The Figma component set also offers a third `externalLink` variant (a 16px
// SquareArrowUpRight glyph). It is intentionally out of scope here — see the
// spec's README. `justify-end` is direction-aware (flex end, not a physical
// edge), so the cluster mirrors correctly under `dir="rtl"`.
export interface ChatMenuItemExtrasProps
  extends React.ComponentPropsWithoutRef<'span'> {
  /**
   * Which trailing affordance to render. Defaults to `tag` — the Figma
   * component set's own default variant.
   */
  variant?: 'tag' | 'shortcut';
  /**
   * Tag text for the `tag` variant. Rendered through the shipped `Tag`
   * component, which Figma constrains here to `variant="info" size="sm"`.
   */
  labelTag?: string;
  /** Keyboard-shortcut text (e.g. `"⌘H"`) for the `shortcut` variant. */
  labelShortcut?: string;
}

const ChatMenuItemExtras = React.forwardRef<
  HTMLSpanElement,
  ChatMenuItemExtrasProps
>(({ className, variant = 'tag', labelTag, labelShortcut, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex min-h-6 items-center justify-end gap-[var(--ui-sidebar-secondary-menu-item-extras-global-container-gap)] overflow-hidden',
      className
    )}
    {...props}
  >
    {variant === 'tag' && (
      <Tag variant="info" size="sm">
        {labelTag}
      </Tag>
    )}
    {variant === 'shortcut' && (
      <span className="ui-sidebar-secondary-menu-item-extras-global-shortcut-text-style whitespace-nowrap text-end text-[var(--ui-sidebar-secondary-menu-item-extras-global-shortcut-color)]">
        {labelShortcut}
      </span>
    )}
  </span>
));
ChatMenuItemExtras.displayName = 'ChatMenuItemExtras';

export { ChatMenuItemExtras };

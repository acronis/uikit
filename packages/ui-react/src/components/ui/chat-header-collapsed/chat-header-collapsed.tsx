import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';
import { TagIcon } from '../tag-icon';

// Mirrors the Figma component set named "ChatHeaderCollapsed" (raw data-name
// "ChatHeaderCollapsedChatHeader/chat/collapsed" — the layer name concatenated
// with its "ChatHeader/chat/collapsed" component-set path; confirmed directly
// against the live node rather than assumed from its "ChatHeaderExpanded"
// sibling), node 7329:24771: the header bar of the *collapsed* AI-chat rail.
// It is a static 48px-wide band holding one centered branding glyph — no tabs,
// no actions, unlike the expanded header.
//
// The glyph is composed through the already-shipped `TagIcon` (a 32px violet
// Avatar-tier icon chip) rather than rebuilt: the Figma node's "Avatar"
// instance (Color=Violet, Variant=Icon) is exactly TagIcon's own node family.
// `icon` is a slot (the Figma `Icon` INSTANCE_SWAP defaults to the generic
// SquareDashed placeholder), so the consumer supplies the real glyph.
//
// The header's horizontal padding is wired to `--ui-chat-header-padding-x`.
// (The Figma node binds this to `components/Chat/menuItem/paddingX` instead —
// the same duplicate binding ChatHeaderExpanded already flagged; both are
// 16px today, but a header must follow the *header* token or a brand that
// re-themes only one of them would drift. Flagged to design.)
export interface ChatHeaderCollapsedProps
  extends React.HTMLAttributes<HTMLElement> {
  /** The branding glyph, centered at 16px inside the composed `TagIcon`. */
  icon?: React.ReactNode;
  /**
   * Replace the rendered `<header>` with another element or component
   * (Base UI composition).
   */
  render?: useRender.RenderProp;
}

/**
 * Header bar of the collapsed AI-chat rail: a static 48px band centering one
 * branding glyph. Purely decorative — it renders no interactive content.
 */
const ChatHeaderCollapsed = React.forwardRef<
  HTMLElement,
  ChatHeaderCollapsedProps
>(({ className, icon, render, ...props }, ref) =>
  useRender({
    render,
    ref,
    defaultTagName: 'header',
    props: mergeProps<'header'>(
      {
        className: cn(
          'flex h-[var(--ui-chat-header-height)] w-[var(--ui-chat-container-collapsed-width)] shrink-0 items-center justify-center',
          'px-[var(--ui-chat-header-padding-x)]',
          'border-b-[length:var(--ui-chat-global-border-width)] border-[var(--ui-chat-global-border-color)] [border-bottom-style:var(--ui-chat-global-border-style)]',
          className
        ),
        children: <TagIcon icon={icon} />,
      },
      props
    ),
  })
);
ChatHeaderCollapsed.displayName = 'ChatHeaderCollapsed';

export { ChatHeaderCollapsed };

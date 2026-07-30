import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import {
  ArrowRotationTimeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { ButtonIcon } from '../button-icon';
import { Tag } from '../tag';

// Mirrors the Figma "ChatHeaderExpanded" component set (node 7329:24759): the
// header bar of the *expanded* AI-chat panel. It is a single row — a pill tab
// group on the inline-start side, a group of icon actions on the inline-end
// side — sitting on a 64px tall band with a bottom hairline. All geometry and
// color come from the `--ui-chat-*` component tier.
//
// The header's horizontal padding is wired to `--ui-chat-header-padding-x`.
// (The Figma node binds this to `components/Chat/menuItem/paddingX` instead;
// both are 16px today, but a header must follow the *header* token or a brand
// that re-themes only one of them would drift. Flagged to design.)
//
// Tab content is composed, not configured: the consumer passes
// `ChatHeaderExpandedTabs` + `ChatHeaderExpandedTab` children, so labels stay
// under the consumer's control (and therefore localizable).

/* -------------------------------------------------------------------------- *
 * PLACEHOLDER — swap for the real standalone `SegmentControl` component.
 *
 * `ChatHeaderExpandedTabs` / `ChatHeaderExpandedTab` below are a deliberately
 * local, minimal stand-in for the `SegmentControl` / `SegmentControlItem`
 * component set. SegmentControl is still IN PROGRESS in Figma, so it must not
 * be extracted into `components/ui/segment-control/` yet — an extracted
 * component would freeze an API the design has not settled.
 *
 * They are inlined here on purpose, and are styled from the *real*, already
 * shipped `--ui-segment-control-*` tokens-pd tier (verified to resolve), so
 * the visual result is correct even though the component boundary is not.
 *
 * WHEN SegmentControl SHIPS IN FIGMA:
 *   1. Build `components/ui/segment-control/` from its own node via
 *      /figma-component (full 7-file ui-spec, Code Connect, VR baselines).
 *   2. Delete `ChatHeaderExpandedTabs` + `ChatHeaderExpandedTab` from this file
 *      and re-export nothing in their place.
 *   3. Update this component's story/spec/docs to compose `SegmentControl`.
 *   4. Drop the PLACEHOLDER WARNING paragraph from
 *      packages/ui-spec/components/chat-header-expanded/index.yaml's
 *      `description`, and the warning callout in that spec's README.md.
 *
 * Known gaps vs. a real SegmentControl (intentionally NOT solved here):
 *   - No roving-tabindex / arrow-key navigation between tabs, and no
 *     `aria-controls` → tabpanel wiring (there are no panels in this node).
 *   - The overflow affordance renders the two scroll buttons but does not
 *     actually scroll or compute overflow — the design documents the chrome,
 *     not the behavior, and the real component will own it.
 *   - No `disabled` item state (the Figma SegmentControlScrollItem has one).
 * -------------------------------------------------------------------------- */

export interface ChatHeaderExpandedTabsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Render the trailing overflow-scroll affordance (the Figma `hasScroll`
   * property): a pair of chevron buttons pinned to the inline-end edge of the
   * tab group, shown when the tabs overflow their container.
   */
  hasScroll?: boolean;
  /** Accessible name for the "scroll tabs backward" affordance button. */
  scrollBackwardLabel?: string;
  /** Accessible name for the "scroll tabs forward" affordance button. */
  scrollForwardLabel?: string;
}

/** PLACEHOLDER (see the block comment above) — stands in for `SegmentControl`. */
const ChatHeaderExpandedTabs = React.forwardRef<
  HTMLDivElement,
  ChatHeaderExpandedTabsProps
>(
  (
    {
      className,
      children,
      hasScroll = false,
      scrollBackwardLabel = 'Scroll tabs backward',
      scrollForwardLabel = 'Scroll tabs forward',
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'relative flex shrink-0 items-start overflow-clip',
        'h-[var(--ui-segment-control-container-height)]',
        'rounded-[var(--ui-segment-control-container-border-radius)]',
        'border-[length:var(--ui-segment-control-container-border-width)] border-[var(--ui-segment-control-container-border-color)] [border-style:var(--ui-segment-control-container-border-style)]',
        'bg-[var(--ui-segment-control-container-color)]',
        'px-[var(--ui-segment-control-container-padding-x)] py-[var(--ui-segment-control-container-padding-y)]',
        className
      )}
      {...props}
    >
      <div
        role="tablist"
        className="flex min-w-px flex-1 items-start gap-[var(--ui-segment-control-container-gap)]"
      >
        {children}
      </div>
      {hasScroll ? (
        // Pinned flush to the group's inline-end edge, overlapping the 1px
        // container border (hence the -1px insets) exactly as the Figma
        // `SegmentControlScroll` instance does.
        <div className="absolute inset-y-[-1px] end-[-1px] flex items-center">
          <ChatHeaderExpandedTabsScrollButton label={scrollBackwardLabel}>
            <ChevronLeftIcon size={16} className="rtl:rotate-180" />
          </ChatHeaderExpandedTabsScrollButton>
          <ChatHeaderExpandedTabsScrollButton label={scrollForwardLabel}>
            <ChevronRightIcon size={16} className="rtl:rotate-180" />
          </ChatHeaderExpandedTabsScrollButton>
        </div>
      ) : null}
    </div>
  )
);
ChatHeaderExpandedTabs.displayName = 'ChatHeaderExpandedTabs';

/** PLACEHOLDER — the Figma `SegmentControlScrollItem` box-icon. */
function ChatHeaderExpandedTabsScrollButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'flex shrink-0 cursor-pointer items-center justify-center transition-colors',
        'h-[var(--ui-segment-control-box-icon-height)] w-[var(--ui-segment-control-box-icon-width)]',
        'border-s-[length:var(--ui-segment-control-box-icon-border-width)] border-[var(--ui-segment-control-box-icon-border-color)] [border-style:var(--ui-segment-control-box-icon-border-style)]',
        'bg-[var(--ui-segment-control-box-icon-color-idle)]',
        'hover:bg-[var(--ui-segment-control-box-icon-color-hover)]',
        'active:bg-[var(--ui-segment-control-box-icon-color-active)]',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0'
      )}
    >
      {children}
    </button>
  );
}

export interface ChatHeaderExpandedTabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Marks this tab as the selected one (the Figma `state=active` variant). */
  active?: boolean;
  /**
   * Optional trailing counter content (the Figma `hasCounter` property).
   * Rendered inside a `Tag` — pass the count itself (e.g. `7`), not a `Tag`.
   */
  counter?: React.ReactNode;
}

/** PLACEHOLDER (see the block comment above) — stands in for `SegmentControlItem`. */
const ChatHeaderExpandedTab = React.forwardRef<
  HTMLButtonElement,
  ChatHeaderExpandedTabProps
>(({ className, children, active = false, counter, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="tab"
    aria-selected={active}
    data-active={active ? '' : undefined}
    className={cn(
      'ui-segment-control-value-text-style',
      'flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap transition-colors',
      'h-[var(--ui-segment-control-item-height)]',
      'gap-[var(--ui-segment-control-item-gap)]',
      'px-[var(--ui-segment-control-item-padding-x)] py-[var(--ui-segment-control-item-padding-y)]',
      'rounded-[var(--ui-segment-control-item-border-radius)]',
      'border-[length:var(--ui-segment-control-item-border-width)] [border-style:var(--ui-segment-control-item-border-style)]',
      'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      active
        ? 'border-[var(--ui-segment-control-item-border-color-active)] bg-[var(--ui-segment-control-item-color-active)] text-[var(--ui-segment-control-value-color-active)]'
        : 'border-[var(--ui-segment-control-item-border-color-idle)] bg-[var(--ui-segment-control-item-color-idle)] text-[var(--ui-segment-control-value-color-idle)] hover:border-[var(--ui-segment-control-item-border-color-hover)] hover:bg-[var(--ui-segment-control-item-color-hover)] hover:text-[var(--ui-segment-control-value-color-hover)]',
      className
    )}
    {...props}
  >
    {children}
    {counter != null ? (
      <Tag variant="ai" size="sm">
        {counter}
      </Tag>
    ) : null}
  </button>
));
ChatHeaderExpandedTab.displayName = 'ChatHeaderExpandedTab';

/* ----------------------------- end placeholder ---------------------------- */

export interface ChatHeaderExpandedProps
  extends React.HTMLAttributes<HTMLElement> {
  /**
   * Show the secondary "conversation history" icon button before the primary
   * action (the Figma `hasHistory` property).
   */
  hasHistory?: boolean;
  /** Accessible name for the "new chat" action button. */
  newChatLabel?: string;
  /** Accessible name for the conversation-history button (`hasHistory`). */
  historyLabel?: string;
  /**
   * Replace the rendered `<header>` with another element or component
   * (Base UI composition).
   */
  render?: useRender.RenderProp;
}

/**
 * Header bar of the expanded AI-chat panel: composed pill tabs on the
 * inline-start side, icon actions on the inline-end side. Pass
 * `ChatHeaderExpandedTabs` / `ChatHeaderExpandedTab` as `children`.
 */
const ChatHeaderExpanded = React.forwardRef<
  HTMLElement,
  ChatHeaderExpandedProps
>(
  (
    {
      className,
      children,
      hasHistory = false,
      newChatLabel = 'New chat',
      historyLabel = 'Chat history',
      render,
      ...props
    },
    ref
  ) =>
    useRender({
      render,
      ref,
      defaultTagName: 'header',
      props: mergeProps<'header'>(
        {
          className: cn(
            'flex w-full items-center justify-between',
            'h-[var(--ui-chat-header-height)]',
            'px-[var(--ui-chat-header-padding-x)]',
            'border-b-[length:var(--ui-chat-global-border-width)] border-[var(--ui-chat-global-border-color)] [border-bottom-style:var(--ui-chat-global-border-style)]',
            className
          ),
          children: (
            <>
              {children}
              <div className="flex shrink-0 items-center gap-[var(--ui-gap-16)]">
                {hasHistory ? (
                  <ButtonIcon variant="secondary" aria-label={historyLabel}>
                    <ArrowRotationTimeIcon size={16} />
                  </ButtonIcon>
                ) : null}
                <ButtonIcon variant="secondary" aria-label={newChatLabel}>
                  <PlusIcon size={16} />
                </ButtonIcon>
              </div>
            </>
          ),
        },
        props
      ),
    })
);
ChatHeaderExpanded.displayName = 'ChatHeaderExpanded';

export { ChatHeaderExpanded, ChatHeaderExpandedTab, ChatHeaderExpandedTabs };

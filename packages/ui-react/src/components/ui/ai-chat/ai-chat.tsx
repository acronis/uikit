import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ClipboardTextIcon,
  MessageTextIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { AcronisAiMultiIcon } from '@acronis-platform/icons-react/solid-multi';

import { cn } from '@/lib/utils';
import { ChatHeaderCollapsed } from '../chat-header-collapsed';
import {
  ChatHeaderExpanded,
  ChatHeaderExpandedTab,
  ChatHeaderExpandedTabs,
} from '../chat-header-expanded';
import { ChatMenuItem } from '../chat-menu-item';
import { ChatMenuItemCollapsed } from '../chat-menu-item-collapsed';
import { ChatMenuItemExtras } from '../chat-menu-item-extras';

// AiChat — the root AI-chat shell (Figma "AiChat" component set, node
// 7329:24933), assembled from the four parts already shipped:
// `ChatHeaderCollapsed`, `ChatHeaderExpanded`, `ChatMenuItem`,
// `ChatMenuItemCollapsed` (+ `ChatMenuItemExtras` for the shortcut labels).
// It switches between three structurally distinct layouts:
//
//   collapsed   (7329:24930) — a 48px icon-only rail
//   expanded    (7329:24931) — a 384-512px panel with tabbed navigation
//   full-width  (7329:24932) — a two-pane layout: a 256px chat-list sidebar
//                               + a full-height conversation body
//
// Per the task brief, the root's prop surface is intentionally minimal —
// `variant` only. Content/config for each variant's parts is meant to come
// through composition, not a flattened prop table. `children` is wired to
// the one region the reference Figma extraction itself treats as consumer
// content (the "Feed" panel) for `expanded` and `full-width` — `collapsed`
// has no room to show it and the capture renders nothing there.
//
// Everything else the design shows — the header tab set ("Acronis AI" /
// "Tasks"), the sidebar's chat-history list ("New chat" only, in this
// capture), the body's per-conversation title ("Chat name"), and the
// footer/menu variant-switch actions — has no available prop or slot under
// the `variant`-only constraint, so it ships here as fixed, non-localizable
// English copy matching the captured instance. This is flagged, not
// accidental: those are exactly the open questions raised to design/product
// (see the component's ui-spec README) — a real per-conversation title, an
// actual chat-history list, and a live tab/unread-count model all need a
// resolved content-slot API before this can be more than a static shell.
// The variant-switch controls below (Maximize/Minimize/Collapse chat, New
// chat) are rendered as inert buttons for the same reason: the drag-resize
// vs. discrete-action interaction model (⌘H/⌘C/⌘N) is unconfirmed, so no
// `onClick`/`onVariantChange` behavior is wired yet.
export interface AiChatProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Which of the three AI-chat layouts to render.
   * @default 'full-width'
   */
  variant?: 'collapsed' | 'expanded' | 'full-width';
  /**
   * The chat feed/content area. Only rendered for `expanded` and
   * `full-width` — the `collapsed` rail has no room to show it.
   */
  children?: React.ReactNode;
  /**
   * Replace the rendered root element with another element or component
   * (Base UI composition).
   */
  render?: useRender.RenderProp;
}

const footerBorderClassName =
  'border-t-[length:var(--ui-chat-global-border-width)] border-[var(--ui-chat-global-border-color)] [border-top-style:var(--ui-chat-global-border-style)]';

const AiChat = React.forwardRef<HTMLElement, AiChatProps>(
  ({ className, variant = 'full-width', children, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'aside',
      props: mergeProps<'aside'>(
        {
          className: cn(
            'flex h-full items-start overflow-clip',
            'bg-[var(--ui-chat-container-color)]',
            'border-s-[length:var(--ui-chat-global-border-width)] border-[var(--ui-chat-global-border-color)] [border-inline-start-style:var(--ui-chat-global-border-style)]',
            variant === 'collapsed' &&
              'w-[var(--ui-chat-container-collapsed-width)] flex-col',
            variant === 'expanded' &&
              'w-[var(--ui-chat-container-expanded-max-width)] min-w-[var(--ui-chat-container-expanded-min-width)] max-w-[var(--ui-chat-container-expanded-max-width)] flex-col',
            variant === 'full-width' && 'w-full flex-1',
            className
          ),
          children:
            variant === 'collapsed' ? (
              <>
                <ChatHeaderCollapsed icon={<AcronisAiMultiIcon size={16} />} />
                <ChatMenuItemCollapsed
                  icon={<MessageTextIcon size={16} />}
                  aria-label="Chat"
                />
                <ChatMenuItemCollapsed
                  icon={<ClipboardTextIcon size={16} />}
                  hasAlert
                  aria-label="Tasks (new activity)"
                />
                <div
                  className="min-h-0 w-full flex-1"
                  role="presentation"
                  aria-hidden="true"
                />
                <footer
                  className={cn(
                    'flex w-full flex-wrap items-center overflow-clip',
                    footerBorderClassName
                  )}
                >
                  <ChatMenuItemCollapsed
                    icon={<PanelLeftCloseIcon size={16} />}
                    aria-label="Maximize chat"
                  />
                  <ChatMenuItemCollapsed
                    icon={<ChevronsLeftIcon size={16} />}
                    aria-label="Show full-width chat"
                  />
                </footer>
              </>
            ) : variant === 'expanded' ? (
              <>
                <ChatHeaderExpanded>
                  {/* PLACEHOLDER — inlined SegmentControl markup (see
                      chat-header-expanded.tsx); swap for a real
                      `SegmentControl` once it ships in Figma. */}
                  <ChatHeaderExpandedTabs>
                    <ChatHeaderExpandedTab active>
                      Acronis AI
                    </ChatHeaderExpandedTab>
                    <ChatHeaderExpandedTab>Tasks</ChatHeaderExpandedTab>
                  </ChatHeaderExpandedTabs>
                </ChatHeaderExpanded>
                <div className="min-h-0 w-full flex-1 overflow-auto">
                  {children}
                </div>
                <footer
                  className={cn(
                    'flex w-full flex-wrap items-center overflow-clip',
                    footerBorderClassName
                  )}
                >
                  <ChatMenuItem
                    icon={<PanelLeftCloseIcon size={16} />}
                    label="Maximize chat"
                    hasExtras
                    extras={
                      <ChatMenuItemExtras
                        variant="shortcut"
                        labelShortcut="⌘H"
                      />
                    }
                  />
                  <ChatMenuItem
                    icon={<ChevronsRightIcon size={16} />}
                    label="Collapse chat"
                    hasExtras
                    extras={
                      <ChatMenuItemExtras
                        variant="shortcut"
                        labelShortcut="⌘C"
                      />
                    }
                  />
                </footer>
              </>
            ) : (
              <>
                <aside
                  className={cn(
                    'flex h-full flex-col items-start overflow-clip',
                    'w-[var(--ui-chat-sidebar-container-width)] shrink-0',
                    'border-e-[length:var(--ui-chat-global-border-width)] border-[var(--ui-chat-global-border-color)] [border-inline-end-style:var(--ui-chat-global-border-style)]'
                  )}
                >
                  <div
                    className="flex h-[var(--ui-chat-sidebar-header-height)] w-full shrink-0 items-center overflow-clip px-[var(--ui-chat-sidebar-header-padding-x)]"
                    role="heading"
                    aria-level={2}
                  >
                    <p className="truncate text-2xl leading-8 text-foreground">
                      Acronis AI
                    </p>
                  </div>
                  <div className="flex min-h-0 w-full flex-1 flex-col items-start overflow-auto">
                    <ChatMenuItem
                      icon={<PlusIcon size={16} />}
                      label="New chat"
                      hasExtras
                      extras={
                        <ChatMenuItemExtras
                          variant="shortcut"
                          labelShortcut="⌘N"
                        />
                      }
                    />
                  </div>
                  <footer
                    className={cn(
                      'flex w-full flex-wrap items-center overflow-clip',
                      footerBorderClassName
                    )}
                  >
                    <ChatMenuItem
                      icon={<PanelLeftOpenIcon size={16} />}
                      label="Minimize chat"
                      hasExtras
                      extras={
                        <ChatMenuItemExtras
                          variant="shortcut"
                          labelShortcut="⌘H"
                        />
                      }
                    />
                    <ChatMenuItem
                      icon={<ChevronsRightIcon size={16} />}
                      label="Collapse chat"
                      hasExtras
                      extras={
                        <ChatMenuItemExtras
                          variant="shortcut"
                          labelShortcut="⌘C"
                        />
                      }
                    />
                  </footer>
                </aside>
                <div className="flex h-full min-w-0 flex-1 flex-col items-start">
                  <div
                    className="flex h-[var(--ui-chat-header-height)] w-full shrink-0 items-center overflow-clip border-b-[length:var(--ui-chat-global-border-width)] border-[var(--ui-chat-global-border-color)] bg-background px-[var(--ui-chat-sidebar-header-padding-x)] [border-bottom-style:var(--ui-chat-global-border-style)]"
                    role="heading"
                    aria-level={2}
                  >
                    <p className="truncate text-2xl leading-8 text-foreground">
                      Chat name
                    </p>
                  </div>
                  <div className="min-h-0 w-full flex-1 overflow-auto">
                    {children}
                  </div>
                </div>
              </>
            ),
        },
        props
      ),
    })
);
AiChat.displayName = 'AiChat';

export { AiChat };

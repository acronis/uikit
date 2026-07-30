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
import { useDocDir } from '@/lib/use-doc-dir';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
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
// capture), the body's per-conversation title ("Chat name") — has no
// available prop or slot under the `variant`-only constraint, so it ships
// here as fixed, non-localizable English copy matching the captured
// instance. This is flagged, not accidental: those are exactly the open
// questions raised to design/product (see the component's ui-spec README) —
// a real per-conversation title, an actual chat-history list, and a live
// tab/unread-count model all need a resolved content-slot API before this
// can be more than a static shell.
//
// The variant-switch actions (Maximize/Minimize/Collapse chat) ARE wired —
// see "Variant switching + resize" below — answering the README's open
// question #1 by combining both interaction models it described as
// mutually exclusive: discrete actions (the footer buttons + `⌘H`/`⌘C`
// shortcuts drawn in Figma) AND a continuous drag-resize that snaps to
// `collapsed` past a threshold, mirroring `SidebarSecondaryResizeEdge`
// (`sidebar-secondary.tsx`). `⌘N` ("New chat") stays inert — it starts a new
// conversation, not a variant transition, and there is no chat-session model
// yet to wire it to.
export type AiChatVariant = 'collapsed' | 'expanded' | 'full-width';

/**
 * Controlled + uncontrolled variant state (the same idiom
 * `useControllableBoolean` uses in sidebar-primary.tsx/sidebar-secondary.tsx,
 * generalized to the 3-way `AiChatVariant` union instead of a boolean).
 */
function useControllableVariant(
  controlled: AiChatVariant | undefined,
  defaultValue: AiChatVariant,
  onChange?: (next: AiChatVariant) => void
): [AiChatVariant, (next: AiChatVariant) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;
  const setValue = React.useCallback(
    (next: AiChatVariant) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [value, setValue];
}

export interface AiChatProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Controlled variant. When provided, variant transitions (button clicks,
   * drag-resize) only fire `onVariantChange` — this component never changes
   * itself. Omit it (use `defaultVariant` instead) for normal uncontrolled use.
   * @default 'full-width'
   */
  variant?: AiChatVariant;
  /** Uncontrolled initial variant. Ignored when `variant` is provided. */
  defaultVariant?: AiChatVariant;
  /** Fires whenever a button or drag-resize changes the variant. */
  onVariantChange?: (variant: AiChatVariant) => void;
  /**
   * Enable the draggable resize edge on the panel's start border (the shared
   * boundary with whatever sits beside it, e.g. `AppShellChatContent`).
   * Dragging within `expanded`'s width range resizes it live; dragging past
   * the floor snaps to `collapsed` (and back out past the same threshold
   * re-expands it) — mirroring `SidebarSecondaryResizeEdge`. No resize edge
   * renders for `full-width` (a takeover layout, not a split).
   * @default false
   */
  resizable?: boolean;
  /** Controlled width in px while `variant="expanded"` (only meaningful with `resizable`). */
  width?: number;
  /** Fires when the width changes due to a drag/keyboard interaction. */
  onWidthChange?: (width: number) => void;
  /** Accessible label for the resize edge (`role="separator"`). Defaults to `'Resize chat'`. */
  resizeAriaLabel?: string;
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

// ---------------------------------------------------------------------------
// Variant switching + resize — `expanded`'s width bounds are real design
// tokens (`--ui-chat-container-expanded-min/max-width`, 384/512px), mirrored
// here as JS numbers for the drag math (same "duplicate the CSS var's value
// as a constant" idiom `app-shell-chat.tsx`'s `CHAT_*` constants use — there
// is no single-sourcing a CSS custom property into JS without reading the
// DOM). Unlike `AppShellChatChat`'s width, this is NOT viewport-responsive —
// it only changes via drag/keyboard/button, matching `SidebarSecondary`'s
// simpler (non-live) width model rather than `AppShellChatChat`'s live one.
// ---------------------------------------------------------------------------

const AI_CHAT_EXPANDED_MIN_WIDTH = 384; // --ui-chat-container-expanded-min-width
const AI_CHAT_EXPANDED_MAX_WIDTH = 512; // --ui-chat-container-expanded-max-width; also the default/reset width
// Mirrors `SidebarSecondaryResizeEdge`'s `collapseThreshold = minWidth / 2`.
const AI_CHAT_COLLAPSE_THRESHOLD = AI_CHAT_EXPANDED_MIN_WIDTH / 2;

/** The subset of state the resize edge's pointer/keyboard handlers need. */
export interface AiChatResizeContext {
  variant: AiChatVariant;
  setVariant: (variant: AiChatVariant) => void;
  width: number;
  setWidth: (width: number) => void;
  resetWidth: () => void;
}

/**
 * Pointerdown handler for the resize edge. Like `AppShellChatChat`'s edge,
 * the panel is anchored to the row's END, so dragging the pointer toward the
 * row's start grows it. UNLIKE `AppShellChatChat`, crossing
 * `AI_CHAT_COLLAPSE_THRESHOLD` while `expanded` snaps to `variant="collapsed"`
 * instead of clamping at a floor width — and dragging back out past the same
 * threshold while `collapsed` snaps back to `expanded` — both mirroring
 * `SidebarSecondaryResizeEdge`'s `collapseThreshold` logic exactly, just
 * flipped to this panel's end-anchored geometry. Exported for direct unit
 * testing; `AiChatResizeEdge` is the real caller.
 *
 * `ctxRef` (not a plain snapshot) so the drag's `window` listeners, live for
 * the whole gesture, always call the LATEST `setVariant`/`setWidth` — same
 * defensive pattern as `handleResizePointerDown` in `app-shell-chat.tsx`.
 */
export function handleAiChatResizePointerDown(
  e: React.PointerEvent<HTMLDivElement>,
  ctxRef: { current: AiChatResizeContext },
  { onDragStart, onDragEnd }: { onDragStart?: () => void; onDragEnd?: () => void } = {}
): void {
  e.preventDefault();
  const el = e.currentTarget;
  const { pointerId } = e;
  el.setPointerCapture(pointerId);
  onDragStart?.();

  const chatEl = el.closest('[data-slot="ai-chat"]') as HTMLElement | null;
  if (!chatEl) {
    onDragEnd?.();
    el.releasePointerCapture(pointerId);
    return;
  }
  chatEl.style.transitionProperty = 'none';
  const isRtl = getComputedStyle(chatEl).direction === 'rtl';
  const chatRect = chatEl.getBoundingClientRect();

  const onPointerMove = (ev: PointerEvent) => {
    if (ev.pointerId !== pointerId) return;
    const pointerWidth = isRtl
      ? ev.clientX - chatRect.left
      : chatRect.right - ev.clientX;
    const { variant, setVariant, setWidth } = ctxRef.current;

    if (variant === 'expanded') {
      if (pointerWidth < AI_CHAT_COLLAPSE_THRESHOLD) {
        setVariant('collapsed');
      } else {
        setWidth(
          Math.min(
            Math.max(pointerWidth, AI_CHAT_EXPANDED_MIN_WIDTH),
            AI_CHAT_EXPANDED_MAX_WIDTH
          )
        );
      }
    } else if (variant === 'collapsed') {
      if (pointerWidth > AI_CHAT_COLLAPSE_THRESHOLD) {
        setVariant('expanded');
      }
    }
  };

  const endDrag = (ev: PointerEvent) => {
    if (ev.pointerId !== pointerId) return;
    onDragEnd?.();
    chatEl.style.transitionProperty = '';
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
}

/**
 * Keydown handler for the resize edge: ArrowLeft/ArrowRight resize by 16px
 * while `expanded` (shrinking past the floor snaps to `collapsed`, matching
 * the pointer-drag threshold behavior), or expand `collapsed` back out.
 * `growKey`/`shrinkKey` follow `AppShellChatChat`'s convention (not
 * `SidebarSecondaryResizeEdge`'s, which is flipped) since this panel shares
 * the same end-anchored geometry. Home resets to `AI_CHAT_EXPANDED_MAX_WIDTH`
 * and expands if collapsed. Exported for direct testing; `AiChatResizeEdge`
 * is the real caller.
 */
export function handleAiChatResizeKeyDown(
  e: React.KeyboardEvent<HTMLDivElement>,
  ctx: AiChatResizeContext,
  dir: 'ltr' | 'rtl'
): void {
  const { variant, setVariant, width, setWidth, resetWidth } = ctx;
  const step = 16;
  const growKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const shrinkKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

  if (e.key === growKey) {
    e.preventDefault();
    if (variant === 'collapsed') {
      setVariant('expanded');
    } else if (variant === 'expanded') {
      setWidth(Math.min(width + step, AI_CHAT_EXPANDED_MAX_WIDTH));
    }
  } else if (e.key === shrinkKey && variant === 'expanded') {
    e.preventDefault();
    const next = width - step;
    if (next < AI_CHAT_EXPANDED_MIN_WIDTH) {
      setVariant('collapsed');
    } else {
      setWidth(next);
    }
  } else if (e.key === 'Home') {
    e.preventDefault();
    if (variant === 'collapsed') setVariant('expanded');
    resetWidth();
  }
}

const defaultResizeTooltip = (
  <>
    <span className="font-semibold">Resize:</span> Drag
    <br />
    <span className="font-semibold">Reset size:</span> Double click
  </>
);

/**
 * Internal drag/keyboard handle rendered on the panel's start border. Only
 * rendered by `AiChat` itself when `resizable` — not meant to be composed
 * directly, but exported (alongside its pure handlers above) for testing.
 */
export function AiChatResizeEdge({
  ctx,
  resizeAriaLabel = 'Resize chat',
  resizeTooltip = defaultResizeTooltip,
}: {
  ctx: AiChatResizeContext;
  resizeAriaLabel?: string;
  resizeTooltip?: React.ReactNode;
}) {
  const dir = useDocDir();

  // Kept in sync every render so a drag started earlier still calls the
  // LATEST state setters — see `handleAiChatResizePointerDown`'s doc comment.
  const ctxRef = React.useRef(ctx);
  ctxRef.current = ctx;

  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setTooltipOpen(false);
    handleAiChatResizePointerDown(e, ctxRef, {
      onDragStart: () => setDragging(true),
      onDragEnd: () => setDragging(false),
    });
  };

  const handleDoubleClick = () => {
    if (ctx.variant === 'collapsed') ctx.setVariant('expanded');
    ctx.resetWidth();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleAiChatResizeKeyDown(e, ctx, dir);
  };

  const handleTooltipOpenChange = (open: boolean) => {
    if (dragging) return;
    setTooltipOpen(open);
  };

  return (
    <Tooltip
      open={tooltipOpen}
      onOpenChange={handleTooltipOpenChange}
      trackCursorAxis="y"
    >
      <TooltipTrigger
        render={
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={resizeAriaLabel}
            className={cn(
              // Same 17px hit-area/focus-ring treatment as
              // `AppShellChatResizeEdge`/`SidebarSecondaryResizeEdge`.
              'absolute start-0 top-0 h-full w-[17px] ltr:-translate-x-1/2 rtl:translate-x-1/2 cursor-[var(--ui-resizable-cursor,ew-resize)] z-10',
              'after:absolute after:inset-y-0 after:inset-x-0 after:mx-auto after:w-0 after:pointer-events-none',
              'after:[border-inline-start-width:var(--ui-resizable-border-width,1px)] after:border-solid after:border-transparent',
              'focus-visible:outline-none focus-visible:after:[border-inline-start-color:var(--ui-resizable-border-color-active)] focus-visible:after:[box-shadow:0_0_0_3px_var(--ui-focus-primary)]'
            )}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onDoubleClick={handleDoubleClick}
          />
        }
      />
      {resizeTooltip != null && (
        <TooltipContent side={dir === 'rtl' ? 'right' : 'left'} align="center">
          {resizeTooltip}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
AiChatResizeEdge.displayName = 'AiChatResizeEdge';

const AiChat = React.forwardRef<HTMLElement, AiChatProps>(
  (
    {
      className,
      variant: variantProp,
      defaultVariant = 'full-width',
      onVariantChange,
      resizable = false,
      width: widthProp,
      onWidthChange,
      resizeAriaLabel = 'Resize chat',
      children,
      render,
      ...props
    },
    ref
  ) => {
    const [variant, setVariant] = useControllableVariant(
      variantProp,
      defaultVariant,
      onVariantChange
    );

    const isWidthControlled = widthProp !== undefined;
    const [widthState, setWidthState] = React.useState(
      AI_CHAT_EXPANDED_MAX_WIDTH
    );
    const width = isWidthControlled ? widthProp : widthState;
    const setWidth = React.useCallback(
      (next: number) => {
        if (!isWidthControlled) setWidthState(next);
        onWidthChange?.(next);
      },
      [isWidthControlled, onWidthChange]
    );
    // Reset means "go back to the default width", not "clamp to some other
    // fixed value" — matches `AppShellChatChat`'s `resetWidth` naming, though
    // (unlike that component) there's no live viewport tracking to resume
    // here, just the one constant.
    const resetWidth = React.useCallback(() => {
      if (!isWidthControlled) setWidthState(AI_CHAT_EXPANDED_MAX_WIDTH);
      onWidthChange?.(AI_CHAT_EXPANDED_MAX_WIDTH);
    }, [isWidthControlled, onWidthChange]);

    const resizeContext = React.useMemo<AiChatResizeContext>(
      () => ({ variant, setVariant, width, setWidth, resetWidth }),
      [variant, setVariant, width, setWidth, resetWidth]
    );

    // Only `expanded` has a meaningful draggable width — apply the inline
    // override ONLY there so `collapsed`'s fixed 48px and `full-width`'s
    // `w-full` are never fought by a stale inline style.
    const inlineStyle: React.CSSProperties | undefined =
      resizable && variant === 'expanded' ? { width } : undefined;

    return useRender({
      render,
      ref,
      defaultTagName: 'aside',
      props: mergeProps<'aside'>(
        {
          ...({
            'data-slot': 'ai-chat',
            'data-variant': variant,
          } as Record<string, string>),
          style: inlineStyle,
          className: cn(
            'relative flex h-full items-start overflow-clip',
            'bg-[var(--ui-chat-container-color)]',
            'border-s-[length:var(--ui-chat-global-border-width)] border-[var(--ui-chat-global-border-color)] [border-inline-start-style:var(--ui-chat-global-border-style)]',
            variant === 'collapsed' &&
              'w-[var(--ui-chat-container-collapsed-width)] flex-col',
            variant === 'expanded' &&
              'w-[var(--ui-chat-container-expanded-max-width)] min-w-[var(--ui-chat-container-expanded-min-width)] max-w-[var(--ui-chat-container-expanded-max-width)] flex-col',
            variant === 'full-width' && 'w-full flex-1',
            resizable && variant !== 'full-width' && 'transition-[width]',
            className
          ),
          children: (
            <>
              {variant === 'collapsed' ? (
                <>
                  <ChatHeaderCollapsed
                    icon={<AcronisAiMultiIcon size={16} />}
                  />
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
                      onClick={() => setVariant('expanded')}
                    />
                    <ChatMenuItemCollapsed
                      icon={<ChevronsLeftIcon size={16} />}
                      aria-label="Show full-width chat"
                      onClick={() => setVariant('full-width')}
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
                      onClick={() => setVariant('full-width')}
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
                      onClick={() => setVariant('collapsed')}
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
                        onClick={() => setVariant('expanded')}
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
                        onClick={() => setVariant('collapsed')}
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
              )}
              {resizable && variant !== 'full-width' && (
                <AiChatResizeEdge
                  ctx={resizeContext}
                  resizeAriaLabel={resizeAriaLabel}
                />
              )}
            </>
          ),
        },
        props
      ),
    });
  }
);
AiChat.displayName = 'AiChat';

export { AiChat };

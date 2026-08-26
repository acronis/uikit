import * as React from 'react';
import { AcronisIcon } from '@acronis-platform/icons-react/solid-mono';

import { cn } from '@/lib/utils';
import { useDocDir } from '@/lib/use-doc-dir';
import {
  BREAKPOINT_XL,
  BREAKPOINT_3XL,
  getViewportWidth,
} from '@/lib/breakpoints';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// AppShellChat — a 3-section, horizontally resizable application scaffold:
//
//   SidebarRail (SidebarPrimary [+ SidebarSecondary]) | Content | Chat
//
// The Chat slot is optional — omit `AppShellChatChat` and the same scaffold
// serves an ordinary two-column console screen. The rich sidebars are reused
// verbatim from `../sidebar-primary` / `../sidebar-secondary`; this component
// owns only the Content ↔ Chat split.
//
// Sizing model (requirement: sidebar interactions never resize Chat):
//   • Content is `flex-1 min-w-0` — it absorbs every width change from the
//     sidebars expanding/collapsing/resizing, and can shrink all the way to 0.
//   • Chat has an explicit pixel width — driven LIVE by responsive Tailwind
//     classes (`w-12 xl:w-md 3xl:w-lg`, reflowing on every browser resize)
//     until the user drags/keyboard-resizes it, at which point an inline
//     style override takes over and freezes it until double-click/Home
//     reset — so it is unaffected by sidebar interactions either way. No
//     percentage sizing anywhere — this is why we do NOT reuse the
//     `Resizable` component (react-resizable-panels sizes panels as a
//     percentage of their group, which would break this invariant since the
//     sidebars sit outside that group).
//
// Chat is resize-ONLY (drag the handle on its START border, the shared
// boundary with Content; double-click resets to the default width; arrow
// keys nudge it). There is no separate expand/collapse or full-width toggle —
// dragging past the floor width (`CHAT_MIN_WIDTH`) simply stops there (the
// header switches to an icon-only rail at that width), and dragging the other
// direction can take Chat all the way to full width: the max resize bound is
// computed from the ACTUAL available row space (row width minus everything
// except Content, which can shrink to 0), not a fixed constant — otherwise a
// fixed cap would strand Content with a bogus "minimum" width once both
// sidebars are collapsed and there's plenty of room to give Chat.
//
// All colors resolve to `--ui-*` tokens (bridged `bg-background`, white, for
// the root/Chat surfaces; bridged `bg-muted` — `--ui-background-surface-secondary`,
// the same token SidebarSecondary's container uses — for Content's canvas, so
// Content reads as the same page surface as the secondary sidebar rather than a
// separate white card. The Content/Chat boundary uses
// `--ui-border-on-surface-divider`, the same divider token the design uses for
// these seams — NOT the bridged `border-border`, which is a different token).
// No hex, no invented tokens.

// There is no design token for the chat width (this is a pure layout
// composition — DESIGN: no `--ui-app-shell-chat-*` tokens exist), so these JS
// constants drive the default/floor and the drag-resize clamping range,
// mirroring `SIDEBAR_EXPANDED_WIDTH` in `sidebar-secondary.tsx`. They also
// double as the pixel values baked into Chat's own responsive width classes
// below (`w-12` — Tailwind's spacing scale, 3rem = 48px; `xl:w-md` /
// `3xl:w-lg` — Tailwind's named container-scale width utilities, 28rem/32rem
// = 448px/512px).
const CHAT_DEFAULT_WIDTH = 512; // widest tier AND the double-click/Home reset target
const CHAT_WIDTH_NARROW = 448; // 1280-1679 tier
const CHAT_MIN_WIDTH = 48; // floor while resizing, and the narrowest tier — matches the sidebars' collapsed rail width; below this the header would have no room for a label, so it shows the icon instead
// Fallback ceiling used only when the available row width can't be measured
// from the DOM yet (e.g. before first layout). In practice the resize handle
// always computes the real ceiling — see `getResizeMaxWidth` — so Chat can
// reach full width instead of being stranded below whatever this constant is.
const CHAT_MAX_WIDTH_FALLBACK = CHAT_DEFAULT_WIDTH * 2;

// `BREAKPOINT_XL`/`BREAKPOINT_3XL` (imported above) are the SAME breakpoints
// Chat's own `xl:`/`3xl:` width classes below use — see `@/lib/breakpoints`
// for why they're plain JS constants instead of something read live from
// CSS, and for the "keep both files in sync" note.

// ---------------------------------------------------------------------------
// useAppShellChatInitialLayout — breakpoint-derived INITIAL `defaultExpanded`
// for the two sidebars, resolved ONCE from the viewport width at first render
// and frozen after that — a later browser resize, or the user manually
// toggling a sidebar, never re-derives it (design requirement: only the very
// first paint is breakpoint-aware; Chat's own width, further below, is the
// opposite — genuinely live — since it's a plain CSS width, not a child's
// one-shot `defaultExpanded` prop).
//
// This can't use the "SSR-safe default, then sync in an effect" pattern
// `useDocDir` (`src/lib/use-doc-dir.ts`) uses elsewhere in this package: that
// pattern relies on a wrong value for one frame being harmless, corrected by
// a re-render once an effect fires post-mount. Here the fields seed
// SidebarPrimary/SidebarSecondary's `defaultExpanded` prop, which — exactly
// like this hook's own `useState` below — is read ONLY on that component's
// first render (`useControllableBoolean` in sidebar-primary.tsx); a prop
// change after mount is silently ignored. So the value has to be right on
// the very first render, which means reading `window.innerWidth`
// synchronously via a lazy `useState` initializer — mirroring the same
// "read the default once, freeze it" idiom `useControllableBoolean` already
// uses — instead of deferring to an effect.
// ---------------------------------------------------------------------------

export interface AppShellChatInitialLayout {
  /** Initial `defaultExpanded` for SidebarPrimary. */
  primaryExpanded: boolean;
  /** Initial `defaultExpanded` for SidebarSecondary (when the screen has one). */
  secondaryExpanded: boolean;
}

const WIDE_SIDEBAR_LAYOUT: AppShellChatInitialLayout = {
  primaryExpanded: true,
  secondaryExpanded: true,
};
const NARROW_SIDEBAR_LAYOUT: AppShellChatInitialLayout = {
  primaryExpanded: false,
  secondaryExpanded: true,
};

/**
 * Pure breakpoint → layout mapping, exported for direct unit testing (the
 * same convention `getResizeMaxWidth` above uses). `viewportWidth` of
 * `undefined` (no `window`, e.g. SSR) falls back to `WIDE_SIDEBAR_LAYOUT` —
 * the same value this component unconditionally hardcoded before this
 * feature existed. Below `BREAKPOINT_3XL` the output is always
 * `NARROW_SIDEBAR_LAYOUT` (primary closed), all the way down — the sidebars
 * have no tier cut at `BREAKPOINT_XL` the way Chat's own width does; there is
 * no separate floor tier either.
 */
export function getAppShellChatInitialLayout(
  viewportWidth: number | undefined
): AppShellChatInitialLayout {
  if (viewportWidth === undefined || viewportWidth >= BREAKPOINT_3XL) {
    return WIDE_SIDEBAR_LAYOUT;
  }
  return NARROW_SIDEBAR_LAYOUT;
}

/**
 * Reads the breakpoint-derived initial sidebar layout ONCE, at first render
 * — see the rationale above. Consumers wire the two fields into
 * `SidebarPrimary`/`SidebarSecondary`'s existing `defaultExpanded` prop.
 */
export function useAppShellChatInitialLayout(): AppShellChatInitialLayout {
  const [layout] = React.useState(() =>
    getAppShellChatInitialLayout(getViewportWidth())
  );
  return layout;
}

// ---------------------------------------------------------------------------
// getLiveChatDefaultWidth / useLiveChatDefaultWidth — Chat's OWN width is
// rendered by plain responsive Tailwind classes (`w-12 xl:w-md 3xl:w-lg`,
// see `AppShellChatChat` below) — genuinely live, reflowing on every browser
// resize, no JS involved in the visual result. This hook exists only for the
// bookkeeping the CSS can't cover by itself: `compact` (the icon-only header)
// is a structural render decision, not just a visual one, and the keyboard
// resize handler needs a numeric starting point to nudge from — both need an
// actual number, not a media query. It mirrors the CSS classes' three tiers
// as plain numbers (duplicating 512/448/48 is unavoidable — those numbers
// already exist twice, once in this file's JS constants above and once
// baked into the Tailwind class names below; there's no single-sourcing
// that further) but stays live via a `resize` listener, matching the design
// requirement that Chat — unlike the sidebars above — is NOT frozen at mount.
// ---------------------------------------------------------------------------

/** Pure viewport → width mapping, exported for direct unit testing. */
export function getLiveChatDefaultWidth(viewportWidth: number | undefined): number {
  if (viewportWidth === undefined || viewportWidth >= BREAKPOINT_3XL) {
    return CHAT_DEFAULT_WIDTH;
  }
  if (viewportWidth >= BREAKPOINT_XL) return CHAT_WIDTH_NARROW;
  return CHAT_MIN_WIDTH;
}

function useLiveChatDefaultWidth(): number {
  const [width, setWidth] = React.useState(() =>
    getLiveChatDefaultWidth(getViewportWidth())
  );
  React.useEffect(() => {
    const onResize = () => setWidth(getLiveChatDefaultWidth(getViewportWidth()));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

const defaultResizeTooltip = (
  <>
    <span className="font-semibold">Resize:</span> Drag
    <br />
    <span className="font-semibold">Reset size:</span> Double click
  </>
);

// ---------------------------------------------------------------------------
// AppShellChat — root
// ---------------------------------------------------------------------------

export type AppShellChatProps = React.ComponentPropsWithoutRef<'div'>;

const AppShellChat = React.forwardRef<HTMLDivElement, AppShellChatProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-shell-chat"
      className={cn('flex h-full w-full bg-background', className)}
      {...props}
    >
      {children}
    </div>
  )
);
AppShellChat.displayName = 'AppShellChat';

// ---------------------------------------------------------------------------
// AppShellChatSidebar — layout wrapper for the reused sidebar rail
// ---------------------------------------------------------------------------

const AppShellChatSidebar = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'aside'>
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    data-slot="app-shell-chat-sidebar"
    className={cn('flex h-full shrink-0', className)}
    {...props}
  />
));
AppShellChatSidebar.displayName = 'AppShellChatSidebar';

// ---------------------------------------------------------------------------
// AppShellChatContent — the page column
// ---------------------------------------------------------------------------

const AppShellChatContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="app-shell-chat-content"
    className={cn('flex h-full min-w-0 flex-1 flex-col bg-muted', className)}
    {...props}
  />
));
AppShellChatContent.displayName = 'AppShellChatContent';

const AppShellChatContentHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="app-shell-chat-content-header"
    className={cn(
      'flex shrink-0 flex-col gap-3 border-b border-[var(--ui-border-on-surface-divider)] p-4',
      className
    )}
    {...props}
  />
));
AppShellChatContentHeader.displayName = 'AppShellChatContentHeader';

const AppShellChatContentBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="app-shell-chat-content-body"
    className={cn('flex flex-1 flex-col overflow-auto p-4', className)}
    {...props}
  />
));
AppShellChatContentBody.displayName = 'AppShellChatContentBody';

// ---------------------------------------------------------------------------
// Chat-panel context — resize state, shared to the Chat parts and the
// internal resize edge.
// ---------------------------------------------------------------------------

export interface AppShellChatChatContextValue {
  /** Derived from `width <= minWidth` — true at the resize floor, where the header shows the icon instead of the label. */
  compact: boolean;
  width: number;
  setWidth: (width: number) => void;
  /**
   * Clears any drag/keyboard override and restores the LIVE, breakpoint-driven
   * width (see `getLiveChatDefaultWidth` above) — the double-click/Home
   * target. NOT the same as `setWidth(someFixedNumber)`: that would just
   * swap one frozen override for another and permanently disable live
   * viewport tracking, which is the whole point of "reset".
   */
  resetWidth: () => void;
  minWidth: number;
  /** Fallback ceiling — see `CHAT_MAX_WIDTH_FALLBACK`. The resize handle prefers a live DOM measurement. */
  maxWidth: number;
  resizeAriaLabel: string;
  resizeTooltip: React.ReactNode;
}

// Exported (alongside the context value type above) so a test can drive
// `AppShellChatResizeEdge` in isolation with a fully-controlled mock context,
// instead of only indirectly through `AppShellChatChat`.
const AppShellChatChatContext =
  React.createContext<AppShellChatChatContextValue | null>(null);

function useAppShellChatChatContext(): AppShellChatChatContextValue {
  return (
    React.useContext(AppShellChatChatContext) ?? {
      compact: false,
      width: CHAT_DEFAULT_WIDTH,
      setWidth: () => {},
      resetWidth: () => {},
      minWidth: CHAT_MIN_WIDTH,
      maxWidth: CHAT_MAX_WIDTH_FALLBACK,
      resizeAriaLabel: 'Resize chat',
      resizeTooltip: defaultResizeTooltip,
    }
  );
}

// ---------------------------------------------------------------------------
// AppShellChatResizeEdge — internal drag/keyboard handle on Chat's START
// border (the shared boundary with Content). Mirrors
// `SidebarSecondaryResizeEdge`'s drag mechanics, flipped because Chat sits at
// the END of the row: the handle is on `start-0`, the width grows as the
// pointer moves toward the row's start, and the arrow keys are inverted.
// UNLIKE SidebarSecondary's edge, there is no click-to-collapse /
// double-click-to-expand toggle — Chat has no collapsed mode, only a resize
// floor, so the only interactions are drag-to-resize and double-click-to-reset.
// Exported (with its handlers below) for direct unit testing; consumers
// should still compose Chat via `AppShellChatChat`, which renders it
// automatically — it is not meant to be placed manually.
// ---------------------------------------------------------------------------

/**
 * The true resize ceiling: the row's total width minus everything in it
 * EXCEPT Content (which can always shrink to 0) and Chat itself. This lets
 * Chat reach full width — Content shrinking to 0 — instead of being capped by
 * a fixed constant that strands Content with a bogus minimum once both
 * sidebars are collapsed and the row has room to give. Exported for direct
 * testing; `handleResizePointerDown` / `handleResizeKeyDown` are the real
 * callers.
 */
export function getResizeMaxWidth(chatEl: HTMLElement, fallback: number): number {
  const rowEl = chatEl.parentElement;
  if (!rowEl) return fallback;
  const rowRect = rowEl.getBoundingClientRect();
  if (rowRect.width <= 0) return fallback;
  let reserved = 0;
  for (const sibling of Array.from(rowEl.children)) {
    if (sibling === chatEl) continue;
    if ((sibling as HTMLElement).dataset.slot === 'app-shell-chat-content')
      continue;
    reserved += (sibling as HTMLElement).getBoundingClientRect().width;
  }
  const available = rowRect.width - reserved;
  return available > 0 ? available : fallback;
}

/** The subset of context `handleResizePointerDown` needs to drag-resize. */
export type ResizePointerDownContext = Pick<
  AppShellChatChatContextValue,
  'minWidth' | 'maxWidth' | 'setWidth'
>;

/**
 * Pointerdown handler for the Chat resize edge: captures the pointer,
 * disables the chat's width transition for the duration of the drag, and
 * clamps width between `ctx.minWidth` and the dynamically-measured ceiling
 * (`getResizeMaxWidth`) — NOT `ctx.maxWidth`, which is only the fallback used
 * when that measurement is unavailable. Chat's END edge is pinned against the
 * container's end, so dragging the pointer toward the row's start grows the
 * chat — the mirror image of `SidebarSecondaryResizeEdge` (whose START edge is
 * pinned). Exported for direct testing; `AppShellChatResizeEdge` is the real
 * caller (it supplies `onDragStart`/`onDragEnd` to drive its own `dragging`
 * state, e.g. to suppress the tooltip while dragging).
 *
 * `ctxRef` is a ref (not a plain snapshot): the drag's `pointermove`/`pointerup`
 * listeners live on `window` for the whole gesture, and `ctx.setWidth`'s
 * identity can change mid-drag from a re-render that has nothing to do with
 * the drag itself (e.g. a consumer's `onWidthChange` prop is a fresh inline
 * function every render, which changes `setWidth`'s `useCallback` identity).
 * Reading `ctxRef.current.setWidth` on every move — instead of destructuring
 * `setWidth` once up front — means the listeners always call whatever
 * `setWidth` is current, the same defensive pattern
 * `SidebarSecondaryResizeEdge` uses via its own `ctxRef`. `minWidth`/`maxWidth`
 * are still snapshotted once at drag-start (matching the frozen `chatRect`
 * they're paired with) since they're geometry, not a callback identity.
 *
 * Both `pointerup` and `pointercancel` end the drag (a cancelled gesture — a
 * touch-scroll takeover, palm rejection, losing focus mid-drag — never fires
 * `pointerup`, so relying on that alone leaks the listeners and leaves
 * `dragging` stuck `true` forever). `ev.pointerId` is checked against the
 * pointer that started the drag so a second, unrelated pointer (multi-touch on
 * the 17px handle) can't feed this drag's math or end it early.
 */
export function handleResizePointerDown(
  e: React.PointerEvent<HTMLDivElement>,
  ctxRef: { current: ResizePointerDownContext },
  { onDragStart, onDragEnd }: { onDragStart?: () => void; onDragEnd?: () => void } = {}
): void {
  e.preventDefault();
  const el = e.currentTarget;
  const { pointerId } = e;
  el.setPointerCapture(pointerId);
  onDragStart?.();

  // The chat panel is the nearest `[data-state]` ancestor of the handle.
  const chatEl = el.closest('[data-state]') as HTMLElement | null;
  if (!chatEl) {
    onDragEnd?.();
    el.releasePointerCapture(pointerId);
    return;
  }
  // Disable the width transition while dragging so resize tracks the cursor
  // without animation lag.
  chatEl.style.transitionProperty = 'none';
  const isRtl = getComputedStyle(chatEl).direction === 'rtl';
  const chatRect = chatEl.getBoundingClientRect();

  const { minWidth, maxWidth: fallbackMax } = ctxRef.current;
  const maxWidth = getResizeMaxWidth(chatEl, fallbackMax);

  const onPointerMove = (ev: PointerEvent) => {
    if (ev.pointerId !== pointerId) return;
    const newWidth = isRtl
      ? ev.clientX - chatRect.left
      : chatRect.right - ev.clientX;
    ctxRef.current.setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
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

/** The subset of context `handleResizeKeyDown` needs to resize via keyboard. */
export type ResizeKeyDownContext = Pick<
  AppShellChatChatContextValue,
  'minWidth' | 'maxWidth' | 'width' | 'setWidth' | 'resetWidth'
>;

/**
 * Keydown handler for the Chat resize edge: ArrowLeft/ArrowRight resize by
 * 16px, clamped to `[ctx.minWidth, the dynamically-measured ceiling]` (see
 * `getResizeMaxWidth`) via the SAME `Math.min(Math.max(next, minWidth),
 * maxWidth)` order the pointer-drag handler uses. That order matters when the
 * row is narrow enough that the measured ceiling drops below `minWidth` (e.g.
 * both sidebars expanded on a small viewport): clamping the floor first and
 * the ceiling second means the ceiling always wins the degenerate case, so
 * grow/shrink can't fight each other into a value outside the valid range.
 * Growing Chat's width moves the boundary "toward the row's start", so the
 * grow key is the OPPOSITE of `SidebarSecondaryResizeEdge`'s: ArrowLeft in
 * LTR, ArrowRight in RTL.
 *
 * Home delegates to `ctx.resetWidth()` rather than computing a clamped
 * number itself — `resetWidth` restores the LIVE breakpoint-driven width
 * (see `AppShellChatChatContextValue.resetWidth`), which is always already
 * in range, so no clamp is needed here. Exported for direct testing;
 * `AppShellChatResizeEdge` is the real caller.
 */
export function handleResizeKeyDown(
  e: React.KeyboardEvent<HTMLDivElement>,
  ctx: ResizeKeyDownContext,
  dir: 'ltr' | 'rtl'
): void {
  const { minWidth, maxWidth: fallbackMax, width: w, setWidth: sw, resetWidth } = ctx;
  const step = 16;
  const growKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const shrinkKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const chatEl = e.currentTarget.closest('[data-state]') as HTMLElement | null;
  const maxWidth = chatEl ? getResizeMaxWidth(chatEl, fallbackMax) : fallbackMax;
  const clamp = (next: number) => Math.min(Math.max(next, minWidth), maxWidth);
  if (e.key === growKey) {
    e.preventDefault();
    sw(clamp(w + step));
  } else if (e.key === shrinkKey) {
    e.preventDefault();
    sw(clamp(w - step));
  } else if (e.key === 'Home') {
    e.preventDefault();
    resetWidth();
  }
}

// Exported so a test can drive it in isolation (see `AppShellChatChatContext`
// above) instead of only indirectly through `AppShellChatChat`, which is
// otherwise the only real caller — the resize edge is rendered automatically
// inside `AppShellChatChat` and is not meant to be composed by consumers.
export function AppShellChatResizeEdge() {
  const ctx = useAppShellChatChatContext();
  const dir = useDocDir();

  // Kept in sync every render so a drag started earlier still calls the
  // LATEST `setWidth` on every pointermove — see `handleResizePointerDown`'s
  // doc comment for why a plain (non-ref) snapshot of `ctx` isn't safe here.
  const ctxRef = React.useRef(ctx);
  ctxRef.current = ctx;

  // Hide the tooltip while dragging.
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setTooltipOpen(false);
    handleResizePointerDown(e, ctxRef, {
      onDragStart: () => setDragging(true),
      onDragEnd: () => setDragging(false),
    });
  };

  const handleDoubleClick = () => {
    ctx.resetWidth();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleResizeKeyDown(e, ctx, dir);
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
            aria-label={ctx.resizeAriaLabel}
            className={cn(
              // 17px hit area on the inline-start edge. The chat's own border-s
              // provides the visible 1px line; its color changes via :has() on
              // hover/active/focus-visible (see AppShellChatChat).
              'absolute start-0 top-0 h-full w-[17px] ltr:-translate-x-1/2 rtl:translate-x-1/2 cursor-[var(--ui-resizable-cursor,ew-resize)] z-10',
              // On focus: a 1px active-color line (after pseudo) + 3px ring.
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
      {ctx.resizeTooltip != null && (
        <TooltipContent side={dir === 'rtl' ? 'right' : 'left'} align="center">
          {ctx.resizeTooltip}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
AppShellChatResizeEdge.displayName = 'AppShellChatResizeEdge';

// ---------------------------------------------------------------------------
// AppShellChatChat — the resizable panel
// ---------------------------------------------------------------------------

export interface AppShellChatChatProps extends React.ComponentPropsWithoutRef<'aside'> {
  /** Controlled width in px. */
  width?: number;
  /** Fires when the width changes due to a drag/keyboard interaction. */
  onWidthChange?: (width: number) => void;
  /** Accessible label for the resize edge (`role="separator"`). Defaults to `'Resize chat'`. */
  resizeAriaLabel?: string;
  /** Tooltip content shown on the resize edge. Pass `null` to hide the tooltip entirely. */
  resizeTooltip?: React.ReactNode;
}

const AppShellChatChat = React.forwardRef<HTMLElement, AppShellChatChatProps>(
  (
    {
      className,
      width: widthProp,
      onWidthChange,
      resizeAriaLabel = 'Resize chat',
      resizeTooltip = defaultResizeTooltip,
      children,
      ...props
    },
    ref
  ) => {
    // Uncontrolled width has two layers: `liveDefaultWidth` tracks the
    // viewport LIVE (via `useLiveChatDefaultWidth`, mirroring the CSS
    // classes below) until the user actually drags/keyboard-resizes —
    // `override` captures that explicit choice and, once set, wins
    // regardless of further viewport changes (matching the existing
    // drag/double-click/Home mechanics, unchanged).
    const liveDefaultWidth = useLiveChatDefaultWidth();
    const [override, setOverrideState] = React.useState<number | undefined>(
      undefined
    );
    const isWidthControlled = widthProp !== undefined;
    const currentWidth = isWidthControlled
      ? widthProp
      : override ?? liveDefaultWidth;
    const setWidth = React.useCallback(
      (next: number) => {
        if (!isWidthControlled) setOverrideState(next);
        onWidthChange?.(next);
      },
      [isWidthControlled, onWidthChange]
    );
    // Reset means "go back to the LIVE breakpoint-driven width", not "go
    // back to a fixed number" — clearing `override` (rather than setting it
    // to some constant) is what lets viewport tracking resume afterward.
    // `onWidthChange` still fires (even when controlled) so the consumer's
    // width — controlled or not — reflects the same live value.
    const resetWidth = React.useCallback(() => {
      if (!isWidthControlled) setOverrideState(undefined);
      onWidthChange?.(liveDefaultWidth);
    }, [isWidthControlled, onWidthChange, liveDefaultWidth]);

    const compact = currentWidth <= CHAT_MIN_WIDTH;

    const context = React.useMemo<AppShellChatChatContextValue>(
      () => ({
        compact,
        width: currentWidth,
        setWidth,
        resetWidth,
        minWidth: CHAT_MIN_WIDTH,
        maxWidth: CHAT_MAX_WIDTH_FALLBACK,
        resizeAriaLabel,
        resizeTooltip,
      }),
      [compact, currentWidth, setWidth, resetWidth, resizeAriaLabel, resizeTooltip]
    );

    // Apply inline width ONLY once the user has actually resized (or width
    // is controlled) — otherwise the responsive Tailwind width classes
    // drive it live, so brand overrides / viewport reflow are unaffected by
    // JS. (There is no width design token, so the CSS default is the same
    // JS constants expressed as Tailwind spacing-scale classes.)
    const hasWidthOverride = isWidthControlled || override !== undefined;
    const inlineStyle: React.CSSProperties | undefined = hasWidthOverride
      ? { width: currentWidth }
      : undefined;

    return (
      <AppShellChatChatContext.Provider value={context}>
        <aside
          ref={ref}
          data-slot="app-shell-chat-chat"
          data-state={compact ? 'collapsed' : 'expanded'}
          style={inlineStyle}
          className={cn(
            // Live, responsive width — no JS, reflows on every browser
            // resize until `hasWidthOverride` (above) switches to the
            // inline style. `w-12` is the spacing scale (3rem = 48px);
            // `w-md`/`w-lg` are Tailwind's named container-scale width
            // utilities (28rem/32rem = 448px/512px) — see the `CHAT_*`
            // constants above for the same numbers.
            'group/chat relative flex h-full shrink-0 flex-col border-s border-[var(--ui-border-on-surface-divider)] bg-background w-12 xl:w-md 3xl:w-lg transition-[width,border-color]',
            // Resize-edge hover/active/focus recolors the START border line.
            'has-[[role=separator]:hover]:[border-inline-start-color:var(--ui-resizable-border-color-hover)] has-[[role=separator]:active]:[border-inline-start-color:var(--ui-resizable-border-color-active)] has-[[role=separator]:focus-visible]:[border-inline-start-color:var(--ui-resizable-border-color-active)]',
            className
          )}
          {...props}
        >
          <AppShellChatResizeEdge />
          {children}
        </aside>
      </AppShellChatChatContext.Provider>
    );
  }
);
AppShellChatChat.displayName = 'AppShellChatChat';

// ---------------------------------------------------------------------------
// AppShellChatChatHeader
// ---------------------------------------------------------------------------

export interface AppShellChatChatHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Header title (or pass as children). */
  label?: React.ReactNode;
  /** Trailing header actions. Hidden while compact (icon-only rail). */
  actions?: React.ReactNode;
}

const AppShellChatChatHeader = React.forwardRef<
  HTMLDivElement,
  AppShellChatChatHeaderProps
>(({ className, label, actions, children, ...props }, ref) => {
  const { compact } = useAppShellChatChatContext();
  const dir = useDocDir();
  const resolvedLabel = label ?? children;

  return (
    <div
      ref={ref}
      data-slot="app-shell-chat-chat-header"
      className={cn(
        'flex shrink-0 items-center border-b border-[var(--ui-border-on-surface-divider)] p-4',
        compact ? 'justify-center' : 'gap-3',
        className
      )}
      {...props}
    >
      {compact ? (
        // Collapsed rail: only the Acronis "A" mark, with the full label on
        // hover. `size-8` keeps this row exactly as tall as the label row
        // below (a 32px line height) — the icon alone is only 24px, so
        // without an explicit size the header would be a few px shorter than
        // Content's header. The accessible name comes from the `sr-only`
        // span's actual DOM content (same pattern as
        // `SidebarPrimaryMenuItem`'s collapsed rail), not a derived
        // `aria-label` string — that works for ANY `resolvedLabel`
        // (a plain string or a rich ReactNode via `children`), whereas a
        // `typeof resolvedLabel === 'string'` check would silently leave
        // the icon with no accessible name at all for non-string content.
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="flex size-8 items-center justify-center" />
            }
          >
            <AcronisIcon size={24} aria-hidden="true" />
            <span className="sr-only">{resolvedLabel}</span>
          </TooltipTrigger>
          <TooltipContent side={dir === 'rtl' ? 'left' : 'right'}>
            {resolvedLabel}
          </TooltipContent>
        </Tooltip>
      ) : (
        <>
          <span className="ui-typography-headings-title min-w-0 flex-1 truncate text-[var(--ui-text-on-surface-primary)]">
            {resolvedLabel}
          </span>
          {actions != null && (
            <span className="flex shrink-0 items-center">{actions}</span>
          )}
        </>
      )}
    </div>
  );
});
AppShellChatChatHeader.displayName = 'AppShellChatChatHeader';

const AppShellChatChatBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { compact } = useAppShellChatChatContext();
  return (
    <div
      ref={ref}
      data-slot="app-shell-chat-chat-body"
      className={cn(
        'flex flex-1 flex-col overflow-auto p-4',
        compact && 'hidden',
        className
      )}
      {...props}
    />
  );
});
AppShellChatChatBody.displayName = 'AppShellChatChatBody';

export {
  AppShellChat,
  AppShellChatSidebar,
  AppShellChatContent,
  AppShellChatContentHeader,
  AppShellChatContentBody,
  AppShellChatChat,
  AppShellChatChatHeader,
  AppShellChatChatBody,
  AppShellChatChatContext,
};

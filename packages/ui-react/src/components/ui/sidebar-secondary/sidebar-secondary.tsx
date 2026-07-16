import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { Collapsible } from '@base-ui/react/collapsible';
import {
  ChevronDownIcon,
  SquareArrowUpRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useDocDir } from '@/lib/use-doc-dir';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Tracks whether `ref`'s element is clipping its own content (`scrollWidth >
 * clientWidth`) — used to gate a tooltip so it only opens when a truncated
 * label is actually cut off. Re-measures via `ResizeObserver` (covers the
 * rail's expand/collapse width transition); `enabled` skips measurement
 * entirely (e.g. while collapsed, where the label is `sr-only`).
 */
function useIsOverflowing<T extends Element>(
  ref: React.RefObject<T | null>,
  { enabled }: { enabled: boolean }
): boolean {
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) {
      setIsOverflowing(false);
      return;
    }
    const measure = () =>
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return isOverflowing;
}

// Resize constraints — mirrors the design-token defaults.
// CSS still uses `var(--ui-sidebar-secondary-expanded-container-width)` so
// brands that override the token get the correct visual width; these JS
// constants only govern the drag-resize clamping range.
const SIDEBAR_EXPANDED_WIDTH = 256; // --ui-sidebar-secondary-expanded-container-width
const SIDEBAR_MAX_WIDTH = SIDEBAR_EXPANDED_WIDTH * 2;

// Composable SidebarSecondary primitives mirroring the Figma "SidebarSecondary"
// component set (node 2468:59502, variant expanded|collapsed). Every color and
// metric is wired to a next-gen `--ui-sidebar-secondary-*` token from
// @acronis-platform/tokens-pd — no hex, no invented tokens.
//
// Like SidebarPrimary, expanded/collapsed is a width-reflow state (not a panel
// show/hide), modelled as a controlled/uncontrolled `expanded` prop (default
// true) that sets `data-state="expanded|collapsed"` on the root and is shared to
// descendants via context. The collapsed rail replaces the section list with a
// vertical breadcrumb (parent → separator → current page), toggled purely by the
// `data-[state]` selectors so it is SSR-present and needs no JS branch.
//
// Menu-item color wiring DIVERGES from Primary (DESIGN §6.2): Secondary recolors
// only the CONTAINER per selected/unselected; the icon and label use the shared
// `--ui-sidebar-secondary-menu-item-global-{icon,label}-color-color` tokens
// across both variants and every interaction state (the next-gen token sync
// collapsed the former per-state idle/hover/active icon+label colors into a
// single value each). So the cva base carries the global icon/label colors and
// the two variants only swap the container fill.
//
// R6 (collapsed separator icon): resolved from the Figma node metadata — the
// collapsed `iconSeparator` instance's mainComponent is "ChevronDown" (updated
// from ChevronRight), so the separator defaults to `ChevronDownIcon` (16px),
// tinted by `--ui-sidebar-secondary-collapsed-icon-separator-color`. In the
// vertical breadcrumb flow (writing-mode: vertical-rl) the downward chevron
// visually points "forward" in the reading direction. The disclosure chevron
// uses `ChevronDownIcon` rotated via `data-panel-open`. The focus ring reuses the
// shared `--ui-focus-brand` (no sidebar focus token exists — R1).

const defaultResizeTooltipExpanded = (
  <>
    <span className="font-semibold">Resize:</span> Drag
    <br />
    <span className="font-semibold">Collapse:</span> Click
    <br />
    <span className="font-semibold">Reset size:</span> Double click
  </>
);

const defaultResizeTooltipCollapsed = (
  <>
    <span className="font-semibold">Resize:</span> Drag
    <br />
    <span className="font-semibold">Expand:</span> Click
  </>
);

interface SidebarSecondaryContextValue {
  expanded: boolean;
  /** Flip the panel width — drives the controlled/uncontrolled `expanded` state. */
  toggleExpanded: () => void;
  /** Whether resize is enabled. */
  resizable: boolean;
  /** Current width in px (only meaningful when resizable + expanded). */
  width: number;
  /** Update the width (used by the resize edge during drag). */
  setWidth: (width: number) => void;
  /** Min resize width — derived from `--ui-sidebar-secondary-expanded-container-width`. */
  minWidth: number;
  /** Max resize width — expanded-width × RESIZE_MAX_WIDTH_FACTOR. */
  maxWidth: number;
  /** Default (reset) width — equals expanded-container-width token. */
  defaultWidth: number;
  /** Label registered by `SidebarSecondaryHeader` — consumed by the collapsed breadcrumb. */
  headerLabel: React.ReactNode;
  /** Register the header label (called by `SidebarSecondaryHeader`). */
  setHeaderLabel: (label: React.ReactNode) => void;
  /** Label of the currently selected `MenuItem` — consumed by the collapsed breadcrumb. */
  selectedLabel: React.ReactNode;
  /** Register the selected item label (called by `SidebarSecondaryMenuItem`). */
  setSelectedLabel: (label: React.ReactNode) => void;
  /** Accessible label for the resize edge separator. */
  resizeAriaLabel: string;
  /** Tooltip content shown when the sidebar is expanded. */
  resizeTooltipExpanded: React.ReactNode;
  /** Tooltip content shown when the sidebar is collapsed. */
  resizeTooltipCollapsed: React.ReactNode;
}

const SidebarSecondaryContext =
  React.createContext<SidebarSecondaryContextValue | null>(null);

function useSidebarSecondaryContext(): SidebarSecondaryContextValue {
  // Default to expanded so parts render standalone (in isolation tests /
  // stories) without a wrapping root; the toggle is a no-op outside a root.
  return (
    React.useContext(SidebarSecondaryContext) ?? {
      expanded: true,
      toggleExpanded: () => {},
      resizable: false,
      width: SIDEBAR_EXPANDED_WIDTH,
      setWidth: () => {},
      minWidth: SIDEBAR_EXPANDED_WIDTH,
      maxWidth: SIDEBAR_MAX_WIDTH,
      defaultWidth: SIDEBAR_EXPANDED_WIDTH,
      headerLabel: undefined,
      setHeaderLabel: () => {},
      selectedLabel: undefined,
      setSelectedLabel: () => {},
      resizeAriaLabel: 'Resize sidebar',
      resizeTooltipExpanded: defaultResizeTooltipExpanded,
      resizeTooltipCollapsed: defaultResizeTooltipCollapsed,
    }
  );
}

/**
 * Controlled + uncontrolled boolean state (the Base UI idiom). When `controlled`
 * is provided it wins and the setter only emits the change callback; otherwise
 * the setter updates internal state. `onChange` is ALWAYS invoked with the next
 * value so a consumer can react in either mode.
 */
function useControllableBoolean(
  controlled: boolean | undefined,
  defaultValue: boolean,
  onChange?: (next: boolean) => void
): [boolean, (next: boolean) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;
  const setValue = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [value, setValue];
}

export interface SidebarSecondaryProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Controlled expanded (rail width) state. */
  expanded?: boolean;
  /** Uncontrolled initial expanded state. Defaults to `true` (full width). */
  defaultExpanded?: boolean;
  /** Fires when the expanded state changes (e.g. a consumer toggle). */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Enable the draggable resize edge on the right border.
   * When `true`, the sidebar can be resized between the expanded-width token
   * and twice that value.
   */
  resizable?: boolean;
  /** Controlled width in px (only used when `resizable`). */
  width?: number;
  /** Fires when the width changes due to a drag interaction. */
  onWidthChange?: (width: number) => void;
  /** Accessible label for the resize edge (`role="separator"`). Defaults to `'Resize sidebar'`. */
  resizeAriaLabel?: string;
  /** Tooltip content shown when the sidebar is expanded. Pass `null` to hide the tooltip entirely. */
  resizeTooltipExpanded?: React.ReactNode;
  /** Tooltip content shown when the sidebar is collapsed. Pass `null` to hide the tooltip entirely. */
  resizeTooltipCollapsed?: React.ReactNode;
  /**
   * Replace the rendered `<nav>` with another element or component
   * (Base UI composition). Accepts a React element or a render function.
   */
  render?: useRender.RenderProp;
}

// ---------------------------------------------------------------------------
// SidebarSecondaryResizeEdge — internal drag/click handle on the right edge
// ---------------------------------------------------------------------------
// Styled identically to `ResizableHandle` (Figma 4649:6681): 9px hit-area,
// 1px centered divider, idle → `--ui-border-on-surface-border`,
// hover → `--ui-resizable-border-color-hover`,
// drag  → `--ui-resizable-border-color-active`.
// ---------------------------------------------------------------------------

function SidebarSecondaryResizeEdge() {
  const ctx = useSidebarSecondaryContext();
  const { expanded, toggleExpanded, resizable } = ctx;
  const dir = useDocDir();

  // Mutable ref so the closure-captured pointermove handler always reads
  // the latest context without re-attaching listeners.
  const ctxRef = React.useRef(ctx);
  ctxRef.current = ctx;

  // Track whether a pointermove actually happened between down→up so we can
  // suppress the click that the browser fires after every pointerup.
  const didDragRef = React.useRef(false);

  // Hide the tooltip while dragging.
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  // Delay single-click so a double-click can cancel it.
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Clear any pending click timer on unmount.
  React.useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  if (!resizable) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    didDragRef.current = false;
    setDragging(true);
    setTooltipOpen(false);

    // Disable the width transition while dragging so resize follows the
    // cursor without animation lag.
    const sidebarEl = el.closest('[data-state]') as HTMLElement | null;
    if (!sidebarEl) {
      setDragging(false);
      el.releasePointerCapture(e.pointerId);
      return;
    }
    sidebarEl.style.transitionProperty = 'none';
    const isRtl = getComputedStyle(sidebarEl).direction === 'rtl';
    const sidebarRect = sidebarEl.getBoundingClientRect();

    const { minWidth, maxWidth } = ctxRef.current;
    const collapseThreshold = minWidth / 2;

    const onPointerMove = (ev: PointerEvent) => {
      didDragRef.current = true;
      const newWidth = isRtl
        ? sidebarRect.right - ev.clientX
        : ev.clientX - sidebarRect.left;
      const { expanded: isExpanded } = ctxRef.current;

      if (isExpanded) {
        if (newWidth < collapseThreshold) {
          ctxRef.current.toggleExpanded();
        } else {
          ctxRef.current.setWidth(
            Math.min(Math.max(newWidth, minWidth), maxWidth)
          );
        }
      } else {
        if (newWidth > collapseThreshold) {
          ctxRef.current.toggleExpanded();
        }
      }
    };

    const onPointerUp = () => {
      setDragging(false);
      // Restore transition so collapse/expand animates.
      if (sidebarEl) sidebarEl.style.transitionProperty = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleClick = () => {
    // Suppress click when the interaction was a drag.
    if (didDragRef.current) return;
    // Cancel any pending click timer (dblclick fires two clicks).
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    // Wait to see if a double-click follows.
    clickTimerRef.current = setTimeout(() => {
      toggleExpanded();
    }, 250);
  };

  const handleDoubleClick = () => {
    // Cancel the pending single-click toggle.
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    if (!expanded) toggleExpanded();
    ctxRef.current.setWidth(ctxRef.current.defaultWidth);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const {
      minWidth,
      maxWidth,
      defaultWidth,
      width: w,
      setWidth: sw,
      expanded: exp,
      toggleExpanded: te,
    } = ctxRef.current;
    const step = 16;
    const growKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const shrinkKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === growKey && exp) {
      e.preventDefault();
      sw(Math.min(w + step, maxWidth));
    } else if (e.key === growKey && !exp) {
      e.preventDefault();
      te();
    } else if (e.key === shrinkKey && exp) {
      e.preventDefault();
      const next = w - step;
      if (next < minWidth) {
        te();
      } else {
        sw(next);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      te();
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (!exp) te();
      sw(defaultWidth);
    }
  };

  const handleTooltipOpenChange = (open: boolean) => {
    // Never open the tooltip while dragging.
    if (dragging) return;
    setTooltipOpen(open);
  };

  return (
    <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange} trackCursorAxis="y">
      <TooltipTrigger
        render={
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={ctx.resizeAriaLabel}
            className={cn(
              // 17px hit area, absolutely positioned on inline-end edge.
              // The sidebar's own border-e provides the visible 1px line; its color
              // changes via :has() on hover/active/focus-visible.
              'absolute end-0 top-0 h-full w-[17px] ltr:translate-x-1/2 rtl:-translate-x-1/2 cursor-[var(--ui-resizable-cursor,ew-resize)] z-10',
              // On focus: 1px active-color line (after pseudo, CSS border for pixel-snap) + 3px box-shadow ring centered on it.
              'after:absolute after:inset-y-0 after:inset-x-0 after:mx-auto after:w-0 after:pointer-events-none',
              'after:[border-inline-start-width:var(--ui-resizable-border-width,1px)] after:border-solid after:border-transparent',
              'focus-visible:outline-none focus-visible:after:[border-inline-start-color:var(--ui-resizable-border-color-active)] focus-visible:after:[box-shadow:0_0_0_3px_var(--ui-focus-primary)]'
            )}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          />
        }
      />
      {(expanded ? ctx.resizeTooltipExpanded : ctx.resizeTooltipCollapsed) !=
        null && (
        <TooltipContent side={dir === 'rtl' ? 'left' : 'right'} align="center">
          {expanded ? ctx.resizeTooltipExpanded : ctx.resizeTooltipCollapsed}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

const SidebarSecondary = React.forwardRef<HTMLElement, SidebarSecondaryProps>(
  (
    {
      className,
      expanded: expandedProp,
      defaultExpanded = true,
      onExpandedChange,
      resizable: resizableProp = true,
      width: widthProp,
      onWidthChange,
      resizeAriaLabel = 'Resize sidebar',
      resizeTooltipExpanded = defaultResizeTooltipExpanded,
      resizeTooltipCollapsed = defaultResizeTooltipCollapsed,
      'aria-label': ariaLabel = 'Section navigation',
      render,
      children,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = useControllableBoolean(
      expandedProp,
      defaultExpanded,
      onExpandedChange
    );

    // Width is independent of expanded/collapsed — it persists across cycles.
    const [width, setWidthState] = React.useState(SIDEBAR_EXPANDED_WIDTH);
    const isWidthControlled = widthProp !== undefined;
    const currentWidth = isWidthControlled ? widthProp : width;
    const setWidth = React.useCallback(
      (next: number) => {
        if (!isWidthControlled) setWidthState(next);
        onWidthChange?.(next);
      },
      [isWidthControlled, onWidthChange]
    );

    // Collapse is driven by the consumer through the layout context — the
    // `SidebarSecondaryCollapseTrigger` calls `toggleExpanded`, which updates
    // uncontrolled state and always emits `onExpandedChange`. Controlled
    // consumers ignore the internal state and react to the callback.
    // Breadcrumb auto-wiring: Header and the selected MenuItem register their
    // labels so the collapsed breadcrumb can display them without manual props.
    const [headerLabel, setHeaderLabel] =
      React.useState<React.ReactNode>(undefined);
    const [selectedLabel, setSelectedLabel] =
      React.useState<React.ReactNode>(undefined);

    const context = React.useMemo<SidebarSecondaryContextValue>(
      () => ({
        expanded,
        toggleExpanded: () => setExpanded(!expanded),
        resizable: resizableProp,
        width: currentWidth,
        setWidth,
        minWidth: SIDEBAR_EXPANDED_WIDTH,
        maxWidth: SIDEBAR_MAX_WIDTH,
        defaultWidth: SIDEBAR_EXPANDED_WIDTH,
        headerLabel,
        setHeaderLabel,
        selectedLabel,
        setSelectedLabel,
        resizeAriaLabel,
        resizeTooltipExpanded,
        resizeTooltipCollapsed,
      }),
      [
        expanded,
        setExpanded,
        resizableProp,
        currentWidth,
        setWidth,
        headerLabel,
        selectedLabel,
        resizeAriaLabel,
        resizeTooltipExpanded,
        resizeTooltipCollapsed,
      ]
    );

    // When resizable + expanded, apply inline width ONLY when the user has
    // actively resized (or width is controlled). Otherwise the CSS token
    // `--ui-sidebar-secondary-expanded-container-width` drives the width,
    // so brand overrides are honoured and no inline style wins specificity.
    const hasWidthOverride =
      isWidthControlled || currentWidth !== SIDEBAR_EXPANDED_WIDTH;
    const inlineStyle: React.CSSProperties | undefined =
      resizableProp && expanded && hasWidthOverride
        ? { width: currentWidth }
        : undefined;

    const element = useRender({
      render,
      ref,
      defaultTagName: 'nav',
      props: mergeProps<'nav'>(
        {
          'aria-label': ariaLabel,
          // `data-state` drives every collapsed/expanded token switch via
          // attribute selectors; typed loosely because React's nav attribute
          // map doesn't include arbitrary data-* keys as literals.
          ...({ 'data-state': expanded ? 'expanded' : 'collapsed' } as Record<
            string,
            string
          >),
          style: inlineStyle,
          className: cn(
            'group/sidebar relative flex h-full flex-col bg-[var(--ui-sidebar-secondary-global-container-color)] border-e border-[var(--ui-sidebar-secondary-global-container-border-color)] [border-inline-end-width:var(--ui-sidebar-secondary-global-container-border-width)] w-[var(--ui-sidebar-secondary-collapsed-container-width)] data-[state=expanded]:w-[var(--ui-sidebar-secondary-expanded-container-width)] transition-[width]',
            resizableProp &&
              'transition-[width,border-color] has-[[role=separator]:hover]:[border-inline-end-color:var(--ui-resizable-border-color-hover)] has-[[role=separator]:active]:[border-inline-end-color:var(--ui-resizable-border-color-active)] has-[[role=separator]:focus-visible]:[border-inline-end-color:var(--ui-resizable-border-color-active)]',
            className
          ),
          children: (
            <>
              <SidebarSecondaryCollapsedBreadcrumb />
              {children}
              <SidebarSecondaryResizeEdge />
            </>
          ),
        },
        props
      ),
    });

    return (
      <SidebarSecondaryContext.Provider value={context}>
        {element}
      </SidebarSecondaryContext.Provider>
    );
  }
);
SidebarSecondary.displayName = 'SidebarSecondary';

export interface SidebarSecondaryHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Heading text (or pass as children). */
  label?: React.ReactNode;
}

const SidebarSecondaryHeader = React.forwardRef<
  HTMLDivElement,
  SidebarSecondaryHeaderProps
>(({ className, label, children, ...props }, ref) => {
  const { setHeaderLabel } = useSidebarSecondaryContext();
  const resolvedLabel = label ?? children;

  // Register the header text so the collapsed breadcrumb can auto-display it.
  React.useEffect(() => {
    setHeaderLabel(resolvedLabel);
  }, [resolvedLabel, setHeaderLabel]);

  return (
    <div
      ref={ref}
      className={cn(
        'hidden items-center shrink-0',
        'group-data-[state=expanded]/sidebar:flex',
        'px-[var(--ui-sidebar-secondary-global-container-header-padding-x)] py-[var(--ui-sidebar-secondary-global-container-header-padding-y)]',
        className
      )}
      {...props}
    >
      <h2 className="ui-sidebar-secondary-global-header-label-text-style truncate text-[var(--ui-sidebar-secondary-global-header-label-color)]">
        {resolvedLabel}
      </h2>
    </div>
  );
});
SidebarSecondaryHeader.displayName = 'SidebarSecondaryHeader';

const SidebarSecondaryContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  // Expanded: the section list. Hidden in collapsed mode, where the
  // CollapsedBreadcrumb sibling takes over.
  <div
    ref={ref}
    className={cn(
      'flex flex-1 flex-col overflow-y-auto gap-[var(--ui-sidebar-secondary-global-section-list-gap)]',
      'hidden group-data-[state=expanded]/sidebar:flex',
      className
    )}
    {...props}
  />
));
SidebarSecondaryContent.displayName = 'SidebarSecondaryContent';

export interface SidebarSecondaryCollapsedBreadcrumbProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The parent section label (breadcrumbLabel).
   * Auto-derived from the `SidebarSecondaryHeader` label when omitted.
   */
  parentLabel?: React.ReactNode;
  /**
   * The current page label (labelCurrentPage).
   * Auto-derived from the selected `SidebarSecondaryMenuItem` when omitted.
   */
  currentLabel?: React.ReactNode;
  /** Separator between the two; defaults to a 16px ChevronDownIcon. */
  separator?: React.ReactNode;
}

const SidebarSecondaryCollapsedBreadcrumb = React.forwardRef<
  HTMLDivElement,
  SidebarSecondaryCollapsedBreadcrumbProps
>(({ className, parentLabel, currentLabel, separator, ...props }, ref) => {
  const { headerLabel, selectedLabel } = useSidebarSecondaryContext();
  const resolvedParent = parentLabel ?? headerLabel;
  const resolvedCurrent = currentLabel ?? selectedLabel;

  return (
    // Shown only in collapsed mode — toggled by the same data-[state] selector so
    // it stays in the DOM (SSR-present) with no JS branch. Laid out vertically:
    // parent → separator → current page.
    <div
      ref={ref}
      className={cn(
        'flex flex-1 flex-col items-center min-h-0',
        'gap-[var(--ui-sidebar-secondary-collapsed-container-content-gap)] py-[var(--ui-sidebar-secondary-collapsed-container-content-padding-y)]',
        'flex group-data-[state=expanded]/sidebar:hidden',
        className
      )}
      {...props}
    >
      <span className="[writing-mode:vertical-rl] [direction:ltr] shrink-0 ui-sidebar-secondary-collapsed-breadcrumb-label-text-style text-[var(--ui-sidebar-secondary-collapsed-breadcrumb-label-color)]">
        {resolvedParent}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex items-center text-[var(--ui-sidebar-secondary-collapsed-icon-separator-color)] [&>svg]:size-[var(--ui-sidebar-secondary-collapsed-icon-separator-size)]"
      >
        {separator ?? <ChevronDownIcon size={16} />}
      </span>
      <span className="[writing-mode:vertical-rl] [direction:ltr] flex-1 min-h-0 overflow-hidden ui-sidebar-secondary-collapsed-label-current-page-text-style text-[var(--ui-sidebar-secondary-collapsed-label-current-page-color)]">
        {resolvedCurrent}
      </span>
    </div>
  );
});
SidebarSecondaryCollapsedBreadcrumb.displayName =
  'SidebarSecondaryCollapsedBreadcrumb';

const SidebarSecondaryFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col shrink-0',
      'border-t border-[var(--ui-sidebar-secondary-global-container-footer-border-color)] [border-top-width:var(--ui-sidebar-secondary-global-container-footer-border-width)]',
      'py-[var(--ui-sidebar-secondary-section-container-padding-y)]',
      className
    )}
    {...props}
  />
));
SidebarSecondaryFooter.displayName = 'SidebarSecondaryFooter';

// A section can be a static group (label + items) or an EXPANDABLE disclosure
// (Figma Section `expandable=yes-*`): the label becomes a chevron toggle that
// shows/hides the whole item list. Whether a section is expandable is shared to
// its label + menu via this context (default: static), so the same `SectionLabel`
// / `Menu` parts adapt without a separate component set.
interface SidebarSecondarySectionContextValue {
  expandable: boolean;
}

const SidebarSecondarySectionContext =
  React.createContext<SidebarSecondarySectionContextValue>({
    expandable: false,
  });

const SECTION_STATIC: SidebarSecondarySectionContextValue = {
  expandable: false,
};
const SECTION_EXPANDABLE: SidebarSecondarySectionContextValue = {
  expandable: true,
};

export interface SidebarSecondarySectionProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Make the section a collapsible disclosure: the `SidebarSecondarySectionLabel`
   * becomes a chevron toggle and the `SidebarSecondaryMenu` becomes its panel.
   */
  expandable?: boolean;
  /** Controlled open state (expandable sections only). */
  open?: boolean;
  /** Uncontrolled initial open state (expandable sections only). Defaults to open. */
  defaultOpen?: boolean;
  /** Fires with the next open value when an expandable section toggles. */
  onOpenChange?: (open: boolean) => void;
}

const SidebarSecondarySection = React.forwardRef<
  HTMLDivElement,
  SidebarSecondarySectionProps
>(
  (
    {
      className,
      expandable = false,
      open,
      defaultOpen = true,
      onOpenChange,
      children,
      ...props
    },
    ref
  ) => {
    // Sections are separated by vertical padding + the section label; the next-gen
    // token sync removed the inter-section divider (no
    // `--ui-sidebar-secondary-section-container-border-*` token survives).
    const sectionClass = cn(
      'flex flex-col py-[var(--ui-sidebar-secondary-section-container-padding-y)]',
      className
    );

    if (!expandable) {
      return (
        <SidebarSecondarySectionContext.Provider value={SECTION_STATIC}>
          <div ref={ref} className={sectionClass} {...props}>
            {children}
          </div>
        </SidebarSecondarySectionContext.Provider>
      );
    }

    // Expandable: Base UI Collapsible owns the open state (controlled or
    // uncontrolled) + the aria-expanded/aria-controls wiring on the trigger.
    return (
      <SidebarSecondarySectionContext.Provider value={SECTION_EXPANDABLE}>
        <Collapsible.Root
          ref={ref}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          render={<div className={sectionClass} />}
          {...props}
        >
          {children}
        </Collapsible.Root>
      </SidebarSecondarySectionContext.Provider>
    );
  }
);
SidebarSecondarySection.displayName = 'SidebarSecondarySection';

export interface SidebarSecondarySectionLabelProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Trailing header actions (e.g. a ghost `ButtonIcon`). Rendered outside the toggle. */
  actions?: React.ReactNode;
  /**
   * A rollup badge (e.g. a `Tag` with an unread count) shown in the header only
   * when an expandable section is collapsed. Ignored for static sections.
   */
  unreadRollup?: React.ReactNode;
}

const sectionLabelTextClass =
  'ui-sidebar-secondary-section-label-section-text-style text-[var(--ui-sidebar-secondary-section-label-section-color)]';
const sectionHeaderPadClass =
  'min-h-[var(--ui-sidebar-secondary-menu-item-global-container-height-min)] py-[var(--ui-sidebar-secondary-section-container-header-padding-y)] px-[var(--ui-sidebar-secondary-section-container-header-padding-x)]';

const SidebarSecondarySectionLabel = React.forwardRef<
  HTMLDivElement,
  SidebarSecondarySectionLabelProps
>(({ className, actions, unreadRollup, children, ...props }, ref) => {
  const { expandable } = React.useContext(SidebarSecondarySectionContext);
  const dir = useDocDir();
  const rowRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const isOverflowing = useIsOverflowing(labelRef, { enabled: true });
  const setRowRef = (node: HTMLDivElement | null) => {
    rowRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // Anchored to the row (not the label span) so it lines up with the
  // sidebar's right edge regardless of how much the label shrinks for
  // trailing actions/rollup.
  const labelTooltip = (
    <Tooltip disabled={!isOverflowing}>
      <TooltipTrigger
        render={
          <span
            ref={labelRef}
            className="min-w-0 flex-1 truncate"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent anchor={rowRef} side={dir === 'rtl' ? 'left' : 'right'}>
        {children}
      </TooltipContent>
    </Tooltip>
  );

  if (!expandable) {
    // Static header: preserve the original markup when there are no actions so
    // existing layouts/baselines are unchanged.
    const base = cn(sectionLabelTextClass, sectionHeaderPadClass, className);
    if (actions == null) {
      return (
        <div
          ref={setRowRef}
          className={cn(
            base,
            'flex items-center'
          )}
          {...props}
        >
          {labelTooltip}
        </div>
      );
    }
    return (
      <div
        ref={setRowRef}
        className={cn(
          base,
          'flex items-center gap-[var(--ui-sidebar-secondary-section-container-header-gap)]'
        )}
        {...props}
      >
        {labelTooltip}
        <span className="flex shrink-0 items-center">{actions}</span>
      </div>
    );
  }

  // Expandable header: a chevron toggle (the Collapsible trigger) plus optional
  // trailing actions kept OUTSIDE the trigger button (no nested buttons). The
  // unread-rollup badge sits inside the trigger and shows only while collapsed.
  return (
    <div
      ref={setRowRef}
      className={cn(
        'flex items-center gap-[var(--ui-sidebar-secondary-section-container-header-gap)]',
        sectionHeaderPadClass,
        className
      )}
      {...props}
    >
      <Collapsible.Trigger
        className={cn(
          'group/section flex min-w-0 flex-1 items-center gap-[var(--ui-sidebar-secondary-section-container-header-gap)] text-start cursor-pointer',
          sectionLabelTextClass,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-inset'
        )}
      >
        <ChevronDownIcon
          size={16}
          aria-hidden="true"
          className="shrink-0 ltr:-rotate-90 rtl:rotate-90 transition-transform group-data-[panel-open]/section:rotate-0 text-[var(--ui-sidebar-secondary-section-icon-arrow-color)]"
        />
        {labelTooltip}
        {unreadRollup != null && (
          <span className="flex shrink-0 items-center group-data-[panel-open]/section:hidden">
            {unreadRollup}
          </span>
        )}
      </Collapsible.Trigger>
      {actions != null && (
        <span className="flex shrink-0 items-center">{actions}</span>
      )}
    </div>
  );
});
SidebarSecondarySectionLabel.displayName = 'SidebarSecondarySectionLabel';

const SidebarSecondaryMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => {
  const { expandable } = React.useContext(SidebarSecondarySectionContext);
  const list = (
    <ul
      ref={ref}
      className={cn(
        'flex flex-col gap-[var(--ui-sidebar-secondary-section-menu-item-list-gap)]',
        className
      )}
      {...props}
    />
  );
  // Inside an expandable section the item list IS the collapsible panel, so it
  // mounts/unmounts with the section's open state.
  return expandable ? <Collapsible.Panel>{list}</Collapsible.Panel> : list;
});
SidebarSecondaryMenu.displayName = 'SidebarSecondaryMenu';

// Shared row geometry + the GLOBAL icon/label state colors (shared across
// selected/unselected — DESIGN §6.2). The cva `variant` only swaps the container
// fill. Each interaction state is wired to its own token even where acronis's
// value is unchanged (runtime var() references honor brand overrides only on the
// referenced token).
const sidebarSecondaryRowClasses =
  'group/row flex w-full items-start gap-[var(--ui-sidebar-secondary-menu-item-global-container-gap)] min-h-[var(--ui-sidebar-secondary-menu-item-global-container-height-min)] px-[var(--ui-sidebar-secondary-menu-item-global-container-padding-x)] py-[var(--ui-sidebar-secondary-menu-item-global-container-padding-y)] no-underline ui-sidebar-secondary-menu-item-global-label-text-style transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-inset text-[var(--ui-sidebar-secondary-menu-item-global-label-color-color)] [&_svg]:shrink-0 [&_svg]:size-[var(--ui-sidebar-secondary-menu-item-global-icon-size)] [&_svg]:text-[var(--ui-sidebar-secondary-menu-item-global-icon-color-color)]';

const sidebarSecondaryMenuItemVariants = cva(sidebarSecondaryRowClasses, {
  variants: {
    variant: {
      unselected:
        'bg-[var(--ui-sidebar-secondary-menu-item-unselected-container-color-idle)] hover:bg-[var(--ui-sidebar-secondary-menu-item-unselected-container-color-hover)] active:bg-[var(--ui-sidebar-secondary-menu-item-unselected-container-color-active)]',
      selected:
        'bg-[var(--ui-sidebar-secondary-menu-item-selected-container-color-idle)] hover:bg-[var(--ui-sidebar-secondary-menu-item-selected-container-color-hover)] active:bg-[var(--ui-sidebar-secondary-menu-item-selected-container-color-active)]',
    },
  },
  defaultVariants: {
    variant: 'unselected',
  },
});

export interface SidebarSecondaryMenuItemProps
  extends
    Omit<React.ComponentPropsWithoutRef<'a'>, 'children'>,
    Omit<VariantProps<typeof sidebarSecondaryMenuItemVariants>, 'variant'> {
  /** Marks the current route: sets the `selected` variant + `aria-current="page"`. */
  selected?: boolean;
  /** Optional leading 16px icon (`hasIcon` in Figma). */
  icon?: React.ReactNode;
  /** Trailing extras (tag, shortcut, external-link icon — `hasExtras` in Figma). */
  extras?: React.ReactNode;
  children?: React.ReactNode;
  /** Replace the rendered `<a>` (e.g. a router `Link` or a `<button>`). */
  render?: useRender.RenderProp;
}

const SidebarSecondaryMenuItem = React.forwardRef<
  HTMLAnchorElement,
  SidebarSecondaryMenuItemProps
>(
  (
    { className, selected = false, icon, extras, render, children, ...props },
    ref
  ) => {
    const { expanded, setSelectedLabel } = useSidebarSecondaryContext();
    const { expandable } = React.useContext(SidebarSecondarySectionContext);
    const dir = useDocDir();
    const rowRef = React.useRef<HTMLAnchorElement>(null);
    const labelRef = React.useRef<HTMLSpanElement>(null);
    const isOverflowing = useIsOverflowing(labelRef, { enabled: expanded });

    // Register this item's label when selected so the collapsed breadcrumb
    // auto-displays the current page without manual props.
    React.useEffect(() => {
      if (selected) setSelectedLabel(children);
    }, [selected, children, setSelectedLabel]);

    const inner = useRender({
      render,
      ref: [ref, rowRef],
      defaultTagName: 'a',
      props: mergeProps<'a'>(
        {
          className: cn(
            sidebarSecondaryMenuItemVariants({
              variant: selected ? 'selected' : 'unselected',
            }),
            // Inside an expandable section, increase start padding so the
            // label aligns with the section header text (after chevron + gap)
            // while keeping the container full-width for hover/active fills.
            expandable &&
              'ps-[calc(var(--ui-sidebar-secondary-menu-item-global-container-padding-x)+var(--ui-sidebar-secondary-section-container-header-gap)+16px)]',
            className
          ),
          'aria-current': selected ? 'page' : undefined,
          onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>) => {
            if (e.key === ' ') {
              e.preventDefault();
              e.currentTarget.click();
            }
          },
          children: (
            <>
              {icon != null && (
                <span className="flex shrink-0 items-center self-start mt-[var(--ui-sidebar-secondary-menu-item-global-icon-margin-t)]">
                  {icon}
                </span>
              )}
              {/* Keep the label in the DOM as `sr-only` in collapsed/rail mode so
                an icon-only row keeps an accessible name (a11y §7). The tooltip
                trigger is the label span itself — it only opens when the label
                is actually clipped. It's anchored to the row (not the label
                span) so it lines up with the sidebar's right edge regardless
                of how much the label shrinks for extras. */}
              <Tooltip disabled={!isOverflowing}>
                <TooltipTrigger
                  render={
                    <span
                      ref={labelRef}
                      className={cn(
                        'flex-1 min-w-[60px] truncate text-start',
                        !expanded && 'sr-only'
                      )}
                    />
                  }
                >
                  {children}
                </TooltipTrigger>
                <TooltipContent
                  anchor={rowRef}
                  side={dir === 'rtl' ? 'left' : 'right'}
                >
                  {children}
                </TooltipContent>
              </Tooltip>
              {extras}
            </>
          ),
        },
        props
      ),
    });

    return (
      <li className="contents">
        {/* In collapsed/rail mode the label above is `sr-only` (zero-size), so
            it never receives the hover that would open its tooltip — wrap the
            whole row so the icon itself is hoverable and always shows the
            item's label as a tooltip while collapsed. */}
        <Tooltip disabled={expanded}>
          <TooltipTrigger render={inner} />
          <TooltipContent side={dir === 'rtl' ? 'left' : 'right'}>
            {children}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }
);
SidebarSecondaryMenuItem.displayName = 'SidebarSecondaryMenuItem';

export interface SidebarSecondaryMenuItemExtrasProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Which trailing affordance to render. */
  variant: 'tag' | 'externalLink' | 'shortcut' | 'tag-externalLink';
  /** Shortcut text for the `shortcut` variant. */
  shortcut?: string;
  /** Tag content for the `tag` / `tag-externalLink` variants. */
  tag?: React.ReactNode;
}

const SidebarSecondaryMenuItemExtras = React.forwardRef<
  HTMLSpanElement,
  SidebarSecondaryMenuItemExtrasProps
>(({ className, variant, shortcut, tag, children, ...props }, ref) => {
  const { expanded } = useSidebarSecondaryContext();
  const showTag = variant === 'tag' || variant === 'tag-externalLink';
  const showExternal =
    variant === 'externalLink' || variant === 'tag-externalLink';
  const showShortcut = variant === 'shortcut';

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center shrink-0 min-h-6 overflow-clip gap-[var(--ui-sidebar-secondary-menu-item-extras-global-container-gap)]',
        !expanded && 'hidden',
        className
      )}
      {...props}
    >
      {showTag && (tag ?? children)}
      {showShortcut && (
        <span className="ui-sidebar-secondary-menu-item-extras-global-shortcut-text-style text-[var(--ui-sidebar-secondary-menu-item-extras-global-shortcut-color)]">
          {shortcut ?? children}
        </span>
      )}
      {showExternal && (
        <SquareArrowUpRightIcon
          size={16}
          className="text-[var(--ui-sidebar-secondary-menu-item-extras-global-external-icon-color)] size-[var(--ui-sidebar-secondary-menu-item-extras-global-external-icon-size)]"
        />
      )}
    </span>
  );
});
SidebarSecondaryMenuItemExtras.displayName = 'SidebarSecondaryMenuItemExtras';

export interface SidebarSecondaryCollapseTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'children'
> {
  /** Leading 16px icon (e.g. a panel-left glyph). Rotates 180° between expanded/collapsed — same as `SidebarPrimaryCollapseTrigger`. */
  icon?: React.ReactNode;
  /** Tooltip text shown when the sidebar is collapsed. Defaults to `'Expand'`. */
  expandTooltip?: React.ReactNode;
  /** Trailing extras (e.g. a keyboard shortcut hint), same slot as `SidebarSecondaryMenuItem`. */
  extras?: React.ReactNode;
  children?: React.ReactNode;
}

// The footer "Collapse menu" affordance. A row-styled `<button>` that flips the
// panel width via the layout context — the live wiring for the controllable
// `expanded` state (B1). Keeps its label as `sr-only` in collapsed mode.
// When collapsed, wraps the button in a Tooltip showing "Expand".
const SidebarSecondaryCollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarSecondaryCollapseTriggerProps
>(
  (
    {
      className,
      icon,
      expandTooltip = 'Expand',
      extras,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { expanded, toggleExpanded } = useSidebarSecondaryContext();
    const dir = useDocDir();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const labelRef = React.useRef<HTMLSpanElement>(null);
    const isOverflowing = useIsOverflowing(labelRef, { enabled: expanded });

    const button = (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        aria-expanded={expanded}
        className={cn(
          sidebarSecondaryMenuItemVariants({ variant: 'unselected' }),
          'text-start',
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggleExpanded();
        }}
        {...props}
      >
        {icon != null && (
          <span
            className={cn(
              'flex shrink-0 items-center self-start mt-[var(--ui-sidebar-secondary-menu-item-global-icon-margin-t)] transition-transform',
              expanded ? 'rtl:rotate-180' : 'ltr:rotate-180'
            )}
          >
            {icon}
          </span>
        )}
        <Tooltip disabled={!isOverflowing}>
          <TooltipTrigger
            render={
              <span
                ref={labelRef}
                className={cn('flex-1 min-w-[60px] truncate', !expanded && 'sr-only')}
              />
            }
          >
            {children}
          </TooltipTrigger>
          <TooltipContent anchor={buttonRef} side={dir === 'rtl' ? 'left' : 'right'}>
            {children}
          </TooltipContent>
        </Tooltip>
        {extras}
      </button>
    );

    return (
      <li className="contents">
        <Tooltip disabled={expanded}>
          <TooltipTrigger render={button} />
          <TooltipContent side={dir === 'rtl' ? 'left' : 'right'}>
            {expandTooltip}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }
);
SidebarSecondaryCollapseTrigger.displayName = 'SidebarSecondaryCollapseTrigger';

export {
  SidebarSecondary,
  SidebarSecondaryHeader,
  SidebarSecondaryContent,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondaryFooter,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondaryCollapseTrigger,
  sidebarSecondaryMenuItemVariants,
};

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';

// A responsive action row with automatic overflow — actions render inline in
// priority order; when they don't fit the available width, the trailing ones
// collapse into a "More" dropdown menu, recomputed on resize (ResizeObserver).
//
// Widths come from an off-screen "tracing layer" that renders every action at its
// intrinsic width (ghost-button footprint) plus the overflow trigger; the pure
// `computeFittedVisibleCount` turns those measurements into a visible count. All
// state updates happen inside the ResizeObserver callback (never synchronously in
// the effect), so before the first measurement every action is shown.

const DEFAULT_GAP = 8;

/**
 * Pure overflow math (no DOM). Greedily fits leading actions into
 * `containerWidth - dropdownWidth`, accounting for the inter-item `gap`. Returns
 * how many render inline; the rest overflow into the menu. Exported for testing.
 */
export function computeFittedVisibleCount({
  containerWidth,
  itemWidths,
  dropdownWidth,
  gap = DEFAULT_GAP,
}: {
  containerWidth: number;
  itemWidths: number[];
  dropdownWidth: number;
  gap?: number;
}): number {
  const count = itemWidths.length;
  if (count === 0) return 0;
  const available = containerWidth - dropdownWidth;
  let used = 0;
  let visible = 0;
  for (let index = 0; index < count; index += 1) {
    const next = used + (visible > 0 ? gap : 0) + (itemWidths[index] ?? 0);
    if (next <= available) {
      used = next;
      visible += 1;
    } else break;
  }
  return visible;
}

export interface FittedAction {
  /** Stable identity. */
  id: string;
  /** Visible label (also the overflow menu-item label). */
  label: React.ReactNode;
  /** Optional leading 16px icon. */
  icon?: React.ReactNode;
  /** Set `false` to omit the action entirely. */
  isDisplayed?: boolean;
  /** Render a divider above this item when it sits in the overflow menu. */
  divided?: boolean;
  disabled?: boolean;
  /** Invoked when this action is chosen (inline click or menu select). */
  onSelect?: () => void;
}

export interface FittedActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Ordered actions; trailing items overflow into the menu first. Defaults to `[]`. */
  actions?: FittedAction[];
  /** Collapse overflow into a "More" menu. Default true. */
  showDropdown?: boolean;
  /** Label for the overflow trigger. Default "More". */
  moreLabel?: React.ReactNode;
  /** Inter-item gap in px (also reserved when measuring). Default 8. */
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
}

const measureClass = buttonVariants({ variant: 'ghost' });

const FittedActions = React.forwardRef<HTMLDivElement, FittedActionsProps>(
  (
    {
      actions = [],
      showDropdown = true,
      moreLabel = 'More',
      gap = DEFAULT_GAP,
      onAction,
      renderAction,
      renderTrigger,
      className,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const displayed = React.useMemo(
      () => actions.filter((action) => action.isDisplayed !== false),
      [actions]
    );

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const measureRef = React.useRef<HTMLDivElement | null>(null);
    const [visibleCount, setVisibleCount] = React.useState(displayed.length);

    const setContainer = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    React.useLayoutEffect(() => {
      const container = containerRef.current;
      const measure = measureRef.current;
      // With no overflow menu, or no way to measure, show everything inline.
      // Every state update happens inside the observer callback below (which
      // fires an initial notification on observe), never synchronously here.
      if (
        !showDropdown ||
        !container ||
        !measure ||
        typeof ResizeObserver === 'undefined'
      )
        return;
      const observer = new ResizeObserver(() => {
        const clones = Array.from(measure.children) as HTMLElement[];
        const dropdownWidth = clones[clones.length - 1]?.offsetWidth ?? 0;
        const itemWidths = clones
          .slice(0, displayed.length)
          .map((element) => element.offsetWidth);
        const containerWidth = container.clientWidth;
        setVisibleCount(
          containerWidth === 0
            ? displayed.length
            : computeFittedVisibleCount({
                containerWidth,
                itemWidths,
                dropdownWidth,
                gap,
              })
        );
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, [displayed, showDropdown, moreLabel, gap]);

    const effectiveVisible = showDropdown ? visibleCount : displayed.length;
    const inline = displayed.slice(0, effectiveVisible);
    const overflow = showDropdown ? displayed.slice(effectiveVisible) : [];

    const select = (action: FittedAction) => {
      action.onSelect?.();
      onAction?.(action);
    };

    const defaultRenderAction = (action: FittedAction) => (
      <Button
        variant="ghost"
        disabled={action.disabled}
        onClick={() => select(action)}
      >
        {action.icon}
        {action.label}
      </Button>
    );

    const triggerElement = renderTrigger ? (
      renderTrigger({ label: moreLabel })
    ) : (
      <Button variant="ghost">{moreLabel}</Button>
    );

    return (
      <>
        <div
          ref={setContainer}
          data-slot="fitted-actions"
          className={cn('flex min-w-0 items-center overflow-hidden', className)}
          style={{ gap: `${gap}px`, ...style }}
          {...props}
        >
          {inline.map((action) => (
            <React.Fragment key={action.id}>
              {renderAction
                ? renderAction(action, {
                    onSelect: () => select(action),
                    disabled: action.disabled,
                  })
                : defaultRenderAction(action)}
            </React.Fragment>
          ))}
          {overflow.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger render={triggerElement} />
              <DropdownMenuContent align="end">
                {overflow.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    disabled={action.disabled}
                    onClick={() => select(action)}
                    className={cn(
                      action.divided && 'mt-1 border-t border-border pt-1'
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {/* Off-screen tracing layer: intrinsic widths of every action (ghost
            footprint) + the overflow trigger, read on resize. Not part of the
            focus order or the a11y tree. */}
        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex"
          style={{ gap: `${gap}px` }}
        >
          {displayed.map((action) => (
            <span key={action.id} className={measureClass}>
              {action.icon}
              {action.label}
            </span>
          ))}
          {triggerElement}
        </div>
      </>
    );
  }
);
FittedActions.displayName = 'FittedActions';

export { FittedActions };

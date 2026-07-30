import * as React from 'react';
import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { ButtonMenu } from '../button-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';

// Mirrors the Figma "Toolbar" component (node 3897:7199): a horizontal action
// row — list actions, an optional overflow control (e.g. a `ButtonMenu`), and
// an optional trailing area (`ToolbarActions`: a status text or a selection
// counter + action) — typically shown above/below a list or table when rows
// are selected or bulk actions are available. Every action is an existing
// `Button`/`ButtonMenu` instance in Figma, so this component only lays them
// out and carries no dedicated `--ui-toolbar-*` token tier; the 16px
// inter-item gap is the Figma `gap/gap-16` semantic token, left un-tokenized —
// same precedent as `FilterSearch`'s identical gap.
//
// The Figma `state: active | disabled` variant is the native `disabled`
// attribute here: the root renders as a `<fieldset>` (reset to look like a
// flex row) so every nested `Button`/`ButtonMenu` disables via the platform's
// own fieldset-disables-descendants behavior — no prop-drilling into
// arbitrary children required.
//
// `min-w-0` is required, not cosmetic: browsers give `<fieldset>` an
// intrinsic `min-width: min-content` that Tailwind's reset doesn't touch, so
// without it the fieldset refuses to shrink below its content's natural
// width. `ToolbarActionList`'s collapse math reads this fieldset's own
// `clientWidth` as "available space" — without `min-w-0` the fieldset
// balloons to fit every action before that measurement ever runs, so it
// always measures "everything fits" and the row never collapses.

// The fieldset cascade only reaches descendants, so anything a nested part
// renders in a portal (see `ToolbarActionList`'s overflow menu) has to learn
// the disabled state another way. This carries it in React, deliberately
// rather than reading the fieldset's `disabled` attribute back out of the DOM:
// an out-of-React side channel (a MutationObserver on the attribute) resolves
// one render *after* the fact, so the portal renders enabled for a beat, and
// its `setState` lands outside React's own scheduling — which under React 19's
// act environment is intermittently never flushed at all, leaving the portal
// enabled forever.
const ToolbarDisabledContext = React.createContext(false);

export type ToolbarProps = React.ComponentPropsWithoutRef<'fieldset'>;

const Toolbar = React.forwardRef<HTMLFieldSetElement, ToolbarProps>(
  ({ className, disabled, ...props }, ref) => (
    <ToolbarDisabledContext.Provider value={!!disabled}>
      <fieldset
        ref={ref}
        className={cn(
          'm-0 flex min-w-0 items-center gap-4 border-0 p-0',
          className
        )}
        disabled={disabled}
        {...props}
      />
    </ToolbarDisabledContext.Provider>
  )
);
Toolbar.displayName = 'Toolbar';

// Trailing, right-aligned area — a status text (e.g. "25 of 1250 items
// loaded") or a selection counter + action (e.g. "6 items selected: Deselect").
// 8px inter-child gap matches the Figma Counter part's own gap. `whitespace-nowrap`
// is required, not cosmetic: the Figma "Counter" part is always single-line, but a
// plain-text child (e.g. a `<span>`) defaults to `white-space: normal` — without
// this, the text wraps mid-phrase once the row shrinks below its content's natural
// width (`white-space` is inherited, so it cascades to children without them
// needing their own override).
//
// `grow shrink-0` (not `flex-1`, which also shrinks): this area must grow to fill
// leftover space so `justify-end` can right-align it, but must never shrink below
// its own content's natural width. `ToolbarActionList`'s auto-collapse math reads
// this element's *rendered* width as the space it needs to reserve — if it could
// shrink, that measurement would be a moving target (less room reserved than the
// content actually needs), so the actions row would under-collapse and this area's
// (nowrap, unshrinkable) content would overflow past its own box instead.
export type ToolbarActionsProps = React.ComponentPropsWithoutRef<'div'>;

const ToolbarActions = React.forwardRef<HTMLDivElement, ToolbarActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex grow shrink-0 items-center justify-end gap-2 whitespace-nowrap',
        className
      )}
      {...props}
    />
  )
);
ToolbarActions.displayName = 'ToolbarActions';

// Matches the `gap-4` utility used on both this component's row and
// Toolbar's own root — keep in sync if either class changes.
const ACTION_LIST_GAP_PX = 16;

// Pure so the collapse math is unit-testable without mocking layout/ResizeObserver.
// Greedily fits as many leading items as possible into `availableWidth`; the
// instant not everything fits, reserves `moreWidth` (+ one gap) for the
// overflow trigger before fitting items.
export function computeVisibleActionCount(
  itemWidths: number[],
  moreWidth: number,
  gap: number,
  availableWidth: number
): number {
  const total = itemWidths.length;
  if (total === 0) return 0;

  const fullWidth =
    itemWidths.reduce((sum, width) => sum + width, 0) + gap * (total - 1);
  if (fullWidth <= availableWidth) return total;

  let used = moreWidth;
  let count = 0;
  for (let i = 0; i < total; i++) {
    const next = used + itemWidths[i] + gap;
    if (next > availableWidth) break;
    used = next;
    count++;
  }
  return count;
}

// A grown sibling's own `getBoundingClientRect()` reflects its flex-grown
// box, not the space its content actually needs — reading that would make
// `measure()`'s "available space" calculation self-referential (see below),
// so this reads the sibling's *content nodes* instead: normal (non-growing)
// flex children report their natural width regardless of how large the
// parent's box has grown to fill leftover row space. Bare text (e.g.
// `<ToolbarActions>25 selected</ToolbarActions>` with no wrapping element)
// renders as a `Text` node rather than an `Element`, so `children` alone
// would miss it and fall through to the self-referential branch this
// function exists to avoid — a `Range` measures that text's own rendered
// width the same way `getBoundingClientRect()` does for an element.
//
// The sibling's own padding/border don't grow with flex-grow (only the free
// space between content and box edge does), so they're safe to add back on
// top of the content sum — unlike the box's own `getBoundingClientRect()`,
// which is self-referential.
//
// Exported (like `computeVisibleActionCount`) so this is unit-testable
// without mocking layout/ResizeObserver.
export function measureNaturalWidth(el: Element): number {
  const nodes = Array.from(el.childNodes).filter(
    (node): node is ChildNode =>
      node.nodeType === Node.ELEMENT_NODE ||
      (node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim())
  );
  if (nodes.length === 0) return el.getBoundingClientRect().width;

  const style = getComputedStyle(el);
  const gap = parseFloat(style.columnGap) || 0;
  const ownPaddingAndBorder =
    (parseFloat(style.paddingLeft) || 0) +
    (parseFloat(style.paddingRight) || 0) +
    (parseFloat(style.borderLeftWidth) || 0) +
    (parseFloat(style.borderRightWidth) || 0);
  const widths = nodes.map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const range = document.createRange();
      range.selectNodeContents(node);
      return range.getBoundingClientRect().width;
    }
    return (node as Element).getBoundingClientRect().width;
  });

  return (
    widths.reduce((sum, width) => sum + width, 0) +
    gap * (nodes.length - 1) +
    ownPaddingAndBorder
  );
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as React.RefObject<T | null>).current = node;
    }
  };
}

export interface ToolbarActionListItem {
  /** Stable identity — used as the React key in both the row and the overflow menu. */
  key: string;
  /** Rendered as the visible ghost Button's label, and the overflow menu item's label. */
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface ToolbarActionListProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Ordered list of actions; trailing ones collapse into "More actions" first. */
  actions: ToolbarActionListItem[];
  /** Label for the overflow trigger. */
  moreActionsLabel?: React.ReactNode;
}

// Mirrors the Figma "ListActions" part, but drives its `hasMoreActions`
// overflow menu from measured available width instead of a static boolean —
// the breakpoints spec (node 6262:28276) requires that "if there is no space
// for all Toolbar actions, then last actions must be hidden under More
// actions." Renders every action as a ghost Button until they no longer fit
// the row, then moves the trailing ones into a ButtonMenu + DropdownMenu
// (same trigger Figma's `hasMoreActions` variant shows). An invisible clone
// of every action + the trigger is kept mounted purely to measure natural
// widths, since a hidden item can't report its own size.
//
// The root and each visible action/trigger are Base UI's `Toolbar.Root`/
// `Toolbar.Button` (`@base-ui/react/toolbar`), giving the row the WAI-ARIA
// toolbar pattern for free: one Tab stop, arrow-key roving-tabindex between
// actions and into the overflow trigger. Base UI's `Toolbar.Root` does not
// forward `enableHomeAndEndKeys` to its underlying composite, so Home/End
// are not supported here — this is a Base UI limitation, not a choice made
// in this component. `Toolbar.Button` composes
// via `render` the same way `DropdownMenuTrigger`/`ButtonMenu` already do
// below — it merges its own composite/keydown/disabled props onto whatever
// element you pass. `focusableWhenDisabled={!action.disabled}` opts a
// disabled action out of Base UI's default APG toolbar treatment (disabled
// items normally stay focusable via `aria-disabled`, skippable with Tab) so
// it matches every other disabled `Button` in this library: a real native
// `disabled` button, unreachable via Tab or arrow keys. This MUST stay
// conditional on `action.disabled` — `Toolbar.Root` builds its
// `disabledIndices` list from `focusableWhenDisabled` alone, regardless of
// the item's actual disabled state, so passing a bare `false` here disables
// every index and silently breaks arrow-key navigation for the whole row.
//
// The invisible measurement clones stay plain `Button`/`ButtonMenu` (not
// `Toolbar.Button`): registering them too would double-count hidden items in
// the roving-tabindex list. This is scoped to the action list only —
// `Toolbar`'s own `<fieldset>` disabled-cascade (see above) is
// intentionally untouched; Base UI's `Fieldset.Root` strips the native
// `disabled` attribute in favor of a context other Base UI Field-aware
// components consume, which `Button`/`ButtonMenu` don't, so it would silently
// break the "disabling the toolbar disables every nested control" guarantee.
const ToolbarActionList = React.forwardRef<
  HTMLDivElement,
  ToolbarActionListProps
>(
  (
    { className, actions, moreActionsLabel = 'More actions', ...props },
    forwardedRef
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef<Map<string, HTMLButtonElement | null>>(
      new Map()
    );
    const moreRef = React.useRef<HTMLButtonElement>(null);
    const [visibleCount, setVisibleCount] = React.useState(actions.length);
    const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
    // The overflow menu renders in a portal, outside the ancestor
    // `<fieldset>`'s DOM subtree, so the native disabled-cascade (see
    // `Toolbar` above) never reaches its items — they read the state off
    // context instead, so a menu already open when the toolbar becomes
    // disabled gets closed, and its items stay disabled even if forced open
    // again (e.g. via a ref).
    const ancestorDisabled = React.useContext(ToolbarDisabledContext);

    // Gating the `open` prop (rather than only resetting the state below)
    // closes the menu in the very commit the toolbar becomes disabled — an
    // effect would leave it open for one frame.
    const menuOpen = moreMenuOpen && !ancestorDisabled;

    // Still clear the stored state, or re-enabling the toolbar would pop the
    // menu back open on its own.
    React.useEffect(() => {
      if (ancestorDisabled) setMoreMenuOpen(false);
    }, [ancestorDisabled]);

    const measure = React.useCallback(() => {
      const container = containerRef.current;
      const parent = container?.parentElement;
      if (!container || !parent) return;

      const siblingsWidth = Array.from(parent.children)
        .filter((child) => child !== container)
        .reduce((sum, el) => sum + measureNaturalWidth(el), 0);
      const gapCount = Math.max(parent.children.length - 1, 0);
      const available =
        parent.clientWidth - siblingsWidth - ACTION_LIST_GAP_PX * gapCount;

      // Keyed by `action.key`, not index — an index-keyed array would keep
      // stale entries (and a stale length) when `actions` shrinks, since
      // React only nulls out the removed clones' refs without truncating it.
      const itemWidths = actions.map(
        (action) =>
          itemRefs.current.get(action.key)?.getBoundingClientRect().width ?? 0
      );
      const moreWidth = moreRef.current?.getBoundingClientRect().width ?? 0;

      setVisibleCount(
        computeVisibleActionCount(
          itemWidths,
          moreWidth,
          ACTION_LIST_GAP_PX,
          available
        )
      );
    }, [actions]);

    React.useLayoutEffect(() => {
      measure();
      const parent = containerRef.current?.parentElement;
      if (!parent) return;
      const observer = new ResizeObserver(measure);
      observer.observe(parent);
      // A sibling like `ToolbarActions` is `shrink-0`, so its own border-box
      // grows with its content (e.g. a "6 items selected" counter ticking
      // up) even while `parent`'s box stays fixed — a ResizeObserver bound
      // only to `parent` never fires for that case, so `measure()` goes
      // stale and the row silently overflows instead of collapsing further.
      // Observing every sibling directly catches that box-size change too.
      Array.from(parent.children).forEach((sibling) => {
        if (sibling !== containerRef.current) observer.observe(sibling);
      });
      return () => observer.disconnect();
    }, [measure, actions]);

    const visibleActions = actions.slice(0, visibleCount);
    const hiddenActions = actions.slice(visibleCount);

    return (
      <ToolbarPrimitive.Root
        ref={mergeRefs(containerRef, forwardedRef)}
        className={cn(
          // `overflow-hidden` clips the invisible measurement clone below —
          // it's `position: absolute` + `visibility: hidden`, which keeps
          // contributing to this element's scrollable overflow (and thus a
          // real horizontal scrollbar on a narrow container/page) unless
          // something in the ancestor chain clips it. Visible content is
          // already sized to fit `availableWidth` by the collapse math, so
          // clipping never affects anything actually shown.
          'relative flex min-w-0 flex-nowrap items-center gap-4 overflow-hidden',
          className
        )}
        {...props}
      >
        {visibleActions.map((action) => (
          <ToolbarPrimitive.Button
            key={action.key}
            disabled={action.disabled}
            focusableWhenDisabled={!action.disabled}
            onClick={action.onSelect}
            render={<Button variant="ghost">{action.label}</Button>}
          />
        ))}
        {hiddenActions.length > 0 && (
          <DropdownMenu
            open={menuOpen}
            onOpenChange={setMoreMenuOpen}
            disabled={ancestorDisabled}
          >
            <ToolbarPrimitive.Button
              render={
                <DropdownMenuTrigger
                  render={
                    <ButtonMenu variant="secondary">
                      {moreActionsLabel}
                    </ButtonMenu>
                  }
                />
              }
            />
            <DropdownMenuContent align="start">
              {hiddenActions.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  disabled={action.disabled || ancestorDisabled}
                  onClick={action.onSelect}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div
          aria-hidden
          inert
          className="pointer-events-none invisible absolute start-0 top-0 flex items-center gap-4"
        >
          {actions.map((action) => (
            <Button
              key={action.key}
              ref={(el) => {
                itemRefs.current.set(action.key, el);
              }}
              variant="ghost"
              tabIndex={-1}
            >
              {action.label}
            </Button>
          ))}
          <ButtonMenu ref={moreRef} variant="secondary" tabIndex={-1}>
            {moreActionsLabel}
          </ButtonMenu>
        </div>
      </ToolbarPrimitive.Root>
    );
  }
);
ToolbarActionList.displayName = 'ToolbarActionList';

export { Toolbar, ToolbarActions, ToolbarActionList };

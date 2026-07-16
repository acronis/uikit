import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { SquareArrowUpRightIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useDocDir } from '@/lib/use-doc-dir';

import { ScrollArea } from '../scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// Composable SidebarPrimary primitives mirroring the Figma "SidebarPrimary"
// component set (node 2092:4359, variant expanded|collapsed). Every color and
// metric is wired to a next-gen `--ui-sidebar-primary-*` token from
// @acronis-platform/tokens-pd — no hex, no invented tokens.
//
// expanded/collapsed is a width-reflow state, not a panel show/hide, so it is
// modelled as a controlled/uncontrolled `expanded` prop (default true) that sets
// `data-state="expanded|collapsed"` on the root. Every metric token has a
// distinct `collapsed-*` / `expanded-*` name, switched via `data-[state=…]`
// attribute selectors — Base UI Collapsible would fight this (it hides a panel;
// the rail never hides). Layout state is shared to descendants through a small
// context so menu items know whether to show or `sr-only` their label/extras.
//
// R2 (menu-item border-radius): the token tier ships no radius token. Verified
// against the Figma node — the menu-item COMPONENT and its container frame both
// report cornerRadius=None (the only radius in the node is the COMPONENT_SET's
// own variant-container chrome). Rows are therefore SQUARE; no `rounded-*` is
// applied. The focus ring uses the shared `--ui-focus-brand` (no sidebar focus
// token exists — R1), matching Button/Breadcrumb.

interface SidebarPrimaryContextValue {
  expanded: boolean;
  /** Flip the rail width — drives the controlled/uncontrolled `expanded` state. */
  toggleExpanded: () => void;
}

const SidebarPrimaryContext =
  React.createContext<SidebarPrimaryContextValue | null>(null);

function useSidebarPrimaryContext(): SidebarPrimaryContextValue {
  // Default to expanded so parts render standalone (e.g. in isolation tests /
  // stories) without a wrapping root; the toggle is a no-op outside a root.
  return (
    React.useContext(SidebarPrimaryContext) ?? {
      expanded: true,
      toggleExpanded: () => {},
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

export interface SidebarPrimaryProps
  extends React.ComponentPropsWithoutRef<'nav'> {
  /** Controlled expanded (rail width) state. */
  expanded?: boolean;
  /** Uncontrolled initial expanded state. Defaults to `true` (full width). */
  defaultExpanded?: boolean;
  /** Fires when the expanded state changes (e.g. a consumer toggle). */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Replace the rendered `<nav>` with another element or component
   * (Base UI composition). Accepts a React element or a render function.
   */
  render?: useRender.RenderProp;
}

const SidebarPrimary = React.forwardRef<HTMLElement, SidebarPrimaryProps>(
  (
    {
      className,
      expanded: expandedProp,
      defaultExpanded = true,
      onExpandedChange,
      'aria-label': ariaLabel = 'Primary',
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

    // Collapse is driven by the consumer through the layout context — the
    // `SidebarPrimaryCollapseTrigger` (the Figma "Collapse menu" footer item)
    // calls `toggleExpanded`, which updates uncontrolled state and always emits
    // `onExpandedChange`. Controlled consumers ignore the internal state and
    // react to the callback.
    const context = React.useMemo<SidebarPrimaryContextValue>(
      () => ({ expanded, toggleExpanded: () => setExpanded(!expanded) }),
      [expanded, setExpanded]
    );

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
          className: cn(
            'group/sidebar flex h-full flex-col bg-[var(--ui-sidebar-primary-global-container-color)] w-[var(--ui-sidebar-primary-collapsed-container-width)] data-[state=expanded]:w-[var(--ui-sidebar-primary-expanded-container-width)] transition-[width]',
            className
          ),
          children,
        },
        props
      ),
    });

    return (
      <SidebarPrimaryContext.Provider value={context}>
        {element}
      </SidebarPrimaryContext.Provider>
    );
  }
);
SidebarPrimary.displayName = 'SidebarPrimary';

export interface SidebarPrimaryHeaderProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Logo content shown while the rail is expanded (e.g. a full lockup).
   * Pairs with `collapsedLogo` to swap distinct graphics per rail state
   * instead of resizing one. When neither `logo` nor `collapsedLogo` is
   * given, `children` renders in both states (the original single-slot
   * behavior).
   */
  logo?: React.ReactNode;
  /**
   * Logo content shown while the rail is collapsed (e.g. a monogram mark).
   * Falls back to `logo` when omitted.
   */
  collapsedLogo?: React.ReactNode;
}

const SidebarPrimaryHeader = React.forwardRef<
  HTMLDivElement,
  SidebarPrimaryHeaderProps
>(({ className, logo, collapsedLogo, children, ...props }, ref) => {
  // Hosts a consumer-provided logo (R7 — no Logo part is built). Padding and the
  // logo height switch on expanded/collapsed; `[&_*]:h-…` sizes whatever the
  // consumer slots in. The logo color token tints any `currentColor` mark.
  const { expanded } = useSidebarPrimaryContext();
  const hasTwinLogos = logo != null || collapsedLogo != null;
  const content = hasTwinLogos
    ? expanded
      ? (logo ?? collapsedLogo)
      : (collapsedLogo ?? logo)
    : children;

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center shrink-0 text-[var(--ui-sidebar-primary-global-logo-color)] transition-[padding]',
        'px-[var(--ui-sidebar-primary-collapsed-container-header-padding-x)] py-[var(--ui-sidebar-primary-collapsed-container-header-padding-y)]',
        // `logo`/`collapsedLogo` are two separate elements swapped by a JS
        // conditional (not one element whose size CSS-transitions) — the new
        // one mounts at its final height instantly, while `padding-y` is
        // still mid-transition. Since the two states' (padding*2 + logo
        // height) sums only match at the transition's start/end, that instant
        // pop makes the row briefly overshoot/undershoot its resting height
        // and "jump". Pinning the row to the larger of the two sums makes the
        // outer box's height constant across the whole transition regardless
        // of that mismatch — padding/logo-height still animate cosmetically
        // inside it.
        'h-[max(calc(var(--ui-sidebar-primary-collapsed-container-header-padding-y)*2+var(--ui-sidebar-primary-collapsed-logo-height)),calc(var(--ui-sidebar-primary-expanded-container-header-padding-y)*2+var(--ui-sidebar-primary-expanded-logo-height)))]',
        // Animate the logo's own height alongside the header's padding transition
        // (both keyed off the same `data-state` flip) — without it the logo swaps
        // size instantly while the rail width is still animating, reading as a jump.
        '[&_:where(img,svg)]:h-[var(--ui-sidebar-primary-collapsed-logo-height)] [&_:where(img,svg)]:w-auto [&_:where(img,svg)]:transition-[height]',
        'group-data-[state=expanded]/sidebar:px-[var(--ui-sidebar-primary-expanded-container-header-padding-x)] group-data-[state=expanded]/sidebar:py-[var(--ui-sidebar-primary-expanded-container-header-padding-y)]',
        'group-data-[state=expanded]/sidebar:[&_:where(img,svg)]:h-[var(--ui-sidebar-primary-expanded-logo-height)]',
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
});
SidebarPrimaryHeader.displayName = 'SidebarPrimaryHeader';

const SidebarPrimaryContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  // The section list scrolls inside a ScrollArea: its overlay scrollbar floats
  // over the content and reserves no gutter, so the full-bleed selected row is
  // never cropped — on every OS, unlike a native `overflow` scrollbar.
  //
  // Base UI's Scroll Area Content sets `min-width: fit-content` inline (it
  // needs the content's true intrinsic width to detect horizontal overflow),
  // which forces every row wider than the rail — overriding `min-w-0` +
  // `truncate` on a long label, since intrinsic-width calculations ignore
  // `text-overflow`. We only ever scroll vertically here, so cancel it: the
  // `!` (important) is required to beat the inline style's specificity.
  <ScrollArea
    ref={ref}
    className={cn(
      'min-h-0 flex-1 [&_[data-slot=scroll-area-content]]:min-w-0!',
      className
    )}
    {...props}
  >
    <div className="flex flex-col gap-[var(--ui-sidebar-primary-global-section-list-gap)]">
      {children}
    </div>
  </ScrollArea>
));
SidebarPrimaryContent.displayName = 'SidebarPrimaryContent';

const SidebarPrimaryFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn(
      'flex flex-col shrink-0 gap-[var(--ui-sidebar-primary-global-footer-list-gap)]',
      'border-t border-[var(--ui-sidebar-primary-global-container-footer-border-color)] [border-top-width:var(--ui-sidebar-primary-global-container-footer-border-width)]',
      className
    )}
    {...props}
  />
));
SidebarPrimaryFooter.displayName = 'SidebarPrimaryFooter';

const SidebarPrimarySection = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  // position (`:not(:first-child)`) instead of a prop.
  <div
    ref={ref}
    className={cn(
      'flex flex-col pb-[var(--ui-sidebar-primary-section-container-padding-y)]',
      '[&:not(:first-child)]:border-t [&:not(:first-child)]:border-[var(--ui-sidebar-primary-section-container-border-color)] [&:not(:first-child)]:[border-top-width:var(--ui-sidebar-primary-section-container-border-width)] [&:not(:first-child)]:pt-[var(--ui-sidebar-primary-section-container-padding-y)]',
      className
    )}
    {...props}
  />
));
SidebarPrimarySection.displayName = 'SidebarPrimarySection';

const SidebarPrimaryMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'flex flex-col gap-[var(--ui-sidebar-primary-section-menu-item-list-gap)]',
      className
    )}
    {...props}
  />
));
SidebarPrimaryMenu.displayName = 'SidebarPrimaryMenu';

// Primary recolors the container, the icon AND the label per variant
// (selected|unselected) × interaction state (idle/hover/active). Every state is
// wired to its own token even where acronis's value is unchanged, because these
// are runtime `var()` references — a brand override is only honored if the
// matching state token is referenced. (This is why Primary cannot share a cva
// with Secondary, which recolors only the container — DESIGN §6.2.)
const sidebarPrimaryMenuItemVariants = cva(
  'group/menu-item flex w-full items-center gap-[var(--ui-sidebar-primary-menu-item-global-container-gap)] h-[var(--ui-sidebar-primary-menu-item-global-container-height)] px-[var(--ui-sidebar-primary-menu-item-global-container-padding-x)] py-[var(--ui-sidebar-primary-menu-item-global-container-padding-y)] no-underline cursor-pointer ui-sidebar-primary-menu-item-global-label-text-style transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-inset [&_svg]:shrink-0 [&_svg]:size-[var(--ui-sidebar-primary-menu-item-global-icon-size)]',
  {
    variants: {
      variant: {
        unselected:
          'bg-[var(--ui-sidebar-primary-menu-item-unselected-container-color-idle)] text-[var(--ui-sidebar-primary-menu-item-unselected-label-color-idle)] [&_svg]:text-[var(--ui-sidebar-primary-menu-item-unselected-icon-color-idle)] hover:bg-[var(--ui-sidebar-primary-menu-item-unselected-container-color-hover)] hover:text-[var(--ui-sidebar-primary-menu-item-unselected-label-color-hover)] hover:[&_svg]:text-[var(--ui-sidebar-primary-menu-item-unselected-icon-color-hover)] active:bg-[var(--ui-sidebar-primary-menu-item-unselected-container-color-active)] active:text-[var(--ui-sidebar-primary-menu-item-unselected-label-color-active)] active:[&_svg]:text-[var(--ui-sidebar-primary-menu-item-unselected-icon-color-active)]',
        selected:
          'bg-[var(--ui-sidebar-primary-menu-item-selected-container-color-idle)] text-[var(--ui-sidebar-primary-menu-item-selected-label-color-idle)] [&_svg]:text-[var(--ui-sidebar-primary-menu-item-selected-icon-color-idle)] hover:bg-[var(--ui-sidebar-primary-menu-item-selected-container-color-hover)] hover:text-[var(--ui-sidebar-primary-menu-item-selected-label-color-hover)] hover:[&_svg]:text-[var(--ui-sidebar-primary-menu-item-selected-icon-color-hover)] active:bg-[var(--ui-sidebar-primary-menu-item-selected-container-color-active)] active:text-[var(--ui-sidebar-primary-menu-item-selected-label-color-active)] active:[&_svg]:text-[var(--ui-sidebar-primary-menu-item-selected-icon-color-active)]',
      },
    },
    defaultVariants: {
      variant: 'unselected',
    },
  }
);

interface SidebarPrimaryMenuItemBaseProps
  extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children'>,
    Omit<VariantProps<typeof sidebarPrimaryMenuItemVariants>, 'variant'> {
  /** Marks the current route: sets the `selected` variant + `aria-current="page"`. */
  selected?: boolean;
  children?: React.ReactNode;
  /**
   * Trailing affordance — a `SidebarPrimaryMenuItemExtras` element. Rendered as
   * a flex sibling of the label (its own `gap` from `_global/container/gap`),
   * not nested inside the label's truncating span — nesting it there collapses
   * the row gap and lets `truncate` clip the affordance. Hidden in collapsed/rail
   * mode regardless of node type — the parent wraps it, so this holds even for
   * a raw node rather than `SidebarPrimaryMenuItemExtras`.
   */
  extras?: React.ReactNode;
  /**
   * Replace the rendered `<a>` with another element or component (e.g. a router
   * `Link` or a `<button>`) via Base UI composition.
   */
  render?: useRender.RenderProp;
}

// A nav rail row is icon-only when collapsed, so `icon` is required by default
// (UX: every row must stay legible in rail mode). `noIcon` is the explicit,
// rare escape hatch for a consumer that truly has no icon for a row.
export type SidebarPrimaryMenuItemProps = SidebarPrimaryMenuItemBaseProps &
  (
    | {
        /** Leading 16px icon (from `@acronis-platform/icons-react`). */
        icon: Exclude<React.ReactNode, undefined>;
        noIcon?: never;
      }
    | { icon?: undefined; /** Explicit opt-out for the rare row with no icon. */ noIcon: true }
  );

const SidebarPrimaryMenuItem = React.forwardRef<
  HTMLAnchorElement,
  SidebarPrimaryMenuItemProps
>(
  (
    {
      className,
      selected = false,
      icon,
      noIcon,
      render,
      children,
      extras,
      ...props
    },
    ref
  ) => {
    const { expanded } = useSidebarPrimaryContext();
    const dir = useDocDir();
    const rowRef = React.useRef<HTMLAnchorElement>(null);
    const labelRef = React.useRef<HTMLSpanElement>(null);
    const isOverflowing = useIsOverflowing(labelRef, { enabled: expanded });

    const inner = useRender({
      render,
      ref: [ref, rowRef],
      defaultTagName: 'a',
      props: mergeProps<'a'>(
        {
          className: cn(
            sidebarPrimaryMenuItemVariants({
              variant: selected ? 'selected' : 'unselected',
            }),
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
                <span className="flex shrink-0 items-center self-start mt-[var(--ui-sidebar-primary-menu-item-global-icon-margin-t)]">
                  {icon}
                </span>
              )}
              {/* Keep the label in the DOM in collapsed/rail mode as `sr-only` so
                  the icon-only row keeps an accessible name (a11y §7) — never
                  `display:none` the text. Extras are visually dropped when
                  collapsed but stay queryable for the same reason. The tooltip
                  trigger is the label span itself, not the row — it must not
                  open when hovering the icon or extras, and only ever opens
                  when the label is actually clipped. It's anchored to the row
                  (not the label span) so it lines up with the sidebar's right
                  edge regardless of how much the label shrinks for extras. */}
              <Tooltip disabled={!isOverflowing}>
                <TooltipTrigger
                  render={
                    <span
                      ref={labelRef}
                      className={cn(
                        'min-w-0 flex-1 truncate text-start',
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
              {extras != null && (
                <span className={cn(!expanded && 'hidden')}>{extras}</span>
              )}
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
SidebarPrimaryMenuItem.displayName = 'SidebarPrimaryMenuItem';

export interface SidebarPrimaryMenuItemExtrasProps
  extends React.ComponentPropsWithoutRef<'span'> {
  /** Which trailing affordance to render. */
  variant: 'tag' | 'externalLink' | 'shortcut' | 'tag-externalLink';
  /** Shortcut text (e.g. "⌘H") for the `shortcut` variant. */
  shortcut?: string;
  /**
   * Tag content for the `tag` / `tag-externalLink` variants. Figma constrains
   * this slot's `Tag` instance to `size="sm"` (no other size is offered on
   * MenuItemExtras) — always pass a `<Tag variant="info" size="sm">`, never the
   * default size.
   */
  tag?: React.ReactNode;
}

const SidebarPrimaryMenuItemExtras = React.forwardRef<
  HTMLSpanElement,
  SidebarPrimaryMenuItemExtrasProps
>(({ className, variant, shortcut, tag, children, ...props }, ref) => {
  const { expanded } = useSidebarPrimaryContext();
  const showTag = variant === 'tag' || variant === 'tag-externalLink';
  const showExternal =
    variant === 'externalLink' || variant === 'tag-externalLink';
  const showShortcut = variant === 'shortcut';

  return (
    <span
      ref={ref}
      // The extras cluster is rail-mode noise — drop it when collapsed.
      className={cn(
        'inline-flex items-center gap-[var(--ui-sidebar-primary-menu-item-extras-global-container-gap)]',
        !expanded && 'hidden',
        className
      )}
      {...props}
    >
      {showTag && (tag ?? children)}
      {showShortcut && (
        <span className="ui-sidebar-primary-menu-item-extras-global-shortcut-text-style text-[var(--ui-sidebar-primary-menu-item-extras-global-shortcut-color)]">
          {shortcut ?? children}
        </span>
      )}
      {showExternal && (
        <SquareArrowUpRightIcon
          size={16}
          className="text-[var(--ui-sidebar-primary-menu-item-extras-global-external-icon-color)] size-[var(--ui-sidebar-primary-menu-item-extras-global-external-icon-size)]"
        />
      )}
    </span>
  );
});
SidebarPrimaryMenuItemExtras.displayName = 'SidebarPrimaryMenuItemExtras';

export interface SidebarPrimaryCollapseTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  /** Leading 16px icon (e.g. a panel-left glyph). Rotates 180° between expanded/collapsed. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /**
   * Trailing affordance — a `SidebarPrimaryMenuItemExtras` element (Figma
   * shows a `⌘H` shortcut here). Rendered as a flex sibling of the label, same
   * as `SidebarPrimaryMenuItem`'s `extras` prop.
   */
  extras?: React.ReactNode;
  /** Tooltip text shown when the rail is collapsed. Defaults to `'Expand'`. */
  expandTooltip?: React.ReactNode;
}

// The footer "Collapse menu" affordance (Figma). A menu-item-styled `<button>`
// that flips the rail width via the layout context — this is the live wiring
// for the controllable `expanded` state (B1). In collapsed mode it keeps its
// label as `sr-only` like every other row, and (same as
// `SidebarSecondaryCollapseTrigger`) wraps the whole button in a tooltip
// showing `expandTooltip` — the `sr-only` label can't receive the hover that
// would open its own tooltip.
const SidebarPrimaryCollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarPrimaryCollapseTriggerProps
>(
  (
    { className, icon, children, extras, expandTooltip = 'Expand', onClick, ...props },
    ref
  ) => {
    const { expanded, toggleExpanded } = useSidebarPrimaryContext();
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
          sidebarPrimaryMenuItemVariants({ variant: 'unselected' }),
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
              'flex shrink-0 items-center self-start mt-[var(--ui-sidebar-primary-menu-item-global-icon-margin-t)] transition-transform',
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
                className={cn(
                  'min-w-0 flex-1 truncate',
                  !expanded && 'sr-only'
                )}
              />
            }
          >
            {children}
          </TooltipTrigger>
          <TooltipContent
            anchor={buttonRef}
            side={dir === 'rtl' ? 'left' : 'right'}
          >
            {children}
          </TooltipContent>
        </Tooltip>
        {extras != null && (
          <span className={cn(!expanded && 'hidden')}>{extras}</span>
        )}
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
SidebarPrimaryCollapseTrigger.displayName = 'SidebarPrimaryCollapseTrigger';

export {
  SidebarPrimary,
  SidebarPrimaryHeader,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimarySection,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimaryCollapseTrigger,
  useIsOverflowing,
  sidebarPrimaryMenuItemVariants,
};

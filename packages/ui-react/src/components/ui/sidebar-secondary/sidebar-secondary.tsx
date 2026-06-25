import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { Collapsible } from '@base-ui/react/collapsible';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SquareArrowUpRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

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
// The Level-1 expandable disclosure (SidebarSecondaryMenuSub) is the canonical
// Base UI Collapsible use — it gives `aria-expanded`/`aria-controls` for free and
// per-row open state. The trigger gets `data-panel-open` when open, which rotates
// the chevron.
//
// R6 (collapsed separator icon): resolved from the Figma node metadata — the
// collapsed `iconSeparator` instance's mainComponent is "ChevronRight", so the
// separator defaults to `ChevronRightIcon` (16px), tinted by
// `--ui-sidebar-secondary-collapsed-icon-separator-color`. The disclosure chevron
// uses `ChevronDownIcon` rotated via `data-panel-open`. The focus ring reuses the
// shared `--ui-focus-brand` (no sidebar focus token exists — R1).

interface SidebarSecondaryContextValue {
  expanded: boolean;
  /** Flip the panel width — drives the controlled/uncontrolled `expanded` state. */
  toggleExpanded: () => void;
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

export interface SidebarSecondaryProps
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

const SidebarSecondary = React.forwardRef<HTMLElement, SidebarSecondaryProps>(
  (
    {
      className,
      expanded: expandedProp,
      defaultExpanded = true,
      onExpandedChange,
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

    // Collapse is driven by the consumer through the layout context — the
    // `SidebarSecondaryCollapseTrigger` calls `toggleExpanded`, which updates
    // uncontrolled state and always emits `onExpandedChange`. Controlled
    // consumers ignore the internal state and react to the callback.
    const context = React.useMemo<SidebarSecondaryContextValue>(
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
            'group/sidebar flex h-full flex-col bg-[var(--ui-sidebar-secondary-global-container-color)] border-r border-[var(--ui-sidebar-secondary-global-container-border-color)] [border-right-width:var(--ui-sidebar-secondary-global-container-border-width)] w-[var(--ui-sidebar-secondary-collapsed-container-width)] data-[state=expanded]:w-[var(--ui-sidebar-secondary-expanded-container-width)] transition-[width]',
            className
          ),
          children,
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

export interface SidebarSecondaryHeaderProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /** Heading text (or pass as children). */
  label?: React.ReactNode;
}

const SidebarSecondaryHeader = React.forwardRef<
  HTMLDivElement,
  SidebarSecondaryHeaderProps
>(({ className, label, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center shrink-0',
      'px-[var(--ui-sidebar-secondary-collapsed-container-header-padding-x)] py-[var(--ui-sidebar-secondary-collapsed-container-header-padding-y)]',
      'group-data-[state=expanded]/sidebar:px-[var(--ui-sidebar-secondary-expanded-container-header-padding-x)] group-data-[state=expanded]/sidebar:py-[var(--ui-sidebar-secondary-expanded-container-header-padding-y)]',
      className
    )}
    {...props}
  >
    <h2 className="ui-sidebar-secondary-global-header-label-text-style truncate text-[var(--ui-sidebar-secondary-global-header-label-color)]">
      {label ?? children}
    </h2>
  </div>
));
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

export interface SidebarSecondaryCollapsedBreadcrumbProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /** The parent section label (breadcrumbLabel). */
  parentLabel: React.ReactNode;
  /** The current page label (labelCurrentPage). */
  currentLabel: React.ReactNode;
  /** Separator between the two; defaults to a 16px ChevronRightIcon (R6). */
  separator?: React.ReactNode;
}

const SidebarSecondaryCollapsedBreadcrumb = React.forwardRef<
  HTMLDivElement,
  SidebarSecondaryCollapsedBreadcrumbProps
>(({ className, parentLabel, currentLabel, separator, ...props }, ref) => (
  // Shown only in collapsed mode — toggled by the same data-[state] selector so
  // it stays in the DOM (SSR-present) with no JS branch. Laid out vertically:
  // parent → separator → current page.
  <div
    ref={ref}
    className={cn(
      'flex flex-col items-center shrink-0',
      'gap-[var(--ui-sidebar-secondary-collapsed-container-content-gap)] py-[var(--ui-sidebar-secondary-collapsed-container-content-padding-y)]',
      'flex group-data-[state=expanded]/sidebar:hidden',
      className
    )}
    {...props}
  >
    <span className="ui-sidebar-secondary-collapsed-breadcrumb-label-text-style text-[var(--ui-sidebar-secondary-collapsed-breadcrumb-label-color)]">
      {parentLabel}
    </span>
    <span
      aria-hidden="true"
      className="inline-flex items-center text-[var(--ui-sidebar-secondary-collapsed-icon-separator-color)] [&>svg]:size-[var(--ui-sidebar-secondary-collapsed-icon-separator-size)]"
    >
      {separator ?? <ChevronRightIcon size={16} />}
    </span>
    <span className="ui-sidebar-secondary-collapsed-label-current-page-text-style text-[var(--ui-sidebar-secondary-collapsed-label-current-page-color)]">
      {currentLabel}
    </span>
  </div>
));
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
  React.createContext<SidebarSecondarySectionContextValue>({ expandable: false });

const SECTION_STATIC: SidebarSecondarySectionContextValue = { expandable: false };
const SECTION_EXPANDABLE: SidebarSecondarySectionContextValue = { expandable: true };

export interface SidebarSecondarySectionProps
  extends React.ComponentPropsWithoutRef<'div'> {
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
    { className, expandable = false, open, defaultOpen = true, onOpenChange, children, ...props },
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

export interface SidebarSecondarySectionLabelProps
  extends React.ComponentPropsWithoutRef<'div'> {
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
  'pb-[var(--ui-sidebar-secondary-section-container-header-padding-y)] px-[var(--ui-sidebar-secondary-section-container-header-padding-x)]';

const SidebarSecondarySectionLabel = React.forwardRef<
  HTMLDivElement,
  SidebarSecondarySectionLabelProps
>(({ className, actions, unreadRollup, children, ...props }, ref) => {
  const { expandable } = React.useContext(SidebarSecondarySectionContext);

  if (!expandable) {
    // Static header: preserve the original markup when there are no actions so
    // existing layouts/baselines are unchanged.
    const base = cn(sectionLabelTextClass, sectionHeaderPadClass, className);
    if (actions == null) {
      return (
        <div ref={ref} className={base} {...props}>
          {children}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          base,
          'flex items-center gap-[var(--ui-sidebar-secondary-section-container-header-gap)]'
        )}
        {...props}
      >
        <span className="min-w-0 flex-1 truncate">{children}</span>
        <span className="flex shrink-0 items-center">{actions}</span>
      </div>
    );
  }

  // Expandable header: a chevron toggle (the Collapsible trigger) plus optional
  // trailing actions kept OUTSIDE the trigger button (no nested buttons). The
  // unread-rollup badge sits inside the trigger and shows only while collapsed.
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[var(--ui-sidebar-secondary-section-container-header-gap)]',
        sectionHeaderPadClass,
        className
      )}
      {...props}
    >
      <Collapsible.Trigger
        className={cn(
          'group/section flex min-w-0 flex-1 items-center gap-[var(--ui-sidebar-secondary-section-container-header-gap)] text-left',
          sectionLabelTextClass,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-inset'
        )}
      >
        <ChevronDownIcon
          size={16}
          aria-hidden="true"
          className="shrink-0 -rotate-90 transition-transform group-data-[panel-open]/section:rotate-0 text-[var(--ui-sidebar-secondary-section-icon-arrow-color)]"
        />
        <span className="min-w-0 flex-1 truncate">{children}</span>
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
  'group/row flex w-full items-center gap-[var(--ui-sidebar-secondary-menu-item-global-container-gap)] min-h-[var(--ui-sidebar-secondary-menu-item-global-container-height-min)] px-[var(--ui-sidebar-secondary-menu-item-global-container-padding-x)] py-[var(--ui-sidebar-secondary-menu-item-global-container-padding-y)] no-underline ui-sidebar-secondary-menu-item-global-label-text-style transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-inset text-[var(--ui-sidebar-secondary-menu-item-global-label-color-color)] [&_svg]:shrink-0 [&_svg]:size-[var(--ui-sidebar-secondary-menu-item-global-icon-size)] [&_svg]:text-[var(--ui-sidebar-secondary-menu-item-global-icon-color-color)]';

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
  extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children'>,
    Omit<VariantProps<typeof sidebarSecondaryMenuItemVariants>, 'variant'> {
  /** Marks the current route: sets the `selected` variant + `aria-current="page"`. */
  selected?: boolean;
  /** Optional leading 16px icon (Level-1 only; `hasIcon` in Figma). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /** Replace the rendered `<a>` (e.g. a router `Link` or a `<button>`). */
  render?: useRender.RenderProp;
}

const SidebarSecondaryMenuItem = React.forwardRef<
  HTMLAnchorElement,
  SidebarSecondaryMenuItemProps
>(({ className, selected = false, icon, render, children, ...props }, ref) => {
  const { expanded } = useSidebarSecondaryContext();

  // Trailing extras (tag / shortcut / external link) are passed as children but
  // must sit at the right edge of the row, after the title — so split them out:
  // the title takes the remaining width and truncates with an ellipsis, while the
  // extras stay `shrink-0` on the right (the row's `gap` is their left margin).
  const items = React.Children.toArray(children);
  const extras = items.filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) &&
      (child.type as { displayName?: string }).displayName ===
        'SidebarSecondaryMenuItemExtras'
  );
  const label = items.filter(
    (child) => !extras.includes(child as React.ReactElement)
  );

  const inner = useRender({
    render,
    ref,
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          sidebarSecondaryMenuItemVariants({
            variant: selected ? 'selected' : 'unselected',
          }),
          className
        ),
        'aria-current': selected ? 'page' : undefined,
        children: (
          <>
            {icon != null && (
              <span className="flex shrink-0 items-center self-start mt-[var(--ui-sidebar-secondary-menu-item-global-icon-margin-t)]">
                {icon}
              </span>
            )}
            {/* Keep the label in the DOM as `sr-only` in collapsed/rail mode so
                an icon-only row keeps an accessible name (a11y §7). */}
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-left',
                !expanded && 'sr-only'
              )}
            >
              {label}
            </span>
            {extras.length > 0 && (
              <span className="flex shrink-0 items-center">{extras}</span>
            )}
          </>
        ),
      },
      props
    ),
  });

  return <li className="contents">{inner}</li>;
});
SidebarSecondaryMenuItem.displayName = 'SidebarSecondaryMenuItem';

export type SidebarSecondaryMenuSubProps = React.ComponentPropsWithoutRef<
  typeof Collapsible.Root
>;

const SidebarSecondaryMenuSub = React.forwardRef<
  HTMLDivElement,
  SidebarSecondaryMenuSubProps
>(({ className, render, ...props }, ref) => (
  // Disclosure row: Base UI Collapsible gives per-row open state +
  // aria-expanded/aria-controls. Rendered as the list `<li>` wrapper.
  <Collapsible.Root
    ref={ref}
    render={render ?? <li />}
    className={cn('contents', className)}
    {...props}
  />
));
SidebarSecondaryMenuSub.displayName = 'SidebarSecondaryMenuSub';

export interface SidebarSecondaryMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Collapsible.Trigger> {
  /** Marks the parent row as selected. */
  selected?: boolean;
  /** Optional leading 16px icon. */
  icon?: React.ReactNode;
}

const SidebarSecondaryMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarSecondaryMenuSubTriggerProps
>(({ className, selected = false, icon, children, ...props }, ref) => {
  const { expanded } = useSidebarSecondaryContext();

  return (
    <Collapsible.Trigger
      ref={ref}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        sidebarSecondaryMenuItemVariants({
          variant: selected ? 'selected' : 'unselected',
        }),
        'text-left',
        className
      )}
      {...props}
    >
      {icon != null && (
        <span className="flex shrink-0 items-center self-start mt-[var(--ui-sidebar-secondary-menu-item-global-icon-margin-t)]">
          {icon}
        </span>
      )}
      <span className={cn('flex-1 truncate', !expanded && 'sr-only')}>
        {children}
      </span>
      {/* Chevron rotates when the panel is open (Base UI sets data-panel-open
          on the trigger). Hidden in collapsed rail mode. */}
      <ChevronDownIcon
        size={16}
        aria-hidden="true"
        className={cn(
          'shrink-0 transition-transform group-data-[panel-open]/row:rotate-180',
          !expanded && 'hidden'
        )}
      />
    </Collapsible.Trigger>
  );
});
SidebarSecondaryMenuSubTrigger.displayName = 'SidebarSecondaryMenuSubTrigger';

export type SidebarSecondaryMenuSubContentProps =
  React.ComponentPropsWithoutRef<typeof Collapsible.Panel>;

const SidebarSecondaryMenuSubContent = React.forwardRef<
  HTMLDivElement,
  SidebarSecondaryMenuSubContentProps
>(({ className, children, ...props }, ref) => (
  <Collapsible.Panel ref={ref} className={cn(className)} {...props}>
    <ul className="flex flex-col gap-[var(--ui-sidebar-secondary-section-menu-item-list-gap)]">
      {children}
    </ul>
  </Collapsible.Panel>
));
SidebarSecondaryMenuSubContent.displayName = 'SidebarSecondaryMenuSubContent';

export interface SidebarSecondaryMenuSubItemProps
  extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children'> {
  /** Marks the current route (Level-2 — no icon). */
  selected?: boolean;
  children?: React.ReactNode;
  /** Replace the rendered `<a>` (e.g. a router `Link`). */
  render?: useRender.RenderProp;
}

const SidebarSecondaryMenuSubItem = React.forwardRef<
  HTMLAnchorElement,
  SidebarSecondaryMenuSubItemProps
>(({ className, selected = false, render, children, ...props }, ref) => {
  const { expanded } = useSidebarSecondaryContext();

  const inner = useRender({
    render,
    ref,
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          sidebarSecondaryMenuItemVariants({
            variant: selected ? 'selected' : 'unselected',
          }),
          // Level-2 left indent (no icon column). The dedicated level-2 padding
          // token was removed in the next-gen sync; reconstruct the indent from
          // surviving tokens so the label aligns under level-1 labels (row
          // padding + icon column + gap).
          'pl-[calc(var(--ui-sidebar-secondary-menu-item-global-container-padding-x)+var(--ui-sidebar-secondary-menu-item-global-icon-size)+var(--ui-sidebar-secondary-menu-item-global-container-gap))]',
          className
        ),
        'aria-current': selected ? 'page' : undefined,
        children: (
          <span className={cn('flex-1 truncate text-left', !expanded && 'sr-only')}>
            {children}
          </span>
        ),
      },
      props
    ),
  });

  return <li className="contents">{inner}</li>;
});
SidebarSecondaryMenuSubItem.displayName = 'SidebarSecondaryMenuSubItem';

export interface SidebarSecondaryMenuItemExtrasProps
  extends React.ComponentPropsWithoutRef<'span'> {
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
        'inline-flex items-center gap-[var(--ui-sidebar-secondary-menu-item-extras-global-container-gap)]',
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

export interface SidebarSecondaryCollapseTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  /** Leading 16px icon (e.g. a panel-left glyph). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// The footer "Collapse menu" affordance. A row-styled `<button>` that flips the
// panel width via the layout context — the live wiring for the controllable
// `expanded` state (B1). Keeps its label as `sr-only` in collapsed mode.
const SidebarSecondaryCollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarSecondaryCollapseTriggerProps
>(({ className, icon, children, onClick, ...props }, ref) => {
  const { expanded, toggleExpanded } = useSidebarSecondaryContext();

  return (
    <li className="contents">
      <button
        ref={ref}
        type="button"
        aria-expanded={expanded}
        className={cn(
          sidebarSecondaryMenuItemVariants({ variant: 'unselected' }),
          'text-left',
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggleExpanded();
        }}
        {...props}
      >
        {icon != null && (
          <span className="flex shrink-0 items-center self-start mt-[var(--ui-sidebar-secondary-menu-item-global-icon-margin-t)]">
            {icon}
          </span>
        )}
        <span className={cn('flex-1 truncate', !expanded && 'sr-only')}>
          {children}
        </span>
      </button>
    </li>
  );
});
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
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondaryCollapseTrigger,
  sidebarSecondaryMenuItemVariants,
};

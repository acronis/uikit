import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { SquareArrowUpRightIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

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

const SidebarPrimaryHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  // Hosts a consumer-provided logo (R7 — no Logo part is built). Padding and the
  // logo height switch on expanded/collapsed; `[&_*]:h-…` sizes whatever the
  // consumer slots in. The logo color token tints any `currentColor` mark.
  <div
    ref={ref}
    className={cn(
      'flex items-center shrink-0 text-[var(--ui-sidebar-primary-global-logo-color)]',
      'px-[var(--ui-sidebar-primary-collapsed-container-header-padding-x)] py-[var(--ui-sidebar-primary-collapsed-container-header-padding-y)]',
      '[&_:where(img,svg)]:h-[var(--ui-sidebar-primary-collapsed-logo-height)] [&_:where(img,svg)]:w-auto',
      'group-data-[state=expanded]/sidebar:px-[var(--ui-sidebar-primary-expanded-container-header-padding-x)] group-data-[state=expanded]/sidebar:py-[var(--ui-sidebar-primary-expanded-container-header-padding-y)]',
      'group-data-[state=expanded]/sidebar:[&_:where(img,svg)]:h-[var(--ui-sidebar-primary-expanded-logo-height)]',
      className
    )}
    {...props}
  />
));
SidebarPrimaryHeader.displayName = 'SidebarPrimaryHeader';

const SidebarPrimaryContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-1 flex-col overflow-y-auto gap-[var(--ui-sidebar-primary-global-section-list-gap)]',
      className
    )}
    {...props}
  />
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
      'py-[var(--ui-sidebar-primary-section-container-padding-y)]',
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
  // `firstSection` in Figma only toggles the top divider — derive it from DOM
  // position (`:not(:first-child)`) instead of a prop.
  <div
    ref={ref}
    className={cn(
      'flex flex-col py-[var(--ui-sidebar-primary-section-container-padding-y)]',
      '[&:not(:first-child)]:border-t [&:not(:first-child)]:border-[var(--ui-sidebar-primary-section-container-border-color)] [&:not(:first-child)]:[border-top-width:var(--ui-sidebar-primary-section-container-border-width)]',
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
  'group/menu-item flex w-full items-center gap-[var(--ui-sidebar-primary-menu-item-global-container-gap)] h-[var(--ui-sidebar-primary-menu-item-global-container-height)] px-[var(--ui-sidebar-primary-menu-item-global-container-padding-x)] py-[var(--ui-sidebar-primary-menu-item-global-container-padding-y)] no-underline ui-sidebar-primary-menu-item-global-label-text-style transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-inset [&_svg]:shrink-0 [&_svg]:size-[var(--ui-sidebar-primary-menu-item-global-icon-size)]',
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

export interface SidebarPrimaryMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children'>,
    Omit<VariantProps<typeof sidebarPrimaryMenuItemVariants>, 'variant'> {
  /** Marks the current route: sets the `selected` variant + `aria-current="page"`. */
  selected?: boolean;
  /** Leading 16px icon (from `@acronis-platform/icons-react`). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /**
   * Replace the rendered `<a>` with another element or component (e.g. a router
   * `Link` or a `<button>`) via Base UI composition.
   */
  render?: useRender.RenderProp;
}

const SidebarPrimaryMenuItem = React.forwardRef<
  HTMLAnchorElement,
  SidebarPrimaryMenuItemProps
>(({ className, selected = false, icon, render, children, ...props }, ref) => {
  const { expanded } = useSidebarPrimaryContext();

  // Trailing extras (tag / shortcut / external link) are passed as children but
  // belong at the right edge of the row — split them out so the title takes the
  // remaining width and truncates with an ellipsis, while the extras stay
  // `shrink-0` on the right (the row's `gap` is their left margin).
  const items = React.Children.toArray(children);
  const extras = items.filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) &&
      (child.type as { displayName?: string }).displayName ===
        'SidebarPrimaryMenuItemExtras'
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
          sidebarPrimaryMenuItemVariants({
            variant: selected ? 'selected' : 'unselected',
          }),
          className
        ),
        'aria-current': selected ? 'page' : undefined,
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
                collapsed but stay queryable for the same reason. */}
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
SidebarPrimaryMenuItem.displayName = 'SidebarPrimaryMenuItem';

export interface SidebarPrimaryMenuItemExtrasProps
  extends React.ComponentPropsWithoutRef<'span'> {
  /** Which trailing affordance to render. */
  variant: 'tag' | 'externalLink' | 'shortcut' | 'tag-externalLink';
  /** Shortcut text (e.g. "⌘H") for the `shortcut` variant. */
  shortcut?: string;
  /** Tag content for the `tag` / `tag-externalLink` variants. */
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
  /** Leading 16px icon (e.g. a panel-left glyph). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// The footer "Collapse menu" affordance (Figma). A menu-item-styled `<button>`
// that flips the rail width via the layout context — this is the live wiring
// for the controllable `expanded` state (B1). In collapsed mode it keeps its
// label as `sr-only` like every other row.
const SidebarPrimaryCollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarPrimaryCollapseTriggerProps
>(({ className, icon, children, onClick, ...props }, ref) => {
  const { expanded, toggleExpanded } = useSidebarPrimaryContext();

  return (
    <li className="contents">
      <button
        ref={ref}
        type="button"
        aria-expanded={expanded}
        className={cn(
          sidebarPrimaryMenuItemVariants({ variant: 'unselected' }),
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
          <span className="flex shrink-0 items-center self-start mt-[var(--ui-sidebar-primary-menu-item-global-icon-margin-t)]">
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
  sidebarPrimaryMenuItemVariants,
};

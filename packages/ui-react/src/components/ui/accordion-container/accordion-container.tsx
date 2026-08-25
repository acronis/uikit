'use client';

import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { ChevronRightIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// The shared disclosure primitive behind Card's and Section's `isCollapsable`
// variant (Figma file lrU3ydIyvPYQNE6ixdsKtJ, node 10561:83806). Built directly
// on Base UI's Collapsible — Root/Trigger/Panel own all open/close state, ARIA
// wiring, and height animation; this component only adds the chevron rotation
// and the `collapsible=false` bypass. It never imposes visual styling beyond
// what the disclosure mechanic itself requires: no padding/background/border on
// Root or Content, no position/hover opinion on Trigger beyond its chevron's
// glyph color (--ui-glyph-on-surface-neutral-dark, the same neutral treatment
// Accordion's chevron uses). Every other visual decision (header layout,
// spacing, background, borders) stays owned by the consumer composing this
// primitive into their own component (Card, Section, ...). The Root it
// renders when collapsible defaults to `display: contents` so it never
// becomes a box in the consumer's flex/grid flow — Section relies on its own
// root `gap` applying directly to header/content, which only works if this
// wrapper doesn't count as an intervening flex child.

interface AccordionContainerState {
  open: boolean;
}

type AccordionContainerChildren =
  | React.ReactNode
  | ((state: AccordionContainerState) => React.ReactNode);

type AccordionContainerBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>,
  'children'
>;

interface AccordionContainerProps extends AccordionContainerBaseProps {
  /**
   * Whether the disclosure exists at all. When `false`, `children` render
   * directly with no trigger and no panel wrapper — the Figma
   * `isCollapsable=false` state has no disclosure UI.
   * @default false
   */
  collapsible?: boolean;
  /**
   * Accepts a plain node, or a render-prop function receiving the current
   * `{ open }` state — for content outside `AccordionContainer.Content` (e.g.
   * a header) that still needs to know whether the panel is expanded, even
   * when this component owns the open state itself (uncontrolled).
   */
  children?: AccordionContainerChildren;
}

interface AccordionContainerContextValue {
  collapsible: boolean;
  open: boolean;
}

const AccordionContainerContext =
  React.createContext<AccordionContainerContextValue>({
    collapsible: false,
    open: false,
  });

/**
 * Reads whether the nearest `AccordionContainer` ancestor is `collapsible`
 * and, if so, its current `open` state — for content outside
 * `AccordionContainer.Content` (e.g. a header) that needs to react to the
 * panel's state without a dedicated prop, such as `CardHeader` dropping its
 * bottom divider while collapsed.
 */
const useAccordionContainerContext = () =>
  React.useContext(AccordionContainerContext);

const AccordionContainer = React.forwardRef<
  HTMLDivElement,
  AccordionContainerProps
>(
  (
    {
      collapsible = false,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled,
      className,
      style,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : uncontrolledOpen;

    const handleOpenChange = React.useCallback<
      NonNullable<AccordionContainerBaseProps['onOpenChange']>
    >(
      (nextOpen, eventDetails) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen, eventDetails);
      },
      [isControlled, onOpenChange]
    );

    const collapsibleState = React.useMemo(
      () => ({ open, disabled: disabled ?? false }),
      [open, disabled]
    );

    const resolvedChildren =
      typeof children === 'function' ? children({ open }) : children;
    const resolvedClassName =
      typeof className === 'function' ? className(collapsibleState) : className;
    const resolvedStyle =
      typeof style === 'function' ? style(collapsibleState) : style;

    const contextValue = React.useMemo<AccordionContainerContextValue>(
      () => ({ collapsible, open }),
      [collapsible, open]
    );

    const bypassRendered = useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        { className: resolvedClassName, style: resolvedStyle },
        props,
        {
          children: resolvedChildren,
        }
      ),
    });

    if (!collapsible) {
      // No wrapper is imposed for the common case (no ref/className/style/render/
      // extra DOM props) so this bypass stays style-isolation-neutral; a consumer
      // that does pass any of those gets a `div` so they aren't silently dropped.
      const needsWrapper =
        ref != null ||
        resolvedClassName != null ||
        resolvedStyle != null ||
        render != null ||
        Object.keys(props).length > 0;

      return (
        <AccordionContainerContext.Provider value={contextValue}>
          {needsWrapper ? bypassRendered : resolvedChildren}
        </AccordionContainerContext.Provider>
      );
    }

    return (
      <AccordionContainerContext.Provider value={contextValue}>
        <CollapsiblePrimitive.Root
          ref={ref}
          render={render}
          className={cn('contents!', resolvedClassName)}
          style={resolvedStyle}
          open={open}
          onOpenChange={handleOpenChange}
          disabled={disabled}
          {...props}
        >
          {resolvedChildren}
        </CollapsiblePrimitive.Root>
      </AccordionContainerContext.Provider>
    );
  }
);
AccordionContainer.displayName = 'AccordionContainer';

type AccordionContainerTriggerProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Trigger
>;

const AccordionContainerTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionContainerTriggerProps
>(({ className, children, 'aria-label': ariaLabel, ...props }, ref) => {
  const { collapsible } = useAccordionContainerContext();

  if (!collapsible) {
    return null;
  }

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      aria-label={
        props['aria-labelledby'] || children != null
          ? ariaLabel
          : (ariaLabel ?? 'Toggle')
      }
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--ui-glyph-on-surface-neutral-dark)]',
        'outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]',
        '[&[data-panel-open]>svg]:rotate-90 [&:not([data-panel-open])>svg]:rtl:rotate-180',
        className
      )}
      {...props}
    >
      {children ?? (
        <ChevronRightIcon
          size={16}
          className="transition-transform duration-200"
        />
      )}
    </CollapsiblePrimitive.Trigger>
  );
});
AccordionContainerTrigger.displayName = 'AccordionContainerTrigger';

type AccordionContainerContentProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Panel
>;

const AccordionContainerContent = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Panel>,
  AccordionContainerContentProps
>(
  (
    {
      className,
      style,
      children,
      render,
      hiddenUntilFound,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const { collapsible } = useAccordionContainerContext();

    // Unlike Root, Content doesn't support the render-prop `(state) => value`
    // form for className/style, so the bypass div below only ever sees plain
    // values.
    const bypassRendered = useRender({
      render: render as
        | useRender.RenderProp<Record<string, unknown>>
        | undefined,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: className as string | undefined,
          style: style as React.CSSProperties | undefined,
        },
        props,
        { children }
      ),
    });

    if (!collapsible) {
      // Same style-isolation-neutral bypass as the Root: no wrapper unless the
      // consumer actually passed something that would otherwise be dropped.
      // hiddenUntilFound/keepMounted are Panel-only props, destructured above
      // so they never leak onto this plain div.
      const needsWrapper =
        ref != null ||
        className != null ||
        style != null ||
        render != null ||
        Object.keys(props).length > 0;

      return needsWrapper ? bypassRendered : <>{children}</>;
    }

    return (
      <CollapsiblePrimitive.Panel
        ref={ref}
        style={style}
        className={cn(
          'overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
          className
        )}
        hiddenUntilFound={hiddenUntilFound}
        keepMounted={keepMounted}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Panel>
    );
  }
);
AccordionContainerContent.displayName = 'AccordionContainerContent';

const AccordionContainerRoot = Object.assign(AccordionContainer, {
  Trigger: AccordionContainerTrigger,
  Content: AccordionContainerContent,
});

export {
  AccordionContainerRoot as AccordionContainer,
  AccordionContainerTrigger,
  AccordionContainerContent,
  useAccordionContainerContext,
  type AccordionContainerProps,
  type AccordionContainerTriggerProps,
  type AccordionContainerContentProps,
  type AccordionContainerState,
  type AccordionContainerContextValue,
};

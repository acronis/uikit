'use client';

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { buttonIconVariants } from '@/components/ui/button-icon';
import { AccordionContainer } from '@/components/ui/accordion-container';

// Figma node 8262:6179 ("Section"). A titled band that groups `Card`s (or a
// `Table`) on a page. Variant axes in the design are `variant`
// (`column1` / `column2-70-30` / `grid3` / `table`) × `isCollapsable`
// (`false` / `true-expanded` / `true-collapsed`) × `hasBottomBorder`.
//
// `hasHeader` / `isCollapsable` from Figma aren't reproduced as booleans on the
// root: this is a compound component, so the header is simply omitted by the
// consumer, and the disclosure comes from composing `AccordionContainer` (the
// shared primitive, whose own doc comment already names Section as a target
// consumer) rather than a bespoke chevron. Same treatment `card.tsx` uses.
//
// Layout, straight from the design:
//   - `column1` / `column2-70-30` / `grid3` root: `px-4 pt-4`, `gap-3` between
//     header and content.
//   - `table` root: no padding and no gap at all, so table rows bleed
//     edge-to-edge; `SectionHeader` re-applies `px-4 pt-4 pb-3` itself. Same
//     pattern `CardSection` uses for its `table-actions` variant.
//   - `hasBottomBorder` adds the divider, plus the 16px bottom padding that
//     separates this section from the next — but only on the three padded
//     variants. `table` has no root padding to extend, so it gains the border
//     alone (confirmed on node 10424:11611, which is exactly 1px taller than
//     its `hasBottomBorder=false` sibling).
//
// `column2-70-30` is a 3-column grid whose first child spans two columns, not a
// literal 70/30 split: Figma's `Columns` frame is
// `grid-cols-[repeat(3,minmax(0,1fr))]` with `content` at `col-[1/span_2]` and
// `contentColumn` at `col-3`. So the real ratio is 2/3 + 1/3 (~67/33) and the
// variant name is approximate. `SectionContent` encodes the span with a
// first-child selector so two children lay out correctly with no extra markup.
//
// Typography comes from the tokens-pd typography classes rather than
// hand-rolled Tailwind sizes: Figma's title style is literally named
// `headings/section`, and tokens-pd emits `.ui-typography-headings-section`
// (Inter/20px/500/24px/0) — a value-for-value match — while the description's
// 14px/400/24px maps to `.ui-typography-body-default`. Both ship in
// `css/default.css`, already imported by `src/styles/index.css`, so an upstream
// type-scale change propagates instead of being frozen into a utility here.
// Neither class sets color, so the semantic text tokens are still applied
// alongside (same split `app-shell-chat.tsx` uses).
//
// No `--ui-section-*` tier exists in tokens-pd, so — like `card.tsx` — the
// colors stay on the shared semantic tier rather than a component-local one.
//
// The root deliberately leaves `align-items` at its `flex` default (`stretch`)
// rather than `items-start`: the collapsible composition puts a bare
// `AccordionContainer` — which sets no width of its own — directly under
// `Section`, not `SectionHeader`/`SectionContent` (which each force their own
// `w-full`). Under `items-start` that wrapper shrink-wraps to whichever
// children are currently visible, so it measures narrower once the (often
// wider) content collapses out — the header visibly shrinks on toggle.
// `stretch` pins every direct child, collapsible wrapper included, to
// `Section`'s own width regardless of what's currently rendered inside it.

type SectionVariant = 'column1' | 'column2-70-30' | 'grid3' | 'table';

const sectionVariants = cva('flex w-full flex-col', {
  variants: {
    variant: {
      column1: 'gap-3 px-4 pt-4',
      'column2-70-30': 'gap-3 px-4 pt-4',
      grid3: 'gap-3 px-4 pt-4',
      // Flush: the content's own rows own the horizontal inset.
      table: '',
    },
    hasBottomBorder: {
      false: '',
      true: 'border-b border-[var(--ui-border-on-surface-divider)]',
    },
  },
  compoundVariants: [
    // The bottom padding that pairs with the divider only applies where there
    // is root padding to extend; `table` is flush by design.
    { variant: 'column1', hasBottomBorder: true, className: 'pb-4' },
    { variant: 'column2-70-30', hasBottomBorder: true, className: 'pb-4' },
    { variant: 'grid3', hasBottomBorder: true, className: 'pb-4' },
  ],
  defaultVariants: {
    variant: 'column1',
    hasBottomBorder: false,
  },
});

interface SectionContextValue {
  variant: SectionVariant;
}

const SectionContext = React.createContext<SectionContextValue>({
  variant: 'column1',
});

/**
 * Reads the nearest `Section` ancestor's `variant`, so `SectionHeader` and
 * `SectionContent` adapt their padding/layout without the consumer repeating
 * `variant` on every part.
 */
const useSectionContext = () => React.useContext(SectionContext);

export interface SectionProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionVariants> {
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition) — e.g. render `Section` as a `<section>`.
   */
  render?: useRender.RenderProp;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    { className, variant = 'column1', hasBottomBorder = false, render, ...props },
    ref
  ) => {
    const contextValue = React.useMemo<SectionContextValue>(
      () => ({ variant: variant ?? 'column1' }),
      [variant]
    );

    const rendered = useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            sectionVariants({ variant, hasBottomBorder }),
            className
          ),
        },
        props
      ),
    });

    return (
      <SectionContext.Provider value={contextValue}>
        {rendered}
      </SectionContext.Provider>
    );
  }
);
Section.displayName = 'Section';

export interface SectionHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** The section's title. Always rendered when the header is present. */
  title?: string;
  /** Helper text shown under the title; only rendered when `hasDescription`. */
  description?: string;
  /** Shows `description` below the title row. */
  hasDescription?: boolean;
  /** Shows a toggle switch at the start of the header. */
  isSwitchable?: boolean;
  /** Controlled checked state of the header switch. */
  switchChecked?: boolean;
  /** Uncontrolled initial checked state of the header switch. */
  defaultSwitchChecked?: boolean;
  /** Fires when the header switch is toggled. */
  onSwitchCheckedChange?: (checked: boolean) => void;
  /** Disables the header switch. */
  switchDisabled?: boolean;
  /** Accessible label for the header switch. */
  switchLabel?: string;
  /**
   * Icon rendered at the start of the header, after the switch when both are
   * present. Additive: the Figma component set exposes no icon slot, so this
   * has no design counterpart to mirror and is not mapped in Code Connect.
   */
  icon?: React.ReactNode;
  /** Extra content rendered inline next to the title (e.g. a tag or badge). */
  extras?: React.ReactNode;
  /** Actions rendered at the end of the header row (e.g. a menu button). */
  actions?: React.ReactNode;
  /**
   * Shows a disclosure trigger at the end of the header. Only has an effect
   * when this header renders inside a collapsible `AccordionContainer` — see
   * the collapsible composition example.
   */
  isCollapsible?: boolean;
  /** Accessible label for the collapse trigger. */
  collapseLabel?: string;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      className,
      title = 'Section Title',
      description,
      hasDescription = false,
      isSwitchable = false,
      switchChecked,
      defaultSwitchChecked,
      onSwitchCheckedChange,
      switchDisabled,
      switchLabel = 'Toggle section',
      icon,
      extras,
      actions,
      isCollapsible = false,
      collapseLabel = 'Collapse section',
      children,
      ...props
    },
    ref
  ) => {
    const { variant } = useSectionContext();

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full shrink-0 flex-col items-start justify-center gap-0.5 overflow-hidden',
          // `table` sections have no root inset, so the header re-applies it to
          // stay aligned above the edge-to-edge rows below.
          variant === 'table' && 'px-4 pt-4 pb-3',
          className
        )}
        {...props}
      >
        <div className="flex w-full items-center gap-2">
          {isSwitchable && (
            <div className="flex w-8 shrink-0 flex-col items-start py-1">
              <Switch
                checked={switchChecked}
                defaultChecked={defaultSwitchChecked}
                onCheckedChange={onSwitchCheckedChange}
                disabled={switchDisabled}
                aria-label={switchLabel}
              />
            </div>
          )}
          {icon && (
            <span className="flex shrink-0 items-center text-[var(--ui-text-on-surface-secondary)]">
              {icon}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
            <div className="flex min-w-0 items-center gap-2">
              <p className="ui-typography-headings-section truncate text-[var(--ui-text-on-surface-primary)]">
                {title}
              </p>
              {extras}
            </div>
          </div>
          {children}
          {actions}
          {isCollapsible && (
            <AccordionContainer.Trigger
              aria-label={collapseLabel}
              className={buttonIconVariants({ variant: 'ghost' })}
            />
          )}
        </div>
        {hasDescription && (
          <p className="ui-typography-body-default w-full text-[var(--ui-text-on-surface-secondary)]">
            {description}
          </p>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';

const sectionContentVariants = cva('w-full', {
  variants: {
    variant: {
      column1: '',
      // Figma's `Columns` frame: a 3-column grid whose first child spans two
      // columns, giving the ~70/30 split the variant is named after.
      'column2-70-30': 'grid grid-cols-3 gap-4 [&>*:first-child]:col-span-2',
      grid3: 'grid grid-cols-3 gap-4',
      table: '',
    },
  },
  defaultVariants: {
    variant: 'column1',
  },
});

export interface SectionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition).
   */
  render?: useRender.RenderProp;
}

const SectionContent = React.forwardRef<HTMLDivElement, SectionContentProps>(
  ({ className, render, ...props }, ref) => {
    const { variant } = useSectionContext();

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        { className: cn(sectionContentVariants({ variant }), className) },
        props
      ),
    });
  }
);
SectionContent.displayName = 'SectionContent';

export {
  Section,
  SectionHeader,
  SectionContent,
  sectionVariants,
  sectionContentVariants,
  useSectionContext,
  type SectionVariant,
};

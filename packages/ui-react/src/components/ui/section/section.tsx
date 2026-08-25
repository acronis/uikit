'use client';

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { buttonIconVariants } from '@/components/ui/button-icon';
import { AccordionContainer } from '@/components/ui/accordion-container';

// Figma node 8262:6179 ("Section"). A titled band that groups cards — or a
// table — on a page. Where `Card` owns a single surface and `CardSection`
// divides a card's body, `Section` is the page-level grouping above both.
//
// Padding is variant-dependent, straight from the design. The three card
// layouts (`column1`, `column2-70-30`, `grid3`) inset their content
// (`px-4 pt-4`) and deliberately reserve no bottom padding: stacked unbordered
// sections would otherwise double up their vertical spacing, since the next
// section already opens with its own `pt-4`. `hasBottomBorder` adds the divider
// plus the matching `pb-4` that closes the band off. The `table` variant sits
// completely flush — no root padding at all — so its rows can bleed to the page
// edges; only the divider still applies, and `SectionHeader` re-applies the
// inset it drops. This is the same reasoning as `card-section.tsx`'s
// `table-actions` variant, one level up.
//
// `hasHeader` from Figma isn't reproduced as a boolean: this is a compound
// component (`Section` + `SectionHeader` + `SectionContent`), so a part is
// simply omitted by the consumer instead of hidden behind a flag — same pattern
// as `Card`. `SectionHeader`'s own toggles (`hasDescription`, `isSwitchable`,
// `isCollapsible`) stay booleans because each gates a real sub-part with its
// own payload.
//
// The design's `isCollapsable` variant (`false` / `true-expanded` /
// `true-collapsed`) is implemented by composing `Section` with
// `AccordionContainer` — the shared disclosure primitive — exactly like `Card`:
// wrap header + content, set `SectionHeader`'s `isCollapsible` to render the
// trigger, and restyle that trigger with `buttonIconVariants({ variant:
// 'ghost' })` because Figma's `ButtonCollapse` is a real ghost `ButtonIcon`.
//
// No dedicated `--ui-section-*` token tier exists in tokens-pd (same as
// `Card` / `CardSection`), so the chrome rides on the shared semantic tier.

const sectionVariants = cva('flex w-full flex-col gap-3', {
  variants: {
    variant: {
      column1: 'px-4 pt-4',
      'column2-70-30': 'px-4 pt-4',
      grid3: 'px-4 pt-4',
      // Flush: the table's own rows run edge-to-edge.
      table: '',
    },
    hasBottomBorder: {
      false: '',
      true: 'border-b border-[var(--ui-border-on-surface-divider)]',
    },
  },
  compoundVariants: [
    { variant: 'column1', hasBottomBorder: true, class: 'pb-4' },
    { variant: 'column2-70-30', hasBottomBorder: true, class: 'pb-4' },
    { variant: 'grid3', hasBottomBorder: true, class: 'pb-4' },
  ],
  defaultVariants: {
    variant: 'column1',
    hasBottomBorder: false,
  },
});

type SectionVariant = NonNullable<
  VariantProps<typeof sectionVariants>['variant']
>;

interface SectionContextValue {
  variant: SectionVariant;
}

// `SectionContent` and `SectionHeader` need the root's content layout without
// the consumer repeating `variant` on every part, so the root publishes it.
const SectionContext = React.createContext<SectionContextValue>({
  variant: 'column1',
});

/**
 * Reads the content layout of the nearest `Section` ancestor. Falls back to
 * `column1` for a part rendered outside a `Section`.
 */
const useSectionContext = () => React.useContext(SectionContext);

export interface SectionProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /**
   * Replace the rendered `<section>` with another element or component (Base UI
   * composition).
   */
  render?: useRender.RenderProp;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
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
      defaultTagName: 'section',
      props: mergeProps<'section'>(
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
  /** The section's title. Renders nothing when omitted. */
  title?: string;
  /** Helper text shown under the title; only rendered when `hasDescription`. */
  description?: string;
  /** Shows `description` below the title. */
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
  /** Extra content rendered inline next to the title (e.g. a tag or badge). */
  extras?: React.ReactNode;
  /** Actions rendered at the end of the header (e.g. a button). */
  actions?: React.ReactNode;
  /**
   * Shows a disclosure trigger at the end of the header. Only has an effect
   * when this header renders inside a collapsible `AccordionContainer` —
   * see the collapsible composition example.
   */
  isCollapsible?: boolean;
  /** Accessible label for the collapse trigger. */
  collapseLabel?: string;
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition).
   */
  render?: useRender.RenderProp;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      className,
      title,
      description,
      hasDescription = false,
      isSwitchable = false,
      switchChecked,
      defaultSwitchChecked,
      onSwitchCheckedChange,
      switchDisabled,
      switchLabel = 'Toggle section',
      extras,
      actions,
      isCollapsible = false,
      collapseLabel = 'Collapse section',
      render,
      children,
      ...props
    },
    ref
  ) => {
    const { variant } = useSectionContext();

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            'flex w-full shrink-0 items-center gap-2',
            // The `table` root drops its inset so the rows below can bleed to
            // the page edges; the header re-applies it so the title still lines
            // up with the first column.
            variant === 'table' && 'px-4 pt-4',
            className
          ),
          children: (
            <>
              {isSwitchable && (
                <Switch
                  checked={switchChecked}
                  defaultChecked={defaultSwitchChecked}
                  onCheckedChange={onSwitchCheckedChange}
                  disabled={switchDisabled}
                  aria-label={switchLabel}
                  className="shrink-0"
                />
              )}
              {/* Gated as a whole: an empty wrapper would still claim the
                  header row's free space through `flex-1` and push a
                  consumer-supplied heading (`children`) to the end. */}
              {(title || extras || hasDescription) && (
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5">
                  <div className="flex min-w-0 items-center gap-2">
                    {title && (
                      <p className="truncate text-xl leading-6 font-medium text-[var(--ui-text-on-surface-primary)]">
                        {title}
                      </p>
                    )}
                    {extras}
                  </div>
                  {hasDescription && (
                    <p className="w-full truncate text-sm leading-6 text-[var(--ui-text-on-surface-secondary)]">
                      {description}
                    </p>
                  )}
                </div>
              )}
              {children}
              {actions}
              {isCollapsible && (
                <AccordionContainer.Trigger
                  aria-label={collapseLabel}
                  className={buttonIconVariants({ variant: 'ghost' })}
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
SectionHeader.displayName = 'SectionHeader';

export interface SectionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The narrow (~30%) second column of the `column2-70-30` layout. Ignored by
   * every other variant, which has only one content area.
   */
  secondaryContent?: React.ReactNode;
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition).
   */
  render?: useRender.RenderProp;
}

const SectionContent = React.forwardRef<HTMLDivElement, SectionContentProps>(
  ({ className, secondaryContent, render, children, ...props }, ref) => {
    const { variant } = useSectionContext();
    const isTwoColumn = variant === 'column2-70-30';

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            'w-full',
            // Both grid layouts share the same 3-column track; the 70/30 split
            // is a 2:1 span of it, and `grid3` simply lets children flow.
            (isTwoColumn || variant === 'grid3') &&
              'grid grid-cols-3 items-start gap-4',
            className
          ),
          children: isTwoColumn ? (
            <>
              <div className="col-span-2 min-w-0">{children}</div>
              {secondaryContent != null && (
                <div className="col-span-1 min-w-0">{secondaryContent}</div>
              )}
            </>
          ) : (
            children
          ),
        },
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
  useSectionContext,
  type SectionVariant,
};

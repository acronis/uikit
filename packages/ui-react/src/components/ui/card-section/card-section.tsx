import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

// Figma node 7662:8727 ("CardSection"). A band of content that stacks inside a
// `Card`'s body, below `CardHeader`. Figma's PascalCase variant names map to
// this repo's kebab-case convention: `Slot` → `slot`, `Tag` → `tag`,
// `List` → `list`, `Table + Actions` → `table-actions`,
// `Card (primary)` → `card-primary`, `Card (secondary)` → `card-secondary`.
//
// Padding is variant-dependent, straight from the design: every variant except
// `table-actions` insets its content (`px-4 pt-4`), while `table-actions` sits
// flush so its table rows can run edge-to-edge inside the card — its own header
// row re-applies the `px-4` instead. `hasBottomBorder` adds the divider plus the
// matching bottom padding that separates this section from the next one below.
//
// `card-primary` / `card-secondary` differ in exactly one thing: the nested
// `Card`'s surface token. Everything else — border, radius, composition — is
// identical, so the two are a single cva branch pair rather than a separate
// prop. `Card`'s own default is the primary surface, so `card-primary` only
// needs the width override.
//
// No `--ui-card-*` component tier exists in tokens-pd, so — like `card.tsx` —
// this stays on the shared semantic tier. Figma's default `contentList`
// (a `ListItem` instance) references `components/Card/body/section/item/*`
// variables that have no counterpart in `@acronis-platform/design-tokens`, so
// `list` ships without a built-in fallback: the consumer supplies the rows.

const cardSectionVariants = cva(
  'flex w-full flex-col items-start justify-center gap-3',
  {
    variants: {
      variant: {
        slot: 'px-4 pt-4',
        tag: 'px-4 pt-4',
        list: 'px-4 pt-4',
        // Flush: the table's own rows own the horizontal inset.
        'table-actions': '',
        'card-primary': 'px-4 pt-4',
        'card-secondary': 'px-4 pt-4',
      },
      hasBottomBorder: {
        false: '',
        true: 'border-b border-[var(--ui-border-on-surface-divider)] pb-4',
      },
    },
    defaultVariants: {
      variant: 'slot',
      hasBottomBorder: false,
    },
  }
);

const nestedCardVariants = cva('w-full', {
  variants: {
    surface: {
      primary: 'bg-[var(--ui-background-surface-primary)]',
      secondary: 'bg-[var(--ui-background-surface-secondary)]',
    },
  },
  defaultVariants: {
    surface: 'primary',
  },
});

export interface CardSectionBaseProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content'>,
    VariantProps<typeof cardSectionVariants> {
  /** Extra content rendered inline next to the section title (e.g. a tag). */
  extras?: React.ReactNode;
  /** Actions rendered at the end of the section header row (e.g. a menu button). */
  actions?: React.ReactNode;
  /** Body of the `slot` variant — arbitrary passthrough content. */
  content?: React.ReactNode;
  /**
   * Body of the `tag` variant — a wrapping row of tags. Has no built-in
   * default: like `contentList`, the consumer supplies the tags.
   */
  contentTag?: React.ReactNode;
  /**
   * Body of the `list` variant — title/description key-value rows. Has no
   * built-in default: the `ListItem` tokens the design references
   * (`--ui-card-body-section-item-*`) do not exist in tokens-pd yet.
   */
  contentList?: React.ReactNode;
  /** Body of the `table-actions` variant — a table with row actions. */
  contentTable?: React.ReactNode;
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition) — e.g. render the section as a `<section>`.
   */
  render?: useRender.RenderProp;
}

/**
 * A band of content stacked inside a `Card`'s body.
 *
 * `hasHeader` and `title` form a discriminated union: turning the section's own
 * mini-header on requires a title, because the header row always renders one.
 */
export type CardSectionProps = CardSectionBaseProps &
  (
    | {
        /** Shows the section's own mini-header row (14px, distinct from `CardHeader`). */
        hasHeader: true;
        /** The section header's title. Required whenever `hasHeader` is set. */
        title: string;
      }
    | { hasHeader?: false; title?: never }
  );

const CardSection = React.forwardRef<HTMLDivElement, CardSectionProps>(
  (
    {
      className,
      variant = 'slot',
      hasBottomBorder = false,
      hasHeader = false,
      title,
      extras,
      actions,
      content,
      contentTag,
      contentList,
      contentTable,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const isTable = variant === 'table-actions';
    const isNestedCard =
      variant === 'card-primary' || variant === 'card-secondary';

    const header = hasHeader ? (
      <div
        className={cn(
          'flex w-full items-center gap-2',
          // `table-actions` has no root inset, so the header re-applies it to
          // stay aligned with the table cells below.
          isTable && 'px-4'
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <p className="truncate text-sm leading-6 font-medium text-[var(--ui-text-on-surface-primary)]">
            {title}
          </p>
          {extras}
        </div>
        {actions}
      </div>
    ) : null;

    let body: React.ReactNode = null;
    if (isNestedCard) {
      body = (
        <Card
          className={nestedCardVariants({
            surface: variant === 'card-secondary' ? 'secondary' : 'primary',
          })}
        >
          {children}
        </Card>
      );
    } else if (variant === 'tag') {
      body = (
        <div className="flex w-full flex-wrap items-start gap-x-4 gap-y-2">
          {contentTag}
        </div>
      );
    } else if (variant === 'list') {
      body = <div className="flex w-full flex-col">{contentList}</div>;
    } else if (isTable) {
      body = (
        <div className="flex w-full flex-col overflow-hidden rounded">
          {contentTable}
        </div>
      );
    } else {
      body = <div className="w-full">{content}</div>;
    }

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            cardSectionVariants({ variant, hasBottomBorder }),
            className
          ),
          children: (
            <>
              {header}
              {body}
              {!isNestedCard && children}
            </>
          ),
        },
        props
      ),
    });
  }
);
CardSection.displayName = 'CardSection';

export { CardSection, cardSectionVariants };

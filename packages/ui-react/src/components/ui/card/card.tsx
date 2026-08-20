import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { HandleGripIcon } from '@acronis-platform/icons-react/stroke-mono';
import { PencilIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ButtonIconInput } from '@/components/ui/button-icon-input';
import { Switch } from '@/components/ui/switch';
import { buttonIconVariants } from '@/components/ui/button-icon';
import {
  AccordionContainer,
  useAccordionContainerContext,
} from '@/components/ui/accordion-container';

// Figma node 10012:195993 ("Card"). The design's `isCollapsable` variant
// (`false` / `true-expanded` / `true-collapsed`) is implemented by composing
// `Card` with `AccordionContainer` (the shared disclosure primitive) rather
// than a bespoke chevron/animation: wrap `CardContent`/`CardFooter` in
// `AccordionContainer.Content` and set `CardHeader`'s `isCollapsible` to
// render the trigger. The trigger is restyled with `buttonIconVariants({
// variant: 'ghost' })` instead of `AccordionContainer.Trigger`'s own neutral
// default — Figma's `ButtonCollapse` is a real ghost `ButtonIcon` instance
// (confirmed via Code Connect metadata + its idle icon color resolving to
// `--ui-button-icon-global-icon-color-idle`), not the accordion's plain
// neutral chevron.
// No dedicated `--ui-card-*` token tier exists for the root chrome (only the
// unrelated `CardFilter` tier does) — the design references plain semantic
// tokens for the surface/border/divider/text colors, so this stays on the
// shared semantic tier rather than a component-local one.
//
// `hasHeader` / `hasBody` / `hasFooter` from Figma aren't reproduced as
// booleans: this is a compound component (`Card` + `CardHeader` +
// `CardContent` + `CardFooter`), so a part is simply omitted by the consumer
// instead of hidden behind a flag — same pattern as the rest of this package
// (see `breadcrumb.tsx`). `CardHeader`'s own feature toggles (`isDraggable`,
// `isSwitchable`, `hasAvatar`, `hasRename`, `hasDescription`) stay as booleans
// because each gates real interactive/content sub-parts with independent
// payloads (a callback, a slot, a label), not a structural part swap.

const cardVariants = cva(
  'overflow-hidden rounded-lg border bg-[var(--ui-background-surface-primary)] text-[var(--ui-text-on-surface-primary)]',
  {
    variants: {
      hasError: {
        false: 'border-[var(--ui-border-on-surface-border)]',
        true: 'border-[var(--ui-border-on-surface-border-error)]',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition) — e.g. render `Card` as an `<article>`.
   */
  render?: useRender.RenderProp;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hasError, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        { className: cn(cardVariants({ hasError }), className) },
        props
      ),
    })
);
Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** The card's title. */
  title?: string;
  /** Helper text shown under the title; only rendered when `hasDescription`. */
  description?: string;
  /** Shows `description` below the title. */
  hasDescription?: boolean;
  /** Shows a drag handle at the start of the header, for reorderable lists. */
  isDraggable?: boolean;
  /** Accessible label for the drag handle. */
  dragHandleLabel?: string;
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
  /** Shows an avatar before the title. */
  hasAvatar?: boolean;
  /** Initials shown in the default avatar; ignored if `avatar` is provided. */
  avatarLabel?: string;
  /** Replaces the default initials avatar with custom content. */
  avatar?: React.ReactNode;
  /** Shows a rename button next to the title. */
  hasRename?: boolean;
  /** Fires when the rename button is activated. */
  onRename?: () => void;
  /** Accessible label for the rename button. */
  renameLabel?: string;
  /** Extra content rendered inline next to the title (e.g. a tag or badge). */
  extras?: React.ReactNode;
  /** Actions rendered at the end of the header (e.g. a menu button). */
  actions?: React.ReactNode;
  /**
   * Shows a disclosure trigger at the end of the header. Only has an effect
   * when this header renders inside a collapsible `AccordionContainer` —
   * see the collapsible composition example.
   */
  isCollapsible?: boolean;
  /** Accessible label for the collapse trigger. */
  collapseLabel?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className,
      title = 'Title',
      description,
      hasDescription = false,
      isDraggable = false,
      dragHandleLabel = 'Reorder',
      isSwitchable = false,
      switchChecked,
      defaultSwitchChecked,
      onSwitchCheckedChange,
      switchDisabled,
      switchLabel = 'Toggle card',
      hasAvatar = false,
      avatarLabel = '',
      avatar,
      hasRename = false,
      onRename,
      renameLabel = 'Rename',
      extras,
      actions,
      isCollapsible = false,
      collapseLabel = 'Toggle card',
      children,
      ...props
    },
    ref
  ) => {
    const { collapsible: inAccordion, open } = useAccordionContainerContext();
    // Drop the divider when this header is the last visible element of a
    // collapsed panel — otherwise it doubles up against Card's own outer
    // border once there's no content below to separate it from.
    const hideDivider = isCollapsible && inAccordion && !open;

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full shrink-0 items-center gap-2 overflow-hidden border-[var(--ui-border-on-surface-divider)] px-4 py-2',
          !hideDivider && 'border-b',
          className
        )}
        {...props}
      >
        {isDraggable && (
          <HandleGripIcon
            size={16}
            className="shrink-0 cursor-grab text-[var(--ui-text-on-surface-secondary)]"
            title={dragHandleLabel}
          />
        )}
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
        {hasAvatar &&
          (avatar ?? (
            <Avatar color="blue" className="shrink-0">
              <AvatarFallback>{avatarLabel}</AvatarFallback>
            </Avatar>
          ))}
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5">
          <div className="flex items-center gap-2">
            <p className="truncate text-lg leading-6 font-normal text-[var(--ui-text-on-surface-primary)]">
              {title}
            </p>
            {hasRename && (
              <ButtonIconInput
                variant="normal"
                onClick={onRename}
                aria-label={renameLabel}
              >
                <PencilIcon size={16} />
              </ButtonIconInput>
            )}
            {extras}
          </div>
          {hasDescription && (
            <p className="w-full truncate text-xs leading-4 text-[var(--ui-text-on-surface-secondary)]">
              {description}
            </p>
          )}
        </div>
        {children}
        {actions}
        {isCollapsible && (
          <AccordionContainer.Trigger
            aria-label={collapseLabel}
            className={cn(
              buttonIconVariants({ variant: 'ghost' }),
              '[&[data-panel-open]>svg]:rotate-90 [&:not([data-panel-open])>svg]:rtl:rotate-180'
            )}
          />
        )}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export interface CardPartProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition).
   */
  render?: useRender.RenderProp;
}

const CardContent = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        { className: cn('flex w-full flex-col px-4 pb-4', className) },
        props
      ),
    })
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            'flex w-full shrink-0 items-start gap-4 overflow-hidden border-t border-[var(--ui-border-on-surface-divider)] p-4',
            className
          ),
        },
        props
      ),
    })
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter, cardVariants };

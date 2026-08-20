'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';
import {
  CircleCheckGreenIcon,
  CircleInfoBlueIcon,
  CircleWarningOrangeIcon,
  DiamondWarningRedIcon,
  TriangleWarningYellowIcon,
  type IconProps,
} from '@acronis-platform/icons-react/stroke-multi';

import { cn } from '@/lib/utils';
import { ButtonIcon, type ButtonIconProps } from '../button-icon';

// Mirrors the Figma "Alert" component set (node 7421:125155). The banner is a
// *neutral* surface — not a status tint — with the severity carried by two
// things: a 1px border in the status color and a 6px status line down the
// leading edge. Geometry, colors, and spacing all come from the dedicated
// `--ui-alert-*` tier (imported in `src/styles/index.css`).
//
// The status line is a `::before` pseudo-element rather than a DOM node: it is
// never optional and never a slot, so a real element would only add markup for
// consumers to get wrong. It is bled 1px outwards on three sides so it paints
// *over* the border it sits on (matching the Figma, where the line covers the
// leading border), and the root's clip rounds its square corners to the
// container radius. `start-` keeps it on the leading edge under `dir="rtl"`.
//
// `overflow-clip-margin: border-box` is load-bearing, not decoration. `overflow:
// clip` alone clips at the *padding* box, which is exactly where the bleed has to
// reach — and an absolutely positioned pseudo-element's containing block is that
// same padding box — so the outward 1px gets shaved off and the line renders 5px
// wide starting *inside* the border. Since the border and the line are different
// tokens, that reads as two adjacent stripes rather than one 6px line. Moving the
// clip edge out to the border box lets the bleed survive while still rounding the
// corners.
//
// Typography comes from the Alert tier's own emitted classes — the title (Inter
// Regular 18 / 24) and the description (Inter Regular 14 / 24) — the same pair
// Toast uses, since the two are the same card. The title previously borrowed the
// semantic `ui-typography-headings-lead` because the tier emitted no title class;
// it does now, and the two resolve identically today, so a brand that re-styles
// only Alert's title is honored. Only the *colors* are separate token references.
// Every other value is a `var(--ui-alert-*)` reference, so a brand override is
// honored without touching this file.
const alertVariants = cva(
  'relative flex w-full items-start overflow-clip [overflow-clip-margin:border-box] border-solid ' +
    'min-w-[var(--ui-alert-global-container-width-min)] ' +
    'gap-[var(--ui-alert-global-container-gap)] ' +
    'px-[var(--ui-alert-global-container-padding-x)] py-[var(--ui-alert-global-container-padding-y)] ' +
    'rounded-[var(--ui-alert-global-container-border-radius)] ' +
    'border-[length:var(--ui-alert-global-container-border-width)] ' +
    'bg-[var(--ui-alert-global-container-background)] ' +
    "before:absolute before:content-[''] before:-inset-y-px before:start-[-1px] " +
    'before:w-[var(--ui-alert-global-container-status-width)]',
  {
    variants: {
      variant: {
        info: 'border-[color:var(--ui-alert-info-border-color)] before:bg-[var(--ui-alert-info-left-line)]',
        success:
          'border-[color:var(--ui-alert-success-border-color)] before:bg-[var(--ui-alert-success-left-line)]',
        warning:
          'border-[color:var(--ui-alert-warning-border-color)] before:bg-[var(--ui-alert-warning-left-line)]',
        critical:
          'border-[color:var(--ui-alert-critical-border-color)] before:bg-[var(--ui-alert-critical-left-line)]',
        danger:
          'border-[color:var(--ui-alert-danger-border-color)] before:bg-[var(--ui-alert-danger-left-line)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export type AlertVariant = NonNullable<
  VariantProps<typeof alertVariants>['variant']
>;

// The Figma binds exactly one icon to each variant, and they are multicolor
// (`stroke-multi`) glyphs that carry their own fills — so unlike the previous
// monocolor port, nothing here tints them.
const STATUS_ICON: Record<AlertVariant, React.ComponentType<IconProps>> = {
  info: CircleInfoBlueIcon,
  success: CircleCheckGreenIcon,
  warning: TriangleWarningYellowIcon,
  critical: CircleWarningOrangeIcon,
  danger: DiamondWarningRedIcon,
};

const AlertVariantContext = React.createContext<AlertVariant>('info');

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

/**
 * A status banner: neutral surface, a status-colored border, and a status line
 * down the leading edge. Compose it from `AlertIcon`, `AlertContent`
 * (`AlertText` + `AlertTitle` / `AlertDescription`, optionally `AlertActions`)
 * and `AlertClose`.
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <AlertVariantContext.Provider value={variant ?? 'info'}>
      <div
        ref={ref}
        role="alert"
        data-slot="alert"
        data-variant={variant ?? 'info'}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    </AlertVariantContext.Provider>
  )
);
Alert.displayName = 'Alert';

/**
 * The leading status icon. Renders the variant's own icon when given no
 * `children`; pass children to substitute a different glyph.
 */
const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const variant = React.useContext(AlertVariantContext);
  const StatusIcon = STATUS_ICON[variant];
  return (
    // The icon box's padding (4/8) is what optically aligns the 16px glyph with
    // the first line of the title: glyph centre 8 + 8 = 16, title centre
    // (AlertText's 4px padding) 4 + 12 = 16.
    <div
      ref={ref}
      data-slot="alert-icon"
      className={cn(
        'flex shrink-0 items-start px-[var(--ui-alert-global-icon-padding-x)] py-[var(--ui-alert-global-icon-padding-y)] [&_svg]:size-[var(--ui-alert-global-icon-size)] [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      {children ?? <StatusIcon size={16} />}
    </div>
  );
});
AlertIcon.displayName = 'AlertIcon';

const AlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-content"
    className={cn(
      'flex min-w-0 flex-1 flex-col items-start gap-[var(--ui-alert-global-content-gap)] px-[var(--ui-alert-global-content-padding-x)] py-[var(--ui-alert-global-content-padding-y)]',
      className
    )}
    {...props}
  />
));
AlertContent.displayName = 'AlertContent';

/**
 * The title + description block. Its own vertical padding is what keeps the
 * text aligned with the icon, so keep the title and description inside it
 * rather than directly under `AlertContent`.
 */
const AlertText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-text"
    className={cn(
      'flex w-full shrink-0 flex-col items-start gap-[var(--ui-alert-global-content-text-container-gap)] px-[var(--ui-alert-global-content-text-container-padding-x)] py-[var(--ui-alert-global-content-text-container-padding-y)] [word-break:break-word]',
      className
    )}
    {...props}
  />
));
AlertText.displayName = 'AlertText';

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    data-slot="alert-title"
    className={cn(
      'ui-alert-global-content-text-container-title-text-style mb-0 w-full text-[var(--ui-alert-global-content-text-container-title-color)]',
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="alert-description"
    className={cn(
      'ui-alert-global-content-text-container-description-text-style w-full text-[var(--ui-alert-global-content-text-container-description-color)]',
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

/**
 * Action buttons under the text. Place inside `AlertContent` (after
 * `AlertText`), as the Figma does — the row wraps when it runs out of width.
 */
const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-actions"
    className={cn(
      'flex w-full shrink-0 flex-wrap content-start items-start gap-x-[var(--ui-alert-global-content-actions-container-gap-x)] gap-y-[var(--ui-alert-global-content-actions-container-gap-y)] px-[var(--ui-alert-global-content-actions-container-padding-x)] py-[var(--ui-alert-global-content-actions-container-padding-y)]',
      className
    )}
    {...props}
  />
));
AlertActions.displayName = 'AlertActions';

// The spec pins this control to a ghost ButtonIcon with a times glyph, so the
// props that would change that are omitted from the type instead of merely being
// defaulted — `...props` spreads after them, so keeping them would let
// `<AlertClose variant="secondary" />` silently win over the documented behavior.
//
// `aria-label` needs the belt *and* braces. Omitting it from the type is not
// enough: TypeScript deliberately skips checking hyphenated JSX attributes (the
// same rule that lets `data-*` through), so `<AlertClose aria-label="X" />` still
// compiles. Pinning `aria-label` after the spread is what actually makes
// `ariaLabel` authoritative.
export interface AlertCloseProps
  extends Omit<ButtonIconProps, 'children' | 'variant' | 'render' | 'aria-label'> {
  /** Accessible name for the dismiss control. */
  ariaLabel?: string;
}

/**
 * The trailing dismiss control. Rendering it is what makes an alert
 * dismissable — wire `onClick` to remove the alert. Name it with `ariaLabel`.
 */
const AlertClose = React.forwardRef<HTMLButtonElement, AlertCloseProps>(
  ({ className, ariaLabel = 'Close', ...props }, ref) => (
    <ButtonIcon
      ref={ref}
      data-slot="alert-close"
      className={cn('shrink-0', className)}
      {...props}
      variant="ghost"
      aria-label={ariaLabel}
    >
      <TimesIcon />
    </ButtonIcon>
  )
);
AlertClose.displayName = 'AlertClose';

export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertText,
  AlertTitle,
  AlertDescription,
  AlertActions,
  AlertClose,
  alertVariants,
};

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { usePortalContainer } from '@/lib/portal-container';

import { Button } from '../button';
import { DialogFooterDefault } from '../dialog-footer-default';
import { InputText } from '../input-text';
import { Loading } from '../loading';

// Initial version ported from `@acronis-platform/shadcn-uikit`'s `dialog`
// (packages/ui-legacy/src/components/ui/dialog.tsx). A modal overlay built on
// the Base UI Dialog primitive (keyboard, focus trap, scroll lock, ARIA come
// from Base UI). A `--ui-dialog-*` / `--ui-button-icon-*` token tier covers the
// container + close button (reconciled against the Figma "DialogDefault" node,
// 6343:58898); the composable DialogRoot / DialogHeaderRoot / DialogFooterRoot
// / DialogBodyRoot parts below are internal-only (no public export, no Figma
// node of their own) and keep the prior semantic-token approach — not to be
// confused with the recipe-local `DialogHeader`/`DialogBody` further down,
// which back the public `Dialog` and are reconciled against Figma:
//   • overlay  -> var(--ui-background-backdrop-screen)   (legacy `bg-black/80`)
//   • popup    -> var(--ui-dialog-container-color) / var(--ui-dialog-container-border-radius)
//   • header / footer -> bg-background = --ui-background-surface-primary (white
//     bars over the muted body), divided by border-border
//   • title    -> text-foreground / description -> text-muted-foreground
//   • close    -> var(--ui-button-icon-global-icon-color-*) (idle/hover/active
//     share one blue in the default brand), bg via
//     var(--ui-button-icon-global-container-color-*), focus ring var(--ui-focus-primary)
// Enter/exit animations use `tw-animate-css` (imported in styles/index.css),
// keyed to Base UI's data-[open] / data-[closed] state attributes — overlay
// fades, popup fades + zooms. `size` has two values: `sm` (512px, the Figma
// default, backed by `--ui-dialog-container-size-sm`) and `large` (832px) — the
// latter predates the Figma node and has no token; it's kept as a plain
// arbitrary value solely for backward compatibility with existing call sites
// that need a wider popup (see the `Large` story).
//
// Dialog's composable primitive parts (this file) are internal-only — not
// re-exported from the package root — except `DialogClose`, which stays
// public: it's required by the `wide` variant's documented custom-`footer`
// escape hatch (see the `footer` prop and dialog.mdx). The public `Dialog`
// component below is the sole sanctioned entry point; it's built on these
// parts internally. (In Figma the matching component set is named
// "DialogDefault"; the code-facing name stays `Dialog` — see dialog.figma.tsx.)

const dialogContentVariants = cva(
  'fixed left-1/2 top-1/2 z-50 flex w-full min-w-[var(--ui-dialog-container-width-min)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--ui-dialog-container-border-radius)] bg-[var(--ui-dialog-container-color)] text-foreground shadow-lg duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
  {
    variants: {
      size: {
        sm: 'max-w-[var(--ui-dialog-container-size-sm)]',
        large: 'max-w-[832px]',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

const DialogRoot = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[var(--ui-background-backdrop-screen)] duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>,
    VariantProps<typeof dialogContentVariants> {
  /**
   * Popup max-width. `sm` (512px, default) is the Figma-defined size; `large`
   * (832px) is a backward-compatibility size with no design token (see the
   * `Large` story).
   */
  size?: VariantProps<typeof dialogContentVariants>['size'];
  /**
   * Render the content inside a portal (default `true`). Base UI requires the
   * Popup to sit in a Portal for correct stacking; set `false` for inline usage
   * (e.g. when the caller supplies its own `DialogPortal`, or in tests).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: DialogPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: DialogPrimitive.Portal.Props['keepMounted'];
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Popup>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;

    const popup = (
      <>
        <DialogOverlay />
        <DialogPrimitive.Popup
          ref={ref}
          className={cn(dialogContentVariants({ size }), className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </>
    );

    return portal ? (
      <DialogPrimitive.Portal container={resolvedContainer} keepMounted={keepMounted}>
        {popup}
      </DialogPrimitive.Portal>
    ) : (
      popup
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeaderRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 items-center gap-4 border-b border-border bg-background px-5 py-4',
      className
    )}
    {...props}
  />
));
DialogHeaderRoot.displayName = 'DialogHeaderRoot';

const DialogFooterRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 items-center justify-end gap-4 border-t border-border bg-background px-6 py-4',
      className
    )}
    {...props}
  />
));
DialogFooterRoot.displayName = 'DialogFooterRoot';

const DialogBodyRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 overflow-auto p-6', className)} {...props} />
));
DialogBodyRoot.displayName = 'DialogBodyRoot';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'flex-1 text-2xl font-normal leading-8 text-foreground',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export interface DialogCloseButtonProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  /** Accessible name for screen readers. Defaults to `'Close'`. */
  closeLabel?: string;
}

const DialogCloseButton = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  DialogCloseButtonProps
>(({ className, closeLabel = 'Close', ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'cursor-pointer rounded p-1 text-[var(--ui-button-icon-global-icon-color-idle)] transition-colors hover:bg-[var(--ui-button-icon-global-container-color-hover)] hover:text-[var(--ui-button-icon-global-icon-color-hover)] active:bg-[var(--ui-button-icon-global-container-color-active)] active:text-[var(--ui-button-icon-global-icon-color-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none disabled:cursor-default disabled:text-[var(--ui-button-icon-global-icon-color-disabled)]',
      className
    )}
    {...props}
  >
    <TimesIcon size={24} />
    <span className="sr-only">{closeLabel}</span>
  </DialogPrimitive.Close>
));
DialogCloseButton.displayName = 'DialogCloseButton';

// The recipe-specific header: title + close button, reconciled against the
// Figma "DialogHeader" node (4220:3516) via the `--ui-dialog-header-*` tier.
// Local to this file (not exported) — distinct from the generic, unstyled
// `DialogHeaderRoot` composable primitive above.
interface DialogHeaderProps {
  title: string;
  closeLabel?: string;
}

function DialogHeader({ title, closeLabel }: DialogHeaderProps) {
  return (
    <div className="flex h-[var(--ui-dialog-header-height)] items-center gap-[var(--ui-dialog-header-gap)] border-b-[length:var(--ui-dialog-header-border-width)] border-[var(--ui-dialog-header-border-color)] bg-[var(--ui-dialog-header-color)] px-[var(--ui-dialog-header-padding-x)]">
      <DialogTitle>{title}</DialogTitle>
      <DialogCloseButton closeLabel={closeLabel} />
    </div>
  );
}

// The recipe-specific body: the variant's canned copy (or the `children`
// override), reconciled against the Figma DialogDefault node via the
// `--ui-dialog-body-*` tier. Local to this file — distinct from the generic
// `DialogBodyRoot` composable primitive above.
interface DialogBodyProps {
  children: React.ReactNode;
  /** Makes the body unfocusable/unclickable while the loading overlay is shown. */
  inert?: boolean;
}

function DialogBody({ children, inert }: DialogBodyProps) {
  return (
    <div
      inert={inert}
      className="flex min-h-[var(--ui-dialog-body-height-min)] flex-col justify-center gap-[var(--ui-dialog-body-gap)] px-4 py-[var(--ui-dialog-body-padding-y)]"
    >
      {typeof children === 'string' ? (
        <p className="text-sm leading-6 text-foreground">{children}</p>
      ) : (
        children
      )}
    </div>
  );
}

// The recipe-specific footer actions: a secondary (dismiss) button plus a
// primary action, the latter either closing the dialog itself (`read-only`'s
// "Done") or firing `onPrimaryAction` and leaving the close to the caller.
// Local to this file — distinct from the generic `DialogFooterRoot`.
interface DialogFooterActionsProps {
  secondaryLabel?: string;
  primaryLabel: string;
  primaryVariant: 'default' | 'destructive';
  primaryCloses?: boolean;
  onPrimaryAction?: () => void;
}

function DialogFooterActions({
  secondaryLabel,
  primaryLabel,
  primaryVariant,
  primaryCloses,
  onPrimaryAction,
}: DialogFooterActionsProps) {
  return (
    <>
      {secondaryLabel && (
        <DialogClose render={<Button variant="secondary">{secondaryLabel}</Button>} />
      )}
      {primaryCloses ? (
        <DialogClose
          onClick={onPrimaryAction}
          render={<Button variant={primaryVariant}>{primaryLabel}</Button>}
        />
      ) : (
        <Button variant={primaryVariant} onClick={onPrimaryAction}>
          {primaryLabel}
        </Button>
      )}
    </>
  );
}

// A higher-level "recipe" built on top of the Dialog primitive parts above
// (DialogRoot + DialogContent give the portal, backdrop, focus trap, scroll
// lock and open state; DialogTitle wires the accessible name; DialogCloseButton
// / DialogClose give the dismiss controls). It bakes in the seven Figma
// "DialogDefault" use-cases (node 6343:58898) plus one legacy `wide` escape
// hatch kept for backward compatibility: each `variant` picks a canned title,
// body copy and footer buttons; `children` overrides only the body slot;
// `title` overrides only the title; `footer` overrides only the footer's
// action content (the free-form escape hatch `wide` relies on); `hasLoading`
// drops a spinner overlay over the body + footer. `hasHeader`/`hasFooter`
// (both default `true`) hide the header/footer chrome entirely — a
// ui-react-only extension beyond the Figma DialogDefault contract, which
// always shows both; the title stays rendered off-screen when the header is
// hidden so the dialog keeps an accessible name.
//
// Colors resolve to shipped semantic tokens via the bridged Tailwind names the
// Dialog family already uses (text-foreground, the backdrop + focus tokens
// inside DialogContent / DialogCloseButton) and the Button / InputText token
// tiers — nothing is hand-authored. The loading scrim renders `Loading`'s
// `onSurfaceSecondary` variant (`--ui-loading-element-container-color-secondary`),
// matching the design's translucent surface fill.
//
// Header + footer geometry/color resolve to the `--ui-dialog-header-*` /
// `--ui-footer-*` tiers, reconciled against the DialogDefault Figma node.

export type DialogVariant =
  | 'default'
  | 'rename'
  | 'save changes'
  | 'reset password'
  | 'discard changes'
  | 'accept'
  | 'read-only'
  | 'wide';

interface DialogVariantContent {
  /**
   * The variant's canned title. A function receives `objectName` (falls back
   * to its own placeholder default when omitted) for variants whose title
   * embeds the acted-on object's name.
   */
  title: string | ((objectName?: string) => string);
  /**
   * Same `objectName` interpolation as `title`, for body copy/fields that
   * embed it. The `rename` variant's field also receives `objectNameLabel`
   * for its accessible name.
   */
  body:
    | React.ReactNode
    | ((objectName?: string, objectNameLabel?: string) => React.ReactNode);
  /** Secondary (dismiss) button label. Omitted when the variant has none. */
  secondaryLabel?: string;
  primaryLabel: string;
  primaryVariant: 'default' | 'destructive';
  /** Whether the primary button dismisses the dialog (e.g. read-only "Done"). */
  primaryCloses?: boolean;
}

const DIALOG_VARIANT_CONTENT: Record<DialogVariant, DialogVariantContent> = {
  default: {
    title: 'Dialog title',
    body: 'Drop any content into this slot.',
    secondaryLabel: 'Cancel',
    primaryLabel: 'Label',
    primaryVariant: 'default',
  },
  rename: {
    title: (objectName = 'object name') => `Rename ${objectName}`,
    // `objectName` prefills the field with the real current name; the field's
    // accessible name (`objectNameLabel`) is separate — it's the label, not the value.
    body: (objectName = 'Current name', objectNameLabel = 'Object name') => (
      <InputText aria-label={objectNameLabel} defaultValue={objectName} />
    ),
    secondaryLabel: 'Cancel',
    primaryLabel: 'Rename',
    primaryVariant: 'default',
  },
  'save changes': {
    title: 'Save changes',
    body: 'You have unsaved changes. Do you want to save them before leaving?',
    secondaryLabel: 'Go back',
    primaryLabel: 'Save',
    primaryVariant: 'default',
  },
  'reset password': {
    title: 'Reset password',
    body: 'Further instructions will be sent to your email address.',
    secondaryLabel: 'Cancel',
    primaryLabel: 'Reset',
    primaryVariant: 'default',
  },
  'discard changes': {
    title: 'Discard changes',
    body: (objectName = 'Object name') => (
      <p className="text-sm leading-6 text-foreground">
        Are you sure you want to discard the unsaved changes to{' '}
        <strong className="font-semibold">{objectName}</strong>?
      </p>
    ),
    secondaryLabel: 'Go back',
    primaryLabel: 'Confirm',
    primaryVariant: 'destructive',
  },
  accept: {
    title: (objectName = 'object name') => `Accept ${objectName}`,
    body: 'Click Accept to confirm that you have read, understood, and agree to the terms and conditions below.',
    secondaryLabel: 'Cancel',
    primaryLabel: 'Accept',
    primaryVariant: 'default',
  },
  'read-only': {
    title: 'License agreement',
    body: 'This is a read-only dialog used to view legal documents such as the License Agreement, EULA updates, Terms of Service, and other legal documents.',
    primaryLabel: 'Done',
    primaryVariant: 'default',
    primaryCloses: true,
  },
  // No Figma preset — a legacy, free-form escape hatch (see the `footer` prop
  // and the `Large` story). This fallback title/body/footer only renders if
  // the caller supplies neither `footer` nor `title`/`children` — every real
  // `wide` call site overrides them.
  wide: {
    title: 'Dialog title',
    body: 'Drop any content into this slot.',
    secondaryLabel: 'Cancel',
    primaryLabel: 'Confirm',
    primaryVariant: 'default',
  },
};

type DialogRootProps = React.ComponentPropsWithoutRef<typeof DialogRoot>;

export interface DialogProps extends Omit<DialogRootProps, 'children'> {
  /**
   * Selects the canned title / body / footer preset. Defaults to `'default'`.
   * `'wide'` is a legacy escape hatch (no canned preset) kept for backward
   * compatibility — pair it with `size="large"` and the `footer` prop.
   */
  variant?: DialogVariant;
  /**
   * Show a spinner overlay across the body + footer, and make both `inert`
   * (unfocusable, unclickable, hidden from assistive tech) so a keyboard user
   * can't activate the visually obscured footer buttons while busy.
   */
  hasLoading?: boolean;
  /**
   * Overrides the loading overlay's accessible label. Defaults to `Loading`'s
   * own default (`'Data is loading…'`). Ignored when `hasLoading` is `false`.
   */
  loadingLabel?: string;
  /**
   * Show the header (title + close button). Defaults to `true`. When `false`,
   * the title is still rendered off-screen so the dialog keeps an accessible
   * name — only the visible bar and close button are omitted. Beyond the
   * strict Figma contract (all seven `DialogDefault` variants always show the
   * header); a ui-react-only extension, like `wide`/`size="large"`.
   */
  hasHeader?: boolean;
  /**
   * Show the footer (action buttons). Defaults to `true`. Beyond the strict
   * Figma contract (all seven `DialogDefault` variants always show the
   * footer); a ui-react-only extension, like `wide`/`size="large"`. When
   * `false`, `footer` (and the canned footer it would otherwise replace) is
   * not rendered either.
   */
  hasFooter?: boolean;
  /** Overrides the variant's default body content. */
  children?: React.ReactNode;
  /** Overrides the variant's default title. */
  title?: string;
  /**
   * The real name of the object being acted on (e.g. a file or resource
   * name). Interpolated into the `rename`/`discard changes`/`accept`
   * variants' canned title/body in place of the generic placeholder text;
   * ignored by variants that don't reference an object name.
   */
  objectName?: string;
  /**
   * Overrides the accessible name of the `rename` variant's text field
   * (default `'Object name'`). Ignored by every other variant.
   */
  objectNameLabel?: string;
  /**
   * Overrides the variant's default secondary (dismiss) button label. Passing
   * this for a variant with no secondary button by default (e.g. `read-only`)
   * also makes the button appear. Ignored when `footer` is provided.
   */
  secondaryLabel?: string;
  /** Overrides the variant's default primary button label. Ignored when `footer` is provided. */
  primaryLabel?: string;
  /**
   * Fires when the primary footer button is clicked. The dialog does not
   * close automatically afterwards — pair this with `open`/`onOpenChange` to
   * close it once the action completes. Ignored when `footer` is provided
   * (wire behavior onto your own buttons there instead).
   */
  onPrimaryAction?: () => void;
  /**
   * Replaces the footer's action content entirely with free-form buttons —
   * the escape hatch the `wide` variant is meant to be paired with, for
   * legacy call sites that don't fit one of the seven canned presets. Ignored
   * (along with the canned footer) when `hasFooter` is `false`.
   */
  footer?: React.ReactNode;
  /** Overrides the close button's accessible name. Defaults to `'Close'`. */
  closeLabel?: string;
  /**
   * Popup max-width (forwarded to `DialogContent`). Defaults to `'sm'`, or to
   * `'large'` when `variant` is `'wide'`.
   */
  size?: DialogContentProps['size'];
  /** Render inside a portal (forwarded to `DialogContent`). Defaults to `true`. */
  portal?: boolean;
  /** Portal container (forwarded to `DialogContent`). */
  portalContainer?: DialogContentProps['portalContainer'];
  /** Keep the content mounted while closed (forwarded to `DialogContent`). */
  keepMounted?: DialogContentProps['keepMounted'];
  /** Extra classes merged onto the popup container. */
  className?: string;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      variant = 'default',
      hasLoading = false,
      loadingLabel,
      hasHeader = true,
      hasFooter = true,
      children,
      title,
      objectName,
      objectNameLabel,
      secondaryLabel,
      primaryLabel,
      onPrimaryAction,
      footer,
      closeLabel,
      size,
      portal,
      portalContainer,
      keepMounted,
      className,
      ...rootProps
    },
    ref
  ) => {
    const content = DIALOG_VARIANT_CONTENT[variant];
    const resolvedTitle =
      typeof content.title === 'function' ? content.title(objectName) : content.title;
    const resolvedBody =
      typeof content.body === 'function'
        ? content.body(objectName, objectNameLabel)
        : content.body;
    const bodyContent = children ?? resolvedBody;
    const titleText = title ?? resolvedTitle;
    const secondaryLabelText = secondaryLabel ?? content.secondaryLabel;
    const primaryLabelText = primaryLabel ?? content.primaryLabel;
    const resolvedSize = size ?? (variant === 'wide' ? 'large' : 'sm');

    return (
      <DialogRoot {...rootProps}>
        <DialogContent
          ref={ref}
          size={resolvedSize}
          portal={portal}
          portalContainer={portalContainer}
          keepMounted={keepMounted}
          className={className}
          aria-busy={hasLoading || undefined}
        >
          {hasHeader ? (
            <DialogHeader title={titleText} closeLabel={closeLabel} />
          ) : (
            // Header hidden, but the dialog still needs an accessible name.
            <DialogTitle className="sr-only">{titleText}</DialogTitle>
          )}

          <DialogBody inert={hasLoading}>{bodyContent}</DialogBody>

          {hasFooter && (
            <DialogFooterDefault inert={hasLoading}>
              {footer ?? (
                <DialogFooterActions
                  secondaryLabel={secondaryLabelText}
                  primaryLabel={primaryLabelText}
                  primaryVariant={content.primaryVariant}
                  primaryCloses={content.primaryCloses}
                  onPrimaryAction={onPrimaryAction}
                />
              )}
            </DialogFooterDefault>
          )}

          {hasLoading && (
            <Loading
              variant="onSurfaceSecondary"
              hasLabel={false}
              label={loadingLabel}
              className={cn(
                'absolute inset-x-0 bottom-0 rounded-none',
                hasHeader ? 'top-[var(--ui-dialog-header-height)]' : 'top-0'
              )}
            />
          )}
        </DialogContent>
      </DialogRoot>
    );
  }
);
Dialog.displayName = 'Dialog';

export {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogCloseButton,
  DialogTrigger,
  DialogContent,
  DialogHeaderRoot,
  DialogFooterRoot,
  DialogTitle,
  DialogBodyRoot,
  DialogDescription,
  dialogContentVariants,
  Dialog,
};

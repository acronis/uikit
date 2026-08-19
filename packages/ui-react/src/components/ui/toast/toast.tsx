'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
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
import { usePortalContainer } from '@/lib/portal-container';
import { Button } from '../button';
import { ButtonIcon } from '../button-icon';
import { Spinner } from '../spinner';

// Mirrors the Figma "Toast" component set (node 7421:126262), which is the Alert
// banner plus a drop shadow: a *neutral* surface — not a status tint — with the
// severity carried by a 1px border in the status color and a 6px status line down
// the leading edge. Geometry, colors, and spacing all come from the dedicated
// `--ui-toast-*` tier (imported in `src/styles/index.css`).
//
// The delivery mechanism is unchanged from the Sonner-compatible port: a single
// `<Toaster />` at the app root plus the imperative `toast(...)` API, built on the
// Base UI toast manager (no Sonner dependency). Only the rendered surface and the
// variant vocabulary changed.
//
// The Figma's `hasDescription` / `hasActions` / `dismissable` booleans map onto
// per-toast options rather than props, since there is no per-toast component to
// take them: omitting `description` or `actions` drops those parts, and
// `dismissable: false` drops the close control. `dismissable` also has to switch
// off Base UI's swipe-to-dismiss, which is on by default — see the `Root` below.
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
// Typography comes from the Toast tier's own emitted classes rather than
// hand-written utilities: one for the title (Inter Regular 18 / 24 — the same
// treatment Alert's title uses) and one for the description (Inter Regular
// 14 / 24). The title previously borrowed the semantic
// `ui-typography-headings-lead` because the tier emitted no title class; it does
// now, and the two resolve identically today. Only the *colors* are separate
// token references.
//
// One deliberate deviation from the Figma: `container/widthMin` (384px) is applied
// to the viewport, not to the card. A fixed-position stack with a 384px
// `min-width` overflows a narrow phone viewport (min-width always beats
// max-width), so the viewport owns the width and clamps it with `max-w`, and the
// card just fills it.
const toastVariants = cva(
  'relative flex w-full items-start overflow-clip [overflow-clip-margin:border-box] border-solid ' +
    'gap-[var(--ui-toast-global-container-gap)] ' +
    'px-[var(--ui-toast-global-container-padding-x)] py-[var(--ui-toast-global-container-padding-y)] ' +
    'rounded-[var(--ui-toast-global-container-border-radius)] ' +
    'border-[length:var(--ui-toast-global-container-border-width)] ' +
    'bg-[var(--ui-toast-global-container-background)] ' +
    'shadow-[var(--ui-toast-global-container-shadow)] ' +
    "before:absolute before:content-[''] before:-inset-y-px before:start-[-1px] " +
    'before:w-[var(--ui-toast-global-container-status-width)]',
  {
    variants: {
      variant: {
        info: 'border-[color:var(--ui-toast-info-border-color)] before:bg-[var(--ui-toast-info-left-line)]',
        success:
          'border-[color:var(--ui-toast-success-border-color)] before:bg-[var(--ui-toast-success-left-line)]',
        warning:
          'border-[color:var(--ui-toast-warning-border-color)] before:bg-[var(--ui-toast-warning-left-line)]',
        critical:
          'border-[color:var(--ui-toast-critical-border-color)] before:bg-[var(--ui-toast-critical-left-line)]',
        danger:
          'border-[color:var(--ui-toast-danger-border-color)] before:bg-[var(--ui-toast-danger-left-line)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export type ToastVariant = NonNullable<
  VariantProps<typeof toastVariants>['variant']
>;

/**
 * A toast's kind. The five severities match the Figma variants; `loading` has no
 * Figma variant — it is the spinner state `toast.promise` needs.
 */
export type ToastType = ToastVariant | 'loading';

// The Figma binds exactly one icon to each variant, and they are multicolor
// (`stroke-multi`) glyphs that carry their own fills — so nothing here tints them.
const STATUS_ICON: Record<ToastVariant, React.ComponentType<IconProps>> = {
  info: CircleInfoBlueIcon,
  success: CircleCheckGreenIcon,
  warning: TriangleWarningYellowIcon,
  critical: CircleWarningOrangeIcon,
  danger: DiamondWarningRedIcon,
};

// Base UI's `promise` helper hardcodes `type: 'loading' | 'success' | 'error'`
// *after* spreading the caller's options, so `'error'` reaches us even though the
// public API only offers `toast.danger` — it has to resolve to the danger chrome.
// `loading` has no Figma variant, so its spinner borrows info's border and status
// line. Anything else (including a bare `toast(...)`) falls back to info, the
// Figma's default variant.
const VARIANT_BY_TYPE: Record<string, ToastVariant> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  critical: 'critical',
  danger: 'danger',
  error: 'danger',
  loading: 'info',
};

export interface ToastAction {
  /** The button's label. */
  label: React.ReactNode;
  /** Invoked on click. The toast is not dismissed automatically. */
  onClick?: () => void;
  /**
   * Button style. Defaults to `secondary` for the first action and `ghost` for
   * the rest, matching the Figma's button pairing.
   */
  variant?: 'secondary' | 'ghost';
}

/** Custom per-toast payload carried through the Base UI manager. */
interface ToastData {
  actions?: ToastAction[];
  dismissable?: boolean;
}

// A module-level manager so `toast(...)` works outside React (like Sonner's
// `toast`). `<Toaster />` subscribes this manager to its provider.
//
// Module-level means it is a *per-package-instance* singleton, which matters in a
// micro-frontend host. Two copies of this package — an MFE bundling its own, or
// module federation without `singleton: true` — get two independent managers, and
// then `toast(...)` called through one copy is invisible to the `<Toaster />`
// rendered by the other: the toast is queued and simply never appears. Two
// `<Toaster />`s also both pin to `bottom-4 end-4`, so they overlap in the same
// corner, and `timeout` / `limit` are per-region props that drift independently.
//
// So: share one ui-react instance across MFEs and mount exactly one `<Toaster />`
// for the page (typically in the shell). See apps/docs `shadow-dom.mdx` for the
// MFE integration contract, and use `PortalContainerProvider` when the single
// region has to render inside a shadow root.
const toastManager = ToastPrimitive.createToastManager<ToastData>();

export interface ToastOptions {
  /** Secondary line under the title; clamped to three lines. */
  description?: React.ReactNode;
  /** Auto-dismiss delay in ms; `0` keeps the toast until dismissed. */
  timeout?: number;
  /** Action buttons rendered in a wrapping row under the text. */
  actions?: ToastAction[];
  /**
   * Whether the toast shows its dismiss control and can be swiped away.
   * Defaults to `true`. A non-dismissable toast with `timeout: 0` can only be
   * removed with `toast.dismiss(id)`.
   */
  dismissable?: boolean;
  /** Stable id — re-adding with the same id updates the toast in place. */
  id?: string;
}

function add(title: React.ReactNode, type?: ToastType, options: ToastOptions = {}) {
  const { actions, dismissable, ...rest } = options;
  return toastManager.add({
    title,
    type,
    data: { actions, dismissable },
    ...rest,
  });
}

/**
 * Imperative toast API. `toast(title, options)` shows an info toast;
 * `toast.info` / `success` / `warning` / `critical` / `danger` set the severity
 * and `toast.loading` shows a persistent spinner. `toast.dismiss(id?)` closes one
 * (or all) and `toast.promise` ties a toast to a promise's lifecycle.
 */
const toast = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) => add(title, undefined, options),
  {
    info: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'info', options),
    success: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'success', options),
    warning: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'warning', options),
    critical: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'critical', options),
    danger: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'danger', options),
    loading: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'loading', { timeout: 0, ...options }),
    dismiss: (id?: string) => toastManager.close(id),
    promise: toastManager.promise,
  }
);

function ToastList({ closeAriaLabel }: { closeAriaLabel: string }) {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>();
  return toasts.map((item) => {
    const variant = VARIANT_BY_TYPE[item.type ?? ''] ?? 'info';
    const StatusIcon = STATUS_ICON[variant];
    const actions = item.data?.actions;
    const dismissable = item.data?.dismissable ?? true;
    return (
      <ToastPrimitive.Root
        key={item.id}
        toast={item}
        data-slot="toast"
        data-variant={variant}
        // Base UI enables swipe-to-dismiss by default (`['down', 'right']`), so
        // a non-dismissable toast has to opt out of it too — otherwise hiding
        // the close button would only hide the *control*, not the capability.
        swipeDirection={dismissable ? undefined : []}
        className={cn(
          toastVariants({ variant }),
          'transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          // The stack sits on the inline-end edge, so a toast slides in from the
          // right in LTR and from the left in RTL.
          'data-[ending-style]:translate-x-4 data-[starting-style]:translate-x-4',
          'rtl:data-[ending-style]:-translate-x-4 rtl:data-[starting-style]:-translate-x-4'
        )}
      >
        {/* The icon box's padding (4/8) is what optically aligns the 16px glyph
            with the first line of the title: glyph centre 8 + 8 = 16, title
            centre (the text block's 4px padding) 4 + 12 = 16. */}
        <div
          data-slot="toast-icon"
          className="flex shrink-0 items-start px-[var(--ui-toast-global-icon-padding-x)] py-[var(--ui-toast-global-icon-padding-y)] [&_svg]:size-[var(--ui-toast-global-icon-size)] [&_svg]:shrink-0"
        >
          {item.type === 'loading' ? (
            <Spinner
              size="sm"
              className="size-[var(--ui-toast-global-icon-size)]"
            />
          ) : (
            <StatusIcon size={16} />
          )}
        </div>
        <div
          data-slot="toast-content"
          className="flex min-w-0 flex-1 flex-col items-start gap-[var(--ui-toast-global-content-gap)] px-[var(--ui-toast-global-content-padding-x)] py-[var(--ui-toast-global-content-padding-y)]"
        >
          <div
            data-slot="toast-text"
            className="flex w-full shrink-0 flex-col items-start gap-[var(--ui-toast-global-content-text-container-gap)] px-[var(--ui-toast-global-content-text-container-padding-x)] py-[var(--ui-toast-global-content-text-container-padding-y)] [word-break:break-word]"
          >
            <ToastPrimitive.Title
              data-slot="toast-title"
              // `h5` overrides Base UI's `h2` default to match Alert — a toast
              // is not a page-level heading.
              render={<h5 />}
              className="ui-toast-global-content-text-container-title-text-style mb-0 w-full text-[var(--ui-toast-global-content-text-container-title-color)]"
            />
            {item.description ? (
              <ToastPrimitive.Description
                data-slot="toast-description"
                className="ui-toast-global-content-text-container-description-text-style line-clamp-3 w-full text-[var(--ui-toast-global-content-text-container-description-color)]"
              />
            ) : null}
          </div>
          {actions?.length ? (
            <div
              data-slot="toast-actions"
              className="flex w-full shrink-0 flex-wrap content-start items-start gap-x-[var(--ui-toast-global-content-actions-container-gap-x)] gap-y-[var(--ui-toast-global-content-actions-container-gap-y)] px-[var(--ui-toast-global-content-actions-container-padding-x)] py-[var(--ui-toast-global-content-actions-container-padding-y)]"
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant ?? (index === 0 ? 'secondary' : 'ghost')}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {dismissable ? (
          <ToastPrimitive.Close
            aria-label={closeAriaLabel}
            data-slot="toast-close"
            render={
              <ButtonIcon variant="ghost">
                <TimesIcon />
              </ButtonIcon>
            }
          />
        ) : null}
      </ToastPrimitive.Root>
    );
  });
}

export interface ToasterProps {
  /** Default auto-dismiss delay in ms for toasts that don't set one. */
  timeout?: number;
  /** Max toasts shown at once; the oldest is dropped past the limit. */
  limit?: number;
  /** Accessible name for the toast region. */
  label?: string;
  /** Accessible name for each toast's dismiss control. */
  closeAriaLabel?: string;
  /**
   * Portal container for the toast stack. Pass a shadow-root mount for
   * isolated-style previews (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: ToastPrimitive.Portal.Props['container'];
}

/**
 * The toast region. Render once near the app root; it portals a bottom-end stack
 * and renders every queued toast. Trigger toasts with the `toast` API.
 */
function Toaster({
  timeout,
  limit,
  label = 'Notifications',
  closeAriaLabel = 'Close',
  portalContainer,
}: ToasterProps) {
  const ctxContainer = usePortalContainer();
  const resolvedContainer = portalContainer ?? ctxContainer;

  return (
    <ToastPrimitive.Provider
      toastManager={toastManager}
      timeout={timeout}
      limit={limit}
    >
      <ToastPrimitive.Portal container={resolvedContainer}>
        <ToastPrimitive.Viewport
          aria-label={label}
          className="fixed bottom-4 end-4 z-[100] flex w-[var(--ui-toast-global-container-width-min)] max-w-[calc(100vw-2rem)] flex-col gap-3 outline-none"
        >
          <ToastList closeAriaLabel={closeAriaLabel} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { toast, Toaster, toastVariants };

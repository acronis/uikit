'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleTimesIcon,
  TimesIcon,
  TriangleWarningIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';

// Ported from `@acronis-platform/shadcn-uikit`'s `sonner`
// (packages/ui-legacy/src/components/ui/sonner.tsx), which wrapped the Sonner
// library. Rebuilt on the Base UI toast primitive (the ui-react convention), so
// no Sonner dependency. The contract is preserved: drop a single `<Toaster />`
// at the app root and call the imperative `toast(...)` / `toast.success(...)`
// API from anywhere. No `--ui-toast-*` tier yet, so this design-pending v1 is a
// neutral surface (bg-background + border-border + shadow) with the status
// conveyed by a colored leading icon (`--ui-text-on-status-*`); per-status
// surface tinting is design-pending. Auto-dismiss after `timeout` (default
// 5000ms); `loading` toasts persist until updated or dismissed.

// A module-level manager so `toast(...)` works outside React (like Sonner's
// `toast`). `<Toaster />` subscribes this manager to its provider.
const toastManager = ToastPrimitive.createToastManager();

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface ToastOptions {
  /** Secondary line under the title. */
  description?: React.ReactNode;
  /** Auto-dismiss delay in ms; `0` keeps the toast until dismissed. */
  timeout?: number;
  /** A single inline action button (e.g. Undo). */
  action?: { label: React.ReactNode; onClick?: () => void };
  /** Stable id — re-adding with the same id updates the toast in place. */
  id?: string;
}

function add(title: React.ReactNode, type?: ToastType, options: ToastOptions = {}) {
  const { action, ...rest } = options;
  return toastManager.add({
    title,
    type,
    actionProps: action
      ? { children: action.label, onClick: action.onClick }
      : undefined,
    ...rest,
  });
}

/**
 * Imperative toast API. `toast(title, options)` shows a neutral toast;
 * `toast.success` / `info` / `warning` / `error` / `loading` set the variant.
 * `toast.dismiss(id?)` closes one (or all) and `toast.promise` ties a toast to a
 * promise's lifecycle.
 */
const toast = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) => add(title, undefined, options),
  {
    success: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'success', options),
    info: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'info', options),
    warning: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'warning', options),
    error: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'error', options),
    loading: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'loading', { timeout: 0, ...options }),
    dismiss: (id?: string) => toastManager.close(id),
    promise: toastManager.promise,
  }
);

const ICON_BY_TYPE: Record<ToastType, React.ReactNode> = {
  success: (
    <CircleCheckIcon className="size-4 text-[var(--ui-text-on-status-success)]" />
  ),
  info: (
    <CircleInfoIcon className="size-4 text-[var(--ui-text-on-status-info)]" />
  ),
  warning: (
    <TriangleWarningIcon className="size-4 text-[var(--ui-text-on-status-warning)]" />
  ),
  error: (
    <CircleTimesIcon className="size-4 text-[var(--ui-text-on-status-danger)]" />
  ),
  loading: <Spinner size="sm" className="size-4" />,
};

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map((item) => {
    const icon = ICON_BY_TYPE[item.type as ToastType];
    return (
      <ToastPrimitive.Root
        key={item.id}
        toast={item}
        className={cn(
          'relative flex w-full items-start gap-3 rounded border border-border bg-background p-4 shadow-md',
          'transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          'data-[starting-style]:translate-x-4 data-[ending-style]:translate-x-4'
        )}
      >
        {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastPrimitive.Title className="text-sm font-semibold leading-5 text-foreground" />
          <ToastPrimitive.Description className="text-sm leading-5 text-muted-foreground" />
          {item.actionProps ? (
            <ToastPrimitive.Action className="mt-1 self-start text-sm font-semibold text-secondary hover:underline" />
          ) : null}
        </div>
        <ToastPrimitive.Close
          aria-label="Close"
          className="shrink-0 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-focus-primary)]"
        >
          <TimesIcon className="size-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  });
}

export interface ToasterProps {
  /** Default auto-dismiss delay in ms for toasts that don't set one. */
  timeout?: number;
  /** Max toasts shown at once; the oldest is dropped past the limit. */
  limit?: number;
  /**
   * Portal container for the toast stack. Pass a shadow-root mount for
   * isolated-style previews (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: ToastPrimitive.Portal.Props['container'];
}

/**
 * The toast region. Render once near the app root; it portals a bottom-right
 * stack and renders every queued toast. Trigger toasts with the `toast` API.
 */
function Toaster({ timeout, limit, portalContainer }: ToasterProps) {
  return (
    <ToastPrimitive.Provider
      toastManager={toastManager}
      timeout={timeout}
      limit={limit}
    >
      <ToastPrimitive.Portal container={portalContainer}>
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[384px] max-w-[calc(100vw-2rem)] flex-col gap-3 outline-none">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { toast, Toaster };

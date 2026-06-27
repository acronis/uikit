import * as React from 'react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '../empty';
import { Spinner } from '../spinner';
import {
  Sheet,
  SheetBody,
  SheetCloseButton,
  type SheetContentProps,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

// `SheetDetails` is the preset for the `sheet-detail-panel` usage pattern — the
// "easy path that IS the pattern". It bakes a right-anchored Sheet's header
// (title + close), a body that switches by `contentState`
// (loading → Spinner, empty/error → Empty, else a key/value property list or
// custom children), and an optional footer of actions — so consumers don't
// re-assemble (or hand-roll) the recipe. For anything outside the recipe, compose
// the `Sheet*` parts directly. (React composition of the Vue kit's `Details`.)

export interface SheetDetailsProperty {
  label: React.ReactNode;
  value: React.ReactNode;
}

export type SheetDetailsContentState = 'content' | 'loading' | 'empty' | 'error';

export interface SheetDetailsProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Fires when the sheet opens or closes. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
  /** Panel title (header). Also the accessible name. */
  title: React.ReactNode;
  /** Edge the panel anchors to. Defaults to `right`. */
  side?: SheetContentProps['side'];
  /** Which body view to show. Defaults to `content`. */
  contentState?: SheetDetailsContentState;
  /** Key/value rows rendered as the body in the `content` state (unless `children`). */
  properties?: SheetDetailsProperty[];
  /** Custom body for the `content` state — overrides `properties`. */
  children?: React.ReactNode;
  /** Footer action(s). Omit for no footer. */
  actions?: React.ReactNode;
  /** Optional trigger element (rendered via the Sheet trigger's `render`). */
  trigger?: React.ReactElement;
  /** Empty-state copy (`contentState="empty"`). */
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  /** Error-state copy (`contentState="error"`). */
  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  /** Portal container (shadow-root mount for isolated previews). */
  portalContainer?: SheetContentProps['portalContainer'];
}

function SheetDetailsBody({
  contentState,
  properties,
  children,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
}: Pick<
  SheetDetailsProps,
  | 'contentState'
  | 'properties'
  | 'children'
  | 'emptyTitle'
  | 'emptyDescription'
  | 'errorTitle'
  | 'errorDescription'
>) {
  if (contentState === 'loading') {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (contentState === 'empty' || contentState === 'error') {
    const isError = contentState === 'error';
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>
            {isError
              ? (errorTitle ?? 'Something went wrong')
              : (emptyTitle ?? 'Nothing to show')}
          </EmptyTitle>
          <EmptyDescription>
            {isError
              ? (errorDescription ?? 'The details could not be loaded.')
              : (emptyDescription ?? 'There are no details to display yet.')}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  if (children) return <>{children}</>;
  if (properties?.length) {
    return (
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {properties.map((p, i) => (
          <React.Fragment key={i}>
            <dt className="text-muted-foreground">{p.label}</dt>
            <dd className="font-medium">{p.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    );
  }
  return null;
}

function SheetDetails({
  open,
  defaultOpen,
  onOpenChange,
  title,
  side = 'right',
  contentState = 'content',
  properties,
  children,
  actions,
  trigger,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  portalContainer,
}: SheetDetailsProps) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <SheetTrigger render={trigger} /> : null}
      <SheetContent side={side} portalContainer={portalContainer}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <SheetBody>
          <SheetDetailsBody
            contentState={contentState}
            properties={properties}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            errorTitle={errorTitle}
            errorDescription={errorDescription}
          >
            {children}
          </SheetDetailsBody>
        </SheetBody>
        {actions ? <SheetFooter>{actions}</SheetFooter> : null}
      </SheetContent>
    </Sheet>
  );
}
SheetDetails.displayName = 'SheetDetails';

export { SheetDetails };

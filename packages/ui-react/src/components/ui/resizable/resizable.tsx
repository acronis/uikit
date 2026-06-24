import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

// Resizable panels: a thin wrapper over `react-resizable-panels` (v4: `Group` /
// `Panel` / `Separator`) themed with the next-gen `--ui-resizable-*` token tier,
// following the shadcn composition (`ResizablePanelGroup` / `ResizablePanel` /
// `ResizableHandle`). Base UI has no resizable primitive, so this is the one
// component that wraps a third-party panel library instead.
//
// The handle is the 7px-wide draggable `Separator`. It paints a centered 1px
// divider line (`--ui-resizable-border-width`/`-style`) — `--ui-resizable-border-color-hover`
// at rest, `--ui-resizable-border-color-active` while dragging (`:active`) — and,
// when `withHandle` is set, an always-visible grab-bar pill
// (`--ui-resizable-bar-*`: 7×32, 4px radius) centered over the line. Keyboard
// focus paints a 3px `--ui-focus-primary` ring; the resting cursor is
// `--ui-resizable-cursor` (`ew-resize`). The acronis brand draws hover/active/idle
// in the same blue and deep-sky in the same gray, but each interaction state is
// wired to its own token so a future brand can diverge.
//
// `orientation="vertical"` (panels stacked) flips the layout: the Group goes
// `flex-col`, the Separator becomes a horizontal line (`aria-orientation=horizontal`),
// the cursor becomes `ns-resize`, and the grip pill rotates 90°.

function ResizablePanelGroup({ className, ...props }: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      className={cn('flex h-full w-full aria-[orientation=vertical]:flex-col', className)}
      {...props}
    />
  );
}

function ResizablePanel(props: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel {...props} />;
}

export interface ResizableHandleProps extends ResizablePrimitive.SeparatorProps {
  /** Render the grab-bar pill centered on the handle. */
  withHandle?: boolean;
}

function ResizableHandle({ withHandle, className, ...props }: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        'relative flex w-[var(--ui-resizable-bar-width)] items-center justify-center',
        'cursor-[var(--ui-resizable-cursor)] outline-none',
        // Centered 1px divider line (idle/hover → hover token, drag → active token).
        'after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2',
        'after:w-[var(--ui-resizable-border-width)] after:bg-[var(--ui-resizable-border-color-hover)]',
        'active:after:bg-[var(--ui-resizable-border-color-active)]',
        'focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
        // orientation=horizontal = panels stacked → horizontal divider line.
        'aria-[orientation=horizontal]:h-[var(--ui-resizable-bar-width)] aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-[ns-resize]',
        'aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:inset-y-auto aria-[orientation=horizontal]:after:left-auto aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-[var(--ui-resizable-border-width)] aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0',
        '[&[aria-orientation=horizontal]>div]:rotate-90',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            'z-10 h-[var(--ui-resizable-bar-height)] w-[var(--ui-resizable-bar-width)]',
            'rounded-[var(--ui-resizable-bar-border-radius)] bg-[var(--ui-resizable-bar-color)]'
          )}
        />
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

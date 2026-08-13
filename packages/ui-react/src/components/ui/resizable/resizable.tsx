import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

// Resizable panels: a thin wrapper over `react-resizable-panels` (v4: `Group` /
// `Panel` / `Separator`) themed with the next-gen `--ui-resizable-*` token tier,
// following the shadcn composition (`ResizablePanelGroup` / `ResizablePanel` /
// `ResizableHandle`). Base UI has no resizable primitive, so this is the one
// component that wraps a third-party panel library instead.
//
// The handle is the draggable `Separator` (Figma node 4649:6681): a 9px hit area —
// the 1px divider plus 4px each side — that costs **no layout space**. Negative
// margins cancel its width, so the box overlays the panel boundary rather than
// pushing the panels apart. That keeps the two panels' edges (and their own borders)
// flush, which is what a consumer sees as "the borders touch".
//
// It paints a 1px divider line (`--ui-resizable-border-width`) centered on that
// boundary — `--ui-border-on-surface-border` at rest (idle),
// `--ui-resizable-border-color-hover` on pointer hover,
// `--ui-resizable-border-color-active` while dragging. Keyboard focus paints a 3px
// `--ui-focus-primary` ring; the resting cursor is `--ui-resizable-cursor`
// (`ew-resize`). Each interaction state is wired to its own token so brands can
// diverge.
//
// `orientation="vertical"` (panels stacked) flips the layout: the Group goes
// `flex-col`, the Separator becomes a horizontal line (`aria-orientation=horizontal`),
// and the cursor becomes `ns-resize`.

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

export type ResizableHandleProps = ResizablePrimitive.SeparatorProps;

function ResizableHandle({ className, ...props }: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        // 9px hit area (Figma: 1px divider + 4px each side) that costs **no layout
        // space**: the negative inline margins cancel the width, so the box overlays
        // the panel boundary instead of pushing the panels apart. `z-10` keeps it —
        // and the divider it paints — above the panel backgrounds/borders it overlaps.
        // The margins are asymmetric (-4px start / -5px end) because the 1px line can
        // only sit on one side of the boundary: the box spans 4px before it and 5px
        // after, which is 4px of padding on each side of the line, whole-pixel. Logical
        // (`ms`/`me`), so RTL mirrors it.
        'relative z-10 w-[9px] -ms-1 -me-[5px]',
        'cursor-[var(--ui-resizable-cursor)] outline-none',
        // 1px divider line, absolutely positioned at the center of the hit area —
        // i.e. on the panel boundary (idle → semantic border, hover → hover token,
        // drag → active token).
        // Uses a CSS border (not width+background) so the browser pixel-snaps the line
        // and it doesn't blur across device pixels when the handle lands at a fractional position.
        // The vertical divider is a zero-width box painted by its inline-start
        // (left) border; the horizontal override below swaps to the block-start
        // (top) border. Color is set with `border-color` (all sides) so it
        // applies regardless of which side carries the width.
        // Offset a flat 4px rather than centered with `start-1/2` / auto margins: the
        // box's 8px of leftover space is split 4/4 around the line by construction,
        // and centering an odd-width box would land the line on a half pixel.
        'after:absolute after:inset-y-0 after:start-[4px] after:w-0',
        'after:[border-inline-start-width:var(--ui-resizable-border-width)] after:border-solid after:[border-color:var(--ui-border-on-surface-border)]',
        'hover:after:[border-color:var(--ui-resizable-border-color-hover)]',
        'active:after:[border-color:var(--ui-resizable-border-color-active)]',
        // Focus ring: 3px box-shadow on the line itself so it auto-centers (Figma 4649:6686).
        'focus-visible:after:[box-shadow:0_0_0_3px_var(--ui-focus-primary)] focus-visible:after:[border-color:var(--ui-resizable-border-color-active)]',
        'active:after:shadow-none',
        // orientation=horizontal = panels stacked → horizontal divider line.
        // Draw it with the block-start (top) border and reset the inline-start
        // border used for the vertical line, so the full-width line renders.
        'aria-[orientation=horizontal]:ms-0 aria-[orientation=horizontal]:me-0 aria-[orientation=horizontal]:-mt-1 aria-[orientation=horizontal]:-mb-[5px] aria-[orientation=horizontal]:h-[9px] aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-[ns-resize]',
        'aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:start-auto aria-[orientation=horizontal]:after:inset-y-auto aria-[orientation=horizontal]:after:top-[4px] aria-[orientation=horizontal]:after:h-0 aria-[orientation=horizontal]:after:w-full',
        'aria-[orientation=horizontal]:after:[border-inline-start-width:0] aria-[orientation=horizontal]:after:[border-block-start-width:var(--ui-resizable-border-width)]',
        className
      )}
      {...props}
    />
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

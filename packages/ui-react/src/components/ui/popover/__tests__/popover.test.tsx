import { createRef, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from '../popover';
import { PortalContainerProvider } from '@/lib/portal-container';

const positionerSpy = vi.spyOn(
  PopoverPrimitive.Positioner as unknown as {
    render: (...args: unknown[]) => unknown;
  },
  'render'
);

// The spy is created once at module scope, so its call history accumulates
// across tests unless cleared — otherwise a `toHaveBeenCalledWith` assertion
// can pass on a call made by an earlier test, not the one under test.
beforeEach(() => {
  positionerSpy.mockClear();
});

function DemoPopover(props: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Popover defaultOpen={props.defaultOpen} onOpenChange={props.onOpenChange}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent data-testid="popup">
        <h4>Dimensions</h4>
        <p>Set the dimensions for the layer.</p>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('is closed by default and opens from the trigger', async () => {
    const user = userEvent.setup();
    render(<DemoPopover />);
    expect(screen.queryByText('Dimensions')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });

  it('renders open with defaultOpen', () => {
    render(<DemoPopover defaultOpen />);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });

  it('themes the popup from the --ui-popover-container-* tokens', () => {
    render(<DemoPopover defaultOpen />);
    expect(screen.getByTestId('popup')).toHaveClass(
      'bg-[var(--ui-popover-container-color)]',
      'border-[var(--ui-popover-container-border-color)]',
      'rounded-[var(--ui-popover-container-border-radius)]',
      'min-w-[var(--ui-popover-container-min-width)]',
      'max-w-[var(--ui-popover-container-max-width)]'
    );
  });

  it('renders PopoverBody with the --ui-popover-body-* rhythm tokens', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverBody data-testid="body">Content</PopoverBody>
        </PopoverContent>
      </Popover>
    );
    expect(screen.getByTestId('body')).toHaveClass(
      'gap-[var(--ui-popover-body-gap)]',
      'py-[var(--ui-popover-body-padding-y)]'
    );
  });

  it('renders PopoverFooter with the --ui-footer-* chrome tokens', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverFooter data-testid="footer">
            <button>Cancel</button>
            <button>Apply</button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass(
      'bg-[var(--ui-footer-default-color)]',
      'h-[var(--ui-footer-global-height)]'
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('forwards the ref on PopoverBody and PopoverFooter', () => {
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverBody ref={bodyRef}>Content</PopoverBody>
          <PopoverFooter ref={footerRef} />
        </PopoverContent>
      </Popover>
    );
    expect(bodyRef.current).toBeInstanceOf(HTMLElement);
    expect(footerRef.current).toBeInstanceOf(HTMLElement);
  });

  it('fires onOpenChange and closes on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DemoPopover defaultOpen onOpenChange={onOpenChange} />);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>content</PopoverContent>
      </Popover>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

// Regression coverage for PLTFRM-92756: a Popover portaled into a constrained
// PortalContainerProvider container (the MFE/Shadow DOM pattern) was clipped
// at the container's own edge instead of the viewport. Base UI's default
// 'absolute' positioning shares its portal container's containing block, so
// switching only the collision math isn't enough — the positioner must also
// switch to 'fixed' so it escapes an overflow-constrained container.
describe('Popover positioning inside a constrained portal container', () => {
  it('uses absolute positioning and no explicit collision boundary by default', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent data-testid="popup">content</PopoverContent>
      </Popover>
    );
    const positioner = screen.getByTestId('popup').parentElement;
    expect(positioner).toHaveStyle({ position: 'absolute' });
    expect(positionerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ collisionBoundary: undefined }),
      null
    );
  });

  it('switches to fixed positioning when a PortalContainerProvider container is resolved', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <PortalContainerProvider container={container}>
        <Popover defaultOpen>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent data-testid="popup">content</PopoverContent>
        </Popover>
      </PortalContainerProvider>
    );

    const positioner = screen.getByTestId('popup').parentElement;
    expect(positioner).toHaveStyle({ position: 'fixed' });
    // The collision boundary is left at the platform default (undefined
    // here) — it's the 'fixed' positioning above that keeps collision
    // detection resolved against the real viewport instead of the
    // container's edge, not an explicit collisionBoundary override.
    expect(positionerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ collisionBoundary: undefined }),
      null
    );

    document.body.removeChild(container);
  });

  it('keeps the platform default when portalContainer is a ref whose current is null', () => {
    const containerRef = createRef<HTMLDivElement>();

    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent data-testid="popup" portalContainer={containerRef}>
          content
        </PopoverContent>
      </Popover>
    );

    // A ref object is always truthy, but `current === null` means Base UI
    // itself falls back to `document.body` — the container defaults must not
    // fire for a case with no resolved container at all.
    const positioner = screen.getByTestId('popup').parentElement;
    expect(positioner).toHaveStyle({ position: 'absolute' });
  });

  it('switches to fixed positioning when portalContainer is a ref attached in the same commit', () => {
    // Regression coverage: the ref's target mounts in the same commit as the
    // Popover, so `current` is null during render and only populated once
    // React attaches refs during that commit — before the container
    // resolution's layout effect runs, but after render. A resolution that
    // ran inline during render (instead of in a layout effect) would still
    // see `current: null` here and wrongly default to 'absolute'.
    function Wrapper() {
      const containerRef = useRef<HTMLDivElement>(null);
      return (
        <>
          <div ref={containerRef} />
          <Popover defaultOpen>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent data-testid="popup" portalContainer={containerRef}>
              content
            </PopoverContent>
          </Popover>
        </>
      );
    }

    render(<Wrapper />);

    const positioner = screen.getByTestId('popup').parentElement;
    expect(positioner).toHaveStyle({ position: 'fixed' });
  });

  it('switches to fixed positioning when an explicit portalContainer prop is used', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent data-testid="popup" portalContainer={container}>
          content
        </PopoverContent>
      </Popover>
    );

    const positioner = screen.getByTestId('popup').parentElement;
    expect(positioner).toHaveStyle({ position: 'fixed' });

    document.body.removeChild(container);
  });

  it('lets an explicit positionMethod override the computed default', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <PortalContainerProvider container={container}>
        <Popover defaultOpen>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent data-testid="popup" positionMethod="absolute">
            content
          </PopoverContent>
        </Popover>
      </PortalContainerProvider>
    );

    const positioner = screen.getByTestId('popup').parentElement;
    expect(positioner).toHaveStyle({ position: 'absolute' });

    document.body.removeChild(container);
  });

  it('lets an explicit collisionBoundary override the platform default', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const boundary = document.createElement('div');
    document.body.appendChild(boundary);

    render(
      <PortalContainerProvider container={container}>
        <Popover defaultOpen>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent data-testid="popup" collisionBoundary={boundary}>
            content
          </PopoverContent>
        </Popover>
      </PortalContainerProvider>
    );

    expect(positionerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ collisionBoundary: boundary }),
      null
    );

    document.body.removeChild(container);
    document.body.removeChild(boundary);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import {
  PortalContainerProvider,
  usePortalContainer,
} from '../portal-container';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  DialogRoot,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ── Hook behavior ───────────────────────────────────────────────────────────

describe('usePortalContainer', () => {
  function Spy() {
    const container = usePortalContainer();
    const label =
      container === undefined
        ? 'undefined'
        : container === null
          ? 'null'
          : 'element';
    return <span data-testid="spy">{label}</span>;
  }

  it('returns undefined when no provider exists', () => {
    render(<Spy />);
    expect(screen.getByTestId('spy').textContent).toBe('undefined');
  });

  it('returns the container passed to PortalContainerProvider', () => {
    const div = document.createElement('div');
    render(
      <PortalContainerProvider container={div}>
        <Spy />
      </PortalContainerProvider>
    );
    expect(screen.getByTestId('spy').textContent).toBe('element');
  });

  it('passes a null container through unchanged', () => {
    render(
      <PortalContainerProvider container={null}>
        <Spy />
      </PortalContainerProvider>
    );
    // The hook is a plain pass-through: null reaches the component as null.
    // What that does to an actual portal is asserted below — it is NOT a
    // fallback to document.body.
    expect(screen.getByTestId('spy').textContent).toBe('null');
  });
});

// ── Integration: portals render into custom container ───────────────────────

describe('PortalContainerProvider integration', () => {
  it('Popover renders into the provided container', async () => {
    const user = userEvent.setup();
    const container = document.createElement('div');
    container.setAttribute('data-testid', 'portal-target');
    document.body.appendChild(container);

    render(
      <PortalContainerProvider container={container}>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover inside</PopoverContent>
        </Popover>
      </PortalContainerProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(container.textContent).toContain('Popover inside');
    document.body.removeChild(container);
  });

  it('explicit portalContainer prop overrides context', async () => {
    const user = userEvent.setup();
    const contextContainer = document.createElement('div');
    contextContainer.setAttribute('data-testid', 'ctx-target');
    document.body.appendChild(contextContainer);

    const propContainer = document.createElement('div');
    propContainer.setAttribute('data-testid', 'prop-target');
    document.body.appendChild(propContainer);

    render(
      <PortalContainerProvider container={contextContainer}>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent portalContainer={propContainer}>
            Prop wins
          </PopoverContent>
        </Popover>
      </PortalContainerProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(propContainer.textContent).toContain('Prop wins');
    expect(contextContainer.textContent).not.toContain('Prop wins');

    document.body.removeChild(contextContainer);
    document.body.removeChild(propContainer);
  });

  it('Dialog renders into the provided container', async () => {
    const user = userEvent.setup();
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <PortalContainerProvider container={container}>
        <DialogRoot>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog inside</DialogContent>
        </DialogRoot>
      </PortalContainerProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(container.textContent).toContain('Dialog inside');
    document.body.removeChild(container);
  });

  it('DropdownMenu renders into the provided container', async () => {
    const user = userEvent.setup();
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <PortalContainerProvider container={container}>
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PortalContainerProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(container.textContent).toContain('Item 1');
    document.body.removeChild(container);
  });

  it('Tooltip renders into the provided container', async () => {
    const user = userEvent.setup();
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <PortalContainerProvider container={container}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PortalContainerProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    // Tooltip may have a delay; check after hovering
    // Use findByText for async appearance
    await screen.findByText('Tip text');
    expect(container.textContent).toContain('Tip text');
    document.body.removeChild(container);
  });
});

// ── A null container is not a fallback ──────────────────────────────────────

describe('null container', () => {
  // A null container renders NO popup — it does not fall back to
  // document.body. This is why the container must be held in state: a plain
  // `useRef` leaves the provider with the `null` it saw on the first render,
  // and the overlay then silently never opens. See the Shadow DOM guide.
  it('renders no popup at all', async () => {
    const user = userEvent.setup();

    render(
      <PortalContainerProvider container={null}>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popup content</PopoverContent>
        </Popover>
      </PortalContainerProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.queryByText('Popup content')).toBeNull();
    expect(document.body.textContent).not.toContain('Popup content');
  });

  it('renders the popup once the container arrives via state', async () => {
    const user = userEvent.setup();

    // The documented pattern: a callback ref that is the state setter, so the
    // provider re-renders with the real element.
    function App() {
      const [mount, setMount] = useState<HTMLElement | null>(null);
      return (
        <div ref={setMount} data-testid="mount">
          <PortalContainerProvider container={mount}>
            <Popover>
              <PopoverTrigger>Open</PopoverTrigger>
              <PopoverContent>Popup content</PopoverContent>
            </Popover>
          </PortalContainerProvider>
        </div>
      );
    }

    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(
      screen.getByTestId('mount').contains(screen.getByText('Popup content'))
    ).toBe(true);
  });
});

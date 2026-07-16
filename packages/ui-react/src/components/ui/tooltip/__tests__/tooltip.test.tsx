import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

function Example(props: React.ComponentProps<typeof Tooltip>) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>Helpful hint</TooltipContent>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('renders the trigger', () => {
    render(<Example />);
    expect(
      screen.getByRole('button', { name: 'Hover me' })
    ).toBeInTheDocument();
  });

  it('keeps the tooltip hidden until triggered', () => {
    render(<Example />);
    expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
  });

  it('shows the content when open', () => {
    render(<Example defaultOpen />);
    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  it('applies the --ui-tooltip-* tokens to the popup', () => {
    render(<Example defaultOpen />);
    expect(screen.getByText('Helpful hint')).toHaveClass(
      'bg-[var(--ui-tooltip-container-color)]',
      'text-[var(--ui-tooltip-label-color)]'
    );
  });

  it('opens on pointer hover', async () => {
    render(
      <TooltipProvider delay={0}>
        <Example />
      </TooltipProvider>
    );
    await userEvent.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(await screen.findByText('Helpful hint')).toBeInTheDocument();
  });

  it('supports delay from TooltipProvider', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delay={50}>
        <Example />
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();

    expect(await screen.findByText('Helpful hint')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const { rerender } = render(<Example open={false} />);
    expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();

    rerender(<Example open />);
    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  it('opens on keyboard focus', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delay={0}>
        <Example />
      </TooltipProvider>
    );

    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Hover me' });
    expect(trigger).toHaveFocus();

    expect(await screen.findByText('Helpful hint')).toBeInTheDocument();
  });

  it('renders into a custom portal container', () => {
    const portalContainer = document.createElement('div');
    document.body.appendChild(portalContainer);

    render(
      <Tooltip defaultOpen>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent portalContainer={portalContainer}>
          Helpful hint
        </TooltipContent>
      </Tooltip>
    );

    expect(portalContainer).toContainElement(screen.getByText('Helpful hint'));
    portalContainer.remove();
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tooltip defaultOpen>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent ref={ref}>Helpful hint</TooltipContent>
      </Tooltip>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('TooltipProvider defaults delay to 300ms', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Example />
      </TooltipProvider>
    );
    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
    expect(await screen.findByText('Helpful hint')).toBeInTheDocument();
  });

  it('positions against a custom anchor instead of the trigger', () => {
    function AnchorExample() {
      const anchorRef = createRef<HTMLDivElement>();
      return (
        <>
          <div ref={anchorRef} data-testid="anchor" />
          <Tooltip defaultOpen>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent anchor={anchorRef}>Helpful hint</TooltipContent>
          </Tooltip>
        </>
      );
    }
    render(<AnchorExample />);
    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  it('TooltipProvider delay can be overridden', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delay={0}>
        <Example />
      </TooltipProvider>
    );
    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(await screen.findByText('Helpful hint')).toBeInTheDocument();
  });
});

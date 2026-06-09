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
      'bg-[var(--ui-tooltip-background)]',
      'text-[var(--ui-tooltip-label)]'
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
});

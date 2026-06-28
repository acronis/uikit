import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScrollArea, ScrollBar } from '../scroll-area';

describe('ScrollArea', () => {
  it('renders its children inside the content', () => {
    render(<ScrollArea>scrollable body</ScrollArea>);
    expect(screen.getByText('scrollable body')).toBeInTheDocument();
  });

  it('exposes the structural parts via data-slot', () => {
    const { container } = render(<ScrollArea>body</ScrollArea>);
    expect(container.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="scroll-area-viewport"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="scroll-area-content"]')
    ).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref}>body</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'scroll-area');
  });

  it('merges a custom className onto the root', () => {
    const { container } = render(<ScrollArea className="h-40">body</ScrollArea>);
    expect(container.querySelector('[data-slot="scroll-area"]')).toHaveClass('h-40');
  });

  it.each(['vertical', 'horizontal', 'both'] as const)(
    'renders for orientation=%s without crashing',
    (orientation) => {
      const { container } = render(
        <ScrollArea orientation={orientation}>body</ScrollArea>
      );
      expect(container.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
    }
  );

  it('renders a standalone ScrollBar with the requested orientation', () => {
    const { container } = render(
      <ScrollArea orientation="vertical">
        body
        <ScrollBar orientation="horizontal" keepMounted />
      </ScrollArea>
    );
    expect(
      container.querySelector('[data-slot="scroll-area-scrollbar"]')
    ).toBeInTheDocument();
  });
});

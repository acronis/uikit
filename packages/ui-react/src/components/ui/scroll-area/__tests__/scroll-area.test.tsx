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

  it('forwards viewportRef to the viewport element', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ScrollArea viewportRef={ref}>body</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(container.querySelector('[data-slot="scroll-area-viewport"]'));
  });

  it('forwards viewportProps onto the viewport element', () => {
    const { container } = render(
      <ScrollArea viewportProps={{ 'data-testid': 'vp', tabIndex: 0 }}>body</ScrollArea>
    );
    const viewport = container.querySelector('[data-slot="scroll-area-viewport"]');
    expect(viewport).toHaveAttribute('data-testid', 'vp');
    expect(viewport).toHaveAttribute('tabindex', '0');
  });

  it('applies isolate class on the root', () => {
    const { container } = render(<ScrollArea>body</ScrollArea>);
    expect(container.querySelector('[data-slot="scroll-area"]')).toHaveClass('isolate');
  });

  it('positions the scrollbar above sticky content with z-[60]', () => {
    const { container } = render(<ScrollArea>body</ScrollArea>);
    const scrollbar = container.querySelector('[data-slot="scroll-area-scrollbar"]');
    expect(scrollbar).toHaveClass('z-[60]');
  });
});

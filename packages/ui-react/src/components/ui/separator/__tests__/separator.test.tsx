import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from '../separator';

describe('Separator', () => {
  it('renders with the separator role and the divider token', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('bg-border', 'h-px', 'w-full');
  });

  it('switches dimensions for the vertical orientation', () => {
    render(<Separator data-testid="sep" orientation="vertical" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('h-full', 'w-px');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('merges a custom className', () => {
    render(<Separator data-testid="sep" className="my-4" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('my-4', 'bg-border');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

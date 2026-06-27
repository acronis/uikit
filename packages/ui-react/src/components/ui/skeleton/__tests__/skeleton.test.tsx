import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from '../index';

describe('Skeleton', () => {
  it('renders a pulsing placeholder on a visible surface', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.className).toContain('animate-pulse');
    expect(el.className).toContain('bg-[var(--ui-background-surface-active)]');
  });

  it('merges a custom className for shape/size', () => {
    render(<Skeleton data-testid="sk" className="h-12 w-12 rounded-full" />);
    expect(screen.getByTestId('sk').className).toContain('rounded-full');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

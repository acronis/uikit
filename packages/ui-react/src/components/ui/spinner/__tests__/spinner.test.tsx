import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from '../spinner';

describe('Spinner', () => {
  it('renders a status role with an accessible label and spins', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('animate-spin');
    expect(screen.getByText('Loading…')).toHaveClass('sr-only');
  });

  it('defaults to md size and the brand color', () => {
    render(<Spinner data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveClass('size-6', 'text-secondary');
  });

  it('applies the size variant', () => {
    render(<Spinner data-testid="s" size="xl" />);
    expect(screen.getByTestId('s')).toHaveClass('size-12');
  });

  it('lets the color be overridden via className', () => {
    render(<Spinner data-testid="s" className="text-muted-foreground" />);
    expect(screen.getByTestId('s')).toHaveClass('text-muted-foreground');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

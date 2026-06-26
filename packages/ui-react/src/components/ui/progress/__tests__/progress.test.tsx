import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from '../progress';

describe('Progress', () => {
  it('exposes the progressbar role with the current value', () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('is indeterminate when value is null', () => {
    render(<Progress value={null} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-indeterminate');
  });

  it('clamps semantics through the max prop', () => {
    render(<Progress value={5} max={10} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemax',
      '10'
    );
  });

  it('merges a custom className on the root', () => {
    render(<Progress value={50} className="h-4" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-4');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={50} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

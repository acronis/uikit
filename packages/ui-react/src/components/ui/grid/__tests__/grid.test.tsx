import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Grid } from '../index';

describe('Grid', () => {
  it('defaults to a responsive 3-column grid with md gap', () => {
    render(<Grid data-testid="g">x</Grid>);
    const c = screen.getByTestId('g').className;
    expect(c).toContain('grid');
    expect(c).toContain('lg:grid-cols-3');
    expect(c).toContain('gap-4');
  });

  it('applies the cols and gap variants', () => {
    render(<Grid data-testid="g" cols={4} gap="xl">x</Grid>);
    const c = screen.getByTestId('g').className;
    expect(c).toContain('lg:grid-cols-4');
    expect(c).toContain('gap-8');
  });
});

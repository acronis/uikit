import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardGrid, DashboardLayout } from '../index';

describe('DashboardLayout', () => {
  it('renders a vertically spaced region', () => {
    const { container } = render(<DashboardLayout>x</DashboardLayout>);
    expect(container.querySelector('[data-slot="dashboard-layout"]')!.className).toContain(
      'space-y-6'
    );
  });

  it('DashboardGrid defaults to a responsive 3-column grid', () => {
    render(<DashboardGrid data-testid="g">x</DashboardGrid>);
    const c = screen.getByTestId('g').className;
    expect(c).toContain('grid');
    expect(c).toContain('lg:grid-cols-3');
  });

  it('DashboardGrid applies the cols variant', () => {
    render(<DashboardGrid data-testid="g" cols={4}>x</DashboardGrid>);
    expect(screen.getByTestId('g').className).toContain('lg:grid-cols-4');
  });
});

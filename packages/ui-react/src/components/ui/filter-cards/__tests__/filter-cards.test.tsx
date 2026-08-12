import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CardFilter } from '../../card-filter/card-filter';
import { FilterCards } from '../filter-cards';

describe('FilterCards', () => {
  it('renders CardFilter children in a row', () => {
    render(
      <FilterCards>
        <CardFilter label="Total assets" value="125" />
        <CardFilter label="Active filters" value="3" />
      </FilterCards>
    );
    expect(screen.getByText('Total assets')).toBeInTheDocument();
    expect(screen.getByText('Active filters')).toBeInTheDocument();
  });

  it('applies the inter-card gap and equal-width layout classes', () => {
    render(
      <FilterCards data-testid="filter-cards">
        <CardFilter label="Total assets" value="125" />
      </FilterCards>
    );
    expect(screen.getByTestId('filter-cards')).toHaveClass(
      'flex',
      'items-stretch',
      'gap-[var(--ui-gap-16)]',
      '[&>*]:flex-1'
    );
  });

  it('merges a custom className with the base classes', () => {
    render(<FilterCards className="custom-class" data-testid="filter-cards" />);
    expect(screen.getByTestId('filter-cards')).toHaveClass('custom-class', 'flex');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FilterCards ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <FilterCards data-testid="filter-cards" render={<section />} />
    );
    const el = screen.getByTestId('filter-cards');
    expect(el.tagName).toBe('SECTION');
  });
});

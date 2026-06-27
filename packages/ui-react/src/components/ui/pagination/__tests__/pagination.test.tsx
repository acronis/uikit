import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../index';

function Basic() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

describe('Pagination', () => {
  it('renders a labelled navigation landmark', () => {
    render(<Basic />);
    expect(
      screen.getByRole('navigation', { name: 'pagination' })
    ).toBeInTheDocument();
  });

  it('marks the active page with aria-current', () => {
    render(<Basic />);
    const active = screen.getByRole('link', { name: '2' });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '1' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('labels the previous / next controls', () => {
    render(<Basic />);
    expect(
      screen.getByRole('link', { name: 'Go to previous page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to next page' })
    ).toBeInTheDocument();
  });

  it('announces the ellipsis as "More pages"', () => {
    render(<Basic />);
    expect(screen.getByText('More pages')).toHaveClass('sr-only');
  });
});

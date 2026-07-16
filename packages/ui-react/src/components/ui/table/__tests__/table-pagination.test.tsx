import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TablePagination } from '../table-pagination';

function setup(overrides = {}) {
  const onPageIndexChange = vi.fn();
  const onPageSizeChange = vi.fn();
  render(
    <TablePagination
      pageIndex={2}
      pageCount={5}
      pageSize={10}
      totalRows={48}
      onPageIndexChange={onPageIndexChange}
      onPageSizeChange={onPageSizeChange}
      {...overrides}
    />
  );
  return { onPageIndexChange, onPageSizeChange };
}

describe('TablePagination', () => {
  it('shows the current page and total pages', () => {
    setup();
    expect(screen.getByText('Page 3 of 5')).toBeInTheDocument();
  });

  it('shows "No pages" instead of "Page 1 of 0" when pageCount is 0', () => {
    setup({ pageIndex: 0, pageCount: 0 });
    expect(screen.getByText('No pages')).toBeInTheDocument();
  });

  it('renders the selection summary when selected + total rows are given', () => {
    setup({ selectedRows: 4 });
    expect(screen.getByText('4 of 48 row(s) selected.')).toBeInTheDocument();
  });

  it('goes to the first page', async () => {
    const user = userEvent.setup();
    const { onPageIndexChange } = setup();
    await user.click(screen.getByRole('button', { name: 'Go to first page' }));
    expect(onPageIndexChange).toHaveBeenCalledWith(0);
  });

  it('goes to the previous and next page relative to the current index', async () => {
    const user = userEvent.setup();
    const { onPageIndexChange } = setup();
    await user.click(
      screen.getByRole('button', { name: 'Go to previous page' })
    );
    expect(onPageIndexChange).toHaveBeenCalledWith(1);
    await user.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onPageIndexChange).toHaveBeenCalledWith(3);
  });

  it('goes to the last page', async () => {
    const user = userEvent.setup();
    const { onPageIndexChange } = setup();
    await user.click(screen.getByRole('button', { name: 'Go to last page' }));
    expect(onPageIndexChange).toHaveBeenCalledWith(4);
  });

  it('disables previous controls on the first page', () => {
    setup({ pageIndex: 0 });
    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to previous page' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeEnabled();
  });

  it('disables next controls on the last page', () => {
    setup({ pageIndex: 4 });
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to previous page' })
    ).toBeEnabled();
  });
});

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputSearch } from '../input-search';

describe('InputSearch', () => {
  it('renders a labelled search input associated via htmlFor/id', () => {
    render(<InputSearch label="Find" placeholder="Search table" />);
    const input = screen.getByLabelText('Find');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('placeholder', 'Search table');
  });

  it('appends a required marker and sets aria-required', () => {
    render(<InputSearch label="Find" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    // The `*` is aria-hidden, so the accessible name is still "Find".
    expect(screen.getByRole('searchbox', { name: 'Find' })).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  it('does not shadow the visible label with the Search default aria-label', () => {
    render(<InputSearch label="Find" />);
    // The field is named by the visible label, not "Search".
    expect(screen.getByRole('searchbox', { name: 'Find' })).toBeInTheDocument();
    expect(
      screen.queryByRole('searchbox', { name: 'Search' })
    ).not.toBeInTheDocument();
  });

  it('falls back to the Search default name when unlabelled', () => {
    render(<InputSearch placeholder="Search table" />);
    expect(
      screen.getByRole('searchbox', { name: 'Search' })
    ).toBeInTheDocument();
  });

  it('forwards a caller-supplied aria-label when unlabelled', () => {
    render(<InputSearch aria-label="Find users" />);
    expect(
      screen.getByRole('searchbox', { name: 'Find users' })
    ).toBeInTheDocument();
  });

  it('shows the clear button once there is a value and fires onClear', async () => {
    const onClear = vi.fn();
    render(
      <InputSearch label="Find" defaultValue="Request" onClear={onClear} />
    );
    const clear = screen.getByRole('button', { name: 'Clear search' });
    await userEvent.click(clear);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('does not show the clear button when disabled', () => {
    render(<InputSearch label="Find" defaultValue="Request" disabled />);
    expect(screen.getByLabelText('Find')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument();
  });

  it('forwards the ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputSearch label="Find" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('forwards arbitrary input props', async () => {
    const onChange = vi.fn();
    render(<InputSearch label="Find" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Find'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('uses tokenized label and required-marker colors', () => {
    render(<InputSearch label="Find" required />);
    expect(screen.getByText('Find').closest('label')).toHaveClass(
      'text-[var(--ui-input-search-color-idle)]'
    );
    expect(screen.getByText('*')).toHaveClass('text-[var(--ui-input-search-required-color)]');
  });
});
